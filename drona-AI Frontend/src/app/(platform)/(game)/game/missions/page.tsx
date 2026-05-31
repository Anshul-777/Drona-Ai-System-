"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storageAdapter } from "@/lib/storageAdapter";
import { useNotifications } from "@/context/NotificationContext";

// --- Watermark SVGs (Wuwa-Inspired Aesthetics) ---

const WatermarkTutorial = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#f2ebcc]/40" strokeWidth="2">
    <circle cx="50" cy="50" r="40" strokeDasharray="5 5" />
    <path d="M30 50 L50 30 L70 50 L50 70 Z" />
    <path d="M50 15 L50 85 M15 50 L85 50" strokeWidth="0.5" strokeDasharray="2 2" />
    <circle cx="50" cy="50" r="10" className="fill-[#f2ebcc]/20" />
    <polygon points="50,42 58,50 50,58 42,50" className="fill-[#c9a84c]/20" />
  </svg>
);

const WatermarkArchon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#f2ebcc]/50" strokeWidth="2.5">
    <path d="M50 5 L90 35 L75 85 L25 85 L10 35 Z" />
    <path d="M50 5 L50 85" strokeDasharray="3 3" />
    <circle cx="50" cy="50" r="25" />
    <polygon points="50,25 65,50 50,75 35,50" className="fill-[#c9a84c]/10" />
    <circle cx="50" cy="50" r="6" className="fill-[#c9a84c]/30" />
  </svg>
);

const WatermarkWorld = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#f2ebcc]/40" strokeWidth="2">
    <circle cx="50" cy="50" r="45" />
    <circle cx="50" cy="50" r="30" />
    <path d="M50 5 A 45 30 0 0 0 50 95 A 45 30 0 0 0 50 5" strokeWidth="1" />
    <path d="M5 50 A 30 45 0 0 0 95 50 A 30 45 0 0 0 5 50" strokeWidth="1" />
    <path d="M50 5 L50 95 M5 50 L95 50" strokeDasharray="4 4" />
    <polygon points="50,35 55,50 50,65 45,50" className="fill-[#c9a84c]/25 stroke-[#c9a84c]" strokeWidth="1" />
  </svg>
);

const WatermarkMilestone = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#f2ebcc]/50" strokeWidth="2.5">
    <path d="M50 10 L85 25 L85 60 C85 75 70 85 50 90 C30 85 15 75 15 60 L15 25 Z" />
    <path d="M35 45 L45 55 L65 35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="50" cy="45" r="22" strokeDasharray="4 2" />
    <circle cx="50" cy="90" r="4" className="fill-[#c9a84c]" />
  </svg>
);

// -------------------------------------------------

type Reward = {
  type: "xp" | "coins" | "mystery";
  amount: number | string;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  rarityGlow: string;
};

type Quest = {
  id: string;
  mission_type: string;
  title: string;
  description: string;
  target_metric: string;
  target_value: number;
  xp_reward: number;
  coins_reward: number;
  subject: string;
  difficulty: string;
  status: "active" | "claimable" | "claimed" | "locked";
  progress_value: number;
  progress_pct: number;
  link?: string;
  rewards: Reward[];
};

const getQuestInstructions = (metric: string): string | null => {
  switch (metric) {
    case "assessment_completed":
      return "Complete the initial onboarding assessment questionnaire to analyze your baseline learning parameters.";
    case "chat_messages_count":
      return "Interact with Drona AI. Ask questions, clarify topics, or have general study conversations in the chat terminal.";
    case "teaching_mode_configured":
      return "Navigate to Settings and customize Drona's active cognitive teaching agent persona and telemetry parameters.";
    case "perfect_quiz_score":
      return "Review your subject materials thoroughly and achieve a flawless 100% score on any custom generated practice quiz.";
    case "quiz_completed":
      return "Initiate and complete a practice quiz on any academic subject to record evaluation telemetry.";
    case "boss_battle_completed":
      return "Enter the Arena and defeat the cognitive boss agent in a knowledge challenge duel.";
    case "tournament_joined":
      return "Register for an active community knowledge tournament from the multiplayer lounge.";
    case "chemistry_workspace_visited":
      return "Launch the Chemistry lab simulation workspace tool from your dashboard workspace menu.";
    case "formula_bookmarked":
      return "Browse reference resources or formula list databases and bookmark any entry for quick revision retrieval.";
    case "focus_session_minutes":
      return "Activate the pomodoro focus timer session block in your workspace tools and maintain concentration.";
    case "revision_cards_count":
      return "Create standard question-answer index cards to build your custom flashcard revision decks.";
    case "todo_created":
      return "Access your personal workspace todo panel list and formulate a new target study task entry.";
    case "todo_completed":
      return "Successfully finish any outstanding checklist item inside your workspace todo dashboard.";
    case "flashcard_deck_mastered":
      return "Master a full revision flashcard deck by correctly answering all cards during study recall cycles.";
    case "streak_days":
      return "Maintain consecutive active study days. Log in daily and engage with Drona tools to preserve streak telemetry.";
    case "daily_login":
      return "Establish a connection with the system interface server. Log in to synchronize dashboard metrics.";
    default:
      return null;
  }
};

