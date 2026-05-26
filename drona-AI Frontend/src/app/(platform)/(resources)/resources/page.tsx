"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResourcesDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeHex = "#9b5de5"; // Purple for Resources Env

  if (!mounted) return null;

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-8 animate-fadeIn transition-all duration-300 relative">

      {/* ─── Premium Watermark ─── */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] overflow-hidden pointer-events-none z-0 opacity-30 select-none">
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${themeHex}08 10px, ${themeHex}08 20px)` }} />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-surface to-surface" />
        <span className="material-symbols-outlined absolute top-4 right-12 text-[250px] -rotate-12 translate-x-10 -translate-y-10 drop-shadow-2xl" style={{ color: `${themeHex}15` }}>
          library_books
        </span>
      </div>

      <div className="mb-12 relative z-10 animate-slideUp" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-on-surface tracking-tight mb-3">Study Resources & Tools</h1>
        <p className="text-on-surface-variant font-medium max-w-2xl text-sm md:text-base">
          Access your personal database, generate multi-modal flows, and utilize the Image-to-Solution OCR engine to instantly solve complex problems.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">

        {/* ─── Smart Search (12-col) ─── */}
        <div className="xl:col-span-12 animate-slideUp" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          <div className="bg-white border border-outline-variant/30 rounded-3xl p-3 shadow-sm flex items-center gap-4 focus-within:ring-2 focus-within:ring-offset-2 transition-all" style={{ '--tw-ring-color': themeHex } as React.CSSProperties}>
            <span className="material-symbols-outlined text-3xl ml-4" style={{ color: themeHex }}>search</span>
            <input
              type="text"
              placeholder="Search verified academic sources, your personal database, or PYQs..."
              className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-on-surface placeholder:text-outline/60 h-12"
            />
            <button className="text-white px-8 py-3 rounded-2xl font-bold transition-all hover:opacity-90 shadow-lg" style={{ backgroundColor: themeHex }}>
              Smart Search
            </button>
          </div>
        </div>

        {/* ─── Image-to-Solution Engine (8-col) ─── */}
        <div className="xl:col-span-8 animate-slideUp" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 shadow-sm h-full flex flex-col">
            <h3 className="font-display text-xl md:text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ color: themeHex }}>document_scanner</span>
              Image-to-Solution Engine
            </h3>

            <div
              className={`flex-1 flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-3xl transition-all ${dragActive ? 'border-purple-500 bg-purple-500/5' : 'border-outline-variant/30 bg-surface-container-lowest'}`}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDrop={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${themeHex}15` }}>
                <span className="material-symbols-outlined text-4xl" style={{ color: themeHex }}>upload_file</span>
              </div>
              <p className="font-bold text-on-surface text-lg mb-2">Drag & Drop handwritten equations or concepts</p>
              <p className="text-on-surface-variant text-sm mb-6 text-center max-w-sm">
                Our high-speed OCR will instantly solve, explain, and generate a Notion-style breakdown.
              </p>
              <button className="border-2 text-sm font-bold px-6 py-2.5 rounded-xl transition-all hover:shadow-md" style={{ borderColor: themeHex, color: themeHex }}>
                Browse Files
              </button>
            </div>
          </div>
        </div>

        {/* ─── Quick Vaults (4-col) ─── */}
        <div className="xl:col-span-4 animate-slideUp" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
          <div className="grid grid-cols-2 gap-4 h-full">
            {[
              { label: 'Database', icon: 'database', path: '/resources' },
              { label: 'Video Gen', icon: 'movie', path: '/resources/video' },
              { label: 'Formulas', icon: 'functions', path: '/resources/formulas' },
              { label: 'Flow Maps', icon: 'account_tree', path: '/resources/flow' }
            ].map((item, i) => (
              <button key={item.label} onClick={() => router.push(item.path)} className="bg-white border border-outline-variant/30 rounded-[1.5rem] p-6 shadow-sm flex flex-col items-center justify-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all group">
                <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: `${themeHex}10` }}>
                  <span className="material-symbols-outlined text-2xl" style={{ color: themeHex }}>{item.icon}</span>
                </div>
                <span className="font-bold text-on-surface text-sm">{item.label}</span>
              </button>
            ))}
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