"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// --- Custom SVG Watermarks ---
const WatermarkSwords = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full fill-[#f3efe2]">
    <g transform="rotate(45 50 50)">
      <rect x="43" y="10" width="14" height="55" rx="3" />
      <rect x="30" y="65" width="40" height="12" rx="6" />
      <rect x="43" y="77" width="14" height="15" rx="3" />
    </g>
    <g transform="rotate(-45 50 50)">
      <rect x="43" y="10" width="14" height="55" rx="3" />
      <rect x="30" y="65" width="40" height="12" rx="6" />
      <rect x="43" y="77" width="14" height="15" rx="3" />
    </g>
  </svg>
);

const WatermarkQuestion = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full fill-[#f3efe2] font-display font-black">
    <text x="50" y="80" fontSize="80" textAnchor="middle" dominantBaseline="middle">?</text>
  </svg>
);

const WatermarkScience = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#f3efe2] fill-transparent" strokeWidth="8" strokeLinecap="round">
    <circle cx="50" cy="50" r="15" className="fill-[#f3efe2]" />
    <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(30 50 50)" />
    <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(-30 50 50)" />
    <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(90 50 50)" />
  </svg>
);

const WatermarkVerified = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full fill-[#f3efe2]">
    <path d="M50 5 L60 20 L75 20 L80 35 L95 45 L85 60 L90 75 L75 80 L70 95 L50 85 L30 95 L25 80 L10 75 L15 60 L5 45 L20 35 L25 20 L40 20 Z" />
    <path d="M40 55 L50 65 L70 35" stroke="#fcfaf4" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const WatermarkTrophy = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full fill-[#f3efe2]">
      <path d="M30 20 L70 20 L65 50 C65 60 55 70 50 70 C45 70 35 60 35 50 Z" />
      <rect x="45" y="70" width="10" height="15" />
      <rect x="35" y="85" width="30" height="5" rx="2" />
      <path d="M30 20 C20 20 15 30 20 40 C25 50 35 45 35 45" fill="none" stroke="#f3efe2" strokeWidth="6" strokeLinecap="round" />
      <path d="M70 20 C80 20 85 30 80 40 C75 50 65 45 65 45" fill="none" stroke="#f3efe2" strokeWidth="6" strokeLinecap="round" />
    </svg>
);
// ------------------------------

type Reward = { type: string; amount: number | string; icon: string; color: string; bgColor: string };
type Quest = {
  id: number;
  title: string;
  subObjective: string;
  desc: string;
  xp: number;
  coins: number;
  status: 'claimable' | 'active' | 'locked' | 'claimed';
  icon: string;
  rewards: Reward[];
  link?: string;
  svgWatermark?: React.ReactNode;
};
type QuestGroup = {
  id: string;
  title: string;
  icon: string;
  quests: Quest[];
};
type SidebarTab = {
  id: string;
  icon: string;
  groups: QuestGroup[];
};

export default function MissionsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string>("main");
  const [activeQuestId, setActiveQuestId] = useState<number>(1);
  const [claimedIds, setClaimedIds] = useState<number[]>([1]); // Diagnostic Master claimed by default
  const [userXp, setUserXp] = useState(0);
  const [userCoins, setUserCoins] = useState(0);
  
  // Achievement Animation State
  const [animatingClaim, setAnimatingClaim] = useState<{active: boolean, xp: number, coins: number, title: string} | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabsData: SidebarTab[] = [
    {
      id: "main",
      icon: "explore",
      groups: [
        {
          id: "tutorial",
          title: "Tutorial Quests",
          icon: "school",
          quests: [
            {
              id: 1,
              title: "Diagnostic Master",
              subObjective: "Return to the Learning Hub",
              desc: "The learning engine requires fresh data. A conversation with the diagnostic system might help you calibrate your personalized curriculum. This ensures your learning path is fully optimized and adapted to your current cognitive load.",
              xp: 150,
              coins: 2500,
              status: "claimed",
              icon: "quiz",
              link: "/learning",
              svgWatermark: <WatermarkQuestion />,
              rewards: [
                { type: 'xp', amount: 150, icon: 'emoji_events', color: '#c9a84c', bgColor: '#fbf8f1' },
                { type: 'coins', amount: '2,500', icon: 'toll', color: '#94a3b8', bgColor: '#f1f5f9' },
                { type: 'mystery', amount: '???', icon: 'help', color: '#f43f5e', bgColor: '#fff1f2' }
              ]
            },
            {
              id: 2,
              title: "Socratic Engagement",
              subObjective: "Talk to Dr. Aurelius",
              desc: "Curiosity is the engine of intellect. Engage with Drona AI in the Learning Hub and ask deep conceptual questions to further understand your current chapter. A brief conversation might help you move closer to the truth and unravel complex molecular structures.",
              xp: 200,
              coins: 1000,
              status: "claimable",
              icon: "forum",
              link: "/agent/chemistry",
              svgWatermark: <WatermarkQuestion />,
              rewards: [
                { type: 'xp', amount: 200, icon: 'emoji_events', color: '#c9a84c', bgColor: '#fbf8f1' },
                { type: 'coins', amount: '1,000', icon: 'toll', color: '#94a3b8', bgColor: '#f1f5f9' }
              ]
            }
          ]
        },
        {
          id: "archon",
          title: "Archon Quests",
          icon: "diamond",
          quests: [
            {
              id: 3,
              title: "Flawless Execution",
              subObjective: "Score 100% on a chapter quiz",
              desc: "Thanks to your efforts, the elemental flow of knowledge has returned to normal. Complete any chapter quiz in the Test Environment and achieve a perfect score to prove your absolute mastery of the subject matter. It's time to report back and cement your knowledge.",
              xp: 500,
              coins: 5000,
              status: "active",
              icon: "verified",
              link: "/test",
              svgWatermark: <WatermarkVerified />,
              rewards: [
                { type: 'xp', amount: 500, icon: 'emoji_events', color: '#c9a84c', bgColor: '#fbf8f1' },
                { type: 'coins', amount: '5,000', icon: 'toll', color: '#94a3b8', bgColor: '#f1f5f9' },
                { type: 'mystery', amount: '???', icon: 'auto_awesome', color: '#8b5cf6', bgColor: '#f5f3ff' }
              ]
            },
            {
              id: 4,
              title: "Shadow Over The Arena",
              subObjective: "Return to the Arena Headquarters",
              desc: "Put your skills to the ultimate test. Enter the Arena and face a Boss. Whether you win or lose, the experience gained will forge you into a stronger learner and prepare you for the ultimate exams.",
              xp: 300,
              coins: 1500,
              status: "locked",
              icon: "swords",
              link: "/game/boss",
              svgWatermark: <WatermarkSwords />,
              rewards: [
                { type: 'xp', amount: 300, icon: 'emoji_events', color: '#c9a84c', bgColor: '#fbf8f1' },
                { type: 'mystery', amount: '???', icon: 'help', color: '#f43f5e', bgColor: '#fff1f2' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "world",
      icon: "map",
      groups: [
        {
          id: "exploration",
          title: "World Exploration",
          icon: "public",
          quests: [
            {
              id: 5,
              title: "The Periodic Table",
              subObjective: "Memorize the first 20 elements",
              desc: "Understanding the building blocks of matter is essential for advanced alchemy and synthesis. Review the periodic trends in the Chemistry workspace to permanently unlock your synthesis abilities.",
              xp: 100,
              coins: 500,
              status: "active",
              icon: "science",
              link: "/agent/chemistry",
              svgWatermark: <WatermarkScience />,
              rewards: [
                { type: 'xp', amount: 100, icon: 'emoji_events', color: '#c9a84c', bgColor: '#fbf8f1' },
                { type: 'coins', amount: 500, icon: 'toll', color: '#94a3b8', bgColor: '#f1f5f9' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "milestones",
      icon: "stars",
      groups: [
        {
          id: "achievements",
          title: "Academic Milestones",
          icon: "military_tech",
          quests: [
            {
              id: 7,
              title: "First Steps",
              subObjective: "Log in for 7 consecutive days",
              desc: "Consistency is key to mastery. Build a habit by logging in every day for a week. Your dedication to the curriculum will yield exponential results over time.",
              xp: 1000,
              coins: 10000,
              status: "claimable",
              icon: "calendar_today",
              link: "/learning",
              svgWatermark: <WatermarkTrophy />,
              rewards: [
                { type: 'xp', amount: '1,000', icon: 'emoji_events', color: '#c9a84c', bgColor: '#fbf8f1' },
                { type: 'coins', amount: '10,000', icon: 'toll', color: '#94a3b8', bgColor: '#f1f5f9' },
                { type: 'mystery', amount: '???', icon: 'workspace_premium', color: '#f59e0b', bgColor: '#fffbeb' }
              ]
            }
          ]
        }
      ]
    },
    { id: "events", icon: "inventory_2", groups: [] },
    { id: "companion", icon: "person", groups: [] },
    { id: "settings", icon: "settings", groups: [] }
  ];

  if (!mounted) return <div className="min-h-screen bg-[#fcfbf7]" />;

  const handleClaim = (quest: Quest) => {
    if (!claimedIds.includes(quest.id)) {
      setClaimedIds([...claimedIds, quest.id]);
      
      // Trigger Beautiful Center Animation
      setAnimatingClaim({ active: true, xp: quest.xp, coins: quest.coins, title: quest.title });
      
      // Update resources after a slight delay for dramatic effect
      setTimeout(() => {
        setUserXp(prev => prev + quest.xp);
        setUserCoins(prev => prev + quest.coins);
      }, 800);

      // Hide animation
      setTimeout(() => {
        setAnimatingClaim(null);
      }, 3500);
    }
  };

  const handleNavigate = (link?: string) => {
    if (link) {
      router.push(link);
    }
  };

  const activeTab = tabsData.find(t => t.id === activeTabId) || tabsData[0];
  
  // Find active quest within current tab, or fallback
  let activeQuest = activeTab.groups.flatMap(g => g.quests).find(q => q.id === activeQuestId);
  if (!activeQuest && activeTab.groups.length > 0 && activeTab.groups[0].quests.length > 0) {
    activeQuest = activeTab.groups[0].quests[0];
  }

  const isClaimed = activeQuest ? claimedIds.includes(activeQuest.id) : false;
  const currentStatus = isClaimed ? 'claimed' : (activeQuest?.status || 'locked');

  return (
    <main className="w-full h-[calc(100vh-64px)] bg-[#fcfaf4] relative flex overflow-hidden text-gray-900 font-body selection:bg-[#c9a84c]/30">
      
      {/* --- Sleek Claim Notification Overlay --- */}
      {animatingClaim && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="flex items-center gap-4 bg-gray-900/95 backdrop-blur-md px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(201,168,76,0.3)] border border-[#c9a84c]/30 animate-in slide-in-from-top-10 fade-in zoom-in duration-500">
            
            <div className="w-12 h-12 bg-gradient-to-br from-[#fde68a] to-[#c9a84c] rounded-full shadow-[0_0_15px_rgba(201,168,76,0.5)] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
            </div>
            
            <div className="flex flex-col pr-4">
               <h2 className="text-[#c9a84c] font-bold tracking-widest text-[10px] uppercase drop-shadow-sm">Quest Completed</h2>
               <h1 className="text-lg font-display font-bold text-white tracking-tight">{animatingClaim.title}</h1>
            </div>

            <div className="w-px h-8 bg-gray-700 mx-2" />

            <div className="flex items-center gap-4 pl-2">
               <div className="flex items-center gap-1.5">
                 <span className="material-symbols-outlined text-[#c9a84c] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                 <span className="font-bold text-sm text-gray-200">+{animatingClaim.xp}</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <span className="material-symbols-outlined text-[#94a3b8] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
                 <span className="font-bold text-sm text-gray-200">+{animatingClaim.coins}</span>
               </div>
            </div>

          </div>
        </div>
      )}

      {/* Far Left Navigation Sidebar */}
      <div className="w-[80px] h-full shrink-0 border-r border-gray-200 flex flex-col items-center py-6 gap-6 z-20 bg-white">
        {tabsData.map((tab) => (
            <div 
              key={tab.id} 
              onClick={() => setActiveTabId(tab.id)}
              className="relative group cursor-pointer flex items-center justify-center w-full h-12"
            >
                {activeTabId === tab.id ? (
                   <div className="w-11 h-11 rounded-full bg-[#c9a84c] text-white flex items-center justify-center shadow-md">
                       <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>{tab.icon}</span>
                   </div>
                ) : (
                   <span className="material-symbols-outlined text-[24px] text-gray-400 group-hover:text-[#c9a84c] transition-colors duration-300">
                       {tab.icon}
                   </span>
                )}
            </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full flex flex-col relative z-10">
        
        {/* Header Area */}
        <div className="flex justify-between items-center w-full px-10 py-8 shrink-0">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-[#c9a84c] flex items-center justify-center text-white shadow-sm">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
               </div>
               <h1 className="font-display font-black text-[28px] tracking-tight text-gray-900">Quests</h1>
            </div>
            
            {/* User Real Resources Widget matching the image exactly */}
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[22px] text-[#94a3b8]" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
                    <span className="font-display font-bold text-[20px] leading-none text-gray-900">{userCoins.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[22px] text-[#c9a84c]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                    <span className="font-display font-bold text-[20px] leading-none text-gray-900">{userXp.toLocaleString()}</span>
                </div>
            </div>
        </div>

        {/* Layout Grid */}
        <div className="flex h-[calc(100%-100px)] w-full">
            
            {/* Left Panel: List (Scrollable) */}
            <div className="w-[380px] flex flex-col gap-8 overflow-y-auto pl-10 pr-4 pb-12 custom-scrollbar">
               {activeTab.groups.length === 0 && (
                   <div className="text-gray-400 text-sm italic mt-10">No quests available in this category.</div>
               )}
               {activeTab.groups.map((category) => (
                   <div key={category.id} className="flex flex-col gap-2">
                       {/* Category Header (Gold Background) */}
                       <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f5efd6] rounded w-fit mb-1">
                           <span className="material-symbols-outlined text-[15px] text-[#c9a84c]" style={{ fontVariationSettings: "'FILL' 1" }}>{category.icon}</span>
                           <h2 className="font-bold text-[11px] text-[#b08d3a] tracking-widest uppercase">{category.title}</h2>
                       </div>

                       {/* Quest Items */}
                       <div className="flex flex-col gap-1">
                           {category.quests.map((quest) => {
                               const isQuestClaimed = claimedIds.includes(quest.id);
                               const questStatus = isQuestClaimed ? 'claimed' : quest.status;
                               const isSelected = activeQuestId === quest.id;

                               return (
                                   <div 
                                      key={quest.id}
                                      onClick={() => setActiveQuestId(quest.id)}
                                      className={`group relative flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg transition-all duration-300 ${
                                          isSelected 
                                            ? 'bg-[#f4efe1]' // Beige selected state
                                            : 'hover:bg-black/[0.03]'
                                      }`}
                                   >
                                       <div className="flex items-center gap-3">
                                            {/* Status Icon */}
                                            <div className="flex items-center justify-center">
                                                {questStatus === 'claimable' ? (
                                                    <div className="w-5 h-5 rounded-full border-2 border-[#10b981] flex items-center justify-center animate-pulse">
                                                        <div className="w-2.5 h-2.5 bg-[#10b981] rounded-full" />
                                                    </div>
                                                ) : questStatus === 'claimed' ? (
                                                    <div className="w-5 h-5 rounded-full bg-[#c9a84c] flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1", fontWeight: 'bold' }}>check</span>
                                                    </div>
                                                ) : questStatus === 'locked' ? (
                                                    <span className="material-symbols-outlined text-gray-400 text-[20px]">lock</span>
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-gray-400 transition-colors" />
                                                )}
                                           </div>
                                           
                                           <span className={`font-semibold text-[14px] ${isSelected ? 'text-gray-900' : 'text-gray-600'} ${questStatus === 'claimed' ? 'line-through decoration-gray-400 text-gray-800' : ''}`}>
                                               {quest.title}
                                           </span>
                                       </div>

                                       <span className="text-[11px] font-bold text-gray-400 group-hover:text-gray-500 transition-colors">
                                            {quest.xp}XP
                                       </span>
                                   </div>
                               );
                           })}
                       </div>
                   </div>
               ))}
            </div>

            {/* Right Panel: Details (Scrollable) */}
            <div className="flex-1 flex flex-col relative h-full px-12 pb-12 overflow-y-auto custom-scrollbar">
                
                {activeQuest ? (
                    <div className="relative z-10 flex flex-col h-full w-full">
                        
                        {/* Massive Custom SVG Watermark Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] pointer-events-none opacity-80 z-0 select-none">
                            {activeQuest.svgWatermark || <WatermarkQuestion />}
                        </div>

                        {/* Header */}
                        <div className="mb-6 relative z-10">
                            <h2 className="font-display font-black text-[38px] text-[#1a202c] mb-3 tracking-tight">
                                {activeQuest.title}
                            </h2>
                            <div className="flex items-center gap-1.5 text-[#b08d3a]">
                                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                <span className="font-bold text-[15px] tracking-wide">{activeQuest.subObjective}</span>
                            </div>
                        </div>

                        {/* Description (Expanded width) */}
                        <div className="mb-10 w-full pr-12 relative z-10">
                            <p className="text-gray-600 text-[15px] leading-relaxed font-medium">
                                {activeQuest.desc}
                            </p>
                        </div>

                        <div className="mt-auto mb-12 relative z-10 flex items-end justify-between">
                            {/* Rewards Box (Bottom Left) */}
                            <div>
                                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Quest Rewards</h3>
                                <div className="flex items-center gap-3">
                                    {activeQuest.rewards.map((reward, idx) => (
                                        <div key={idx} className="relative w-[70px] h-[85px] rounded shadow-sm flex flex-col items-center overflow-hidden border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all duration-300" style={{ backgroundColor: reward.bgColor }}>
                                            
                                            {/* Rarity Glow Top Border */}
                                            <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: reward.color }} />
                                            
                                            <div className="flex-1 flex items-center justify-center w-full pt-2">
                                                <span className="material-symbols-outlined text-[26px]" style={{ color: reward.color, fontVariationSettings: "'FILL' 1" }}>{reward.icon}</span>
                                            </div>
                                            
                                            <div className="h-7 w-full text-gray-700 flex items-center justify-center border-t border-black/5 bg-black/[0.03]">
                                                <span className="text-[10px] font-bold tracking-wider">
                                                    {reward.amount}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action / Status (Bottom Right) */}
                            <div className="shrink-0">
                                {currentStatus === 'claimable' && (
                                    <button 
                                      onClick={() => handleClaim(activeQuest!)}
                                      className="px-10 py-3.5 bg-gradient-to-r from-[#c9a84c] to-[#b08d3a] hover:from-[#b08d3a] hover:to-[#9a7b32] text-white font-bold text-[14px] rounded tracking-widest transition-all hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(201,168,76,0.4)] active:scale-95 flex items-center justify-center gap-2 uppercase shadow-[0_0_15px_rgba(201,168,76,0.6)] animate-pulse"
                                    >
                                      Claim Rewards
                                    </button>
                                )}
                                {currentStatus === 'active' && (
                                    <button 
                                      onClick={() => handleNavigate(activeQuest?.link)}
                                      className="px-10 py-3.5 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-bold text-[14px] rounded tracking-widest transition-all hover:shadow-lg hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 uppercase shadow-sm group"
                                    >
                                      Navigate
                                      <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-gray-900 transition-colors group-hover:translate-x-1">arrow_forward</span>
                                    </button>
                                )}
                                {currentStatus === 'locked' && (
                                    <div className="px-10 py-3.5 bg-[#e2e8f0]/60 text-gray-500 font-bold text-[14px] rounded tracking-widest flex items-center justify-center gap-2 uppercase border border-gray-200/50">
                                      <span className="material-symbols-outlined text-[18px]">lock</span>
                                      Locked
                                    </div>
                                )}
                                {currentStatus === 'claimed' && (
                                    <div className="flex items-center gap-2 text-gray-400 font-bold text-[14px] tracking-widest uppercase">
                                      <span className="material-symbols-outlined text-[20px]" style={{ fontWeight: 'bold' }}>check</span>
                                      Completed
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full w-full text-gray-400 italic">
                        Select a quest to view details.
                    </div>
                )}
            </div>
            
        </div>
      </div>
    </main>
  );
}