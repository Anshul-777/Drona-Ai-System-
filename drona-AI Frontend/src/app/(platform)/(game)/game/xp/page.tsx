"use client";

import { useEffect, useState, useMemo } from "react";
import { storageAdapter } from "@/lib/storageAdapter";
import { createClient } from "@/lib/supabase/client";

// Define TypeScript interfaces for structural stability
interface XPLog {
  id: string;
  action: string;
  xp: number;
  category: "Drills" | "Missions" | "Arena" | "Daily" | "Streaks";
  time: string;
  date: string; // YYYY-MM-DD format
  icon: string;
  details: string;
}

interface HeatmapDay {
  dateStr: string;
  date: Date;
  count: number;
  activities: Array<{ action: string; xp: number }>;
}

interface StreakMilestone {
  id: string;
  days: number;
  xpReward: number;
  status: "locked" | "claimable" | "claimed";
  description: string;
}

export default function XPAndStreaksPage() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<XPLog[]>([]);
  const [heatmapDays, setHeatmapDays] = useState<{ [key: string]: { count: number; activities: Array<{ action: string; xp: number }> } }>(() => {
    const initialHeatmap: { [key: string]: { count: number; activities: Array<{ action: string; xp: number }> } } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 167; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      initialHeatmap[dateStr] = { count: 0, activities: [] };
    }
    return initialHeatmap;
  });

  // Real Profile Sync & Mutable local states for rich visual sandbox interactions
  const [localXpTotal, setLocalXpTotal] = useState(0);
  const [ign, setIgn] = useState("Scholar");
  
  // Derived local progress variables
  const localLevel = useMemo(() => Math.floor(localXpTotal / 1000) + 1, [localXpTotal]);
  const localXp = useMemo(() => localXpTotal % 1000, [localXpTotal]);
  const localXpMax = 1000;
  
  // Game mechanics states (synced with db)
  const [streakDays, setStreakDays] = useState(0);
  const [streakFreezes, setStreakFreezes] = useState(2);
  const [streakShieldActive, setStreakShieldActive] = useState(false);
  const [boostActive, setBoostActive] = useState(false);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0); // in seconds
  
  // Milestone state management
  const [milestones, setMilestones] = useState<StreakMilestone[]>([
    { id: "seven-streak", days: 7, xpReward: 300, status: "locked", description: "Maintain a study streak for 7 consecutive days." },
    { id: "fourteen-streak", days: 14, xpReward: 500, status: "locked", description: "Maintain a study streak for 14 consecutive days." },
    { id: "thirty-streak", days: 30, xpReward: 1000, status: "locked", description: "Maintain a study streak for 30 consecutive days." },
    { id: "fifty-streak", days: 50, xpReward: 2000, status: "locked", description: "Maintain a study streak for 50 consecutive days." }
  ]);
  
  // Ledger and Heatmap navigation states
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [ledgerFilter, setLedgerFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  
  // Tooltip UI state
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Toast notifications
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  
  // Cooldown tracker for daily login
  const [loginClaimedToday, setLoginClaimedToday] = useState(false);

  const themeHex = "#c9a84c"; // Gold theme accent

  // Fetch real profile details, streaks, and ledger logs from the database
  const fetchUser = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // 1. Fetch profiles table details
      const { data: profile } = await supabase
        .from("profiles")
        .select("xp_total, level, rank_title, full_name, email")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setLocalXpTotal(profile.xp_total || 0);
        const metadataIgn = session.user.user_metadata?.ign;
        setIgn(metadataIgn ? metadataIgn.toUpperCase() : (profile.full_name || profile.email.split("@")[0].toUpperCase()));
      }

      // 2. Fetch streaks table details for 'daily_login'
      const { data: userStreak } = await supabase
        .from("streaks")
        .select("current_count, last_active_date")
        .eq("user_id", session.user.id)
        .eq("streak_type", "daily_login")
        .maybeSingle();

      let currentStreak = 0;
      if (userStreak) {
        currentStreak = userStreak.current_count || 0;
        const todayStr = new Date().toISOString().split("T")[0];
        setLoginClaimedToday(userStreak.last_active_date === todayStr);
        setStreakDays(currentStreak);
      } else {
        setStreakDays(0);
        setLoginClaimedToday(false);
      }

      // 3. Fetch achievements for milestones mapping
      const achData = await storageAdapter.getUserAchievements();
      const claimedIds = achData.claimed || [];

      setMilestones([
        { id: "seven-streak", days: 7, xpReward: 300, status: claimedIds.includes("seven-streak") ? "claimed" : (currentStreak >= 7 ? "claimable" : "locked"), description: "Maintain a study streak for 7 consecutive days." },
        { id: "fourteen-streak", days: 14, xpReward: 500, status: claimedIds.includes("fourteen-streak") ? "claimed" : (currentStreak >= 14 ? "claimable" : "locked"), description: "Maintain a study streak for 14 consecutive days." },
        { id: "thirty-streak", days: 30, xpReward: 1000, status: claimedIds.includes("thirty-streak") ? "claimed" : (currentStreak >= 30 ? "claimable" : "locked"), description: "Maintain a study streak for 30 consecutive days." },
        { id: "fifty-streak", days: 50, xpReward: 2000, status: claimedIds.includes("fifty-streak") ? "claimed" : (currentStreak >= 50 ? "claimable" : "locked"), description: "Maintain a study streak for 50 consecutive days." }
      ]);

      // 4. Fetch real XP logs from the database
      const { data: ledgerData } = await supabase
        .from("xp_ledger")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (ledgerData) {
        const mappedLogs: XPLog[] = ledgerData.map((item: any) => {
          const dateObj = new Date(item.created_at);
          const dateStr = dateObj.toISOString().split("T")[0];
          
          let category: "Drills" | "Missions" | "Arena" | "Daily" | "Streaks" = "Drills";
          let icon = "quiz";
          
          if (item.transaction_type === "daily_challenge" || item.transaction_type === "earned" || item.transaction_type === "daily_login") {
            category = "Daily";
            icon = "login";
          } else if (item.transaction_type === "streak") {
            category = "Streaks";
            icon = "local_fire_department";
          } else if (item.transaction_type === "mission") {
            category = "Missions";
            icon = "flag";
          } else if (item.transaction_type === "boss_battle") {
            category = "Arena";
            icon = "swords";
          }
          
          return {
            id: item.id,
            action: item.description || "XP Credited",
            xp: item.amount || 0,
            category,
            time: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            date: dateStr,
            icon: item.source === "socratic" ? "lightbulb" : icon,
            details: item.description || `Points transaction hash tx_${item.id}`
          };
        });

        setLogs(mappedLogs);

        // Populate heatmap with real data
        const updatedHeatmap: { [key: string]: { count: number; activities: Array<{ action: string; xp: number }> } } = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 167; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];
          updatedHeatmap[dateStr] = { count: 0, activities: [] };
        }

        mappedLogs.forEach(log => {
          if (updatedHeatmap[log.date]) {
            updatedHeatmap[log.date].count += log.xp;
            updatedHeatmap[log.date].activities.push({ action: log.action, xp: log.xp });
          }
        });

        setHeatmapDays(updatedHeatmap);
      }
    } catch (err) {
      console.error("Error loading profile gamification data:", err);
    }
  };

  // Fetch real profile details and streaks upon mounting
  useEffect(() => {
    setMounted(true);
    fetchUser();
  }, []);

  // Timer effect for XP Boost
  useEffect(() => {
    if (!boostActive || boostTimeLeft <= 0) {
      if (boostActive && boostTimeLeft === 0) {
        setBoostActive(false);
        showToast("XP Boost has expired.");
      }
      return;
    }
    
    const interval = setInterval(() => {
      setBoostTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [boostActive, boostTimeLeft]);

  // Toast triggers
  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };

  useEffect(() => {
    if (!toast.visible) return;
    const t = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
    return () => clearTimeout(t);
  }, [toast.visible]);

  // Heatmap structuring: 24 weeks of 7-day grids
  const weeksGrid = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const list: HeatmapDay[] = [];
    for (let i = 167; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const data = heatmapDays[dateStr] || { count: 0, activities: [] };
      list.push({
        dateStr,
        date: d,
        count: data.count,
        activities: data.activities
      });
    }
    
    const grid: HeatmapDay[][] = [];
    for (let i = 0; i < 24; i++) {
      grid.push(list.slice(i * 7, (i + 1) * 7));
    }
    return grid;
  }, [heatmapDays]);

  // Aggregate category metrics
  const categoryStats = useMemo(() => {
    let drills = 0, missions = 0, arena = 0, daily = 0;
    logs.forEach(l => {
      if (l.category === "Drills") drills += l.xp;
      else if (l.category === "Missions") missions += l.xp;
      else if (l.category === "Arena") arena += l.xp;
      else daily += l.xp;
    });
    const total = drills + missions + arena + daily || 1;
    return [
      { name: "Mock Drills", xp: drills, percentage: Math.round((drills / total) * 100), color: "#c9a84c" },
      { name: "Arena Battles", xp: arena, percentage: Math.round((arena / total) * 100), color: "#1a1a24" },
      { name: "Missions & Quests", xp: missions, percentage: Math.round((missions / total) * 100), color: "#6b7280" },
      { name: "Daily Logins", xp: daily, percentage: Math.round((daily / total) * 100), color: "#d1d5db" }
    ];
  }, [logs]);

  // Filter logs for the data ledger
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (selectedDate && log.date !== selectedDate) return false;
      if (ledgerFilter !== "All" && log.category !== ledgerFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return log.action.toLowerCase().includes(query) || log.details.toLowerCase().includes(query);
      }
      return true;
    });
  }, [logs, selectedDate, ledgerFilter, searchQuery]);

  // Helper to calculate days difference
  const getDaysDifference = (date1Str: string, date2Str: string) => {
    const d1 = new Date(date1Str);
    const d2 = new Date(date2Str);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Interactive functions - updates real Supabase database
  const addXP = async (amount: number) => {
    const multiplier = boostActive ? 2 : 1;
    const finalAmount = amount * multiplier;
    const nextXpTotal = localXpTotal + finalAmount;
    
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const nextLevel = Math.floor(nextXpTotal / 1000) + 1;
        let rankTitle = "Recruit";
        if (nextLevel >= 5) rankTitle = "Adept";
        if (nextLevel >= 10) rankTitle = "Scholar";
        if (nextLevel >= 25) rankTitle = "Master";
        if (nextLevel >= 50) rankTitle = "Grandmaster";

        await supabase
          .from("profiles")
          .update({
            xp_total: nextXpTotal,
            level: nextLevel,
            rank_title: rankTitle,
            updated_at: new Date().toISOString()
          })
          .eq("id", session.user.id);

        // Record real ledger transaction
        await supabase
          .from("xp_ledger")
          .insert({
            user_id: session.user.id,
            amount: finalAmount,
            transaction_type: "daily_challenge",
            description: "Daily login check-in reward" + (boostActive ? " (2.0x Boost)" : ""),
            balance_after: nextXpTotal
          });
      }
      
      setLocalXpTotal(nextXpTotal);
      
      // Level Up check
      const oldLevel = Math.floor(localXpTotal / 1000) + 1;
      const newLevel = Math.floor(nextXpTotal / 1000) + 1;
      if (newLevel > oldLevel) {
        showToast(`LEVEL UP! You reached Level ${newLevel}!`);
      }

      await fetchUser();
    } catch (e: any) {
      showToast("Error updating XP: " + e.message);
    }
  };

  const simulateLogin = async () => {
    if (loginClaimedToday) {
      showToast("You have already checked in for today.");
      return;
    }
    
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        showToast("User not authenticated.");
        return;
      }

      const userId = session.user.id;
      const todayStr = new Date().toISOString().split("T")[0];

      // Read current streak
      const { data: userStreak } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", userId)
        .eq("streak_type", "daily_login")
        .maybeSingle();

      let newStreakCount = 1;
      let longestEver = 1;
      let isInsert = false;

      if (userStreak) {
        if (userStreak.last_active_date === todayStr) {
          showToast("You have already checked in for today.");
          setLoginClaimedToday(true);
          return;
        }
        
        // Calculate days difference
        const lastDate = userStreak.last_active_date;
        const diff = getDaysDifference(lastDate, todayStr);
        
        if (diff === 1) {
          newStreakCount = (userStreak.current_count || 0) + 1;
          longestEver = Math.max(userStreak.longest_ever || 0, newStreakCount);
        } else {
          newStreakCount = 1;
          longestEver = userStreak.longest_ever || 1;
        }
      } else {
        isInsert = true;
      }

      // Write streak to database
      if (isInsert) {
        const { error: insertErr } = await supabase
          .from("streaks")
          .insert({
            user_id: userId,
            streak_type: "daily_login",
            current_count: 1,
            longest_ever: 1,
            last_active_date: todayStr,
            is_active: true,
            started_at: todayStr,
            broken_count: 0
          });
        if (insertErr) throw insertErr;
      } else {
        const { error: updateErr } = await supabase
          .from("streaks")
          .update({
            current_count: newStreakCount,
            longest_ever: longestEver,
            last_active_date: todayStr,
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", userId)
          .eq("streak_type", "daily_login");
        if (updateErr) throw updateErr;
      }

      // Award daily check-in XP
      await addXP(15);
      
      setStreakDays(newStreakCount);
      setLoginClaimedToday(true);
      
      // Proactively update milestones status in case they became claimable
      setMilestones(prev => prev.map(m => {
        if (m.status === "locked" && newStreakCount >= m.days) {
          return { ...m, status: "claimable" };
        }
        return m;
      }));

      showToast(`Checked in successfully! +${boostActive ? 30 : 15} XP rewarded. Streak extended to ${newStreakCount} days.`);
      
      await fetchUser();
    } catch (err: any) {
      showToast("Error checking in: " + err.message);
    }
  };

  const buyStreakFreeze = async () => {
    const cost = 200;
    if (localXpTotal < cost) {
      showToast("Insufficient XP to purchase a Streak Freeze. Earn more XP first.");
      return;
    }
    
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      const nextXpTotal = localXpTotal - cost;
      const nextLevel = Math.floor(nextXpTotal / 1000) + 1;
      let rankTitle = "Recruit";
      if (nextLevel >= 5) rankTitle = "Adept";
      if (nextLevel >= 10) rankTitle = "Scholar";
      
      const { error } = await supabase
        .from("profiles")
        .update({
          xp_total: nextXpTotal,
          level: nextLevel,
          rank_title: rankTitle
        })
        .eq("id", session.user.id);
        
      if (error) throw error;
      
      setLocalXpTotal(nextXpTotal);
      setStreakFreezes(prev => prev + 1);
      showToast("Streak Freeze purchased successfully for 200 XP!");

      await fetchUser();
    } catch (err: any) {
      showToast("Failed to purchase freeze: " + err.message);
    }
  };

  const toggleStreakShield = () => {
    if (streakShieldActive) {
      setStreakShieldActive(false);
      showToast("Streak shield deactivated.");
    } else {
      if (streakFreezes <= 0) {
        showToast("No Streak Freezes available in your inventory. Purchase one first.");
        return;
      }
      setStreakFreezes(prev => prev - 1);
      setStreakShieldActive(true);
      showToast("Streak shield activated! Your streak is protected from inactivity.");
    }
  };

  const activateXpBoost = () => {
    if (boostActive) {
      showToast("XP Boost is already active!");
      return;
    }
    setBoostActive(true);
    setBoostTimeLeft(600); // 10 minute boost timer
    showToast("2.0x XP Boost activated for 10 minutes!");
  };

  const claimMilestone = async (id: string) => {
    const m = milestones.find(item => item.id === id);
    if (!m || m.status !== "claimable") return;
    
    try {
      await storageAdapter.claimAchievement(id, m.xpReward);
      
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const nextXpTotal = localXpTotal + m.xpReward;
        await supabase
          .from("xp_ledger")
          .insert({
            user_id: session.user.id,
            amount: m.xpReward,
            transaction_type: "achievement",
            description: `Claimed ${m.days}-Day streak milestone reward`,
            balance_after: nextXpTotal
          });
      }
      
      // Update local state XP total and update milestone view
      setLocalXpTotal(prev => prev + m.xpReward);
      setMilestones(prev => prev.map(item => item.id === id ? { ...item, status: "claimed" as const } : item));
      
      showToast(`Claimed ${m.xpReward} XP for the ${m.days}-Day streak milestone!`);

      await fetchUser();
    } catch (err: any) {
      showToast("Failed to claim milestone: " + err.message);
    }
  };

  // UI styling helpers
  const getColorForXp = (xp: number) => {
    if (xp === 0) return "bg-neutral-100 border-neutral-200/40 hover:bg-neutral-200/50";
    if (xp <= 50) return "bg-[#c9a84c]/20 border-[#c9a84c]/10 hover:bg-[#c9a84c]/30";
    if (xp <= 150) return "bg-[#c9a84c]/40 border-[#c9a84c]/20 hover:bg-[#c9a84c]/50";
    if (xp <= 300) return "bg-[#c9a84c]/70 border-[#c9a84c]/30 hover:bg-[#c9a84c]/80";
    return "bg-[#c9a84c] border-[#c9a84c] hover:opacity-90 shadow-[0_0_10px_rgba(201,168,76,0.3)]";
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleDayMouseEnter = (e: React.MouseEvent<HTMLDivElement>, day: HeatmapDay) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const container = e.currentTarget.closest(".heatmap-container");
    if (container) {
      const containerRect = container.getBoundingClientRect();
      setHoveredDay(day);
      setTooltipPosition({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 12
      });
    }
  };

  const handleDayMouseLeave = () => {
    setHoveredDay(null);
  };

  const handleDayClick = (day: HeatmapDay) => {
    if (selectedDate === day.dateStr) {
      setSelectedDate(null);
    } else {
      setSelectedDate(day.dateStr);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#faf9f6]" />;

  const progressPercent = Math.min(100, Math.max(0, (localXp / localXpMax) * 100));

  return (
    <main className="w-full min-h-screen bg-[#faf9f6] relative overflow-hidden flex flex-col items-center pb-24 font-sans text-black selection:bg-[#c9a84c]/30">
      
      {/* ─── Premium Background Graphics ─── */}
      <div className="absolute top-0 w-full h-[550px] overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/10 via-[#c9a84c]/3 to-transparent" />
        <div className="absolute -top-[200px] right-[10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-15 bg-[#c9a84c]" />
        <div className="absolute top-[100px] left-[5%] w-[450px] h-[450px] rounded-full blur-[120px] opacity-10 bg-[#c9a84c]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(90deg, #c9a84c 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
      </div>

      {/* Toast Notification Container */}
      <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl bg-black text-white shadow-2xl border border-neutral-800 transition-all duration-500 transform ${toast.visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-[#c9a84c] text-xl animate-pulse">info</span>
        <span className="font-bold text-sm tracking-wide">{toast.message}</span>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-12 relative z-10 flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] font-black text-neutral-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
            Gamification Engine
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-black tracking-tight leading-none">
                XP & <span className="text-[#c9a84c]">Consistency</span>
              </h1>
              <p className="text-neutral-500 font-medium mt-3 max-w-xl text-sm md:text-base leading-relaxed">
                Maintain study streaks, secure shields to prevent decay, and activate multipliers to optimize your learning velocity.
              </p>
            </div>
            {/* Quick stats indicators */}
            <div className="flex items-center gap-6 border border-neutral-200 bg-white px-6 py-4 rounded-2xl shadow-sm">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Total Accumulation</span>
                <span className="font-mono text-xl font-bold text-black">{localXpTotal.toLocaleString()} XP</span>
              </div>
              <div className="h-8 w-px bg-neutral-200" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Streak Record</span>
                <span className="font-mono text-xl font-bold text-[#c9a84c]">{streakDays} Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Row 1: Key Metrics Ribbon (Full Width, 4 Cards) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Progress Card */}
          <div className="bg-white border border-neutral-200/80 shadow-md hover:shadow-lg transition-all duration-300 rounded-[1.5rem] p-6 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Scholar Progress</span>
              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-[#c9a84c]/10 group-hover:text-[#c9a84c] transition-colors">
                <span className="material-symbols-outlined text-lg">star</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black font-mono">Level {localLevel}</span>
              <span className="text-xs text-neutral-400 font-bold uppercase">({ign})</span>
            </div>
            <div className="w-full mt-2">
              <div className="w-full h-2.5 bg-neutral-100 border border-neutral-200/50 rounded-full overflow-hidden p-0.5 relative">
                <div className="h-full rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${progressPercent}%`, backgroundColor: themeHex }}>
                  <div className="absolute inset-0 bg-white/20 -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 text-[10px] font-bold text-neutral-400 uppercase">
                <span>{localXp.toLocaleString()} XP</span>
                <span>{(localXpMax - localXp).toLocaleString()} XP remaining</span>
              </div>
            </div>
          </div>

          {/* Active Streak Card */}
          <div className="bg-white border border-neutral-200/80 shadow-md hover:shadow-lg transition-all duration-300 rounded-[1.5rem] p-6 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Daily Study Streak</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${loginClaimedToday ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-600 group-hover:bg-[#c9a84c]/10 group-hover:text-[#c9a84c]'}`}>
                <span className="material-symbols-outlined text-lg">local_fire_department</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black font-mono">{streakDays} Days</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${loginClaimedToday ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : 'bg-neutral-50 text-neutral-500 border border-neutral-200/50'}`}>
                {loginClaimedToday ? "Saved Today" : "Awaiting Daily"}
              </span>
            </div>
            <button
              onClick={simulateLogin}
              disabled={loginClaimedToday}
              className={`w-full text-center py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                loginClaimedToday
                  ? "bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed"
                  : "bg-black text-white hover:bg-neutral-900 border-black hover:shadow-md"
              }`}
            >
              {loginClaimedToday ? "Check-in Claimed" : "Trigger Daily Check-in"}
            </button>
          </div>

          {/* Protection Card */}
          <div className="bg-white border border-neutral-200/80 shadow-md hover:shadow-lg transition-all duration-300 rounded-[1.5rem] p-6 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Streak Protection</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${streakShieldActive ? 'bg-[#c9a84c]/10 text-[#c9a84c] animate-pulse' : 'bg-neutral-100 text-neutral-600'}`}>
                <span className="material-symbols-outlined text-lg">shield</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-black font-mono">{streakFreezes} Freezes</span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase">Shield: {streakShieldActive ? "ACTIVE" : "OFF"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={buyStreakFreeze}
                className="py-2.5 bg-white border border-neutral-300 hover:border-black text-black rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:bg-neutral-50"
              >
                Buy (-200 XP)
              </button>
              <button
                onClick={toggleStreakShield}
                disabled={streakFreezes === 0 && !streakShieldActive}
                className={`py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                  streakShieldActive
                    ? "bg-[#c9a84c] border-[#c9a84c] text-white hover:bg-[#b3923a]"
                    : streakFreezes === 0
                      ? "bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed"
                      : "bg-black text-white hover:bg-neutral-900 border-black"
                }`}
              >
                {streakShieldActive ? "Deactivate" : "Equip"}
              </button>
            </div>
          </div>

          {/* Multiplier Card */}
          <div className="bg-white border border-neutral-200/80 shadow-md hover:shadow-lg transition-all duration-300 rounded-[1.5rem] p-6 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Socratic Multiplier</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${boostActive ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'bg-neutral-100 text-neutral-600'}`}>
                <span className="material-symbols-outlined text-lg">offline_bolt</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-black font-mono">{boostActive ? "2.0x Boost" : "1.0x Regular"}</span>
              {boostActive && (
                <span className="text-xs text-[#c9a84c] font-black font-mono animate-pulse">
                  {formatTime(boostTimeLeft)}
                </span>
              )}
            </div>
            <button
              onClick={activateXpBoost}
              className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                boostActive
                  ? "bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed"
                  : "bg-black text-white hover:bg-neutral-900 border-black hover:shadow-md"
              }`}
            >
              {boostActive ? "XP Potion Active" : "Drink XP Potion (10m)"}
            </button>
          </div>
        </div>

        {/* ─── Row 2: Heatmap & Milestones Section (Fill Width Grid) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: 24-Week Heatmap (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow heatmap-container relative">
            
            {/* Hover Tooltip Box */}
            {hoveredDay && (
              <div
                className="absolute z-30 pointer-events-none px-3.5 py-2.5 bg-black text-white border border-neutral-800 rounded-xl shadow-xl flex flex-col gap-1 transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y}px`
                }}
              >
                <div className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                  {hoveredDay.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <div className="text-xs font-black text-[#c9a84c]">
                  +{hoveredDay.count} XP Earned
                </div>
                {hoveredDay.activities.length > 0 ? (
                  <div className="text-[9px] text-neutral-300 font-bold border-t border-neutral-800/80 pt-1 mt-1 max-w-[180px] truncate">
                    {hoveredDay.activities[0].action} {hoveredDay.activities.length > 1 && `+${hoveredDay.activities.length - 1} more`}
                  </div>
                ) : (
                  <div className="text-[9px] text-neutral-500 italic border-t border-neutral-800/80 pt-1 mt-1">No activities completed</div>
                )}
                {/* Arrow */}
                <div className="w-2.5 h-2.5 bg-black rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
              </div>
            )}

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-display text-xl font-black text-black flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#c9a84c] text-2xl">calendar_month</span>
                  Daily Activity Matrix
                </h3>
                <p className="text-xs text-neutral-400 font-medium mt-1">
                  Hover over cells to view specific XP logs. Click a cell to filter the Ledger list below.
                </p>
              </div>
              <span className="text-[10px] font-black text-[#c9a84c] bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-3 py-1 rounded-full uppercase tracking-wider">
                Last 168 Days
              </span>
            </div>

            {/* GitHub style Horizontal Calendar Grid */}
            <div className="w-full overflow-x-auto select-none border border-neutral-100 rounded-2xl p-4 bg-neutral-50/50 mb-4">
              <div className="min-w-[500px] flex flex-col gap-1.5">
                
                {/* Month Indicators Header Row */}
                <div className="flex text-[9px] font-black uppercase text-neutral-400 tracking-wider h-4 ml-6 relative">
                  <div className="absolute left-[0%]">Dec</div>
                  <div className="absolute left-[16.6%]">Jan</div>
                  <div className="absolute left-[33.3%]">Feb</div>
                  <div className="absolute left-[50%]">Mar</div>
                  <div className="absolute left-[66.6%]">Apr</div>
                  <div className="absolute left-[83.3%]">May</div>
                </div>

                <div className="flex gap-2">
                  {/* Day of week labels */}
                  <div className="flex flex-col justify-between text-[9px] font-black uppercase text-neutral-400 pr-1 h-[130px] pt-1">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                    <span>Sun</span>
                  </div>

                  {/* Heatmap Weeks Grid */}
                  <div className="flex-1 flex gap-1.5 justify-between">
                    {weeksGrid.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-1.5">
                        {week.map((day) => (
                          <div
                            key={day.dateStr}
                            onClick={() => handleDayClick(day)}
                            onMouseEnter={(e) => handleDayMouseEnter(e, day)}
                            onMouseLeave={handleDayMouseLeave}
                            className={`w-3.5 h-3.5 rounded-sm transition-all cursor-pointer hover:scale-125 border ${
                              day.dateStr === selectedDate
                                ? "border-black scale-110 shadow-[0_0_8px_rgba(201,168,76,0.6)] z-10"
                                : "border-transparent"
                            } ${getColorForXp(day.count)}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Summary & Legend */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2 border-t border-neutral-100 pt-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-neutral-100 border border-neutral-200/40" />
                <div className="w-3 h-3 rounded-sm bg-[#c9a84c]/20 border border-[#c9a84c]/10" />
                <div className="w-3 h-3 rounded-sm bg-[#c9a84c]/40 border border-[#c9a84c]/20" />
                <div className="w-3 h-3 rounded-sm bg-[#c9a84c]/70 border border-[#c9a84c]/30" />
                <div className="w-3 h-3 rounded-sm bg-[#c9a84c]" />
                <span>More</span>
              </div>
              <div className="flex items-center gap-2">
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-[10px] font-bold text-neutral-500 hover:text-black uppercase tracking-wider flex items-center gap-1 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Clear Filter ({selectedDate})
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Selected Date Details Box */}
            {selectedDate && (
              <div className="mt-4 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center justify-between animate-fadeIn z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c]">
                    <span className="material-symbols-outlined">event_available</span>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-400 font-black uppercase tracking-wider">Inspected Date</div>
                    <div className="text-sm font-black text-black">
                      {new Date(selectedDate).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[9px] text-neutral-400 font-black uppercase tracking-wider">XP Earned</div>
                    <div className="text-lg font-mono font-black text-[#c9a84c]">+{heatmapDays[selectedDate]?.count || 0} XP</div>
                  </div>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="w-8 h-8 rounded-full hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Milestone Chests (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <h3 className="font-display text-xl font-black text-black flex items-center gap-2.5 mb-2">
                <span className="material-symbols-outlined text-[#c9a84c] text-2xl">military_tech</span>
                Streak Rewards
              </h3>
              <p className="text-xs text-neutral-400 font-medium mb-6">
                Unlock high-value loot chests by maintaining persistent study streaks.
              </p>
              
              <div className="space-y-3.5">
                {milestones.map((m) => {
                  const isClaimed = m.status === "claimed";
                  const isClaimable = m.status === "claimable";
                  const isLocked = m.status === "locked";
                  
                  return (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                        isClaimed
                          ? "bg-neutral-50/50 border-neutral-200/50 opacity-60"
                          : isClaimable
                            ? "bg-[#c9a84c]/5 border-[#c9a84c]/40 shadow-sm hover:border-[#c9a84c]/80 scale-[1.02]"
                            : "bg-white border-neutral-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                          isClaimed
                            ? "bg-neutral-100 border-neutral-200 text-neutral-400"
                            : isClaimable
                              ? "bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]"
                              : "bg-neutral-50 border-neutral-200 text-neutral-300"
                        }`}>
                          <span className="material-symbols-outlined text-2xl">
                            {isClaimed ? "drafts" : isClaimable ? "redeem" : "lock"}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-black flex items-center gap-1.5">
                            {m.days}-Day Milestone
                            {isClaimable && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-ping" />
                            )}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-medium leading-normal">{m.description}</span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {isClaimed && (
                          <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Claimed</span>
                        )}
                        {isLocked && (
                          <span className="text-[10px] font-black uppercase text-neutral-300 tracking-wider">Locked</span>
                        )}
                        {isClaimable && (
                          <button
                            onClick={() => claimMilestone(m.id)}
                            className="px-4 py-2 bg-black text-white hover:bg-neutral-900 border border-black hover:border-neutral-900 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105"
                          >
                            Claim
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-6 border-t border-neutral-100 pt-4 flex justify-between items-center text-[10px] font-black uppercase text-neutral-400 tracking-wider">
              <span>Next Checkpoint: 7 Days</span>
              <span className="text-black">{streakDays} Days Progress</span>
            </div>
          </div>

        </div>

        {/* ─── Row 3: Breakdown & Transaction Ledger (Fill Width) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: XP Distribution Breakdown (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <h3 className="font-display text-xl font-black text-black flex items-center gap-2.5 mb-2">
                <span className="material-symbols-outlined text-[#c9a84c] text-2xl">donut_small</span>
                Habit Analytics
              </h3>
              <p className="text-xs text-neutral-400 font-medium mb-6">
                Calculated distribution of acquired XP points mapped across categories.
              </p>
              
              <div className="space-y-5">
                {categoryStats.map((stat) => (
                  <div key={stat.name} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-end text-xs font-bold text-neutral-600">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
                        {stat.name}
                      </span>
                      <span className="font-mono text-neutral-400 font-black">
                        {stat.xp.toLocaleString()} XP ({stat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${stat.percentage}%`,
                          backgroundColor: stat.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-neutral-100 pt-4 text-center">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                Distribution computed from past 168 days
              </span>
            </div>
          </div>

          {/* Right Column: Transaction History Ledger (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-[2rem] p-6 md:p-8 flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-display text-xl font-black text-black flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#c9a84c] text-2xl">history</span>
                  Acquisition Ledger
                </h3>
                <p className="text-xs text-neutral-400 font-medium mt-1">
                  Chronological accounting statement of all points credited.
                </p>
              </div>

              {/* Ledger Search Input */}
              <div className="w-full sm:w-64 relative">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-neutral-200 bg-neutral-50/50 focus:bg-white text-xs font-medium rounded-xl outline-none focus:border-black transition-all text-black placeholder-neutral-400"
                />
                <span className="material-symbols-outlined text-neutral-400 absolute left-3 top-2.5 text-base">search</span>
              </div>
            </div>

            {/* Category filtering tabs */}
            <div className="flex flex-wrap gap-2 border-b border-neutral-100 pb-4">
              {["All", "Drills", "Missions", "Arena", "Daily", "Streaks"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLedgerFilter(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                    ledgerFilter === tab
                      ? "bg-black text-white"
                      : "bg-neutral-50 text-neutral-400 border border-neutral-200/50 hover:bg-neutral-100 hover:text-black"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Ledger List */}
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-2">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  
                  return (
                    <div
                      key={log.id}
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className={`p-3.5 border rounded-2xl transition-all duration-300 cursor-pointer ${
                        isExpanded
                          ? "bg-neutral-50 border-neutral-300/80 shadow-inner"
                          : "bg-white border-neutral-100 hover:border-neutral-300/60 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200/50 flex items-center justify-center text-neutral-500">
                            <span className="material-symbols-outlined text-lg">{log.icon}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-black">{log.action}</span>
                            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                              {log.category} • {log.time}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-base font-black text-[#c9a84c]">+{log.xp} XP</span>
                          <span className={`material-symbols-outlined text-neutral-400 transition-transform duration-300 text-lg ${isExpanded ? 'rotate-180' : ''}`}>
                            expand_more
                          </span>
                        </div>
                      </div>

                      {/* Expandable details segment */}
                      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-24 mt-3 pt-3 border-t border-neutral-200/70 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                        <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                          {log.details}
                        </p>
                        <div className="flex justify-between items-center mt-2.5 text-[9px] font-mono font-bold text-neutral-400 uppercase">
                          <span>Transaction Hash: tx_{log.id}</span>
                          <span>Timestamp: {log.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined text-neutral-300 text-4xl mb-3">folder_open</span>
                  <span className="font-bold text-sm text-neutral-500">No acquisition logs found matching filters.</span>
                  <button
                    onClick={() => {
                      setSelectedDate(null);
                      setLedgerFilter("All");
                      setSearchQuery("");
                    }}
                    className="mt-3.5 text-xs text-[#c9a84c] hover:underline font-black uppercase tracking-wider"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-neutral-100 pt-4 flex justify-between items-center text-[10px] font-black uppercase text-neutral-400 tracking-wider">
              <span>Showing {filteredLogs.length} of {logs.length} Entries</span>
              {selectedDate && (
                <span className="text-black">Active Day Filter Enabled</span>
              )}
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}