from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import uuid
import os
from typing import List, Dict, Any
import json
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Drona Assessment Agent API")

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev, allow all. In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    # Attempt to read from frontend .env.local if not in system env
    frontend_env_path = os.path.join(os.path.dirname(__file__), "..", "..", "drona-AI Frontend", ".env.local")
    if os.path.exists(frontend_env_path):
        load_dotenv(frontend_env_path)
        api_key = os.environ.get("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)

system_instruction = """You are the "Assessment Agent" for DRONA AI, an elite, hyper-personalized education platform. Your sole objective is to psychologically, academically, and scientifically profile the student you are speaking with. 

The student has answered baseline questions and you now have a rough idea of their resilience, learning modality, motivation, attention span, memory pattern, stress levels, and curiosity.

Your job is to dynamically generate 5 to 10 follow-up questions to dig deeper. Extract indirect clues about their personality, hidden weaknesses, academic confidence, and psychological triggers. DO NOT ask obvious, robotic questions. Ask clever, scenario-based, or probing questions that force the user to reveal their true learning style.

### Rules:
1. You must respond in a strict JSON format. Do not include any conversational text outside the JSON.
2. The frontend supports three types of inputs: "single-select" (radio buttons), "multi-select" (checkboxes), and "text-only" (just a text box). Every multiple-choice question automatically includes an optional text box in the UI, so do not add "Other" as an option.
3. Keep your questions engaging, empathetic, and professional. 
4. Analyze the user's previous answers.
5. Once you have asked at least 5 dynamic questions and feel you have a complete, flawless psychological and academic profile of the student, you MUST stop asking questions. Set the "profile_complete" flag to true in your JSON response.

### JSON Response Schema:
{
  "thought_process": "Internal reasoning on what you are trying to extract from the user with this question based on their previous answers.",
  "profile_complete": boolean, // Set to true ONLY if you have enough data (min 5 dynamic questions asked).
  "question": "The actual question string you are asking the user. (Leave empty if profile_complete is true)",
  "type": "single-select" | "multi-select" | "text-only",
  "options": ["Option 1", "Option 2", "Option 3"] // Provide 2-5 options. Leave as empty array [] if type is "text-only".
}"""

# In-memory session store (Memory Architecture)
sessions: Dict[str, Any] = {}

class InitRequest(BaseModel):
    history: List[Dict[str, Any]]
    current_answer: Dict[str, Any]

class NextRequest(BaseModel):
    session_id: str
    current_answer: Dict[str, Any]

def parse_gemini_json(text: str) -> dict:
    try:
        cleaned = re.sub(r'^```json\s*', '', text, flags=re.IGNORECASE)
        cleaned = re.sub(r'```\s*$', '', cleaned).strip()
        
        # Extract just the JSON object if there's conversational text around it
        if not cleaned.startswith('{'):
            start = cleaned.find('{')
            end = cleaned.rfind('}')
            if start != -1 and end != -1:
                cleaned = cleaned[start:end+1]
                
        return json.loads(cleaned)
    except Exception as e:
        print(f"JSON Parse Error. Raw text was:\n{text}")
        raise e

@app.post("/api/agent/init")
async def init_agent(req: InitRequest):
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not found")

    session_id = str(uuid.uuid4())
    
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=system_instruction,
        generation_config={"response_mime_type": "application/json"}
    )
    
    try:
        # Convert frontend history to python SDK history format
        formatted_history = []
        for msg in req.history:
            formatted_history.append({
                "role": msg["role"],
                "parts": [msg["parts"][0]["text"]]
            })
            
        chat = model.start_chat(history=formatted_history)
        sessions[session_id] = chat
        
        prompt = f"User answered: {json.dumps(req.current_answer)}. Based on this and the history, generate the first dynamic follow-up question or complete the profile."
        
        response = chat.send_message(prompt)
        data = parse_gemini_json(response.text)
        return {"session_id": session_id, "data": data}
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error in init_agent: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate initial question")

@app.post("/api/agent/next")
async def next_question(req: NextRequest):
    if req.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found or expired")
        
    chat = sessions[req.session_id]
    prompt = f"User answered: {json.dumps(req.current_answer)}. Based on this and the history, generate the next question or complete the profile."
    
    try:
        response = chat.send_message(prompt)
        data = parse_gemini_json(response.text)
        return {"data": data}
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate next question")
