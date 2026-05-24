Read the DRONA AI HTML documentation, the Plan.md document, and the master project instruction file in full before doing anything else. Treat those documents as the source of truth. Do not explain them back to me. Do not summarize the idea. Do not rewrite the vision in your own words unless that is required to implement it. Your task is to convert the full DRONA AI specification into a real, working, testable, production-minded system with all major environments, all core agent logic, all database logic, all retrieval logic, all personalization logic, all gamification logic, all subscription logic, all onboarding logic, and all visible workflows functioning for real.

Build the system as a serious multi-file codebase. Plan the folders first. Then build the backend. Then build the frontend. Then connect the retrieval layer. Then connect the agents. Then connect the environments. Then connect the billing, analytics, and persistence layers. Then test everything. Then fix everything. Then test again. Nothing should be a visual-only shell. Nothing should be a fake page. Nothing should be hardcoded as a pretend workflow unless it is explicitly a temporary development-only stub separated from production flows.

The architecture must follow the DRONA design exactly in spirit and in working behavior. The Main Learning Environment, Test Environment, Game Environment, and Workspace Environment must be fully real and functional. Resources Environment and Career Environment do not need full implementation if they are not in scope, but they still must exist as proper coming soon pages with real routing, real file structure, real layout shells, clear module placeholders, and a future-ready architecture so they can be expanded without redesigning the project later. Those coming soon pages must feel intentional and structured, not empty.

The system must be built around the following principle. Every major feature must have a real backend state, a real frontend state, a real persistence layer, a real route, a real validation rule, a real failure mode, a real test, and a real observable output. If a feature cannot yet be made real, then it must be represented honestly as coming soon or development-only, but still wired into the project structure properly. Do not fake intelligence. Do not fake data. Do not fake integrations. Do not fake progress. Do not fake dashboards. Do not fake locked features. Do not make pages that only look like products. Make an actual product.

First, design the file structure around the product, not around convenience. Separate the domain cleanly. Separate frontend app shell, route pages, shared UI, agent services, storage logic, retrieval logic, test logic, gamification logic, subscriptions, settings, auth, analytics, and background jobs. The file names must be clear, professional, and meaningful. Use names that make the system easy to maintain later. Build at least the structural depth that the platform deserves, with a large number of focused files rather than a few oversized files. A serious system of this scale should have a deep modular codebase, not a flattened demo. Organize the project so the DRONA brain can be understood by a human engineer and extended safely.

Now build the core data layer with absolute seriousness.

Create a real platform database schema for verified syllabus content, question banks, exam metadata, chapter maps, subject metadata, formulas, diagrams, tags, source provenance, difficulty labels, and retrieval pointers. This is the curriculum core. It must be searchable, structured, and stable. It must not be loosely dumped text. It must support precise source tracking and retrieval by exam, class, subject, chapter, topic, question type, year, and difficulty. The platform database must be modeled so it can support NCERT-aligned content, exam content, curated notes, formulas, and solved examples in a clean and queryable way.

Create a real user database schema for each student’s private data. This must include profile, preferences, learning style, exam target, class, board, language, session history, assessment results, topic mastery, weak areas, error patterns, chat memory, saved notes, uploads, bookmarks, custom instructions, bookmarks from chat, and workspace content. The user database must be private, isolated per user, and protected with row-level access boundaries or the equivalent strict isolation model. No student’s memory or uploads may leak into another student’s context. No agent may retrieve data outside the correct user boundary.

Create a real memory layer. Memory must not be a vague text dump. It must have categories. It must distinguish between short-term conversation context, long-term student preferences, topic-level misconceptions, correction history, test behavior, motivation patterns, and saved knowledge. Memory must be searchable and retrievable by semantic relevance, and it must feed every agent properly. Memory must be able to remember past mistakes, repeated confusion, preferred explanation style, pacing, language preference, and recurring weak areas. It must also have an expiration or archival strategy for stale low-value entries so retrieval stays relevant.

