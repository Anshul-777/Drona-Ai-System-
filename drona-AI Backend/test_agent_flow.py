"""Test the agent init and next endpoints with realistic baseline data."""
import requests
import json
import time

BASE = "http://localhost:8000"

# Simulate 7 baseline answers
baseline_history = []
baseline_answers = [
    {
        "question": "When you encounter a difficult problem you can't solve, what is your immediate reaction?",
        "options_selected": ["I break it down into smaller pieces and try different approaches systematically."],
        "elaboration": ""
    },
    {
        "question": "How do you prefer to learn a completely new and complex concept?",
        "options_selected": ["Seeing diagrams, charts, visual mind maps, or animations.", "Doing practical examples, experiments, or solving related problems immediately."],
        "elaboration": ""
    },
    {
        "question": "In your own words, what does academic success mean to you personally \u2014 and why does it truly matter?",
        "options_selected": [],
        "elaboration": "For me academic success is about understanding things deeply, not just grades. I want to actually know the material well enough to apply it in real life."
    },
    {
        "question": "How often do you find yourself getting distracted during a study session?",
        "options_selected": ["Occasionally, but I can usually pull myself back on track after a few minutes."],
        "elaboration": ""
    },
    {
        "question": "When preparing for an exam, how do you usually retain important facts?",
        "options_selected": ["Understanding the deep logical 'why' behind the concept, not just memorizing.", "Practicing with flashcards, spaced repetition, or active recall exercises."],
        "elaboration": ""
    },
    {
        "question": "Describe a specific time you failed or struggled with something academic.",
        "options_selected": [],
        "elaboration": "I failed my chemistry midterm in class 11. I was overconfident and didn't study the numerical parts. It made me feel terrible and I questioned if I was smart enough for science."
    },
    {
        "question": "How do you typically feel the night before a major exam?",
        "options_selected": ["Stressed and driven to cram intensively until the last minute."],
        "elaboration": ""
    }
]

# Build history
for i, ans in enumerate(baseline_answers):
    q_data = {"question": ans["question"], "type": "text-only", "options": []}
    baseline_history.append({"role": "model", "parts": [{"text": json.dumps(q_data)}]})
    baseline_history.append({"role": "user", "parts": [{"text": json.dumps(ans)}]})

print("=" * 60)
print("TEST 1: /api/agent/init")
print("=" * 60)

try:
    res = requests.post(f"{BASE}/api/agent/init", json={
        "history": baseline_history,
        "current_answer": baseline_answers[-1]
    }, timeout=30)
    
    if res.status_code == 200:
        data = res.json()
        session_id = data.get("session_id")
        q = data.get("data", {})
        print(f"STATUS: OK")
        print(f"SESSION: {session_id}")
        print(f"MODEL: {data.get('meta', {}).get('model', 'unknown')}")
        print(f"QUESTION: {q.get('question', 'NONE')[:120]}")
        print(f"TYPE: {q.get('type', 'NONE')}")
        print(f"OPTIONS: {q.get('options', [])}")
        print(f"DIMENSION: {q.get('dimension_target', 'NOT SET')}")
        print(f"PROFILE_COMPLETE: {q.get('profile_complete', 'NOT SET')}")
    else:
        print(f"FAILED: {res.status_code} - {res.text[:200]}")
        session_id = None
except Exception as e:
    print(f"ERROR: {e}")
    session_id = None

if session_id:
    print()
    print("=" * 60)
    print("TEST 2: /api/agent/next (3 rounds)")
    print("=" * 60)
    
    for i in range(3):
        time.sleep(1)
        fake_answer = {
            "question": "Previous question",
            "options_selected": ["Some answer"],
            "elaboration": "I think this is important because it shows how I approach challenges."
        }
        
        try:
            res = requests.post(f"{BASE}/api/agent/next", json={
                "session_id": session_id,
                "current_answer": fake_answer
            }, timeout=30)
            
            if res.status_code == 200:
                data = res.json()
                q = data.get("data", {})
                print(f"\nROUND {i+1}:")
                print(f"  MODEL: {data.get('meta', {}).get('model', 'unknown')}")
                print(f"  Q: {q.get('question', 'NONE')[:120]}")
                print(f"  TYPE: {q.get('type', 'NONE')}")
                print(f"  DIMENSION: {q.get('dimension_target', 'NOT SET')}")
                print(f"  TOTAL ASKED: {data.get('meta', {}).get('total_questions_asked', '?')}")
                print(f"  PROFILE_COMPLETE: {q.get('profile_complete', False)}")
                
                if q.get('profile_complete'):
                    print("\n  >>> PROFILE MARKED COMPLETE <<<")
                    break
            else:
                print(f"\nROUND {i+1} FAILED: {res.status_code} - {res.text[:200]}")
        except Exception as e:
            print(f"\nROUND {i+1} ERROR: {e}")

print("\n" + "=" * 60)
print("DONE")
print("=" * 60)
