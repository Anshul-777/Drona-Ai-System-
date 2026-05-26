#!/usr/bin/env python3
"""
Test script for DRONA AI Assessment Agent
Verifies backend API endpoints and Gemini integration
"""

import requests
import json
import time
from typing import Dict, List, Any

BASE_URL = "http://localhost:8000"

# ANSI colors for output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"

def print_success(msg: str):
    print(f"{GREEN}✅ {msg}{RESET}")

def print_error(msg: str):
    print(f"{RED}❌ {msg}{RESET}")

def print_info(msg: str):
    print(f"{BLUE}ℹ️  {msg}{RESET}")

def print_warning(msg: str):
    print(f"{YELLOW}⚠️  {msg}{RESET}")

# ============================================================================
# TEST 1: Health Check
# ============================================================================

def test_health_check():
    """Verify backend is running"""
    print(f"\n{BLUE}═══════════════════════════════════════════════════════════{RESET}")
    print(f"{BLUE}TEST 1: Health Check{RESET}")
    print(f"{BLUE}═══════════════════════════════════════════════════════════{RESET}")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print_success(f"Backend is running on {BASE_URL}")
            print_info(f"Active sessions: {data['active_sessions']}")
            print_info(f"Gemini configured: {data['gemini_configured']}")
            return True
        else:
            print_error(f"Health check failed with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error(f"Cannot connect to {BASE_URL}. Is backend running?")
        print_info("Start backend with: python -m uvicorn app.main:app --reload --port 8000")
        return False
    except Exception as e:
        print_error(f"Health check error: {str(e)}")
        return False

# ============================================================================
# TEST 2: Initialize Agent (POST /api/agent/init)
# ============================================================================

def test_init_agent():
    """Test agent initialization with baseline answers"""
    print(f"\n{BLUE}═══════════════════════════════════════════════════════════{RESET}")
    print(f"{BLUE}TEST 2: Initialize Agent with 10 Baseline Answers{RESET}")
    print(f"{BLUE}═══════════════════════════════════════════════════════════{RESET}")
    
    # Simulate 10 baseline Q&A pairs
    history = []
    
    baseline_qa = [
        ("Problem-solving approach", "I break it down into smaller pieces"),
        ("Learning preference", "Visual and practical examples"),
        ("Academic success meaning", "Understanding concepts deeply and applying them"),
        ("Distraction frequency", "Occasionally, but I can pull back on track"),
        ("Memory techniques", "Understanding the why and spaced repetition"),
        ("Academic failure", "Failed a physics test because I didn't understand rotational motion properly"),
        ("Exam anxiety", "Somewhat nervous but generally calm"),
        ("Mistake response", "I analyze the mistake to understand where I went wrong"),
        ("Technology for learning", "I actively use videos and interactive tools"),
        ("Stuck concept response", "I'd seek help, try different explanations, or work on related problems")
    ]
    
    for i, (question, answer) in enumerate(baseline_qa):
        history.append({
            "role": "model",
            "parts": [{"text": json.dumps({
                "question": question,
                "type": "single-select" if i % 2 == 0 else "text-only",
                "options": []
            })}]
        })
        history.append({
            "role": "user",
            "parts": [{"text": json.dumps({
                "question": question,
                "options_selected": [],
                "elaboration": answer
            })}]
        })
    
    # Add the 10th answer
    current_answer = {
        "question": "Stuck concept response",
        "options_selected": [],
        "elaboration": "I'd seek help, try different explanations, or work on related problems"
    }
    
    payload = {
        "history": history,
        "current_answer": current_answer
    }
    
    try:
        print_info("Sending request to /api/agent/init...")
        response = requests.post(
            f"{BASE_URL}/api/agent/init",
            json=payload,
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            session_id = data.get("session_id")
            agent_data = data.get("data")
            
            print_success(f"Agent initialized successfully")
            print_info(f"Session ID: {session_id}")
            print_info(f"First dynamic question: \"{agent_data.get('question', '')[:80]}...\"")
            print_info(f"Question type: {agent_data.get('type')}")
            print_info(f"Profile complete: {agent_data.get('profile_complete', False)}")
            
            # Validate response structure
            required_fields = ["thought_process", "profile_complete", "question", "type", "options"]
            missing = [f for f in required_fields if f not in agent_data]
            if missing:
                print_warning(f"Missing fields in response: {missing}")
            else:
                print_success("Response structure is valid")
            
            return session_id, agent_data
        else:
            print_error(f"Init agent failed with status {response.status_code}")
            print_error(f"Response: {response.text}")
            return None, None
            
    except requests.exceptions.Timeout:
        print_error("Request timed out (15s). Gemini API may be slow or unavailable.")
        return None, None
    except Exception as e:
        print_error(f"Init agent error: {str(e)}")
        return None, None

# ============================================================================
# TEST 3: Get Next Question (POST /api/agent/next)
# ============================================================================

def test_next_question(session_id: str):
    """Test getting next dynamic question"""
    print(f"\n{BLUE}═══════════════════════════════════════════════════════════{RESET}")
    print(f"{BLUE}TEST 3: Get Next Dynamic Question{RESET}")
    print(f"{BLUE}═══════════════════════════════════════════════════════════{RESET}")
    
    if not session_id:
        print_error("No session ID. Run test 2 first.")
        return False
    
    current_answer = {
        "question": "First dynamic question",
        "options_selected": ["Option 1"],
        "elaboration": "Some elaboration from user"
    }
    
    payload = {
        "session_id": session_id,
        "current_answer": current_answer
    }
    
    try:
        print_info(f"Requesting next question for session {session_id[:8]}...")
        response = requests.post(
            f"{BASE_URL}/api/agent/next",
            json=payload,
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            agent_data = data.get("data")
            
            print_success("Got next question successfully")
            print_info(f"Next question: \"{agent_data.get('question', '')[:80]}...\"")
            print_info(f"Type: {agent_data.get('type')}")
            print_info(f"Total questions asked: {data.get('meta', {}).get('total_questions_asked', '?')}")
            print_info(f"Profile complete: {agent_data.get('profile_complete', False)}")
            
            return True
        else:
            print_error(f"Next question failed with status {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print_error("Request timed out. Gemini API may be slow.")
        return False
    except Exception as e:
        print_error(f"Next question error: {str(e)}")
        return False

# ============================================================================
# TEST 4: Get Session Info
# ============================================================================

def test_session_info(session_id: str):
    """Retrieve session information"""
    print(f"\n{BLUE}═══════════════════════════════════════════════════════════{RESET}")
    print(f"{BLUE}TEST 4: Get Session Information{RESET}")
    print(f"{BLUE}═══════════════════════════════════════════════════════════{RESET}")
    
    if not session_id:
        print_error("No session ID. Run test 2 first.")
        return False
    
    try:
        print_info(f"Fetching session info for {session_id[:8]}...")
        response = requests.get(
            f"{BASE_URL}/api/session/{session_id}",
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Session info retrieved")
            print_info(f"Session ID: {data['session_id']}")
            print_info(f"Created: {data['created_at']}")
            print_info(f"Baseline answers: {data['baseline_answers']}")
            print_info(f"Dynamic questions: {data['dynamic_questions_asked']}")
            print_info(f"Profile complete: {data['profile_complete']}")
            return True
        else:
            print_error(f"Session info failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Session info error: {str(e)}")
        return False

# ============================================================================
# TEST 5: Full Assessment Loop Simulation
# ============================================================================

def test_full_loop():
    """Simulate complete assessment flow"""
    print(f"\n{BLUE}═══════════════════════════════════════════════════════════{RESET}")
    print(f"{BLUE}TEST 5: Full Assessment Loop (5 iterations){RESET}")
    print(f"{BLUE}═══════════════════════════════════════════════════════════{RESET}")
    
    # Initialize agent
    history = []
    baseline_qa = [
        ("Q1", "Answer 1"),
        ("Q2", "Answer 2"),
        ("Q3", "Answer 3"),
        ("Q4", "Answer 4"),
        ("Q5", "Answer 5"),
        ("Q6", "Answer 6"),
        ("Q7", "Answer 7"),
        ("Q8", "Answer 8"),
        ("Q9", "Answer 9"),
        ("Q10", "Answer 10")
    ]
    
    for q, a in baseline_qa:
        history.append({"role": "model", "parts": [{"text": json.dumps({"question": q})}]})
        history.append({"role": "user", "parts": [{"text": json.dumps({"answer": a})}]})
    
    try:
        # Init
        print_info("Step 1: Initializing agent...")
        init_response = requests.post(
            f"{BASE_URL}/api/agent/init",
            json={"history": history, "current_answer": {"answer": "Answer 10"}},
            timeout=15
        )
        
        if init_response.status_code != 200:
            print_error(f"Init failed: {init_response.status_code}")
            return False
        
        session_id = init_response.json()["session_id"]
        print_success(f"Agent initialized: {session_id[:8]}...")
        
        # Loop through 5 iterations
        for i in range(2, 6):
            print_info(f"Step {i}: Getting question {i-1}...")
            time.sleep(1)  # Rate limit
            
            next_response = requests.post(
                f"{BASE_URL}/api/agent/next",
                json={"session_id": session_id, "current_answer": {"answer": f"Answer to Q{i-1}"}},
                timeout=15
            )
            
            if next_response.status_code != 200:
                print_error(f"Next failed: {next_response.status_code}")
                return False
            
            data = next_response.json()["data"]
            total_asked = next_response.json()["meta"]["total_questions_asked"]
            is_complete = data["profile_complete"]
            
            print_info(f"  Question {total_asked}: {data['question'][:50]}...")
            
            if is_complete:
                print_success(f"Profile completed after {total_asked} dynamic questions!")
                return True
        
        print_warning("Completed 5 iterations without profile completion")
        return True
        
    except Exception as e:
        print_error(f"Full loop error: {str(e)}")
        return False

# ============================================================================
# MAIN TEST RUNNER
# ============================================================================

def main():
    """Run all tests"""
    print(f"\n{BLUE}╔═══════════════════════════════════════════════════════════╗{RESET}")
    print(f"{BLUE}║     DRONA AI Assessment Agent - Backend Test Suite       ║{RESET}")
    print(f"{BLUE}╚═══════════════════════════════════════════════════════════╝{RESET}")
    
    # Test 1: Health
    if not test_health_check():
        print_error("Backend is not responding. Please start it first.")
        return
    
    time.sleep(1)
    
    # Test 2: Init Agent
    session_id, agent_data = test_init_agent()
    if not session_id:
        print_warning("Skipping remaining tests due to init failure")
        return
    
    time.sleep(1)
    
    # Test 3: Next Question
    test_next_question(session_id)
    
    time.sleep(1)
    
    # Test 4: Session Info
    test_session_info(session_id)
    
    time.sleep(1)
    
    # Test 5: Full Loop
    test_full_loop()
    
    print(f"\n{BLUE}═══════════════════════════════════════════════════════════{RESET}")
    print(f"{GREEN}✅ All tests completed!{RESET}")
    print(f"{BLUE}═══════════════════════════════════════════════════════════{RESET}\n")

if __name__ == "__main__":
    main()
