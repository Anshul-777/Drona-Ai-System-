"use client";

import { useState, useRef, useEffect } from "react";

// --- Agent Architecture Data ---
const AGENTS = [
  // ==========================================
  // GATEWAY & PRE-PROCESSING (TOP)
  // ==========================================
  { id: "receiver", label: "Input Receiver", type: "Gateway", icon: "input", x: 800, y: 100, color: "zinc", size: 50, desc: "Captures raw multi-modal input (text, voice, image).", tech: "Edge API", rules: ["Latency < 50ms"] },
  { id: "sanitizer", label: "Data Sanitizer", type: "Security", icon: "cleaning_services", x: 800, y: 200, color: "zinc", size: 50, desc: "Normalizes formatting, filters malicious intent.", tech: "Zod / NLP", rules: ["Block prompt injections"] },
  { id: "router", label: "Cognitive Router", type: "Orchestrator", icon: "route", x: 800, y: 300, color: "blue", size: 60, desc: "High-speed intent classifier.", tech: "Fast LLM", rules: ["Route to Orchestrators"] },

  // ==========================================
  // MEMORY & CONTEXT (LEFT FLANK)
  // ==========================================
  { id: "memory", label: "Memory Mesh", type: "Vector Brain", icon: "memory", x: 300, y: 300, color: "emerald", size: 65, desc: "Stores the 'Context of the Soul', forgetting curves, and error histories.", tech: "Pinecone / Weaviate", rules: ["Index every mistake"] },
  { id: "globaldb", label: "Platform DB", type: "Source of Truth", icon: "dns", x: 300, y: 150, color: "emerald", size: 60, desc: "NCERT syllabus, verified PYQs.", tech: "PostgreSQL", rules: ["Zero hallucination"] },
  { id: "context", label: "Context Synth", type: "Data Fusion", icon: "auto_awesome", x: 500, y: 300, color: "violet", size: 60, desc: "Fuses DB knowledge with user memory vectors before feeding to Tutors.", tech: "RAG Engine", rules: ["Inject student weaknesses"] },

  // ==========================================
  // THE CORE (CENTER)
  // ==========================================
  { id: "drona", label: "Drona Core", type: "The Principal", icon: "psychology", x: 800, y: 450, color: "blue", size: 90, desc: "The supreme intellect. Doesn't handle everything directly—orchestrates middle managers.", tech: "GPT-4o / Claude 3.5", rules: ["Master Execution Override", "Manage Syllabi"] },

  // ==========================================
  // MIDDLE MANAGERS (Y=650)
  // ==========================================
  { id: "mgr_tutors", label: "Teachers Lounge", type: "Sub-Orchestrator", icon: "meeting_room", x: 450, y: 650, color: "amber", size: 70, desc: "Manages all subject-specific tutors and coordinates cross-subject dependencies.", tech: "Logic Engine", rules: ["Route subject questions"] },
  { id: "mgr_eval", label: "Evaluation Engine", type: "Sub-Orchestrator", icon: "assignment", x: 800, y: 650, color: "rose", size: 70, desc: "Handles all testing, grading, and analytical feedback loops.", tech: "Quiz Generator", rules: ["Ensure strict evaluation"] },
  { id: "mgr_game", label: "Game Engine", type: "Sub-Orchestrator", icon: "sports_esports", x: 1150, y: 650, color: "fuchsia", size: 70, desc: "Controls all XP, streaks, progression loops, and rewards.", tech: "Gamification API", rules: ["Enforce penalty logic"] },
  { id: "mgr_work", label: "Workspace Engine", type: "Sub-Orchestrator", icon: "dashboard", x: 1450, y: 650, color: "teal", size: 70, desc: "Manages user tools, schedules, and career/resource environments.", tech: "CRUD API", rules: ["Sync across devices"] },

  // ==========================================
  // LEAF NODES: TUTORS (BOTTOM LEFT)
  // ==========================================
  { id: "phys", label: "Physics Agent", type: "Tutor", icon: "bolt", x: 250, y: 850, color: "amber", size: 60, desc: "Mechanics, Optics. Concept-Dependency mapping.", tech: "Trained Prompt", rules: ["Visual physics breakdown"] },
  { id: "chem", label: "Chemistry Agent", type: "Tutor", icon: "science", x: 400, y: 850, color: "amber", size: 60, desc: "Organic, Inorganic. Equation OCR.", tech: "Vision LLM", rules: ["Step-by-step reactions"] },
  { id: "math", label: "Math Agent", type: "Tutor", icon: "calculate", x: 550, y: 850, color: "amber", size: 60, desc: "Calculus, Algebra. Photomath-like precision.", tech: "Math LLM", rules: ["No skip steps"] },
  { id: "bio", label: "Biology Agent", type: "Tutor", icon: "biotech", x: 700, y: 850, color: "amber", size: 60, desc: "Botany, Zoology. Draw Mermaid diagrams.", tech: "Visual LLM", rules: ["Use analogies"] },

  // ==========================================
  // LEAF NODES: EVALUATORS (BOTTOM CENTER)
  // ==========================================
  { id: "test", label: "Test Agent", type: "Evaluator", icon: "quiz", x: 700, y: 1000, color: "rose", size: 60, desc: "Custom mock tests pulling from all subject teachers.", tech: "Dynamic Compiler", rules: ["Query all tutors for Qs"] },
  { id: "grader", label: "Grader Agent", type: "Evaluator", icon: "fact_check", x: 850, y: 850, color: "rose", size: 60, desc: "Ruthless step-marking.", tech: "Vision + LLM", rules: ["Highlight exactly where wrong"] },
  { id: "socratic", label: "Socratic Loop", type: "Evaluator", icon: "record_voice_over", x: 1000, y: 850, color: "rose", size: 60, desc: "Guides the user using questions. Forbidden from answers.", tech: "Constrained LLM", rules: ["NEVER give direct answers"] },
  { id: "shadow", label: "Shadow-Simulator", type: "Evaluator", icon: "dark_mode", x: 850, y: 1000, color: "zinc", size: 60, desc: "Mimics NTA JEE/NEET difficulty curves in real-time.", tech: "Adaptive AI", rules: ["Scale difficulty via heart-rate"] },

  // ==========================================
  // LEAF NODES: GAMIFICATION (BOTTOM RIGHT)
  // ==========================================
  { id: "quest", label: "Quest Agent", type: "Gamification", icon: "swords", x: 1100, y: 850, color: "fuchsia", size: 60, desc: "Daily missions, Boss Battles.", tech: "State Engine", rules: ["Reward XP"] },
  { id: "stats", label: "Profiler Agent", type: "Gamification", icon: "query_stats", x: 1250, y: 850, color: "fuchsia", size: 60, desc: "Computes Topic Mastery (0-100%) and updates Hex-Radar.", tech: "Data Viz", rules: ["Update leaderboard"] },

  // ==========================================
  // LEAF NODES: WORKSPACE & ONBOARDING (FAR RIGHT)
  // ==========================================
  { id: "schedule", label: "Schedule Agent", type: "Productivity", icon: "calendar_month", x: 1400, y: 850, color: "teal", size: 60, desc: "Dynamic timetable adjustment.", tech: "Cron / API", rules: ["Alert on procrastination"] },
  { id: "career", label: "Career Guide", type: "Advisor", icon: "explore", x: 1550, y: 850, color: "teal", size: 60, desc: "Guides post-exam roadmap.", tech: "Counselor LLM", rules: ["Keep user motivated"] },

  // ==========================================
  // DISABLED / EPHEMERAL NODES
  // ==========================================
  { id: "tour", label: "Tour Agent", type: "Ephemeral", icon: "tour", x: 1450, y: 300, color: "slate", size: 55, desc: "Familiarizes user with OS. Disables after initial run.", tech: "UI Orchestrator", rules: ["Disable after completion"] }
];

