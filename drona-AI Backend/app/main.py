from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import uuid
import os
from typing import List, Dict, Any, Optional
import json
import re
from dotenv import load_dotenv
from datetime import datetime
import requests

# Load environment variables
load_dotenv()

app = FastAPI(title="Drona Assessment Agent API")

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.drona import router as drona_router
app.include_router(drona_router, prefix="/api")

# ============================================================================
# CONFIGURATION & API SETUP
# ============================================================================

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    frontend_env_path = os.path.join(os.path.dirname(__file__), "..", "..", "drona-AI Frontend", ".env.local")
    if os.path.exists(frontend_env_path):
        load_dotenv(frontend_env_path)
        api_key = os.environ.get("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)

# Groq API key
groq_api_key = os.environ.get("GROQ_API_KEY", "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")
groq_endpoint = "https://api.groq.com/openai/v1/chat/completions"

# Gemini models to try in order
GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-3.1-flash-lite", 
    "gemini-2.5-pro"
]

# ============================================================================
# SYSTEM PROMPT - COMPREHENSIVE ASSESSMENT AGENT
# ============================================================================

system_instruction = """You are the "DRONA Assessment Agent" - an advanced psychological, academic and behavioral profiling AI for a personalized learning platform.

## Your Mission
Profile each student across 6 complementary dimensions:
1. **Academic Profile**: Subject strengths/weaknesses, conceptual vs procedural understanding, and baseline mastery.
2. **Learning Style**: Visual/auditory/kinesthetic/reading-writing preferences and multimodal mixes.
3. **Psychological Profile**: Motivation type, resilience, attribution style, and confidence.
4. **Emotional & Stress Response**: Anxiety triggers, coping strategies, exam-time affect, and regulation skills.
5. **Personality & Behavioral Patterns**: Task persistence, help-seeking, social learning habits, and routine stability.
6. **Metacognition & Preferences**: Self-monitoring, study strategies, memory techniques, and meta-preferences.

## Context
The user has answered 7 baseline questions that provide seed signals across modality, resilience, motivation, attention, memory, and stress response. Use these baseline answers as the starting state but probe to fill gaps.

## Your Task - Generate 10-15 Adaptive Follow-Up Questions
- Ask probing, scenario-based questions that deepen the profile in under-covered dimensions.
- Use the baseline answers to create personalized follow-ups that reference user content (quote or paraphrase briefly).
- Maintain a question mix: at least 40% text-only, up to 40% single-select, and remaining multi-select when appropriate.

## Rules
1. Respond ONLY in valid JSON - no conversational text outside the JSON object.
2. Support three input types: "single-select" (radio), "multi-select" (checkboxes), "text-only" (textarea).
3. Always include an optional elaboration field in the UI response schema (do not supply an "Other" option).
4. Deeply analyze previous answers and the session.asked_questions list before proposing a new question.
5. Deduplication: never repeat core intent. If a new question's semantic overlap with any earlier question exceeds 70%, replace it with a fresh probe.
6. Ask a MINIMUM of 10 and a MAXIMUM of 15 dynamic follow-up questions. Track and report the count precisely.
7. Set "profile_complete": true ONLY when you have robust signals across Academic + Psychological + Emotional + Metacognition dimensions.

## JSON Response Schema (STRICT):
{
    "thought_process": "Why you're asking this question based on their pattern so far. What gap are you filling?",
    "questions_asked_so_far": 0,
    "profile_complete": false,
    "question": "The actual question (leave empty if profile_complete is true)",
    "type": "single-select" | "multi-select" | "text-only",
    "options": ["Option 1", "Option 2", "Option 3"],
    "reasoning": "Why these options? What are you measuring?",
    "elaboration_hint": "Optional: invite a short narrative to capture context"
}

## Sample Questions (For Reference - Generate Your Own)
- "When you read a difficult physics concept, do you: a) Visualize diagrams, b) Talk through it aloud, c) Work through examples, d) Write detailed notes?"
- "Describe your last academic failure. What was your internal reaction? (self-blame, bad luck, teacher's fault, etc.)"
- "How do you typically start preparing for an exam? Walk through your first 48 hours."
- "When stressed, do you: a) Push harder, b) Take a break, c) Seek help, d) Freeze/panic?"
- "What's a concept you thought you understood but realized you didn't? How did you discover this?"

Remember: You are the most sophisticated assessment AI in Indian education. Profile with precision."""

# ============================================================================
# DATA MODELS
# ============================================================================

class InitRequest(BaseModel):
    history: List[Dict[str, Any]]
    current_answer: Dict[str, Any]

