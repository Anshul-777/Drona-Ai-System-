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

load_dotenv()

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

# --- Gemini Setup ---
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    frontend_env_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "drona-AI Frontend", ".env.local")
    if os.path.exists(frontend_env_path):
        load_dotenv(frontend_env_path)
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
        conn = get_db()
        session_id = req.session_id
        
        is_force_image = "[FORCE_IMAGE_GENERATION]" in req.message
        clean_message = req.message.replace("[FORCE_IMAGE_GENERATION]", "").strip()
        
        # 1. Ensure Session Exists
        if not session_id:
            session_id = str(uuid.uuid4())
            # Generate a fast title with fallback support
            from app.api.gemini_fallback import get_fallback_title
            title = get_fallback_title(f"Generate a very short, 3 to 5 word title for a chat session that starts with this message: '{clean_message}'. Do not use quotes or markdown.", api_key)
            conn.execute("INSERT INTO sessions (id, title, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)", (session_id, title))
        else:
            conn.execute("UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", (session_id,))
            
        # 2. Fetch history for Gemini context
        cur = conn.execute("SELECT role, content FROM messages WHERE session_id = ? ORDER BY time ASC", (session_id,))
        db_history = cur.fetchall()
        
        formatted_history = []
        for msg in db_history:
            role = "user" if msg["role"] == "user" else "model"
            formatted_history.append({
                "role": role,
                "parts": [msg["content"]]
            })
            
        # 3. Save User Message
        user_msg_id = str(uuid.uuid4())
        current_time = datetime.now().isoformat()
        conn.execute("INSERT INTO messages (id, session_id, role, content, time) VALUES (?, ?, ?, ?, ?)", 
                    (user_msg_id, session_id, "user", clean_message, current_time))
        conn.commit()
        
        # 4. Agentic Slash Command Processing
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
                # Optionally strip the command from the message so Gemini doesn't get confused by the raw syntax
                clean_message = clean_message.replace(f"/{cmd}", "").strip()
                if not clean_message:
                    clean_message = f"Execute your {cmd} skill objective."
                    
            if cmd == "image" or is_force_image:
                active_command = "image"
                hyphenated_prompt = re.sub(r"[^a-zA-Z0-9]+", "-", clean_message).strip("-").lower() or "visualization"
                ai_text = f"Here is the visualization you requested:\n\n![{clean_message}](https://image.pollinations.ai/prompt/{hyphenated_prompt}?width=1024&height=1024&nologo=true)"
                is_force_image = True # Skip normal AI call
                
        if not is_force_image:
            from app.api.gemini_fallback import get_fallback_chat_response
            ai_text = get_fallback_chat_response(dynamic_instruction, formatted_history, clean_message, api_key)
        
        # 5. Save AI Message
        ai_msg_id = str(uuid.uuid4())
        ai_current_time = datetime.now().isoformat()
        conn.execute("INSERT INTO messages (id, session_id, role, content, time) VALUES (?, ?, ?, ?, ?)", 
                    (ai_msg_id, session_id, "drona", ai_text, ai_current_time))
        conn.commit()
        
        # 6. Fetch updated session title if it was new
        cur = conn.execute("SELECT title FROM sessions WHERE id = ?", (session_id,))
        title_row = cur.fetchone()
        title = title_row["title"] if title_row else "New Chat"
        
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
    file: UploadFile = File(...)
):
    """Handles chat requests with an attached file."""
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY is missing from environment")

        conn = get_db()
        clean_message = message.strip()
        
        # 1. Ensure Session
        if not session_id:
            session_id = str(uuid.uuid4())
            from app.api.gemini_fallback import get_fallback_title
            title = get_fallback_title(f"Generate a title for a chat with a file: '{clean_message}'.", api_key)
            conn.execute("INSERT INTO sessions (id, title, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)", (session_id, title))
        else:
            conn.execute("UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", (session_id,))
            
        # 2. Fetch history
        cur = conn.execute("SELECT role, content FROM messages WHERE session_id = ? ORDER BY time ASC", (session_id,))
        rows = cur.fetchall()
        formatted_history = []
        for row in rows:
            formatted_history.append({
                "role": "user" if row[0] == "user" else "model",
                "parts": [row[1]]
            })
            
        # 3. Save User Message
        user_msg_id = str(uuid.uuid4())
        conn.execute(
            "INSERT INTO messages (id, session_id, role, content, time) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
            (user_msg_id, session_id, 'user', clean_message)
        )
        conn.commit()
        
        # 4. Agentic Slash Command Processing for Files
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

        # 5. Save file temporarily
        temp_dir = os.path.join(os.getcwd(), "temp_uploads")
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, file.filename)
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 6. Generate AI Response with File
        from app.api.gemini_fallback import get_fallback_chat_response_with_file
        ai_text = get_fallback_chat_response_with_file(dynamic_instruction, formatted_history, clean_message, api_key, temp_path, file.content_type)
        
        # Cleanup temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        # 6. Save AI Message
        ai_msg_id = str(uuid.uuid4())
        conn.execute(
            "INSERT INTO messages (id, session_id, role, content, time) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
            (ai_msg_id, session_id, 'drona', ai_text)
        )
        conn.commit()
        
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
