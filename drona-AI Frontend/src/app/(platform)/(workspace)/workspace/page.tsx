"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WorkspaceDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const themeHex = "#00c896"; // Teal for Workspace Env

  if (!mounted) return null;

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-8 animate-fadeIn transition-all duration-300 relative">

      {/* ─── Premium Watermark ─── */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] overflow-hidden pointer-events-none z-0 opacity-20 select-none">
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${themeHex}08 10px, ${themeHex}08 20px)` }} />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-surface to-surface" />
        <span className="material-symbols-outlined absolute top-4 right-12 text-[250px] -rotate-12 translate-x-10 -translate-y-10 drop-shadow-2xl" style={{ color: `${themeHex}15` }}>
          calendar_month
        </span>
      </div>

      <div className="mb-12 relative z-10 animate-slideUp" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-on-surface tracking-tight mb-3">Your Workspace</h1>
        <p className="text-on-surface-variant font-medium max-w-2xl text-sm md:text-base">
          Manage your schedule, track your focus sprints, and access your organized knowledge database.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">

        {/* ─── Focus Timer (4-col) ─── */}
        <div className="xl:col-span-4 animate-slideUp" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-8 shadow-sm h-full flex flex-col items-center text-center">
            <h3 className="font-display text-xl font-bold text-on-surface mb-8 w-full text-left flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: themeHex }}>timer</span>
              Focus Sprint
            </h3>

            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-container-high" />
                <circle cx="96" cy="96" r="90" fill="none" stroke={themeHex} strokeWidth="8" strokeDasharray="565" strokeDashoffset={565 - (565 * (timeLeft / (25 * 60)))} className="transition-all duration-1000 ease-linear" strokeLinecap="round" />
              </svg>
              <div className="text-4xl font-black font-mono tracking-tighter text-on-surface">
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className="flex-1 py-3 rounded-xl font-bold text-white transition-transform hover:-translate-y-1" style={{ backgroundColor: themeHex }}>
                {timerActive ? 'Pause' : 'Start Focus'}
              </button>
              <button
                onClick={() => { setTimerActive(false); setTimeLeft(25 * 60); }}
                className="w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-colors" style={{ borderColor: themeHex, color: themeHex }}>
                <span className="material-symbols-outlined">refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── Scheduler & Database (8-col) ─── */}
        <div className="xl:col-span-8 flex flex-col gap-8 animate-slideUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>

          {/* Calendar Row */}
          <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-6 shadow-sm border-l-4" style={{ borderLeftColor: themeHex }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold text-on-surface">Upcoming Schedule</h3>
              <button className="text-sm font-bold text-white px-4 py-2 rounded-lg" style={{ backgroundColor: themeHex }}>+ Add Event</button>
            </div>

            <div className="flex flex-col items-center justify-center py-6 text-center opacity-50">
              <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
              <p className="text-sm font-bold">No upcoming schedule</p>
              <p className="text-xs">Your calendar is clear.</p>
            </div>
          </div>

          {/* Recent Databases */}
          <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-6 shadow-sm flex-1">
            <h3 className="font-display text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: themeHex }}>folder_open</span>
              Recent Workspaces
            </h3>

            <div className="flex flex-col items-center justify-center py-10 text-center opacity-50 h-full">
              <span className="material-symbols-outlined text-5xl mb-3">note_stack</span>
              <p className="text-sm font-bold">Workspace Empty</p>
              <p className="text-xs mb-4">You have not created any databases or notes yet.</p>
              <button className="text-xs font-bold px-4 py-2 rounded-lg border-2" style={{ borderColor: themeHex, color: themeHex }}>Create First Database</button>
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
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}