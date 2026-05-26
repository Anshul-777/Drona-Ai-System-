"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CareerDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeHex = "#4f4f7a"; // Deep Slate/Indigo for Career Env (Using a slightly lighter variant of #1a1a24 for accents)

  if (!mounted) return null;

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-8 animate-fadeIn transition-all duration-300 relative">

      {/* ─── Premium Watermark ─── */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] overflow-hidden pointer-events-none z-0 opacity-20 select-none">
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${themeHex}08 10px, ${themeHex}08 20px)` }} />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-surface to-surface" />
        <span className="material-symbols-outlined absolute top-4 right-12 text-[250px] -rotate-12 translate-x-10 -translate-y-10 drop-shadow-2xl" style={{ color: `${themeHex}15` }}>
          work
        </span>
      </div>

      <div className="mb-12 relative z-10 animate-slideUp" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-on-surface tracking-tight mb-3">Career & Future</h1>
        <p className="text-on-surface-variant font-medium max-w-2xl text-sm md:text-base">
          Map your professional trajectory, analyze skill gaps, and prepare for top-tier university and corporate interviews.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">

        {/* ─── Roadmap Generator (8-col) ─── */}
        <div className="xl:col-span-8 animate-slideUp" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 shadow-sm h-full border-t-4" style={{ borderTopColor: themeHex }}>
            <h3 className="font-display text-xl md:text-2xl font-bold text-on-surface mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ color: themeHex }}>timeline</span>
              Career Roadmap Generator
            </h3>

            <div className="flex gap-4 mb-8">
              <input
                type="text"
                placeholder="e.g., Quantum Physicist, AI Researcher, Aerospace Engineer..."
                className="flex-1 bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-4 outline-none focus:border-[#4f4f7a] font-medium"
              />
              <button className="text-white px-8 py-4 rounded-xl font-bold transition-transform hover:-translate-y-1 shadow-lg" style={{ backgroundColor: themeHex }}>
                Map Trajectory
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
              <span className="material-symbols-outlined text-5xl mb-3">explore</span>
              <p className="text-sm font-bold">No Trajectory Mapped</p>
              <p className="text-xs">Enter your target career goal above to generate an AI-guided roadmap.</p>
            </div>
          </div>
        </div>

        {/* ─── Skill Gap & Actions (4-col) ─── */}
        <div className="xl:col-span-4 flex flex-col gap-8 animate-slideUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>

          {/* Skill Gap Analyzer */}
          <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-6 shadow-sm">
            <h4 className="font-display text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: themeHex }}>radar</span>
              Skill Gap Matrix
            </h4>

            <div className="flex flex-col items-center justify-center py-6 text-center opacity-50">
              <span className="material-symbols-outlined text-4xl mb-2">trending_flat</span>
              <p className="text-sm font-bold">Awaiting Data</p>
              <p className="text-xs text-on-surface-variant">Complete a career assessment to analyze your current skill gap.</p>
            </div>
          </div>

          {/* Action Quick Links */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-4 shadow-sm flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-low group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ color: themeHex }}>edit_document</span>
              </div>
              <span className="font-bold text-sm text-on-surface">Resume Builder</span>
            </div>

            <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-4 shadow-sm flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-low group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined" style={{ color: themeHex }}>record_voice_over</span>
              </div>
              <span className="font-bold text-sm text-on-surface">Mock Interview</span>
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