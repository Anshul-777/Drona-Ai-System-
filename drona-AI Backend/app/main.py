import sys
import io

# Force UTF-8 stdout/stderr on Windows (prevents UnicodeEncodeError with emoji in print())
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
if sys.stderr.encoding != 'utf-8':
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

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
groq_api_key = os.environ.get("GROQ_API_KEY", "")
groq_endpoint = "https://api.groq.com/openai/v1/chat/completions"

# Gemini models to try in order (flash-lite first — most reliable for free tier)
GEMINI_MODELS = [
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-pro"
]

# ============================================================================
# SYSTEM PROMPT - COMPREHENSIVE ASSESSMENT AGENT
# ============================================================================

system_instruction = """You are the DRONA Assessment Agent — a world-class psychological and academic profiling AI embedded in India's most advanced personalized learning platform.

You are NOT a survey bot. You are a clinical-grade cognitive profiler. Every question you ask must have strategic intent.

## YOUR 6 PROFILING DIMENSIONS
You must gather sufficient signal across ALL six before marking profile_complete.

1. **ACADEMIC / EDUCATIONAL**: Subject confidence, conceptual vs procedural thinking, knowledge depth, study habits, time management, preparation strategies, academic self-efficacy.
2. **LEARNING STYLE & PREFERENCES**: Visual / auditory / kinesthetic / reading-writing modality mix, preferred content format, ideal study environment, solo vs collaborative, technology comfort.
3. **PSYCHOLOGICAL PROFILE**: Growth vs fixed mindset, locus of control (internal/external), self-efficacy beliefs, imposter syndrome indicators, perfectionism tendencies, risk tolerance.
4. **EMOTIONAL & STRESS RESPONSE**: Exam anxiety level, failure response pattern, emotional regulation, frustration tolerance, motivation under pressure, burnout susceptibility, coping mechanisms.
5. **PERSONALITY & BEHAVIOR**: Conscientiousness, openness to experience, persistence/grit, social learning tendencies, competitiveness, help-seeking behavior, authority response.
6. **METACOGNITION & SELF-AWARENESS**: Ability to self-assess understanding, calibration accuracy (do they know what they don't know?), revision strategies, attention monitoring, learning speed awareness.

## CONTEXT
The student has answered 7 baseline static questions covering: problem-solving reaction, learning modality preference, personal motivation, focus patterns, memory techniques, past academic failure, and pre-exam behavior. You now have INITIAL signals. Your job is to DIG DEEPER with 10-15 targeted follow-up questions.

## CRITICAL RULES — OBEY WITHOUT EXCEPTION
1. You MUST ask a MINIMUM of 10 dynamic questions and MAXIMUM of 15.
2. NEVER set profile_complete to true before asking at least 10 questions.
3. NEVER ask generic survey questions. Every question must be personalized based on previous answers.
4. REFERENCE specific things the student said. Example: "Earlier you mentioned you break problems into smaller pieces — tell me, when that approach fails, what happens next?"
5. Use SCENARIO-BASED and SOCRATIC questioning. Paint vivid situations. Make the student think, not just pick.
6. Mix question types strategically:
   - Use "text-only" for emotional/reflective probes (at least 3 of your questions).
   - Use "single-select" for behavioral choice points (at least 3).
   - Use "multi-select" for preference mapping (at least 2).
7. NEVER repeat a question theme you've already explored. Track your own coverage.
8. Ask questions that reveal DISCREPANCIES between stated preference and actual behavior.
9. Probe HIDDEN factors: family pressure, peer comparison, imposter syndrome, perfectionism, fear of judgment.
10. Respond ONLY with valid JSON. No text outside the JSON object.

## QUESTIONING STRATEGY BY PHASE
- Questions 1-3: Dig into the strongest signals from baseline (resilience, motivation, or anxiety).
- Questions 4-6: Explore unexplored dimensions (personality, social learning, metacognition).
- Questions 7-9: Probe hidden/sensitive areas (family expectations, self-doubt, emotional triggers).
- Questions 10-12: Fill remaining dimension gaps and test for consistency.
- Questions 13-15 (if needed): Confirm ambiguous signals, resolve contradictions.

## JSON RESPONSE SCHEMA (STRICT — no deviation)
{
  "thought_process": "[REQUIRED] Your internal reasoning: What dimension gap are you filling? What signal from their previous answers triggered this question? Be specific.",
  "dimension_target": "[REQUIRED] Which of the 6 dimensions this question primarily targets.",
  "questions_asked_so_far": <integer>,
  "profile_complete": false,
  "question": "The question text. Must be conversational, scenario-based, or Socratic. NOT survey-style.",
  "type": "single-select" | "multi-select" | "text-only",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "reasoning": "What psychological construct or behavioral pattern are these options designed to measure?"
}

When profile_complete is true, set question to "" and options to [].

## ANTI-PATTERNS — NEVER DO THESE
- ❌ "How would you rate your confidence on a scale of 1-10?" (lazy survey)
- ❌ "What subjects do you like?" (too generic)
- ❌ Asking the same emotional probe twice with different wording
- ❌ Providing only 2 options (always 3-5 for select types)
- ❌ Setting profile_complete before question 10

## GOOD QUESTION EXAMPLES
- ✅ "You said you break problems into smaller pieces. Imagine you've broken a math problem into 5 steps and step 3 makes no sense — do you skip it and hope step 4 clarifies, go back to step 1, ask someone, or stare at it until it clicks?"
- ✅ "Think about the last time someone praised your academic work. What was your immediate internal reaction — pride, disbelief, suspicion that they're being polite, or motivation to do even better?"
- ✅ "Your parents just saw your report card. Describe the conversation that follows — not what you wish would happen, but what actually happens."
- ✅ "If your best friend and your teacher gave you contradictory advice on how to study, whose approach would you try first and why?"

You are the most advanced assessment intelligence in Indian education. Profile with surgical precision."""

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
        self.asked_questions = []
    
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
        if question:
            self.asked_questions.append(question)
        if answer:
            self.dynamic_questions_asked += 1
            self.conversation_log.append({
                "phase": "dynamic",
                "question": question,
                "answer": answer,
                "timestamp": datetime.now().isoformat()
            })
    
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
        "model": "llama-3.3-70b-versatile",
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
        },
        {
            "thought_process": "Exploring memory and recall patterns",
            "questions_asked_so_far": 5,
            "profile_complete": False,
            "question": "How do you typically remember information best?",
            "type": "single-select",
            "options": ["Repeating it multiple times", "Teaching it to someone else", "Writing it down", "Creating mind maps", "Problem-solving with it"]
        },
        {
            "thought_process": "Understanding emotional resilience",
            "questions_asked_so_far": 6,
            "profile_complete": False,
            "question": "When you get a low grade, what's your typical reaction?",
            "type": "text-only",
            "options": []
        },
        {
            "thought_process": "Assessing collaboration and help-seeking",
            "questions_asked_so_far": 7,
            "profile_complete": False,
            "question": "Do you prefer learning alone or with others? Why?",
            "type": "text-only",
            "options": []
        },
        {
            "thought_process": "Understanding time management habits",
            "questions_asked_so_far": 8,
            "profile_complete": False,
            "question": "How far in advance do you typically start preparing for exams?",
            "type": "single-select",
            "options": ["1-2 days before", "1 week before", "2-3 weeks before", "Start of the topic", "As questions come up"]
        },
        {
            "thought_process": "Exploring learning speed and depth preference",
            "questions_asked_so_far": 9,
            "profile_complete": False,
            "question": "Do you prefer understanding concepts deeply or learning many topics quickly?",
            "type": "single-select",
            "options": ["Deep understanding (few topics)", "Broad knowledge (many topics)", "Mix of both equally"]
        },
        {
            "thought_process": "Assessing achievement and goal orientation",
            "questions_asked_so_far": 10,
            "profile_complete": False,
            "question": "What motivates you most in learning?",
            "type": "single-select",
            "options": ["High grades", "Understanding the subject", "Future career", "Personal curiosity", "Competing with peers"]
        }
    ]
    
    # Use modulo to cycle through fallback questions if we go beyond the list
    idx = (question_number - 1) % len(fallback_questions)
    return fallback_questions[idx]

