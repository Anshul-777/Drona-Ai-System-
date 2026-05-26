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

## [2026-05-26] Platform Dashboard & UI Polish

- **Platform Shell Header Refinements**:
  - Fully reworked the profile UI block (`PlatformShell.tsx`) to match the conceptual hexagonal/HUD premium design.
  - Ensured horizontal tech lines span the right side perfectly, precisely mapping heights so lines never obscure text or cross element boundaries.
  - Rebuilt the central avatar tech-rings into distinct separate shapes: an un-rotating outer broken dashed hexagon, surrounding two tiny spinning inner circular rings closely hugging the user portrait.
  - Transitioned the level badge into a precise polygon shield with `clip-path` styling, configured to change its background gradient dynamically based on the active environment's signature color scheme.
  - Fully removed dummy data points, initializing starting status stats: Level 0, Rank "Recruit", and XP progress bar sitting at 0% showing a clean "0 / 100".
  - Moved the profile component container further to the right using layout margins to align beautifully with the dashboard edges, and shifted the utility actions block rightwards as a unified cluster to preserve balanced pacing.
  - Lowered the profile HUD component vertically (`translate-y-[3px]`) to enforce a seamless overlap where its bottom tech accent line perfectly merges with the header's bottom border.
  - Added a premium staggered slide-up and fade-in animation cascade to the sidebar navigation items and internal elements, triggering smoothly upon opening via an eased transition curve (`cubic-bezier`).
  - Globally disabled all visible scrollbars (`::-webkit-scrollbar { display: none; }` and `-ms-overflow-style: none`) while preserving full native scroll functionality for an ultra-clean, flush aesthetic.
  - Renamed the "Learning" environment tab to "Learn".
  - Implemented dynamic Sidebar architecture mapped entirely from `My Plan.md`: The sidebar content (titles, navigation items, agents, bottom buttons) now strictly updates based on the active Environment (Learn, Test, Play, Workspace, Resources, Career). 
  - Sidebar aesthetics completely respect the active Environment's custom color mapping (Hex/RGB), applying it beautifully to the active tab backgrounds, section titles, and primary action buttons.
  - Sidebar transitions visually updated to a clean, sideways-free "Crossfade" animation when toggling environments.
  - Fixed a nested `<a>` element rendering bug by passing the `/platform` navigation link directly to the `<Logo>` component's prop, ensuring proper client-side routing to the main Learn dashboard instead of the landing page.
  - **Major Structural Refactor**: Cleaned up the frontend `src/app/(platform)` routing folder. Reorganized over 30 loose sidebar paths into their properly encapsulated Next.js route groups (`(main-learning)`, `(test)`, `(game)`, `(workspace)`, `(resources)`, `(career)`).
  - Created highly stylized "Under Development" placeholder pages for all ~30+ environment sub-pages, complete with adaptive titles matching the specific page route to inform users that those sections are currently being calibrated. Centered them perfectly using calculated viewport height (`min-h-[calc(100vh-120px)]`).
  - Mapped all individual Agent entries (e.g., Physics Agent, Math Agent, Rank Predictor) to their own dedicated routes and placeholders. Also assigned paths to bottom actions (`/dock`, `/settings`).
  - Refined main Learn Dashboard (`platform/page.tsx`) design spacing and typography. Reduced overly huge display titles, optimized `px` and `py` paddings, and increased max-width to `1600px` for a cleaner, balanced, less-unsettling widescreen UI.

> **CHECKPOINT: DASHBOARD COMPLETION (EXCLUDING ONBOARDING/TEST ENGINE)**
> The entire Platform Dashboard shell is now deeply architected, cleanly styled, and fully functional. Environment sidebars transition perfectly, all navigation links are mapped, and dynamic custom colors apply correctly. The UI sets a highly premium 50-million-dollar aesthetic standard. All that remains un-implemented inside this shell are the actual feature components inside the placeholder routes, and the external onboarding/test engine loops.
