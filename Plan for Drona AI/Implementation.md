# DRONA AI — Complete Implementation Plan

> **Source of Truth**: 
[Drona AI Documentation.html](file:///c:/Users/anshu/OneDrive/Desktop/Drona%20AI/Plan%20for%20Drona%20AI/Drona%20AI%20Documentation.html) (3,488 lines) + [Master Specific Instructions.md](file:///c:/Users/anshu/OneDrive/Desktop/Drona%20AI/Plan%20for%20Drona%20AI/Master%20Specific%20Instructions.md) + [Specific Rules.md](file:///c:/Users/anshu/OneDrive/Desktop/Drona%20AI/Plan%20for%20Drona%20AI/Specific%20Rules.md) (50 Hard Rules)

---

## What This System Is

DRONA AI is a **multi-agent AI education platform** targeting Indian students preparing for JEE, NEET, CET, and Board exams. It is NOT a chatbot wrapper. It is an orchestrated system where:

- **14+ specialized AI agents** coordinate via a Head Agent (Drona) using an internal message bus
- **6 distinct environments** (Main Learning, Test, Game, Workspace, Resources, Career) each with dedicated UI themes, sidebars, and feature sets
- **Dual-database RAG** separates curated Platform knowledge from private User knowledge with priority rules
- **Real gamification** (XP, Levels, Streaks, Missions, Boss Battles, Leaderboard) is wired to verified learning actions
- **Freemium subscription** (Free / Pro ₹299 / Enterprise ₹799) with real gating and BYOK key support

---

## Tech Stack (From Documentation Section 09)

| Layer | Technology | Rationale (from doc) |
|---|---|---|
| **Frontend** | Next.js 14 + React + TypeScript | SSR for SEO on landing, CSR for app. Route groups for environment isolation |
| **Styling** | Tailwind CSS + Shadcn/UI | Doc specifies this explicitly. Environment themes via CSS custom properties |
| **Typography** | Playfair Display / Inter / JetBrains Mono | From Design System section 15 |
| **Backend API** | Next.js API Routes (upgrade to Fastify later) | Unified deployment on Vercel for MVP. Doc says Express/Fastify |
| **Primary DB** | PostgreSQL via Supabase | Auth + RLS + real-time subscriptions. Schema defined in doc section 10 |
| **Vector DB** | Pinecone | Memory Mesh + Platform RAG + User RAG. Namespace-isolated per user |
| **Cache/Queue** | Upstash Redis + QStash | Session state, rate limiting, background jobs (Teachers' Lounge, reports) |
| **File Storage** | Cloudflare R2 (S3-compatible) | Zero egress fees for student downloads |
| **LLM Providers** | Gemini Flash → Groq → OpenRouter → BYOK | Fallback chain from doc section 09 |
| **Embeddings** | Gemini Embedding API / sentence-transformers | 768-dim vectors. Doc specifies both options |
| **OCR** | Google Cloud Vision + Mathpix | Text + math equation recognition |
| **Auth** | Supabase Auth (JWT + Google OAuth + Phone OTP) | India-optimized. 1hr JWT expiry, 30-day refresh |

---

## Environment Color System (From Documentation Section 15)

| Environment | Color | Hex | Meaning |
|---|---|---|---|
| Main Learning | Blue | `#2a5cff` | Trust, Intelligence, Focus |
| Test | Red | `#e8362a` | Urgency, Seriousness, Exam Mode |
| Game | Gold | `#c9a84c` | Achievement, Competition, Reward |
| Workspace | Green | `#00c896` | Organization, Calm, Productivity |
| Resources | Purple | `#9b5de5` | Creativity, Tools, Production |
| Career | Navy-Silver | `#1a1a2e` | Professionalism, Future |

---

## Phase 1: Project Scaffolding & Design System

### [NEW] Project Initialization

```
npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir
```

Install core dependencies:
```
shadcn/ui, @supabase/supabase-js, @supabase/ssr, 
@pinecone-database/pinecone, @upstash/redis, @upstash/qstash,
ai (Vercel AI SDK), @google/generative-ai, groq-sdk,
katex, mermaid, d3, zustand, zod, date-fns, 
react-hook-form, @tanstack/react-query, uuid
```

### [NEW] Complete Folder Structure (200+ files target)

```
src/
├── app/
│   ├── (auth)/                          # Auth route group
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── onboarding/page.tsx          # Assessment + profile setup
│   │   └── layout.tsx
│   ├── (platform)/                      # Authenticated app shell
│   │   ├── layout.tsx                   # Persistent sidebar + topbar
│   │   ├── (main-learning)/             # Blue environment
│   │   │   ├── chat/page.tsx            # Core AI chat
│   │   │   ├── syllabus/page.tsx        # Syllabus map
│   │   │   ├── planner/page.tsx         # Study planner
│   │   │   ├── stats/page.tsx           # Stats & progress
│   │   │   ├── profile/page.tsx         # Student profile
│   │   │   └── layout.tsx              
│   │   ├── (test)/                      # Red environment
│   │   │   ├── dashboard/page.tsx       # Test home
│   │   │   ├── mock/page.tsx            # Mock test generator
│   │   │   ├── mock/[id]/page.tsx       # Active test
│   │   │   ├── mock/[id]/results/page.tsx
│   │   │   ├── surprise/page.tsx        # Surprise test modal
│   │   │   ├── viva/page.tsx            # Viva examiner
│   │   │   ├── weak-topics/page.tsx     # Weak-topic tests
│   │   │   ├── exam-sim/page.tsx        # Exam day simulation
│   │   │   └── layout.tsx
│   │   ├── (game)/                      # Gold environment
│   │   │   ├── lobby/page.tsx           # Game home + radar chart
│   │   │   ├── missions/page.tsx        # Daily/weekly missions
│   │   │   ├── leaderboard/page.tsx     # All-India ranking
│   │   │   ├── boss-battle/page.tsx     # Multiplayer battles
│   │   │   ├── badges/page.tsx          # Achievement badges
│   │   │   └── layout.tsx
│   │   ├── (workspace)/                 # Green environment
│   │   │   ├── database/page.tsx        # Notion-style file tree + editor
│   │   │   ├── planner/page.tsx         # Calendar + todo + timer
│   │   │   ├── focus/page.tsx           # Focus timer
│   │   │   ├── reports/page.tsx         # Weekly + parent reports
│   │   │   └── layout.tsx
│   │   ├── (resources)/                 # Purple environment — COMING SOON
│   │   │   ├── page.tsx                 # Coming soon hub
│   │   │   ├── image-solver/page.tsx    # Image-to-solution (active)
│   │   │   ├── flashcards/page.tsx      # Coming soon
│   │   │   ├── formula-vault/page.tsx   # Coming soon
│   │   │   ├── audio-podcast/page.tsx   # Coming soon
│   │   │   ├── pyq-analyzer/page.tsx    # Coming soon
│   │   │   └── layout.tsx
│   │   ├── (career)/                    # Navy environment — COMING SOON
│   │   │   ├── page.tsx                 # Coming soon hub
│   │   │   └── layout.tsx
│   │   └── settings/page.tsx            # Persona, BYOK, preferences
│   ├── api/                             # Backend API routes
│   │   ├── auth/
│   │   │   └── callback/route.ts
│   │   ├── chat/
│   │   │   └── route.ts                 # Streaming chat endpoint
│   │   ├── agents/
│   │   │   ├── route.ts                 # Agent orchestration entry
│   │   │   └── teachers-lounge/route.ts # Nightly review cron
│   │   ├── tests/
│   │   │   ├── generate/route.ts
│   │   │   ├── submit/route.ts
│   │   │   └── grade/route.ts
│   │   ├── workspace/
│   │   │   ├── notes/route.ts
│   │   │   ├── files/route.ts
│   │   │   └── schedule/route.ts
│   │   ├── game/
│   │   │   ├── xp/route.ts
│   │   │   ├── missions/route.ts
│   │   │   └── leaderboard/route.ts
│   │   ├── rag/
│   │   │   ├── query/route.ts
│   │   │   └── embed/route.ts
│   │   ├── subscription/
│   │   │   └── route.ts
│   │   └── ocr/
│   │       └── route.ts
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Landing page
│   └── globals.css                      # Design system tokens
├── lib/
│   ├── agents/                          # Agent orchestration layer
│   │   ├── types.ts                     # AgentMessage, AgentResponse interfaces
│   │   ├── head-agent.ts                # Central orchestrator (Drona)
│   │   ├── router.ts                    # Query classification + routing
│   │   ├── subject-agents/
│   │   │   ├── physics.ts
│   │   │   ├── chemistry.ts
│   │   │   ├── math.ts
│   │   │   └── biology.ts
│   │   ├── system-agents/
│   │   │   ├── memory-agent.ts          # Memory Mesh manager
│   │   │   ├── stats-agent.ts           # Analytics computation
│   │   │   ├── adaptation-agent.ts      # Behavioral analyzer
│   │   │   ├── workspace-agent.ts       # File/note management
│   │   │   └── schedule-agent.ts        # Study planner
│   │   ├── test-agents/
│   │   │   ├── test-agent.ts            # Question generation
│   │   │   ├── grader-agent.ts          # Answer evaluation
│   │   │   └── viva-agent.ts            # Oral examination
│   │   ├── game-agents/
│   │   │   ├── quest-agent.ts           # Mission generation
│   │   │   └── ranking-agent.ts         # Leaderboard computation
│   │   ├── onboarding/
│   │   │   ├── assessment-agent.ts      # Diagnostic test flow
│   │   │   └── tour-agent.ts            # Platform walkthrough
│   │   ├── prompt-templates/            # Per-agent prompt engineering
│   │   │   ├── head-agent-system.ts     # 5-layer prompt architecture
│   │   │   ├── physics-system.ts
│   │   │   ├── chemistry-system.ts
│   │   │   ├── math-system.ts
│   │   │   ├── biology-system.ts
│   │   │   ├── grader-system.ts
│   │   │   ├── socratic-system.ts
│   │   │   └── persona-modifiers.ts     # Strict/Friendly/Coach overlays
│   │   └── teachers-lounge.ts           # Nightly cross-agent review
│   ├── core/
│   │   ├── db/
│   │   │   ├── supabase-client.ts       # Server + browser clients
│   │   │   ├── supabase-admin.ts        # Service role client
│   │   │   ├── schema.sql               # Full PostgreSQL schema
│   │   │   ├── migrations/              # Version-controlled migrations
│   │   │   │   └── 001_initial.sql
│   │   │   └── queries/                 # Typed query functions
│   │   │       ├── users.ts
│   │   │       ├── student-stats.ts
│   │   │       ├── test-results.ts
│   │   │       ├── chat-sessions.ts
│   │   │       ├── workspace.ts
│   │   │       ├── missions.ts
│   │   │       ├── leaderboard.ts
│   │   │       └── subscriptions.ts
│   │   ├── rag/
│   │   │   ├── pipeline.ts              # Full RAG query flow
│   │   │   ├── embeddings.ts            # Embed generation (Gemini/HF)
│   │   │   ├── chunker.ts              # Document chunking (500/400 tokens)
│   │   │   ├── pinecone-client.ts       # Vector DB client
│   │   │   ├── reranker.ts              # Cross-encoder re-ranking
│   │   │   └── priority-rules.ts        # Platform vs User vs Memory priority
│   │   ├── llm/
│   │   │   ├── provider-router.ts       # Multi-provider routing + fallback
│   │   │   ├── providers/
│   │   │   │   ├── gemini.ts
│   │   │   │   ├── groq.ts
│   │   │   │   ├── openrouter.ts
│   │   │   │   └── byok.ts             # Bring Your Own Key handler
│   │   │   ├── token-counter.ts
│   │   │   └── cost-tracker.ts
│   │   ├── cache/
│   │   │   ├── redis-client.ts          # Upstash Redis
│   │   │   ├── session-store.ts
│   │   │   └── rate-limiter.ts
│   │   └── queue/
│   │       ├── qstash-client.ts         # Background job scheduling
│   │       └── jobs/
│   │           ├── teachers-lounge.ts
│   │           ├── weekly-report.ts
│   │           ├── forgetting-curve.ts
│   │           └── surprise-test.ts
│   ├── gamification/
│   │   ├── xp-engine.ts                # XP award rules + validation
│   │   ├── level-calculator.ts          # Exponential level thresholds
│   │   ├── streak-tracker.ts           # Daily streak logic
│   │   ├── mission-generator.ts        # Daily/weekly/milestone missions
│   │   ├── badge-engine.ts             # Achievement unlocks
│   │   └── leaderboard-computer.ts     # Rank computation + history
│   ├── subscription/
│   │   ├── plans.ts                     # Free/Pro/Enterprise definitions
│   │   ├── gating.ts                   # Feature access checks
│   │   ├── usage-tracker.ts            # Per-day message/test limits
│   │   └── billing.ts                  # Razorpay/Stripe scaffold
│   ├── analytics/
│   │   ├── stats-engine.ts             # 6-stat radar computation
│   │   ├── heatmap-engine.ts           # Weakness heatmap builder
│   │   ├── forgetting-curve.ts         # Modified Ebbinghaus per student
│   │   ├── attention-tracker.ts        # Dwell time + engagement
│   │   ├── error-classifier.ts         # Conceptual/Procedural/Careless/Gap
│   │   └── report-generator.ts         # Weekly + parent reports
│   └── utils/
│       ├── constants.ts
│       ├── env.ts                       # Environment variable validation
│       ├── types.ts                     # Shared TypeScript types
│       └── validators.ts               # Zod schemas
├── components/
│   ├── ui/                             # Shadcn/UI base components
│   ├── layout/
│   │   ├── Topbar.tsx                  # Persistent header: brand + env switcher + XP + avatar
│   │   ├── Sidebar.tsx                 # Environment-aware sidebar
│   │   ├── EnvironmentSwitcher.tsx     # 6-environment selector
│   │   └── MobileNav.tsx
│   ├── chat/
│   │   ├── ChatContainer.tsx           # Main chat shell
│   │   ├── MessageBubble.tsx           # AI/User message
│   │   ├── ChatInput.tsx               # Input with slash commands
│   │   ├── SlashCommandMenu.tsx        # /socratic, /5min, /eli5, etc.
│   │   ├── TeachingModeSwitch.tsx      # Standard/Story/Gamified toggle
│   │   └── DatabaseToggle.tsx          # "Use My Database" switch
│   ├── test/
│   │   ├── TestInterface.tsx           # Question display + navigation
│   │   ├── QuestionPalette.tsx         # Answered/unanswered/flagged
│   │   ├── Timer.tsx                   # Countdown timer
│   │   ├── ResultsDashboard.tsx        # Post-test analysis
│   │   └── ConfidenceRater.tsx         # Per-question confidence input
│   ├── game/
│   │   ├── RadarChart.tsx              # 6-stat hexagonal chart (D3)
│   │   ├── XPCounter.tsx               # Animated XP display
│   │   ├── LevelBadge.tsx              # Level indicator
│   │   ├── StreakFlame.tsx             # Streak counter
│   │   ├── MissionCard.tsx             # Quest display
│   │   └── LeaderboardTable.tsx        # Rank table
│   ├── workspace/
│   │   ├── FileTree.tsx                # Folder hierarchy
│   │   ├── BlockEditor.tsx             # Notion-style editor
│   │   ├── CalendarView.tsx            # Month/week/day
│   │   ├── TodoList.tsx                # Prioritized tasks
│   │   ├── FocusTimer.tsx              # Pomodoro timer
│   │   └── ReportCard.tsx              # Weekly report display
│   ├── shared/
│   │   ├── WeaknessHeatmap.tsx         # Subject mastery grid
│   │   ├── LatexRenderer.tsx           # KaTeX wrapper
│   │   ├── MermaidDiagram.tsx          # Diagram rendering
│   │   ├── MoodPicker.tsx              # Emoji mood selector
│   │   ├── SubscriptionGate.tsx        # Feature lock overlay
│   │   └── ComingSoonPage.tsx          # Reusable coming soon shell
│   └── onboarding/
│       ├── AssessmentFlow.tsx          # Multi-step profile builder
│       ├── DiagnosticTest.tsx          # Baseline test
│       └── TourOverlay.tsx             # Guided platform tour
└── hooks/
    ├── useChat.ts                      # Chat state management
    ├── useEnvironment.ts               # Current environment context
    ├── useStudentProfile.ts            # Profile data + mutations
    ├── useSubscription.ts              # Plan checks
    ├── useXP.ts                        # XP + level state
    └── useRealTimeUpdates.ts           # Supabase realtime subscriptions
```

---

## Phase 2: Database Schema (From Documentation Section 10)

The schema mirrors the documentation's PostgreSQL specification exactly. Core tables:

### Users Table
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  avatar_url    TEXT,
  exam_target   TEXT,           -- 'JEE_MAIN' | 'JEE_ADV' | 'NEET' | 'CET' | 'BOARDS'
  class_level   INT,            -- 10, 11, 12
  board         TEXT,           -- 'CBSE' | 'ICSE' | 'STATE'
  persona_mode  TEXT DEFAULT 'friendly',  -- 'strict' | 'friendly' | 'coach'
  learning_speed JSONB,         -- {"physics": "fast", "chemistry": "slow", ...}
  tier          TEXT DEFAULT 'free',      -- 'free' | 'pro' | 'enterprise'
  xp_total      INT DEFAULT 0,
  xp_year       INT DEFAULT 0,  -- Current year XP for leaderboard
  level         INT DEFAULT 1,
  streak_daily  INT DEFAULT 0,
  streak_best   INT DEFAULT 0,
  parent_email  TEXT,
  interests     TEXT[],         -- For analogy personalization
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### Student Stats Table (6-Stat Radar)
```sql
CREATE TABLE student_stats (
  user_id          UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  precision_score  FLOAT DEFAULT 50,    -- Accuracy rate
  velocity_score   FLOAT DEFAULT 50,    -- Learning speed
  depth_score      FLOAT DEFAULT 50,    -- Conceptual understanding
  discipline_score FLOAT DEFAULT 50,    -- Study consistency
  recall_score     FLOAT DEFAULT 50,    -- Retention performance
  exploration_score FLOAT DEFAULT 50,   -- Breadth of engagement
  weakness_heatmap JSONB,               -- {subject: {chapter: {topic: mastery_pct}}}
  forgetting_curves JSONB,              -- {topic_id: {last_review, retention_pct, decay_rate}}
  error_patterns   JSONB,               -- {conceptual: N, procedural: N, careless: N, gap: N}
  attention_avg    FLOAT DEFAULT 0,     -- Average attention score
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### Additional tables (full list):
- `test_results` — per-test scores + per_question JSONB
- `chat_sessions` — message history + agent routing logs
- `workspace_files` — notes, uploads, links with folder hierarchy
- `workspace_folders` — folder tree structure
- `flashcard_decks` + `flashcards` — spaced repetition cards
- `missions` — daily/weekly/milestone quests
- `badges` — earned achievements
- `leaderboard_snapshots` — daily rank history
- `scheduled_revisions` — forgetting curve auto-schedules
- `byok_keys` — encrypted API keys per user
- `platform_content` — curated NCERT/PYQ metadata
- `platform_questions` — tagged exam questions
- `parent_reports` — weekly generated reports
- `subscription_events` — billing lifecycle

> [!IMPORTANT]
> **Row Level Security (RLS)** is enabled on ALL user-owned tables. Every query is scoped to `auth.uid()`. This is non-negotiable per the Security section (doc section 16).

---

## Phase 3: Agent Orchestration Layer

### Head Agent — The Orchestrator (Doc Section 07)

The Head Agent follows a 5-layer prompt architecture:
1. **Identity Layer**: "You are Drona, the master teacher..."
2. **Student Profile Layer**: Dynamically injected (name, exam, weaknesses, speed, persona, mood)
3. **Session Context Layer**: Today's plan, current topic, conversation summary, memory retrieval
4. **Rules Layer**: Answer format, depth control, routing rules, pop-up question triggers
5. **Memory Layer**: Top-5 semantically relevant Memory Mesh entries

### Agent Routing Decision Tree (From Doc Section 07)
```
Student message → Head Agent receives
  → Classify domain (Physics/Chemistry/Math/Biology/General/Test/Career/Meta)
  → If domain confidence > 80% → Route to Subject Agent
  → If query is about test scheduling → Route to Test Agent
  → If query is about study planning → Handle directly
  → If query is general/motivational → Handle directly
  → If query is about workspace/notes → Route to Workspace Agent
  → If confidence < 60% → Handle directly, flag for Teachers' Lounge
```

### Agent Communication Rules (From Doc Section 08)
1. Only the Head Agent speaks to the frontend. Students never see sub-agent names or routing
2. Conflict resolution: exam proximity > weakness severity > streak maintenance. Student requests override all
3. Cross-environment communication is async (fire-and-forget with eventual consistency)
4. Memory Agent is shared — all agents read/write, deduplication handled by Memory Agent

### Teachers' Lounge (Nightly Review — Doc Section 08)
A cron job (QStash) triggered at midnight IST that:
1. Aggregates all sub-agent reports for each active student
2. Identifies performance conflicts and patterns
3. Generates next-day study plan
4. Creates targeted missions via Quest Agent
5. Stores priority memory entries
6. Adjusts session caps based on attention data

---

## Phase 4: RAG Pipeline (Doc Section 11)

### Flow (6 steps from documentation):
1. Student query received
2. Query → Gemini Embedding API → 768-dim vector
3. **Parallel search** across 3 Pinecone namespaces:
   - `platform` — Curated curriculum content
   - `user_{uuid}` — Student's personal knowledge
   - `memory_{uuid}` — Student's Memory Mesh
4. Re-rank results: Platform DB gets **1.2x priority boost**. Deduplicate. Select top-5
5. Inject top-5 chunks + memory entries + student profile into LLM prompt
6. LLM generates response grounded in retrieved context

### Priority Rules (From Doc Section 11 Table)

| Scenario | Priority Order |
|---|---|
| Exam question solving | Platform → Memory → User |
| Concept explanation | Platform → User → Memory |
| "Use My Database" ON | User → Platform → Memory |
| Study planning | Memory → Stats → Platform |
| Flashcard generation | Source-dependent |

### Chunking Rules
- Platform content: 500 tokens, 100 overlap
- User PDFs: 400 tokens, 80 overlap
- Chat memories: Atomic (50-200 tokens, no chunking)

### Search Configuration
- Similarity: Cosine, min threshold 0.72
- Top-K: Retrieve 10, re-rank via cross-encoder, inject 5
- Hybrid: 70% vector + 30% BM25 keyword

---

## Phase 5: Environment UI Implementation

### Shared Shell (All Environments)
- **Topbar**: DRONA.AI brand, Environment Switcher (6 tabs), XP counter, Level badge, Streak flame, Avatar dropdown
- **Sidebar**: Changes content per-environment. Only shows relevant pages for current environment
- XP, level, streak persist across all environments in the shared header

### Main Learning Environment (Blue #2a5cff)
- **Chat**: Streaming AI chat with slash commands (/socratic, /5min, /eli5, /story, /detailed, /short, /analogy, /visual)
- **Teaching Mode Switcher**: Standard / Story / Gamified modes
- **Database Toggle**: "Use My Database" switch
- **Syllabus Map**: Chapter grid colored by mastery level
- **Study Planner**: AI-generated daily/weekly plan
- **Stats**: 6-stat radar chart, weakness heatmap, attention curve, progress graphs
- **Profile**: Student identity, exam target, persona settings

### Test Environment (Red #e8362a)
- **Mock Test Generator**: Select subjects, difficulty, duration. Pulls from PYQ bank + AI-generated
- **Active Test UI**: Timer, question palette, flag-for-review, section navigation
- **Grader Report**: Per-question analysis, error classification, improvement plan
- **Surprise Tests**: Modal that appears based on forgetting curve predictions
- **Viva Examiner**: Conversational depth-testing (Pro/Enterprise)
- **Exam Day Simulation**: Full-lockdown 3-hour simulation (Enterprise)
- **Confidence vs Accuracy**: Post-test metacognition graph

### Game Environment (Gold #c9a84c)
- **Lobby**: Radar chart, level display, active missions, recent achievements
- **Missions Board**: Daily (60XP), weekly, milestone missions with progress bars
- **Leaderboard**: All-India, State, Same-Exam, Friends filters. Daily refresh
- **Boss Battle**: Topic-based competitive test lobby (Coming Phase 2)
- **Badges Gallery**: Earned + locked badges with unlock criteria

### Workspace Environment (Green #00c896)
- **Database**: Notion-style file tree + block editor with /slash commands
- **Scheduler**: Calendar (month/week/day) + priority to-do list + focus timer
- **Focus Timer**: Pomodoro with DND mode, feeds attention analytics
- **Reports**: Weekly auto-generated report + parent report (Pro+)

### Resources Environment (Purple #9b5de5 — Coming Soon)
- **Image-to-Solution**: ACTIVE — upload photo, OCR, AI solve step-by-step (this works in MVP)
- All other tools (Audio Podcast, Flashcards, Formula Vault, PYQ Analyzer, PDF Reader, Mind Maps): Coming Soon pages with descriptions and "Notify Me" buttons
- Proper route structure so each tool can be built independently later

### Career Environment (Navy — Coming Soon)
- Landing page showing planned features (Roadmap, Skill Gap, Resume, Interview, Coding)
- "Notify Me" buttons per feature
- Full route structure for future expansion

---

## Phase 6: Gamification System (Doc Features F-037 through F-042)

### XP Awards (Validated by Attention Tracker)
| Action | XP |
|---|---|
| Study session (30min+ active) | 50 |
| Mock test passed (>70%) | 80 |
| Pop-up question correct | 15 |
| Daily revision completed | 30 |
| Boss Battle won | 200 |
| Daily mission | 60 |
| 7-day streak bonus | 150 |
| Topic mastered (>90%) | 100 |
| Viva session | 40 |

### Level Thresholds (Exponential Curve)
L1=0, L2=500, L3=1200, L5=4000, L10=15000, L20=60000, L50=500000

### Leaderboard
- Ranked by current-year XP. Annual reset at exam season end
- Filters: All-India, State, Same-Exam, Friends
- Daily batch recomputation

---

## Phase 7: Subscription Gating (Doc Section 14)

| Feature | Free | Pro (₹299) | Enterprise (₹799) |
|---|---|---|---|
| Chat messages/day | 30 | 200 | Unlimited |
| Mock tests/month | 3 | 15 | Unlimited |
| Image solver/day | 5 | 30 | Unlimited |
| Workspace storage | 100MB | 2GB | 10GB |
| Viva Examiner | ✗ | ✓ | ✓ |
| Exam Day Simulation | ✗ | ✗ | ✓ |
| BYOK | ✗ | ✗ | ✓ |

> [!WARNING]
> Subscription tiers must be enforced via real database checks on every gated endpoint. No client-only gating. The `tier` column in the `users` table is the source of truth.

---

## Phase 8: Coming-Soon Modules

Resources and Career environments are NOT fully implemented but MUST have:
- Real routing with `layout.tsx` and `page.tsx` files
- Environment-themed layouts with correct sidebar items
- Rich coming-soon pages showing planned features with descriptions
- "Notify Me" buttons that write to a real `feature_waitlist` table
- File structure that makes future expansion drop-in, not rewrite

---

## Open Questions

> [!IMPORTANT]
> **Supabase Project**: Do you have a Supabase project set up already, or should I create the schema as SQL files that you'll apply manually?

> [!IMPORTANT]
> **API Keys**: Which API keys do you currently have available? (Gemini, Groq, Pinecone, Supabase URL/anon key). This determines which LLM providers we can wire up on Day 1 vs. leaving as env-var placeholders.

> [!IMPORTANT]
> **Tailwind CSS Version**: The documentation specifies Tailwind CSS + Shadcn/UI. Should I use Tailwind v3 (stable) or Tailwind v4 (latest)?

---

## Verification Plan

### Automated Tests
1. **Schema**: Run SQL migrations against a test Supabase instance
2. **Agent Router**: Unit tests for query classification accuracy
3. **RAG Pipeline**: Test retrieval with sample queries against seeded vectors
4. **Subscription Gating**: Test each tier's access to gated endpoints
5. **XP Engine**: Test that XP only awards for validated actions
6. **Build**: `npm run build` must pass with zero errors

### Manual Verification
1. Navigate through all 6 environments — verify correct sidebar and theme
2. Send a chat message — verify agent routing + streaming response
3. Take a mock test — verify question generation, timer, submission, grading
4. Create a workspace note — verify persistence and retrieval
5. Check XP/Level/Streak — verify state changes after verified actions
6. Test subscription gating — verify feature locks per tier
7. View Resources/Career coming-soon pages — verify proper structure







DRONA AI — Build Task Tracker

Phase 1: Scaffolding & Design System
 Initialize Next.js 14 with TypeScript + Tailwind v3
 Install all dependencies
 Create .env.example with all required API keys
 Set up globals.css with DRONA design tokens
 Create tailwind.config.ts with environment color system
 Set up core types (lib/utils/types.ts)
 Set up env validation (lib/utils/env.ts)
 Set up Zod schemas (lib/utils/validators.ts)
Phase 2: Database Layer
 Create full PostgreSQL schema SQL
 Set up Supabase client (server + browser)
 Create typed query functions for all tables
 Set up Row Level Security policies
Phase 3: Agent Orchestration
 Create agent type system + message bus interfaces
 Build Head Agent orchestrator
 Build agent router (query classification)
 Build subject agent stubs (Physics, Chemistry, Math, Biology)
 Build system agent stubs (Memory, Stats, Adaptation)
 Build test agents (Test, Grader)
 Build game agents (Quest, Ranking)
 Create prompt templates (5-layer architecture)
 Build Teachers' Lounge flow
Phase 4: Core Infrastructure
 Build LLM provider router with fallback chain
 Build Gemini provider
 Build Groq provider
 Build OpenRouter provider
 Build BYOK handler
 Build RAG pipeline
 Build embedding generation
 Build Pinecone client + namespace isolation
 Build Redis cache client
 Build rate limiter
 Build subscription gating logic
Phase 5: Environment Layouts & Pages
 Root layout with fonts + metadata
 Auth layout + login/signup pages
 Platform layout (shared topbar + sidebar)
 Main Learning layout + pages (chat, syllabus, planner, stats, profile)
 Test layout + pages (dashboard, mock, results, viva)
 Game layout + pages (lobby, missions, leaderboard, badges)
 Workspace layout + pages (database, planner, focus, reports)
 Resources layout + coming-soon pages
 Career layout + coming-soon page
 Settings page
Phase 6: Core Components
 Topbar with environment switcher + XP + avatar
 Sidebar (environment-aware)
 Chat interface (streaming + slash commands)
 Test interface (question palette + timer)
 Radar chart (6-stat D3/SVG)
 Workspace editor
 Weakness heatmap
 Coming-soon page template
Phase 7: API Routes
 Chat streaming endpoint
 Agent orchestration endpoint
 Test generation + submission + grading
 Workspace CRUD
 Game/XP/missions endpoints
 RAG query endpoint
 Subscription check endpoint
Phase 8: Gamification & Analytics
 XP engine with validation
 Level calculator
 Streak tracker
 Mission generator
 Leaderboard computation
 Stats engine (6-stat radar)
 Heatmap engine
 Error classifier
Phase 9: Verification
 npm run build passes
 All 6 environments render correctly
 Environment switching works
 Chat streaming works
 Coming-soon pages structured properly