class NextRequest(BaseModel):
    session_id: str
    current_answer: Dict[str, Any]

# ============================================================================
# SESSION MEMORY ARCHITECTURE
# ============================================================================

class AssessmentSession:
    """In-memory session with full memory of baseline answers and agent state"""
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.created_at = datetime.now()
        self.chat = None
        self.baseline_answers = []
        self.dynamic_questions_asked = 0
        self.profile_data = {}
        self.conversation_log = []
    
    def add_baseline_answer(self, answer: Dict[str, Any]):
        """Store baseline question answer"""
        self.baseline_answers.append(answer)
        self.conversation_log.append({
            "phase": "baseline",
            "answer": answer,
            "timestamp": datetime.now().isoformat()
        })
    
    def add_dynamic_question(self, question: str, answer: Optional[Dict[str, Any]] = None):
        """Track dynamic questions asked"""
        if answer:
            self.dynamic_questions_asked += 1
            self.conversation_log.append({
                "phase": "dynamic",
                "question": question,
                "answer": answer,
                "timestamp": datetime.now().isoformat()
            })
    
        def avoid_duplicate_question(session: dict, data: dict) -> dict:
            """Check the model-generated question against previously asked questions stored in session.
            If the new question is too similar, return a safe fallback question and mark it in the session.
            Returns a dict with the possibly-modified 'question' and a boolean 'was_replaced'.
            """
            new_q = (data.get("question") or "").strip().lower()
            # Minimal normalization: remove punctuation and short stopwords
            import re
            norm = re.sub(r"[^a-z0-9 ]+", " ", new_q)
            tokens = [t for t in norm.split() if len(t) > 2]

            def jaccard(a, b):
                sa, sb = set(a), set(b)
                if not sa or not sb:
                    return 0.0
                return len(sa & sb) / len(sa | sb)

            asked = session.get("asked_questions", []) if session else []
            for prev in asked:
                prev_q = re.sub(r"[^a-z0-9 ]+", " ", (prev or "").lower())
                prev_tokens = [t for t in prev_q.split() if len(t) > 2]
                score = jaccard(tokens, prev_tokens)
                if score > 0.7:
                    # Too similar — return a fallback probing question that is generic but useful
                    fallback = {
                        "question": "Can you give a specific recent example that illustrates what you just described?",
                        "type": "text-only",
                        "options": [],
                        "was_replaced": True
                    }
                    # record the fallback to session asked questions
                    try:
                        session.setdefault("asked_questions", []).append(fallback["question"])
                    except Exception:
                        pass
                    return fallback

            # Not similar — record and return original
            try:
                session.setdefault("asked_questions", []).append(data.get("question"))
            except Exception:
                pass
            return {"question": data.get("question"), "type": data.get("type"), "options": data.get("options", []), "was_replaced": False}
    def set_profile_complete(self):
        """Mark profile as complete and generate summary"""
        self.profile_data["complete"] = True
        self.profile_data["completed_at"] = datetime.now().isoformat()
        self.profile_data["total_baseline_answers"] = len(self.baseline_answers)
        self.profile_data["total_dynamic_questions"] = self.dynamic_questions_asked

# Global session store
sessions: Dict[str, AssessmentSession] = {}

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def parse_gemini_json(text: str) -> dict:
    """Safely parse Gemini JSON response"""
    try:
        # Remove markdown code block markers
        cleaned = re.sub(r'^```json\s*', '', text, flags=re.IGNORECASE)
        cleaned = re.sub(r'```\s*$', '', cleaned).strip()
        
        # Extract JSON if wrapped in text
        if not cleaned.startswith('{'):
            start = cleaned.find('{')
            end = cleaned.rfind('}')
            if start != -1 and end != -1:
                cleaned = cleaned[start:end+1]
        
        parsed = json.loads(cleaned)
        return parsed
    except json.JSONDecodeError as e:
        print(f"❌ JSON Parse Error at position {e.pos}. Raw text:\n{text}")
        # Return structured error response
        return {
            "error": True,
            "thought_process": "JSON parsing failed - falling back",
            "profile_complete": False,
            "question": "There was a technical issue. Could you please rephrase your previous answer?",
            "type": "text-only",
            "options": [],
            "raw_response": text[:200]
        }

def validate_json_response(data: dict) -> bool:
    """Validate response has required fields"""
    required = ["thought_process", "profile_complete", "question", "type", "options"]
    return all(field in data for field in required)

