"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useNotifications } from "@/context/NotificationContext";

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  examTarget: string;
  rankTitle: string;
  isSelf: boolean;
}

export default function LeaderboardPage() {
  const { addNotification } = useNotifications();
  const [mounted, setMounted] = useState(false);
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all-india" | "exam" | "friends">("all-india");
  const [showLoader, setShowLoader] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(false);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  const themeHex = "#c9a84c"; // Gold accent

  // Fetch real data from database
  useEffect(() => {
    setMounted(true);

    const fetchLeaderboard = async () => {
      const startTime = Date.now();
      try {
        setLoading(true);
        const supabase = createClient();

        const addBootLog = (msg: string, delay: number) => {
          return new Promise<void>((resolve) => {
            setTimeout(() => {
              setBootLogs((prev) => [...prev, msg]);
              resolve();
            }, delay);
          });
        };

        await addBootLog("Initializing secure connection to Drona Arena database...", 100);

        // 1. Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        let activeUserId = "";
        let activeUserEmail = "scholar@drona.ai";
        let activeUserIgn = "Scholar";
        
        if (user) {
          activeUserId = user.id;
          activeUserEmail = user.email || "";
          activeUserIgn = user.user_metadata?.ign || user.email?.split("@")[0] || "Scholar";
          
          await addBootLog(`Verifying active authentication credentials: ${activeUserEmail}`, 200);

          const activeUserAvatar = user.user_metadata?.avatar_url || "";

          // Proactively ensure profile exists
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .eq("id", user.id)
            .maybeSingle();

          if (!existingProfile) {
            await addBootLog("WARNING: Telemetry signature missing. Compiling and creating new profile...", 150);
            await supabase.from("profiles").insert({
              id: user.id,
              email: activeUserEmail,
              full_name: activeUserIgn,
              avatar_url: activeUserAvatar,
              xp_total: 0,
              level: 1,
              rank_title: "Recruit",
              exam_target: "JEE"
            });
            
            await supabase.from("streaks").insert({
              user_id: user.id,
              streak_type: "daily_login",
              current_count: 0,
              longest_ever: 0,
              is_active: false
            });
            await addBootLog("Scholar profile and initial streak data successfully initialized.", 150);
          } else {
            await addBootLog("Active scholar profile signature confirmed.", 150);

            // Sync profile data if out of sync with auth metadata
            const nameOut = existingProfile.full_name !== activeUserIgn;
            const avatarOut = existingProfile.avatar_url !== activeUserAvatar;
            if (nameOut || avatarOut) {
              await addBootLog("Syncing profile metadata indexes...", 100);
              await supabase
                .from("profiles")
                .update({
                  full_name: activeUserIgn,
                  avatar_url: activeUserAvatar,
                  updated_at: new Date().toISOString()
                })
                .eq("id", user.id);
            }
            
            // Ensure streaks record is initialized
            const { data: existingStreak } = await supabase
              .from("streaks")
              .select("id")
              .eq("user_id", user.id)
              .eq("streak_type", "daily_login")
              .maybeSingle();
              
            if (!existingStreak) {
              await supabase.from("streaks").insert({
                user_id: user.id,
                streak_type: "daily_login",
                current_count: 0,
                longest_ever: 0,
                is_active: false
              });
            }
          }
        } else {
          await addBootLog("Guest session active. Read-only standings query configured.", 150);
        }

        await addBootLog("Querying academic telemetry index database...", 150);

        // 2. Fetch all profiles from server
        const { data: profiles, error: profileErr } = await supabase
          .from("profiles")
          .select("id, email, full_name, avatar_url, xp_total, level, rank_title, exam_target")
          .order("xp_total", { ascending: false });

        if (profileErr) throw profileErr;
        await addBootLog(`Index queried successfully. Retrieved ${profiles?.length || 0} active standings.`, 100);

        await addBootLog("Resolving daily learning consistency streaks...", 150);

        // 3. Fetch all streaks to map them to profiles
        const { data: streaks } = await supabase
          .from("streaks")
          .select("user_id, current_count, is_active")
          .eq("streak_type", "daily_login");

        const streakMap = new Map<string, number>();
        if (streaks) {
          streaks.forEach(s => {
            streakMap.set(s.user_id, s.current_count || 0);
          });
        }
        await addBootLog("Consistency streak data resolved.", 100);

        await addBootLog("Compiling and sorting final Hall of Fame roster...", 150);

        // 4. Map profiles to LeaderboardUser interface
        const mappedUsers: LeaderboardUser[] = (profiles || []).map((p, idx) => {
          const isSelf = p.id === activeUserId;
          // Use real streak data from database, with fallback of 0 if database is empty
          const streakCount = streakMap.get(p.id) || 0;
          
          return {
            rank: idx + 1,
            id: p.id,
            name: p.full_name || (isSelf ? activeUserIgn.toUpperCase() : p.email.split("@")[0].toUpperCase()),
            email: p.email,
            avatar: p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`,
            xp: p.xp_total || 0,
            level: p.level || 1,
            streak: streakCount,
            examTarget: p.exam_target || "JEE",
            rankTitle: p.rank_title || "Recruit",
            isSelf
          };
        });

        // Re-sort in case any manual insert skewed rank orders
        mappedUsers.sort((a, b) => b.xp - a.xp);
        mappedUsers.forEach((u, i) => u.rank = i + 1);

        setLeaderboardUsers(mappedUsers);

        // --- Dynamic Rank & Streak Milestone Notifications ---
        const selfUser = mappedUsers.find(u => u.isSelf);
        if (selfUser && typeof window !== "undefined") {
          const userId = selfUser.id;
          const rank = selfUser.rank;
          const streak = selfUser.streak;

          // 1. Check Rank Milestones
          const rankMilestones = [
            { threshold: 1, title: "👑 Drona Arena Monarch: Rank #1 Reached!", msg: "An absolute masterclass in academic discipline. I am Drona, and I congratulate you on capturing the peak. You are officially Rank #1 in the Arena. Maintain your study consistency; the crown is heavy, and others seek to claim it.", type: "agent" as const },
            { threshold: 2, title: "⚡ Apex Contender: Rank #2 Secured!", msg: "Remarkable velocity! You have claimed Rank #2, placing you right at the gates of the ultimate throne. I am Drona, and I urge you to keep pushing. One final sprint is all it takes to become number one.", type: "agent" as const },
            { threshold: 3, title: "🥉 Top 3 Podium Reached!", msg: "The podium is yours! Achieving Rank #3 is a testament to your focus and recall. I am Drona, and I salute your dedication. Let this bronze be the foundation for your silver and gold campaigns.", type: "agent" as const },
            { threshold: 5, title: "🔥 Top 5 Arena Vanguard!", msg: "Sensational depth of knowledge. Entering the Top 5 separates you from the crowd. You are now a vanguard of the Arena. Stand tall and let your discipline guide your next module.", type: "agent" as const },
            { threshold: 10, title: "🎯 Top 10 Mastery Circle!", msg: "Outstanding performance! Reaching the Top 10 places you in the elite circle of scholars. I am Drona, and I applaud your academic rigor. Keep this fire burning!", type: "agent" as const },
            { threshold: 30, title: "⚔️ Top 30 High Council!", msg: "Discipline yields results. You have earned a seat in the Top 30 High Council of scholars. Your study consistency is yielding exceptional telemetry. Keep accelerating!", type: "agent" as const },
            { threshold: 50, title: "🛡️ Top 50 Arena Challenger!", msg: "Highly impressive! Breaking into the Top 50 indicates an optimal learning velocity. I am Drona, and I congratulate your progress. A top-tier ranking is within your grasp.", type: "agent" as const },
            { threshold: 100, title: "📜 Top 100 Honored Scholar!", msg: "A solid foundation built on daily habits. You have successfully entered the Top 100 ranks of the Drona Arena. The journey has just begun, and the telemetry shows great potential. Keep learning!", type: "agent" as const },
          ];

          // Find the best qualified rank milestone
          const qualifiedRankMilestone = rankMilestones.find(m => rank <= m.threshold);
          if (qualifiedRankMilestone) {
            const rankKey = `drona_notified_rank_${userId}_${qualifiedRankMilestone.threshold}`;
            if (!localStorage.getItem(rankKey)) {
              addNotification({
                title: qualifiedRankMilestone.title,
                message: qualifiedRankMilestone.msg,
                type: qualifiedRankMilestone.type,
                href: "/game/leaderboard"
              });
              localStorage.setItem(rankKey, "true");
            }
          }

          // 2. Check Streak Milestones
          const streakMilestones = [
            { threshold: 30, title: "👑 Legendary Habit: 30-Day Study Streak!", msg: "Exceptional discipline! 30 days of daily learning is a milestone achieved by only the top 1% of scholars. I am Drona, and I congratulate you on this legendary achievement. You are an inspiration in the Arena.", type: "agent" as const },
            { threshold: 14, title: "🏆 Fortnight of Focus: 14 Days Active!", msg: "14 consecutive days of studying! Your focus is sharpening, and your velocity is steady. I am Drona, and I certify you as an Adept of the daily loop. The limits are yours to break.", type: "agent" as const },
            { threshold: 7, title: "⚡ Streak Milestone: 7 Days Consistent!", msg: "A full week of academic dedication! You have successfully established a consistency rhythm. I am Drona, and I am proud of your discipline. Your cognitive baseline is rising.", type: "agent" as const },
            { threshold: 3, title: "🔥 Streak Ignited: 3 Days Active!", msg: "A spark has caught fire. I am Drona, and I detect the initial loops of a powerful study habit. Do not let the spark fade; secure your streak freeze and keep moving forward!", type: "agent" as const },
          ];

          // Find the best qualified streak milestone
          const qualifiedStreakMilestone = streakMilestones.find(m => streak >= m.threshold);
          if (qualifiedStreakMilestone) {
            const streakKey = `drona_notified_streak_${userId}_${qualifiedStreakMilestone.threshold}`;
            if (!localStorage.getItem(streakKey)) {
              addNotification({
                title: qualifiedStreakMilestone.title,
                message: qualifiedStreakMilestone.msg,
                type: qualifiedStreakMilestone.type,
                href: "/game/xp"
              });
              localStorage.setItem(streakKey, "true");
            }
          }
        }

        await addBootLog("System compilation complete. Rendering Hall of Fame...", 100);
      } catch (err) {
        console.error("Error loading server leaderboard:", err);
        // Fallback to empty standings index to ensure no fake data is displayed
        setLeaderboardUsers([]);
      } finally {
        setLoading(false);
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 2000 - elapsed);
        setTimeout(() => {
          setFadeLoader(true);
          setTimeout(() => {
            setShowLoader(false);
          }, 500);
        }, remaining);
      }
    };

    fetchLeaderboard();
  }, []);

  // Filter leaderboard based on selection
  const filteredUsers = useMemo(() => {
    if (activeTab === "exam") {
      const selfUser = leaderboardUsers.find(u => u.isSelf);
      const target = selfUser?.examTarget || "JEE";
      return leaderboardUsers.filter(u => u.examTarget === target);
    }
    if (activeTab === "friends") {
      // Friends filter: since no social connections exist, show only self as per "no fake data" rule
      return leaderboardUsers.filter(u => u.isSelf);
    }
    return leaderboardUsers;
  }, [leaderboardUsers, activeTab]);

  if (!mounted) return <div className="min-h-screen bg-[#06060a]" />;

  const featuredUser = leaderboardUsers[0]; // Leader is always index 0
  const selfUser = leaderboardUsers.find(u => u.isSelf) || featuredUser;

  return (
    <main className="w-full min-h-screen bg-[#06060a] text-white relative flex flex-col items-center pb-24 selection:bg-[#c9a84c]/20">
      
      {/* Laser Sweep CSS Styling Injector */}
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-150%) skewX(-30deg); }
          40% { transform: translateX(150%) skewX(-30deg); }
          100% { transform: translateX(150%) skewX(-30deg); }
        }
        .animate-laser-sweep {
          animation: sweep 6s infinite ease-in-out;
        }
      `}</style>

      {/* ─── Premium Dark Background & Strong Yellowish/Gold Glows ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Intense Yellow-Gold blurred light leaks to satisfy 'keep it dark, but yellowish' */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[#c9a84c]/15 rounded-full blur-[150px] opacity-75 mix-blend-screen" />
        <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-[#c9a84c]/5 rounded-full blur-[130px] opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(${themeHex} 1px, transparent 1px), linear-gradient(90deg, ${themeHex} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-12 relative z-10 flex flex-col gap-10 animate-fadeSlideUp">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-4">
          <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-5 py-1.5 rounded-full flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c9a84c] text-sm animate-pulse">workspace_premium</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a84c]">Hall of Fame</span>
          </div>

          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none uppercase text-white">
            Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e5cb80]">Fame</span>
          </h1>
          
          <p className="text-xs md:text-sm text-neutral-400 font-medium leading-relaxed max-w-xl">
            Verify relative academic standing in Season 1. Stagnation leads to decay—you must continue acquiring XP to protect your positioning.
          </p>
        </div>

        {/* ─── Hall of Fame Billboard Showcase (Esports Spotlight Slide) ─── */}
        {/* ─── Top 3 Podium Showcase (Rich Esports Stats) ─── */}
        {!loading && leaderboardUsers.length > 0 && (
          <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-stretch justify-center gap-6 mt-4 pt-6">
            
            {/* Rank 2 (Silver) - Positioned left */}
            {(() => {
              const u = leaderboardUsers[1];
              return (
                <div className="flex-1 bg-[#101015] border border-white/5 shadow-2xl rounded-[2.5rem] p-6 flex flex-col items-center justify-between text-center relative overflow-hidden group min-h-[460px] transition-transform duration-500 hover:-translate-y-2">
                  {/* Laser line scanner */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                    <div className="w-[30%] h-full bg-gradient-to-r from-transparent via-[#9ca3af]/10 to-transparent absolute top-0 left-0 animate-laser-sweep opacity-50" />
                  </div>
                  
                  <div className="w-full flex justify-between items-center text-[8px] font-mono text-neutral-600 select-none">
                    <span>PODIUM_02 // SECURE</span>
                    <span className="text-[#9ca3af] font-black tracking-wider">SILVER_TIER</span>
                  </div>
                  
                  {/* Avatar */}
                  <div className="relative w-28 h-28 flex items-center justify-center mt-4 shrink-0">
                    <div className="absolute inset-0 rounded-full border border-[#9ca3af]/15 animate-ping opacity-25" />
                    <div className="absolute inset-2 rounded-full border border-neutral-800 animate-pulse opacity-45" />
                    <div className="w-20 h-20 rounded-full border-4 border-[#9ca3af] shadow-[0_0_20px_rgba(156,163,175,0.25)] overflow-hidden bg-white z-10">
                      {u ? (
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-600">
                          <span className="material-symbols-outlined text-4xl">lock</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -top-1 z-20 w-6 h-6 bg-[#9ca3af] rounded-full border border-black flex items-center justify-center text-black font-black text-[10px] shadow-md">
                      #2
                    </div>
                  </div>

                  {/* Info */}
                  <div className="w-full text-center flex-1 flex flex-col justify-between mt-4">
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-white truncate max-w-[200px] mx-auto">
                        {u ? u.name : "Position Open"}
                      </h3>
                      
                      {/* Capsule Tags */}
                      <div className="flex justify-center gap-1.5 mt-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-mono font-bold text-neutral-300">
                          Lvl {u ? u.level : "-"}
                        </span>
                        <span className="px-2 py-0.5 bg-[#9ca3af]/10 border border-[#9ca3af]/20 rounded text-[8px] font-mono font-bold text-[#9ca3af]">
                          {u ? u.rankTitle : "UNRANKED"}
                        </span>
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-mono font-bold text-neutral-300">
                          {u ? u.examTarget : "JEE"}
                        </span>
                      </div>
                    </div>

                    {/* Stats List */}
                    <div className="w-full space-y-2 mt-6 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1.5">
                        <span className="text-neutral-500">YEARLY PROGRESS</span>
                        <span className="text-[#9ca3af] font-bold">{u ? `${u.xp.toLocaleString()} XP` : "0 XP"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1.5">
                        <span className="text-neutral-500">DAILY STREAK</span>
                        <span className="text-emerald-400 font-bold">{u ? `${u.streak} days` : "0 days"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1.5">
                        <span className="text-neutral-500">COGNITIVE TIER</span>
                        <span className="text-white font-bold">{u ? "OPTIMAL" : "NONE"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-neutral-500">ARENA STATUS</span>
                        <span className="text-neutral-400 font-bold">{u ? "CHALLENGER" : "OPEN"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Rank 1 (Gold) - Elevated Center */}
            {(() => {
              const u = leaderboardUsers[0];
              return (
                <div className="flex-[1.1] bg-[#12121a] border border-[#c9a84c]/20 shadow-[0_0_40px_rgba(201,168,76,0.18)] rounded-[3rem] p-8 flex flex-col items-center justify-between text-center relative overflow-hidden group min-h-[500px] md:-translate-y-6 transition-transform duration-500 hover:-translate-y-8">
                  {/* Laser line scanner */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                    <div className="w-[30%] h-full bg-gradient-to-r from-transparent via-[#c9a84c]/15 to-transparent absolute top-0 left-0 animate-laser-sweep opacity-75" />
                  </div>
                  
                  <div className="w-full flex justify-between items-center text-[8px] font-mono text-[#c9a84c]/40 select-none">
                    <span>PODIUM_01 // SYSTEM_LEADER</span>
                    <span className="text-[#c9a84c] font-black tracking-widest animate-pulse">GOLD_CHAMPION</span>
                  </div>
                  
                  {/* Avatar */}
                  <div className="relative w-36 h-36 flex items-center justify-center mt-4 shrink-0">
                    <div className="absolute inset-0 rounded-full border border-[#c9a84c]/20 animate-ping opacity-30" />
                    <div className="absolute inset-3 rounded-full border border-neutral-800 animate-pulse opacity-45" />
                    <div className="w-24 h-24 rounded-full border-4 border-[#c9a84c] shadow-[0_0_30px_rgba(201,168,76,0.45)] overflow-hidden bg-white z-10">
                      {u ? (
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-600">
                          <span className="material-symbols-outlined text-5xl">lock</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -top-1 z-20 w-8 h-8 bg-[#c9a84c] rounded-full border border-black flex items-center justify-center text-black font-black text-xs shadow-lg animate-bounce">
                      👑
                    </div>
                  </div>

                  {/* Info */}
                  <div className="w-full text-center flex-1 flex flex-col justify-between mt-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-black tracking-tight text-white truncate max-w-[240px] mx-auto">
                        {u ? u.name : "Position Open"}
                      </h2>
                      
                      {/* Capsule Tags */}
                      <div className="flex justify-center gap-1.5 mt-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-mono font-bold text-neutral-300">
                          Lvl {u ? u.level : "-"}
                        </span>
                        <span className="px-2 py-0.5 bg-[#c9a84c]/10 border border-[#c9a84c]/25 rounded text-[8px] font-mono font-black text-[#c9a84c] tracking-wide">
                          {u ? u.rankTitle : "UNRANKED"}
                        </span>
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-mono font-bold text-neutral-300">
                          {u ? u.examTarget : "JEE"}
                        </span>
                      </div>
                    </div>

                    {/* Stats List */}
                    <div className="w-full space-y-2 mt-6 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1.5">
                        <span className="text-[#c9a84c]/60">YEARLY PROGRESS</span>
                        <span className="text-[#c9a84c] font-black">{u ? `${u.xp.toLocaleString()} XP` : "0 XP"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1.5">
                        <span className="text-[#c9a84c]/60">DAILY STREAK</span>
                        <span className="text-emerald-400 font-bold">{u ? `${u.streak} days` : "0 days"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1.5">
                        <span className="text-[#c9a84c]/60">COGNITIVE TIER</span>
                        <span className="text-white font-bold">{u ? "EXCEPTIONAL" : "NONE"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-[#c9a84c]/60">ARENA STATUS</span>
                        <span className="text-emerald-500 font-bold">{u ? "MONARCH" : "OPEN"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Rank 3 (Bronze) - Positioned right */}
            {(() => {
              const u = leaderboardUsers[2];
              return (
                <div className="flex-1 bg-[#101015] border border-white/5 shadow-xl rounded-[2.5rem] p-6 flex flex-col items-center justify-between text-center relative overflow-hidden group min-h-[460px] transition-transform duration-500 hover:-translate-y-2">
                  {/* Laser line scanner */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                    <div className="w-[30%] h-full bg-gradient-to-r from-transparent via-[#b45309]/10 to-transparent absolute top-0 left-0 animate-laser-sweep opacity-50" />
                  </div>
                  
                  <div className="w-full flex justify-between items-center text-[8px] font-mono text-neutral-700 select-none">
                    <span>PODIUM_03 // SECURE</span>
                    <span className="text-[#b45309] font-black tracking-wider">BRONZE_TIER</span>
                  </div>
                  
                  {/* Avatar */}
                  <div className="relative w-28 h-28 flex items-center justify-center mt-4 shrink-0">
                    <div className="absolute inset-0 rounded-full border border-[#b45309]/15 animate-ping opacity-25" />
                    <div className="absolute inset-2 rounded-full border border-neutral-800 animate-pulse opacity-45" />
                    <div className="w-20 h-20 rounded-full border-4 border-[#b45309] shadow-[0_0_20px_rgba(180,83,9,0.25)] overflow-hidden bg-white z-10">
                      {u ? (
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-600">
                          <span className="material-symbols-outlined text-4xl">lock</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -top-1 z-20 w-6 h-6 bg-[#b45309] rounded-full border border-black flex items-center justify-center text-black font-black text-[10px] shadow-md">
                      #3
                    </div>
                  </div>

                  {/* Info */}
                  <div className="w-full text-center flex-1 flex flex-col justify-between mt-4">
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-white truncate max-w-[200px] mx-auto">
                        {u ? u.name : "Position Open"}
                      </h3>
                      
                      {/* Capsule Tags */}
                      <div className="flex justify-center gap-1.5 mt-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-mono font-bold text-neutral-300">
                          Lvl {u ? u.level : "-"}
                        </span>
                        <span className="px-2 py-0.5 bg-[#b45309]/10 border border-[#b45309]/20 rounded text-[8px] font-mono font-bold text-[#b45309]">
                          {u ? u.rankTitle : "UNRANKED"}
                        </span>
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-mono font-bold text-neutral-300">
                          {u ? u.examTarget : "JEE"}
                        </span>
                      </div>
                    </div>

                    {/* Stats List */}
                    <div className="w-full space-y-2 mt-6 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1.5">
                        <span className="text-neutral-500">YEARLY PROGRESS</span>
                        <span className="text-[#b45309] font-bold">{u ? `${u.xp.toLocaleString()} XP` : "0 XP"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1.5">
                        <span className="text-neutral-500">DAILY STREAK</span>
                        <span className="text-emerald-400 font-bold">{u ? `${u.streak} days` : "0 days"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1.5">
                        <span className="text-neutral-500">COGNITIVE TIER</span>
                        <span className="text-white font-bold">{u ? "DEVELOPING" : "NONE"}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-neutral-500">ARENA STATUS</span>
                        <span className="text-neutral-400 font-bold">{u ? "DEFENDER" : "OPEN"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* ─── Main Grid Layout (Fill Width) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          
          {/* Left Column: Ledger & Filters (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-between items-center gap-4 bg-[#101015]/60 border border-white/5 p-2 rounded-2xl">
              <div className="flex gap-2">
                {[
                  { id: "all-india" as const, label: "All-India" },
                  { id: "exam" as const, label: `Same Exam (${selfUser?.examTarget || "JEE"})` },
                  { id: "friends" as const, label: "Friends" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      activeTab === tab.id
                        ? "bg-[#c9a84c] text-black shadow-[0_4px_15px_rgba(201,168,76,0.3)]"
                        : "bg-transparent text-neutral-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="text-[10px] font-mono text-neutral-500 font-bold pr-3 uppercase">
                Reset: exam season end
              </div>
            </div>

            {/* Rankings Board Table Container */}
            <div className="bg-[#101015] border border-white/5 shadow-xl rounded-[2rem] overflow-hidden">
              {loading ? (
                <div className="py-20 text-center flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-4xl text-neutral-600 animate-spin">sync</span>
                  <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Syncing Arena Standings...</span>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#12121a] border-b border-white/5 text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                        <th className="px-6 py-4 text-center w-24">Rank</th>
                        <th className="px-6 py-4">Scholar</th>
                        <th className="px-6 py-4 text-center w-36">Streak</th>
                        <th className="px-6 py-4 text-center w-28">Level</th>
                        <th className="px-6 py-4 text-center w-28">Exam</th>
                        <th className="px-6 py-4 text-right pr-8 w-36">XP Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-neutral-300 bg-transparent">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className={`hover:bg-[#12121c]/50 transition-colors border-b border-white/5 ${
                            user.isSelf ? "bg-[#c9a84c]/5 border-y border-[#c9a84c]/10" : ""
                          }`}
                        >
                          {/* Rank Column */}
                          <td className="px-6 py-4 text-center">
                            {user.rank === 1 ? (
                              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] font-black shadow-[0_0_8px_rgba(201,168,76,0.3)]">
                                #1
                              </div>
                            ) : (
                              <span className="font-mono font-bold text-neutral-400">#{user.rank}</span>
                            )}
                          </td>

                          {/* Scholar Profile Column */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full border border-neutral-800 overflow-hidden relative bg-white shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-white flex items-center gap-1.5">
                                  {user.name}
                                  {user.isSelf && (
                                    <span className="text-[8px] bg-[#c9a84c] text-black font-black uppercase px-1.5 py-0.5 rounded">
                                      YOU
                                    </span>
                                  )}
                                </span>
                                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">
                                  {user.rankTitle}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Streak Column */}
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center gap-1.5 bg-neutral-900 border border-white/5 px-3 py-1.5 rounded-lg text-emerald-400 font-mono font-bold">
                              <span className="material-symbols-outlined text-sm text-[#c9a84c] animate-pulse">local_fire_department</span>
                              {user.streak} days
                            </div>
                          </td>

                          {/* Level Column */}
                          <td className="px-6 py-4 text-center">
                            <span className="bg-neutral-900 border border-white/5 px-2.5 py-1 rounded text-neutral-300 font-mono">
                              Lvl {user.level}
                            </span>
                          </td>

                          {/* Exam Target Column */}
                          <td className="px-6 py-4 text-center text-neutral-400 font-bold uppercase tracking-wider">
                            {user.examTarget}
                          </td>

                          {/* XP Column */}
                          <td className="px-6 py-4 text-right pr-8 font-mono font-black text-[#c9a84c]">
                            {user.xp.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-4xl text-neutral-600">groups</span>
                  <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">No scholars match active tab filter settings.</span>
                </div>
              )}
            </div>

            {/* Empty State Banner if only active user exists */}
            {!loading && leaderboardUsers.length <= 1 && (
              <div className="p-8 text-center bg-[#101015]/60 border border-white/5 rounded-[2rem] max-w-xl mx-auto w-full flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-[#c9a84c] text-5xl mb-2 animate-pulse">explore_off</span>
                <h4 className="font-bold text-base text-white">Competitive Standby Activated</h4>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
                  {"You are currently the first qualified scholar in this competitive arena. No other profiles have completed modules or earned XP in Season 1 yet."}
                </p>
                <div className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-neutral-500 border border-white/5 bg-[#12121c] px-4 py-2 rounded-full mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Syncing • Listening for peer events
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Gamification Intel & Rules (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Loss Aversion Banner */}
            <div className="bg-[#12121c] border border-red-500/20 rounded-[2rem] p-6 relative overflow-hidden group text-red-400">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl" />
              <div className="flex items-center gap-3 mb-3 text-red-600">
                <span className="material-symbols-outlined text-xl animate-bounce">warning</span>
                <span className="text-[10px] font-black uppercase tracking-wider">Psychological Warning</span>
              </div>
              <h4 className="font-bold text-sm text-white mb-2">Relative Position Decay</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                {"In Drona, XP accumulated is permanent, but leaderboard standing is relative. If you remain stagnant (idle without study), other scholars who continue learning will surpass you, dropping your rank. Keep the spirit active."}
              </p>
            </div>

            {/* Annual Rewards Box */}
            <div className="bg-[#101015] border border-white/5 rounded-[2rem] p-6 flex flex-col justify-between shadow-sm relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-[#c9a84c]/5 to-transparent pointer-events-none" />
              
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c]">
                    <span className="material-symbols-outlined text-lg">workspace_premium</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Locked Season 1 Pool</span>
                </div>
                
                <h4 className="text-lg font-black text-white mb-2">Year-End Champion Prizes</h4>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-medium">
                  When the season freezes at the end of the academic year, the Top 100 scholars receive high-value physical goods to celebrate their academic discipline.
                </p>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                    <span className="text-neutral-400 font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                      Ranks #1 - #3
                    </span>
                    <span className="text-white font-mono font-bold">MacBook Air M3</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                    <span className="text-neutral-400 font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                      Ranks #4 - #10
                    </span>
                    <span className="text-white font-mono font-bold">Elite Digital Ink Kits</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-1">
                    <span className="text-neutral-400 font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                      Ranks #11 - #100
                    </span>
                    <span className="text-white font-mono font-bold">Drona Elite Hoodies</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase text-neutral-500 tracking-wider">
                <span>Funded via Drona pool</span>
                <span className="text-emerald-600">Active</span>
              </div>
            </div>

            {/* Standing summary card */}
            <div className="bg-[#101015] border border-white/5 rounded-[2rem] p-6 shadow-sm text-white">
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-3 block">Your Arena Stats</span>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500 font-bold">Precision Rank</span>
                  <span className="text-sm font-black text-white">
                    #{selfUser ? selfUser.rank : "-"} of {leaderboardUsers.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500 font-bold">Global Percentile</span>
                  <span className="text-sm font-black text-[#c9a84c]">
                    {selfUser && selfUser.xp > 0
                      ? selfUser.rank === 1 ? "TOP 0.01%" : `Top ${Math.round((selfUser.rank / leaderboardUsers.length) * 100)}%`
                      : "None"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500 font-bold">Active Streak</span>
                  <span className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#c9a84c] text-sm animate-pulse">local_fire_department</span>
                    {selfUser ? `${selfUser.streak} days` : "0 days"}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Cinematic White Loading Screen */}
      {showLoader && (
        <div
          className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out px-4 select-none ${
            fadeLoader ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-center text-center max-w-md animate-fadeSlideUp">
            {/* Elegant pulsing logo */}
            <span className="material-symbols-outlined text-5xl text-neutral-900 animate-pulse mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>

            {/* Branded Title */}
            <span className="text-[10px] font-mono tracking-[0.4em] font-black text-neutral-400 uppercase">
              DRONA SYSTEM
            </span>
            <h2 className="text-4xl font-display font-black tracking-[0.05em] text-neutral-950 uppercase mt-2">
              Hall of <span className="text-[#c9a84c]">Fame</span>
            </h2>
            
            {/* Thin progress line loader */}
            <div className="w-48 h-0.5 bg-neutral-100 rounded-full overflow-hidden relative mt-8">
              <div 
                className="h-full bg-[#c9a84c] rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${Math.min(100, Math.max(10, (bootLogs.length / 10) * 100))}%` }} 
              />
            </div>

            {/* Single dynamic status line */}
            <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-[0.2em] mt-5 h-4 transition-all duration-300">
              {bootLogs[bootLogs.length - 1] || "Connecting database..."}
            </p>
          </div>
        </div>
      )}

    </main>
  );
}