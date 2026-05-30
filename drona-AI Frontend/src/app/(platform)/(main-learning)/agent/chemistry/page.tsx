"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ChemistryAgentPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSubMode, setActiveSubMode] = useState("Organic");
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="p-6 md:p-10 min-h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full animate-fadeIn">
      {/* Workspace Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              science
            </span>
            <span className="font-label font-bold text-sm tracking-wider uppercase">
              Chemistry Agent Workspace
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-2">
            Molecular Orchestrator
          </h1>
          <p className="font-body text-secondary text-lg max-w-2xl">
            Advanced synthesis analysis and interactive reaction pathways. Currently engaging Dr. Aurelius.
          </p>
        </div>

        {/* Sub-modes Toggle */}
        <div className="flex bg-surface-container-low p-1.5 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-outline-variant/20 self-start md:self-auto">
          {["Physical", "Organic", "Inorganic"].map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveSubMode(mode)}
              className={`px-6 py-2.5 rounded-xl font-label text-sm transition-all duration-300 ${
                activeSubMode === mode
                  ? "font-bold bg-surface-container-lowest text-primary shadow-sm ring-1 ring-outline-variant/10"
                  : "font-semibold text-secondary hover:text-on-surface"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visualization & Interaction (Span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Mechanism Visualization Area */}
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col h-[420px] relative">
            <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-bright/50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">360</span>
                <h2 className="font-display text-xl font-bold text-on-surface">Mechanism Visualization</h2>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors text-secondary hover:text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                </button>
                <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors text-secondary hover:text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-surface-container-low relative group cursor-crosshair">
              {/* High-fidelity visualization placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-surface-bright to-surface-container-low z-0"></div>
              <img
                className="w-full h-full object-cover mix-blend-multiply opacity-70 group-hover:opacity-90 transition-opacity duration-500 z-10 relative"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbh5R3EDB4Ms025gkTN9xFKqg3ISpzY9UtGpLfKLcDfQ4v1WXTU1JgEgLTp7HtVecz8bhK8xHVFeA3jJkr-Hq2iSyqfudm4KCMz5DCFTf3AMuK9XL6NfdMmnU6FHG_3zjEa--a4hIMqhTuk6Nxfy_QCCe1a3_IE0S9k2hK6wcPnPOu1iwrzIJArnTzCsuWF98mQwhIetdyr5Ahfum9szVIlF5CFYKsAoaMW2_0woMk5ZJARrWNR_8MGB8WZvsshIB7nlsLEq2w8v8"
                alt="Organic molecule reaction"
              />
              
              {/* Overlay UI Elements */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <div className="bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-outline-variant/30 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                  <span className="font-label text-xs font-bold text-on-surface">Live Render: Step 2</span>
                </div>
              </div>
              
              {/* Interactive Label */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-surface-container-lowest/95 backdrop-blur-xl px-6 py-4 rounded-xl border border-outline-variant/30 shadow-lg text-center transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="font-display font-bold text-lg text-primary mb-1">Esterification Transition</h3>
                <p className="font-body text-sm text-secondary">Nucleophilic attack of phenolic hydroxyl on carbonyl.</p>
              </div>
            </div>
          </section>

          {/* Specialized Chat Interface */}
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col h-[560px]">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-outline-variant/20 bg-surface-bright rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-on-primary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      smart_toy
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#10B981] border-2 border-surface-container-lowest rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-on-surface">Dr. Aurelius</h3>
                  <p className="font-label text-xs font-medium text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Organic Synthesis Specialist
                  </p>
                </div>
              </div>
              <button className="p-2 text-secondary hover:text-primary hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>

            {/* Conversation Canvas */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-8 bg-surface/50">
              {/* AI Message Block */}
              <div className="flex gap-4 max-w-[85%] group">
                <div className="w-8 h-8 rounded-full bg-primary-container/50 flex-shrink-0 flex items-center justify-center mt-1 border border-primary/10">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    science
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-label text-[11px] font-bold text-secondary ml-1">Dr. Aurelius • 10:42 AM</span>
                  <div className="bg-surface-container-lowest p-5 rounded-2xl rounded-tl-sm border border-outline-variant/20 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-on-surface font-body text-[15px] leading-relaxed">
                    <p className="mb-3">
                      Let's break down the synthesis of aspirin. We start with salicylic acid and acetic anhydride. The reaction is an esterification, specifically an <strong className="text-primary font-semibold">O-acetylation</strong>.
                    </p>
                    <p>
                      Notice the visualization above. I've highlighted the exact moment of the nucleophilic attack of the phenolic hydroxyl group on the carbonyl carbon of the acetic anhydride.
                    </p>
                  </div>
                </div>
              </div>

              {/* User Message Block */}
              <div className="flex gap-4 max-w-[85%] self-end flex-row-reverse group">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex-shrink-0 flex items-center justify-center mt-1 border border-secondary/10">
                  <span className="material-symbols-outlined text-on-secondary-container text-sm">person</span>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className="font-label text-[11px] font-bold text-secondary mr-1">You • 10:45 AM</span>
                  <div className="bg-primary text-on-primary p-5 rounded-2xl rounded-tr-sm shadow-md font-body text-[15px] leading-relaxed">
                    What is the specific role of the phosphoric acid in this mechanism? Is it functioning purely as a catalyst?
                  </div>
                </div>
              </div>

              {/* AI Message Block (Typing/Thinking) */}
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-primary-container/50 flex-shrink-0 flex items-center justify-center mt-1 border border-primary/10">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    science
                  </span>
                </div>
                <div className="bg-surface-container-lowest py-4 px-5 rounded-2xl rounded-tl-sm border border-outline-variant/20 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-surface-container-lowest rounded-b-2xl border-t border-outline-variant/20">
              <div className="relative flex items-center bg-surface-container-low rounded-2xl border border-outline-variant/20 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                <button className="pl-4 pr-2 text-secondary hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full bg-transparent border-none py-4 px-2 font-body text-[15px] text-on-surface focus:ring-0 placeholder:text-secondary/70 outline-none"
                  placeholder="Inquire about pathways, reagents, or spectral data..."
                />
                <button className="absolute right-2 w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:bg-primary-container hover:-translate-y-0.5 transition-all shadow-sm">
                  <span className="material-symbols-outlined text-on-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    send
                  </span>
                </button>
              </div>
              <div className="flex justify-between items-center mt-3 px-2">
                <p className="font-label text-[10px] text-secondary uppercase tracking-widest font-semibold">
                  Shift + Enter for new line
                </p>
                <div className="flex gap-3">
                  <button className="font-label text-xs text-primary hover:underline">Insert Reaction Eq.</button>
                  <button className="font-label text-xs text-primary hover:underline">Draw Structure</button>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Quick Reference & Tools (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Periodic Trends Card */}
          <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-bl-full -z-10"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">table_chart</span>
              </div>
              <h2 className="font-display text-xl font-bold text-on-surface">Periodic Context</h2>
            </div>
            <div className="space-y-3">
              {/* Trend Item 1 */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    <span className="font-label font-bold text-sm text-on-surface">Electronegativity</span>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[16px] group-hover:text-primary transition-colors">
                    trending_up
                  </span>
                </div>
                <p className="font-body text-[13px] text-secondary leading-relaxed">
                  Oxygen (3.44) pull dictates the polarity of the carbonyl bond in acetic anhydride.
                </p>
              </div>
              
              {/* Trend Item 2 */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span className="font-label font-bold text-sm text-on-surface">Steric Hindrance</span>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[16px] group-hover:text-primary transition-colors">
                    block
                  </span>
                </div>
                <p className="font-body text-[13px] text-secondary leading-relaxed">
                  Bulky phenyl ring on salicylic acid directs attack trajectory.
                </p>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 border border-outline-variant/30 rounded-lg font-label text-sm font-semibold text-primary hover:bg-surface-container transition-colors">
              View Full Periodic Table
            </button>
          </section>

          {/* Mnemonic Generator */}
          <section className="bg-gradient-to-br from-on-primary-fixed to-primary rounded-2xl p-6 shadow-md text-on-primary relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
            {/* Glassmorphic Deco */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-primary-container/30 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                    psychology_alt
                  </span>
                </div>
                <h2 className="font-display text-lg font-bold">Mnemonic Forge</h2>
              </div>
              <p className="font-body text-[13px] text-primary-fixed opacity-90 mb-6 leading-relaxed">
                Memorizing transition metals or the lanthanide series? Generate an academically rigorous mnemonic instantly.
              </p>
              <button className="w-full py-3 bg-white text-on-primary-fixed font-label text-sm font-bold rounded-xl shadow-sm hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 group/btn">
                <span>Generate Mnemonic</span>
                <span className="material-symbols-outlined text-[18px] group-hover/btn:rotate-12 transition-transform">
                  auto_awesome
                </span>
              </button>
            </div>
          </section>

          {/* Environment Parameters Card */}
          <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
            <h3 className="font-label font-bold text-xs uppercase tracking-widest text-secondary mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Reaction Parameters
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                <span className="font-body text-sm text-secondary">Temperature</span>
                <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-md">
                  <span className="font-display font-bold text-on-surface">353 K</span>
                  <span className="material-symbols-outlined text-error text-[14px]">thermostat</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                <span className="font-body text-sm text-secondary">Solvent System</span>
                <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-md">
                  <span className="font-display font-bold text-on-surface">Neat / H3PO4</span>
                  <span className="material-symbols-outlined text-primary text-[14px]">water_drop</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-secondary">Atmosphere</span>
                <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-md">
                  <span className="font-display font-bold text-on-surface">Ambient</span>
                  <span className="material-symbols-outlined text-secondary text-[14px]">air</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 border border-outline-variant/30 border-dashed rounded-lg font-label text-[13px] font-medium text-secondary hover:bg-surface-container hover:text-on-surface transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">edit</span>
              Modify Parameters
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}