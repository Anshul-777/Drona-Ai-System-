"use client";

import { useEffect, useState } from "react";

export default function BadgesPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState("all");

  const themeHex = "#c9a84c";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#faf9f6]" />;

  const filters = [
    { id: "all", label: "All Badges" },
    { id: "legendary", label: "Legendary" },
    { id: "rare", label: "Rare" },
    { id: "common", label: "Common" },
  ];

  const badges = [
    { id: 1, name: "First Blood", desc: "Complete your very first diagnostic.", rarity: "common", unlocked: true, icon: "water_drop", color: "#64748b" },
    { id: 2, name: "Seven Day Scholar", desc: "Maintain a 7-day streak.", rarity: "rare", unlocked: true, icon: "local_fire_department", color: "#3b82f6" },
    { id: 3, name: "Newton's Heir", desc: "Score 100% in a Physics Boss Battle.", rarity: "legendary", unlocked: false, icon: "public", color: "#c9a84c" },
    { id: 4, name: "Carbon Master", desc: "Defeat the Organic Chemistry Crucible.", rarity: "legendary", unlocked: false, icon: "science", color: "#c9a84c" },
    { id: 5, name: "Early Bird", desc: "Complete a study session before 6 AM.", rarity: "rare", unlocked: true, icon: "wb_twilight", color: "#3b82f6" },
    { id: 6, name: "Night Owl", desc: "Complete a study session after midnight.", rarity: "rare", unlocked: false, icon: "dark_mode", color: "#3b82f6" },
    { id: 7, name: "Socratic Mind", desc: "Ask 100 questions to Drona AI.", rarity: "legendary", unlocked: false, icon: "psychology", color: "#c9a84c" },
    { id: 8, name: "Speed Demon", desc: "Finish a test in half the allocated time.", rarity: "rare", unlocked: false, icon: "bolt", color: "#3b82f6" },
    { id: 9, name: "Perfect Score", desc: "Get 100% on any major exam.", rarity: "legendary", unlocked: false, icon: "verified", color: "#c9a84c" },
    { id: 10, name: "Consistent Focus", desc: "Study 4 hours a day for a week.", rarity: "common", unlocked: true, icon: "hourglass_bottom", color: "#64748b" },
    { id: 11, name: "Team Player", desc: "Invite a friend to the platform.", rarity: "common", unlocked: false, icon: "group", color: "#64748b" },
    { id: 12, name: "The Alchemist", desc: "Master all Chemistry modules.", rarity: "legendary", unlocked: false, icon: "experiment", color: "#c9a84c" },
  ];

  const filteredBadges = filter === "all" ? badges : badges.filter(b => b.rarity === filter);

  return (
    <main className="w-full min-h-screen bg-[#faf9f6] relative flex flex-col items-center pb-20">
      
      {/* Background Graphic */}
      <div className="absolute top-0 w-full h-[400px] overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/10 to-transparent" />
        <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: themeHex }} />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-12 relative z-10 animate-fadeSlideUp">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-4">
            <span className="material-symbols-outlined text-[60px] drop-shadow-lg relative z-10" style={{ color: themeHex }}>military_tech</span>
            <div className="absolute inset-0 bg-[#c9a84c]/20 blur-xl rounded-full" />
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl text-on-surface tracking-tight leading-none mb-4">
            Achievement <span style={{ color: themeHex }}>Gallery</span>
          </h1>
          <p className="text-on-surface-variant font-medium max-w-xl text-sm md:text-base">
            Your medals of honor. Unlock these by completing extraordinary feats across the platform.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 ${
                filter === f.id 
                ? 'bg-[#1a1a24] text-white shadow-lg' 
                : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container-low'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBadges.map(badge => (
            <div key={badge.id} className={`group relative flex flex-col items-center text-center p-6 rounded-[2rem] border transition-all duration-500 ${
              badge.unlocked 
                ? 'bg-white border-[#c9a84c]/30 shadow-xl hover:shadow-[0_10px_30px_rgba(201,168,76,0.2)] hover:-translate-y-2' 
                : 'bg-surface-container-lowest border-outline-variant/20 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:shadow-lg hover:-translate-y-1'
            }`}>
              
              {/* Badge Icon Container */}
              <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                {/* Hexagon SVG background */}
                <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full drop-shadow-xl transition-all duration-500 ${badge.unlocked ? '' : 'opacity-30'}`}>
                  <polygon 
                    points="50,5 90,25 90,75 50,95 10,75 10,25" 
                    fill={badge.unlocked ? badge.color : '#e2e8f0'} 
                    stroke={badge.unlocked ? "white" : "#cbd5e1"} 
                    strokeWidth="4" 
                  />
                  {badge.unlocked && badge.rarity === 'legendary' && (
                    <polygon 
                      points="50,12 82,30 82,70 50,88 18,70 18,30" 
                      fill="none" 
                      stroke="rgba(255,255,255,0.5)" 
                      strokeWidth="1" 
                    />
                  )}
                </svg>
                <span className={`material-symbols-outlined text-[36px] relative z-10 transition-colors ${badge.unlocked ? 'text-white drop-shadow-md' : 'text-slate-400'}`}>
                  {badge.icon}
                </span>

                {/* Legendary Glow */}
                {badge.unlocked && badge.rarity === 'legendary' && (
                  <div className="absolute inset-0 bg-[#c9a84c] blur-xl opacity-40 rounded-full animate-pulse z-[-1]" />
                )}
              </div>

              {/* Rarity Label */}
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm mb-3 ${
                badge.rarity === 'legendary' ? 'bg-[#c9a84c]/10 text-[#c9a84c]' :
                badge.rarity === 'rare' ? 'bg-blue-500/10 text-blue-600' :
                'bg-slate-500/10 text-slate-500'
              }`}>
                {badge.rarity}
              </span>

              {/* Title & Desc */}
              <h3 className={`font-display font-bold mb-1 transition-colors ${badge.unlocked ? 'text-on-surface' : 'text-on-surface-variant'}`}>{badge.name}</h3>
              <p className="text-xs text-on-surface-variant font-medium opacity-80 leading-snug">
                {badge.unlocked ? badge.desc : "??? (Keep playing to unlock)"}
              </p>

              {/* Lock Icon */}
              {!badge.unlocked && (
                <div className="absolute top-4 right-4 text-outline-variant bg-surface-container-high rounded-full w-6 h-6 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}