const LINKS: Array<{ source: string, target: string, dashed?: boolean, thick?: boolean }> = [
  // Gateway Flow
  { source: "receiver", target: "sanitizer" },
  { source: "sanitizer", target: "router" },

  // Router to Memory vs Core vs Managers
  { source: "router", target: "context" },
  { source: "router", target: "drona" },

  // Memory & Context Mesh
  { source: "globaldb", target: "context" },
  { source: "memory", target: "context" },
  { source: "context", target: "drona" },
  { source: "context", target: "mgr_tutors" }, // Tutors need context!

  // Drona Core (The Principal) delegating to Managers
  { source: "drona", target: "mgr_tutors" },
  { source: "drona", target: "mgr_eval" },
  { source: "drona", target: "mgr_game" },
  { source: "drona", target: "mgr_work" },

  // Teachers Lounge delegating to Subjects
  { source: "mgr_tutors", target: "phys" },
  { source: "mgr_tutors", target: "chem" },
  { source: "mgr_tutors", target: "math" },
  { source: "mgr_tutors", target: "bio" },

  // Evaluation Engine Flow
  { source: "mgr_eval", target: "test" },
  { source: "mgr_eval", target: "grader" },
  { source: "mgr_eval", target: "socratic" },
  { source: "mgr_eval", target: "shadow" },

  // Game Engine Flow
  { source: "mgr_game", target: "quest" },
  { source: "mgr_game", target: "stats" },

  // Workspace Flow
  { source: "mgr_work", target: "schedule" },
  { source: "mgr_work", target: "career" },

  // ==========================================
  // CROSS-POLLINATION (The Magic Overlap)
  // ==========================================

  // Test Agent queries ALL Tutors to build exams
  { source: "phys", target: "test", dashed: true },
  { source: "chem", target: "test", dashed: true },
  { source: "math", target: "test", dashed: true },
  { source: "bio", target: "test", dashed: true },

  // Grader updates Memory Mesh
  { source: "grader", target: "memory", dashed: true },

  // Stats Agent reads from Grader
  { source: "grader", target: "stats", dashed: true },

  // Socratic Loop works with Tutors
  { source: "socratic", target: "mgr_tutors", dashed: true },

  // Ephemeral connections
  { source: "router", target: "tour", dashed: true }
];

