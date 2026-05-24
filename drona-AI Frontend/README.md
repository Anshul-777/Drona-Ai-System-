# DRONA AI Backend

Multi-agent AI education platform API built with FastAPI

## Frontend Setup

Navigate to the frontend folder and follow the setup instructions in:
- [Frontend README](../drona-AI Frontend/README.md)

OR run the commands below:

### 1. Frontend Setup (if not already done)

```bash
cd ../drona-AI Frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### 2. Backend Setup

```bash
cd ../drona-AI Backend

# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run server
uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`

API Docs: `http://localhost:8000/docs`

## Key Features Ready to Build

✅ **Multi-Agent Orchestration** - Head Agent + Subject Specialists
✅ **6 Environments** - Main Learning, Test, Game, Workspace, Resources, Career
✅ **RAG Pipeline** - Dual Database (Platform + User) with Pinecone
✅ **LLM Multi-Provider** - Gemini, Groq, OpenAI, Claude with fallback
✅ **Authentication** - Supabase Auth with JWT
✅ **Real-time Features** - Upstash Redis + QStash
✅ **File Storage** - Cloudflare R2
✅ **Database** - PostgreSQL via Supabase

## Full System Running

Both services should run simultaneously:

```bash
# Terminal 1 - Frontend
cd drona-AI Frontend
npm run dev

# Terminal 2 - Backend  
cd drona-AI Backend
.\venv\Scripts\activate
uvicorn app.main:app --reload
```

Visit `http://localhost:3000` and explore!
