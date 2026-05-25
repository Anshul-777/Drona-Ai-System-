import requests
import json
import time

url = "http://localhost:8000/api/agent/init"

# Mock the first 10 static answers
payload = {
    "history": [],
    "current_answer": {
        "question": "When faced with a complex, unfamiliar topic, how do you prefer to begin?",
        "options_selected": ["I prefer to read a detailed, structured overview first."],
        "elaboration": ""
    }
}

print("Sending request to /api/agent/init...")
start_time = time.time()
try:
    response = requests.post(url, json=payload, timeout=30)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {json.dumps(response.json(), indent=2)}")
    print(f"Time taken: {time.time() - start_time:.2f}s")
except Exception as e:
    print(f"Error: {e}")
