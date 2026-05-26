"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TestDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [pressureMode, setPressureMode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeHex = "#e8362a"; // Red for Test Env

  if (!mounted) return null;

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-8 animate-fadeIn transition-all duration-300 relative">
      
      {/* ─── Premium Watermark ─── */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] overflow-hidden pointer-events-none z-0 opacity-20 select-none">
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${themeHex}08 10px, ${themeHex}08 20px)` }} />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-surface to-surface" />
        <span className="material-symbols-outlined absolute top-4 right-12 text-[250px] -rotate-12 translate-x-10 -translate-y-10 drop-shadow-2xl" style={{ color: `${themeHex}15` }}>
          quiz
        </span>
      </div>

      <div className="mb-12 relative z-10 animate-slideUp" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-on-surface tracking-tight mb-3">Testing & Evaluation</h1>
        <p className="text-on-surface-variant font-medium max-w-2xl text-sm md:text-base">
          Engage in ruthless AI-generated Mock Exams, Shadow-Simulations, and Viva evaluations to forge unbreakable exam temperament.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        
        {/* ─── Test Generator (8-col) ─── */}
        <div className="xl:col-span-8 animate-slideUp" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 shadow-sm h-full border-t-4" style={{ borderTopColor: themeHex }}>
            <h3 className="font-display text-xl md:text-2xl font-bold text-on-surface mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ color: themeHex }}>tune</span>
              Mock Test Configurator
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Subject Target</label>
                  <select className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 outline-none focus:border-red-500 font-medium">
                    <option>Complete Syllabus (JEE Pattern)</option>
                    <option>Physics - Mechanics Only</option>
                    <option>Chemistry - Organic</option>
                    <option>Math - Calculus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Difficulty Scaling</label>
                  <select className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 outline-none focus:border-red-500 font-medium">
                    <option>Adaptive (Auto-scaling)</option>
                    <option>NTA Standard</option>
                    <option>JEE Advanced (Ruthless)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest">
                <div>
                  <h4 className="font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500 text-[20px]">timer</span>
                    Time-Pressure Mode
                  </h4>
                  <p className="text-sm text-on-surface-variant">Activates negative marking simulation and strict 10% time reduction.</p>
                </div>
                <button 
                  onClick={() => setPressureMode(!pressureMode)}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${pressureMode ? 'bg-red-500' : 'bg-outline-variant/40'}`}
                >
                  <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-md ${pressureMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <button className="w-full text-white px-8 py-4 rounded-xl font-bold text-lg hover:-translate-y-1 hover:shadow-xl transition-all mt-4" style={{ backgroundColor: themeHex, boxShadow: `0 8px 24px ${themeHex}40` }}>
                Generate & Initialize Exam
              </button>
            </div>
          </div>
        </div>

        {/* ─── Rank & Shadow Status (4-col) ─── */}
        <div className="xl:col-span-4 space-y-8 animate-slideUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          
          {/* Shadow Simulation */}
          <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-6 shadow-sm">
            <h4 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: themeHex }}>biotech</span>
              Shadow-Simulation
            </h4>
            <div className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest opacity-60">
              <div className="w-3 h-3 rounded-full bg-outline-variant" />
              <div>
                <p className="text-sm font-bold text-on-surface">Offline</p>
                <p className="text-xs text-on-surface-variant">Awaiting exam initialization</p>
              </div>
            </div>
          </div>

          {/* Rank Predictor */}
          <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-6 shadow-sm">
            <h4 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: themeHex }}>trending_up</span>
              Rank Predictor
            </h4>
            <div className="flex flex-col items-center justify-center py-6 text-center opacity-50">
              <span className="text-2xl font-black font-mono tracking-tighter text-outline mb-2">Unranked</span>
              <p className="text-xs text-on-surface-variant">Complete at least 3 Mock Exams to generate an AI trajectory prediction.</p>
            </div>
            
            <div className="w-full h-16 mt-4 rounded-xl bg-surface-container-low flex items-end p-2 gap-1 border border-outline-variant/20">
               {/* Empty Graph Bars */}
               {[0, 0, 0, 0, 0, 0, 0].map((_, i) => (
                 <div key={i} className="flex-1 rounded-t-sm bg-outline-variant/20" style={{ height: '4px' }} />
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