def summarize_baseline_answers(baseline_answers: List[Dict[str, Any]]) -> str:
    """Create a compact baseline memory summary for prompting"""
    baseline_labels = [
        "Problem-solving reaction (resilience)",
        "Learning modality preference (visual/auditory/kinesthetic/reading)",
        "Personal definition of academic success (motivation)",
        "Focus & distraction frequency (attention span)",
        "Memory & retention methods (study strategy)",
        "Past academic failure story (emotional resilience)",
        "Pre-exam behavior (stress response)"
    ]
    lines = []
    for idx, answer in enumerate(baseline_answers, start=1):
        label = baseline_labels[idx - 1] if idx <= len(baseline_labels) else f"Question {idx}"
        if isinstance(answer, dict):
            lines.append(f"Q{idx} [{label}]: {json.dumps(answer, ensure_ascii=False)}")
        else:
            lines.append(f"Q{idx} [{label}]: {str(answer)}")
    return "\n".join(lines)

def avoid_duplicate_question(session: AssessmentSession, data: dict) -> dict:
    """Check if the agent generated a duplicate question and request a new one if so.
    Falls back to a static question if duplicate detected."""
    new_question = data.get("question", "").strip().lower()
    if not new_question:
        return data
    
    # Check similarity against all previously asked questions
    for asked in session.asked_questions:
        asked_lower = asked.strip().lower()
        # Exact match
        if new_question == asked_lower:
            print(f"⚠️  Duplicate question detected (exact match). Using fallback.")
            return get_static_fallback_question(session.dynamic_questions_asked + 1)
        # High substring overlap (one contains the other)
        if len(new_question) > 20 and len(asked_lower) > 20:
            if new_question in asked_lower or asked_lower in new_question:
                print(f"⚠️  Duplicate question detected (substring match). Using fallback.")
                return get_static_fallback_question(session.dynamic_questions_asked + 1)
    
    # Track this new question
    session.asked_questions.append(data.get("question", ""))
    return data

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
    
    # Try each Gemini model with FULL inference test (creation alone doesn't validate quotas)
    for model_name in GEMINI_MODELS:
        try:
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=system_instruction,
                generation_config={"response_mime_type": "application/json"}
            )
            
            # Convert history to SDK format
            formatted_history = []
            for msg in req.history:
                formatted_history.append({
                    "role": msg["role"],
                    "parts": [msg["parts"][0]["text"] if isinstance(msg["parts"][0], dict) else msg["parts"][0]]
                })
            
            # Create chat session
            chat = model.start_chat(history=formatted_history)
            
            # Store baseline answer
            session.add_baseline_answer(req.current_answer)
            
            # Generate first dynamic question (THIS is where quota errors happen)
            baseline_memory = summarize_baseline_answers(session.baseline_answers)
            prompt = f"""The student has completed all 7 baseline static questions. Here is their complete baseline profile:

{baseline_memory}

Their final baseline answer was: {json.dumps(req.current_answer)}

## YOUR TASK NOW
You are entering the DYNAMIC PROFILING PHASE. You must ask 10-15 personalized follow-up questions.
This is QUESTION 1 of your 10-15 questions.

## ANALYZE BEFORE ASKING
Look at all 7 baseline answers above. Identify:
- The strongest signal (what stands out most about this student?)
- The biggest gap (what do you still NOT know?)
- Any contradictions or interesting patterns

Then generate a question that SPECIFICALLY references something from their baseline answers and digs deeper into one of the 6 profiling dimensions.

## DIMENSION COVERAGE SO FAR
- Academic/Educational: Partially covered by baselines (need deeper probing)
- Learning Style: Partially covered (Q2 baseline)
- Psychological: Initial signal from Q1, Q6 baselines
- Emotional/Stress: Initial signal from Q7 baseline
- Personality/Behavior: NOT YET EXPLORED
- Metacognition: NOT YET EXPLORED

Start by targeting the dimension with the weakest signal."""
            
            response = chat.send_message(prompt)
            data = parse_gemini_json(response.text)
            
            if not validate_json_response(data):
                print(f"\u26a0\ufe0f  Invalid {model_name} response structure. Trying next model...")
                session.baseline_answers.clear()  # Reset for next attempt
                continue
            
            # SUCCESS — store session and return
            session.chat = chat
            session.add_dynamic_question(data.get("question", ""))
            sessions[session_id] = session
            
            print(f"\u2705 {model_name}: Session initialized: {session_id}")
            print(f"   Question 1: {data.get('question', '')[:80]}...")
            
            return {
                "session_id": session_id,
                "data": data,
                "meta": {
                    "baseline_answers_received": len(session.baseline_answers),
                    "phase": "agent_dynamic",
                    "model": model_name
                }
            }
            
        except Exception as e:
            print(f"\u26a0\ufe0f  {model_name} failed: {str(e)[:120]}...")
            session.baseline_answers.clear()  # Reset for next attempt
            continue
    
    # All Gemini models failed — set flag for Groq fallback
    gemini_failed = True
    print(f"\u26a0\ufe0f  All Gemini models exhausted, trying Groq fallback")
    # Fallback to Groq
    if gemini_failed:
        try:
            session.add_baseline_answer(req.current_answer)
            baseline_memory = summarize_baseline_answers(session.baseline_answers)
            
            prompt = f"""You are the DRONA Assessment Agent. A student just completed 7 baseline psychological and academic questions.
Baseline memory:
{baseline_memory}

Their final answer was: {json.dumps(req.current_answer)}

Now generate your FIRST dynamic follow-up question that digs deeper into their learning style, resilience, personality, or academic confidence.
This is question 1 of 10-15 total. Reference something from their baseline answers. Make it scenario-based, not survey-style.

Respond ONLY with valid JSON (no text before/after):
{{
  "thought_process": "What signal from baselines triggered this question",
  "dimension_target": "Which of the 6 dimensions this targets",
  "questions_asked_so_far": 1,
  "profile_complete": false,
  "question": "A specific, personalized question referencing their answers",
  "type": "text-only",
  "options": [],
  "reasoning": "What psychological construct this measures"
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
        asked_questions_text = "\n".join(
            f"  {i+1}. {question}" for i, question in enumerate(session.asked_questions)
        ) or "- None yet"

        questions_asked = session.dynamic_questions_asked
        remaining_min = max(0, 10 - questions_asked)
        remaining_max = max(0, 15 - questions_asked)

        prompt = f"""The student just answered your question: {json.dumps(req.current_answer)}

