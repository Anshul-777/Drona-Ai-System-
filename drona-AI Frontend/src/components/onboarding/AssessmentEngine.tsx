"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  question: "Would you like to give a Knowledge test to better assess your profile?",
  type: "single-select" as const,
  options: ["Yes", "Skip"]
};

type QuestionData = {
  question: string;
  type: "single-select" | "multi-select" | "text-only";
  options: string[];
};

/* ─── Initialization stage data ─── */
const INIT_STAGES = [
  { label: "Mapping neural learning profile", icon: "neurology", duration: 2200 },
  { label: "Indexing cognitive patterns", icon: "pattern", duration: 1800 },
  { label: "Calibrating teaching agents", icon: "psychology", duration: 2000 },
  { label: "Deploying personalized ecosystem", icon: "rocket_launch", duration: 1500 },
];

export default function AssessmentEngine() {
  const router = useRouter();

  /* ─── State ─── */
  const [showWelcome, setShowWelcome] = useState(true);
  const [started, setStarted] = useState(false);

  const [history, setHistory] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData>(BASELINE_QUESTIONS[0]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [elaboration, setElaboration] = useState("");

  const [isAgentPhase, setIsAgentPhase] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [agentQuestionCount, setAgentQuestionCount] = useState(0);
  const [isFinalQuestion, setIsFinalQuestion] = useState(false);

  const [setupComplete, setSetupComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<'byok' | 'subscribe' | 'settings'>('byok');
  const [showCinematic, setShowCinematic] = useState(false);
  const [initStage, setInitStage] = useState(0);

  /* ─── Simulate agent "thinking" for static questions too ─── */
  const simulateThinking = useCallback((callback: () => void) => {
    setIsThinking(true);
    const delay = 600 + Math.random() * 800; // 600ms–1400ms
    setTimeout(() => {
      setIsThinking(false);
      callback();
    }, delay);
  }, []);

  /* ─── Animate question transitions ─── */
  const transitionToQuestion = useCallback((q: QuestionData, isAgent = false) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentQuestion(q);
      setSelectedOptions([]);
      setElaboration("");
      if (isAgent) {
        setAgentQuestionCount(prev => prev + 1);
      }
      setTimeout(() => setIsTransitioning(false), 60);
    }, 250);
  }, []);

  /* ─── Option toggle ─── */
  const handleOptionToggle = (option: string) => {
    if (currentQuestion.type === "single-select") {
      setSelectedOptions([option]);
    } else if (currentQuestion.type === "multi-select") {
      setSelectedOptions(prev =>
        prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
      );
    }
  };

  /* ─── Submit answer ─── */
  const handleNext = async () => {
    // FINAL TEST QUESTION - Check if this is the final test question
    if (currentQuestion.question === FINAL_TEST_QUESTION.question) {
      if (selectedOptions.includes("Yes")) {
        // User wants to take the knowledge test
        router.push("/test");
      } else {
        // User skipped the test - show initialization and then dashboard
        setShowCinematic(true);
        // Run staged initialization
        let stage = 0;
        const advanceStage = () => {
          if (stage < INIT_STAGES.length) {
            setInitStage(stage);
            stage++;
            setTimeout(advanceStage, INIT_STAGES[stage - 1]?.duration ?? 1500);
          } else {
            setSetupComplete(true);
            setTimeout(() => router.push("/platform"), 2500);
          }
        };
        advanceStage();
      }
      return;
    }

    // Build answer data
    const answerData = {
      question: currentQuestion.question,
      options_selected: selectedOptions,
      elaboration: elaboration
    };

    const newHistory = [
      ...history,
      { role: "model", parts: [{ text: JSON.stringify(currentQuestion) }] },
      { role: "user", parts: [{ text: JSON.stringify(answerData) }] }
    ];
    setHistory(newHistory);

    // ═══════════════════════════════════════════════════════════
    // BASELINE PHASE: Show all 7 baseline questions first
    // ═══════════════════════════════════════════════════════════
    if (currentQIndex < BASELINE_QUESTIONS.length - 1) {
      // Still more baseline questions to show
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      
      // Simulate thinking to feel natural
      simulateThinking(() => {
        transitionToQuestion(BASELINE_QUESTIONS[nextIdx]);
      });
    } else if (!isAgentPhase) {
      // ═══════════════════════════════════════════════════════════
      // TRANSITION TO AGENT PHASE: All 7 baselines are done
      // ═══════════════════════════════════════════════════════════
      setIsAgentPhase(true);
      setIsThinking(true);
      
      try {
        // Call backend to initialize agent session and get first dynamic question
        const res = await fetch("http://localhost:8000/api/agent/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            history: newHistory,
            current_answer: answerData
          })
        });

        if (!res.ok) {
          throw new Error(`Agent init failed: ${res.statusText}`);
        }

        const jsonRes = await res.json();
        const data = jsonRes.data;

        // Store session ID for future requests
        if (jsonRes.session_id) {
          setSessionId(jsonRes.session_id);
          console.log("✅ Agent session initialized:", jsonRes.session_id);
        }

        setIsThinking(false);

        // Check if profile is somehow already complete (unlikely on first call)
        if (data.profile_complete) {
          setIsFinalQuestion(true);
          transitionToQuestion(FINAL_TEST_QUESTION);
        } else {
          // Show the first agent-generated dynamic question
          transitionToQuestion({
            question: data.question,
            type: data.type,
            options: data.options || []
          }, true);
        }
      } catch (err) {
        console.error("❌ Agent initialization error:", err);
        setIsThinking(false);
        
        // Fallback: Skip agent and go straight to final test question
        setIsFinalQuestion(true);
        transitionToQuestion(FINAL_TEST_QUESTION);
      }
    } else {
      // ═══════════════════════════════════════════════════════════
      // AGENT PHASE: Get next dynamic question
      // ═══════════════════════════════════════════════════════════
      setIsThinking(true);

      try {
        if (!sessionId) {
          throw new Error("No session ID available");
        }

        const res = await fetch("http://localhost:8000/api/agent/next", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            current_answer: answerData
          })
        });

        if (!res.ok) {
          throw new Error(`Agent next failed: ${res.statusText}`);
        }

        const jsonRes = await res.json();
        const data = jsonRes.data;

        setIsThinking(false);

        // Check if agent has completed the profile
        if (data.profile_complete) {
          console.log("✅ Assessment profile complete!");
          // Transition to final test question
          setIsFinalQuestion(true);
          transitionToQuestion(FINAL_TEST_QUESTION);
        } else {
          // Show next agent-generated question
          transitionToQuestion({
            question: data.question,
            type: data.type,
            options: data.options || []
          }, true);
        }
      } catch (err) {
        console.error("❌ Agent next error:", err);
        setIsThinking(false);
        
        // Fallback: After a few agent questions, show final test question
        setIsFinalQuestion(true);
        transitionToQuestion(FINAL_TEST_QUESTION);
      }
    }
  };

  const canSubmit =
    isThinking
      ? false
      : currentQuestion.type === "text-only"
        ? elaboration.trim().length > 0
        : selectedOptions.length > 0 || elaboration.trim().length > 0;

  /* ═══════════════════════════════════════════════════════════
     WELCOME POPUP — shows once on first load
     ═══════════════════════════════════════════════════════════ */
  const welcomePopup = showWelcome && !started && (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] max-w-md w-[92%] p-8 relative animate-[slideUp_0.4s_cubic-bezier(0.2,0.8,0.2,1)]">
        <button
          onClick={() => setShowWelcome(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
        >
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

        <button
          onClick={() => { setShowWelcome(false); setStarted(true); }}
          className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-sm"
        >
          I Understand, Begin Assessment
        </button>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════
     CINEMATIC INITIALIZATION SCREEN (Interactive + Staged)
     ═══════════════════════════════════════════════════════════ */
  if (showCinematic) {
    const initProgress = setupComplete
      ? 100
      : Math.min(((initStage + 1) / INIT_STAGES.length) * 90, 90);

    return (
        <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn w-full px-4 py-8">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_24px_80px_rgba(0,0,0,0.07)] border border-outline-variant/20 max-w-5xl w-full relative overflow-hidden flex flex-col md:flex-row gap-8">
                
                {/* Left side: Setup Status */}
                <div className="flex-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-outline-variant/20 pb-8 md:pb-0 md:pr-8">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-primary/10 to-primary/5 flex items-center justify-center mb-6 relative">
                        {!setupComplete && (
                            <>
                                <div className="absolute inset-[-4px] border-[3px] border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <div className="absolute inset-[-12px] border-[2px] border-primary/10 border-b-primary rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                            </>
                        )}
                        {setupComplete ? (
                            <span className="material-symbols-outlined text-green-500 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        ) : (
                            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {INIT_STAGES[initStage]?.icon ?? "memory"}
                            </span>
                        )}
                    </div>
                    
                    <h2 className="font-display text-2xl font-black text-on-surface tracking-tight mb-2 text-center">
                        {setupComplete ? "Ecosystem Ready" : "Initializing Drona AI"}
                    </h2>
                    <p className="font-body text-on-surface-variant text-sm text-center mb-4 max-w-xs">
                        {setupComplete 
                            ? "Your personalized teaching agent has been fully initialized based on your psychological profile." 
                            : "Building your personalized learning ecosystem. You can configure your settings while you wait."}
                    </p>

                    {/* Staged progress */}
                    <div className="w-full max-w-xs mb-6">
                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-4">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${initProgress}%` }}
                        />
                      </div>
                      {/* Stage list */}
                      <div className="space-y-2">
                        {INIT_STAGES.map((stage, idx) => {
                          const isDone = setupComplete || idx < initStage;
                          const isCurrent = !setupComplete && idx === initStage;
                          return (
                            <div key={idx} className={`flex items-center gap-2.5 transition-all duration-300 ${isDone ? 'opacity-100' : isCurrent ? 'opacity-100' : 'opacity-30'}`}>
                              <span className={`material-symbols-outlined text-sm ${isDone ? 'text-green-500' : isCurrent ? 'text-primary animate-pulse' : 'text-outline-variant/40'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                {isDone ? 'check_circle' : isCurrent ? 'pending' : 'radio_button_unchecked'}
                              </span>
                              <span className={`text-xs font-medium ${isDone ? 'text-on-surface' : isCurrent ? 'text-primary' : 'text-on-surface-variant/40'}`}>
                                {stage.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button 
                        onClick={() => router.push("/platform")}
                        disabled={!setupComplete}
                        className={`w-full bg-[#0a0a0f] text-white font-semibold py-3.5 px-8 rounded-xl flex items-center justify-center gap-3 text-sm transition-all duration-300 ${setupComplete ? 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 cursor-pointer' : 'opacity-40 pointer-events-none'}`}
                    >
                        <span>Enter Dashboard</span>
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                </div>

                {/* Right side: Interactive Tabs */}
                <div className="flex-1 flex flex-col min-h-[300px]">
                    <div className="flex gap-2 mb-5 p-1 bg-surface-container-low rounded-lg w-fit mx-auto md:mx-0">
                        <button onClick={() => setActiveTab('byok')} className={`px-5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${activeTab === 'byok' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>BYOK</button>
                        <button onClick={() => setActiveTab('subscribe')} className={`px-5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${activeTab === 'subscribe' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>Premium</button>
                        <button onClick={() => setActiveTab('settings')} className={`px-5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>Settings</button>
                    </div>

                    <div className="flex-1 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5 animate-fadeIn">
                        {activeTab === 'byok' && (
                            <div className="h-full flex flex-col animate-fadeIn">
                                <h4 className="font-bold text-sm mb-1 text-on-surface">Bring Your Own Key</h4>
                                <p className="text-xs text-on-surface-variant mb-4">Connect your own OpenAI, Anthropic, or Gemini API keys to bypass usage limits.</p>
                                <div className="space-y-3 mt-auto">
                                    <select className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer appearance-none">
                                        <option value="gemini">Google Gemini</option>
                                        <option value="openai">OpenAI</option>
                                        <option value="anthropic">Anthropic</option>
                                    </select>
                                    <input type="password" placeholder="API Key (sk-...)" className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" />
                                    <button className="w-full bg-primary/10 text-primary font-semibold py-2.5 rounded-lg text-sm hover:bg-primary/20 transition-colors cursor-pointer">Save API Key</button>
                                </div>
                            </div>
                        )}
                        {activeTab === 'subscribe' && (
                            <div className="h-full flex flex-col animate-fadeIn">
                                <h4 className="font-bold text-sm mb-1 text-on-surface">Drona AI Premium</h4>
                                <p className="text-xs text-on-surface-variant mb-4">Unlock advanced reasoning models and unlimited agent memory.</p>
                                <div className="space-y-3 mt-auto max-h-[160px] overflow-y-auto pr-2 pb-2 scrollbar-thin">
                                    <div className="p-3.5 rounded-xl border border-outline-variant/20 hover:border-primary/50 flex justify-between items-center cursor-pointer transition-colors">
                                        <div>
                                            <div className="font-bold text-sm text-on-surface mb-0.5">Free Tier</div>
                                            <div className="text-xs text-on-surface-variant">Limited context</div>
                                        </div>
                                        <div className="w-5 h-5 rounded-full border-2 border-outline-variant/50"></div>
                                    </div>
                                    <div className="p-3.5 rounded-xl border-2 border-primary bg-primary/[0.04] flex justify-between items-center cursor-pointer">
                                        <div>
                                            <div className="font-bold text-sm text-primary mb-0.5">Pro Tier</div>
                                            <div className="text-xs text-on-surface-variant">$20/month</div>
                                        </div>
                                        <div className="w-5 h-5 rounded-full border-[5px] border-primary"></div>
                                    </div>
                                    <div className="p-3.5 rounded-xl border border-outline-variant/20 hover:border-primary/50 flex justify-between items-center cursor-pointer transition-colors">
                                        <div>
                                            <div className="font-bold text-sm text-on-surface mb-0.5">Ultra Tier</div>
                                            <div className="text-xs text-on-surface-variant">$50/month</div>
                                        </div>
                                        <div className="w-5 h-5 rounded-full border-2 border-outline-variant/50"></div>
                                    </div>
                                </div>
                                <button className="w-full bg-primary text-white font-semibold py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity shadow-md shadow-primary/20 cursor-pointer mt-3 shrink-0">Upgrade Now</button>
                            </div>
                        )}
                        {activeTab === 'settings' && (
                            <div className="h-full flex flex-col animate-fadeIn">
                                <h4 className="font-bold text-sm mb-1 text-on-surface">Agent Settings</h4>
                                <p className="text-xs text-on-surface-variant mb-6">Configure how your personalized agent communicates with you.</p>
                                <div className="space-y-4 mt-auto">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm font-medium text-on-surface">Strict Academic Tone</span>
                                        <input type="checkbox" className="w-4 h-4 accent-primary cursor-pointer" />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm font-medium text-on-surface">Socratic Method</span>
                                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary cursor-pointer" />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm font-medium text-on-surface">Visual Explanations (Diagrams)</span>
                                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary cursor-pointer" />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
  }


  /* ═══════════════════════════════════════════════════════════
     MAIN ASSESSMENT UI
     ═══════════════════════════════════════════════════════════ */
  
  // Progress calculation: proportional across entire assessment
  const answeredQuestions = isAgentPhase
    ? TOTAL_BASELINE + agentQuestionCount
    : currentQIndex + 1;
  const progressPct = isFinalQuestion
    ? 98
    : Math.min((answeredQuestions / TOTAL_EXPECTED) * 95, 95);

  // Status text for agent badge
  const getStatusText = () => {
    if (isThinking) return "Analyzing your response...";
    if (isFinalQuestion) return "Profiling complete";
    if (isAgentPhase) return `Profiling · Question ${agentQuestionCount} of ~${EXPECTED_AGENT_QUESTIONS}`;
    return `Baseline · ${currentQIndex + 1} of ${TOTAL_BASELINE}`;
  };

  return (
    <>
      {welcomePopup}

      <div className="flex-1 flex flex-col pt-20 pb-5 min-h-0 w-full max-w-2xl mx-auto">

        {/* Agent badge + subtle progress */}
        <div className="flex items-center gap-4 mb-3 shrink-0">
          <div className="brand-mark shrink-0 shadow-lg shadow-black/10">A</div>
          <div className="flex-1">
            <h3 className="font-display text-[13px] font-bold text-on-surface tracking-tight leading-none">Drona Assessment Agent</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isThinking ? 'bg-amber-500' : 'bg-green-500'} animate-pulse`}></span>
              <span className="text-[11px] text-on-surface-variant/60 font-medium">
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[3px] bg-white/30 rounded-full overflow-hidden mb-5 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* ─── Thinking State ─── */}
        {isThinking ? (
          <div className="flex-1 flex flex-col items-center justify-center animate-fadeIn">
            <div className="flex gap-2 mb-4">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
            <p className="text-sm text-on-surface-variant/60 font-medium">
              {isAgentPhase ? "Analyzing your profile and generating next question..." : "Preparing your next question..."}
            </p>
          </div>
        ) : (
          /* ─── Question Card ─── */
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
                      <button
                        key={`${agentQuestionCount}-${currentQIndex}-${idx}`}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 cursor-pointer ${isSelected
                            ? "border-primary/40 bg-primary/[0.04] shadow-sm"
                            : "border-transparent bg-white/40 hover:bg-white/60"
                          }`}
                        onClick={() => handleOptionToggle(opt)}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`material-symbols-outlined text-lg shrink-0 transition-all ${isSelected ? "text-primary" : "text-outline-variant/30"}`}>
                            {currentQuestion.type === "single-select"
                              ? (isSelected ? "radio_button_checked" : "radio_button_unchecked")
                              : (isSelected ? "check_box" : "check_box_outline_blank")
                            }
                          </span>
                          <span className={`text-sm leading-snug transition-colors ${isSelected ? "text-primary font-medium" : "text-on-surface/80"}`}>
                            {opt}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Auto-growing text input */}
              <AutoGrowTextarea
                value={elaboration}
                onChange={setElaboration}
                placeholder={currentQuestion.type === "text-only" ? "Share your thoughts here..." : "Add more detail (optional)..."}
                isTextOnly={currentQuestion.type === "text-only"}
              />

              {/* Submit — directly under content */}
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleNext}
                  disabled={!canSubmit}
                  className={`bg-primary text-white font-semibold py-2.5 px-7 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer ${!canSubmit ? "opacity-30 pointer-events-none" : ""}`}
                >
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
  value,
  onChange,
  placeholder,
  isTextOnly
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  isTextOnly: boolean;
}) {
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
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/30 border border-white/50 focus:border-primary/30 focus:ring-2 focus:ring-primary/8 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline/30 resize-none transition-[border,box-shadow] outline-none text-sm"
      placeholder={placeholder}
      style={{ minHeight: `${minH}px` }}
      rows={1}
    />
  );
}
