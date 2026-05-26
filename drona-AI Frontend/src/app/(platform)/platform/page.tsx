"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Scholar");

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name.split(" ")[0]);
        }
      } catch { /* fallback */ }
    };
    fetchUser();
  }, []);

  if (!mounted) return null;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-8 animate-fadeIn transition-all duration-300">
         
         <div className="mb-12">
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
         
         <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* ─── Tactical Analysis (8-col) ─── */}
            <div className="xl:col-span-8 bg-white/90 backdrop-blur-xl border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 shadow-sm relative overflow-hidden border-t-4 border-t-primary group">
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
            <div className="xl:col-span-4 bg-white border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 shadow-sm">
              <h3 className="font-display text-xl font-bold text-on-surface mb-8">Live Metrics</h3>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-3">
                    <span className="text-on-surface-variant">Precision</span>
                    <span className="text-primary font-mono tracking-tight">--%</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-0 rounded-full" />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-bold mb-3">
                    <span className="text-on-surface-variant">Velocity</span>
                    <span className="text-tertiary font-mono tracking-tight">--x</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary w-0 rounded-full" />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-bold mb-3">
                    <span className="text-on-surface-variant">Depth</span>
                    <span className="text-[#001454] font-mono tracking-tight">Level 0</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-[#001454] w-0 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* ─── Today's Blueprint (12-col) ─── */}
            <div className="col-span-1 xl:col-span-12 bg-white border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 shadow-sm">
              <h3 className="font-display text-xl font-bold text-on-surface mb-8">Today's Blueprint</h3>
              
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-outline-variant/20 rounded-2xl bg-surface-container-lowest/50">
                <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-outline-variant">event_busy</span>
                </div>
                <h4 className="font-display text-lg font-bold text-on-surface mb-2">No active sprints</h4>
                <p className="text-on-surface-variant text-sm max-w-sm">Your blueprint is empty. Start a new learning sprint to populate your daily schedule and orchestrate your agents.</p>
              </div>
            </div>
            
         </div>
      </main>
  );
}
