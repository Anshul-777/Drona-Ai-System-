"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { storageAdapter } from "@/lib/storageAdapter";
import { v4 as uuidv4 } from "uuid";

/* ─────────────────────────────────────────────────────────────
   7 BASELINE PSYCHOLOGICAL + SCIENTIFIC ASSESSMENT QUESTIONS
   These build initial signals across learning style, resilience,
   motivation, attention, memory, and stress response.
   ALL appear as if the agent generated them.
   ───────────────────────────────────────────────────────────── */
const BASELINE_QUESTIONS = [
  {
    question: "When you encounter a difficult problem you can't solve, what is your immediate reaction?",
    type: "single-select" as const,
    options: [
      "I feel frustrated and usually give up or ask for the direct answer.",
      "I take a break and come back to it later with fresh perspective.",
      "I break it down into smaller pieces and try different approaches systematically.",
      "I actively seek out hints, resources, or ask others to guide my thinking."
    ]
  },
  {
    question: "How do you prefer to learn a completely new and complex concept?",
    type: "multi-select" as const,
    options: [
      "Seeing diagrams, charts, visual mind maps, or animations.",
      "Listening to someone explain it verbally, via podcast, or discussion.",
      "Reading detailed texts, notes, and writing my own summaries.",
      "Doing practical examples, experiments, or solving related problems immediately."
    ]
  },
  {
    question: "In your own words, what does academic success mean to you personally — and why does it truly matter?",
    type: "text-only" as const,
    options: [] as string[]
  },
  {
    question: "How often do you find yourself getting distracted, procrastinating, or losing focus during a study session?",
    type: "single-select" as const,
    options: [
      "Constantly. I struggle to focus for even 10 minutes without breaking concentration.",
      "Often, especially when the material feels boring or difficult to understand.",
      "Occasionally, but I can usually pull myself back on track after a few minutes.",
      "Rarely. When I commit to studying, I enter deep focus easily and sustain it."
    ]
  },
  {
    question: "When preparing for an exam, how do you usually retain and remember important facts or concepts?",
    type: "multi-select" as const,
    options: [
      "Rote memorization — repeating facts over and over until they stick.",
      "Creating stories, mnemonics, metaphors, or building mental associations.",
      "Understanding the deep logical 'why' behind the concept, not just memorizing.",
      "Practicing with flashcards, spaced repetition, or active recall exercises."
    ]
  },
  {
    question: "Describe a specific time you failed or struggled with something academic. What caused it, how did it make you feel, and what did you do?",
    type: "text-only" as const,
    options: [] as string[]
  },
  {
    question: "How do you typically feel and behave the night before a major exam or evaluation?",
    type: "single-select" as const,
    options: [
      "Overwhelmed, anxious, and unable to sleep — spiraling with worry.",
      "Stressed and driven to cram intensively until the last minute.",
      "Somewhat nervous, but generally calm and doing light review or sleep.",
      "Completely relaxed and confident, knowing I've already prepared thoroughly."
    ]
  }
];

const TOTAL_BASELINE = BASELINE_QUESTIONS.length; // 7
const EXPECTED_AGENT_QUESTIONS = 12; // avg of 10-15
const TOTAL_EXPECTED = TOTAL_BASELINE + EXPECTED_AGENT_QUESTIONS; // 19

const FINAL_TEST_QUESTION = {
  question: "Your psychological and behavioral profile is now complete. To achieve the highest precision in personalization, we recommend a focused academic diagnostic — a short test tailored to your class, board, and syllabus.",
  type: "single-select" as const,
  options: ["Begin Assessment", "Continue Later"]
};

type QuestionData = {
  question: string;
  type: "single-select" | "multi-select" | "text-only";
  options: string[];
};

/* ─── Initialization stage data ─── */
const INIT_STAGES = [
  { label: "Neural profile mapping", icon: "neurology", duration: 2200 },
  { label: "Cognitive pattern indexing", icon: "pattern", duration: 1800 },
  { label: "Teaching agent calibration", icon: "psychology", duration: 2000 },
  { label: "Ecosystem deployment", icon: "rocket_launch", duration: 1500 },
];

/* ─── Motivational quotes aligned with platform philosophy ─── */
const MOTIVATIONAL_QUOTES = [
  "The battlefield of knowledge awaits — your seven agents stand ready at your command.",
  "From this moment, learning is no longer passive. It is orchestrated, precise, and yours.",
  "Great scholars aren't born — they are built through deliberate practice and intelligent guidance.",
  "Your mind is the most powerful algorithm in existence. We've just given it seven co-processors.",
  "The distance between potential and mastery is called strategy — and now you have one.",
  "In the architecture of intellect, every question you ask builds a stronger foundation.",
  "Discipline is choosing between what you want now and what you want most. Your agents remember both.",
  "The pursuit of knowledge is never a solitary journey when intelligence is orchestrated.",
];

