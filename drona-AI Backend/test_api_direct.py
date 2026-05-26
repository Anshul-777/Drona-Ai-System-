"""Quick diagnostic: test Gemini API directly."""
import os
import sys
sys.path.insert(0, '.')
from dotenv import load_dotenv

# Load from frontend env
frontend_env = os.path.join(os.path.dirname(__file__), "..", "drona-AI Frontend", ".env.local")
load_dotenv(frontend_env)

api_key = os.environ.get("GEMINI_API_KEY")
print(f"API Key found: {bool(api_key)}")
print(f"API Key prefix: {api_key[:10]}..." if api_key else "NO KEY")

import google.generativeai as genai
genai.configure(api_key=api_key)

# Test each model
models_to_try = ["gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-pro"]

for model_name in models_to_try:
    print(f"\nTesting model: {model_name}")
    try:
        model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction="You are a test assistant. Respond only with valid JSON.",
            generation_config={"response_mime_type": "application/json"}
        )
        response = model.generate_content("Say hello in JSON format: {\"message\": \"hello\"}")
        print(f"  SUCCESS: {response.text[:100]}")
    except Exception as e:
        print(f"  FAILED: {type(e).__name__}: {str(e)[:200]}")

# Also test Groq
groq_key = os.environ.get("GROQ_API_KEY", "")
print(f"\nGroq API Key found: {bool(groq_key)}")
if groq_key:
    import requests
    try:
        res = requests.post("https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"},
            json={"model": "mixtral-8x7b-32768", "messages": [{"role": "user", "content": "Say hello"}], "max_tokens": 50},
            timeout=10
        )
        print(f"  Groq status: {res.status_code}")
        if res.status_code == 200:
            print(f"  Response: {res.json()['choices'][0]['message']['content'][:100]}")
        else:
            print(f"  Error: {res.text[:200]}")
    except Exception as e:
        print(f"  Groq FAILED: {e}")
