"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { storageAdapter } from "@/lib/storageAdapter";

export default function GameDashboard() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const themeHex = "#c9a84c"; // Gold for Game Env
  const themeRgb = "201, 168, 76";

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      try {
        const data = await storageAdapter.getProfileDashboardData();
        setProfile(data.profile);
      } catch { /* fallback */ }
    };
    fetchUser();
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#faf9f6]" />;

  const currentXp = profile?.xp || 0;
  const xpMax = profile?.xpMax || 1000;
  const progressPercent = Math.min(100, Math.max(0, (currentXp / xpMax) * 100));

  return (
    <main className="w-full min-h-screen bg-[#faf9f6] relative overflow-hidden flex flex-col items-center">
      
      {/* ─── Premium Background Graphics ─── */}
      <div className="absolute top-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/10 via-[#c9a84c]/5 to-transparent" />
        <div className="absolute -top-[300px] -right-[200px] w-[800px] h-[800px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: themeHex }} />
        <div className="absolute top-[100px] -left-[200px] w-[600px] h-[600px] rounded-full blur-[100px] opacity-10" style={{ backgroundColor: themeHex }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${themeHex} 1px, transparent 1px), linear-gradient(90deg, ${themeHex} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-12 relative z-10 animate-fadeSlideUp flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] font-bold text-on-surface-variant mb-2">The Arena</span>
            <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-on-surface tracking-tight leading-none" style={{ textShadow: `0 4px 20px rgba(${themeRgb}, 0.15)` }}>
              Gamification Lobby
            </h1>
            <p className="text-on-surface-variant font-medium mt-4 max-w-2xl text-sm md:text-base leading-relaxed">
              Welcome to the Arena. Transform your daily studies into measurable conquests. Dominate the leaderboards, conquer Boss Battles, and forge your academic legacy.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link href="/game/leaderboard" className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-white border border-outline-variant/30 hover:border-[#c9a84c]/50 hover:shadow-lg transition-all transform hover:-translate-y-1">
              <span className="material-symbols-outlined text-[#c9a84c]">social_leaderboard</span>
              Rankings
            </Link>
            <Link href="/game/boss" className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all transform hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(201,168,76,0.3)]" style={{ background: `linear-gradient(135deg, #c9a84c, #b3923a)` }}>
              <span className="material-symbols-outlined text-white">swords</span>
              Enter Arena
            </Link>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
          
          {/* Left Column: Identity & Radar */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Identity Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl rounded-[2rem] p-8 flex flex-col items-center text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-32 h-32 rounded-full border-4 shadow-2xl mb-6 relative z-10 flex items-center justify-center bg-white overflow-hidden transform group-hover:scale-105 transition-transform duration-500" style={{ borderColor: themeHex }}>
                <div className="absolute inset-0 animate-[spin_10s_linear_infinite] opacity-20 border-[2px] border-dashed rounded-full" style={{ borderColor: themeHex }} />
                {profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-6xl" style={{ color: `${themeHex}80` }}>local_fire_department</span>
                )}
              </div>

              <div className="bg-surface-container-low px-4 py-1.5 rounded-full mb-3 flex items-center gap-2 border border-outline-variant/20 relative z-10">
                <span className="material-symbols-outlined text-[14px]" style={{ color: themeHex }}>star</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Level {profile?.level || 1} Scholar</span>
              </div>

              <h2 className="font-display text-2xl font-black text-on-surface mb-6 relative z-10">{profile?.ign || "Recruit"}</h2>

              <div className="w-full relative z-10">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3">
                  <span className="text-on-surface-variant">XP Progress</span>
                  <span style={{ color: themeHex }}>{currentXp.toLocaleString()} / {xpMax.toLocaleString()}</span>
                </div>
                <div className="w-full h-4 bg-surface-container-high rounded-full overflow-hidden shadow-inner p-0.5">
                  <div className="h-full rounded-full relative overflow-hidden transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%`, backgroundColor: themeHex, boxShadow: `0 0 15px ${themeHex}80` }}>
                    <div className="absolute inset-0 bg-white/30 -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Radar Stats Card */}
            <div className="bg-[#1a1a24] border border-[#c9a84c]/30 shadow-2xl rounded-[2rem] p-8 flex flex-col items-center relative overflow-hidden text-white">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
              
              <h3 className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-8 relative z-10">Cognitive Radar</h3>
              
              {/* Simulated Hexagonal Radar */}
              <div className="w-full aspect-square max-w-[250px] relative z-10 mb-6 flex items-center justify-center">
                {/* Background Web */}
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-20" style={{ filter: 'drop-shadow(0 0 10px rgba(201,168,76,0.5))' }}>
                  <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
                  <polygon points="50,20 76,33 76,66 50,80 24,66 24,33" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
                  <polygon points="50,35 63,42 63,58 50,65 37,58 37,42" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
                  <line x1="50" y1="5" x2="50" y2="95" stroke="#c9a84c" strokeWidth="0.5" />
                  <line x1="10" y1="25" x2="90" y2="75" stroke="#c9a84c" strokeWidth="0.5" />
                  <line x1="10" y1="75" x2="90" y2="25" stroke="#c9a84c" strokeWidth="0.5" />
                  
                  {/* Filled Data Polygon (Simulated) */}
                  <polygon points="50,15 80,30 60,60 50,85 20,65 30,35" fill="rgba(201, 168, 76, 0.4)" stroke="#c9a84c" strokeWidth="1.5" className="animate-[pulse_4s_ease-in-out_infinite]" />
                </svg>
                
                {/* Labels */}
                <div className="absolute top-0 text-[9px] font-bold tracking-widest uppercase text-white/70">Precision</div>
                <div className="absolute top-[25%] right-0 text-[9px] font-bold tracking-widest uppercase text-white/70">Velocity</div>
                <div className="absolute bottom-[25%] right-0 text-[9px] font-bold tracking-widest uppercase text-white/70">Depth</div>
                <div className="absolute bottom-0 text-[9px] font-bold tracking-widest uppercase text-white/70">Recall</div>
                <div className="absolute bottom-[25%] left-0 text-[9px] font-bold tracking-widest uppercase text-white/70">Discipline</div>
                <div className="absolute top-[25%] left-0 text-[9px] font-bold tracking-widest uppercase text-white/70">Explore</div>
              </div>
              
              <Link href="/stats" className="text-xs font-bold text-[#c9a84c] hover:text-white transition-colors relative z-10 flex items-center gap-1">
                View Deep Analytics <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Missions & Boss Battles */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Active Quests */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl rounded-[2rem] p-8 relative overflow-hidden">
              <div className="flex justify-between items-end mb-8 border-b border-outline-variant/20 pb-4">
                <div>
                  <h3 className="font-display text-2xl font-black text-on-surface flex items-center gap-3">
                    <span className="material-symbols-outlined text-[28px]" style={{ color: themeHex }}>flag</span>
                    Daily Quests
                  </h3>
                  <p className="text-sm font-medium text-on-surface-variant mt-1">Complete objectives to earn massive XP and unlock badges.</p>
                </div>
                <Link href="/game/missions" className="text-xs font-bold text-on-surface-variant hover:text-[#c9a84c] transition-colors flex items-center gap-1 uppercase tracking-widest">
                  All Missions <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quest Card 1 */}
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 hover:border-[#c9a84c]/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                      <span className="material-symbols-outlined">psychology</span>
                    </div>
                    <span className="bg-[#c9a84c]/10 text-[#c9a84c] px-3 py-1 rounded-full text-xs font-black tracking-widest border border-[#c9a84c]/20">+150 XP</span>
                  </div>
                  <h4 className="font-bold text-on-surface mb-2">Master Physics Kinematics</h4>
                  <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">Complete 3 sub-topics in the Kinematics chapter and score &gt;80% on the mock drill.</p>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[33%] rounded-full" />
                  </div>
                  <div className="mt-2 text-right text-[10px] font-bold text-outline">1 / 3 Completed</div>
                </div>

                {/* Quest Card 2 */}
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 hover:border-[#c9a84c]/50 hover:shadow-lg transition-all duration-300 group cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                      <span className="material-symbols-outlined">quiz</span>
                    </div>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-black tracking-widest shadow-sm">CLAIM</span>
                  </div>
                  <h4 className="font-bold text-on-surface mb-2 relative z-10 line-through opacity-70">Daily Diagnostic</h4>
                  <p className="text-xs text-on-surface-variant mb-4 line-clamp-2 relative z-10 opacity-70">Finish your first mock test of the day.</p>
                  <div className="w-full h-2 bg-green-500/20 rounded-full overflow-hidden relative z-10">
                    <div className="h-full bg-green-500 w-[100%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  </div>
                  <div className="mt-2 text-right text-[10px] font-bold text-green-600 relative z-10">DONE!</div>
                </div>
              </div>
            </div>

            {/* Boss Battles Banner */}
            <div className="rounded-[2rem] p-8 relative overflow-hidden text-white flex flex-col justify-center min-h-[220px] group cursor-pointer shadow-2xl border border-[#c9a84c]/20" style={{ background: `radial-gradient(circle at right top, #2a2a35, #12121a)` }}>
              {/* Animated Background */}
              <div className="absolute right-0 top-0 bottom-0 w-[50%] bg-gradient-to-l from-[#c9a84c]/20 to-transparent opacity-50 group-hover:w-[60%] transition-all duration-700 ease-out" />
              <div className="absolute -right-[10%] -top-[20%] w-[300px] h-[300px] bg-[#c9a84c]/10 rounded-full blur-[60px] group-hover:bg-[#c9a84c]/20 transition-all duration-700" />
              
              <div className="relative z-10 max-w-[60%]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#c9a84c] animate-pulse">crisis_alert</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c9a84c]">Live Event</span>
                </div>
                <h3 className="font-display text-3xl font-black mb-2">Organic Chemistry Crucible</h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">24 scholars are waiting in the lobby. The battle begins in 5 minutes. High stakes, immense XP rewards.</p>
                <Link href="/game/boss" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs bg-white/10 hover:bg-white/20 border border-white/20 transition-all backdrop-blur-md">
                  Join Lobby <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
              
              <span className="material-symbols-outlined absolute right-8 top-1/2 -translate-y-1/2 text-[140px] text-white/5 -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 drop-shadow-2xl">
                swords
              </span>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}