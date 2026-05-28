"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─── Constants ─── */
const GREETINGS = [
  "Welcome back! Ready to learn?",
  "Good Morning, Future Achiever!",
  "Good Afternoon, let's dive in.",
  "Good Evening, keep up the momentum.",
  "Hello! Let's conquer today's goals.",
  "Greetings! Time to level up.",
  "Welcome to your personal learning hub.",
  "Ready for another breakthrough?",
  "Let's make today productive!",
  "Your learning journey continues here.",
  "Step into the zone.",
  "Unleash your potential today.",
  "Every day is a chance to learn.",
  "Embrace the challenge.",
  "Your goals are within reach.",
  "Focus, execute, achieve.",
  "Welcome back to your peak state.",
  "Mastery is a journey. Let's walk it.",
  "Knowledge awaits.",
  "Ignite your curiosity.",
  "Sharpen your mind today.",
  "Rise and shine, learner!",
  "Stay hungry for knowledge.",
  "Consistency is key. Welcome back.",
  "Let's push the boundaries.",
  "Your daily dose of learning starts now.",
  "Precision beats intensity. Welcome back.",
  "Drona AI systems are online and ready.",
];

const QUOTES = [
  "Your cognitive baseline is established, but active learning data is required to generate tactical insights. I recommend initiating your first focused sprint to begin mapping your neural pathways and precision metrics.",
  "Optimal learning occurs at the edge of your comfort zone. Push slightly past your perceived limits today.",
  "Neural plasticity is highest during deep focus. Eliminate distractions for the next 25 minutes.",
  "I'm analyzing your learning patterns. Consistency over the next few days will unlock advanced personalization.",
  "Remember, spacing out your study sessions improves long-term retention. Take deliberate breaks.",
  "Error is a necessary step in the learning algorithm. Don't fear mistakes; analyze them.",
  "I've optimized your dashboard for maximum clarity. Clear space, clear mind.",
  "Retrieval practice is highly effective. Try testing yourself on what you learned yesterday.",
  "Your focus metrics can improve. Let's aim for a slightly longer uninterrupted session today.",
  "A 1% improvement every day leads to a 37x improvement over a year. Keep compounding.",
  "Sleep is critical for memory consolidation. Ensure you are well-rested for optimal performance.",
  "Interleaving different topics can boost your problem-solving skills. Mix it up today.",
  "Visualize your end goal. It helps align your daily actions with your long-term vision.",
  "Data shows that active recall beats passive reading. Engage with the material.",
  "I am standing by to process your next learning sprint. Let's begin when you are ready.",
  "Small, consistent actions forge strong neural pathways.",
  "The hardest part is starting. Commit to just 5 minutes right now.",
  "I detect potential for a flow state today. Minimize interruptions.",
  "Reviewing material just before sleep can enhance retention. Keep that in mind for tonight.",
  "You are building the architecture of your future mind. Build it well.",
  "Every piece of knowledge is a node in your conceptual network. Make new connections.",
  "Focus on the process, not just the outcome. The results will follow.",
  "Your cognitive load is optimal right now. It's a good time for complex problem solving.",
  "I'm calibrating your difficulty curve. Expect a slight challenge increase soon.",
  "Momentum is a powerful force. Keep the chain of daily learning unbroken.",
  "Embrace the struggle. It means your brain is adapting and growing.",
  "Let's translate today's effort into measurable progress.",
  "Precision beats intensity. Focus on deep understanding over superficial speed.",
  "Your analytical skills are sharp today. Apply them to a difficult concept.",
  "Drona AI systems are online and optimized for your cognitive enhancement."
];

const COLORS = [
  "linear-gradient(to right, #ff758c 0%, #ff7eb3 50%, #fc67fa 100%)",
  "linear-gradient(to right, #00c6ff 0%, #0072ff 100%)",
  "linear-gradient(to right, #12c2e9 0%, #c471ed 50%, #f64f59 100%)",
  "linear-gradient(to right, #8A2387 0%, #E94057 50%, #F27121 100%)",
  "linear-gradient(to right, #00F260 0%, #0575E6 100%)",
  "linear-gradient(to right, #f12711 0%, #f5af19 100%)",
  "linear-gradient(to right, #654ea3 0%, #eaafc8 100%)",
  "linear-gradient(to right, #ff00cc 0%, #333399 100%)",
  "linear-gradient(to right, #f953c6 0%, #b91d73 100%)",
  "linear-gradient(to right, #00b4db 0%, #0083b0 100%)",
  "linear-gradient(to right, #FF416C 0%, #FF4B2B 100%)",
  "linear-gradient(to right, #fdfc47 0%, #24fe41 100%)"
];

