# DRONA AI - Backend API

Multi-agent AI education platform backend built with FastAPI, PostgreSQL, and Pinecone.

## Setup

### 1. Activate Virtual Environment

**Windows:**
```bash
.\venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

### 4. Run Development Server

```bash
uvicorn main:app --reload
```

Server will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

## Project Structure

```
drona-AI Backend/
├── venv/                    # Virtual environment
├── app/                     # Application code
│   ├── agents/             # AI Agent implementations
│   ├── core/               # Core services (DB, RAG, LLM, Cache)
│   ├── api/                # API routes
│   ├── models/             # SQLAlchemy models
│   ├── schemas/            # Pydantic schemas
│   ├── utils/              # Utility functions
│   └── main.py             # FastAPI app
├── migrations/             # Alembic database migrations
├── tests/                  # Test suite
├── requirements.txt        # Dependencies
├── .env.example           # Environment template
└── README.md              # This file
```

## Technologies

- **Framework**: FastAPI
- **Database**: PostgreSQL (Supabase)
- **Vector DB**: Pinecone
- **Cache**: Redis (Upstash)
- **ORM**: SQLAlchemy
- **LLM**: Multi-provider (Gemini, Groq, OpenAI, Claude)
- **Server**: Uvicorn

## Development

### Running Tests

```bash
pytest
```

### Code Quality

```bash
black .
flake8 .
mypy .
isort .
```

### Database Migrations

```bash
alembic upgrade head
```

## API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /chat` - Chat endpoint (streaming)
- `GET /user/profile` - User profile
- `POST /test/generate` - Generate mock test
- `POST /test/submit` - Submit test answers
- And many more...

See `http://localhost:8000/docs` for full API documentation.
