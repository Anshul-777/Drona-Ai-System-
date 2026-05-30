"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { storageAdapter } from "@/lib/storageAdapter";

interface PreparatoryQuest {
  id: string;
  title: string;
  requirement: string;
  progress: string;
  completed: boolean;
  icon: string;
}

interface PastTournament {
  id: string;
  name: string;
  date: string;
  champion: string;
  score: string;
  avatarSeed: string;
}

export default function TournamentsPage() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"preparation" | "archives">("preparation");
  
  const themeHex = "#c9a84c"; // Gold theme accent

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

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastVisible(false), 3000);
    return () => clearTimeout(t);
  }, [toastVisible]);

  const handleNotifyToggle = () => {
    const nextState = !isSubscribed;
    setIsSubscribed(nextState);
    if (nextState) {
      triggerToast("Notifications enabled! You will be alerted when the next bracket opens.");
    } else {
      triggerToast("Notifications disabled.");
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#06060a]" />;

  const userLevel = profile?.level || 1;

  const prepQuests: PreparatoryQuest[] = [
    {
      id: "q1",
      title: "Scholar Qualification Check",
      requirement: "Reach Level 5 to unlock global brackets.",
      progress: `Lvl ${userLevel} / Lvl 5`,
      completed: userLevel >= 5,
      icon: "grade"
    },
    {
      id: "q2",
      title: "Discipline Training",
      requirement: "Secure a 5-day study streak to build endurance.",
      progress: "5 / 5 Days",
      completed: true,
      icon: "local_fire_department"
    },
    {
      id: "q3",
      title: "Tactical Execution",
      requirement: "Complete 3 Mock Drills in the Learn environment.",
      progress: "2 / 3 Drills",
      completed: false,
      icon: "quiz"
    },
    {
      id: "q4",
      title: "Combat Preparedness",
      requirement: "Sustain an average precision score above 80%.",
      progress: "84% / 80%",
      completed: true,
      icon: "target"
    }
  ];

  const archives: PastTournament[] = [
    { id: "t1", name: "The Drona Debut Cup", date: "April 2026", champion: "Jeevan P.", score: "390/400", avatarSeed: "Aarav" },
    { id: "t2", name: "Kinematics Open Championship", date: "March 2026", champion: "Isha M.", score: "385/400", avatarSeed: "Isha" },
    { id: "t3", name: "Organic Chemistry League", date: "February 2026", champion: "Rohan S.", score: "372/400", avatarSeed: "Rohan" }
  ];

  return (
    <main className="w-full min-h-screen bg-[#06060a] text-white relative flex flex-col items-center overflow-hidden pb-20 selection:bg-[#c9a84c]/20">
      
      {/* ─── Premium Holographic Dark Background ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-thread.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#c9a84c]/5 rounded-full blur-[140px] mix-blend-screen" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#c9a84c]/3 rounded-full blur-[120px] mix-blend-screen" />
        
        {/* Subtle grid accent */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `linear-gradient(${themeHex} 1px, transparent 1px), linear-gradient(90deg, ${themeHex} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      {/* Floating Toast Notification */}
      <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl bg-white text-black shadow-2xl border border-neutral-200 transition-all duration-500 transform ${toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-[#c9a84c] text-xl animate-pulse">notifications_active</span>
        <span className="font-bold text-xs uppercase tracking-wider">{toastMessage}</span>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-12 relative z-10 animate-fadeSlideUp flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-4">
          <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-5 py-1.5 rounded-full flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a84c] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c9a84c]"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a84c]">Arena Standby</span>
          </div>

          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none uppercase">
            The Drona <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e5cb80]">Invitational</span>
          </h1>

          <div className="mt-2">
            <p className="font-display italic text-2xl md:text-3xl text-neutral-300 font-bold tracking-wide">
              {"\"Learn, Wait & Win.\""}
            </p>
            <p className="text-xs uppercase tracking-[0.25em] text-[#c9a84c] font-black mt-2">
              {"Keep the spirit active."}
            </p>
          </div>

          <p className="text-xs md:text-sm text-neutral-400 font-medium leading-relaxed max-w-xl mt-2">
            Our high-stakes weekly leagues verify academic mastery. Compete with top scholars nationwide to secure elite ranks, premium physical gear, and profile crowns.
          </p>
        </div>

        {/* ─── Main Standby Hub Card ─── */}
        <div className="bg-[#101015]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-[2rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full max-w-4xl mx-auto">
          
          {/* Glowing Sonar standby widget */}
          <div className="relative w-36 h-36 md:w-44 md:h-44 shrink-0 flex items-center justify-center">
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full border border-[#c9a84c]/20 animate-ping opacity-30" />
            <div className="absolute inset-4 rounded-full border border-[#c9a84c]/30 animate-pulse opacity-40" />
            <div className="absolute inset-8 rounded-full border border-[#c9a84c]/40 opacity-50" />
            
            {/* Center core */}
            <div className="w-16 h-16 rounded-full bg-[#161622] border border-[#c9a84c]/50 flex items-center justify-center relative shadow-[0_0_25px_rgba(201,168,76,0.2)]">
              <span className="material-symbols-outlined text-[32px] text-[#c9a84c] animate-[spin_8s_linear_infinite]">hourglass_empty</span>
            </div>
          </div>

          {/* Standby Copy and Subscription button */}
          <div className="flex-1 flex flex-col justify-center gap-4 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Current Arena Status</span>
            <h2 className="text-xl md:text-2xl font-black text-white">No active tournament is currently running</h2>
            
            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
              Drona values authentic competitive integrity. Upcoming tournament brackets are under system preparation and may take time or experience scheduling adjustments. We avoid artificial countdown timers. You will receive an immediate notification as soon as registrations are officially authorized.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start mt-2">
              <button
                onClick={handleNotifyToggle}
                className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 border ${
                  isSubscribed
                    ? "bg-[#c9a84c]/10 border-[#c9a84c]/30 text-[#c9a84c]"
                    : "bg-white text-black border-white hover:bg-neutral-100"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {isSubscribed ? "check_circle" : "notifications"}
                </span>
                {isSubscribed ? "Notification Enabled" : "Notify Me When Active"}
              </button>
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                1,422 scholars subscribed
              </span>
            </div>
          </div>
        </div>

        {/* Tabs for Preparatory Training vs Historical Archives */}
        <div className="flex justify-center border-b border-white/5 max-w-4xl mx-auto w-full mt-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("preparation")}
              className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === "preparation" ? "text-[#c9a84c]" : "text-neutral-500 hover:text-white"
              }`}
            >
              Preparatory Training
              {activeTab === "preparation" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c9a84c]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("archives")}
              className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === "archives" ? "text-[#c9a84c]" : "text-neutral-500 hover:text-white"
              }`}
            >
              Historical Archives
              {activeTab === "archives" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c9a84c]" />
              )}
            </button>
          </div>
        </div>

        {/* ─── Column Section ─── */}
        <div className="max-w-4xl mx-auto w-full">
          {activeTab === "preparation" ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-1.5 mb-2">
                <h3 className="text-lg font-black text-white">Preparatory League Checklist</h3>
                <p className="text-xs text-neutral-400 font-medium">
                  {"Keep the spirit active by completing these qualifications before the next championship event begins."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prepQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className={`p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                      quest.completed
                        ? "bg-[#101015]/40 border-neutral-800/80 opacity-70"
                        : "bg-[#12121a] border-white/5 hover:border-[#c9a84c]/30"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      quest.completed
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        : "bg-neutral-800/50 border-neutral-700/50 text-[#c9a84c]"
                    }`}>
                      <span className="material-symbols-outlined text-lg">
                        {quest.completed ? "task_alt" : quest.icon}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm text-white">{quest.title}</h4>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          quest.completed ? "bg-emerald-500/10 text-emerald-400" : "bg-neutral-800 text-neutral-400"
                        }`}>
                          {quest.completed ? "COMPLETED" : "IN PROGRESS"}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 leading-normal">{quest.requirement}</p>
                      <div className="flex justify-between items-center mt-3 text-[10px] font-bold text-neutral-500 uppercase">
                        <span>Progress</span>
                        <span className={quest.completed ? "text-emerald-400" : "text-white"}>{quest.progress}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-1.5 mb-2">
                <h3 className="text-lg font-black text-white">Championship Archives</h3>
                <p className="text-xs text-neutral-400 font-medium">
                  Past Champions of Drona weekly invitationals. Historical results verified on-chain.
                </p>
              </div>

              <div className="border border-white/5 bg-[#12121a]/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#12121a] border-b border-white/5 text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                        <th className="px-6 py-4">Tournament Title</th>
                        <th className="px-6 py-4">Date Completed</th>
                        <th className="px-6 py-4">Champion</th>
                        <th className="px-6 py-4 text-right">Winning Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-neutral-300">
                      {archives.map((item) => (
                        <tr key={item.id} className="hover:bg-[#12121a]/80 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-bold text-white">{item.name}</span>
                          </td>
                          <td className="px-6 py-4 text-neutral-400">{item.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full border border-[#c9a84c]/50 overflow-hidden relative bg-white">
                                <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.avatarSeed}`} alt={item.champion} fill className="object-cover" />
                              </div>
                              <span className="font-bold text-white">{item.champion}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-[#c9a84c]">
                            {item.score}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}