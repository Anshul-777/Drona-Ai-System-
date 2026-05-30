# Drona AI Project State and Gamification Analysis

> This document is a codebase-state snapshot built from the plan folder plus the current workspace tree. It separates what is actually present in the repo from what still needs to be finished.

## 1. Core Project Overview

Drona AI is a multi-agent education platform for Indian exam preparation, centered on Class 10, Class 11, Class 12, JEE, NEET, CET, and board-exam workflows. The project is not a generic chatbot wrapper; it is meant to behave like an AI learning operating system where tutoring, testing, memory, planning, resources, and gamification all live inside one environment.

The primary objective is to convert study activity into measurable progress. The system is designed to assess a student, build a profile, route questions to the right agent, track mastery over time, and turn learning actions into XP, streaks, ranks, badges, quests, and rewards. The long-term build target is a unified product with:

- An authenticated student workspace.
- A multi-agent learning core led by Drona.
- Separate environment shells for learning, tests, game, workspace, resources, and career.
- Persistent memory, analytics, and personalization.
- Real gamification that reflects learning behavior rather than cosmetic points.

What we are building, in practical terms, is a route-grouped Next.js frontend plus a Python/FastAPI backend that already exposes assessment and chat APIs, with supporting systems for Supabase, RAG, agent orchestration, analytics, and game-state tracking.

## 2. Game Environment Breakdown

The game environment is the motivation layer of the platform. It is themed as the Gold environment and is intended to make learning feel like progress inside a competitive academic system instead of a passive dashboard.

### Current game structure in the repo

The frontend already has dedicated game routes for the core loop:

- `/game` for the lobby/home state.
- `/game/xp` for XP and streak progress.
- `/game/leaderboard` for ranking.
- `/game/boss` for boss-battle style challenges.
- `/game/missions` for quests and daily objectives.
- `/game/badges` for achievements.
- `/game/tournaments` for competitive events.
- `/game/marketplace` for rewards and exchange.

The platform shell also wires gamified behavior into the app-wide experience. It triggers environment badges, notifications, and achievement unlocks when the student moves between environments, and it exposes XP-related navigation in the shell-level UI.

### Current mechanics represented

The current logic model is built around these mechanics:

- XP and level progression as the primary growth currency.
- Streaks as daily consistency tracking.
- Missions and quests as short-cycle objectives.
- Leaderboards as rank-based competition.
- Boss battles and tournaments as high-intensity test events.
- Badges as collectible achievement milestones.
- Marketplace and rewards as the conversion layer for earned progress.

### Visual progress and skill progression

Progress is not meant to live only in numbers. The repo already shows the intended visual language through the stats and progress pages, the environment shell, notification popups, and the architecture screens. The skill model is tied to:

- Subject-agent pages for Physics, Chemistry, Math, Biology, and other subjects.
- Stat and radar-style performance views.
- Profile and progress pages in the learning environment.
- Achievement unlocks and celebratory notifications.

The current design direction is clear: the student should see learning as a visible progression graph, not just a chat transcript.

## 3. Current Build Status

This section is a strict inventory of what is already present in the repository now. It does not claim that every screen is production-complete; it records the existing implementation surface.

### Frontend foundation

- Next.js App Router project with TypeScript.
- Tailwind-based styling.
- React 19, Next 16, and modern app dependencies already installed.
- Supporting libraries for D3, KaTeX, Mermaid, Supabase, React Query, Framer Motion, and AI tooling.

### Auth and onboarding surfaces

Implemented auth and onboarding pages currently present in the route tree:

- `/` landing page.
- `/login`.
- `/signup`.
- `/reset-password`.
- `/success`.
- `/onboarding`.
- `/begin`.

The onboarding flow is backed by the `AssessmentEngine` component, which already contains:

- 7 baseline psychological and scientific assessment questions.
- Adaptive follow-up question generation logic.
- Single-select, multi-select, and text-only response types.
- Cinematic initialization stages.
- BYOK, subscription, and preference controls in the UI state.

### Platform shell and global UI

The authenticated shell is already present through `PlatformShell`, which currently handles:

- Session-based auth checking.
- Environment tab switching.
- User and profile loading.
- Welcome and achievement notifications.
- Environment badge unlocking.

Supporting UI components already exist for:

- Logo rendering.
- Achievement icons.
- Achievement popup.
- Notification popup.
- Under-development placeholder states.

### Main learning environment pages

The learning environment already has route files for:

- `/platform`.
- `/drona`.
- `/planner`.
- `/progress`.
- `/kb`.
- `/profile`.
- `/achievements`.
- `/notifications`.
- `/shop` and `/shop/[productId]`.
- `/agent/physics`.
- `/agent/chemistry`.
- `/agent/math`.
- `/agent/biology`.
- `/agent/others`.

### Test environment pages

The test environment already has route files for:

- `/test`.
- `/test/viva`.
- `/test/pressure`.
- `/test/surprise`.
- `/test/breakdown`.
- `/test/predictor`.
- `/test/weak`.
- `/test/sim`.
- `/test/handwritten`.

### Game environment pages

The game environment already has route files for:

- `/game`.
- `/game/xp`.
- `/game/leaderboard`.
- `/game/boss`.
- `/game/missions`.
- `/game/badges`.
- `/game/tournaments`.
- `/game/marketplace`.

### Workspace environment pages

The workspace environment already has route files for:

- `/workspace`.
- `/workspace/database`.
- `/workspace/planner`.
- `/workspace/tasks`.
- `/workspace/timer`.
- `/workspace/weekly`.
- `/workspace/personalize`.
- `/workspace/parent`.

### Resources environment pages

The resources environment already has route files for:

- `/resources`.
- `/resources/search`.
- `/resources/pdf`.
- `/resources/video`.
- `/resources/pyq`.
- `/resources/flashcards`.
- `/resources/flow`.
- `/resources/audio`.
- `/resources/formulas`.

### Career environment pages

The career environment already has route files for:

- `/career`.
- `/career/trends`.
- `/career/challenges`.
- `/career/interview`.
- `/career/skills`.
- `/career/resume`.

### Agent dock and global navigation

The repo also contains a dedicated agent dock surface:

- `/agent-dock`.
- `/agent-dock/settings`.
- `/agent-dock/memory`.
- `/agent-dock/lounge`.
- `/agent-dock/architecture`.

The architecture page is especially important because it visualizes the agent topology and internal message flow. It already models Drona, subject tutors, evaluation agents, gamification agents, and workspace and career orchestration.

### Backend surface

The backend is a FastAPI application with the following current implementation areas:

- `app/main.py` as the application entrypoint.
- `app/api/drona.py` as the chat and session router.
- `app/api/auth.py`.
- `app/api/assessments.py`.
- `app/api/tests.py`.
- `app/api/game.py`.
- `app/api/workspace.py`.
- `app/api/rag.py`.
- `app/api/analytics.py`.
- `app/api/gemini_fallback.py`.

Agent and core modules already present include:

- `app/agents/head_agent.py`.
- `app/agents/subject_agents.py`.
- `app/agents/stats_analyzer_agent.py`.
- `app/agents/quest_agent.py`.
- `app/agents/notification_agent.py`.
- `app/agents/memory_agent.py`.
- `app/agents/learning_strategist_agent.py`.
- `app/core/db/client.py`.
- `app/core/db/queries_users.py`.
- `app/core/rag/pipeline.py`.
- `app/core/llm/provider_router.py`.
- `app/core/config/database.py`.
- `app/utils/jwt_utils.py`.
- `app/utils/logging_utils.py`.
- `app/utils/subscription_utils.py`.

The current backend state indicates real scaffolding for chat, assessment, memory, RAG, and domain agents, but not a finished production-grade learning OS.

## 4. Remaining Roadmap

This is the work still required to finish the project as described in the plan docs and workspace notes.

### Core platform completion

- Replace prototype persistence with the final production database layer.
- Finish Supabase Postgres schema, migrations, and RLS rules.
- Connect auth, user profile, assessment output, gamification state, and chat history to persistent storage.
- Finish the environment switcher and make every environment route consistent across desktop and mobile layouts.
- Complete loading, error, empty, and offline states across the platform.

### Learning and agent orchestration

- Finish the head-agent orchestration layer.
- Implement subject-agent routing with memory-aware response shaping.
- Finish teacher-to-teacher coordination for the lounge and internal debate layer.
- Add a durable memory mesh that persists preferences, mistakes, mastery, and student-specific rules.
- Finish slash-command support and mode switching for short, detailed, Socratic, and simplified explanations.
- Complete adaptive teaching logic for stress, distraction, pacing, and explanation depth.

### Test and assessment systems

- Finish the mock-test generator.
- Finish viva, interview, handwritten answer evaluation, and exam-simulation flows.
- Add strict grading logic for conceptual, procedural, careless, and confidence-based mistakes.
- Add weak-topic retesting and crash-revision generation.
- Finish rank prediction, confidence-vs-accuracy graphs, and post-exam breakdowns.

### Game and motivation systems

- Finish validated XP awarding so progress is tied to meaningful activity.
- Implement levels, streaks, penalties, and reward conversion logic.
- Finish missions, tournaments, boss battles, and leaderboard resets.
- Add badge claiming, rarity handling, and achievement history.
- Complete the reward marketplace and the rules for earning and spending credits.
- Add anti-idle and anti-farm checks so the gamification layer cannot be abused.

### Workspace and planning systems

- Finish the notebook-style database and note workspace.
- Complete the planner, tasks, timer, and weekly review flows.
- Add the student-parent reporting layer.
- Add personal preference capture and workspace-level memory sync.
- Finish the concept graph, file organization, and resource linking inside the workspace.

### Resources and content tools

- Finish the image-to-solution pipeline.
- Complete OCR, PDF annotation, and searchable formula vault behavior.
- Finish flashcards, flow diagrams, audio output, and video-based learning surfaces.
- Add ingestion and indexing for syllabus, PYQs, notes, and approved user uploads.
- Connect resource tools to the main chat so they can be used without leaving the learning flow.

### Career and post-exam systems

- Finish the career roadmap, skills, trends, challenges, interviews, and resume flows.
- Add recommendation logic that ties career guidance back to academic progress.
- Connect career readiness to the student profile and mastery model.

### Analytics and intelligence layer

- Finish the 6-stat radar model and make the metrics stable across sessions.
- Implement the forgetting curve and revision scheduling logic.
- Add attention-time detection, procrastination detection, and break suggestions.
- Add topic mastery scoring, concept dependency mapping, and weakness heatmaps.
- Finish the reporting pipeline for weekly, parent, and long-term progress summaries.

### Infrastructure and security

- Complete production deployment architecture.
- Add rate limiting, audit logging, and safe provider fallbacks.
- Harden key management for BYOK and external provider routing.
- Finish tests, CI validation, and environment-specific configuration checks.
- Remove prototype-only assumptions from the backend and align the stack with the final architecture.

## 5. Bottom Line

The repository is past the pure-idea stage. The app already has a strong route structure, a real onboarding assessment engine, a game shell, a workspace shell, an agent dock, and a FastAPI backend with core modules. What remains is not just more pages, but the hard work of connecting those pages into one persistent learning system with production storage, validated gamification, and adaptive multi-agent behavior.