Create a real Redis or equivalent cache and queue layer. Use it for session state, ephemeral locks, hot retrieval, rate limiting, active study session flags, temporary agent coordination, background jobs, and scheduled reminders. Do not use Redis as a fake placeholder. Use it where caching and job coordination genuinely matter. Make the cache and queue behavior observable, testable, and safe.

Create a real analytics layer. This layer must compute the user’s learning trend, topic mastery movement, streaks, retention, correctness distribution, attention patterns, revision completion, session history, and progress summaries. The analytics layer must feed the profile, the planner, the weakness heatmap, the test engine, and the gamification engine. It must not be decorative. It must be the actual source of truth for progress reporting.

Now build the retrieval and knowledge layer with strict discipline.

Implement a real platform retrieval system that can pull from the platform database using keyword search, structured filters, vector search, and hybrid ranking. The system must support exact retrieval for formulas, syllabus facts, exam rules, and chapter details, plus semantic retrieval for explanations and related concept linking. It must rank trusted platform knowledge ahead of loose speculative knowledge when answering exam-related content.

Implement a real user retrieval system that can search notes, PDFs, uploaded images after OCR, transcripts, links, and saved content from the student’s personal database. This system must support “use my database” behavior, and it must change retrieval priority when the user asks for their own notes or custom materials.

Implement a real embeddings pipeline for both platform content and user content. Chunk content properly. Index it properly. Store metadata properly. Rebuild embeddings when necessary. Test the retrieval path. Make sure the platform can answer based on source data, not just model memory. The system should be built around a true retrieval augmented flow, not a pretend semantic search label.

Now build the agent architecture as a real orchestration system.

The Head Agent must exist as the central orchestrator. It must receive the user message first, classify it, decide whether to answer directly or route to a sub-agent, build the response context, pull memory, pull relevant platform knowledge, pull relevant user knowledge when allowed, and then generate the final answer or action. The Head Agent must also be the only agent that speaks to the frontend chat directly. Sub-agents must communicate with the Head Agent, not the student.

Create subject agents for Physics, Chemistry, Math, Biology, and any other subject modules needed for the target syllabus. Each subject agent must have its own rules, response style, depth behavior, and retrieval bias. Physics must support units, derivations, diagrams, and mechanics logic. Chemistry must support physical, organic, and inorganic behavior. Math must support stepwise derivations, formulas, and procedural rigor. Biology must support NCERT alignment, diagrams, and process explanations. Their behavior must be testable and deterministic enough to be trusted.

Create the onboarding and assessment agents as real workflows. The assessment flow must collect profile signals through a guided conversation and, when chosen, through a diagnostic test. That test must contain real questions, real scoring, real grading, and real result persistence. The assessment output must generate a true baseline profile, including strengths, weaknesses, confidence, and learning profile data. If the student skips the assessment, the system must still seed a profile from interaction and gradually refine it through usage, but it must continue to encourage completion of the assessment because that is foundational to DRONA’s personalization model.

Create the adaptation agent as a real behavioral analyzer. It must not claim magical mind reading. It must infer confusion, fatigue, overconfidence, or disengagement from usage patterns, answer behavior, response timing, repetition, and task performance. It must then influence the Head Agent and planner with real signals. It must be visible in analytics, but invisible in chat. It should change teaching style, pacing, difficulty, and session structure based on actual signals, not guesswork.

Create the memory agent as a real knowledge curator. It must decide what to keep, what to strengthen, what to compress, what to archive, and what to discard. It must deduplicate repeated entries. It must improve the quality of memory over time. It must be able to import external memory signals from user-provided prompts copied from other AI tools, plus linked external sources like Notion and NotebookLM where supported. The memory agent must not blindly trust everything imported. It must sort, normalize, and prioritize the useful parts.

Create the test agent and grader agent as real testing machinery. They must generate mock tests, surprise tests, topic tests, viva sessions, and exam simulations based on the user profile and syllabus state. The grader must evaluate objective and subjective responses with real marking rules. It must track errors by type, including conceptual error, procedural error, careless error, and knowledge gap. It must feed the result back into the heatmap, memory, planner, and subject agents. It must be strict, consistent, and honest.