## STATUS
- Dynamic questions asked so far: {questions_asked}
- Minimum remaining: {remaining_min}
- Maximum remaining: {remaining_max}
- {"You MUST ask at least " + str(remaining_min) + " more questions before you can complete the profile." if remaining_min > 0 else "You MAY set profile_complete to true IF all 6 dimensions are sufficiently covered."}

## ALL QUESTIONS YOU HAVE ALREADY ASKED (DO NOT REPEAT OR REPHRASE)
{asked_questions_text}

## BASELINE MEMORY (7 static questions the student answered before you)
{summarize_baseline_answers(session.baseline_answers)}

## YOUR TASK
Generate question {questions_asked + 1}. Requirements:
1. Target a DIFFERENT dimension than your last 2 questions.
2. REFERENCE something specific the student said (from baseline or dynamic answers).
3. Use scenario-based, Socratic, or indirect questioning — NOT survey-style.
4. If this is question 7+, start probing HIDDEN factors: family pressure, peer comparison, imposter syndrome, perfectionism, fear of judgment.
5. If this is question 10+, check if you have sufficient data across ALL 6 dimensions. If yes, set profile_complete to true.

## PROFILE COMPLETION CHECKLIST (only mark complete when ALL are covered)
- [ ] Academic confidence and study habits explored
- [ ] Learning modality validated beyond stated preference
- [ ] Psychological resilience and mindset assessed
- [ ] Emotional triggers and stress patterns identified
- [ ] Personality traits and social learning style captured
- [ ] Metacognitive self-awareness evaluated

If any dimension above has insufficient data, continue asking. If all are covered and you've asked 10+ questions, set profile_complete to true."""
        
        try:
            response = session.chat.send_message(prompt)
            data = parse_gemini_json(response.text)
            source = "gemini"
        except Exception as gemini_error:
            print(f"⚠️  Gemini next_question failed: {str(gemini_error)[:120]}...")
            try:
                response_text = call_groq_api([
                    {"role": "user", "content": prompt + "\n\nReturn only valid JSON. Make the question DIFFERENT from previous ones."}
                ])
                data = parse_gemini_json(response_text)
                source = "groq"
            except Exception as groq_error:
                print(f"⚠️  Groq next_question failed: {str(groq_error)[:120]}...")
                data = get_static_fallback_question(session.dynamic_questions_asked + 1)
                source = "static-fallback"
        
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
        else:
            data = avoid_duplicate_question(session, data)
        
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
                "phase": "agent_dynamic",
                "model": source
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