const THEMES: Record<string, { bg: string, border: string, text: string, shadow: string, hex: string }> = {
  blue: { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-700", shadow: "shadow-[0_4px_14px_rgba(59,130,246,0.2)]", hex: "#3b82f6" },
  zinc: { bg: "bg-slate-100", border: "border-slate-300", text: "text-slate-700", shadow: "shadow-[0_4px_14px_rgba(148,163,184,0.2)]", hex: "#64748b" },
  slate: { bg: "bg-slate-100", border: "border-slate-300", text: "text-slate-400", shadow: "shadow-[0_4px_14px_rgba(148,163,184,0.1)]", hex: "#94a3b8" },
  emerald: { bg: "bg-emerald-100", border: "border-emerald-300", text: "text-emerald-700", shadow: "shadow-[0_4px_14px_rgba(16,185,129,0.2)]", hex: "#10b981" },
  violet: { bg: "bg-violet-100", border: "border-violet-300", text: "text-violet-700", shadow: "shadow-[0_4px_14px_rgba(139,92,246,0.2)]", hex: "#8b5cf6" },
  amber: { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-700", shadow: "shadow-[0_4px_14px_rgba(245,158,11,0.2)]", hex: "#f59e0b" },
  rose: { bg: "bg-rose-100", border: "border-rose-300", text: "text-rose-700", shadow: "shadow-[0_4px_14px_rgba(244,63,94,0.2)]", hex: "#f43f5e" },
  fuchsia: { bg: "bg-fuchsia-100", border: "border-fuchsia-300", text: "text-fuchsia-700", shadow: "shadow-[0_4px_14px_rgba(217,70,239,0.2)]", hex: "#d946ef" },
  teal: { bg: "bg-teal-100", border: "border-teal-300", text: "text-teal-700", shadow: "shadow-[0_4px_14px_rgba(20,184,166,0.2)]", hex: "#14b8a6" },
};

// Simulation Sequences (Scenarios)
const SCENARIOS = [
  {
    name: "User Chemistry Query",
    steps: [
      { from: "receiver", to: "sanitizer", time: 0, text: "Received input string" },
      { from: "sanitizer", to: "router", time: 1000, text: "Cleaned & Tokenized" },
      { from: "router", to: "context", time: 2000, text: "Fetching student profile" },
      { from: "context", to: "userdb", time: 3000, text: "Querying personal notes" },
      { from: "userdb", to: "context", time: 4000, text: "Found: Notes on covalent bonds" },
      { from: "router", to: "memory", time: 2000, text: "Checking past errors" },
      { from: "memory", to: "globaldb", time: 3000, text: "Verifying standard definition" },
      { from: "globaldb", to: "memory", time: 4000, text: "NCERT Chapter 4 loaded" },
      { from: "router", to: "drona", time: 5500, text: "Context assembled. Sending to Core." },
      { from: "drona", to: "chem", time: 7000, text: "Formulate answer based on notes." },
      { from: "chem", to: "drona", time: 8500, text: "Draft ready. Submitting to Grader for tone-check." },
      { from: "drona", to: "grader", time: 10000, text: "Review draft response." },
      { from: "grader", to: "drona", time: 11500, text: "Approved. Pedagogically sound." }
    ]
  },
  {
    name: "Surprise Boss Battle",
    steps: [
      { from: "workspace", to: "drona", time: 0, text: "User completed scheduled task early." },
      { from: "drona", to: "quest", time: 1500, text: "Triggering surprise Boss Battle!" },
      { from: "quest", to: "stats", time: 3000, text: "Fetching weakest subject" },
      { from: "stats", to: "quest", time: 4500, text: "Weakness: Kinematics (Physics)" },
      { from: "quest", to: "test", time: 6000, text: "Requesting Boss Test generation" },
      { from: "test", to: "shadow", time: 7500, text: "Apply NTA difficulty scaling" },
      { from: "shadow", to: "test", time: 9000, text: "Scaled to 85th percentile" },
      { from: "test", to: "drona", time: 10500, text: "Test ready. Deploying to UI." }
    ]
  }
];

export default function AgentDockArchitecture() {
  const width = 1600;
  const height = 1100;

  // Interaction State
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeNode, setActiveNode] = useState<string | null>("drona");
  const [activePulses, setActivePulses] = useState<any[]>([]);
  const [activeThoughts, setActiveThoughts] = useState<any[]>([]);
  const [agentStatuses, setAgentStatuses] = useState<Record<string, 'idle' | 'active' | 'thinking'>>({});

  // Animation Loop
  useEffect(() => {
    let scenarioIdx = 0;

    const runScenario = () => {
      const scenario = SCENARIOS[scenarioIdx];
      let maxTime = 0;

      scenario.steps.forEach((step) => {
        if (step.time > maxTime) maxTime = step.time;

        setTimeout(() => {
          // Set Source node to Active
          setAgentStatuses(prev => ({ ...prev, [step.from]: 'active' }));

          // Add pulse
          const pulseId = Math.random().toString();
          setActivePulses(prev => [...prev, { id: pulseId, source: step.from, target: step.to }]);

          // Remove pulse after 1s (animation duration)
          setTimeout(() => {
            setActivePulses(prev => prev.filter(p => p.id !== pulseId));

            // Revert source to idle
            setAgentStatuses(prev => ({ ...prev, [step.from]: 'idle' }));

            // Set Target node to Thinking
            setAgentStatuses(prev => ({ ...prev, [step.to]: 'thinking' }));

            // Trigger thought on target node
            const thoughtId = Math.random().toString();
            setActiveThoughts(prev => [...prev, { id: thoughtId, node: step.to, text: step.text }]);

            // Remove thought after 2.5s and revert target to idle
            setTimeout(() => {
              setActiveThoughts(prev => prev.filter(t => t.id !== thoughtId));
              setAgentStatuses(prev => ({ ...prev, [step.to]: 'idle' }));
            }, 2500);

          }, 1000);
        }, step.time);
      });

      // Schedule next scenario
      setTimeout(() => {
        scenarioIdx = (scenarioIdx + 1) % SCENARIOS.length;
        runScenario();
      }, maxTime + 6000);
    };

    // Initial centering and start simulation
    resetView();

    const initialDelay = setTimeout(() => runScenario(), 1500);
    return () => clearTimeout(initialDelay);
  }, []);

  const resetView = () => {
    if (containerRef.current) {
      const fitScale = Math.min(containerRef.current.clientWidth / width, containerRef.current.clientHeight / height) * 0.9;
      setTransform({
        x: (containerRef.current.clientWidth - width * fitScale) / 2,
        y: (containerRef.current.clientHeight - height * fitScale) / 2,
        scale: fitScale
      });
    }
  };

  const handleZoom = (delta: number) => {
    setTransform(prev => ({ ...prev, scale: Math.max(0.1, Math.min(prev.scale + delta, 3)) }));
  };

  // Pan & Zoom Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPan({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform(prev => ({ ...prev, x: e.clientX - startPan.x, y: e.clientY - startPan.y }));
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleAdjust = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.3, transform.scale + scaleAdjust), 2);
    const cx = containerRef.current ? containerRef.current.clientWidth / 2 : 0;
    const cy = containerRef.current ? containerRef.current.clientHeight / 2 : 0;
    setTransform(prev => ({
      scale: newScale,
      x: cx - (cx - prev.x) * (newScale / transform.scale),
      y: cy - (cy - prev.y) * (newScale / transform.scale)
    }));
  };

  const selectedData = AGENTS.find(a => a.id === activeNode);
  const selectedStatus = (activeNode ? agentStatuses[activeNode] : null) || 'idle';

  return (
    <div className="absolute inset-0 flex overflow-hidden bg-slate-50 text-slate-800 select-none">

      {/* Left Canvas Area */}
      <div
        className="flex-1 relative overflow-hidden h-full"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Graph Background Grid (Light Mode) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: `${40 * transform.scale}px ${40 * transform.scale}px`,
          backgroundPosition: `${transform.x}px ${transform.y}px`
        }} />

        {/* Global Floating Status Badge */}
        <div className="absolute top-6 left-6 flex items-center gap-3 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-sm z-20">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Drona Ecosystem</p>
            <p className="text-sm font-bold text-slate-800 leading-tight">Architecture Active</p>
          </div>
        </div>

        {/* The Zoomable/Pannable Graph */}
        <div
          className="absolute origin-top-left transition-transform duration-75 ease-out"
          style={{ width, height, transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            {LINKS.map((link, idx) => {
              const src = AGENTS.find(a => a.id === link.source);
              const tgt = AGENTS.find(a => a.id === link.target);
              if (!src || !tgt) return null;

              const isPulsing = activePulses.some(p => (p.source === link.source && p.target === link.target) || (p.source === link.target && p.target === link.source));

              return (
                <g key={idx}>
                  <line
                    x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                    stroke={isPulsing ? THEMES[tgt.color].hex : "#cbd5e1"}
                    strokeWidth={link.thick ? 3 : (isPulsing ? 3 : 1.5)}
                    strokeDasharray={link.dashed ? "6,6" : "none"}
                    opacity={isPulsing ? 1 : 0.8}
                    className="transition-all duration-300"
                  />
                  {/* The moving pulse particle */}
                  {activePulses.filter(p => p.source === link.source && p.target === link.target).map(pulse => (
                    <circle key={pulse.id} r="5" fill={THEMES[tgt.color].hex} className="animate-[pulseMove_1s_ease-in-out_forwards]" style={{ filter: `drop-shadow(0 0 6px ${THEMES[tgt.color].hex})` }}>
                      <animateMotion dur="1s" fill="freeze" path={`M ${src.x} ${src.y} L ${tgt.x} ${tgt.y}`} />
                    </circle>
                  ))}
                  {/* Reverse direction pulse */}
                  {activePulses.filter(p => p.source === link.target && p.target === link.source).map(pulse => (
                    <circle key={pulse.id} r="5" fill={THEMES[src.color].hex} className="animate-[pulseMove_1s_ease-in-out_forwards]" style={{ filter: `drop-shadow(0 0 6px ${THEMES[src.color].hex})` }}>
                      <animateMotion dur="1s" fill="freeze" path={`M ${tgt.x} ${tgt.y} L ${src.x} ${src.y}`} />
                    </circle>
                  ))}
                </g>
              );
            })}
          </svg>

          {/* HTML Nodes */}
          {AGENTS.map(node => {
            const isSelected = activeNode === node.id;
            const status = agentStatuses[node.id] || 'idle';
            const theme = THEMES[node.color];

            const nodeThoughts = activeThoughts.filter(t => t.node === node.id);

            // Status styling logic
            let nodeRing = "ring-transparent";
            if (status === 'active') nodeRing = `ring-4 ${theme.border} scale-105`;
            else if (status === 'thinking') nodeRing = `ring-4 ${theme.border} scale-105 animate-pulse`;
            else if (isSelected) nodeRing = `ring-4 ${theme.border} ring-opacity-50 scale-105`;

            return (
              <div
                key={node.id}
                className="absolute flex flex-col items-center justify-center transition-all duration-300"
                style={{
                  left: node.x - node.size / 2,
                  top: node.y - node.size / 2,
                  width: node.size,
                  height: node.size,
                  zIndex: isSelected || nodeThoughts.length > 0 || status !== 'idle' ? 10 : 5
                }}
              >
                {/* Thought Bubbles */}
                {nodeThoughts.map((thought) => (
                  <div key={thought.id} className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white border border-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg animate-[viewFadeIn_0.2s_ease-out] z-20 pointer-events-none">
                    {thought.text}
                    {/* Speech bubble tail */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-slate-200 rotate-45"></div>
                  </div>
                ))}

                {/* Node Circle */}
                <div
                  onClick={(e) => { e.stopPropagation(); setActiveNode(node.id); }}
                  className={`w-full h-full rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border-2 bg-white
                    ${theme.border} ${theme.text} ${nodeRing}
                    ${isSelected ? theme.shadow : 'hover:scale-105 hover:shadow-md'}
                  `}
                >
                  <span className="material-symbols-outlined text-[24px] pointer-events-none">
                    {node.icon}
                  </span>
                </div>

                {/* Label */}
                <div className="absolute top-[100%] mt-3 whitespace-nowrap text-center pointer-events-none">
                  <p className={`font-bold transition-all ${isSelected ? 'text-slate-900 text-[15px]' : 'text-slate-700 text-sm'}`}>
                    {node.label}
                  </p>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'idle' ? 'bg-slate-300' : (status === 'active' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse')}`}></span>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      {status}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-6 left-6 flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm z-20">
          <button onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(2, prev.scale + 0.2) }))} className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors border-r border-slate-200">
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
          <button onClick={resetView} className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors border-r border-slate-200" title="Reset View">
            <span className="material-symbols-outlined text-[16px]">center_focus_strong</span>
          </button>
          <button onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(0.3, prev.scale - 0.2) }))} className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
        </div>
      </div>

      {/* Right Sidebar: Agent Inspector (Sliding Overlay) */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-[420px] bg-white border-l border-slate-200 shadow-[0_0_60px_rgba(0,0,0,0.1)] z-40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${selectedData ? 'translate-x-0' : 'translate-x-[110%]'
          }`}
      >
        {selectedData && (
          <div className="w-full h-full flex flex-col relative">
            {/* Header (Fixed Top) */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/95 backdrop-blur-md flex-shrink-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">troubleshoot</span>
                  Agent Inspector
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveNode(null); }}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-4 animate-[viewFadeIn_0.3s_ease-out]">
                <div className={`w-14 h-14 rounded-2xl bg-white border-2 ${THEMES[selectedData.color].border} flex items-center justify-center shadow-sm flex-shrink-0 relative`}>
                  <span className={`material-symbols-outlined text-[28px] ${THEMES[selectedData.color].text}`}>{selectedData.icon}</span>
                  {selectedStatus === 'active' && <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>}
                  {selectedStatus === 'thinking' && <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white animate-pulse shadow-sm"></div>}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-display font-bold text-slate-900 leading-tight tracking-tight">{selectedData.label}</h2>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded-md ${selectedStatus === 'idle' ? 'bg-slate-100 text-slate-500' :
                          (selectedStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 animate-pulse')
                        }`}>
                        {selectedStatus}
                      </span>
                      <span className="text-slate-300">•</span>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{selectedData.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
              <div className="p-6 space-y-8 animate-[viewFadeIn_0.4s_ease-out]">

                {/* Mission Statement */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">flag</span>
                    Core Directive
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-body bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-inner">
                    {selectedData.desc}
                  </p>
                </div>

                {/* Network Topology */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">hub</span>
                    Network Connections
                  </h4>
                  <div className="space-y-4">
                    {/* Upstream */}
                    <div>
                      <p className="text-[10px] text-slate-400 mb-2 uppercase font-bold tracking-widest">Receives From</p>
                      {(() => {
                        const upstream = LINKS.filter(l => l.target === selectedData.id).map(l => AGENTS.find(a => a.id === l.source)).filter(Boolean);
                        return upstream.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {upstream.map((a: any) => (
                              <div key={a.id} className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm">
                                <span className={`material-symbols-outlined text-[12px] ${THEMES[a.color].text}`}>{a.icon}</span>
                                <span className="text-xs font-medium text-slate-700">{a.label}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">Edge Node (No upstream)</p>
                        );
                      })()}
                    </div>
                    {/* Downstream */}
                    <div>
                      <p className="text-[10px] text-slate-400 mb-2 uppercase font-bold tracking-widest">Sends To</p>
                      {(() => {
                        const downstream = LINKS.filter(l => l.source === selectedData.id).map(l => AGENTS.find(a => a.id === l.target)).filter(Boolean);
                        return downstream.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {downstream.map((a: any) => (
                              <div key={a.id} className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm">
                                <span className={`material-symbols-outlined text-[12px] ${THEMES[a.color].text}`}>{a.icon}</span>
                                <span className="text-xs font-medium text-slate-700">{a.label}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">Terminal Node (No downstream)</p>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Agent Technical Constraints */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">gavel</span>
                    Core Rules & Constraints
                  </h4>
                  <ul className="space-y-2">
                    {selectedData.rules?.map((rule: string, i: number) => (
                      <li key={i} className="flex gap-2 text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 shadow-sm leading-relaxed">
                        <span className="material-symbols-outlined text-[14px] text-rose-500 mt-0.5">priority_high</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack Implementation */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">memory</span>
                    Tech Stack Implementation
                  </h4>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between shadow-sm">
                    <span className="text-xs font-mono text-slate-600 font-bold">{selectedData.tech}</span>
                    <span className="material-symbols-outlined text-[16px] text-slate-400">api</span>
                  </div>
                </div>

                {/* Logs / Recent Activity */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">terminal</span>
                    Live Inter-Agent Comms
                  </h4>
                  <div className="bg-[#0f172a] text-slate-300 font-mono text-[10px] p-4 rounded-xl space-y-2 h-[160px] overflow-y-auto shadow-inner">
                    {selectedStatus === 'idle' ? (
                      <p className="text-slate-500 italic">&gt; {selectedData.id}@drona-os:~$ awaiting instructions...</p>
                    ) : (
                      <>
                        <p>&gt; Initializing protocol for {selectedData.label}...</p>
                        <p>&gt; Syncing with Memory Mesh (Vector DB)...</p>
                        <p className="text-emerald-400">&gt; Process State: {selectedStatus.toUpperCase()}</p>
                        {selectedStatus === 'thinking' && <p className="animate-pulse text-amber-400">&gt; Executing core directive ruleset...</p>}
                        {selectedData.id === 'memory' && <p className="text-violet-400">&gt; Querying Pinecone index: "Context of the Soul"</p>}
                        {selectedData.id === 'socratic' && <p className="text-rose-400">&gt; Rule enforced: Direct answer blocked.</p>}
                        {selectedData.id === 'shadow' && <p className="text-zinc-400">&gt; Modifying difficulty curve +15%...</p>}
                      </>
                    )}
                  </div>
                </div>

                {/* Extra padding at bottom for breathing room */}
                <div className="h-4"></div>
              </div>
            </div>

            {/* Bottom CTA (Fixed Bottom) */}
            <div className="p-5 border-t border-slate-100 bg-white flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-10">
              <button className="w-full bg-slate-900 text-white font-bold text-xs py-3.5 rounded-xl shadow-md hover:bg-slate-800 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                Configure Parameters
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