Create the schedule agent and planner as a real operational planner. It must generate daily, weekly, and revision schedules based on exam date, topic mastery, recent performance, time available, weak areas, and forgetting curve logic. It must be able to replan when tasks are missed. It must be able to explain why a topic was scheduled. It must not be a static todo list. It must actually plan.

Create the quest agent, ranking agent, and gamification engine as real motivational machinery. XP must only be granted for verified study actions. Streaks must reflect actual usage, not page open time. Levels must reflect real accumulation. Missions must be generated from the actual study plan. Leaderboards must be real, bounded, and derived from actual earned points. If you include boss battles or social competition, the matchmaking, scoring, and ranking must be real enough to support live use. The Game Environment must not be a toy. If it supports social competition, the social connection must be backed by real session state and real student identities with safety controls.

Now build the environment system exactly as the product requires.

The Main Learning Environment must contain the core chat, the syllabus map, the study planner, the profile view, the stats view, and the subject agent entry points. The sidebar must only show learning-related items. The header must keep the brand, environment switcher, and profile indicators stable. The environment must feel clean, white, premium, and calm. The student must understand immediately that this is the learning hub.

The Test Environment must contain mock tests, viva, time pressure modes, surprise tests, exam simulation, answer analysis, and grading reports. It must feel serious and focused. It must be a distinct working environment, not just a tab. The student must be able to take a test, submit answers, receive grading, and see improvement analysis that changes future learning behavior.

The Game Environment must contain XP, streaks, missions, badges, levels, leaderboards, battle logic if included, and any verified social competition modules. This environment must be connected to real learning data, not cosmetic rewards. The student’s rewards must come from actual academic behavior. The rules must be precise and transparent. If a reward is earned, it must be earned from something real.

The Workspace Environment must contain notes, file uploads, saved links, schedules, folder hierarchy, content editor, focus timer, weekly report, and parent report as appropriate to the scope. It must function like a second brain, not a document toy. It must support markdown or block editing, storage, search, and retrieval by the agents. The workspace must feed the user database and retrieval layer.

The Resources Environment and Career Environment must not be fully built if you are excluding them from the current scope, but they must still exist as genuine coming soon pages with route shells, explanatory text, locked modules, and future file architecture. They must clearly show what will live there later. They must not be dead links. They must not be fake pages. They must be well designed placeholders that are actually part of the product architecture.

Now build the 100 plus features as a connected system, not as isolated widgets. The features must be mapped into their environments and into their agent responsibilities. Every feature must have a home, a data source, a state model, a user interaction, and an output. Do not create 100 separate toy files with no integration. Connect them. Make them interact. Make them aware of each other where appropriate.

The most important question that must guide implementation is this. How does each feature improve learning, retention, assessment, organization, or monetization? If it does not improve one of those, it probably should not be in the initial working system. If it does belong, then it must have a real flow, real state, real persistence, and real output.

Now solve the hardest questions explicitly in the design. These are not optional.

How will the platform database be curated, cleaned, tagged, and versioned over time? How will conflicting sources be resolved? How will syllabus changes be handled? How will exam year changes be represented? How will chapter dependencies be stored? How will formula entries link to examples and pitfalls? How will question banks be deduplicated? How will the OCR pipeline handle imperfect scans? How will handwritten notes be indexed? How will multiple exam boards be represented without confusion? How will user notes be separated from platform truth? How will personal memory be prevented from poisoning exam facts? How will student-specific explanations still remain accurate?

How will the personal knowledge base accept PDFs, text notes, links, slides, OCR images, and transcripts in a clean and safe way? How will the system detect noisy uploads? How will it chunk documents? How will it summarize them? How will it link them to chapters and topics? How will agents retrieve them when needed? How will the system know whether a response should prioritize user data or platform data?

How will the agent router decide when to answer directly and when to hand off? How will it decide between a subject agent and the Head Agent? How will it decide between giving a direct answer and asking a Socratic question? How will it decide when the student is confused and needs simpler teaching? How will it decide when to use a story mode or a strict mode? How will it prevent contradictory outputs from different agents? How will internal agent communication be logged, if at all, without leaking private user data?

