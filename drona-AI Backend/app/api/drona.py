from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import google.generativeai as genai
import os
import sqlite3
import json
import uuid
import re
from datetime import datetime
from dotenv import load_dotenv

load_dotenv(override=True)

router = APIRouter()

# --- Database Setup ---
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "drona_memory.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            title TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_archived INTEGER DEFAULT 0,
            is_trashed INTEGER DEFAULT 0
        )
    ''')
    try:
        conn.execute("ALTER TABLE sessions ADD COLUMN is_archived INTEGER DEFAULT 0")
    except:
        pass
    try:
        conn.execute("ALTER TABLE sessions ADD COLUMN is_trashed INTEGER DEFAULT 0")
    except:
        pass
    conn.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            session_id TEXT,
            role TEXT,
            content TEXT,
            time TEXT,
            FOREIGN KEY(session_id) REFERENCES sessions(id)
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# --- Models ---
class ChatMessage(BaseModel):
    role: str
    content: str
    id: Optional[str] = None
    time: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    history: Optional[List[ChatMessage]] = None
    user_id: Optional[str] = None

# --- Gemini Setup ---
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    frontend_env_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "drona-AI Frontend", ".env.local")
    if os.path.exists(frontend_env_path):
        load_dotenv(frontend_env_path, override=True)
        api_key = os.environ.get("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)

# The new, profound system prompt
system_instruction = """You are Drona, the Master Agent and Intelligence OS Core. You are an ultra-advanced educational engine.
CRITICAL OUTPUT RULES:
1. When the user asks a complex question, solves a problem, or requests an explanation, your output MUST resemble a premium, highly structured technical research paper or specialized assessment solver.
2. Use bolding, numbered steps, and bullet points heavily to make complex information immediately scannable. Example format: `### Assumptions`, `1. Core Concept`, `- **Detail:** ...`.
3. If the problem involves any science or math, you MUST wrap all mathematical notation, formulas, variables, and units in proper LaTeX format. Use `$` for inline math (e.g., `$D_{KL}$`) and `$$` for block equations.
4. If the user simply says "hi", "hello", or asks a casual question, DO NOT throw robotic errors (like "Protocol Violation"). Respond naturally, intelligently, and warmly as Drona, but keep it concise and direct.
5. Avoid flowery, long-winded paragraphs. Be profoundly deep, but ruthlessly concise. Maximize information density.
6. AUTONOMOUS IMAGE GENERATION: If you believe a visual representation (diagram, realistic image, concept art) would help the user understand a complex topic, you have the ability to generate images. To generate an image, use this exact markdown syntax: `![Image description](https://image.pollinations.ai/prompt/{HYPHENATED_DESCRIPTION}?width=1024&height=1024&nologo=true)`
CRITICAL: HYPHENATED_DESCRIPTION must replace all spaces with hyphens (-). Do NOT use %20 or raw spaces. Example: a-detailed-illustration-of-a-dc-motor"""

@router.get("/sessions")
async def get_sessions(status: str = "active"):
    conn = get_db()
    if status == "archived":
        cur = conn.execute("SELECT id, title, updated_at FROM sessions WHERE is_archived = 1 AND is_trashed = 0 ORDER BY updated_at DESC")
    elif status == "trashed":
        cur = conn.execute("SELECT id, title, updated_at FROM sessions WHERE is_trashed = 1 ORDER BY updated_at DESC")
    else:
        cur = conn.execute("SELECT id, title, updated_at FROM sessions WHERE is_archived = 0 AND is_trashed = 0 ORDER BY updated_at DESC")
    sessions = [dict(row) for row in cur.fetchall()]
    conn.close()
    return {"sessions": sessions}

class RenameRequest(BaseModel):
    title: str

@router.put("/sessions/{session_id}/rename")
async def rename_session(session_id: str, req: RenameRequest):
    conn = get_db()
    conn.execute("UPDATE sessions SET title = ? WHERE id = ?", (req.title, session_id))
    conn.commit()
    conn.close()
    return {"success": True}

class StatusRequest(BaseModel):
    status: str # "active", "archived", "trashed"

@router.put("/sessions/{session_id}/status")
async def update_session_status(session_id: str, req: StatusRequest):
    conn = get_db()
    if req.status == "archived":
        conn.execute("UPDATE sessions SET is_archived = 1, is_trashed = 0 WHERE id = ?", (session_id,))
    elif req.status == "trashed":
        conn.execute("UPDATE sessions SET is_trashed = 1, is_archived = 0 WHERE id = ?", (session_id,))
    else:
        conn.execute("UPDATE sessions SET is_trashed = 0, is_archived = 0 WHERE id = ?", (session_id,))
    conn.commit()
    conn.close()
    return {"success": True}

@router.get("/sessions/{session_id}")
async def get_session_messages(session_id: str):
    conn = get_db()
    cur = conn.execute("SELECT id, role, content, time FROM messages WHERE session_id = ? ORDER BY time ASC", (session_id,))
    messages = [dict(row) for row in cur.fetchall()]
    conn.close()
    
    # Format time for frontend display
    for msg in messages:
        try:
            dt = datetime.fromisoformat(msg['time'])
            msg['time'] = dt.strftime("%I:%M %p")
        except:
            pass
            
    return {"messages": messages}

@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    conn = get_db()
    conn.execute("DELETE FROM messages WHERE session_id = ?", (session_id,))
    conn.execute("DELETE FROM sessions WHERE id = ?", (session_id,))
    conn.commit()
    conn.close()
    return {"success": True}

def get_skill_instruction(command: str) -> str:
    skill_path = os.path.join(os.path.dirname(__file__), "..", "skills", f"{command}.md")
    if os.path.exists(skill_path):
        with open(skill_path, "r", encoding="utf-8") as f:
            return f.read()
    return ""

@router.post("/chat")
async def chat_with_drona(req: ChatRequest):
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured.")
        
    try:
        session_id = req.session_id or str(uuid.uuid4())
        
        is_force_image = "[FORCE_IMAGE_GENERATION]" in req.message
        clean_message = req.message.replace("[FORCE_IMAGE_GENERATION]", "").strip()
        
        # 1. Fetch history for Gemini context
        formatted_history = []
        if req.history is not None:
            # Use frontend-provided history (Stateless mode)
            for msg in req.history:
                role = "user" if msg.role == "user" else "model"
                formatted_history.append({
                    "role": role,
                    "parts": [msg.content]
                })
        else:
            # Fallback to SQLite (Legacy mode)
            conn = get_db()
            cur = conn.execute("SELECT role, content FROM messages WHERE session_id = ? ORDER BY time ASC", (session_id,))
            db_history = cur.fetchall()
            for msg in db_history:
                role = "user" if msg["role"] == "user" else "model"
                formatted_history.append({
                    "role": role,
                    "parts": [msg["content"]]
                })
            conn.close()
            
        # 2. Agentic Slash Command Processing
        active_command = None
        dynamic_instruction = system_instruction
        
        # Check if message starts with a slash command
        match = re.match(r"^/([a-zA-Z]+)", clean_message)
        if match:
            cmd = match.group(1).lower()
            skill_text = get_skill_instruction(cmd)
            if skill_text:
                active_command = cmd
                dynamic_instruction = system_instruction + "\n\n[AGENT OVERRIDE RULE ACTIVATED]\n" + skill_text
                # Optionally strip the command from the message
                clean_message = clean_message.replace(f"/{cmd}", "").strip()
                if not clean_message:
                    clean_message = f"Execute your {cmd} skill objective."
                    
            if cmd == "image":
                active_command = "image"
                hyphenated_prompt = re.sub(r"[^a-zA-Z0-9]+", "-", clean_message).strip("-").lower() or "visualization"
                ai_text = f"Here is the visualization you requested:\n\n![{clean_message}](https://image.pollinations.ai/prompt/{hyphenated_prompt}?width=1024&height=1024&nologo=true)"
                is_force_image = True # Skip normal AI call

        if is_force_image and active_command != "image":
            # Handles the case where [FORCE_IMAGE_GENERATION] was used but no slash command was present
            active_command = "image"
            hyphenated_prompt = re.sub(r"[^a-zA-Z0-9]+", "-", clean_message).strip("-").lower() or "visualization"
            ai_text = f"Here is the visualization you requested:\n\n![{clean_message}](https://image.pollinations.ai/prompt/{hyphenated_prompt}?width=1024&height=1024&nologo=true)"
                
        if not is_force_image:
            from app.api.gemini_fallback import get_fallback_chat_response
            ai_text = get_fallback_chat_response(dynamic_instruction, formatted_history, clean_message, api_key)
        
        # 3. Generate title if it's a new session without a title yet
        title = None
        if not req.history or len(req.history) == 0:
            from app.api.gemini_fallback import get_fallback_title
            title = get_fallback_title(f"Generate a very short, 3 to 5 word title for a chat session that starts with this message: '{clean_message}'. Do not use quotes or markdown.", api_key)
            
        # 4. Save to legacy SQLite (only if no history was passed, meaning we are in legacy mode)
        ai_msg_id = str(uuid.uuid4())
        if req.history is None:
            conn = get_db()
            current_time = datetime.now().isoformat()
            
            # Ensure Session Exists
            cur = conn.execute("SELECT id FROM sessions WHERE id = ?", (session_id,))
            if not cur.fetchone():
                conn.execute("INSERT INTO sessions (id, title, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)", (session_id, title or "New Chat"))
            else:
                conn.execute("UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", (session_id,))
                
            conn.execute("INSERT INTO messages (id, session_id, role, content, time) VALUES (?, ?, ?, ?, ?)", 
                        (str(uuid.uuid4()), session_id, "user", clean_message, current_time))
                        
            conn.execute("INSERT INTO messages (id, session_id, role, content, time) VALUES (?, ?, ?, ?, ?)", 
                        (ai_msg_id, session_id, "drona", ai_text, current_time))
            
            # Fetch updated session title
            cur = conn.execute("SELECT title FROM sessions WHERE id = ?", (session_id,))
            title_row = cur.fetchone()
            title = title_row["title"] if title_row else "New Chat"
            
            conn.commit()
            conn.close()
        
        return {
            "success": True,
            "session_id": session_id,
            "title": title,
            "response": ai_text,
            "message_id": ai_msg_id,
            "command": active_command
        }
        
    except Exception as e:
        print(f"Error in Drona chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import UploadFile, File, Form
import shutil
import os

@router.post("/chat/file")
async def chat_with_file_api(
    message: str = Form(...),
    session_id: str = Form(None),
    history: str = Form(None),
    file: UploadFile = File(...)
):
    """Handles chat requests with an attached file."""
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY is missing from environment")

        clean_message = message.strip()
        session_id = session_id or str(uuid.uuid4())
        
        # 1. Fetch history
        formatted_history = []
        if history:
            import json
            parsed_history = json.loads(history)
            for msg in parsed_history:
                role = "user" if msg.get("role") == "user" else "model"
                formatted_history.append({
                    "role": role,
                    "parts": [msg.get("content")]
                })
        else:
            conn = get_db()
            cur = conn.execute("SELECT role, content FROM messages WHERE session_id = ? ORDER BY time ASC", (session_id,))
            rows = cur.fetchall()
            for row in rows:
                formatted_history.append({
                    "role": "user" if row[0] == "user" else "model",
                    "parts": [row[1]]
                })
            conn.close()
            
        # 2. Agentic Slash Command Processing for Files
        active_command = None
        dynamic_instruction = system_instruction
        
        match = re.match(r"^/([a-zA-Z]+)", clean_message)
        if match:
            cmd = match.group(1).lower()
            skill_text = get_skill_instruction(cmd)
            if skill_text:
                active_command = cmd
                dynamic_instruction = system_instruction + "\n\n[AGENT OVERRIDE RULE ACTIVATED]\n" + skill_text
                clean_message = clean_message.replace(f"/{cmd}", "").strip()
                if not clean_message:
                    clean_message = f"Execute your {cmd} skill objective on this file."

        # 3. Save file temporarily
        temp_dir = os.path.join(os.getcwd(), "temp_uploads")
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, file.filename)
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 4. Generate AI Response with File
        from app.api.gemini_fallback import get_fallback_chat_response_with_file
        ai_text = get_fallback_chat_response_with_file(dynamic_instruction, formatted_history, clean_message, api_key, temp_path, file.content_type)
        
        # Cleanup temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        # 5. Generate Title if new session
        title = None
        if not history or history == "[]":
            from app.api.gemini_fallback import get_fallback_title
            title = get_fallback_title(f"Generate a title for a chat with a file: '{clean_message}'.", api_key)

        # 6. Save to Legacy DB if no history provided
        ai_msg_id = str(uuid.uuid4())
        if not history:
            conn = get_db()
            cur = conn.execute("SELECT id FROM sessions WHERE id = ?", (session_id,))
            if not cur.fetchone():
                conn.execute("INSERT INTO sessions (id, title, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)", (session_id, title or "New Chat"))
            else:
                conn.execute("UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", (session_id,))
                
            conn.execute(
                "INSERT INTO messages (id, session_id, role, content, time) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
                (str(uuid.uuid4()), session_id, 'user', clean_message)
            )
            conn.execute(
                "INSERT INTO messages (id, session_id, role, content, time) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
                (ai_msg_id, session_id, 'drona', ai_text)
            )
            conn.commit()
            conn.close()
        
        return {
            "success": True,
            "session_id": session_id,
            "message_id": ai_msg_id,
            "response": ai_text,
            "command": active_command
        }

    except Exception as e:
        print(f"Error in /chat/file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/quote")
async def get_daily_quote():
    try:
        if not api_key:
            return {"quote": "Precision beats intensity. Focus on deep understanding."}
            
        system_instruction = "You are Drona AI. Generate a single, highly profound, and slightly futuristic motivational sentence for a student's daily dashboard. It should sound like advanced cognitive telemetry advice. Max 20 words. No quotes around it."
        
        from app.api.gemini_fallback import get_fallback_chat_response
        ai_text = get_fallback_chat_response(system_instruction, [], "Generate today's quote.", api_key)
        
        return {"quote": ai_text.strip()}
    except Exception as e:
        return {"quote": "Your cognitive baseline is optimal today. Let's begin the sprint."}

# --- Boss Battles Dynamic Question Generator ---

class BossQuestionRequest(BaseModel):
    boss_id: str
    subject: str
    exam_target: str
    class_level: Optional[str] = None
    board: Optional[str] = None
    question_count: int = 10

def get_static_fallback_boss_questions(boss_id: str, count: int) -> List[Dict[str, Any]]:
    # 10 robust fallback questions per boss with educational diagrams and step-by-step math explanation paths
    physics_fallback = [
        {
            "text": "A block of mass m is placed on a smooth wedge of mass M and inclination $\\theta$. The wedge is placed on a smooth horizontal surface. What horizontal force $F$ must be applied to the wedge (and block, indirectly) such that the block m remains stationary relative to the wedge?", 
            "options": ["$M g \\tan \\theta$", "$(M+m) g \\tan \\theta$", "$m g \\tan \\theta$", "$(M+m) g \\cot \\theta$"], 
            "correctIndex": 1,
            "diagram": "graph TD\n    classDef default fill:#faf9f6,stroke:#c9a84c,stroke-width:1px;\n    Block[\"Block (mass m)\"] -->|mg sin\\theta| Incline[\"Down Incline\"]\n    Force[\"Applied Force F\"] -->|Acceleration a = F/M+m| Wedge[\"Wedge (mass M)\"]\n    Wedge -->|Pseudo Force: ma cos\\theta| Block\n    style Block fill:#fff,stroke:#c9a84c,stroke-width:2px;\n    style Wedge fill:#fff,stroke:#2a5cff,stroke-width:2px;",
            "explanation": "To make the block stationary relative to the wedge, the component of gravity acting down the incline ($mg \\sin \\theta$) must be perfectly balanced by the component of the pseudo-force acting up the incline ($ma \\cos \\theta$).\n\n1. Equating forces: $mg \\sin \\theta = ma \\cos \\theta \\implies a = g \\tan \\theta$.\n2. Total mass of the system: $M_{total} = M + m$.\n3. Required horizontal force: $F = M_{total} \\cdot a = (M + m) g \\tan \\theta$."
        },
        {
            "text": "A solid cylinder and a solid sphere of the same mass and radius roll down the same inclined plane without slipping. Which reaches the bottom first?", 
            "options": ["Solid Cylinder", "Solid Sphere", "Both reach at the same time", "Depends on the angle of inclination"], 
            "correctIndex": 1,
            "diagram": "graph LR\n    classDef default fill:#faf9f6,stroke:#c9a84c,stroke-width:1px;\n    Sphere[\"Solid Sphere: I = 2/5 MR^2\"] -->|Faster Acceleration| Bottom[\"Bottom of Incline\"]\n    Cylinder[\"Solid Cylinder: I = 1/2 MR^2\"] -->|Slower Acceleration| Bottom",
            "explanation": "The acceleration of a rolling body down an incline of angle $\\theta$ is given by: $a = \\frac{g \\sin \\theta}{1 + K^2/R^2}$, where $K$ is the radius of gyration.\n\n- For a Solid Sphere: $I = \\frac{2}{5}MR^2 \\implies \\frac{K^2}{R^2} = 0.4$.\n- For a Solid Cylinder: $I = \\frac{1}{2}MR^2 \\implies \\frac{K^2}{R^2} = 0.5$.\n\nSince the sphere has a smaller ratio of rotational inertia, it experiences a larger linear acceleration and reaches the bottom first."
        },
        {
            "text": "What is the net work done by a conservative force around a closed path in a classical field?", 
            "options": ["Always Positive", "Always Negative", "Exactly Zero", "Infinite"], 
            "correctIndex": 2,
            "explanation": "For any conservative force field (like electrostatic or gravitational), the work done is path-independent and depends only on the starting and ending positions. Therefore, around a closed loop (start and end points are identical), the net work done is mathematically zero: $\\oint \\mathbf{F} \\cdot d\\mathbf{r} = 0$."
        },
        {
            "text": "If the mean orbital distance between the Earth and Sun is halved, the duration of the orbital year will become:", 
            "options": ["1/4 of present year", "1/2 of present year", "$1/(2\\sqrt{2})$ of present year", "1/8 of present year"], 
            "correctIndex": 2,
            "explanation": "According to Kepler's Third Law of Planetary Motion, the square of the orbital period $T$ is proportional to the cube of the mean orbital distance $R$:\n\n$$T^2 \\propto R^3 \\implies T \\propto R^{3/2}$$\n\nIf the distance is halved ($R' = R/2$), the new period $T'$ will be:\n\n$$T' = \\left(\\frac{1}{2}\\right)^{3/2} T = \\frac{1}{2\\sqrt{2}} T$$"
        },
        {
            "text": "A body of mass 2 kg moving with velocity 3 m/s collides head-on elastically with a body of mass 1 kg at rest. What is the velocity of the 1 kg mass after collision?", 
            "options": ["4 m/s", "2 m/s", "3 m/s", "1 m/s"], 
            "correctIndex": 0,
            "explanation": "Using conservation of linear momentum and coefficient of restitution ($e=1$ for elastic collision):\n\n1. Conservation of Momentum: $m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2 \\implies 2(3) + 1(0) = 2 v_1 + 1 v_2 \\implies 2 v_1 + v_2 = 6$.\n2. Elastic Collision relationship: $v_2 - v_1 = u_1 - u_2 = 3 - 0 = 3 \\implies v_2 = v_1 + 3$.\n3. Substituting: $2 v_1 + (v_1 + 3) = 6 \\implies 3 v_1 = 3 \\implies v_1 = 1$ m/s.\n4. Solving for $v_2$: $v_2 = 1 + 3 = 4$ m/s."
        },
        {
            "text": "The potential energy of a particle in a conservative force field is given by $U(x) = \\frac{a}{x^2} - \\frac{b}{x}$. What is the stable equilibrium position of the particle?", 
            "options": ["$a/b$", "$2a/b$", "$b/a$", "$2b/a$"], 
            "correctIndex": 1,
            "explanation": "For equilibrium, the force $F(x) = -\\frac{dU}{dx} = 0$.\n\n1. Differentiating $U(x)$: $\\frac{dU}{dx} = -\\frac{2a}{x^3} + \\frac{b}{x^2}$.\n2. Setting to zero: $-\\frac{2a}{x^3} + \\frac{b}{x^2} = 0 \\implies \\frac{b}{x^2} = \\frac{2a}{x^3} \\implies x = \\frac{2a}{b}$.\n3. To confirm stability, the second derivative $\\frac{d^2U}{dx^2}$ at $x = \\frac{2a}{b}$ must be positive, which represents a potential energy minimum."
        },
        {
            "text": "A particle moves in a circle of radius R with constant angular acceleration $\\alpha$. If its initial angular velocity is zero, after what time does its radial acceleration equal its tangential acceleration?", 
            "options": ["$1/\\alpha$", "$1/\\sqrt{\\alpha}$", "$\\sqrt{\\alpha}$", "$\\alpha$"], 
            "correctIndex": 1,
            "explanation": "1. Tangential acceleration: $a_t = R \\alpha$.\n2. Angular velocity after time $t$: $\\omega = \\alpha t$.\n3. Radial (centripetal) acceleration: $a_r = \\omega^2 R = (\\alpha t)^2 R = \\alpha^2 t^2 R$.\n4. Equating $a_r = a_t \\implies \\alpha^2 t^2 R = R \\alpha \\implies \\alpha t^2 = 1 \\implies t = \\frac{1}{\\sqrt{\\alpha}}$."
        },
        {
            "text": "A satellite is orbiting very close to the earth's surface of radius R. What is its approximate orbital velocity?", 
            "options": ["$\\sqrt{gR}$", "$\\sqrt{2gR}$", "$\\sqrt{g/R}$", "$gR$"], 
            "correctIndex": 0,
            "explanation": "The gravitational force provides the necessary centripetal force for orbital motion:\n\n$$\\frac{G M m}{R^2} = \\frac{m v^2}{R} \\implies v = \\sqrt{\\frac{GM}{R}}$$\n\nSince $g = \\frac{GM}{R^2}$, we can rewrite $\\frac{GM}{R} = gR$. Therefore, the orbital velocity very close to the surface is: $v = \\sqrt{gR}$."
        },
        {
            "text": "The escape velocity of a body from the earth's gravitational field depends on the mass $m$ of the body as:", 
            "options": ["$m^1$", "$m^2$", "$m^0$ (independent)", "$m^{-1}$"], 
            "correctIndex": 2,
            "explanation": "Escape velocity is given by $v_{esc} = \\sqrt{\\frac{2GM}{R}}$, where $M$ is the mass of the planet and $R$ is its radius. It is entirely independent of the mass $m$ of the escaping body, which means it depends on $m^0$."
        },
        {
            "text": "If the linear momentum of a body increases by 20%, what is the approximate percentage increase in its kinetic energy?", 
            "options": ["20%", "40%", "44%", "80%"], 
            "correctIndex": 2,
            "explanation": "Kinetic energy $K$ is related to momentum $p$ by: $K = \\frac{p^2}{2m}$.\n\n1. If momentum increases by 20%, the new momentum $p' = 1.2 p$.\n2. The new kinetic energy $K' = \\frac{(1.2 p)^2}{2m} = 1.44 \\left(\\frac{p^2}{2m}\\right) = 1.44 K$.\n3. The percentage increase is: $\\frac{K' - K}{K} \\times 100 = (1.44 - 1) \\times 100 = 44\\%$."
        }
    ]

    chemistry_fallback = [
        {
            "text": "Which of the following organic compounds will exhibit geometrical (cis/trans) isomerism?", 
            "options": ["1-Butene", "2-Butene", "2-Methylpropene", "Propene"], 
            "correctIndex": 1,
            "diagram": "flowchart TD\n    classDef default fill:#faf9f6,stroke:#c9a84c,stroke-width:1px;\n    Compound[\"2-Butene\"] --> Isomers[\"Cis/Trans Isomers\"]\n    Isomers --> Cis[\"Cis: Methyl groups on SAME side\"]\n    Isomers --> Trans[\"Trans: Methyl groups on OPPOSITE side\"]",
            "explanation": "Geometrical isomerism occurs when there is restricted rotation around a double bond and both carbon atoms of the double bond are attached to two different groups.\n\n- In 2-Butene ($CH_3-CH=CH-CH_3$), each double-bonded carbon is attached to a $-H$ and a $-CH_3$ group. This allows for cis (same side) and trans (opposite side) arrangements."
        },
        {
            "text": "Identify the correct increasing order of acid strength of the following compounds:", 
            "options": ["Phenol < Ethanol < Water", "Ethanol < Water < Phenol", "Water < Ethanol < Phenol", "Phenol < Water < Ethanol"], 
            "correctIndex": 1,
            "explanation": "Acid strength depends on the stability of the conjugate base formed after losing a proton ($H^+$):\n\n1. **Ethanol:** Conjugate base is Ethoxide ($C_2H_5O^-$). The ethyl group releases electrons (+I effect), destabilizing the negative charge, making it the weakest acid (pKa ~16).\n2. **Water:** Conjugate base is Hydroxide ($OH^-$), which is more stable than ethoxide (pKa ~15.7).\n3. **Phenol:** Conjugate base is Phenoxide ($C_6H_5O^-$), which is stabilized by resonance. Thus, phenol is the strongest acid (pKa ~10)."
        },
        {
            "text": "Which of the following molecules behaves primarily as a nucleophile in organic reactions?", 
            "options": ["AlCl3", "BF3", "NH3", "NO2+"], 
            "correctIndex": 2,
            "explanation": "A nucleophile is an electron-rich species that donates electron pairs. Ammonia ($NH_3$) has a lone pair on the nitrogen atom that is ready for donation, making it a nucleophile. On the other hand, $AlCl_3$ and $BF_3$ are electron-deficient Lewis acids (electrophiles), and $NO_2^+$ is a positively charged electrophile."
        },
        {
            "text": "In the reaction of a primary alkyl halide with aqueous KOH, what is the primary mechanism of substitution?", 
            "options": ["SN2", "SN1", "E1", "E2"], 
            "correctIndex": 0,
            "diagram": "flowchart LR\n    classDef default fill:#faf9f6,stroke:#c9a84c,stroke-width:1px;\n    Nucleophile[\"OH- (Nucleophile)\"] -->|Backside Attack| Halide[\"Primary Alkyl Halide\"]\n    Halide -->|Transition State| Product[\"Primary Alcohol + X-\"]",
            "explanation": "Primary alkyl halides have minimal steric hindrance, which heavily favors backside attack by the strong nucleophile ($OH^-$) in a single-step concerted $S_N2$ mechanism. $S_N1$ mechanism is favored by tertiary halides due to carbocation stability."
        },
        {
            "text": "What is the number of asymmetric/chiral carbon atoms present in a standard open-chain D-Glucose molecule?", 
            "options": ["3", "4", "5", "6"], 
            "correctIndex": 1,
            "explanation": "Open-chain D-Glucose is an aldohexose with the structure: $CHO-(CHOH)_4-CH_2OH$.\n\nCarbons 2, 3, 4, and 5 are chiral/asymmetric because each is bonded to four different groups. Carbon 1 ($CHO$) is double bonded to oxygen, and Carbon 6 ($CH_2OH$) has two identical hydrogen atoms, so they are not chiral. Total chiral carbons = 4."
        },
        {
            "text": "Which of the following is the most stable carbocation intermediate?", 
            "options": ["Methyl carbocation", "Ethyl carbocation", "Isopropyl carbocation", "t-Butyl carbocation"], 
            "correctIndex": 3,
            "explanation": "Carbocation stability increases with the number of electron-donating groups attached to the positive carbon, due to hyperconjugation and inductive effects (+I effect):\n\n- Tertiary ($3^\\circ$) carbocation ($t$-Butyl carbocation, with 9 hyperconjugating hydrogens) is more stable than Secondary ($2^\\circ$) (Isopropyl), Primary ($1^\\circ$) (Ethyl), and Methyl carbocations."
        },
        {
            "text": "What is the hybridization state of the carbon atom carrying the positive charge in a carbocation?", 
            "options": ["sp", "sp2", "sp3", "dsp2"], 
            "correctIndex": 1,
            "explanation": "In a carbocation, the carbon atom with the positive charge forms 3 $\\sigma$ bonds and has an empty, unhybridized $p$ orbital. The steric number is 3, which corresponds to $sp^2$ hybridization with a planar geometry."
        },
        {
            "text": "In electrophilic aromatic substitution, which of the following groups acts as a strong deactivating meta-director?", 
            "options": ["-OH", "-CH3", "-NO2", "-Cl"], 
            "correctIndex": 2,
            "explanation": "The Nitro group ($-NO_2$) is a strong electron-withdrawing group via resonance (-M effect) and inductive effects (-I effect). It withdraws electron density heavily from the ortho and para positions of the benzene ring, leaving the meta position relatively more electron-rich, thus directing electrophiles to the meta position."
        },
        {
            "text": "The reaction of acetaldehyde with HCN to form acetaldehyde cyanohydrin is a typical example of:", 
            "options": ["Nucleophilic substitution", "Electrophilic addition", "Nucleophilic addition", "Elimination"], 
            "correctIndex": 2,
            "explanation": "Acetaldehyde has a polar carbonyl group ($C=O$). The nucleophile $CN^-$ attacks the electrophilic carbonyl carbon, followed by protonation of the oxygen. Since the reaction starts with nucleophilic attack across a double bond, it is a nucleophilic addition reaction."
        },
        {
            "text": "What is the major product obtained when propene reacts with dilute sulfuric acid (hydration)?", 
            "options": ["1-Propanol", "2-Propanol", "Propanal", "Acetone"], 
            "correctIndex": 1,
            "diagram": "flowchart LR\n    classDef default fill:#faf9f6,stroke:#c9a84c,stroke-width:1px;\n    Propene[\"Propene: CH3-CH=CH2\"] -->|Acid Hydration| Carbocation[\"2° Carbocation (Stable)\"]\n    Carbocation -->|OH- attack| Product[\"2-Propanol (Major Hydration Product)\"]",
            "explanation": "Acid-catalyzed hydration of propene follows Markovnikov's Rule:\n\n1. Protonation of propene yields the more stable secondary carbocation ($CH_3-CH^+-CH_3$) rather than the primary carbocation.\n2. Attack of water ($H_2O$) on the carbocation followed by deprotonation yields **2-Propanol** as the major product."
        }
    ]

    math_fallback = [
        {
            "text": "Evaluate the definite integral: $\\int_1^e \\ln(x) dx$.", 
            "options": ["e", "1", "e - 1", "0"], 
            "correctIndex": 1,
            "explanation": "Use integration by parts: $\\int u dv = u v - \\int v du$.\n\n1. Let $u = \\ln(x) \\implies du = \\frac{1}{x} dx$.\n2. Let $dv = dx \\implies v = x$.\n3. Integral: $\\int \\ln(x) dx = x \\ln(x) - \\int x \\left(\\frac{1}{x}\\right) dx = x \\ln(x) - x$.\n4. Apply limits from 1 to $e$:\n   $$[e \\ln(e) - e] - [1 \\ln(1) - 1] = [e(1) - e] - [0 - 1] = 0 - (-1) = 1$$"
        },
        {
            "text": "What is the derivative of $x^x$ with respect to $x$?", 
            "options": ["$x \\cdot x^{x-1}$", "$x^x \\ln(x)$", "$x^x(1 + \\ln(x))$", "$x^x(1 - \\ln(x))$"], 
            "correctIndex": 2,
            "explanation": "Let $y = x^x$. Take the natural logarithm of both sides:\n\n1. $\\ln(y) = x \\ln(x)$.\n2. Differentiate implicitly with respect to $x$:\n   $$\\frac{1}{y} \\frac{dy}{dx} = \\frac{d}{dx}[x \\ln(x)] = (1)\\ln(x) + x \\left(\\frac{1}{x}\\right) = \\ln(x) + 1$$ \n3. Solve for $\\frac{dy}{dx}$:\n   $$\\frac{dy}{dx} = y (1 + \\ln(x)) = x^x (1 + \\ln(x))$$"
        },
        {
            "text": "Find the limit of $\\frac{\\sin x}{x}$ as $x$ approaches positive infinity.", 
            "options": ["1", "0", "Does not exist", "Infinity"], 
            "correctIndex": 1,
            "explanation": "Use the Squeeze (Sandwich) Theorem:\n\n1. We know that for all real $x$, $-1 \\leq \\sin x \\leq 1$.\n2. For $x > 0$, divide by $x$: $-\\frac{1}{x} \\leq \\frac{\\sin x}{x} \\leq \\frac{1}{x}$.\n3. Take the limit as $x \\to \\infty$:\n   $$\\lim_{x \\to \\infty} \\left(-\\frac{1}{x}\\right) = 0 \\quad \\text{and} \\quad \\lim_{x \\to \\infty} \\left(\\frac{1}{x}\\right) = 0$$\n4. Therefore, by the Squeeze Theorem, $\\lim_{x \\to \\infty} \\frac{\\sin x}{x} = 0$."
        },
        {
            "text": "Calculate the area of the region bounded by the curve $y = x^2$ and the horizontal line $y = 4$.", 
            "options": ["16/3", "32/3", "8/3", "64/3"], 
            "correctIndex": 1,
            "diagram": "flowchart TD\n    classDef default fill:#faf9f6,stroke:#c9a84c,stroke-width:1px;\n    Top[\"Upper Line: y = 4\"] -->|Area = Integral of 4 - x^2| Bottom[\"Lower Curve: y = x^2\"]\n    Limits[\"Intersection limits: x = -2 to +2\"] --> Top",
            "explanation": "1. Find intersection points: $x^2 = 4 \\implies x = \\pm 2$.\n2. The area is symmetric about the y-axis, bounded above by $y = 4$ and below by $y = x^2$:\n   $$\\text{Area} = \\int_{-2}^{2} (4 - x^2) dx = 2 \\int_{0}^{2} (4 - x^2) dx$$\n3. Integrate:\n   $$2 \\left[ 4x - \\frac{x^3}{3} \\right]_0^2 = 2 \\left( 8 - \\frac{8}{3} \\right) = 2 \\left( \\frac{16}{3} \\right) = \\frac{32}{3}$$"
        },
        {
            "text": "If a real matrix A satisfies orthogonal matrix properties ($A \\cdot A^T = I$), what is the value of the determinant of A?", 
            "options": ["Exactly 0", "Exactly 1", "$\\pm 1$", "$\\pm 2$"], 
            "correctIndex": 2,
            "explanation": "Take the determinant of both sides of the relation $A A^T = I$:\n\n1. $\\det(A A^T) = \\det(I) = 1$.\n2. Since $\\det(AB) = \\det(A)\\det(B)$ and $\\det(A^T) = \\det(A)$:\n   $$\\det(A) \\cdot \\det(A^T) = \\det(A)^2 = 1$$\n3. Taking square roots: $\\det(A) = \\pm 1$."
        },
        {
            "text": "What is the value of the definite integral $\\int_0^{\\pi/2} \\sin^2(x) dx$?", 
            "options": ["$\\pi/2$", "$\\pi/4$", "$\\pi/8$", "$1$"], 
            "correctIndex": 1,
            "explanation": "Use the trigonometric identity $\\sin^2(x) = \\frac{1 - \\cos(2x)}{2}$:\n\n1. Integral: $\\int_0^{\\pi/2} \\frac{1 - \\cos(2x)}{2} dx = \\frac{1}{2} \\left[ x - \\frac{\\sin(2x)}{2} \\right]_0^{\\pi/2}$.\n2. Evaluate at upper limit $\\pi/2$:\n   $$\\frac{1}{2} \\left( \\frac{\\pi}{2} - \\frac{\\sin(\\pi)}{2} \\right) = \\frac{1}{2} \\left( \\frac{\\pi}{2} - 0 \\right) = \\frac{\\pi}{4}$$\n3. Evaluate at lower limit 0: gives 0. Total = $\\pi/4$."
        },
        {
            "text": "What are the order and degree of the differential equation $y'' + (y')^2 + y = 0$?", 
            "options": ["Order 2, Degree 2", "Order 1, Degree 2", "Order 2, Degree 1", "Order 1, Degree 1"], 
            "correctIndex": 2,
            "explanation": "- **Order** is the highest derivative present in the differential equation. Here, the highest derivative is $y''$ (second derivative), so Order = 2.\n- **Degree** is the power of the highest order derivative when the equation is a polynomial in derivatives. Here, $y''$ is raised to the power of 1, so Degree = 1."
        },
        {
            "text": "What is the derivative of $\\sin^{-1}(x)$ with respect to $x$ for $|x| < 1$?", 
            "options": ["$1/\\sqrt{1-x^2}$", "$-1/\\sqrt{1-x^2}$", "$1/(1+x^2)$", "$-1/(1+x^2)$"], 
            "correctIndex": 0,
            "explanation": "Let $y = \\sin^{-1}(x) \\implies \\sin(y) = x$.\n\n1. Differentiate implicitly: $\\cos(y) \\frac{dy}{dx} = 1 \\implies \\frac{dy}{dx} = \\frac{1}{\\cos(y)}$.\n2. Express $\\cos(y)$ in terms of $x$: $\\cos(y) = \\sqrt{1 - \\sin^2(y)} = \\sqrt{1 - x^2}$.\n3. Substituting: $\\frac{dy}{dx} = \\frac{1}{\\sqrt{1 - x^2}}$."
        },
        {
            "text": "If A and B are symmetric matrices of the same order, then the matrix $AB - BA$ is always a:", 
            "options": ["Symmetric matrix", "Skew-symmetric matrix", "Identity matrix", "Zero matrix"], 
            "correctIndex": 1,
            "explanation": "To check properties of the matrix $C = AB - BA$, take its transpose $C^T$:\n\n1. $(AB - BA)^T = (AB)^T - (BA)^T$.\n2. Since $A^T = A$ and $B^T = B$:\n   $$(AB)^T = B^T A^T = BA \\quad \\text{and} \\quad (BA)^T = A^T B^T = AB$$\n3. Substituting: $C^T = BA - AB = -(AB - BA) = -C$.\n4. Since $C^T = -C$, the matrix is skew-symmetric."
        },
        {
            "text": "What is the value of $\\lim_{x \\to 0} \\frac{e^x - 1}{x}$?", 
            "options": ["0", "1", "e", "Limit does not exist"], 
            "correctIndex": 1,
            "explanation": "Using L'Hopital's Rule since the limit is of form $0/0$:\n\n1. Differentiate numerator: $\\frac{d}{dx}[e^x - 1] = e^x$.\n2. Differentiate denominator: $\\frac{d}{dx}[x] = 1$.\n3. Evaluate limit: $\\lim_{x \\to 0} \\frac{e^x}{1} = e^0 = 1$."
        }
    ]

    selected_list = physics_fallback
    if "organic" in boss_id:
        selected_list = chemistry_fallback
    elif "integration" in boss_id:
        selected_list = math_fallback

    # Return sliced list
    return selected_list[:count]

@router.post("/boss/questions")
async def generate_boss_questions(req: BossQuestionRequest):
    if not api_key:
        print("[API Warning] GEMINI_API_KEY is not set. Falling back to static syllabus questions.")
        return {
            "success": True,
            "questions": get_static_fallback_boss_questions(req.boss_id, req.question_count),
            "source": "static_fallback_no_key"
        }
        
    try:
        # Construct dynamic prompt referencing syllabus and topic
        prompt = f"""You are the Drona AI Assessment Engine. Generate exactly {req.question_count} high-quality, conceptual, multiple-choice questions for an academic boss battle.
Subject: {req.subject}
Class/Grade Level: {req.class_level or 'Class 12'}
Board: {req.board or 'CBSE'}
Exam Target: {req.exam_target}
Boss/Topic Theme: {req.boss_id}

Syllabus Scope: Mapped to the actual curriculum of {req.class_level or 'Class 12'} ({req.board or 'CBSE'} syllabus) and tailored to the level of {req.exam_target}.
If the exam target is JEE, questions MUST be at the competitive JEE level (focusing on deep conceptual derivation, variables, and formulas). If it is NEET, align to competitive NEET level.
Theme Constraints: The questions should be themed around the topic represented by {req.boss_id} (e.g. mechanics/vectors for Newton's Ghost, organic reaction mechanisms for Organic Overlord, calculus/integrals/limits for Integration Beast).

CRITICAL RULES:
1. Return ONLY a valid JSON array of objects. Do NOT wrap the JSON in markdown code blocks like ```json ... ```. No conversational introduction or explanation.
2. The JSON schema must strictly be an array of objects matching:
[
  {{
    "text": "The question text. If it contains Physics, Chemistry, or Math concepts, you MUST wrap all mathematical notation, formulas, variables, and units in proper LaTeX format using $ for inline math and $$ for block math equations.",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correctIndex": 0, 1, 2, or 3,
    "diagram": "Optional Mermaid flowchart code or diagram explaining the question setup, force vectors, reaction pathways, or graphs. Double escape any backslashes in math formulas inside the mermaid diagram.",
    "explanation": "Step-by-step mathematical calculation or conceptual chemical mechanism explaining the solution."
  }}
]
3. Provide exactly {req.question_count} items. Ensure the questions are clear, scientifically accurate, and have exactly one correct option.
"""
        from app.api.gemini_fallback import get_fallback_chat_response
        
        # Request questions using the fallback configuration
        raw_response = get_fallback_chat_response(prompt, [], "Generate the questions JSON array now.", api_key)
        
        # Safely parse JSON array
        import re
        cleaned = re.sub(r'^```json\s*', '', raw_response, flags=re.IGNORECASE)
        cleaned = re.sub(r'```\s*$', '', cleaned).strip()
        
        if not cleaned.startswith('['):
            start = cleaned.find('[')
            end = cleaned.rfind(']')
            if start != -1 and end != -1:
                cleaned = cleaned[start:end+1]
                
        parsed_questions = json.loads(cleaned)
        
        if not isinstance(parsed_questions, list):
            raise ValueError("Parsed questions is not a JSON list array")
            
        return {
            "success": True,
            "questions": parsed_questions[:req.question_count],
            "source": "gemini"
        }
    except Exception as e:
        print(f"[API Error] Failed to generate questions via Gemini: {e}. Utilizing offline fallback database.")
        return {
            "success": True,
            "questions": get_static_fallback_boss_questions(req.boss_id, req.question_count),
            "source": "static_fallback",
            "error_info": str(e)
        }
