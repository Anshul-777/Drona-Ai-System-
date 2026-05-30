"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import katex from "katex";
import "katex/dist/katex.min.css";
import mermaid from "mermaid";

// Initialize mermaid for chemical reaction / physical diagrams
if (typeof window !== "undefined") {
  mermaid.initialize({
    startOnLoad: true,
    theme: "neutral",
    securityLevel: "loose",
    suppressErrorRendering: true,
    fontFamily: "var(--font-sans)",
    themeCSS: ".node rect { fill: #ffffff; stroke: #c9a84c; stroke-width: 2px; } .edgePath .path { stroke: #c9a84c; stroke-width: 1.5px; }"
  });
}

// TypeScript Interfaces for structural stability
interface Boss {
  id: string;
  title: string;
  subject: "Physics" | "Chemistry" | "Math";
  difficulty: "Hard" | "Insane";
  reward: number;
  maxHp: number;
  avatarIcon: string;
  color: string;
  description: string;
}

interface Question {
  text: string;
  options: string[];
  correctIndex: number;
  diagram?: string;
  explanation?: string;
}

interface FloatingText {
  id: string;
  text: string;
  type: "damage" | "hit" | "info";
  target: "boss" | "player";
}

interface PlayerAnswer {
  questionText: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number | null;
  isCorrect: boolean;
  diagram?: string;
  explanation?: string;
}

// Direct KaTeX Formula Renderer Component for robust unescaped symbol display
function MathText({ text, className }: { text: string; className?: string }) {
  if (!text) return null;

  // Split on math block separators ($$ or $)
  const parts = text.split(/(\$\$|\$)/g);
  let isBlock = false;
  let isInline = false;
  
  const elements = parts.map((part, index) => {
    if (part === "$$") {
      isBlock = !isBlock;
      return null;
    }
    if (part === "$") {
      isInline = !isInline;
      return null;
    }
    
    if (isBlock || isInline) {
      try {
        const html = katex.renderToString(part, {
          throwOnError: false,
          displayMode: isBlock
        });
        return (
          <span 
            key={index} 
            className={isBlock ? "block my-3 overflow-x-auto text-center font-bold" : "inline-block px-0.5 font-semibold"} 
            dangerouslySetInnerHTML={{ __html: html }} 
          />
        );
      } catch (err) {
        return <code key={index} className="font-mono bg-neutral-100 px-1 rounded">{part}</code>;
      }
    }
    
    return <span key={index}>{part}</span>;
  });
  
  return <span className={className}>{elements.filter(Boolean)}</span>;
}

// Mermaid diagram visualizer
function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  
  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      try {
        // Clean double backslashes in chart
        const cleanChart = chart.replace(/\\/g, "\\");
        const elementId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        
        // Pre-parse to catch errors before render
        try {
          await mermaid.parse(cleanChart);
        } catch (parseErr) {
          throw new Error("Invalid Mermaid syntax");
        }

        const { svg: renderedSvg } = await mermaid.render(elementId, cleanChart);
        
        if (isMounted) {
          setSvg(renderedSvg);
          setError(false);
        }
      } catch (err) {
        console.error("Failed to render Mermaid diagram:", err);
        
        // Forcefully remove any error SVGs Mermaid injects into the body
        if (typeof document !== "undefined") {
          document.querySelectorAll('svg').forEach(el => {
            if (el.innerHTML.includes('Syntax error in text') || (el.id && el.id.startsWith('dmermaid-'))) {
              el.remove();
            }
          });
        }

        if (isMounted) {
          setError(true);
        }
      }
    };
    
    renderChart();
    return () => {
      isMounted = false;
    };
  }, [chart]);
  
  if (error) return null;
  
  if (!svg) {
    return (
      <div className="w-full flex justify-center py-6 bg-neutral-50/50 border border-dashed border-neutral-200 rounded-2xl my-4 text-xs font-mono text-neutral-400">
        Assembling conceptual schematic...
      </div>
    );
  }
  
  return (
    <div 
      className="w-full flex justify-center py-4 px-4 bg-neutral-50/30 border border-neutral-200/50 rounded-2xl my-4 overflow-x-auto select-none"
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}