How will the test engine generate non-redundant tests? How will it ensure correct difficulty distribution? How will it handle MCQ, numerical, and subjective formats differently? How will grading work for each? How will partial credit be handled? How will answer justification be stored? How will the system turn test results into future teaching decisions?

How will gamification stay honest and not be gamed? How will XP be validated? How will streaks be measured? How will focus time be confirmed? How will missions be generated so they encourage learning rather than empty behavior? How will boss battle or social features avoid becoming shallow competition? How will the platform prevent reward loops from overpowering actual education?

How will subscriptions work in a way that is real and not just decorative? How will plans be enforced? How will usage limits be tracked? How will premium features unlock? How will missing payment or missing keys be handled honestly? How will the system support both platform-provided models and user-provided API keys? How will provider routing be decided? How will fallback behavior work? How will rate limits be enforced? How will cost control and quality control both be respected?

How will the system test itself? How will you verify that the chat works, the retrieval works, the planner works, the assessment works, the test flows work, the workspace works, the environment switching works, the memory works, the subscription gating works, and the coming soon routes remain stable? Add tests for actual flows, not just unit stubs. Add verification for the critical paths. Add logs that show what was checked and what failed.

Do not think in terms of a thin prototype. Think in terms of an actual platform. The codebase must be sufficiently large, organized, and deep to support the product’s complexity. If the platform needs 200 plus files, then structure it that way. If the domain needs 10 lakh lines of real working code over time, then architect it so that scale is possible. Do not write giant monolithic files. Do not squeeze a large system into a few utilities. Do not ignore domain boundaries. Do not hide complexity. Structure it properly so the complexity is controlled instead of chaotic.

The design must remain minimalist white and editorial where the HTML specifies it. Respect the visual language exactly. Keep the platform premium, calm, and structured. Do not turn it into a noisy dashboard. Do not overdecorate. Do not reduce quality for speed. Keep the product visually serious and academically credible.

For every feature and subsystem, do the following. Design it. Implement it. Connect it. Store it. Read it back. Test it. Verify it. Fix it if it fails. Then move on. No fake completion. No assumed completion. No decorative completion. Only real completion.

When something is not ready, make it a real future module instead of pretending it exists. When something is in scope, make it fully work. When something is core, do not weaken it. When something depends on another subsystem, wire that dependency cleanly. When something needs data, create the data model. When something needs retrieval, create the retrieval path. When something needs persistence, store it. When something needs error handling, handle the error honestly. When something needs an API key or provider, use the real provider behavior or honest fallback.

Build this as if the platform will be used by real students, real parents, and real paying users. Build it as if broken behavior will matter. Build it as if trust matters. Build it as if the data matters. Build it as if the retrieval layer matters. Build it as if the agent coordination matters. Build it as if the learning outcome matters. Build it as if the product must survive beyond a demo.

Now make the system whole. Connect every part. Test every part. Verify every part. Keep going until the platform is real.



# MASTER PROJECT INSTRUCTION

Read this file before every command, every edit, every refactor, every test, every deployment step, and every rollback.
Read the latest `WORKLOGS.md` entry before touching anything.
Obey this file above all other project notes unless a higher-priority safety rule applies.
This file is project-local and must only govern the current workspace.
Do not let unrelated folders, unrelated repositories, or unrelated project state influence this workspace.
If a project-specific protected workspace exists, preserve it absolutely and never allow another project to overwrite it.
If this workspace has a special protected project name such as Yuki, treat its checkpoints, logs, and stable states as untouchable unless the user explicitly overrides that protection.

Build only real software.
Do not create fake data, fake accounts, fake repositories, fake integrations, fake models, fake dashboards, fake scans, fake fixes, fake reports, fake approvals, or fake success states.
Do not make buttons that only look real.
Do not make pages that only look real.
Do not make routes that only exist for display.
Do not make services that only return hardcoded answers unless they are explicitly marked development-only and fully separated from final flows.
Do not present placeholders as production behavior.

Every visible feature must have a real purpose.
Every user action must lead to a real state change, a real backend action, a real storage action, or a real verified result.
Every workflow must have input, processing, output, and persistence when persistence is relevant.
Every integration must be genuine and must fail honestly if credentials, permissions, or connectivity are missing.

