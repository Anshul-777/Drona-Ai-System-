"use client";

import { useEffect, useState } from "react";

export default function GameDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeHex = "#c9a84c"; // Gold for Game Env

  if (!mounted) return null;

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-8 animate-fadeIn transition-all duration-300 relative">

      {/* ─── Premium Watermark ─── */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] overflow-hidden pointer-events-none z-0 opacity-20 select-none">
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${themeHex}08 10px, ${themeHex}08 20px)` }} />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-surface to-surface" />
        <span className="material-symbols-outlined absolute top-4 right-12 text-[250px] -rotate-12 translate-x-10 -translate-y-10 drop-shadow-2xl" style={{ color: `${themeHex}15` }}>
          sports_esports
        </span>
      </div>

      <div className="mb-12 relative z-10 animate-slideUp" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-on-surface tracking-tight mb-3">Gamification Lobby</h1>
        <p className="text-on-surface-variant font-medium max-w-2xl text-sm md:text-base">
          Compete in the global leaderboard, join active Boss Battles, and complete daily study quests to earn Knowledge Credits.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">

        {/* ─── Holographic Stats & Avatar (4-col) ─── */}
        <div className="xl:col-span-4 animate-slideUp" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-8 shadow-sm h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#c9a84c]/10 to-transparent" />

            <div className="w-32 h-32 rounded-full border-4 shadow-sm mb-6 relative z-10 flex items-center justify-center bg-surface-container-lowest" style={{ borderColor: `${themeHex}40` }}>
              <span className="material-symbols-outlined text-6xl" style={{ color: `${themeHex}60` }}>account_circle</span>
            </div>

            <h2 className="font-display text-2xl font-black text-on-surface mb-1 relative z-10">Level 1 Scholar</h2>
            <p className="text-sm font-bold text-on-surface-variant mb-6 relative z-10 opacity-60">Rank: Uncalibrated</p>

            <div className="w-full relative z-10 opacity-70">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-on-surface">XP Progress</span>
                <span style={{ color: themeHex }}>0 / 1,000</span>
              </div>
              <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden shadow-inner">
                <div className="h-full rounded-full transition-all duration-1000 ease-out w-[0%]" style={{ backgroundColor: themeHex, boxShadow: `0 0 10px ${themeHex}` }} />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Daily Quests & Boss Battles (8-col) ─── */}
        <div className="xl:col-span-8 flex flex-col gap-8 animate-slideUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>

          {/* Boss Battles */}
          <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-8 shadow-sm border-l-4" style={{ borderLeftColor: themeHex }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ color: themeHex }}>swords</span>
                Active Boss Battles
              </h3>
            </div>

            <div className="flex flex-col items-center justify-center py-6 text-center opacity-50">
              <span className="material-symbols-outlined text-5xl mb-3">lock</span>
              <p className="text-sm font-bold text-on-surface">Arena Locked</p>
              <p className="text-xs text-on-surface-variant mt-1">Complete your diagnostic phase to access global multiplayer battles.</p>
            </div>
          </div>

          {/* Daily Quests */}
          <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-8 shadow-sm flex-1">
            <h3 className="font-display text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: themeHex }}>assignment_turned_in</span>
              Study Missions
            </h3>

            <div className="space-y-3">
              {[
                { task: 'Complete Initial Diagnostic Test', reward: '+1000 XP', done: false },
                { task: 'Set up your Workspace Schedule', reward: '+150 XP', done: false },
              ].map((quest, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${quest.done ? 'border-green-500/30 bg-green-500/5 opacity-60' : 'border-outline-variant/30 bg-surface-container-lowest hover:border-[#c9a84c]/30'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${quest.done ? 'bg-green-500 border-green-500 text-white' : 'border-outline-variant text-transparent'}`}>
                      <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                    </div>
                    <span className={`text-sm font-bold ${quest.done ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>{quest.task}</span>
                  </div>
                  <span className="text-xs font-black" style={{ color: quest.done ? '#22c55e' : themeHex }}>{quest.reward}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation-name: slideUp;
          animation-duration: 0.6s;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </main>
  );
}