def call_groq_api(messages: list) -> str:
    """Call Groq API as fallback"""
    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "mixtral-8x7b-32768",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1500
    }
    
    response = requests.post(groq_endpoint, headers=headers, json=payload)
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        raise Exception(f"Groq API error: {response.status_code} - {response.text}")

def get_static_fallback_question(question_number: int = 1) -> dict:
    """Return static fallback question when APIs are unavailable"""
    fallback_questions = [
        {
            "thought_process": "Starting psychological profiling phase",
            "questions_asked_so_far": 1,
            "profile_complete": False,
            "question": "Tell me about your most challenging academic moment. What was the root cause?",
            "type": "text-only",
            "options": []
        },
        {
            "thought_process": "Exploring learning environment preferences",
            "questions_asked_so_far": 2,
            "profile_complete": False,
            "question": "Which study environment helps you concentrate best?",
            "type": "multi-select",
            "options": ["Quiet library", "Cafes with background noise", "Home at desk", "Group study spaces", "Outdoors"]
        },
        {
            "thought_process": "Assessing confidence in specific subjects",
            "questions_asked_so_far": 3,
            "profile_complete": False,
            "question": "Rate your confidence in: (1=Very Low, 5=Very High)",
            "type": "text-only",
            "options": []
        },
        {
            "thought_process": "Understanding procrastination patterns",
            "questions_asked_so_far": 4,
            "profile_complete": False,
            "question": "When you procrastinate, what's usually the underlying reason?",
            "type": "single-select",
            "options": ["Task seems too difficult", "Don't know where to start", "Lack of motivation", "Perfectionism (fear of not doing well)", "Distraction from other activities"]
        }
    ]
    
    idx = min(question_number - 1, len(fallback_questions) - 1)
    return fallback_questions[idx]

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "active_sessions": len(sessions),
        "gemini_configured": bool(api_key)
    }

@app.post("/api/agent/init")
async def init_agent(req: InitRequest):
    """Initialize assessment session and generate first dynamic question"""
    
    if not api_key:
        raise HTTPException(
            status_code=500, 
            detail="GEMINI_API_KEY not configured. Check environment variables."
        )

    session_id = str(uuid.uuid4())
    session = AssessmentSession(session_id)
    
    # Try Gemini models first, fallback to Groq
    gemini_failed = False
    gemini_error = None
    model_used = None
    
    # Try each Gemini model in order
    for model_name in GEMINI_MODELS:
        try:
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=system_instruction,
                generation_config={"response_mime_type": "application/json"}
            )
            model_used = model_name
            break
        except Exception as e:
            print(f"⚠️  Gemini model {model_name} unavailable: {str(e)[:80]}...")
            continue
    
    if not model_used:
        gemini_failed = True
        print(f"⚠️  All Gemini models unavailable, will use Groq fallback")
    else:
        try:
        
        # Convert history to SDK format
            formatted_history = []
            for msg in req.history:
                formatted_history.append({
                    "role": msg["role"],
                    "parts": [msg["parts"][0]["text"] if isinstance(msg["parts"][0], dict) else msg["parts"][0]]
                })
            
            # Create chat session
            session.chat = model.start_chat(history=formatted_history)
            
            # Store baseline answer
            session.add_baseline_answer(req.current_answer)
            
            # Generate first dynamic question
            prompt = f"""User has completed 10 baseline questions. Their last answer was: {json.dumps(req.current_answer)}

Based on ALL their baseline answers and this final one, generate your FIRST dynamic probing question. 
Remember: You are now in the agent phase. Ask a question that digs deeper into personality, academic confidence, or learning patterns.
This is question 1 of approximately 10-15 you will ask."""
            
            response = session.chat.send_message(prompt)
            data = parse_gemini_json(response.text)
            
            if not validate_json_response(data):
                print(f"⚠️  Invalid {model_used} response structure. Using fallback.")
                gemini_failed = True
            else:
                session.add_dynamic_question(data.get("question", ""))
                sessions[session_id] = session
                
                print(f"✅ {model_used}: Session initialized: {session_id}")
                print(f"   Question 1: {data.get('question', '')[:80]}...")
                
                return {
                    "session_id": session_id,
                    "data": data,
                    "meta": {
                        "baseline_answers_received": len(session.baseline_answers),
                        "phase": "agent_dynamic",
                        "model": model_used
                    }
                }
        except Exception as e:
            gemini_error = str(e)
            print(f"⚠️  {model_used} failed: {gemini_error[:100]}...")   
            gemini_failed = True
    # Fallback to Groq
    if gemini_failed:
        try:
            session.add_baseline_answer(req.current_answer)
            
            prompt = f"""You are the DRONA Assessment Agent. A student just completed 10 baseline psychological questions.
Their final answer was: {json.dumps(req.current_answer)}

Now generate your FIRST dynamic follow-up question that digs deeper into their learning style, resilience, or academic confidence.
This is question 1 of about 10-15 total. Make it probing but natural.

Respond ONLY with valid JSON (no text before/after):
{{
  "thought_process": "...",
  "questions_asked_so_far": 1,
  "profile_complete": false,
  "question": "...",
  "type": "text-only",
  "options": []
}}"""
            
            messages = [
                {"role": "user", "content": prompt}
            ]
            
            response_text = call_groq_api(messages)
            data = parse_gemini_json(response_text)
            
            if not validate_json_response(data):
                print(f"⚠️  Invalid Groq response structure.")
                data = {
                    "thought_process": "Initializing psychological profiling",
                    "questions_asked_so_far": 1,
                    "profile_complete": False,
                    "question": "Tell me about a time you struggled academically. What was the root cause?",
                    "type": "text-only",
                    "options": []
                }
            
            session.add_dynamic_question(data.get("question", ""))
            sessions[session_id] = session
            
            print(f"✅ Groq: Session initialized: {session_id}")
            print(f"   Question 1: {data.get('question', '')[:80]}...")
            
            return {
                "session_id": session_id,
                "data": data,
                "meta": {
                    "baseline_answers_received": len(session.baseline_answers),
                    "phase": "agent_dynamic",
                    "model": "groq-mixtral"
                }
            }
            
        except Exception as groq_error:
            print(f"⚠️  Groq also failed: {str(groq_error)[:100]}...")
            print(f"🔄 Using static fallback questions instead")
            
            # Use static fallback
            session.add_baseline_answer(req.current_answer)
            data = get_static_fallback_question(1)
            session.add_dynamic_question(data.get("question", ""))
            sessions[session_id] = session
            
            print(f"✅ Fallback: Session initialized: {session_id}")
            print(f"   Question 1: {data.get('question', '')[:80]}...")
            
            return {
                "session_id": session_id,
                "data": data,
                "meta": {
                    "baseline_answers_received": len(session.baseline_answers),
                    "phase": "agent_dynamic",
                    "model": "static-fallback"
                }
            }