Do not simplify a strong design into a weaker one just to make it shorter or easier.
Do not remove useful logic, depth, validation, state handling, reporting, or visual quality unless the current implementation is broken and the removal is truly necessary.
If a change would delete more capability than it adds, stop and justify it before doing it.
If a repair would make the project uglier, flatter, less capable, or less credible, reject that repair and preserve the better design.

Prefer narrow, careful changes over broad rewrites.
When something is working, keep it working.
When something is broken, fix the broken part without damaging the surrounding system.
When a fix is necessary, preserve the working structure around it.
When refactoring, preserve behavior first, then improve clarity, then improve maintainability.

Do not ignore existing project state.
Do not overwrite stable work with untested rewrites.
Do not replace a polished implementation with a generic shortcut.
Do not reduce a sophisticated interface to a plain shell unless explicitly requested.
Do not shrink a robust backend into a demo backend.
Do not flatten a complex workflow into a fake flow.

The final product must be production-minded.
The final product must be runnable.
The final product must be testable.
The final product must be coherent.
The final product must be deployable where applicable.
The final product must be honest about what works and what does not.

Use a real database if the project stores real state.
Store real users, organizations, workspaces, connected providers, repository links, scan jobs, findings, fixes, audit records, settings, model usage, and permissions where relevant.
Keep secrets secure.
Use secure credential handling.
Use encrypted storage or secure environment handling for sensitive values.
Never hardcode production secrets.
Never leak secrets into logs or UI.
Never show sensitive credentials in the interface.

Use role-based access control when the project needs permissions.
Use workspace or organization separation when the project needs multi-tenant boundaries.
Use rate limiting when the project can be abused or overloaded.
Use proper validation on every public input.
Use proper error handling on every external dependency.
Use clear logging on every important operation.
Use audit trails for important actions.
Use deterministic state transitions for important workflows.

If the project uses AI or model adapters, implement them as real selectable backends.
Do not fake model switching.
Do not fake model outputs.
Do not fake provider availability.
Do not fake usage quotas.
Do not fake credit exhaustion.
If a provider is unavailable, tell the truth in the UI and in logs.
If a user runs out of quota, show that state honestly.
If a model is local, call it for real.
If a provider key is missing, surface the missing configuration honestly.
If the system has a fallback mode, it must be a real fallback mode, not a decorative label.

If the project includes GitHub, GitLab, Bitbucket, or any other external service integration, build the real connection flow.
Use the real provider auth or installation flow.
Use real webhooks where appropriate.
Use real callbacks where appropriate.
Use real tokens or installation credentials where appropriate.
Use the provider’s real APIs for posting results back.
Do not pretend a repository is connected when it is not.
Do not pretend a scan reached the repository when it did not.
Do not pretend a PR was updated when it was not.
If write access is unavailable, provide a real patch, a real diff, or a real suggestion path instead of pretending to push.

If the project contains an auto-fix workflow, make it real.
The workflow must detect an issue, create a fix, apply it in an isolated environment, verify the fix, and then decide whether the result should be committed, proposed, or rejected.
Do not make the auto-fix system only describe problems.
Do not make it only generate comments.
Do not make it only generate text.
It must actually repair code when the circumstances allow it.
It must verify the repair before claiming success.
If verification fails, the failure must be honest and visible.

If the project includes security scanning, dependency analysis, secret scanning, policy checks, compliance checks, or SBOM generation, those features must work as actual processing features.
They must produce real outputs, not decorative labels.
They must include file paths, line numbers, severity or priority, explanation, and verification status when relevant.
They must be understandable to engineers and to nontechnical reviewers.
They must not collapse into generic wording that hides the actual issue.

If the project includes reports, exports, dashboards, or summaries, make them detailed and useful.
Reports must not be vague.
Reports must not be a few random words.
Reports must not hide severity, cause, or impact.
Reports must explain what happened, why it matters, what was changed, what remains open, and what was verified.
Exports must work.
PDF export must work if included.
DOCX export must work if included.
Any report generation must reflect real state from the backend.