const METRICS = [
  { label: "Precision", description: "Measures accuracy of active recall and problem-solving execution." },
  { label: "Velocity", description: "Tracks processing speed versus standard cognitive thresholds." },
  { label: "Depth", description: "Evaluates ability to connect abstract ideas and multi-layered concepts." },
  { label: "Focus", description: "Analyses uninterrupted session length and distraction resistance." },
  { label: "Retention", description: "Calculates memory decay rate via spaced repetition intervals." },
  { label: "Adaptability", description: "Gauges capability to adjust to increasing difficulty and novel problem types." },
];

const DRONA_RESPONSES = [
  "Focus on spaced repetition for that topic. Revisit it in 24 hrs, then 72 hrs.",
  "I recommend three 25-min sprints with 5-min breaks.",
  "Mornings are your peak cognitive window. Schedule hard tasks then.",
  "Try the Feynman Technique — explain the concept in simple terms.",
  "Retention improves when you test yourself within an hour. Try it now.",
  "I'll log that for your analytics to build a personalised model.",
  "Quality over quantity. 45 focused minutes beats 3 distracted hours.",
  "Connecting new knowledge to existing models is the key to mastery.",
];

const QUICK_ACTIONS = [
  { label: "My Notes",   icon: "edit_note",       href: "/workspace",        color: "from-blue-500 to-indigo-600",     bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-200" },
  { label: "Test",       icon: "quiz",             href: "/test",             color: "from-emerald-500 to-teal-600",    bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  { label: "Quests",     icon: "military_tech",    href: "/game",             color: "from-violet-500 to-purple-600",   bg: "bg-violet-50", text: "text-violet-600",  border: "border-violet-200" },
  { label: "Planner",    icon: "calendar_month",   href: "/workspace/planner",color: "from-amber-500 to-orange-500",    bg: "bg-amber-50",  text: "text-amber-600",   border: "border-amber-200" },
  { label: "Analytics",  icon: "monitoring",       href: "/workspace/weekly", color: "from-rose-500 to-pink-600",       bg: "bg-rose-50",   text: "text-rose-600",    border: "border-rose-200" },
];

const WATERMARKS = [
  { 
    src: "/dragon.jpg", 
    label: "Dragon",
    containerClass: "top-[-60px] right-[-100px] w-[800px] h-[800px]", 
    maskImage: "radial-gradient(circle at 45% 45%, black 10%, rgba(0,0,0,0.3) 40%, transparent 60%)" 
  },
  { 
    src: "/lion.png", 
    label: "Lion",
    containerClass: "top-[-50px] right-[-50px] w-[650px] h-[650px]", 
    maskImage: "radial-gradient(circle at 45% 45%, black 20%, rgba(0,0,0,0.4) 55%, transparent 75%)" 
  },
  { 
    src: "/eagle.jpg", 
    label: "Eagle",
    containerClass: "top-[-90px] right-[-50px] w-[650px] h-[650px]", 
    maskImage: "radial-gradient(circle at 45% 45%, black 20%, rgba(0,0,0,0.4) 55%, transparent 75%)" 
  },
];

/* Helpers */
const getPoint = (value: number, index: number, radius: number, cx: number, cy: number) => {
  const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
  const r = radius * (value / 100);
  return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
};

const ANALYTICS_STATS = [
  { label: "Study Streak",   value: "—",   unit: "days",    icon: "local_fire_department", color: "text-orange-500", bg: "bg-orange-50" },
  { label: "Focus Time",     value: "—",   unit: "min today", icon: "timer",               color: "text-blue-500",   bg: "bg-blue-50" },
  { label: "Tests Completed",value: "—",   unit: "total",   icon: "task_alt",              color: "text-emerald-500",bg: "bg-emerald-50" },
  { label: "XP Earned",      value: "—",   unit: "points",  icon: "stars",                 color: "text-violet-500", bg: "bg-violet-50" },
];

export default function PlatformDashboard() {
  const [mounted, setMounted]         = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [quoteIndex, setQuoteIndex]   = useState(0);
  const [colorIndex, setColorIndex]   = useState(0);
  const [watermarkIdx, setWatermarkIdx] = useState(0);
  const [watermarkFade, setWatermarkFade] = useState(true);

  /* Chat state */
  const [chatOpen, setChatOpen]       = useState(false);
  const [chatInput, setChatInput]     = useState("");
  const [isThinking, setIsThinking]   = useState(false);
  const [fullResponse, setFullResponse] = useState("");
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [blueprintSort, setBlueprintSort] = useState("Day");
  const [dynamicQuote, setDynamicQuote] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const metricValues = [0, 0, 0, 0, 0, 0];

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    setGreetingIndex(Math.floor(Math.random() * GREETINGS.length));
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
    setColorIndex(Math.floor(Math.random() * COLORS.length));
    setWatermarkIdx(Math.floor(Math.random() * WATERMARKS.length));

    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    const contentInterval = setInterval(() => {
      setGreetingIndex(Math.floor(Math.random() * GREETINGS.length));
      setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
      setColorIndex(Math.floor(Math.random() * COLORS.length));
    }, 60 * 60 * 1000);

    const wmInterval = setInterval(() => {
      setWatermarkFade(false);
      setTimeout(() => {
        setWatermarkIdx(prev => (prev + 1) % WATERMARKS.length);
        setWatermarkFade(true);
      }, 800);
    }, 4 * 60 * 60 * 1000);

    // Fetch dynamic quote from API
    fetch("http://localhost:8000/api/quote")
      .then(res => res.json())
      .then(data => {
        if (data.quote) setDynamicQuote(data.quote);
      })
      .catch(console.error);

    return () => {
      clearInterval(timeInterval);
      clearInterval(contentInterval);
      clearInterval(wmInterval);
    };
  }, []);

  /* Typewriter effect */
  useEffect(() => {
    if (!fullResponse) return;
    let i = 0;
    setDisplayedResponse("");
    const timer = setInterval(() => {
      setDisplayedResponse(prev => prev + fullResponse.substring(i, i + 3));
      i += 3;
      if (i >= fullResponse.length) clearInterval(timer);
    }, 10);
    return () => clearInterval(timer);
  }, [fullResponse]);

  /* Focus input when chat opens */
  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [chatOpen]);

  const sendMessage = async () => {
    const text = chatInput.trim();
    if (!text || isThinking) return;
    setChatInput("");
    setIsThinking(true);
    setFullResponse("");
    setDisplayedResponse("");
    
    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "quick_chat_platform",
          message: text + "\n\n(IMPORTANT: Keep your response extremely brief and concise, ideally 1-2 sentences maximum, as this is a small quick-chat widget.)"
        })
      });
      const data = await res.json();
      setFullResponse(data.response || "I am currently unable to connect to my systems.");
    } catch (err) {
      console.error(err);
      setFullResponse("Error connecting to Drona AI systems.");
    } finally {
      setIsThinking(false);
    }
  };

  if (!mounted || !currentTime) return null;

  const dateString = currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const timeString = currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const currentColor = COLORS[colorIndex];
  const wm = WATERMARKS[watermarkIdx];

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-8 animate-fadeIn transition-all duration-300 relative">

      {/* ─── U-Shape Faded Watermark ─── */}
      <div
        className={`absolute overflow-hidden pointer-events-none z-0 select-none transition-all duration-1000 ${wm.containerClass}`}
        style={{ 
          opacity: watermarkFade ? 1 : 0,
          maskImage: wm.maskImage,
          WebkitMaskImage: wm.maskImage
        }}
      >
        <Image
          src={wm.src}
          alt={wm.label}
          fill
          className="object-contain opacity-[0.22]"
          style={{ filter: "grayscale(15%) contrast(0.95) brightness(1.1)" }}
          priority
        />
      </div>

      {/* ─── Header Section ─── */}
      <div className="mb-12 relative z-10 animate-slideUp" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
        <h1
          className="font-display font-black text-3xl md:text-4xl lg:text-5xl tracking-tight pb-2 mb-0 transition-all duration-1000"
          style={{
            backgroundImage: currentColor,
            backgroundSize: "200% auto",
            animation: "textGradient 4s linear infinite",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {GREETINGS[greetingIndex]}
        </h1>

        {/* ─── Meta row: isolated layout to prevent shifting ─── */}
        <div className="relative h-10 w-full flex items-center mb-3">
          {/* Left side texts */}
          <div className="flex flex-wrap items-center gap-3 text-on-surface-variant text-sm md:text-base absolute left-0 w-full pr-[360px]">
            <span className="font-medium">{dateString}</span>
            <span className="text-outline/40">•</span>
            <span className="font-medium tabular-nums">{timeString}</span>
            <span className="text-outline/40">•</span>
            <span className="font-medium">Peak Cognitive Window</span>
          </div>

          {/* ─── Drona AI Quick Chat (Absolute Right) ─── */}
          {/* Shifted down significantly to completely avoid the top navigation header */}
          <div className="absolute right-[40px] md:right-[80px] top-[75px] flex items-center justify-end z-[60]">
            
            {/* Output Window (Expands Above, perfectly aligned over typing box) */}
            <div className={`absolute bottom-full mb-3 bg-white border border-outline-variant/30 rounded-[1.25rem] p-4 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              displayedResponse.length > 100 ? 'w-[420px] -right-[32px] origin-bottom-left' : 'w-[320px] right-[68px] origin-bottom'
            } ${
              chatOpen && displayedResponse && !isThinking
                ? "opacity-100 translate-y-0 scale-100" 
                : "opacity-0 translate-y-6 scale-90 pointer-events-none"
            }`}>
              <p className="text-sm text-on-surface leading-relaxed font-medium">
                {displayedResponse}
                {displayedResponse && <span className="inline-block w-1.5 h-3.5 ml-1 bg-primary animate-pulse align-middle" />}
              </p>
            </div>

            {/* Expanding Typing Box (Expands to Left) */}
            <div 
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center ${
                chatOpen ? "w-[320px] opacity-100 mr-3 translate-x-0" : "w-0 opacity-0 mr-0 translate-x-8"
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
                placeholder="Ask Drona..."
                className="w-full text-sm bg-white border border-outline-variant/40 rounded-full px-5 py-3 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all shadow-md"
                disabled={isThinking}
              />
            </div>

            {/* The Icon Button (Bigger: w-14 h-14) */}
            <button
              onClick={() => {
                if (isThinking) return;
                if (chatOpen) {
                  setChatOpen(false);
                  setTimeout(() => {
                    setChatInput("");
                    setFullResponse("");
                    setDisplayedResponse("");
                  }, 400); 
                } else {
                  setChatOpen(true);
                  setChatInput("");
                  setFullResponse("");
                  setDisplayedResponse("");
                }
              }}
              className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:scale-105 relative overflow-hidden group border-0 p-[3px]`}
              title="Quick Chat with Drona AI"
            >
              {/* Full RGB LED Spinning Ring */}
              <div 
                className="absolute inset-[-50%] w-[200%] h-[200%] animate-spin pointer-events-none opacity-90"
                style={{ 
                  background: 'conic-gradient(#ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
                  animationDuration: '4s',
                  animationDirection: chatOpen ? 'reverse' : 'normal'
                }}
              />
              
              {/* Inner Button Content */}
              <div className="relative w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden z-10">
                {isThinking ? (
                  <div className="flex items-center justify-center gap-1 relative z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                ) : (
                  <>
                    <span className={`material-symbols-outlined transition-all duration-500 absolute z-20 ${chatOpen ? "scale-100 opacity-100 text-3xl text-white" : "scale-50 opacity-0 text-white"}`}>
                      close
                    </span>
                    
                    {/* The Brain Image (Zoomed out) */}
                    <div className={`absolute inset-0 w-full h-full p-[5px] transition-all duration-500 flex items-center justify-center ${chatOpen ? "scale-50 opacity-0" : "scale-100 opacity-100"}`}>
                      <img src="/brain-icon.jpg" alt="Drona AI Brain" className="w-full h-full object-contain rounded-full" />
                    </div>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="inline-block p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm transition-all duration-1000 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-50" />
          <div className="relative z-10 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl mt-0.5">lightbulb</span>
            <p className="text-on-surface text-sm md:text-base font-medium italic leading-relaxed">
              "{dynamicQuote || QUOTES[quoteIndex]}"
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">

        {/* ─── Left Column (8-col) containing the Two Cards ─── */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          
          {/* ORIGINAL Daily Tactical Analysis */}
          <div className="bg-white/90 backdrop-blur-xl border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 shadow-sm relative overflow-hidden border-t-4 border-t-primary group animate-slideUp" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <span className="material-symbols-outlined text-primary text-3xl">insights</span>
              <h3 className="font-display text-xl md:text-2xl font-bold text-on-surface">Daily Tactical Analysis</h3>
            </div>

            <p className="text-on-surface-variant text-base leading-relaxed mb-8 relative z-10 font-medium max-w-3xl pr-4">
              "Your cognitive baseline is established, but active learning data is required to generate tactical insights. I recommend initiating your first focused sprint to begin mapping your neural pathways and precision metrics."
            </p>

            <div className="flex flex-wrap gap-4 relative z-10">
              <button className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 transition-all cursor-pointer relative overflow-hidden group/btn">
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                Start First Sprint
              </button>
              <button className="bg-white border-2 border-outline-variant/20 text-on-surface px-8 py-3.5 rounded-xl font-bold text-sm hover:-translate-y-1 hover:shadow-md hover:border-primary/40 transition-all cursor-pointer">
                View Full Analysis
              </button>
            </div>
          </div>

          {/* NEW Performance Overview Card (using the stats) */}
          <div className="bg-white/90 backdrop-blur-xl border border-outline-variant/30 rounded-[2rem] p-8 shadow-sm relative overflow-hidden animate-slideUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <div className="flex justify-between items-end mb-6 relative z-10">
              <div>
                <h3 className="font-display text-xl font-bold text-on-surface">Performance Overview</h3>
                <p className="text-on-surface-variant text-sm font-medium mt-1">Key metrics for today's session</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              {ANALYTICS_STATS.map((s, i) => (
                <div key={i} className={`${s.bg} rounded-xl p-4 flex flex-col gap-2 border border-outline-variant/10 shadow-sm`}>
                  <div className="flex items-center justify-between">
                    <span className={`material-symbols-outlined ${s.color} text-[22px]`}>{s.icon}</span>
                    <p className={`text-2xl font-black ${s.color} leading-none`}>{s.value}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-bold text-on-surface leading-tight">{s.label}</p>
                    <p className="text-[10px] text-on-surface-variant/70 font-medium uppercase tracking-wider">{s.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ─── Learning Progress Radar (4-col) ─── */}
        <div className="xl:col-span-4 bg-white border border-outline-variant/30 rounded-[2rem] p-6 md:p-8 shadow-sm animate-slideUp relative flex flex-col" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <div>
            <div className="flex items-center gap-2 mb-1 relative z-50">
              <h3 className="font-display text-xl font-bold text-on-surface">Learning Progress</h3>
              
              <div className="relative group cursor-help flex items-center">
                <span className="material-symbols-outlined text-outline-variant/70 text-[20px] hover:text-primary transition-colors">help</span>
                
                {/* Tooltip Content */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[350px] bg-white border border-outline-variant/30 rounded-xl p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] scale-95 group-hover:scale-100 origin-top">
                  <p className="text-xs font-bold text-on-surface mb-2">The Memory-Mesh: Cognitive Telemetry</p>
                  <div className="space-y-3 text-[11px] text-on-surface-variant leading-relaxed">
                    <p><span className="font-bold text-primary">Retention:</span> Powered by the Memory-Mesh Vector DB, tracking spaced repetition decay and recall rates across all Multi-Agent interactions.</p>
                    <p><span className="font-bold text-primary">Synthesis:</span> Evaluated by the Head Agent via Concept-Dependency Mapping, measuring your ability to link interdisciplinary nodes in real-time.</p>
                    <p><span className="font-bold text-primary">Speed:</span> Cognitive velocity tracked via internal interaction timers and Shadow-Simulation dwell-time analysis.</p>
                    <p><span className="font-bold text-primary">Accuracy:</span> Precision metrics derived from the Socratic Loop Agent and strict-mode evaluations without hints.</p>
                    <p><span className="font-bold text-primary">Endurance:</span> Focus span quantified by the Assessment Agent during Deep Work sessions and Boss Battle arenas.</p>
                    <p><span className="font-bold text-primary">Adaptability:</span> Real-time response to the AI's autonomous difficulty scaling, surprise tests, and mood-based teaching shifts.</p>
                  </div>
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-outline-variant/30 rotate-45"></div>
                </div>
              </div>
            </div>
            <p className="text-on-surface-variant text-xs font-medium mb-6 relative z-10">Complete a sprint to see your progress.</p>
          </div>

          {/* New Insight Pill to fill empty space naturally */}
          <div className="relative z-10 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 mb-4 flex items-start gap-3 shadow-sm group hover:border-primary/30 transition-colors">
            <span className="material-symbols-outlined text-amber-500 text-[22px] mt-0.5 group-hover:scale-110 transition-transform">lightbulb</span>
            <div>
              <p className="text-xs font-bold text-on-surface mb-1">Drona Insight</p>
              <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed">
                Consistency is building your cognitive baseline. Your current profile suggests starting with shorter, frequent focus sessions.
              </p>
            </div>
          </div>

          <div className="relative w-full max-w-[245px] h-[245px] mx-auto flex items-center justify-center mt-auto mb-4 flex-1">
            <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
              {[0.33, 0.66, 1].map((level, i) => (
                <polygon
                  key={i}
                  points={METRICS.map((_, idx) => getPoint(120 * level, idx, 120, 150, 150)).join(" ")}
                  fill="none"
                  stroke="currentColor"
                  className="text-outline-variant/20"
                  strokeWidth="1"
                  strokeDasharray={i < 2 ? "3 3" : undefined}
                />
              ))}
              {METRICS.map((_, i) => {
                const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                return (
                  <line
                    key={i}
                    x1={150} y1={150}
                    x2={150 + 120 * Math.cos(angle)}
                    y2={150 + 120 * Math.sin(angle)}
                    stroke="currentColor"
                    className="text-outline-variant/20"
                    strokeWidth="1"
                  />
                );
              })}
              <polygon
                points={metricValues.map((val, i) => getPoint(val, i, 120, 150, 150)).join(" ")}
                fill="rgba(42, 92, 255, 0.15)"
                stroke="#2563eb"
                strokeWidth="2.5"
                className="transition-all duration-[2000ms] ease-out drop-shadow-[0_0_12px_rgba(42,92,255,0.4)]"
              />
              <polygon
                points={metricValues.map((val, i) => getPoint(val, i, 120, 150, 150)).join(" ")}
                fill="none"
                stroke="#60a5fa"
                strokeWidth="1"
                className="transition-all duration-[2000ms] ease-out opacity-50"
              />
              <circle cx={150} cy={150} r={4} className="fill-primary stroke-white stroke-2 shadow-sm" />
              {METRICS.map((metric, i) => {
                const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                let textAnchor: "inherit" | "middle" | "start" | "end" = "middle";
                if (cos > 0.1) textAnchor = "start";
                else if (cos < -0.1) textAnchor = "end";
                const labelRadiusX = 135 + (textAnchor !== "middle" ? 15 : 0);
                const labelRadiusY = i === 0 || i === 3 ? 148 : 135;
                return (
                  <text
                    key={i}
                    x={150 + labelRadiusX * cos}
                    y={150 + labelRadiusY * sin}
                    textAnchor={textAnchor}
                    alignmentBaseline="middle"
                    className="text-[13px] font-bold fill-on-surface hover:fill-primary transition-colors"
                  >
                    {metric.label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* ─── Blueprint (12-col) ─── */}
        <div className="xl:col-span-12 bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 shadow-sm animate-slideUp" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 relative z-50">
                <h3 className="font-display text-xl md:text-2xl font-bold text-on-surface">Blueprint</h3>
                
                <div className="relative group cursor-help flex items-center">
                  <span className="material-symbols-outlined text-outline-variant/70 text-[22px] hover:text-primary transition-colors">help</span>
                  
                  {/* Tooltip Content */}
                  <div className="absolute top-full left-0 mt-2 w-[400px] bg-white border border-outline-variant/30 rounded-xl p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] scale-95 group-hover:scale-100 origin-top-left">
                    <p className="text-xs font-bold text-on-surface mb-2">Autonomous Syllabus Architect</p>
                    <div className="space-y-3 text-[11px] text-on-surface-variant leading-relaxed">
                      <p>The Multi-Agent system dynamically constructs your Learning Environment via the Head Agent, auto-adjusting to your cognitive telemetry and exam dates.</p>
                      <p><span className="font-bold text-primary">Day:</span> Immediate micro-tasks and quest logs dispatched by the Quest Agent for today's focused sprints.</p>
                      <p><span className="font-bold text-primary">Week:</span> 7-day tactical arc. Auto-adjusted by the Head Agent (e.g., injecting "Endurance Sessions" if stamina tests fail).</p>
                      <p><span className="font-bold text-primary">Month:</span> Major module benchmarks and Shadow-Simulation mock exam targets mapped against NTA difficulty curves.</p>
                      <p><span className="font-bold text-primary">Year:</span> The overarching Master Curriculum connecting all nodes in your personal Knowledge Graph to ultimate mastery.</p>
                    </div>
                    <div className="absolute -top-1.5 left-3 w-3 h-3 bg-white border-t border-l border-outline-variant/30 rotate-45"></div>
                  </div>
                </div>
              </div>
              
              {/* 4 Sorts */}
              <div className="flex items-center p-1 bg-outline-variant/10 rounded-lg">
                {["Day", "Week", "Month", "Year"].map(sort => (
                  <button
                    key={sort}
                    onClick={() => setBlueprintSort(sort)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${blueprintSort === sort ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface hover:bg-outline-variant/10"}`}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/learn/planner" className="flex items-center gap-1.5 text-primary font-bold text-sm hover:underline">
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                View Plan
              </Link>
              <button className="flex items-center gap-1.5 text-primary font-bold text-sm hover:underline">
                <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
                Edit Plan
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center opacity-50 border-2 border-dashed border-outline-variant/40 rounded-2xl">
            <span className="material-symbols-outlined text-5xl mb-4">pending_actions</span>
            <h4 className="font-bold text-lg text-on-surface mb-2">No Active Sessions</h4>
            <p className="text-sm font-medium text-on-surface-variant max-w-sm">
              Complete your first diagnostic test to unlock AI-generated study sessions and blueprints.
            </p>
          </div>
        </div>

        {/* ─── Quick Access Icons (5, evenly spaced left-to-right) ─── */}
        <div className="xl:col-span-12 animate-slideUp" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary text-lg">apps</span>
            <h3 className="font-display text-lg font-bold text-on-surface">Quick Access</h3>
          </div>

          <div className="flex justify-between items-center px-2 md:px-8 lg:px-16 xl:px-24">
            {QUICK_ACTIONS.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="group flex flex-col items-center gap-2.5 transition-transform hover:-translate-y-1.5 duration-200"
              >
                <div
                  className={`relative w-16 h-16 rounded-full ${item.bg} border ${item.border} flex items-center justify-center shadow-sm group-hover:shadow-md overflow-hidden transition-all duration-300`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full`}
                  />
                  <span className={`material-symbols-outlined text-2xl relative z-10 ${item.text} group-hover:text-white transition-colors duration-300`}>
                    {item.icon}
                  </span>
                </div>
                <span className={`text-xs font-bold text-on-surface-variant group-hover:${item.text} transition-colors text-center leading-tight`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>



      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation-name: slideUp;
          animation-duration: 0.6s;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes textGradient {
          0%   { background-position: 0% center; }
          50%  { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .transition-all.duration-400 {
          transition-duration: 400ms;
        }
      `}</style>
    </main>
  );
}