export default function QuestsPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();

  // Page states
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuestId, setSelectedQuestId] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("tutorial");
  const [userXp, setUserXp] = useState<number>(0);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [userTitle, setUserTitle] = useState<string>("INITIATE");
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [animatingQuestId, setAnimatingQuestId] = useState<string | null>(null);


  // Link mapper to redirect user directly to the task location
  const getQuestNavigationLink = (metric: string): string => {
    switch (metric) {
      case "assessment_completed":
        return "/onboarding";
      case "chat_messages_count":
        return "/drona";
      case "teaching_mode_configured":
        return "/agent-dock/settings";
      case "perfect_quiz_score":
      case "quiz_completed":
        return "/test";
      case "boss_battle_completed":
        return "/game/boss";
      case "tournament_joined":
        return "/game/tournaments";
      case "chemistry_workspace_visited":
      case "formula_bookmarked":
      case "focus_session_minutes":
      case "revision_cards_count":
      case "todo_created":
      case "todo_completed":
        return "/workspace";
      case "flashcard_deck_mastered":
        return "/agent-dock/lounge";
      case "streak_days":
      case "daily_login":
      default:
        return "/platform";
    }
  };

  // Sync user profile telemetry (Coins, XP, Level, Title)
  const syncUserProfile = async () => {
    try {
      const data = await storageAdapter.getProfileDashboardData();
      if (data && data.profile) {
        setUserXp(data.profile.xp);
        setUserLevel(data.profile.level);
        setUserTitle(data.profile.title);
        
        // Parse coin balance from "X KC"
        const kcString = data.profile.kc || "0 KC";
        const numericCoins = parseInt(kcString.replace(/[^\d]/g, ""), 10) || 0;
        setUserCoins(numericCoins);
      }
    } catch (err) {
      console.error("Failed to fetch profile telemetry", err);
    }
  };

  // Seed / Load quests from database
  const loadQuests = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const rawQuests = await storageAdapter.getMissions();
      
      // Parse & map DB fields to frontend Quest format
      const formattedQuests: Quest[] = rawQuests.map((q: any) => {
        const rewards: Reward[] = [
          {
            type: "xp",
            amount: q.xp_reward,
            label: "XP",
            icon: "emoji_events",
            color: "#c9a84c",
            bgColor: "#fffbf0",
            rarityGlow: "shadow-[0_0_12px_rgba(201,168,76,0.2)]",
          },
          {
            type: "coins",
            amount: q.coins_reward,
            label: "Coins",
            icon: "toll",
            color: "#8a9ba8",
            bgColor: "#f4f7f9",
            rarityGlow: "shadow-[0_0_12px_rgba(138,155,168,0.15)]",
          }
        ];

        // Add mystery relics to higher difficulty or Archon quests
        if (q.difficulty === "Legendary" || q.difficulty === "Expert" || q.mission_type === "archon") {
          rewards.push({
            type: "mystery",
            amount: "???",
            label: "Relic",
            icon: "auto_awesome",
            color: "#a855f7",
            bgColor: "#faf5ff",
            rarityGlow: "shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-pulse",
          });
        }

        return {
          id: q.id,
          mission_type: q.mission_type,
          title: q.title,
          description: q.description || "",
          target_metric: q.target_metric,
          target_value: q.target_value,
          xp_reward: q.xp_reward || 0,
          coins_reward: q.coins_reward || 0,
          subject: q.subject || "General",
          difficulty: q.difficulty || "Medium",
          status: q.status || "active",
          progress_value: q.progress_value || 0,
          progress_pct: q.progress_pct || 0,
          link: getQuestNavigationLink(q.target_metric),
          rewards,
        };
      });

      setQuests(formattedQuests);

      // Default select first quest of the active category
      const activeCatQuests = formattedQuests.filter(q => q.mission_type === activeCategory && (showHistory ? q.status === "claimed" : q.status !== "claimed"));
      if (activeCatQuests.length > 0) {
        // Keep selection if it exists in the active category, otherwise default to first
        const selectionExists = activeCatQuests.some(q => q.id === selectedQuestId);
        if (!selectionExists) {
          setSelectedQuestId(activeCatQuests[0].id);
        }
      } else {
        setSelectedQuestId("");
      }
    } catch (err) {
      console.error("Failed to load quests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    syncUserProfile();
    loadQuests(true);

    // Listen to profile updates (e.g. if claimed elsewhere or shop updates)
    window.addEventListener("drona_profile_updated", syncUserProfile);
    return () => {
      window.removeEventListener("drona_profile_updated", syncUserProfile);
    };
  }, []);

  // Reload/re-select when category changes
  useEffect(() => {
    setShowHistory(false); // Reset history view when changing category
    if (quests.length > 0) {
      const activeCatQuests = quests.filter(q => q.mission_type === activeCategory && q.status !== "claimed");
      if (activeCatQuests.length > 0) {
        setSelectedQuestId(activeCatQuests[0].id);
      } else {
        const completedCatQuests = quests.filter(q => q.mission_type === activeCategory && q.status === "claimed");
        if (completedCatQuests.length > 0) {
          setSelectedQuestId(completedCatQuests[0].id);
        } else {
          setSelectedQuestId("");
        }
      }
    }
  }, [activeCategory]);

  // Reload/re-select when history view toggled
  useEffect(() => {
    if (quests.length > 0) {
      const filtered = quests.filter(q => 
        q.mission_type === activeCategory && 
        (showHistory ? q.status === "claimed" : q.status !== "claimed")
      );
      if (filtered.length > 0) {
        setSelectedQuestId(filtered[0].id);
      } else {
        setSelectedQuestId("");
      }
    }
  }, [showHistory]);

  const handleClaimReward = async (quest: Quest) => {
    if (quest.status !== "claimable") return;

    try {
      // Trigger API / Storage Claim
      const rewardsClaimed = await storageAdapter.claimMission(quest.id);
      
      if (rewardsClaimed.xp > 0 || rewardsClaimed.coins > 0) {
        // Trigger local animating state
        setAnimatingQuestId(quest.id);

        // Add standard system notifications
        addNotification({
          title: quest.title,
          message: "Claimed quest rewards!",
          type: "achievement",
          achievementId: "quest",
          xpReward: rewardsClaimed.xp,
          coinsReward: rewardsClaimed.coins
        });

        // Wait for exit animation to complete before refreshing list
        setTimeout(async () => {
          await syncUserProfile();
          await loadQuests(false);
          setAnimatingQuestId(null);
        }, 1000);
      }
    } catch (err) {
      console.error("Reward claiming failed", err);
    }
  };

  const handleNavigate = (link?: string) => {
    if (link) {
      router.push(link);
    }
  };

  if (!mounted) {
    return <div className="w-full h-full min-h-screen bg-[#fcfaf4] animate-pulse" />;
  }

  // Find active selected quest object
  const activeQuest = quests.find(q => q.id === selectedQuestId);

  // Filtered quest list for active category
  const displayedQuests = quests.filter(q => 
    q.mission_type === activeCategory &&
    (showHistory ? q.status === "claimed" : q.status !== "claimed")
  );

  // Render Category Watermark
  const renderWatermark = (type: string) => {
    switch (type) {
      case "tutorial":
        return <WatermarkTutorial />;
      case "archon":
        return <WatermarkArchon />;
      case "world":
        return <WatermarkWorld />;
      case "milestone":
        return <WatermarkMilestone />;
      default:
        return <WatermarkTutorial />;
    }
  };

  // Get Difficulty Badge Class
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Novice":
        return "bg-green-100 text-green-700 border-green-200";
      case "Medium":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Advanced":
        return "bg-[#c9a84c]/10 text-[#b08d3a] border-[#c9a84c]/30";
      case "Expert":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Legendary":
        return "bg-purple-100 text-purple-700 border-purple-200 animate-pulse";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <main className="w-full h-[calc(100vh-64px)] bg-[#fcfaf4] relative flex overflow-hidden text-gray-900 font-sans selection:bg-[#c9a84c]/20">
      


      {/* ======================================================== */}
      {/* CATEGORY LEFT PANEL (FITS CLOSELY NEXT TO LIST) */}
      {/* ======================================================== */}
      <div className="w-[72px] h-full shrink-0 border-r border-[#ece0c0] flex flex-col items-center py-8 gap-5 bg-[#fbf9f2]">
        
        {/* Tutorial Category */}
        <button 
          onClick={() => setActiveCategory("tutorial")}
          className={`relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
            activeCategory === "tutorial" 
              ? "bg-[#c9a84c] text-white shadow-md shadow-[#c9a84c]/20" 
              : "text-gray-400 hover:text-gray-900 hover:bg-[#ece0c0]/40"
          }`}
          title="Tutorial Quests"
        >
          <span className="material-symbols-outlined text-[24px]">school</span>
          {activeCategory === "tutorial" && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-l" />
          )}
        </button>

        {/* Archon Category */}
        <button 
          onClick={() => setActiveCategory("archon")}
          className={`relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
            activeCategory === "archon" 
              ? "bg-[#c9a84c] text-white shadow-md shadow-[#c9a84c]/20" 
              : "text-gray-400 hover:text-gray-900 hover:bg-[#ece0c0]/40"
          }`}
          title="Archon Quests"
        >
          <span className="material-symbols-outlined text-[24px]">diamond</span>
          {activeCategory === "archon" && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-l" />
          )}
        </button>

        {/* World Category */}
        <button 
          onClick={() => setActiveCategory("world")}
          className={`relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
            activeCategory === "world" 
              ? "bg-[#c9a84c] text-white shadow-md shadow-[#c9a84c]/20" 
              : "text-gray-400 hover:text-gray-900 hover:bg-[#ece0c0]/40"
          }`}
          title="World Quests"
        >
          <span className="material-symbols-outlined text-[24px]">public</span>
          {activeCategory === "world" && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-l" />
          )}
        </button>

        {/* Milestone Category */}
        <button 
          onClick={() => setActiveCategory("milestone")}
          className={`relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
            activeCategory === "milestone" 
              ? "bg-[#c9a84c] text-white shadow-md shadow-[#c9a84c]/20" 
              : "text-gray-400 hover:text-gray-900 hover:bg-[#ece0c0]/40"
          }`}
          title="Milestone Quests"
        >
          <span className="material-symbols-outlined text-[24px]">stars</span>
          {activeCategory === "milestone" && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-l" />
          )}
        </button>

      </div>

      {/* ======================================================== */}
      {/* MAIN CONTENT BLOCK */}
      {/* ======================================================== */}
      <div className="flex-1 h-full flex flex-col overflow-hidden relative">

        {/* Dynamic Telemetry Header Widget */}
        <header className="w-full flex justify-between items-center px-12 py-6 shrink-0 border-b border-[#ece0c0]/40">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] shadow-sm">
              <span className="material-symbols-outlined text-[20px]">explore</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black tracking-widest text-[#c9a84c] uppercase">Intelligence OS</span>
              <h1 className="font-display font-black text-2xl tracking-tight text-gray-900 leading-none">Journal Quests</h1>
            </div>
          </div>

          {/* User Live Balance widgets */}
          <div className="flex items-center gap-6">
            
            {/* Level and Title Indicator */}
            <div className="hidden md:flex flex-col text-right shrink-0">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-[9px] font-bold bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#b08d3a] px-2 py-0.5 rounded uppercase tracking-wider">
                  {userTitle}
                </span>
                <span className="font-display font-extrabold text-sm text-gray-800">Lvl {userLevel}</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">Cognitive Tier</span>
            </div>

            <div className="h-6 w-px bg-[#ece0c0]/60 hidden md:block" />

            {/* Credits / Coins balance */}
            <div className="flex items-center gap-2.5 bg-[#fbf9f2] border border-[#ece0c0] py-1.5 px-4 rounded-full shadow-sm hover:shadow transition-shadow">
              <span className="material-symbols-outlined text-[#8a9ba8] text-[20px] fill-current animate-pulse">toll</span>
              <div className="flex flex-col items-start leading-none">
                <span className="font-display font-black text-base text-gray-900">{userCoins.toLocaleString()}</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Credits</span>
              </div>
            </div>

            {/* Experience widget */}
            <div className="flex items-center gap-2.5 bg-[#fbf9f2] border border-[#ece0c0] py-1.5 px-4 rounded-full shadow-sm hover:shadow transition-shadow">
              <span className="material-symbols-outlined text-[#c9a84c] text-[20px] fill-current">emoji_events</span>
              <div className="flex flex-col items-start leading-none">
                <span className="font-display font-black text-base text-gray-900">{userXp.toLocaleString()}</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Exp</span>
              </div>
            </div>

          </div>

        </header>

        {/* Quest layout grid */}
        <div className="flex flex-1 w-full overflow-hidden">

          {/* ======================================================== */}
          {/* MIDDLE COLUMN: QUEST LIST (BLENDS INTO BACKGROUND) */}
          {/* ======================================================== */}
          <div className="w-[380px] h-full flex flex-col border-r border-[#ece0c0]/60 overflow-y-auto shrink-0 pb-20 custom-scrollbar">
            
            {/* Header category name display */}
            <div className="px-8 pt-6 pb-2 flex justify-between items-center shrink-0">
              <div className="text-left">
                <h2 className="text-[10px] font-extrabold text-[#b08d3a] tracking-[0.2em] uppercase mb-1">
                  {showHistory ? `${activeCategory} Logs` : `${activeCategory} Quests`}
                </h2>
                <span className="text-xs text-gray-400 font-medium">
                  {showHistory 
                    ? `${displayedQuests.length} Completed objectives`
                    : `${displayedQuests.length} Active target objectives`}
                </span>
              </div>
              
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  showHistory 
                    ? "bg-[#c9a84c] text-white shadow-sm shadow-[#c9a84c]/20" 
                    : "text-gray-400 hover:text-gray-700 hover:bg-[#ece0c0]/30"
                }`}
                title={showHistory ? "Show Active Quests" : "Show Completed Quest Logs"}
              >
                <span className="material-symbols-outlined text-[20px]">history_edu</span>
              </button>
            </div>

            {/* List entries */}
            <div className="flex flex-col w-full mt-4">
              {loading ? (
                // Shimmer Loaders
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="mx-6 py-4 border-b border-[#ece0c0]/30 animate-pulse flex flex-col gap-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))
              ) : displayedQuests.length === 0 ? (
                <div className="text-gray-400 text-sm italic py-12 px-8 text-left">
                  {showHistory 
                    ? "No completed objectives recorded in this segment." 
                    : "No active objectives loaded for this segment."}
                </div>
              ) : (
                displayedQuests.map((quest) => {
                  const isSelected = selectedQuestId === quest.id;
                  const isAnimating = quest.id === animatingQuestId;
                  
                  return (
                    <div
                      key={quest.id}
                      onClick={() => setSelectedQuestId(quest.id)}
                      className={`group relative flex flex-col justify-center py-4 px-8 cursor-pointer transition-all duration-300 select-none border-b border-[#ece0c0]/20 ${
                        isSelected 
                          ? "bg-[#ece0c0]/30" // Elegant soft highlight
                          : "hover:bg-[#ece0c0]/10"
                      } ${isAnimating ? "quest-exit-animation" : ""}`}
                    >
                      {/* Left side golden active indicator strip */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#c9a84c] rounded-r animate-heightGrow" />
                      )}

                      {/* Header line of row */}
                      <div className="flex items-center justify-between w-full gap-2 mb-1.5">
                        
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Quest indicator dot */}
                          <div className="shrink-0 flex items-center justify-center">
                            {quest.status === "claimed" ? (
                              <div className="w-5 h-5 rounded-full bg-[#c9a84c] flex items-center justify-center shadow-[0_0_10px_rgba(201,168,76,0.2)]">
                                <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                              </div>
                            ) : quest.status === "claimable" ? (
                              <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-50/50">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                              </div>
                            ) : quest.status === "locked" ? (
                              <span className="material-symbols-outlined text-gray-400 text-[18px]">lock</span>
                            ) : (
                              // Active circle with current progress
                              <div className="w-5 h-5 rounded-full border-2 border-[#ece0c0] flex items-center justify-center group-hover:border-[#c9a84c]/50 transition-colors">
                                <div className="w-1.5 h-1.5 bg-[#c9a84c]/30 group-hover:bg-[#c9a84c] rounded-full transition-colors" />
                              </div>
                            )}
                          </div>

                          <h3 className={`font-bold text-sm text-gray-800 truncate tracking-tight transition-all ${
                            isSelected ? "text-gray-950 font-extrabold" : "group-hover:text-gray-900"
                          } ${quest.status === "claimed" ? "line-through text-gray-400 font-normal" : ""} ${isAnimating ? "quest-line-through" : ""}`}>
                            {quest.title}
                          </h3>
                        </div>

                        {/* XP Amount display */}
                        <span className={`text-[10px] font-black tracking-wider shrink-0 transition-colors ${
                          isSelected ? "text-[#b08d3a]" : "text-gray-400 group-hover:text-gray-600"
                        }`}>
                          +{quest.xp_reward} XP
                        </span>

                      </div>

                      {/* Objective status subtitle */}
                      <div className="flex items-center justify-between w-full pl-7.5">
                        <span className="text-[11px] text-gray-400 font-medium truncate max-w-[200px]">
                          {quest.subject} • {quest.difficulty}
                        </span>
                        
                        {/* Progress display (e.g. 0/1) */}
                        {quest.status !== "claimed" && quest.status !== "locked" && (
                          <span className="text-[10px] font-extrabold text-[#c9a84c]">
                            {quest.progress_value} / {quest.target_value}
                          </span>
                        )}
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: QUEST DETAILS PANEL */}
          {/* ======================================================== */}
          <div className="flex-1 h-full flex flex-col relative pl-12 pr-12 py-10 overflow-y-auto pb-24 custom-scrollbar bg-gradient-to-r from-transparent to-[#fdfcf9]">
            
            {/* Background creative SVG Watermark */}
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none opacity-40 z-0">
              {renderWatermark(activeCategory)}
            </div>

            {activeQuest ? (
              <div className="flex flex-col z-10 w-full text-left relative">
                
                {/* TOP DETAIL BLOCK */}
                <div className="flex flex-col">
                  
                  {/* Category breadcrumb */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black bg-[#f2ebcc] border border-[#ece0c0] text-[#b08d3a] px-3 py-1 rounded uppercase tracking-[0.2em] shadow-sm">
                      {activeCategory} Quest
                    </span>
                    <span className={`text-[10px] font-bold border px-2 py-0.5 rounded ${getDifficultyBadge(activeQuest.difficulty)}`}>
                      {activeQuest.difficulty}
                    </span>
                  </div>

                  {/* Large Quest Title */}
                  <h1 className="font-display font-black text-4xl text-gray-900 leading-tight tracking-tight mb-2">
                    {activeQuest.title}
                  </h1>

                  {/* Target subject metadata */}
                  <div className="flex items-center gap-1.5 text-[#b08d3a] mb-6">
                    <span className="material-symbols-outlined text-[20px] fill-current animate-pulse">play_arrow</span>
                    <span className="font-extrabold text-sm tracking-wide">
                      Target: {activeQuest.subject} ({activeQuest.progress_value} of {activeQuest.target_value} completed)
                    </span>
                  </div>

                  {/* High Line-Height Lore Description */}
                  <p className="text-[#697585] text-[15px] font-medium leading-relaxed w-full mb-8 select-text">
                    {activeQuest.description}
                  </p>

                  {/* TELEMETRY COMPLIANCE PROGRESS METER */}
                  <div className="w-full bg-[#fbf9f2] border border-[#ece0c0] rounded-2xl p-5 shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                        Telemetry Compliance Meter
                      </span>
                      <span className="text-xs font-black text-[#c9a84c]">
                        {activeQuest.progress_pct}%
                      </span>
                    </div>

                    {/* Outer bar */}
                    <div className="w-full h-3 bg-gray-200/80 rounded-full overflow-hidden relative shadow-inner">
                      {/* Dynamic Fill bar */}
                      <div 
                        className="h-full bg-gradient-to-r from-[#e3d19e] to-[#c9a84c] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${activeQuest.progress_pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Dynamic Guidance Instructions Card */}
                  {(() => {
                    const instructions = getQuestInstructions(activeQuest.target_metric);
                    if (!instructions) return null;
                    return (
                      <div className="w-full bg-[#fbf9f2] border border-[#ece0c0] rounded-2xl p-5 shadow-sm mb-6 flex flex-col justify-start text-left">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full animate-pulse" />
                          SYSTEM INSTRUCTION
                        </span>
                        <p className="text-gray-700 text-sm font-medium leading-relaxed">
                          {instructions}
                        </p>
                      </div>
                    );
                  })()}

                </div>

                {/* BOTTOM BLOCK: REWARDS & CLAIM INTERFACE */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mt-12 w-full">

                  {/* Rewards items */}
                  <div className="flex-1">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#a1a1aa] mb-3">
                      Quest Rewards
                    </h4>
                    
                    <div className="flex items-center gap-4 flex-wrap">
                      {activeQuest.rewards.map((reward, index) => (
                        <div 
                          key={index} 
                          className={`group/card relative w-[100px] h-[120px] rounded-2xl bg-white border border-[#ece0c0]/60 flex flex-col justify-between overflow-hidden cursor-help transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c9a84c] ${reward.rarityGlow}`}
                        >
                          {/* Colored top-glow strip */}
                          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: reward.color }} />

                          {/* Icon representation */}
                          <div className="flex-1 flex items-center justify-center pt-3">
                            <span 
                              className="material-symbols-outlined text-[32px] transition-all duration-300 group-hover/card:scale-110 group-hover/card:rotate-6"
                              style={{ color: reward.color, fontVariationSettings: "'FILL' 1" }}
                            >
                              {reward.icon}
                            </span>
                          </div>

                          {/* Label values footer */}
                          <div className="py-2 w-full text-center border-t border-[#ece0c0]/30 bg-[#fdfcf9] group-hover/card:bg-[#fbf9f2] transition-colors">
                            <span className="text-[11px] font-extrabold text-gray-700 tracking-tight block leading-none mb-0.5">
                              {reward.amount.toLocaleString()}
                            </span>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">
                              {reward.label}
                            </span>
                          </div>

                          {/* Hover Tooltip Info */}
                          <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-sm opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-center text-center">
                            <span className="text-white font-extrabold text-[10px] uppercase tracking-wider mb-1" style={{ color: reward.color }}>
                              {reward.label}
                            </span>
                            <span className="text-gray-300 text-[9px] leading-tight font-medium">
                              {reward.type === "xp" 
                                ? "Improves study Level rank." 
                                : reward.type === "coins" 
                                ? "KC for shop marketplace items." 
                                : "Anticipated legendary mystery Relic."}
                            </span>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive claim actions (mb-12 to lift it slightly up) */}
                  <div className="flex items-center gap-4 mb-2 shrink-0">
                    
                    {activeQuest.status === "claimable" && (
                      <button 
                        onClick={() => handleClaimReward(activeQuest)}
                        className="relative px-12 py-4 bg-gradient-to-r from-[#c9a84c] to-[#b08d3a] text-white font-bold text-xs rounded-xl tracking-[0.2em] transition-all duration-300 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 uppercase hover:shadow-[0_8px_30px_rgba(201,168,76,0.4)] shadow-[0_0_20px_rgba(201,168,76,0.5)] border border-[#c9a84c] overflow-hidden group/claimBtn"
                      >
                        {/* Dynamic sweep sheen on button */}
                        <div className="absolute inset-0 w-[50%] h-full bg-white/20 skew-x-12 translate-x-[-150%] group-hover/claimBtn:translate-x-[250%] transition-transform duration-1000 ease-out" />
                        <span className="material-symbols-outlined text-[18px] animate-bounce">emoji_events</span>
                        Claim Rewards
                      </button>
                    )}

                    {activeQuest.status === "active" && (
                      <button 
                        onClick={() => handleNavigate(activeQuest.link)}
                        className="px-12 py-4 bg-white hover:bg-[#fbf9f2] text-gray-800 border border-[#ece0c0] font-bold text-xs rounded-xl tracking-[0.2em] transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95 flex items-center justify-center gap-2 uppercase group"
                      >
                        Navigate
                        <span className="material-symbols-outlined text-[16px] text-gray-400 group-hover:text-gray-800 transition-all group-hover:translate-x-1">
                          arrow_forward
                        </span>
                      </button>
                    )}

                    {activeQuest.status === "locked" && (
                      <div className="px-12 py-4 bg-gray-100 text-gray-400 font-bold text-xs rounded-xl tracking-[0.2em] border border-gray-200 flex items-center justify-center gap-2 uppercase cursor-not-allowed">
                        <span className="material-symbols-outlined text-[16px]">lock</span>
                        Locked
                      </div>
                    )}

                    {activeQuest.status === "claimed" && (
                      <div className="flex items-center gap-2 text-emerald-500 font-extrabold text-xs tracking-[0.25em] uppercase bg-emerald-50 border border-emerald-200 py-3.5 px-10 rounded-xl shadow-sm">
                        <span className="material-symbols-outlined text-[18px] fill-current">check_circle</span>
                        Completed & Claimed
                      </div>
                    )}

                    {/* Category quick information tips */}
                    <div className="hidden lg:flex items-center gap-2 text-gray-400 text-[11px] font-medium max-w-[300px] leading-tight ml-4">
                      <span className="material-symbols-outlined text-[16px] shrink-0 text-[#c9a84c]">info</span>
                      <span>Telemetry is monitored automatically. Completing activities updates quest states.</span>
                    </div>

                  </div>

                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full text-gray-400 italic gap-3">
                <span className="material-symbols-outlined text-[48px] text-gray-300">explore</span>
                Select a target objective from the sidebar list to inspect curriculum metrics.
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Embedded CSS styling for key animations */}
      <style jsx global>{`
        @keyframes toastSlideIn {
          0% { transform: translate(-50%, -30px); opacity: 0; scale: 0.9; }
          100% { transform: translate(-50%, 0); opacity: 1; scale: 1; }
        }
        @keyframes badgePop {
          0% { transform: scale(0.3) rotate(-30deg); opacity: 0; }
          70% { transform: scale(1.1) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes heightGrow {
          0% { height: 0; }
          100% { height: 60%; }
        }
        .animate-toastSlideIn {
          animation: toastSlideIn 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .animate-badgePop {
          animation: badgePop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-heightGrow {
          animation: heightGrow 0.3s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
        }
        .shine-overlay {
          background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
          transform: translateX(-100%);
          animation: fastSheen 3.5s infinite ease-in-out;
        }
        @keyframes fastSheen {
          0% { transform: translateX(-100%); }
          40% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes lineStrike {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes fadeCollapse {
          0% { opacity: 1; transform: scale(1); max-height: 120px; padding-top: 16px; padding-bottom: 16px; }
          40% { opacity: 0; transform: scale(0.95); max-height: 120px; padding-top: 16px; padding-bottom: 16px; }
          100% { opacity: 0; transform: scale(0.9); max-height: 0px; padding-top: 0px; padding-bottom: 0px; border-bottom-width: 0px; overflow: hidden; margin-top: 0px; margin-bottom: 0px; }
        }
        .quest-line-through {
          position: relative;
        }
        .quest-line-through::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 55%;
          height: 1.5px;
          background-color: #c9a84c;
          transform: scaleX(0);
          transform-origin: left;
          animation: lineStrike 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .quest-exit-animation {
          animation: fadeCollapse 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;
          pointer-events: none;
        }
        /* Custom scrollbar adjustments */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ece0c0;
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c9a84c;
        }
      `}</style>

    </main>
  );
}