The frontend must look like a real product.
The layout must be intentional, polished, modern, and credible.
The design must have strong hierarchy, proper spacing, consistent typography, and clear visual flow.
The UI must not look like a throwaway admin page unless that is explicitly the requested style.
The UI must not become cluttered, weak, or generic just to save time.
If the current design is beautiful and functional, preserve it.
If you need to change it, keep the same level of visual quality or improve it.

The backend must be real and reliable.
Use proper routes.
Use proper schemas.
Use proper validation.
Use proper storage.
Use proper middleware.
Use proper integration boundaries.
Use proper logging.
Use proper authentication if needed.
Use proper background jobs if needed.
Use proper error handling.
Do not create routes that only exist to satisfy the frontend.
Do not create services that only echo data back unless that is the explicit contract.
Do not create silent failures.

Write long, complete, and useful code when the task needs depth.
Do not produce tiny incomplete fragments when the project clearly needs a full implementation.
Do not compress a serious system into a minimal shell.
Do not remove useful lines merely to make the code shorter.
Do not “simplify” away important behavior.
Do not turn a detailed solution into a thin demo.

When making changes, preserve the exact parts that already work.
When something is unstable, isolate the unstable part and repair it without destroying the rest.
When a command fails, do not hide the failure.
Log it.
Record what failed.
Record why it failed.
Record what file or path was affected.
Record the fix plan.
Then fix it cleanly.

Maintain `WORKLOGS.md` as a live record of the project.
Read it before making changes.
Update it after every meaningful step.
Record the timestamp, checkpoint name, command or action, files changed, verification performed, result, and next step.
If a task fails, record the failure exactly and honestly.
If a task succeeds, record exactly what was verified.
Do not leave the work log stale.

Create project-specific checkpoints only after a change has been verified working.
A checkpoint is a stable point that can be restored later if a new change breaks the project.
Do not create checkpoints from broken work.
Do not call unstable work a checkpoint.
Do not mix checkpoints between unrelated projects.
Do not let another repository overwrite this project’s checkpoints.
If a change is risky, finish it in a smaller step first, verify it, then checkpoint it.

Commit only after a meaningful milestone is complete and verified.
Use automatic commits when the work is stable enough.
Use clear, factual commit messages.
Do not wait forever for a commit if the milestone is already proven.
Do not commit broken code as if it were finished.
Do not skip commits for important milestones.

Before any meaningful command sequence, read this instruction file and the latest work log.
Before any file edit, confirm the target file is part of the current milestone.
Before any merge, rollback, checkpoint, or destructive command, verify the impact.
Before closing a task, update the work log.
After any major feature, rerun the relevant test path.
After any major fix, rerun the relevant verification path.
After any major UI change, verify the build or rendering path if available.
After any major backend change, verify the relevant endpoints or service path if available.

Use safe command habits.
Do not run destructive commands casually.
Do not delete working files casually.
Do not rename paths casually.
Do not overwrite unknown files casually.
If you are unsure, inspect first.
If you need to recover, use the latest checkpoint rather than improvising.

Respect project boundaries.
Work only inside this workspace.
Do not alter unrelated folders.
Do not let other repositories contaminate this project.
Do not let unrelated logs, checkpoints, or temporary files interfere with this project.
Do not spread changes across arbitrary locations.

Preserve the project’s sophistication.
If the project has a deep workflow, keep the workflow deep.
If the project has rich visuals, keep the visuals rich.
If the project has detailed reporting, keep the reporting detailed.
If the project has real verification, keep the verification real.
If the project has a strong architecture, keep the architecture strong.
If the project has a precise purpose, keep that purpose intact.

When the user asks for a fix, solve the actual root cause.
When the user asks for a feature, implement the feature end to end.
When the user asks for improvement, improve the real system, not just the appearance.
When the user asks for testing, test the real flow.
When the user asks for recovery, restore the nearest known good checkpoint.
When the user asks for robustness, preserve and strengthen the working behavior.

