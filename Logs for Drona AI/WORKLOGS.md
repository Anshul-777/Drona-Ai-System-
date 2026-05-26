# DRONA AI Platform Worklogs

## [2026-05-04] Running Frontend and Backend Environments

- Attempted to start the project via `pnpm run dev`.
- Identified a missing dependency `dotenv` in `@drona/backend`.
- Installed `dotenv` for `@drona/backend` using `pnpm --filter @drona/backend add dotenv`.
- Successfully restarted both development environments:
  - Backend is running on `http://localhost:3001`
  - Frontend is running on `http://localhost:5173`

## [2026-05-08] AI Agent Nexus Initial Phase Build

- Created a fresh Next.js 14 App Router workspace in `Drona-AI Frontend` with TypeScript, Tailwind, and ESLint.
- Added project dependencies for motion, auth, AI, persistence, and state:
  - `framer-motion`, `next-auth`, `@google/generative-ai`, `zustand`, `zod`, `react-hook-form`, `@prisma/client`, `prisma`.
- Implemented premium landing page for AI Agent Nexus with editorial styling and environment color language.
- Implemented Google OAuth integration through NextAuth:
  - Sign-in route and Google sign-in button
  - Session-aware protected routes (`/onboarding`, `/initialize`, `/app-shell`)
- Implemented onboarding assessment engine:
  - Static profiling question layer
  - Gemini 1.5 adaptive question generation endpoint
  - Exact skip warning message: `Warning: This may lead to Improper Initialization of Agents and Profiling.`
  - Final stage user skill test with scoring and persisted report
- Implemented Prisma schema for initial persistence architecture:
  - `UserProfile`, `AssessmentSession`, `AssessmentAnswer`, `SkillTestAttempt`, `ByokCredential`, `AgentInitialization`
- Implemented BYOK API with encryption at rest using AES-256-GCM for Gemini/Groq/OpenRouter keys.
- Implemented 3-minute initialization sequence UI with Framer Motion:
  - Stage progression for neural mapping, indexing, deployment, and handshake
  - Live BYOK editing and live agent initialization parameter editing during countdown
- Added `SESSION_LOG.md` in frontend root to preserve architecture rationale and continuation state for future sessions.

----------------------------------------------------------------------------------------------

> **CHECKPOINT**: till auth completion no logs exist and from now onboarding, here are logs.

## [2026-05-25] Assessment Onboarding Flow & Architecture Unification

- **Backend Architecture Consolidation**:
  - Restored the Python backend (`drona-AI Backend`) as the primary Assessment Agent to meet the "one backend architecture" requirement.
  - Deleted the conflicting Next.js API route (`src/app/api/assessment/agent/route.ts`).
  - Updated `app/main.py` to use `gemini-1.5-flash` for reliability.
  - Configured the system instruction to explicitly demand 10-15 dynamic questions for thorough psychological/academic profiling.
  - Enforced in-memory session persistence (`sessions` dict) using `uuid` tracking for stateless API calls.

- **Frontend Flow Redesign (`AssessmentEngine.tsx`)**:
  - Limited the static baseline questions to exactly 7.
  - Transitioned the frontend to call the Python backend at `http://localhost:8000/api/agent/init` and `/next`.
  - Implemented the Final Test Logic: Once the agent flags `profile_complete: true`, the user is presented with a static question: "Would you like to give a Knowledge test to better assess your profile?".
  - Added conditional routing:
    - **"Yes"**: Redirects to the `/test` page (Test Mode).
    - **"Skip"**: Triggers the cinematic initialization UI, followed by a redirect to the main dashboard (`/platform`).
  - Enhanced the Initialization Cinematic UI with BYOK (Bring Your Own Key) provider selection and realistic Premium Subscription tiers.