/* ─── BYOK Provider config ─── */
const PROVIDER_OPTIONS = [
  { id: "gemini", name: "Google Gemini", abbr: "GE", color: "#4285F4" },
  { id: "openai", name: "OpenAI", abbr: "OA", color: "#10a37f" },
  { id: "anthropic", name: "Anthropic", abbr: "AN", color: "#cc785c" },
  { id: "groq", name: "Groq", abbr: "GQ", color: "#f55036" },
];

/* ─── Subscription tiers ─── */
const SUBSCRIPTION_TIERS = [
  { id: "free", name: "Free", price: "$0", period: "forever", features: ["3 assessments / month", "Basic profiling", "Community support"], highlight: false },
  { id: "premium", name: "Premium", price: "₹799", period: "/month", features: ["Unlimited assessments", "Full AI tutor access", "5-dimension profiling", "Priority support"], highlight: true },
  { id: "enterprise", name: "Enterprise", price: "Custom", period: "", features: ["Everything in Premium", "BYOK support", "Advanced analytics", "Custom branding"], highlight: false },
];

/* ═══════════════════════════════════════════════════════════
   WORD-BY-WORD TYPING ANIMATION
   ═══════════════════════════════════════════════════════════ */
function WordTyper({ text, active, onComplete, className }: { text: string; active: boolean; onComplete?: () => void; className?: string }) {
  const [wordIndex, setWordIndex] = useState(0);
  const words = text.split(" ");
  useEffect(() => {
    if (!active) { setWordIndex(0); return; }
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setWordIndex(i);
      if (i >= words.length) { clearInterval(iv); onComplete?.(); }
    }, 130);
    return () => clearInterval(iv);
  }, [active, text, words.length, onComplete]);

  return (
    <span className={className}>
      {words.slice(0, wordIndex).join(" ")}
      {wordIndex < words.length && wordIndex > 0 && (
        <span className="inline-block w-[2px] h-[0.9em] ml-1 -mb-[1px] align-middle bg-current animate-pulse" />
      )}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function AssessmentEngine() {
  const router = useRouter();

  /* ─── Core State (UNCHANGED) ─── */
  const [showWelcome, setShowWelcome] = useState(true);
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [questionQueue, setQuestionQueue] = useState<QuestionData[]>(BASELINE_QUESTIONS);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData>(BASELINE_QUESTIONS[0]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [elaboration, setElaboration] = useState("");
  const [isAgentPhase, setIsAgentPhase] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [agentQuestionCount, setAgentQuestionCount] = useState(0);
  const [isFinalQuestion, setIsFinalQuestion] = useState(false);

  /* ─── Initialization State ─── */
  const [showCinematic, setShowCinematic] = useState(false);
  const [activeTab, setActiveTab] = useState<'byok' | 'plans' | 'preferences'>('byok');
  const [initStage, setInitStage] = useState(0);
  const [setupComplete, setSetupComplete] = useState(false);

  /* ─── BYOK State ─── */
  const [selectedProvider, setSelectedProvider] = useState("gemini");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [byokSaved, setByokSaved] = useState(false);

  /* ─── Subscription State ─── */
  const [selectedTier, setSelectedTier] = useState("free");

  /* ─── Settings State ─── */
  const [assessmentLength, setAssessmentLength] = useState("standard");
  const [strictTone, setStrictTone] = useState(false);
  const [socraticMethod, setSocraticMethod] = useState(true);
  const [visualExplanations, setVisualExplanations] = useState(true);

  /* ─── Welcome Transition State ─── */
  const [showWelcomeTransition, setShowWelcomeTransition] = useState(false);
  const [userName, setUserName] = useState("Scholar");
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [quoteTypingDone, setQuoteTypingDone] = useState(false);

  /* ─── Fetch user's first name from Supabase on mount ─── */
  useEffect(() => {
    setMotivationalQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (user.user_metadata?.full_name) {
            setUserName(user.user_metadata.full_name.split(" ")[0]);
          }
          if (!user.user_metadata?.exam_target || !user.user_metadata?.class_level || !user.user_metadata?.board_type) {
            const demoQuestions = [
              {
                question: "To accurately calibrate your curriculum, what class are you currently in?",
                type: "single-select" as const,
                options: ["Class 10", "Class 11", "Class 12", "Dropper"]
              },
              {
                question: "Which educational board do you follow?",
                type: "single-select" as const,
                options: ["CBSE", "ICSE", "State Board", "IB"]
              },
              {
                question: "What is your primary target exam?",
                type: "single-select" as const,
                options: ["JEE", "NEET", "CET", "Boards Only"]
              }
            ];
            const newQueue = [...demoQuestions, ...BASELINE_QUESTIONS];
            setQuestionQueue(newQueue);
            setCurrentQuestion(newQueue[0]);
          }
        }
      } catch { /* fallback to "Scholar" */ }
    };
    fetchUser();
  }, []);

  /* ─── Simulate agent "thinking" for static questions too (UNCHANGED) ─── */
  const simulateThinking = useCallback((callback: () => void) => {
    setIsThinking(true);
    const delay = 600 + Math.random() * 800;
    setTimeout(() => { setIsThinking(false); callback(); }, delay);
  }, []);

  /* ─── Animate question transitions (UNCHANGED) ─── */
  const transitionToQuestion = useCallback((q: QuestionData, isAgent = false) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQuestion(q);
      setSelectedOptions([]);
      setElaboration("");
      if (isAgent) setAgentQuestionCount(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 60);
    }, 250);
  }, []);

  /* ─── Option toggle (UNCHANGED) ─── */
  const handleOptionToggle = (option: string) => {
    if (currentQuestion.type === "single-select") setSelectedOptions([option]);
    else if (currentQuestion.type === "multi-select") {
      setSelectedOptions(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
    }
  };

  /* ─── Start cinematic initialization (extracted for reuse) ─── */
  const startCinematic = useCallback(() => {
    setShowCinematic(true);
    let stage = 0;
    const advanceStage = () => {
      if (stage < INIT_STAGES.length) {
        setInitStage(stage);
        stage++;
        setTimeout(advanceStage, INIT_STAGES[stage - 1]?.duration ?? 1500);
      } else {
        setSetupComplete(true);
      }
    };
    advanceStage();
  }, []);

  /* ─── Check for return from Test Page ─── */
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage.getItem("forceCinematic") === "true") {
      window.localStorage.removeItem("forceCinematic");
      setShowWelcome(false);
      setStarted(true);
      startCinematic();
    }
  }, [startCinematic]);

  /* ─── Final question direct action handlers ─── */
  const handleBeginTest = () => { router.push("/test"); };
  const handleSkipTest = async () => {
    await storageAdapter.insertNotification({
      id: uuidv4(),
      title: "Assessment Skipped",
      message: "Take your assessment later to personalize your AI agents for better results.",
      type: "recommended",
      href: "/onboarding",
      isRead: false,
      timestamp: Date.now()
    });
    startCinematic();
  };

  /* ─── Enter dashboard with welcome transition ─── */
  const handleEnterDashboard = () => {
    setShowWelcomeTransition(true);
  };
  useEffect(() => {
    if (showWelcomeTransition && quoteTypingDone) {
      const t = setTimeout(() => router.push("/platform"), 2800);
      return () => clearTimeout(t);
    }
  }, [showWelcomeTransition, quoteTypingDone, router]);

  /* ─── BYOK save handler ─── */
  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) return;
    try {
      await fetch(`http://localhost:8000/api/byok/add-provider?user_id=temp_user`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: selectedProvider, api_key: apiKeyInput, is_active: true })
      });
    } catch { /* non-critical */ }
    setByokSaved(true);
    setTimeout(() => setByokSaved(false), 3000);
  };

  /* ─── Tier select handler ─── */
  const handleSelectTier = async (tierId: string) => {
    setSelectedTier(tierId);
    try { await fetch(`http://localhost:8000/api/subscription/select/temp_user/${tierId}`, { method: "POST" }); } catch { /* non-critical */ }
  };

  /* ═══════════════════════════════════════════════════════════
     SUBMIT ANSWER — ALL QUESTION LOGIC PRESERVED EXACTLY
     Only the final-question branch is updated.
     ═══════════════════════════════════════════════════════════ */
  const handleNext = async () => {
    // Final question is handled by direct card buttons, not this handler.
    // Safety fallback only:
    if (isFinalQuestion) return;

    // Build answer data
    const answerData = { question: currentQuestion.question, options_selected: selectedOptions, elaboration };
    const newHistory = [
      ...history,
      { role: "model", parts: [{ text: JSON.stringify(currentQuestion) }] },
      { role: "user", parts: [{ text: JSON.stringify(answerData) }] }
    ];
    setHistory(newHistory);

    // ═══════════════════════════════════════════════════════════
    // BASELINE PHASE: Show all baseline questions first
    // ═══════════════════════════════════════════════════════════
    if (currentQIndex < questionQueue.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      simulateThinking(() => { transitionToQuestion(questionQueue[nextIdx]); });
    } else if (!isAgentPhase) {
      // ═══════════════════════════════════════════════════════════
      // TRANSITION TO AGENT PHASE: All 7 baselines are done
      // ═══════════════════════════════════════════════════════════
      setIsAgentPhase(true);
      setIsThinking(true);
      try {
        const res = await fetch("http://localhost:8000/api/agent/init", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history: newHistory, current_answer: answerData })
        });
        if (!res.ok) throw new Error(`Agent init failed: ${res.statusText}`);
        const jsonRes = await res.json();
        const data = jsonRes.data;
        if (jsonRes.session_id) { setSessionId(jsonRes.session_id); console.log("✅ Agent session initialized:", jsonRes.session_id); }
        setIsThinking(false);
        if (data.profile_complete) {
          setIsFinalQuestion(true);
          transitionToQuestion(FINAL_TEST_QUESTION);
        } else {
          transitionToQuestion({ question: data.question, type: data.type, options: data.options || [] }, true);
        }
      } catch (err) {
        console.error("❌ Agent initialization error:", err);
        setIsThinking(false);
        setIsFinalQuestion(true);
        transitionToQuestion(FINAL_TEST_QUESTION);
      }
    } else {
      // ═══════════════════════════════════════════════════════════
      // AGENT PHASE: Get next dynamic question
      // ═══════════════════════════════════════════════════════════
      setIsThinking(true);
      try {
        if (!sessionId) throw new Error("No session ID available");
        const res = await fetch("http://localhost:8000/api/agent/next", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, current_answer: answerData })
        });
        if (!res.ok) throw new Error(`Agent next failed: ${res.statusText}`);
        const jsonRes = await res.json();
        const data = jsonRes.data;
        setIsThinking(false);
        if (data.profile_complete) {
          console.log("✅ Assessment profile complete!");
          setIsFinalQuestion(true);
          transitionToQuestion(FINAL_TEST_QUESTION);
        } else {
          transitionToQuestion({ question: data.question, type: data.type, options: data.options || [] }, true);
        }
      } catch (err) {
        console.error("❌ Agent next error:", err);
        setIsThinking(false);
        setIsFinalQuestion(true);
        transitionToQuestion(FINAL_TEST_QUESTION);
      }
    }
  };

  const canSubmit = isThinking ? false
    : currentQuestion.type === "text-only" ? elaboration.trim().length > 0
    : selectedOptions.length > 0 || elaboration.trim().length > 0;

  /* ═══════════════════════════════════════════════════════════
     WELCOME POPUP — shows once on first load (UNCHANGED)
     ═══════════════════════════════════════════════════════════ */
  const welcomePopup = showWelcome && !started && (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] max-w-md w-[92%] p-8 relative animate-[slideUp_0.4s_cubic-bezier(0.2,0.8,0.2,1)]">
        <button onClick={() => setShowWelcome(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">close</span>
        </button>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center mb-5 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
        </div>
        <h3 className="font-display text-xl font-bold text-on-surface mb-2">Before we begin</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
          This assessment is essential for personalizing your Drona AI experience. Your responses are used to build your unique learning profile — the foundation that all AI agents will use to teach you effectively.
        </p>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
          Please answer each question <strong className="text-on-surface">honestly and thoughtfully</strong>. The more truthful your responses, the better your agents will perform for you.
        </p>
        <button onClick={() => { setShowWelcome(false); setStarted(true); }} className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-sm">
          I Understand, Begin Assessment
        </button>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════
     WELCOME TRANSITION — after clicking "Enter Dashboard"
     ═══════════════════════════════════════════════════════════ */
  if (showWelcomeTransition) {
    return (
      <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "#fafaf8", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
        {/* Ambient glows */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[55vw] h-[55vw] rounded-full" style={{ background: "radial-gradient(circle,rgba(42,92,255,0.06),transparent 70%)" }} />
          <div className="absolute bottom-[-15%] right-[-10%] w-[45vw] h-[45vw] rounded-full" style={{ background: "radial-gradient(circle,rgba(124,58,237,0.05),transparent 70%)" }} />
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.4 }}>
            <defs><pattern id="wdots" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.85" fill="#0a0a0f" opacity="0.07" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#wdots)" />
          </svg>
        </div>
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-2xl animate-[fadeSlideUp_0.8s_ease]">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8" style={{ background: "linear-gradient(135deg,#2a5cff,#7c3aed)" }}>
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          </div>
          <h1 className="font-black tracking-[-0.03em] mb-6" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px,8vw,72px)", background: "linear-gradient(135deg,#0a0a0f,#374151,#2a5cff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Welcome, {userName}.
          </h1>
          <div className="h-px w-12 bg-outline-variant/40 mb-6" />
          <p className="text-xl md:text-2xl leading-relaxed italic min-h-[3em]" style={{ fontFamily: "'Instrument Serif',Georgia,serif", color: "#2a5cff" }}>
            <WordTyper text={motivationalQuote} active={true} onComplete={() => setQuoteTypingDone(true)} />
          </p>
          {quoteTypingDone && (
            <div className="mt-10 flex gap-2 animate-[fadeSlideUp_0.5s_ease]">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "linear-gradient(135deg,#2a5cff,#7c3aed)", animation: `dotPulse 1.4s ease-in-out infinite ${i * 0.22}s` }} />
              ))}
            </div>
          )}
        </div>
        <style jsx>{`
          @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes dotPulse { 0%,100% { transform:scale(1); opacity:0.3; } 50% { transform:scale(1.6); opacity:1; } }
        `}</style>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     CINEMATIC INITIALIZATION SCREEN — Premium Redesign
     ═══════════════════════════════════════════════════════════ */
  if (showCinematic) {
    const initProgress = setupComplete ? 100 : Math.min(((initStage + 1) / INIT_STAGES.length) * 90, 90);
    const circumference = 2 * Math.PI * 52;

    return (
      <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn w-full px-8 py-10">
        <div className="bg-white rounded-[2rem] shadow-[0_32px_100px_rgba(0,0,0,0.08)] border border-outline-variant/15 w-[95%] max-w-6xl relative overflow-hidden">

          {/* Top header bar */}
          <div className="px-8 pt-7 pb-5 border-b border-outline-variant/15">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-on-surface-variant/50 mb-1">System Configuration</p>
                <h2 className="font-display text-2xl font-black text-on-surface tracking-tight">Configure Your AI Ecosystem</h2>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase text-on-surface-variant/50">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Secure Session
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* ─── LEFT: Configuration Tabs ─── */}
            <div className="flex-1 p-8 border-b lg:border-b-0 lg:border-r border-outline-variant/15 min-h-[420px] flex flex-col">
              <div className="flex gap-1 p-1 bg-surface-container-low rounded-xl w-fit mb-6">
                {([["byok", "🔑", "API Keys"], ["plans", "💎", "Plans"], ["preferences", "⚙️", "Preferences"]] as const).map(([id, icon, label]) => (
                  <button key={id} onClick={() => setActiveTab(id as any)}
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === id ? "bg-white shadow-sm text-on-surface" : "text-on-surface-variant/60 hover:text-on-surface"}`}>
                    <span className="text-sm">{icon}</span>{label}
                  </button>
                ))}
              </div>

              <div className="flex-1">
                {/* ── BYOK Tab ── */}
                {activeTab === "byok" && (
                  <div className="animate-fadeIn space-y-5">
                    <div>
                      <p className="text-xs font-mono tracking-[0.15em] uppercase text-on-surface-variant/50 mb-3">Select Provider</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {PROVIDER_OPTIONS.map(p => (
                          <button key={p.id} onClick={() => setSelectedProvider(p.id)}
                            className={`p-3 rounded-xl border-2 transition-all cursor-pointer text-left ${selectedProvider === p.id ? "border-primary bg-primary/[0.03] shadow-sm" : "border-outline-variant/20 hover:border-primary/30"}`}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black mb-2" style={{ background: p.color }}>{p.abbr}</div>
                            <p className="text-xs font-bold text-on-surface truncate">{p.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-mono tracking-[0.15em] uppercase text-on-surface-variant/50 mb-2">API Access Key (BYOK)</p>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <input type={showApiKey ? "text" : "password"} placeholder="sk-••••••••••••••••••••••••••••••"
                            value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)}
                            className="w-full bg-surface-container-low border border-outline-variant/25 rounded-xl px-4 py-3 pr-10 text-sm font-mono focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                          <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface cursor-pointer">
                            <span className="material-symbols-outlined text-[18px]">{showApiKey ? "visibility_off" : "visibility"}</span>
                          </button>
                        </div>
                        <button onClick={handleSaveApiKey}
                          className={`px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${byokSaved ? "bg-green-500 text-white" : "bg-primary text-white hover:bg-primary-container"}`}>
                          {byokSaved ? "✓ Saved" : "Verify & Save"}
                        </button>
                      </div>
                      <p className="text-[10px] text-on-surface-variant/40 mt-2">Optional — connect your own API key to bypass platform usage limits.</p>
                    </div>
                  </div>
                )}

                {/* ── Plans Tab ── */}
                {activeTab === "plans" && (
                  <div className="animate-fadeIn">
                    <p className="text-xs font-mono tracking-[0.15em] uppercase text-on-surface-variant/50 mb-4">Choose Your Plan</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {SUBSCRIPTION_TIERS.map(tier => (
                        <button key={tier.id} onClick={() => handleSelectTier(tier.id)}
                          className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer relative ${selectedTier === tier.id ? "border-primary bg-primary/[0.03] shadow-md" : "border-outline-variant/20 hover:border-primary/30"} ${tier.highlight ? "ring-1 ring-primary/20" : ""}`}>
                          {tier.highlight && <span className="absolute -top-2.5 left-4 bg-primary text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase">Recommended</span>}
                          <p className="font-bold text-on-surface text-sm mb-0.5">{tier.name}</p>
                          <p className="text-lg font-black text-primary mb-3">{tier.price}<span className="text-xs font-normal text-on-surface-variant/60"> {tier.period}</span></p>
                          <div className="space-y-1.5">
                            {tier.features.map(f => (
                              <div key={f} className="flex items-center gap-2 text-xs text-on-surface-variant">
                                <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>{f}
                              </div>
                            ))}
                          </div>
                          {selectedTier === tier.id && <div className="absolute top-4 right-4 w-5 h-5 rounded-full border-[5px] border-primary" />}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-on-surface-variant/40 mt-3">All features are unlocked during the beta period regardless of plan selection.</p>
                  </div>
                )}

                {/* ── Preferences Tab ── */}
                {activeTab === "preferences" && (
                  <div className="animate-fadeIn space-y-5">
                    <p className="text-xs font-mono tracking-[0.15em] uppercase text-on-surface-variant/50 mb-2">Agent Behavior</p>
                    <div className="space-y-4">
                      {([
                        { label: "Assessment Length", desc: "How thorough each assessment should be", value: assessmentLength, type: "select" as const, options: ["quick", "standard", "extended"], setter: setAssessmentLength },
                      ] as const).map((s) => (
                        <div key={s.label} className="flex items-center justify-between">
                          <div><p className="text-sm font-semibold text-on-surface">{s.label}</p><p className="text-[10px] text-on-surface-variant/50">{s.desc}</p></div>
                          <select value={s.value} onChange={e => s.setter(e.target.value)} className="bg-surface-container-low border border-outline-variant/25 rounded-lg px-3 py-2 text-xs font-bold cursor-pointer focus:outline-none focus:border-primary appearance-none">
                            {s.options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                          </select>
                        </div>
                      ))}
                      {([
                        { label: "Strict Academic Tone", desc: "Formal language in all interactions", checked: strictTone, setter: setStrictTone },
                        { label: "Socratic Method", desc: "Guide through questions rather than answers", checked: socraticMethod, setter: setSocraticMethod },
                        { label: "Visual Explanations", desc: "Include diagrams and visual aids", checked: visualExplanations, setter: setVisualExplanations },
                      ] as const).map(s => (
                        <label key={s.label} className="flex items-center justify-between cursor-pointer group">
                          <div><p className="text-sm font-semibold text-on-surface">{s.label}</p><p className="text-[10px] text-on-surface-variant/50">{s.desc}</p></div>
                          <div className={`w-10 h-[22px] rounded-full p-0.5 transition-colors cursor-pointer ${s.checked ? "bg-primary" : "bg-outline-variant/30"}`} onClick={() => s.setter(!s.checked)}>
                            <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform ${s.checked ? "translate-x-[18px]" : "translate-x-0"}`} />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* ── Enter Dashboard Area ── */}
              <div className="mt-8 border-t border-outline-variant/15 pt-6 flex justify-between items-center">
                <div>
                  <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-on-surface-variant/50">System Status</p>
                  <p className="text-sm font-bold text-on-surface">{setupComplete ? "Calibration Complete" : "Initializing Agents..."}</p>
                </div>
                <button onClick={handleEnterDashboard} disabled={!setupComplete}
                  className={`py-4 px-8 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all duration-500 ${setupComplete
                    ? "bg-[#0a0a0f] text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15 cursor-pointer"
                    : "bg-surface-container-high text-on-surface-variant/30 pointer-events-none"}`}>
                  <span>{setupComplete ? "Enter Dashboard" : "Initializing..."}</span>
                  <span className="material-symbols-outlined text-lg">{setupComplete ? "arrow_forward" : "sync"}</span>
                </button>
              </div>
            </div>

            {/* ─── RIGHT: System Calibration Status ─── */}
            <div className="lg:w-[360px] p-8 flex flex-col items-center justify-center">
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-on-surface-variant/40 mb-4 self-start">System Calibration</p>

              {/* SVG circular progress */}
              <div className="relative mb-6">
                <svg className="w-28 h-28" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#0042dc" strokeWidth="5"
                    strokeDasharray={circumference} strokeDashoffset={circumference * (1 - initProgress / 100)}
                    strokeLinecap="round" className="transition-all duration-700 ease-out" transform="rotate(-90 60 60)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-on-surface">{Math.round(initProgress)}%</span>
                </div>
              </div>

              {/* Stage checklist */}
              <div className="w-full space-y-3 mb-6">
                {INIT_STAGES.map((stage, idx) => {
                  const isDone = setupComplete || idx < initStage;
                  const isCurrent = !setupComplete && idx === initStage;
                  return (
                    <div key={idx} className={`flex items-start gap-3 transition-all duration-500 ${isDone ? "opacity-100" : isCurrent ? "opacity-100" : "opacity-25"}`}>
                      <span className={`material-symbols-outlined text-base mt-0.5 shrink-0 ${isDone ? "text-green-500" : isCurrent ? "text-primary animate-pulse" : "text-outline-variant/30"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        {isDone ? "check_circle" : isCurrent ? "pending" : "radio_button_unchecked"}
                      </span>
                      <div>
                        <p className={`text-xs font-bold ${isDone ? "text-on-surface" : isCurrent ? "text-primary" : "text-on-surface-variant/30"}`}>{stage.label}</p>
                        <p className="text-[9px] text-on-surface-variant/40 uppercase tracking-wider">
                          {isDone ? "Complete" : isCurrent ? "In Progress" : "Queued"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer stats */}
              <div className="w-full flex justify-between text-[9px] font-mono tracking-wider uppercase text-on-surface-variant/30 border-t border-outline-variant/15 pt-3">
                <span>Latency: &lt;50ms</span>
                <span className="text-green-500/60">Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     MAIN ASSESSMENT UI
     ═══════════════════════════════════════════════════════════ */

  const answeredQuestions = isAgentPhase ? questionQueue.length + agentQuestionCount : currentQIndex + 1;
  const expectedTotal = questionQueue.length + EXPECTED_AGENT_QUESTIONS;
  const progressPct = isFinalQuestion ? 98 : Math.min((answeredQuestions / expectedTotal) * 95, 95);

  const getStatusText = () => {
    if (isThinking && isFinalQuestion) return "Analysis complete — preparing recommendation...";
    if (isThinking) return "Analyzing your response...";
    if (isFinalQuestion) return "Profiling complete";
    if (isAgentPhase) return `Profiling · Question ${agentQuestionCount} of ~${EXPECTED_AGENT_QUESTIONS}`;
    return `Baseline · ${currentQIndex + 1} of ${questionQueue.length}`;
  };

  return (
    <>
      {welcomePopup}
      <div className="flex-1 flex flex-col pt-20 pb-5 min-h-0 w-full max-w-3xl mx-auto px-6">

        {/* Agent badge + subtle progress */}
        <div className="flex items-center gap-4 mb-3 shrink-0">
          <div className="brand-mark shrink-0 shadow-lg shadow-black/10">A</div>
          <div className="flex-1">
            <h3 className="font-display text-[13px] font-bold text-on-surface tracking-tight leading-none">Drona Assessment Agent</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isThinking ? "bg-amber-500" : isFinalQuestion ? "bg-primary" : "bg-green-500"} animate-pulse`} />
              <span className="text-[11px] text-on-surface-variant/60 font-medium">{getStatusText()}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[3px] bg-white/30 rounded-full overflow-hidden mb-5 shrink-0">
          <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPct}%` }} />
        </div>

        {/* ─── Thinking State ─── */}
        {isThinking ? (
          <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn">
            <div className="flex gap-2 mb-4">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <p className="text-sm text-on-surface-variant/60 font-medium">
              {isFinalQuestion ? "Analysis complete — preparing your recommendation..." : isAgentPhase ? "Analyzing your profile and generating next question..." : "Preparing your next question..."}
            </p>
          </div>
        ) : isFinalQuestion ? (
          /* ═══════════════════════════════════════════════════════════
             FINAL QUESTION — Completely distinct design
             ═══════════════════════════════════════════════════════════ */
          <div className={`flex-1 overflow-y-auto min-h-0 transition-all duration-500 ease-out ${isTransitioning ? "opacity-0 translate-y-4 scale-[0.98]" : "opacity-100 translate-y-0 scale-100"}`}>

            {/* Recommendation note banner */}
            <div className="bg-primary/[0.04] border border-primary/15 rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <div>
                <p className="text-xs text-on-surface leading-relaxed">
                  This diagnostic assessment evaluates your current academic knowledge across core subjects aligned to your class and board curriculum. It enables Drona AI to precisely calibrate difficulty, pacing, and focus areas from your very first session.
                </p>
                <p className="text-[10px] text-primary font-bold mt-2 uppercase tracking-wider">
                  Recommended — Taking this test ensures the most accurate agent personalization
                </p>
              </div>
            </div>

            {/* Question card */}
            <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-on-surface-variant/50">Assessment Agent</p>
                  <p className="text-xs font-bold text-on-surface">Profiling Complete — Final Step</p>
                </div>
              </div>
              <div className="h-px bg-outline-variant/20 mb-5" />
              <p className="font-display text-lg md:text-xl font-semibold text-on-surface leading-snug">
                {currentQuestion.question}
              </p>
            </div>

            {/* Two side-by-side action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Begin Assessment */}
              <button onClick={handleBeginTest}
                className="group p-6 rounded-2xl bg-primary text-white text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/25 cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-2xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
                  <p className="font-bold text-base mb-1">Begin Assessment</p>
                  <p className="text-white/70 text-xs leading-relaxed">Calibrate your academic baseline for maximum precision</p>
                </div>
                <span className="absolute bottom-5 right-5 material-symbols-outlined text-white/30 text-2xl group-hover:text-white/60 group-hover:translate-x-1 transition-all">arrow_forward</span>
              </button>

              {/* Continue Later */}
              <button onClick={handleSkipTest}
                className="group p-6 rounded-2xl bg-white border-2 border-outline-variant/25 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-outline-variant/40 cursor-pointer">
                <span className="material-symbols-outlined text-2xl mb-3 block text-on-surface-variant/40" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                <p className="font-bold text-base text-on-surface mb-1">Continue Later</p>
                <p className="text-on-surface-variant/60 text-xs leading-relaxed">Proceed to dashboard setup — you can take this test anytime</p>
                <span className="absolute bottom-5 right-5 material-symbols-outlined text-on-surface-variant/20 text-2xl group-hover:text-on-surface-variant/40 transition-all">skip_next</span>
              </button>
            </div>
          </div>
        ) : (
          /* ─── Regular Question Card (UNCHANGED) ─── */
          <div className={`flex-1 overflow-y-auto min-h-0 transition-all duration-300 ease-out ${isTransitioning ? "opacity-0 translate-y-3 scale-[0.99]" : "opacity-100 translate-y-0 scale-100"}`}>
            <div className="max-w-full">
              {/* Question */}
              <div className="mb-4">
                <p className="font-display text-on-surface leading-snug text-lg md:text-xl font-semibold">
                  &ldquo;{currentQuestion.question}&rdquo;
                </p>
                {currentQuestion.type === "multi-select" && (
                  <p className="text-[11px] text-on-surface-variant/50 mt-1.5 font-medium uppercase tracking-wider">Select all that apply</p>
                )}
              </div>

              {/* Options */}
              {currentQuestion.type !== "text-only" && (
                <div className="space-y-2 mb-3">
                  {currentQuestion.options.map((opt: string, idx: number) => {
                    const isSelected = selectedOptions.includes(opt);
                    return (
                      <button key={`${agentQuestionCount}-${currentQIndex}-${idx}`}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 cursor-pointer ${isSelected ? "border-primary/40 bg-primary/[0.04] shadow-sm" : "border-transparent bg-white/40 hover:bg-white/60"}`}
                        onClick={() => handleOptionToggle(opt)}>
                        <div className="flex items-center gap-3">
                          <span className={`material-symbols-outlined text-lg shrink-0 transition-all ${isSelected ? "text-primary" : "text-outline-variant/30"}`}>
                            {currentQuestion.type === "single-select" ? (isSelected ? "radio_button_checked" : "radio_button_unchecked") : (isSelected ? "check_box" : "check_box_outline_blank")}
                          </span>
                          <span className={`text-sm leading-snug transition-colors ${isSelected ? "text-primary font-medium" : "text-on-surface/80"}`}>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Auto-growing text input */}
              <AutoGrowTextarea
                value={elaboration} onChange={setElaboration}
                placeholder={currentQuestion.type === "text-only" ? "Share your thoughts here..." : "Add more detail (optional)..."}
                isTextOnly={currentQuestion.type === "text-only"}
              />

              {/* Submit — directly under content */}
              <div className="flex justify-end mt-3">
                <button onClick={handleNext} disabled={!canSubmit}
                  className={`bg-primary text-white font-semibold py-2.5 px-7 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer ${!canSubmit ? "opacity-30 pointer-events-none" : ""}`}>
                  Continue
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   AutoGrowTextarea — grows with content, scrolls after max
   ═══════════════════════════════════════════════════════════ */
function AutoGrowTextarea({
  value, onChange, placeholder, isTextOnly
}: { value: string; onChange: (v: string) => void; placeholder: string; isTextOnly: boolean; }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const maxH = isTextOnly ? 200 : 120;
  const minH = isTextOnly ? 56 : 40;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const scrollH = el.scrollHeight;
    el.style.height = `${Math.min(scrollH, maxH)}px`;
    el.style.overflowY = scrollH > maxH ? "auto" : "hidden";
  }, [value, maxH]);

  return (
    <textarea ref={ref} value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/30 border border-white/50 focus:border-primary/30 focus:ring-2 focus:ring-primary/8 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline/30 resize-none transition-[border,box-shadow] outline-none text-sm"
      placeholder={placeholder} style={{ minHeight: `${minH}px` }} rows={1} />
  );
}