Never claim completion unless the milestone is actually complete.
Never claim a working flow unless it was actually verified.
Never claim a stable state unless it has been checked.
Never claim a successful integration unless the integration was tested or clearly validated.
Never claim a real fix if the fix only moved the problem elsewhere.

If an instruction is unclear, ask the minimum necessary question.
If an assumption is risky, stop and confirm.
If a feature is not fully possible, explain the closest real implementation and ask before assuming.
If a dependency is missing, explain the gap and handle it honestly.
If a provider quota is exhausted, show it honestly.
If a build fails, fix the build.
If a test fails, fix the cause.
If a layout breaks, fix the layout.
If a code edit harms quality, undo the harm.

The standard is simple.
Make it real.
Make it work.
Make it polished.
Make it testable.
Make it honest.
Keep it inside this workspace.
Protect the working state.
Preserve quality.
Protect checkpoints.
Log everything.
Verify everything.
Commit the verified milestones.




Read the attached HTML documentation, the Plan.md document, and the master project instruction file completely before writing any code. Treat those documents as the source of truth. Do not restate them back to me. Do not explain the plan. Build it.

Your job is to turn the DRONA AI documentation into a real, working, production-minded full-stack product. Build the real frontend, the real backend, the real database layer, the real agent orchestration, the real memory and retrieval layer, the real subscription system, the real environment routing, the real workspace, the real testing engine, the real gamification logic, and the real settings and profile flows exactly as described in the documents. The minimalist white editorial design already defined in the HTML must be preserved. Do not redesign it. Do not simplify it. Do not flatten it.

Scope rule. Build the Main Learning Environment, Test Environment, Game Environment, and Workspace Environment as fully working environments. If Resources Environment and Career Environment are not fully built, then create them as real coming soon pages with proper routing, proper file structure, proper UI shells, proper future-ready components, and proper integration points, not fake pages. The coming soon pages must be clearly structured so they can become full environments later without rewriting the whole app.

Build a codebase that is large, modular, and serious. Do not force a tiny demo. Do not make a fake prototype. Do not hardcode the illusion of intelligence. Do not create static pages pretending to be live systems. If the implementation genuinely requires a large codebase, produce one. The target is a real multi-file system with a deep folder structure, ideally 200 plus files or more if the architecture requires it, with complete working logic rather than decorative shells.

Follow these 50 hard rules exactly.

1. Read the attached documents first and obey them above any default approach.
2. Build only real software that performs real actions.
3. Do not create fake data for user-facing behavior.
4. Do not create fake accounts.
5. Do not create fake agents.
6. Do not create fake integrations.
7. Do not create fake dashboards.
8. Do not create fake model outputs.
9. Do not create fake subscription states.
10. Do not create fake success states.
11. Do not create fake loading states that hide missing functionality.
12. Do not create placeholder buttons that do nothing.
13. Do not create routes that exist only for display.
14. Do not create pages that only look real.
15. Do not create services that only echo static text.
16. Every visible feature must produce a real state change, a real backend action, a real storage action, or a real verified result.
17. Every user action must be connected to real persistence when persistence is relevant.
18. Every real-time interaction must be backed by real state handling.
19. Every AI feature must be implemented as a real provider-backed or real fallback-backed capability.
20. Every agent must have a real role, a real input contract, and a real output contract.
21. The Head Agent must orchestrate the system and route to specialist agents where appropriate.
22. Subject agents must exist as distinct functional modules, not just labels.
23. The Memory system must persist real user context across sessions.
24. The assessment system must build a real profile from real onboarding and real test results.
25. The study planner must generate real schedules based on real profile and performance data.
26. The weakness heatmap must come from actual assessments and actual session data.
27. The mock test generator must generate and store real tests.
28. The grader must grade against real rules and real answer data.
29. The image solver must process real uploads and return real extracted solutions.
30. The workspace must store real notes, uploads, links, schedules, and user files.
31. The flashcard system, if included in the scope you are building, must save and review real cards.
32. The XP, streak, and level systems must be calculated from real verified activity.
33. The leaderboard or ranking logic, if included, must be real and derivable from stored state.
34. The Boss Battle and test simulations, if built in this phase, must use real matchmaking or real controlled session logic.
35. The Teachers’ Lounge must be implemented as a real backend review flow, not a decorative report.
36. The RAG layer must use real retrieval from the platform knowledge base and user knowledge base.
37. The vector database must be real, persistent, queryable, and isolated by tenant or user.
38. The platform database must be curated, structured, and searchable.
39. The user database must be private, editable, and used when context demands it.
40. Platform data must not be silently overridden by weak user notes in exam-related facts unless the user explicitly chooses that source mode.
41. The environment switcher must actually change the working environment, sidebar content, and active modules.
42. The shared header, avatar, XP, and profile state must persist across environments.
43. The environment sidebar must only show the pages relevant to that environment.
44. The Resources and Career environments must still be represented with proper route structure even if only coming soon pages are shipped now.
45. The subscription system must be real, with real plan boundaries, real entitlements, and real gating.
46. The API key or BYOK system must be real if included, with secure storage and honest missing-key handling.
47. Security must be real, including validation, authentication, authorization, and audit logging where needed.
48. Errors must be honest, visible, and handled properly. Do not hide missing configuration.
49. The product must be testable. Add tests, verification, and checks for major flows.
50. The final result must be runnable, coherent, and deployable, not a mockup pretending to be software.

