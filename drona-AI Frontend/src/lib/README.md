"""
Lib - Business Logic & Agents

Core business logic for frontend:

1. agents/ - Client-side agent coordination
   - head-agent.ts - Local Head Agent instance
   - types.ts - Agent message types
   - message-bus.ts - Inter-component messaging

2. core/
   - db/
     - supabase-client.ts - Supabase browser client
     - queries/ - Typed query helpers
   - rag/
     - client.ts - RAG query client
   - llm/
     - provider-router.ts - Which LLM to use
     - streaming.ts - SSE streaming

3. gamification/
   - xp-engine.ts - Calculate XP awards
   - level-calculator.ts - Level from XP
   - streak-engine.ts - Streak logic
   - mission-engine.ts - Mission generation

4. subscription/
   - gating.ts - Check feature access
   - usage-tracker.ts - Track usage quotas

5. analytics/
   - stats-engine.ts - 6-stat calculations
   - heatmap-engine.ts - Weakness heatmap
   - attention-tracker.ts - Reading time tracking

6. utils/
   - constants.ts - App-wide constants
   - env.ts - Environment variables
   - types.ts - TypeScript types
   - validators.ts - Zod validation schemas

TODO: Implement each module
"""

export {};
