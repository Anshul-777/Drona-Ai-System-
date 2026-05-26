"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PlatformDashboard() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-8 animate-fadeIn transition-all duration-300 relative">

      {/* ─── Premium Watermark & Shiny Stripes (Top Right) ─── */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] overflow-hidden pointer-events-none z-0 opacity-40 select-none">
        <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(42, 92, 255, 0.03) 10px, rgba(42, 92, 255, 0.03) 20px)' }} />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-surface to-surface" />
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-4 right-12 w-64 h-64 text-primary/10 -rotate-12 translate-x-10 -translate-y-10 drop-shadow-2xl">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.5 17H10.5L9.5 15H14.5L13.5 17ZM16.5 14H7.5L7 12H17L16.5 14ZM16.8 11H7.2C7.2 11 6.5 8 12 8C17.5 8 16.8 11 16.8 11Z" fill="currentColor" />
          <path d="M12 4C14.2 4 16.2 4.9 17.6 6.3C16.5 5.5 15.1 5 13.5 5C11.9 5 10.5 5.5 9.4 6.3C10.8 4.9 12.8 4 12 4Z" fill="currentColor" />
        </svg>
      </div>

      <div className="mb-12 relative z-10 animate-slideUp" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-on-surface tracking-tight mb-3">Learning Dashboard</h1>
        <div className="flex flex-wrap items-center gap-3 text-on-surface-variant text-sm md:text-base">
          <span className="font-medium">{today}</span>
          <span className="text-outline/40">•</span>
          <span className="font-medium">Peak Cognitive Window</span>
          <span className="ml-auto px-4 py-1.5 bg-primary text-white text-[11px] md:text-xs font-bold rounded-full uppercase tracking-wider shadow-md">
            Phase: Active Mastery
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">

        {/* ─── Tactical Analysis (8-col) ─── */}
        <div className="xl:col-span-8 bg-white/90 backdrop-blur-xl border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 shadow-sm relative overflow-hidden border-t-4 border-t-primary group animate-slideUp" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <span className="material-symbols-outlined text-primary text-3xl">insights</span>
            <h3 className="font-display text-xl md:text-2xl font-bold text-on-surface">Daily Tactical Analysis</h3>
          </div>

          <p className="text-on-surface-variant text-base leading-relaxed mb-8 relative z-10 font-medium">
            "Your cognitive baseline is established, but active learning data is required to generate tactical insights. I recommend initiating your first focused sprint to begin mapping your neural pathways and precision metrics."
          </p>

          <div className="flex flex-wrap gap-4 relative z-10">
            <button className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 transition-all cursor-pointer relative overflow-hidden group/btn">
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
              Start First Sprint
            </button>
            <button className="bg-white border-2 border-outline-variant/20 text-on-surface px-8 py-3.5 rounded-xl font-bold text-sm hover:-translate-y-1 hover:shadow-md hover:border-primary/40 transition-all cursor-pointer">
              View Full Analysis
            </button>
          </div>
        </div>

        {/* ─── Live Metrics (4-col) ─── */}
        <div className="xl:col-span-4 bg-white border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 shadow-sm animate-slideUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <h3 className="font-display text-xl font-bold text-on-surface mb-8">Live Metrics</h3>

          <div className="space-y-6">
            {[
              { label: 'Precision Rating', val: '0%', color: 'bg-primary', icon: 'target' },
              { label: 'Avg. Velocity', val: '0s', color: 'bg-tertiary', icon: 'speed' },
              { label: 'Conceptual Depth', val: 'Lvl 0', color: 'bg-[#9b5de5]', icon: 'layers' }
            ].map((metric, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-outline-variant/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${metric.color}/10 flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-[18px] text-primary`}>{metric.icon}</span>
                  </div>
                  <span className="font-bold text-sm text-on-surface">{metric.label}</span>
                </div>
                <span className="font-black text-lg text-on-surface">{metric.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Today's Blueprint (12-col) ─── */}
        <div className="xl:col-span-12 bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 shadow-sm animate-slideUp" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display text-xl md:text-2xl font-bold text-on-surface">Today's Blueprint</h3>
            <button className="text-primary font-bold text-sm hover:underline">Edit Plan</button>
          </div>

          <div className="flex flex-col items-center justify-center py-16 text-center opacity-50 border-2 border-dashed border-outline-variant/40 rounded-2xl">
            <span className="material-symbols-outlined text-5xl mb-4">pending_actions</span>
            <h4 className="font-bold text-lg text-on-surface mb-2">No Active Sessions</h4>
            <p className="text-sm font-medium text-on-surface-variant max-w-sm">
              Complete your first diagnostic test to unlock AI-generated study sessions and blueprints.
            </p>
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
