# Drona AI: Full Platform Documentation & Architecture Blueprint
**Version 1.0**

This document serves as the master blueprint for the entire Drona AI ecosystem. It synthesizes the original plan, the database architecture, the frontend UI/UX requirements, and the backend RAG implementations into a single technical reference.

---

## 1. Platform Flow & Core User Journey

Drona AI is designed to feel less like a website and more like an immersive educational operating system. 

### Step 1: Landing & Onboarding
- **Landing Page**: Minimalist, animated, high-contrast black & white design that feels premium ($50M evaluation target). Showcases the platform's power without requiring login.
- **Authentication**: Zero friction. Managed by Supabase Auth (Google OAuth, Email/Password, OTP). The Next.js middleware uses `supabase.auth.getSession()` to ensure zero-latency routing.
- **The Assessment**: New users are placed in a locked "Zero State" and forced into an initial assessment. The AI uses this diagnostic test to generate their baseline `precision`, `velocity`, and `depth` scores, which immediately populate their personalized profile and stats tables.

### Step 2: The Dashboard & Environments
Once authenticated and assessed, users enter the `PlatformShell`, which acts as the global wrapper. Navigation between environments features smooth crossfades and zero layout shifts.

- **Main Learning (Blue `#2a5cff`)**: The core chat interface with the Head Agent and Subject Agents. Features Socratic teaching, 5-minute crash courses, and real-time behavioral adaptation.
- **Test Environment (Red `#e8362a`)**: A high-stress, exam-focused environment. Powers mock tests, surprise tests, Viva interviews, and exam day simulations. Uses the `tests` and `test_results` tables.
- **Game Environment (Gold `#c9a84c`)**: The gamification hub. Tracks the 100+ badges, daily missions, the XP ledger, the global leaderboard, and manages multiplayer "Boss Battles".
- **Workspace (Green `#00c896`)**: The student's "Second Brain". Features Notion-style nested folders, markdown notes, file uploads (PDFs, PPTs), and the Pomodoro focus timer with automated study scheduling.
- **Resources (Purple `#9b5de5`)**: The AI utility belt. Flashcards (with SM-2 spaced repetition algorithm), generated audio podcasts, flowcharts, image solvers, and the smart academic search engine.
- **Career (Navy `#000080`)**: 5-year career roadmaps, skill gap analysis, ATS resume builders, and simulated HR/Technical interviews.

---

## 2. Technical Architecture

Drona AI is a full-stack, edge-deployed application optimized for extremely low latency.

### The Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Framer Motion for micro-animations.
- **Backend APIs**: Node.js / Next.js Server Actions & API routes.
- **Database Layer**: PostgreSQL (via Supabase) with complete Row Level Security (RLS) enforcement. 50+ tables handle everything from identity to XP ledgers.
- **Cache & Real-time**: Redis (Upstash) for agent state caching, Supabase Realtime for live multiplayer boss battles.
- **Storage**: Supabase Storage / Cloudflare R2 for zero-egress cost hosting of user-uploaded PDFs, generated images, and audio podcasts.
- **LLM Infrastructure**: 
  - **Free Tier**: Gemini 1.5 Flash (fast, multimodal), Groq Llama 3 (ultra-low latency), OpenRouter fallbacks.
  - **BYOK (Bring Your Own Key)**: Premium tier allowing students to inject their own OpenAI/Anthropic API keys securely (stored encrypted via AES-256).

---

## 3. RAG & Vector Database Methods

To prevent hallucinations and guarantee curriculum alignment, Drona relies heavily on Retrieval-Augmented Generation (RAG).

### Dual-Database Model
Drona queries two distinct vector stores during operation:

1. **Platform Database (Admin-Managed)**
   - **Contents**: Full NCERT textbooks (Classes 10-12), 20 years of PYQs (JEE, NEET), Formula Vaults, and curated expert notes.
   - **Vector Search**: Chunked at 500 tokens. Embedded via Gemini/Sentence-Transformers. 
   - **Priority**: When an agent answers a factual question or solves a problem, it **must** prioritize retrieving from this verified pool to ensure exam accuracy.

2. **User Database (Student-Managed)**
   - **Contents**: The student's uploaded PDFs, handwritten OCR notes, and chat history.
   - **Vector Search**: Namespace isolated (e.g., `user_{uid}`).
   - **Priority**: When the "Use My Database" toggle is active, the agent prioritizes the student's personal notes to generate answers tailored to their specific classroom context.

### The Memory Mesh
A specialized vector space `memory_{uid}` acts as the cross-agent shared memory. Every time a student makes a conceptual error, declares a preference, or achieves a milestone, an atomic memory chunk is inserted. Before answering, agents perform a Top-K retrieval on this mesh to proactively adapt their teaching style (e.g., "I know you struggled with rotational dynamics last week, so let's take this slow.").

---

## 4. Multi-Agent Orchestration

Drona is not a single chatbot; it is a networked intelligence system.

- **Head Agent**: The orchestrator. Receives the user's prompt, analyzes intent, and delegates to the correct sub-agent.
- **Specialist Agents**: Physics, Chemistry, Math, Biology. Each armed with custom system prompts defining their persona and rules of engagement.
- **Socratic Agent**: A strict sub-agent forbidden from giving direct answers, forcing active recall.
- **Teachers' Lounge**: An asynchronous background job where agents share logs and update the student's improvement plan overnight without user visibility.

---

## 5. Security & Isolation Guarantee

Student data privacy is the paramount architectural directive.
- **Row Level Security (RLS)**: Active on all 51 database tables. A user cannot query data that does not belong to them.
- **JWT Protection**: All auth is stateless and secure. Middleware relies on fast `getSession()` calls to avoid expensive network trips to the `getUser()` endpoint, maintaining speed without compromising safety.
- **Prompt Isolation**: System prompts are entirely separated from user input to prevent adversarial prompt injection.

---

## 6. UI Concept Designs & Aesthetic

The directive for the UI is **Premium Minimalism**. 
- **Typography**: `Playfair Display` for elegant headings and `Inter` for highly legible UI elements.
- **No Clutter**: Hide scrollbars where possible (allow scrolling functionally), utilize expansive whitespace.
- **Dynamic Feedback**: Micro-animations on buttons, skeleton loaders that pulse softly, and environment transitions that fade elegantly rather than snapping.
- **State Changes**: The UI physically responds to the student's state. If the student selects a "stressed" mood, the UI dims and the agent switches to a slower, more reassuring visual cadence.

> **Execution Standard:** If the platform does not immediately elicit a "wow" reaction and feel like a $50M evaluation product upon first launch, the design has failed. Perfection in padding, contrast, and motion is mandatory.