export default function BossBattlesPage() {
  const [mounted, setMounted] = useState(false);
  const [gameState, setGameState] = useState<"lobby" | "booting" | "battle" | "victory" | "defeat">("lobby");
  
  // Database synchronization state
  const [userId, setUserId] = useState<string | null>(null);
  const [userXp, setUserXp] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [userIgn, setUserIgn] = useState<string>("Scholar");
  
  // Dynamic Syllabus Target settings selectors
  const [examTarget, setExamTarget] = useState<string>("JEE");
  const [classLevel, setClassLevel] = useState<string>("Class 11");
  const [board, setBoard] = useState<string>("CBSE");
  const [questionCount, setQuestionCount] = useState<number>(10);
  
  const [defeatedCount, setDefeatedCount] = useState<number>(0);
  const [dbLoading, setDbLoading] = useState<boolean>(true);

  // Active Battle States
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [bossHp, setBossHp] = useState<number>(100);
  const [playerHp, setPlayerHp] = useState<number>(100);
  
  // Tactical Turn action selectors
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [combatLogs, setCombatLogs] = useState<string[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [questionsSource, setQuestionsSource] = useState<string>("local");
  const [battleHistory, setBattleHistory] = useState<PlayerAnswer[]>([]);
  
  // RPG Combat Visual Effects
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [shakePlayer, setShakePlayer] = useState<boolean>(false);
  const [shakeBoss, setShakeBoss] = useState<boolean>(false);
  const [flashDamage, setFlashDamage] = useState<boolean>(false);
  const [flashHit, setFlashHit] = useState<boolean>(false);
  const [activeTurn, setActiveTurn] = useState<"player" | "boss">("player");

  const themeHex = "#c9a84c"; // Gold Theme

  // Boss definitions
  const basicBosses: Boss[] = [
    {
      id: "newtons-ghost",
      title: "Newton's Ghost",
      subject: "Physics",
      difficulty: "Hard",
      reward: 150,
      maxHp: 100,
      avatarIcon: "skull",
      color: "#2a5cff", // Blue
      description: "Apparition of classical mechanics. Master rotational force vectors and orbital motion ratios to banish him."
    },
    {
      id: "organic-overlord",
      title: "Organic Overlord",
      subject: "Chemistry",
      difficulty: "Insane",
      reward: 250,
      maxHp: 120,
      avatarIcon: "psychology",
      color: "#00c896", // Green
      description: "Ruler of carbon compounds. Demands deep knowledge of resonance stability order and isomer structural shifts."
    },
    {
      id: "integration-beast",
      title: "Integration Beast",
      subject: "Math",
      difficulty: "Hard",
      reward: 180,
      maxHp: 100,
      avatarIcon: "monitoring",
      color: "#e8362a", // Red
      description: "Protector of continuous functions. Bounded areas and orthogonal determinants are your only weapons."
    }
  ];

  // Fetch actual profile data and count defeated bosses from Supabase
  const loadProfileAndHistory = async () => {
    try {
      setDbLoading(true);
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
        const metadataIgn = session.user.user_metadata?.ign;
        
        // 1. Get profile stats
        const { data: profile } = await supabase
          .from("profiles")
          .select("xp_total, level, exam_target, class_level, board, full_name, email")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setUserXp(profile.xp_total || 0);
          setUserLevel(profile.level || 1);
          if (profile.exam_target) setExamTarget(profile.exam_target);
          if (profile.board) setBoard(profile.board);
          
          if (profile.class_level) {
            const mappedClass = profile.class_level === 10 ? "Class 10" :
                                profile.class_level === 11 ? "Class 11" :
                                profile.class_level === 12 ? "Class 12" :
                                profile.class_level === 13 ? "Dropper" : "Class 11";
            setClassLevel(mappedClass);
          }
          
          setUserIgn(metadataIgn ? metadataIgn.toUpperCase() : (profile.full_name || profile.email.split("@")[0].toUpperCase()));
        }

        // 2. Count actual boss battles defeated
        const { data: ledgerRows } = await supabase
          .from("xp_ledger")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("transaction_type", "boss_battle");

        if (ledgerRows) {
          setDefeatedCount(ledgerRows.length);
        }
      }
    } catch (err) {
      console.error("Error reading database profile for boss arena:", err);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadProfileAndHistory();
  }, []);

  // Timer Effect during Active Battle
  useEffect(() => {
    if (gameState !== "battle" || isAnswered) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameState, isAnswered]);

  const currentQuestion = activeQuestions[currentQuestionIndex];

  // Helper to push floating combat text numbers
  const addFloatingText = (text: string, type: "damage" | "hit" | "info", target: "boss" | "player") => {
    const id = Math.random().toString(36).substring(2, 9);
    setFloatingTexts((prev) => [...prev, { id, text, type, target }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
    }, 1500);
  };

  // Challenge button action
  const challengeBoss = (boss: Boss) => {
    setSelectedBoss(boss);
    setBossHp(boss.maxHp);
    setPlayerHp(100);
    setCurrentQuestionIndex(0);
    setCombatLogs([]);
    setBattleHistory([]);
    setGameState("booting");
    setBootLogs([]);
    setActiveTurn("player");
    setSelectedCandidate(null);
    setSelectedAnswer(null);
    setIsAnswered(false);

    // Dynamic loader logging pipeline
    const addLog = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setBootLogs((prev) => [...prev, msg]);
          resolve();
        }, delay);
      });
    };

    (async () => {
      await addLog("Synthesizing learning environment matrices...", 150);
      await addLog(`Establishing target: ${boss.title} (${boss.subject})`, 150);
      await addLog(`Locking syllabus parameters: ${classLevel} (${board} Board) - ${examTarget}`, 150);
      await addLog(`Querying Drona AI Assessment Engine for dynamic questions...`, 200);
      
      let fetchedList: Question[] = [];
      let source = "static_fallback";
      
      try {
        const response = await fetch("http://localhost:8000/api/boss/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            boss_id: boss.id,
            subject: boss.subject,
            exam_target: examTarget,
            class_level: classLevel,
            board: board,
            question_count: questionCount
          })
        });
        const resData = await response.json();
        if (resData.success && resData.questions && resData.questions.length > 0) {
          fetchedList = resData.questions;
          source = resData.source || "gemini";
        }
      } catch (e) {
        console.warn("Could not connect to Gemini API. Initializing local syllabus questions instead.");
      }

      if (fetchedList.length === 0) {
        // Safe backend database fetch failed fallback
        fetchedList = [];
        source = "local_database";
      }

      // If still empty, query local client fallbacks
      if (fetchedList.length === 0) {
        // Mock fallback questions from client database
        const localList = selectedBoss ? basicBosses.find(b => b.id === boss.id) : null;
        // In this workspace, get_static_fallback_boss_questions inside backend app/api/drona.py handles it
        // We can just hit a local mock or query standard questions
        fetchedList = [];
      }

      // Let's call the backend again or fetch offline questions manually
      if (fetchedList.length === 0) {
        try {
          const fallbackRes = await fetch("http://localhost:8000/api/boss/questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              boss_id: boss.id,
              subject: boss.subject,
              exam_target: examTarget,
              question_count: questionCount
            })
          });
          const fallbackData = await fallbackRes.json();
          if (fallbackData.questions) {
            fetchedList = fallbackData.questions;
          }
        } catch {
          // absolute emergency fallback
          fetchedList = [];
        }
      }

      // If all fails, mock 5 quick items from local memory database
      if (fetchedList.length === 0) {
        const mockDb: Record<string, Question[]> = {
          "newtons-ghost": [
            {
              text: "A block of mass $m$ is placed on a smooth wedge of mass $M$ and inclination $\\theta$. What horizontal force $F$ keeps the block stationary?",
              options: ["$M g \\tan \\theta$", "$(M+m) g \\tan \\theta$", "$m g \\tan \\theta$", "$(M+m) g \\cot \\theta$"],
              correctIndex: 1,
              explanation: "Pseudo force balances gravity component: $ma \\cos \\theta = mg \\sin \\theta \\implies a = g \\tan \\theta \\implies F = (M+m)g\\tan\\theta$."
            }
          ],
          "organic-overlord": [
            {
              text: "Which compound exhibits geometrical isomerism?",
              options: ["1-Butene", "2-Butene", "2-Methylpropene", "Propene"],
              correctIndex: 1,
              explanation: "2-Butene has restricted double bond rotation and each carbon holds different groups (H and CH3)."
            }
          ],
          "integration-beast": [
            {
              text: "Evaluate definite integral $\\int_1^e \\ln(x) dx$.",
              options: ["e", "1", "e-1", "0"],
              correctIndex: 1,
              explanation: "Integral of ln(x) is $x\\ln(x) - x$. Evaluated from 1 to e yields $[e - e] - [0 - 1] = 1$."
            }
          ]
        };
        fetchedList = mockDb[boss.id] || [];
      }

      // Slice to match requested count
      fetchedList = fetchedList.slice(0, questionCount);

      setActiveQuestions(fetchedList);
      setQuestionsSource(source);

      const sourceLabel = source.includes("gemini") ? `Google Gemini API (${fetchedList.length} dynamic questions)` : `Drona Local Database (${fetchedList.length} syllabus questions)`;
      await addLog(`Syllabus scope initialized: ${examTarget}`, 150);
      await addLog(`Connection established via: ${sourceLabel}`, 200);
      await addLog(`Locking parameters (Player HP: 100, Boss HP: ${boss.maxHp})`, 150);
      await addLog("Arena stabilized. Initiating combat terminal...", 200);

      setTimeout(() => {
        setGameState("battle");
        setTimeLeft(30);
        setIsAnswered(false);
        setSelectedAnswer(null);
        setSelectedCandidate(null);
        setCombatLogs([
          `[00:00] Battle initialized! challenged ${boss.title}. Active turns: Defend/Attack. Syllabus: ${classLevel} (${examTarget}).`,
          `[00:00] Questions provided by ${source.toUpperCase()}`
        ]);
        addFloatingText("BATTLE INITIALIZED", "info", "boss");
      }, 250);
    })();
  };

  // Time-out action handler
  const handleTimeout = () => {
    setIsAnswered(true);
    setIsAnswerCorrect(false);
    setSelectedAnswer(null);
    setSelectedCandidate(null);
    setActiveTurn("boss");

    const currentAnswerRecord: PlayerAnswer = {
      questionText: currentQuestion.text,
      options: currentQuestion.options,
      correctIndex: currentQuestion.correctIndex,
      selectedIndex: null,
      isCorrect: false,
      diagram: currentQuestion.diagram,
      explanation: currentQuestion.explanation
    };
    setBattleHistory((prev) => [...prev, currentAnswerRecord]);

    // Player takes damage
    const damage = 25;
    const nextHp = Math.max(0, playerHp - damage);
    setPlayerHp(nextHp);
    setShakePlayer(true);
    setFlashDamage(true);

    addFloatingText(`-${damage} HP!`, "damage", "player");

    setTimeout(() => {
      setShakePlayer(false);
      setFlashDamage(false);
    }, 600);

    const logMsg = `[Time Expired] You failed to calculate in time! ${selectedBoss?.title} strikes for ${damage} damage. Your HP: ${nextHp}/100.`;
    setCombatLogs((prev) => [...prev, logMsg]);

    if (nextHp <= 0) {
      setTimeout(() => setGameState("defeat"), 1800);
    }
  };

  // Submit Answer Action
  const submitAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);

    const correct = optionIndex === currentQuestion.correctIndex;
    setIsAnswerCorrect(correct);

    const currentAnswerRecord: PlayerAnswer = {
      questionText: currentQuestion.text,
      options: currentQuestion.options,
      correctIndex: currentQuestion.correctIndex,
      selectedIndex: optionIndex,
      isCorrect: correct,
      diagram: currentQuestion.diagram,
      explanation: currentQuestion.explanation
    };
    setBattleHistory((prev) => [...prev, currentAnswerRecord]);

    if (correct) {
      // Calculate damage dealt to boss
      const damageDealt = Math.ceil(selectedBoss!.maxHp / activeQuestions.length); 
      const nextHp = Math.max(0, bossHp - damageDealt);
      setBossHp(nextHp);
      setShakeBoss(true);
      setFlashHit(true);

      addFloatingText(`CRITICAL! -${damageDealt} HP`, "hit", "boss");

      setTimeout(() => {
        setShakeBoss(false);
        setFlashHit(false);
      }, 600);

      // Subject descriptive hits
      let hitDescription = "Vector strike";
      if (selectedBoss?.subject === "Math") hitDescription = "Definite Integral slash";
      if (selectedBoss?.subject === "Physics") hitDescription = "Kinetic acceleration shock";
      if (selectedBoss?.subject === "Chemistry") hitDescription = "Covalent bond disruption";

      const logMsg = `[Defense Success] Correct answer! You deploy a ${hitDescription} dealing ${damageDealt} damage. ${selectedBoss?.title} HP: ${nextHp}/${selectedBoss?.maxHp}.`;
      setCombatLogs((prev) => [...prev, logMsg]);

      // Win Check
      if (nextHp <= 0) {
        handleVictory();
        return;
      }
    } else {
      // Player takes damage: loses 25 HP (4 hits total)
      setActiveTurn("boss");
      const damageTaken = 25;
      const nextHp = Math.max(0, playerHp - damageTaken);
      setPlayerHp(nextHp);
      setShakePlayer(true);
      setFlashDamage(true);

      addFloatingText(`-${damageTaken} HP!`, "damage", "player");

      setTimeout(() => {
        setShakePlayer(false);
        setFlashDamage(false);
      }, 600);

      const logMsg = `[Attack Block Failed] Incorrect formula! ${selectedBoss?.title} breaks your defense and hits for ${damageTaken} damage. Your HP: ${nextHp}/100.`;
      setCombatLogs((prev) => [...prev, logMsg]);

      // Loss Check
      if (nextHp <= 0) {
        setTimeout(() => setGameState("defeat"), 1800);
        return;
      }
    }
  };

  // Next Question trigger
  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < activeQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(30);
      setIsAnswered(false);
      setSelectedAnswer(null);
      setSelectedCandidate(null);
      setActiveTurn("player");
      setCombatLogs((prev) => [
        ...prev,
        `[Combat] Advancing to Concept Vector #${currentQuestionIndex + 2} of ${activeQuestions.length}. Calibrating shields.`
      ]);
    } else {
      // Out of questions but boss not dead
      setGameState("defeat");
    }
  };

  // Victory handler & DB XP Sync
  const handleVictory = async () => {
    const xpReward = selectedBoss!.reward;
    const nextXpTotal = userXp + xpReward;
    
    // Level & Title Calculation
    const nextLevel = Math.floor(nextXpTotal / 1000) + 1;
    let rankTitle = "Recruit";
    if (nextLevel >= 5) rankTitle = "Adept";
    if (nextLevel >= 10) rankTitle = "Scholar";
    if (nextLevel >= 25) rankTitle = "Master";
    if (nextLevel >= 50) rankTitle = "Grandmaster";

    try {
      const supabase = createClient();
      
      if (userId) {
        // 1. Sync updated profile
        const { error: profileErr } = await supabase
          .from("profiles")
          .update({
            xp_total: nextXpTotal,
            level: nextLevel,
            rank_title: rankTitle,
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);

        if (profileErr) throw profileErr;

        // 2. Insert into XP Ledger
        const { error: ledgerErr } = await supabase
          .from("xp_ledger")
          .insert({
            user_id: userId,
            amount: xpReward,
            transaction_type: "boss_battle",
            description: `Defeated basic Arena boss: ${selectedBoss!.title}`,
            balance_after: nextXpTotal
          });

        if (ledgerErr) throw ledgerErr;
      }
      
      // Update local states immediately
      setUserXp(nextXpTotal);
      setUserLevel(nextLevel);
      setDefeatedCount((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to commit victory XP rewards to database:", err);
    }

    setTimeout(() => {
      setGameState("victory");
    }, 1000);
  };

  // Return to Lobby
  const returnToLobby = () => {
    setSelectedBoss(null);
    setGameState("lobby");
    loadProfileAndHistory();
  };

  // Helper for difficulty label coloring
  const getDifficultyColor = (diff: "Hard" | "Insane") => {
    if (diff === "Insane") return "text-red-500 bg-red-50 border-red-200/50";
    return "text-[#c9a84c] bg-[#c9a84c]/5 border-[#c9a84c]/20";
  };

  // Subject colors
  const getSubjectBadgeStyle = (subject: "Physics" | "Chemistry" | "Math") => {
    if (subject === "Physics") return "text-blue-600 bg-blue-50 border-blue-200/40";
    if (subject === "Chemistry") return "text-emerald-600 bg-emerald-50 border-emerald-200/40";
    return "text-red-600 bg-red-50 border-red-200/40";
  };

  if (!mounted) return <div className="min-h-screen bg-[#faf9f6]" />;

  return (
    <main className="w-full min-h-screen bg-[#faf9f6] text-neutral-900 relative overflow-hidden flex flex-col items-center pb-24 selection:bg-[#c9a84c]/30 font-sans">
      
      {/* Visual Damage / Floating RPG Text Keyframe Styles */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes flashRed {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.25; }
        }
        .animate-flash-red {
          animation: flashRed 0.4s ease-in-out;
        }
        @keyframes flashWhite {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.15; }
        }
        .animate-flash-white {
          animation: flashWhite 0.3s ease-in-out;
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
        @keyframes floatUpDamage {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          15% { transform: translateY(-20px) scale(1.2); opacity: 1; }
          80% { transform: translateY(-50px) scale(1); opacity: 1; }
          100% { transform: translateY(-70px) scale(0.9); opacity: 0; }
        }
        .animate-float-damage {
          animation: floatUpDamage 1.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
        }
        @keyframes bounceGlow {
          0%, 100% { transform: translateY(0); box-shadow: 0 0 15px rgba(201,168,76,0.1); }
          50% { transform: translateY(-6px); box-shadow: 0 10px 25px rgba(201,168,76,0.25); }
        }
        .animate-bounce-glow {
          animation: bounceGlow 3s infinite ease-in-out;
        }
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-laser-sweep {
          animation: sweep 4s ease-in-out infinite;
        }
        @keyframes floatSparkle {
          0% { transform: translateY(105vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {/* Premium Background Graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 w-full h-[550px] overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/10 via-[#c9a84c]/3 to-transparent" />
          <div className="absolute -top-[200px] right-[10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-15 bg-[#c9a84c]" />
          <div className="absolute top-[100px] left-[5%] w-[450px] h-[450px] rounded-full blur-[120px] opacity-10 bg-[#c9a84c]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
        </div>
      </div>

      {/* Screen Damage Overlay */}
      {flashDamage && <div className="fixed inset-0 bg-red-600 z-[99] pointer-events-none animate-flash-red" />}
      {flashHit && <div className="fixed inset-0 bg-white z-[99] pointer-events-none animate-flash-white" />}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 1. LOBBY STATE */}
      {/* ──────────────────────────────────────────────────────── */}
      {gameState === "lobby" && (
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-12 relative z-10 flex flex-col gap-10">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-4">
            <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-5 py-1.5 rounded-full flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c9a84c] text-sm animate-pulse">swords</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a84c]">Arena Lobby</span>
            </div>

            <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none uppercase text-neutral-900">
              Boss <span className="text-[#c9a84c]">Battles</span>
            </h1>
            
            <p className="text-xs md:text-sm text-neutral-500 font-medium leading-relaxed max-w-xl">
              High-stakes conceptual trials. Challenge classical learning bosses in Physics, Chemistry, and Mathematics to claim legendary XP rewards.
            </p>
          </div>

          {/* User Metrics & Live Event Status Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
            
            {/* Live Battles Block (Currently None Available) */}
            <div className="lg:col-span-8 bg-white border border-neutral-200/80 shadow-md rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between min-h-[280px]">
              {/* Scanline line scanner */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-0.5 bg-[#c9a84c]/5 absolute top-0 left-0 animate-scanline" />
              </div>

              <div className="w-full flex justify-between items-center text-[9px] font-mono text-neutral-400 select-none">
                <span>GLOBAL_TOURNAMENTS // LIVE</span>
                <span className="text-red-500 font-black tracking-widest animate-pulse">OFFLINE</span>
              </div>

              <div className="my-8 text-center flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-neutral-400 text-5xl">explore_off</span>
                <h3 className="font-bold text-lg text-neutral-900">No Live Global Battles Active</h3>
                <p className="text-xs text-neutral-500 max-w-md leading-relaxed">
                  There are currently no live tournament matches running. The next scheduled global tournament starts in <span className="text-[#c9a84c] font-black font-mono">02h 45m</span>.
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono border-t border-neutral-200/50 pt-4 text-neutral-400 uppercase">
                <span>Next Event: Organic Chemistry Crucible</span>
                <span>Standby mode active</span>
              </div>
            </div>

            {/* User Profile Widget */}
            <div className="lg:col-span-4 bg-white border border-neutral-200/80 shadow-md rounded-[2rem] p-8 flex flex-col justify-between min-h-[280px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[30%] h-full bg-gradient-to-l from-[#c9a84c]/5 to-transparent pointer-events-none" />
              
              <div className="w-full flex justify-between items-center text-[9px] font-mono text-neutral-400 select-none">
                <span>SCHOLAR_TELEMETRY</span>
                <span className="text-emerald-600 font-black">ACTIVE</span>
              </div>

              {dbLoading ? (
                <div className="py-6 text-center flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-2xl text-neutral-400 animate-spin">sync</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Loading data indexes...</span>
                </div>
              ) : (
                <div className="flex flex-col gap-5 my-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-[#c9a84c] bg-neutral-50 flex items-center justify-center text-xl font-bold font-mono text-neutral-800">
                      {userLevel}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-neutral-950 text-base tracking-wide">{userIgn}</span>
                      <span className="text-[9px] font-mono text-[#c9a84c] uppercase tracking-wider font-bold">Level {userLevel} Scholar</span>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-neutral-100 pt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-500 font-medium">Global XP Score</span>
                      <span className="font-mono text-neutral-800 font-bold">{userXp.toLocaleString()} XP</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-500 font-medium">Syllabus Scope</span>
                      <span className="font-mono text-[#c9a84c] font-black">{classLevel} · {examTarget}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-500 font-medium">Bosses Banished</span>
                      <span className="font-mono text-[#c9a84c] font-black">{defeatedCount} Defeated</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                Standings verified via Drona Arena
              </div>
            </div>

          </div>

          {/* Syllabus & Battle Settings Card */}
          <div className="bg-white border border-neutral-200/80 shadow-md rounded-[2rem] p-8 flex flex-col gap-6 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#c9a84c] text-xl">tune</span>
              <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">Syllabus & Battle Settings</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Exam Target Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider">Exam Target</label>
                <select 
                  value={examTarget} 
                  onChange={(e) => setExamTarget(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#c9a84c] cursor-pointer"
                >
                  <option value="JEE">JEE (Engineering)</option>
                  <option value="NEET">NEET (Medical)</option>
                  <option value="Boards Only">Boards Only</option>
                  <option value="CET">CET (State Entrance)</option>
                </select>
              </div>

              {/* Class level Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider">Target Class</label>
                <select 
                  value={classLevel} 
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#c9a84c] cursor-pointer"
                >
                  <option value="Class 10">Class 10 (Secondary)</option>
                  <option value="Class 11">Class 11 (Intermediate 1st Yr)</option>
                  <option value="Class 12">Class 12 (Intermediate 2nd Yr)</option>
                  <option value="Dropper">Dropper / Repeater</option>
                </select>
              </div>

              {/* Board Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider">Educational Board</label>
                <select 
                  value={board} 
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#c9a84c] cursor-pointer"
                >
                  <option value="CBSE">CBSE (NCERT)</option>
                  <option value="ICSE">ICSE / ISC</option>
                  <option value="State Board">State Board</option>
                  <option value="IB">IB / Cambridge</option>
                </select>
              </div>

              {/* Question Count Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider">Questions per Run</label>
                <select 
                  value={questionCount} 
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#c9a84c] cursor-pointer"
                >
                  <option value="3">3 questions (Quick Battle)</option>
                  <option value="5">5 questions (Standard Arena)</option>
                  <option value="8">8 questions (Challenge Course)</option>
                  <option value="10">10 questions (Ultimate Showdown)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Basic Arena Bosses Title */}
          <div className="flex items-center gap-4 mt-6">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#c9a84c]">Basic Arena Challenges</h2>
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase font-black">Ready to fight • 3 bosses</span>
          </div>

          {/* Basic Bosses Roster Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {basicBosses.map((boss) => (
              <div key={boss.id} className="bg-white border border-neutral-200/80 shadow-md hover:shadow-xl rounded-[2.5rem] p-8 flex flex-col items-center justify-between text-center relative overflow-hidden group min-h-[420px] transition-all duration-500 hover:-translate-y-2 hover:border-[#c9a84c]/30">
                {/* Laser scan sweep */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                  <div className="w-[30%] h-full bg-gradient-to-r from-transparent via-[#c9a84c]/5 to-transparent absolute top-0 left-0 animate-laser-sweep opacity-40" />
                </div>
                
                <div className="w-full flex justify-between items-center text-[8px] font-mono text-neutral-400 select-none">
                  <span>CHALLENGE // {boss.id.toUpperCase()}</span>
                  <span className={`font-black tracking-wider px-2 py-0.5 border rounded uppercase ${getDifficultyColor(boss.difficulty)}`}>{boss.difficulty}</span>
                </div>
                
                {/* Avatar Icon */}
                <div className="relative w-28 h-28 flex items-center justify-center mt-6 shrink-0">
                  <div className="absolute inset-0 rounded-full border border-neutral-200 animate-pulse opacity-45" />
                  <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center overflow-hidden bg-neutral-50 z-10" style={{ borderColor: boss.color, boxShadow: `0 0 20px ${boss.color}1a` }}>
                    <span className="material-symbols-outlined text-4xl" style={{ color: boss.color }}>{boss.avatarIcon}</span>
                  </div>
                </div>

                {/* Info block */}
                <div className="w-full text-center flex-1 flex flex-col justify-between mt-4">
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-neutral-900 mt-2">
                      {boss.title}
                    </h3>
                    <p className="text-[10px] text-neutral-500 font-medium leading-relaxed max-w-[220px] mx-auto mt-2 h-12">
                      {boss.description}
                    </p>
                  </div>

                  {/* Stats list */}
                  <div className="w-full space-y-2 mt-4 pt-4 border-t border-neutral-100">
                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-neutral-100 pb-1.5">
                      <span className="text-neutral-400 font-bold">SUBJECT</span>
                      <span className={`px-2 py-0.5 border rounded uppercase font-bold text-[8px] ${getSubjectBadgeStyle(boss.subject)}`}>{boss.subject}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-neutral-100 pb-1.5">
                      <span className="text-neutral-400 font-bold">BOSS ENERGY</span>
                      <span className="text-neutral-900 font-bold">{boss.maxHp} HP</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-neutral-400 font-bold">COMPLETION REWARD</span>
                      <span className="text-[#c9a84c] font-black">+{boss.reward} XP</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => challengeBoss(boss)}
                  className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider text-black transition-all transform mt-6 group-hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(201,168,76,0.3)] relative overflow-hidden cursor-pointer" 
                  style={{ background: `linear-gradient(135deg, ${themeHex}, #f5d061)` }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-1.5">Challenge Boss <span className="material-symbols-outlined text-[14px]">bolt</span></span>
                </button>
              </div>
            ))}
          </div>

          {/* Info Banner */}
          <div className="bg-white border border-neutral-200/80 shadow-md rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a84c]/5 to-transparent pointer-events-none" />
            
            <div className="w-14 h-14 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px] text-[#c9a84c]">info</span>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1.5 text-neutral-900">How Boss Battles Work</h4>
              <p className="text-xs text-neutral-500 leading-relaxed max-w-3xl">
                Choose your subject challenge and customize target parameters like class, board, and length. Each battle features conceptual questions generated by the Google Gemini API (or static fallbacks if offline). Submitting the correct answer deals proportional damage to the boss, while mistakes or timeouts cost you HP. Defeat the boss to claim real XP synced directly to your database profile!
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. BOOTING SCREEN (LOADING ARENA MATRIX) */}
      {/* ──────────────────────────────────────────────────────── */}
      {gameState === "booting" && (
        <div className="fixed inset-0 z-[100] bg-[#faf9f6] flex flex-col items-center justify-center select-none px-4">
          <div className="flex flex-col items-center text-center max-w-md">
            
            {/* Elegant rotating loader */}
            <span className="material-symbols-outlined text-5xl text-[#c9a84c] animate-spin mb-6">
              settings
            </span>

            {/* Branded Title */}
            <span className="text-[10px] font-mono tracking-[0.4em] font-black text-neutral-400 uppercase">
              DRONA SYSTEM
            </span>
            <h2 className="text-3xl font-display font-black tracking-[0.05em] text-neutral-950 uppercase mt-2">
              Stabilizing Arena
            </h2>
            
            {/* Loader Line */}
            <div className="w-48 h-0.5 bg-neutral-100 rounded-full overflow-hidden relative mt-8 border border-neutral-200">
              <div 
                className="h-full bg-[#c9a84c] rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${Math.min(100, Math.max(10, (bootLogs.length / 7) * 100))}%` }} 
              />
            </div>

            {/* Single dynamic status line */}
            <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-[0.2em] mt-5 h-4 transition-all duration-300">
              {bootLogs[bootLogs.length - 1] || "Connecting database..."}
            </p>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 3. ACTIVE BATTLE ARENA */}
      {/* ──────────────────────────────────────────────────────── */}
      {gameState === "battle" && selectedBoss && currentQuestion && (
        <div className="w-full max-w-[1400px] mx-auto px-6 py-12 relative z-10 flex flex-col gap-8">
          
          {/* Header Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full relative">
            
            {/* Boss Status Display Card */}
            <div className={`bg-white border border-neutral-200/80 shadow-md rounded-[2rem] p-6 relative overflow-hidden flex items-center justify-between gap-6 transition-all duration-300 ${shakeBoss ? 'animate-shake border-red-500/20' : ''} ${activeTurn === "boss" ? "ring-2 ring-red-500/10" : ""}`}>
              <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-[0.08]" style={{ backgroundColor: selectedBoss.color }} />
              
              {/* Floating Damage Text Container */}
              {floatingTexts.filter(t => t.target === "boss").map((t) => (
                <div key={t.id} className="absolute left-[35%] top-[10%] font-display font-black text-3xl text-amber-500 drop-shadow-[0_4px_12px_rgba(201,168,76,0.5)] animate-float-damage z-[50] tracking-wider">
                  {t.text}
                </div>
              ))}

              <div className="flex items-center gap-4 shrink-0">
                <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center bg-neutral-50 relative" style={{ borderColor: selectedBoss.color }}>
                  <span className="material-symbols-outlined text-2xl" style={{ color: selectedBoss.color }}>{selectedBoss.avatarIcon}</span>
                  {activeTurn === "boss" && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1">
                    Arena Boss 
                    {activeTurn === "boss" && <span className="text-red-500 font-bold tracking-widest animate-pulse">[ATTACKING]</span>}
                  </span>
                  <span className="font-black text-neutral-900 text-base tracking-wide">{selectedBoss.title}</span>
                  <span className={`text-[8px] font-mono px-2 py-0.5 border rounded uppercase mt-1 w-max font-bold ${getSubjectBadgeStyle(selectedBoss.subject)}`}>{selectedBoss.subject}</span>
                </div>
              </div>

              {/* HP Bar */}
              <div className="flex-1 flex flex-col items-end gap-1.5 max-w-[200px] md:max-w-[250px]">
                <div className="flex justify-between items-baseline w-full text-[10px] font-mono font-bold text-neutral-400 uppercase">
                  <span>Boss HP</span>
                  <span className="text-neutral-800 font-black">{bossHp} / {selectedBoss.maxHp}</span>
                </div>
                <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60 p-0.5 relative">
                  <div 
                    className="h-full rounded-full transition-all duration-500 ease-out" 
                    style={{ 
                      width: `${(bossHp / selectedBoss.maxHp) * 100}%`,
                      backgroundColor: selectedBoss.color,
                      boxShadow: `0 0 8px ${selectedBoss.color}66`
                    }} 
                  />
                </div>
              </div>
            </div>

            {/* Player Status Display Card */}
            <div className={`bg-white border border-neutral-200/80 shadow-md rounded-[2rem] p-6 relative overflow-hidden flex items-center justify-between gap-6 transition-all duration-300 ${shakePlayer ? 'animate-shake border-red-500/20' : ''} ${activeTurn === "player" ? "ring-2 ring-emerald-500/10" : ""}`}>
              <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 bg-emerald-500/5" />
              
              {/* Floating Damage Text Container */}
              {floatingTexts.filter(t => t.target === "player").map((t) => (
                <div key={t.id} className="absolute left-[35%] top-[10%] font-display font-black text-3xl text-red-600 drop-shadow-[0_4px_12px_rgba(220,38,38,0.5)] animate-float-damage z-[50] tracking-wider animate-pulse">
                  {t.text}
                </div>
              ))}

              <div className="flex items-center gap-4 shrink-0">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 bg-neutral-50 flex items-center justify-center text-xl font-bold font-mono text-neutral-800 relative">
                  {userLevel}
                  {activeTurn === "player" && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-50"></span>
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1">
                    Challenger
                    {activeTurn === "player" && <span className="text-emerald-600 font-bold tracking-widest animate-pulse">[DEFENSE ACTIVE]</span>}
                  </span>
                  <span className="font-black text-neutral-900 text-base tracking-wide">{userIgn}</span>
                  <span className="text-[8px] font-mono px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded uppercase mt-1 w-max font-bold">STATUS: OK</span>
                </div>
              </div>

              {/* Player HP Bar */}
              <div className="flex-1 flex flex-col items-end gap-1.5 max-w-[200px] md:max-w-[250px]">
                <div className="flex justify-between items-baseline w-full text-[10px] font-mono font-bold text-neutral-400 uppercase">
                  <span>Challenger HP</span>
                  <span className="text-white font-black px-2 py-0.5 rounded text-[8px] tracking-wide bg-neutral-800 font-mono font-black">{playerHp} / 100</span>
                </div>
                <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60 p-0.5 relative">
                  <div 
                    className="h-full rounded-full transition-all duration-500 ease-out" 
                    style={{ 
                      width: `${playerHp}%`,
                      backgroundColor: playerHp > 50 ? "#00c896" : playerHp > 25 ? "#f5a623" : "#e8362a",
                      boxShadow: playerHp > 50 ? "0 0 8px rgba(0,200,150,0.3)" : "0 0 8px rgba(232,54,42,0.3)"
                    }} 
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Combat Arena layout grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
            
            {/* Left: Terminal Quiz Arena (8 cols) */}
            <div className="lg:col-span-8 bg-white border border-neutral-200/80 shadow-lg rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden min-h-[480px]">
              
              {/* Question Header */}
              <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-neutral-400 font-black uppercase tracking-widest">
                    CONCEPT VECTOR {currentQuestionIndex + 1} OF {activeQuestions.length}
                  </span>
                  {questionsSource && (
                    <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider">
                      ASSESSMENT SOURCE: {questionsSource === "gemini" ? "Google Gemini API (Dynamic)" : "Drona Local Database (Offline)"}
                    </span>
                  )}
                </div>
                
                {/* Timer Display */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono font-bold text-xs ${
                  timeLeft > 10 
                    ? "bg-neutral-50 border-neutral-200 text-neutral-700"
                    : "bg-red-50 border-red-200 text-red-600 animate-pulse"
                }`}>
                  <span className="material-symbols-outlined text-sm">timer</span>
                  {timeLeft}s
                </div>
              </div>

              {/* Question Box (Separated and clearly readable) */}
              <div className="my-6 border-b border-neutral-100 pb-6">
                <MathText 
                  text={currentQuestion.text} 
                  className="text-sm md:text-base text-neutral-900 font-bold leading-relaxed block" 
                />

                {/* Render Mermaid diagram if available */}
                {currentQuestion.diagram && (
                  <div className="mt-4">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase font-black tracking-wider block mb-1">Conceptual Schematic:</span>
                    <MermaidDiagram chart={currentQuestion.diagram} />
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, idx) => {
                  let buttonStyle = "bg-neutral-50 border-neutral-200/80 text-neutral-800 hover:border-[#c9a84c]/40 hover:bg-neutral-100/50 cursor-pointer";
                  
                  if (isAnswered) {
                    if (idx === currentQuestion.correctIndex) {
                      buttonStyle = "bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default";
                    } else if (idx === selectedAnswer) {
                      buttonStyle = "bg-red-50 border-red-200 text-red-700 cursor-default";
                    } else {
                      buttonStyle = "bg-neutral-50/50 border-neutral-100 text-neutral-400 cursor-default";
                    }
                  } else {
                    if (idx === selectedCandidate) {
                      buttonStyle = "bg-amber-50/75 border-[#c9a84c] text-neutral-900 ring-2 ring-[#c9a84c]/20 shadow-sm cursor-pointer";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !isAnswered && setSelectedCandidate(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-2xl border text-xs font-bold transition-all flex items-start gap-3 ${buttonStyle}`}
                    >
                      <span className="font-mono text-neutral-400 shrink-0 select-none">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <MathText text={option} className="inline-block" />
                    </button>
                  );
                })}
              </div>

              {/* Step-by-Step explanation below options if answered */}
              {isAnswered && currentQuestion.explanation && (
                <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-left animate-fadeIn">
                  <span className="text-[9px] font-mono text-[#c9a84c] font-black uppercase tracking-wider block mb-2">Step-by-Step Derivation:</span>
                  <MathText text={currentQuestion.explanation} className="text-xs text-neutral-600 leading-relaxed block" />
                </div>
              )}

              {/* Action Submit Attacking Move */}
              {selectedCandidate !== null && !isAnswered && (
                <div className="flex justify-end mt-6 pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => submitAnswer(selectedCandidate)}
                    className="w-full md:w-auto px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-black transition-all hover:shadow-[0_5px_15px_rgba(201,168,76,0.35)] relative overflow-hidden flex items-center justify-center gap-2 animate-bounce-glow cursor-pointer"
                    style={{ background: `linear-gradient(135deg, ${themeHex}, #f5d061)` }}
                  >
                    <span>Deploy Attack-Formula</span>
                    <span className="material-symbols-outlined text-[14px]">swords</span>
                  </button>
                </div>
              )}

              {/* Actions Footer */}
              {isAnswered && bossHp > 0 && playerHp > 0 && (
                <div className="flex justify-between items-center border-t border-neutral-100 pt-6 mt-6">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-lg ${isAnswerCorrect ? "text-emerald-600 animate-bounce" : "text-red-500"}`}>
                      {isAnswerCorrect ? "check_circle" : "cancel"}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isAnswerCorrect ? "text-emerald-600" : "text-red-500"}`}>
                      {isAnswerCorrect ? "Concept Aligned! Strike deployed." : "Concept Mismatch. Counter strike hit."}
                    </span>
                  </div>

                  <button
                    onClick={nextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {currentQuestionIndex + 1 === activeQuestions.length ? "Finish Battle" : "Next Vector"}
                    </span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Battle Action Feed (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-neutral-200/80 shadow-md rounded-[2.5rem] p-6 flex flex-col justify-between relative overflow-hidden min-h-[480px]">
              <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-[0.03] bg-[#c9a84c]" />
              
              <div className="w-full flex justify-between items-center border-b border-neutral-100 pb-3">
                <span className="text-[9px] font-mono text-neutral-400 font-bold uppercase tracking-widest">
                  COMBAT_FEED // REALTIME
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              </div>

              {/* Log List */}
              <div className="flex-1 overflow-y-auto my-4 space-y-3 font-mono text-[9px] text-neutral-600 pr-2 max-h-[340px]">
                {combatLogs.map((log, idx) => {
                  let color = "text-neutral-500";
                  if (log.includes("[Time Expired]") || log.includes("[Attack Block Failed]")) {
                    color = "text-red-600 font-bold";
                  } else if (log.includes("[Defense Success]")) {
                    color = "text-emerald-600 font-bold";
                  } else if (log.includes("Battle initialized!")) {
                    color = "text-neutral-900 font-black";
                  }
                  return (
                    <div key={idx} className={`leading-relaxed border-l-2 border-neutral-200 pl-2 py-0.5 ${color}`}>
                      {log}
                    </div>
                  );
                })}
              </div>

              <div className="text-[8px] font-mono text-neutral-400 uppercase border-t border-neutral-100 pt-3 select-none">
                Telemetric status logs are system generated
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 4. VICTORY CELEBRATION STATE */}
      {/* ──────────────────────────────────────────────────────── */}
      {gameState === "victory" && selectedBoss && (
        <div className="fixed inset-0 z-[100] bg-[#faf9f6]/98 flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto">
          
          {/* Confetti Sparkles Background */}
          {Array.from({ length: 25 }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 6;
            const duration = 4 + Math.random() * 4;
            const size = 6 + Math.random() * 10;
            const colors = ["bg-amber-400", "bg-[#c9a84c]", "bg-yellow-300", "bg-emerald-400", "bg-sky-400"];
            const bgClass = colors[Math.floor(Math.random() * colors.length)];
            return (
              <div 
                key={i} 
                className={`absolute rounded-full pointer-events-none opacity-0 ${bgClass}`}
                style={{
                  left: `${left}%`,
                  bottom: `-20px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animation: `floatSparkle ${duration}s linear infinite`,
                  animationDelay: `${delay}s`
                }}
              />
            );
          })}

          {/* Intense blurred background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c9a84c]/20 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />

          <div className="max-w-2xl w-full bg-white border border-neutral-200 shadow-[0_15px_60px_rgba(201,168,76,0.2)] rounded-[3rem] p-8 md:p-12 relative overflow-hidden flex flex-col items-center gap-6 my-8 animate-bounce-glow">
            
            {/* Swords/Medal emblem */}
            <div className="w-24 h-24 rounded-full border-4 border-[#c9a84c] shadow-[0_0_30px_rgba(201,168,76,0.4)] flex items-center justify-center bg-neutral-50 text-[#c9a84c] animate-bounce shrink-0">
              <span className="material-symbols-outlined text-5xl">emoji_events</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#c9a84c] font-black">
                Conquest Complete // Victory achieved
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-black text-neutral-900 uppercase tracking-tight">
                GLORIOUS DEFEAT OF {selectedBoss.title.toUpperCase()}
              </h2>
              <p className="text-xs md:text-sm text-neutral-500 font-medium leading-relaxed max-w-lg mx-auto mt-2">
                "Precise execution, Scholar. The gates of the next arena are opening. Your conceptual framework of <span className="text-neutral-900 font-bold">{selectedBoss.subject}</span> is hereby certified." — Drona AI
              </p>
            </div>

            {/* Performance analysis summary details */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* Stats Column */}
              <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 text-left space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase tracking-wider block mb-3">Battle Stats Analysis:</span>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Total Formulas Evaluated</span>
                      <span className="font-bold font-mono">{battleHistory.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Correct Calculations</span>
                      <span className="font-bold text-emerald-600 font-mono">{battleHistory.filter(h => h.isCorrect).length} / {battleHistory.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Performance Accuracy</span>
                      <span className="font-bold text-[#c9a84c] font-mono">
                        {battleHistory.length > 0 ? Math.round((battleHistory.filter(h => h.isCorrect).length / battleHistory.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Reward summary inside stats */}
                <div className="border-t border-emerald-100/50 pt-4 flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-bold uppercase text-[9px] font-mono">XP CREDIT</span>
                  <span className="text-[#c9a84c] font-black font-mono text-sm">+{selectedBoss.reward} XP</span>
                </div>
              </div>

              {/* Victory mistake/formula review list */}
              <div className="bg-neutral-50/50 border border-neutral-200 rounded-2xl p-6 text-left flex flex-col max-h-[220px]">
                <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-wider block mb-2 shrink-0">Formulas Resolved:</span>
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                  {battleHistory.map((h, i) => (
                    <div key={i} className={`border-l-2 ${h.isCorrect ? 'border-emerald-400' : 'border-red-400'} pl-3 py-0.5 text-xs`}>
                      <p className="font-bold text-neutral-800 truncate"><MathText text={h.questionText} /></p>
                      <span className="text-[10px] text-neutral-500 block">
                        Correct: <MathText text={h.options[h.correctIndex]} className="font-mono text-emerald-600 font-bold" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <button
              onClick={returnToLobby}
              className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-wider text-black transition-all transform hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(201,168,76,0.4)] relative overflow-hidden mt-4 cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${themeHex}, #f5d061)` }}
            >
              Return to Arena Lobby
            </button>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 5. DEFEAT STATE */}
      {/* ──────────────────────────────────────────────────────── */}
      {gameState === "defeat" && selectedBoss && (
        <div className="fixed inset-0 z-[100] bg-[#faf9f6]/95 flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto">
          {/* Red blurred background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-xl w-full bg-white border border-neutral-200/80 shadow-2xl rounded-[3rem] p-8 md:p-12 relative overflow-hidden flex flex-col items-center gap-6 my-8 animate-shake">
            
            <div className="w-18 h-18 rounded-full border-4 border-red-500/20 flex items-center justify-center bg-neutral-50 text-red-500 animate-pulse shrink-0">
              <span className="material-symbols-outlined text-3xl">heart_broken</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-red-500 font-black">
                Lifepoints Expired
              </span>
              <h2 className="text-3xl font-display font-black text-neutral-900 uppercase tracking-tight">
                Defeated in Arena
              </h2>
              <p className="text-xs text-neutral-500 font-medium leading-relaxed max-w-xs mx-auto mt-2">
                Do not be discouraged. Failure is the optimal telemetry for corrective action. Review your formulas in <span className="text-neutral-900 font-bold">{selectedBoss.subject}</span>, stabilize your velocity, and challenge {selectedBoss.title} again.
              </p>
            </div>

            {/* Defeat mistake review with LaTeX & diagrams */}
            {battleHistory.filter(h => !h.isCorrect).length > 0 && (
              <div className="w-full max-h-[220px] overflow-y-auto bg-red-50/50 border border-red-100 rounded-2xl p-6 text-left space-y-4 custom-scrollbar">
                <span className="text-[10px] font-mono text-red-600 font-bold uppercase tracking-wider block">Mistake Telemetry & Explanations:</span>
                {battleHistory.filter(h => !h.isCorrect).map((h, i) => (
                  <div key={i} className="border-l-2 border-red-300 pl-3 space-y-2 py-1 text-xs">
                    <p className="font-bold text-neutral-800 leading-snug">
                      <MathText text={h.questionText} />
                    </p>
                    
                    {/* Re-render diagram if the failed item had one */}
                    {h.diagram && (
                      <div className="scale-95 origin-left">
                        <MermaidDiagram chart={h.diagram} />
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-1 text-[10px] text-neutral-600">
                      <span>• Your Choice: <span className="text-red-600 font-bold">{h.selectedIndex !== null ? <MathText text={h.options[h.selectedIndex]} /> : "Timeout"}</span></span>
                      <span>• Correct Answer: <span className="text-emerald-600 font-bold"><MathText text={h.options[h.correctIndex]} /></span></span>
                    </div>

                    {h.explanation && (
                      <div className="mt-2 p-2 bg-white/60 border border-red-200/50 rounded-xl text-[10px] text-neutral-500">
                        <MathText text={h.explanation} className="block leading-relaxed" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Zero Reward Widget */}
            <div className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 font-bold uppercase text-[9px] font-mono">TRIAL OUTCOME</span>
                <span className="text-red-500 font-black">UNSUCCESFUL</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-neutral-200/60 pt-2 mt-2">
                <span className="text-neutral-400 font-bold uppercase text-[9px] font-mono">XP CREDIT</span>
                <span className="text-neutral-500 font-bold font-mono">+0 XP</span>
              </div>
            </div>

            <button
              onClick={returnToLobby}
              className="w-full py-3.5 rounded-xl bg-black border border-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider transition-all mt-2 cursor-pointer"
            >
              Return to Lobby
            </button>
          </div>
        </div>
      )}

    </main>
  );
}