Build the product in a way that matches the documents exactly where they are specific, and fills in the implementation details with strong engineering where the documents define the behavior but not the code. Use the following implementation priorities.

First, build the core data model. Create the user model, student profile model, assessment model, memory model, test model, workspace model, environment model, subscription model, and analytics model. Make the relationships real. Make the migrations real. Make the schema real. Make the data flow real.

Second, build the agent layer. Create a real Head Agent orchestration layer, subject agents, assessment agent, test agent, grader agent, memory agent, stats agent, adaptation agent, quest agent, ranking agent, workspace agent, and tour agent. They must communicate through a real internal message flow or service contract. Do not hardcode all behavior into one file.

Third, build the retrieval layer. Create the platform knowledge base indexing, the user knowledge base indexing, the memory retrieval, the RAG query flow, and the source prioritization rules. Retrieval must be actual retrieval, not simulated lookup text.

Fourth, build the environment shell. Create the Main Learning, Test, Game, Workspace, Resources coming soon, and Career coming soon routes, layouts, sidebar structures, environment switcher, and shared header behavior. Each environment must feel distinct and must only expose its own relevant features.

Fifth, build the user flows. The registration flow, assessment flow, optional diagnostic test flow, loading and initialization flow, onboarding tour, daily learning flow, chat flow, image solver flow, workspace flow, study planner flow, and end of session reporting must all work.

Sixth, build the monetization layer. Create the free plan, Pro plan, Enterprise plan, gating logic, usage limits, and billing integration scaffold. Make the pricing logic real and configurable. Do not hardcode dummy tiers inside UI only.

Seventh, build the operational layer. Add logging, audit trails, error handling, validation, rate limiting, background jobs, and structured status reporting.

Eighth, build the coming soon pages properly. The Resources coming soon page and Career coming soon page must show real planned modules, locked states, future file structure, and future entry points. They must not look unfinished. They must look intentional.

Every environment must have a clean modular file structure with good names. Use clear naming, no nonsense files, no one-off dumps, and no giant unmaintainable blobs. Keep each domain separated. Keep routing clean. Keep components reusable. Keep the backend organized by feature. Keep the data access layer separated from business logic. Keep the agent logic separated from UI. Keep the retrieval logic separated from grading logic. Keep the subscription logic separated from the learning logic.

The frontend must remain minimalist white, editorial, structured, and premium. The backend can be complex, but the experience must remain clean. Use actual state, actual persistence, and actual verification. Do not write code that only looks like a full product. Write code that is a full product.

If any feature from the documents is not being built in the current milestone, represent it honestly as future work inside the real project structure, not as fake behavior. If a dependency is missing, surface it honestly. If a provider is unavailable, fail honestly. If something is coming soon, label it clearly as coming soon while still wiring the route, page, and architecture properly.

Now build the system.
