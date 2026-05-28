"use client";

import { useState, useEffect } from "react";
import { achievements, Achievement } from "@/lib/data/achievements";
import { useNotifications } from "@/context/NotificationContext";
import { storageAdapter, USE_LOCAL_STORAGE } from "@/lib/storageAdapter";
import { getAchievementIcon } from "@/components/ui/AchievementIcons";

export default function AchievementsPage() {
  const { addNotification } = useNotifications();
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterRarity, setFilterRarity] = useState<string>("All");
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await storageAdapter.getUserAchievements();
      
      // Auto-unlock the test badge if it's not already unlocked
      if (!data.unlocked.includes("test-infinite-claim")) {
        data.unlocked.push("test-infinite-claim");
        if (USE_LOCAL_STORAGE) {
           localStorage.setItem("drona_unlocked_achievements", JSON.stringify(data.unlocked));
        }
      }

      setUnlockedIds(data.unlocked);
      setClaimedIds(data.claimed);
      setTotalXP(data.totalXp);
    };
    fetchUserData();
  }, []);

  const handleClaim = async (achievement: Achievement) => {
    const isTestBadge = achievement.id === "test-infinite-claim";
    if (claimedIds.includes(achievement.id) && !isTestBadge) return;
    
    // Optimistic Update
    if (!claimedIds.includes(achievement.id)) {
      setClaimedIds(prev => [...prev, achievement.id]);
    }
    setTotalXP(prev => prev + achievement.xpReward);
    
    addNotification({
      title: achievement.name,
      message: "Trophy Claimed!",
      type: "achievement",
      achievementId: achievement.id,
    });
    setTimeout(() => {
      addNotification({
        title: `Achievement Claimed: ${achievement.name}`,
        message: `You claimed +${achievement.xpReward} XP for "${achievement.name}". ${achievement.description}`,
        type: "system",
        href: "/achievements",
      }, { silent: true });
    }, 200);

    // DB Update
    await storageAdapter.claimAchievement(achievement.id, achievement.xpReward);
  };

  const rarities = ["All", "Claimed", "Novice", "Adept", "Rare", "Epic", "Legendary"];
  const filtered = filterRarity === "All" 
    ? achievements 
    : filterRarity === "Claimed"
      ? achievements.filter(a => claimedIds.includes(a.id))
      : achievements.filter(a => a.rarity === filterRarity);
  const completionPct = Math.round((claimedIds.length / achievements.length) * 100);

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-6 animate-fadeIn relative">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-outline-variant/30 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[16px] text-[#c9a84c]">emoji_events</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a84c]">Trophies & Milestones</span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-on-surface tracking-tight">Achievements</h1>
        </div>
        <div className="flex items-center gap-6 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-5 py-3 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-outline-variant uppercase tracking-wider mb-0.5">Total XP</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-2xl text-[#c9a84c] leading-none">{totalXP.toLocaleString()}</span>
              <span className="font-bold text-on-surface-variant text-sm leading-none">XP</span>
            </div>
          </div>
          <div className="w-px h-8 bg-outline-variant/30" />
          <div className="flex flex-col items-start min-w-[100px]">
            <div className="flex justify-between w-full text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <span className="text-outline-variant">{claimedIds.length}/{achievements.length}</span>
              <span className="text-[#c9a84c]">{completionPct || 0}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-variant/50 rounded-full overflow-hidden">
              <div className="h-full bg-[#c9a84c] rounded-full transition-all duration-500" style={{ width: `${completionPct || 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-6">
        {rarities.map(r => (
          <button key={r} onClick={() => setFilterRarity(r)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${filterRarity === r ? "bg-[#c9a84c] text-white border-[#c9a84c]" : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:border-[#c9a84c]/50"
              }`}>{r}</button>
        ))}
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4 pb-20">
        {filtered.map((achievement) => {
          const isUnlocked = unlockedIds.includes(achievement.id);
          const isClaimed = claimedIds.includes(achievement.id);
          const isSelected = selectedId === achievement.id;
          const isActive = isClaimed || isUnlocked;

          return (
            <div key={achievement.id} className="relative" style={{ zIndex: isSelected ? 50 : 1 }}>
              {/* The wrapper holds both badge + expansion so hover/click persists */}
              <div
                className="flex items-stretch"
                onMouseLeave={() => { if (isSelected) setSelectedId(null); }}
              >
                {/* ─── Shield Badge Card ─── */}
                <div
                  onClick={() => setSelectedId(isSelected ? null : achievement.id)}
                  className={`relative cursor-pointer transition-all duration-300 w-32 shrink-0 ${isSelected ? 'z-50 scale-105' : 'hover:scale-105'}`}
                >
                  {isClaimed && (
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  )}
                  <svg viewBox="-20 -10 200 240" className="w-full h-auto drop-shadow-2xl" style={{ filter: isActive ? `drop-shadow(0 0 12px ${achievement.badgeColor}aa)` : 'drop-shadow(0 0 8px rgba(255,255,255,0.15))' }}>
                    <defs>
                      <clipPath id={`shield-${achievement.id}`}>
                        <path d="M10,30 L150,30 L150,170 L80,190 L10,170 Z" />
                      </clipPath>
                      <linearGradient id={`grad-${achievement.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isActive ? `${achievement.badgeColor}30` : '#33333320'} />
                        <stop offset="100%" stopColor={isActive ? achievement.badgeBg : '#1a1a1e'} />
                      </linearGradient>
                      <pattern id={`pattern-${achievement.id}`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="12" height="12" fill="none" />
                        <line x1="0" y1="0" x2="0" y2="12" stroke={isActive ? achievement.badgeColor : '#ffffff'} strokeWidth="2" opacity="0.12" />
                      </pattern>
                    </defs>

                    {/* Shield Base */}
                    <path d="M10,30 L150,30 L150,170 L80,190 L10,170 Z"
                      fill={`url(#grad-${achievement.id})`}
                      stroke={isActive ? `${achievement.badgeColor}80` : '#44444450'}
                      strokeWidth={isSelected ? "3" : "1.5"} />
                    
                    {/* Background Pattern */}
                    <path d="M10,30 L150,30 L150,170 L80,190 L10,170 Z"
                      fill={`url(#pattern-${achievement.id})`} />

                    {/* Inner Accent Line */}
                    <path d="M18,36 L142,36 L142,165 L80,183 L18,165 Z"
                      fill="none"
                      stroke={isActive ? `${achievement.badgeColor}25` : '#ffffff08'}
                      strokeWidth="0.8" />

                    {/* Lock overlay */}
                    {!isUnlocked && (
                      <>
                        <rect x="-20" y="-10" width="200" height="250" fill="rgba(0,0,0,0.6)" clipPath={`url(#shield-${achievement.id})`} />
                        <text x="80" y="115" textAnchor="middle" fill="#ffffff40" fontSize="36" fontFamily="Material Symbols Outlined">&#xe897;</text>
                      </>
                    )}

                    {/* Central Area (behind icon) */}
                    <circle cx="80" cy="115" r="32" fill={isActive ? `${achievement.badgeBg}` : '#1a1a1e'} opacity="0.8" />
                    <circle cx="80" cy="115" r="27" fill="none" stroke={isActive ? `${achievement.badgeColor}20` : '#ffffff06'} strokeWidth="0.8" />

                    {/* Decorative dots on circle */}
                    {[0, 90, 180, 270].map(deg => {
                      const rad = (deg * Math.PI) / 180;
                      return (
                        <circle key={deg}
                          cx={80 + 32 * Math.cos(rad)}
                          cy={115 + 32 * Math.sin(rad)}
                          r="2.5"
                          fill={isActive ? `${achievement.badgeColor}` : '#44444480'} />
                      );
                    })}

                    {/* Progress Bar inside SVG */}
                    <rect x="30" y="165" width="100" height="4" fill="#00000080" rx="2" />
                    <rect x="30" y="165" width={isUnlocked ? 100 : 0} height="4" fill={isActive ? achievement.badgeColor : 'transparent'} rx="2" />

                    {/* Ribbon / Flag for Name on TOP SIDE */}
                    <path d="M-10,35 L170,35 L160,55 L170,75 L-10,75 L0,55 Z" 
                          fill={isActive ? '#1a1a1e' : '#111'} 
                          stroke={isActive ? achievement.badgeColor : '#333'} 
                          strokeWidth="1.5" />
                    {/* Ribbon Folds */}
                    <path d="M-10,35 L0,25 L0,35 Z" fill={isActive ? achievement.badgeColor : '#333'} opacity="0.6"/>
                    <path d="M170,35 L160,25 L160,35 Z" fill={isActive ? achievement.badgeColor : '#333'} opacity="0.6"/>

                    {/* Name text on Ribbon */}
                    <text x="80" y="59" textAnchor="middle"
                      fill={isActive ? '#ffffff' : '#ffffff60'}
                      fontSize="11" fontWeight="800" letterSpacing="0.5">
                      {achievement.isSecret && !isUnlocked ? '???' : achievement.name}
                    </text>
                  </svg>

                  {/* SVG Icon from AchievementIcons.tsx */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '15%' }}>
                    {getAchievementIcon(
                      achievement.id, 
                      isActive ? achievement.badgeColor : '#666', 
                      `w-14 h-14 transition-all duration-300 ${isClaimed ? 'drop-shadow-[0_0_12px_currentColor]' : ''}`
                    )}
                  </div>
                </div>

                {/* ─── Expansion Panel (connected, no gap) ─── */}
                {isSelected && (
                  <div
                    className="absolute top-0 left-[calc(100%)] w-64 rounded-r-2xl overflow-hidden shadow-2xl animate-fadeIn"
                    style={{
                      background: achievement.badgeBg,
                      borderTop: `2px solid ${achievement.badgeColor}40`,
                      borderRight: `2px solid ${achievement.badgeColor}40`,
                      borderBottom: `2px solid ${achievement.badgeColor}40`,
                      boxShadow: `8px 4px 32px rgba(0,0,0,0.5), 0 0 0 1px ${achievement.badgeColor}10`,
                      minHeight: '100%',
                    }}
                    onMouseLeave={() => setSelectedId(null)}
                    onMouseEnter={() => setSelectedId(achievement.id)}
                  >
                    {/* Connector bar */}
                    <div className="absolute left-0 top-[30%] w-[2px] h-[40%]"
                      style={{ background: `${achievement.badgeColor}40` }} />

                    <div className="p-5 flex flex-col h-full">
                      {/* Title */}
                      <h4 className="font-display font-bold text-base text-white leading-tight mb-1">{achievement.name}</h4>
                      <span className="text-[9px] font-black uppercase tracking-widest mb-3"
                        style={{ color: achievement.badgeColor }}>{achievement.rarity}</span>

                      <div className="w-full h-px mb-3" style={{ background: `${achievement.badgeColor}25` }} />

                      <p className="text-[11px] text-white/60 font-medium leading-relaxed mb-3">
                        {achievement.description}
                      </p>

                      {/* Rule */}
                      <div className="flex items-start gap-2 mb-4 rounded-lg p-2.5" style={{ background: `${achievement.badgeColor}08` }}>
                        <span className="material-symbols-outlined text-[13px] mt-0.5 shrink-0" style={{ color: `${achievement.badgeColor}80` }}>target</span>
                        <span className="text-[10px] font-medium leading-relaxed" style={{ color: `${achievement.badgeColor}aa` }}>
                          {achievement.rule}
                        </span>
                      </div>

                      {/* XP */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Reward</span>
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full"
                          style={{ background: `${achievement.badgeColor}15`, border: `1px solid ${achievement.badgeColor}25` }}>
                          <span className="material-symbols-outlined text-[13px]" style={{ color: achievement.badgeColor }}>stars</span>
                          <span className="font-black text-xs" style={{ color: achievement.badgeColor }}>+{achievement.xpReward} XP</span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="mt-auto">
                        {isClaimed ? (
                          <div className="flex flex-col gap-2">
                            <div className="w-full py-2.5 rounded-xl text-center text-[11px] font-bold uppercase tracking-wider text-white/30 border border-white/10">
                              ✓ Claimed
                            </div>
                            {achievement.id === "test-infinite-claim" && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleClaim(achievement); }}
                                className="w-full py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.97]"
                                style={{
                                  background: achievement.badgeColor,
                                  color: '#000',
                                  boxShadow: `0 4px 20px ${achievement.badgeColor}50`,
                                }}>
                                Claim Again
                              </button>
                            )}
                          </div>
                        ) : isUnlocked ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleClaim(achievement); }}
                            className="w-full py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.97]"
                            style={{
                              background: achievement.badgeColor,
                              color: '#000',
                              boxShadow: `0 4px 20px ${achievement.badgeColor}50`,
                            }}>
                            Claim Trophy
                          </button>
                        ) : (
                          <div className="w-full py-2.5 rounded-xl text-center text-[11px] font-bold uppercase tracking-wider text-white/25 border border-white/10">
                            🔒 Locked
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}