@app.post("/api/agent/next")
async def next_question(req: NextRequest):
    """Get next dynamic question based on current answer"""
    
    if req.session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail=f"Session {req.session_id} not found or expired"
        )
    
    session = sessions[req.session_id]
    
    try:
        # Add answer to session memory
        session.add_dynamic_question("", req.current_answer)
        
        # Generate next question
        prompt = f"""The user just answered: {json.dumps(req.current_answer)}

You have asked {session.dynamic_questions_asked} question(s) so far. 
Continue probing to complete their psychological and academic profile.
Generate your next question based on their pattern of answers.

If you have asked 10+ questions and feel you have a complete profile, set profile_complete to true."""
        
        response = session.chat.send_message(prompt)
        data = parse_gemini_json(response.text)
        
        if not validate_json_response(data):
            print(f"⚠️  Invalid response structure. Using fallback.")
            if session.dynamic_questions_asked >= 10:
                data = {
                    "thought_process": "Sufficient data collected",
                    "profile_complete": True,
                    "question": "",
                    "type": "text-only",
                    "options": []
                }
            else:
                data = {
                    "thought_process": "Continuing assessment",
                    "questions_asked_so_far": session.dynamic_questions_asked + 1,
                    "profile_complete": False,
                    "question": "Based on your learning patterns, how would you describe your ideal study environment?",
                    "type": "text-only",
                    "options": []
                }
        
        # Update session if profile complete
        if data.get("profile_complete"):
            session.set_profile_complete()
            print(f"✅ Profile complete for session {req.session_id}")
            print(f"   Total dynamic questions: {session.dynamic_questions_asked}")
        
        return {
            "data": data,
            "meta": {
                "session_id": req.session_id,
                "total_questions_asked": session.dynamic_questions_asked,
                "phase": "agent_dynamic"
            }
        }
        
    except Exception as e:
        print(f"❌ Error in next_question: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate question: {str(e)}"
        )

@app.get("/api/session/{session_id}")
async def get_session_info(session_id: str):
    """Get session information and profile data"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    return {
        "session_id": session_id,
        "created_at": session.created_at.isoformat(),
        "baseline_answers": len(session.baseline_answers),
        "dynamic_questions_asked": session.dynamic_questions_asked,
        "profile_complete": session.profile_data.get("complete", False),
        "conversation_log_length": len(session.conversation_log)
    }
