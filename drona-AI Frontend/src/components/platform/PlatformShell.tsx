"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";

export default function PlatformShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Scholar");
  const pathname = usePathname();

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

  // Close sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!mounted) return <div className="min-h-screen bg-surface-container-lowest" />;

  const envTabs = [
    { name: 'Learning', path: '/platform', hex: '#2a5cff', rgb: '42, 92, 255' },
    { name: 'Test', path: '/test', hex: '#e8362a', rgb: '232, 54, 42' },
    { name: 'Game', path: '/game', hex: '#c9a84c', rgb: '201, 168, 76' },
    { name: 'Workspace', path: '/workspace', hex: '#00c896', rgb: '0, 200, 150' },
    { name: 'Resources', path: '/resources', hex: '#9b5de5', rgb: '155, 93, 229' },
    { name: 'Career', path: '/career', hex: '#1a1a24', rgb: '26, 26, 36' }
  ];

  const activeTab = envTabs.find(t => pathname === t.path) || envTabs[0];

  const headerIcons = [
    { icon: 'notifications', path: '/notifications' },
    { icon: 'shopping_cart', path: '/shop' },
    { icon: 'emoji_events', path: '/achievements' },
    { icon: 'radar', path: '/stats' },
  ];

  return (
    <div className="min-h-screen w-full bg-surface-container-lowest text-on-surface font-body flex flex-col relative overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════
          GLOBAL HEADER
          ═══════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 h-[76px] bg-white/90 backdrop-blur-xl border-b border-outline-variant/20 z-[80] flex items-center justify-between px-4 lg:px-8 shadow-sm">

        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-4 md:gap-8">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-2 group relative rounded-lg transition-colors cursor-pointer focus:outline-none flex flex-col gap-1.5 w-12 h-12 justify-center items-center hover:bg-surface-container-low"
          >
            <div className={`h-[3px] bg-on-surface rounded-full transition-all duration-400 ease-in-out origin-center ${sidebarOpen ? 'w-6 translate-y-[9px] rotate-45' : 'w-5 group-hover:w-7 group-hover:bg-primary'}`} />
            <div className={`h-[3px] bg-on-surface rounded-full transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-0 opacity-0' : 'w-7 group-hover:w-5 group-hover:bg-primary'}`} />
            <div className={`h-[3px] bg-on-surface rounded-full transition-all duration-400 ease-in-out origin-center ${sidebarOpen ? 'w-6 -translate-y-[9px] -rotate-45' : 'w-6 group-hover:w-7 group-hover:bg-primary'}`} />
          </button>
          <Link href="/platform" className="hover:opacity-80 transition-opacity">
            <Logo isSpan={false} />
          </Link>
        </div>

        {/* Center: Environment Tabs */}
        <div className="hidden lg:flex items-center gap-10 h-full">
          {envTabs.map((tab, i) => {
            const isActive = pathname === tab.path;
            return (
              <Link key={tab.name} href={tab.path}
                className={`h-full flex items-center relative text-[15px] font-bold transition-all duration-300 group px-2 animate-fadeSlideUp`}
                style={{ 
                  animationDelay: `${i * 40}ms`,
                  '--tab-hex': tab.hex,
                  '--tab-rgb': tab.rgb
                } as React.CSSProperties}
              >
                <span 
                  className={`relative z-10 transition-colors duration-300 ${isActive ? '' : 'text-on-surface-variant group-hover:text-[var(--tab-hex)]'}`}
                  style={{ 
                    color: isActive ? 'var(--tab-hex)' : undefined,
                    filter: isActive ? `drop-shadow(0 0 8px rgba(var(--tab-rgb), 0.3))` : undefined 
                  }}
                >
                  {tab.name}
                </span>
                {isActive && (
                  <>
                    <div className="absolute bottom-0 left-0 w-full h-[4px] rounded-t-full transition-all duration-500" style={{ backgroundColor: 'var(--tab-hex)', boxShadow: `0 -2px 12px rgba(var(--tab-rgb), 0.8)` }} />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none transition-all duration-500" style={{ background: `linear-gradient(to top, rgba(var(--tab-rgb), 0.1), transparent)` }} />
                  </>
                )}
                {!isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-outline-variant/40 rounded-t-full transition-all duration-300 group-hover:w-full" style={{ backgroundColor: 'rgba(var(--tab-rgb), 0.5)' }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-4">
          {/* Utility Icons */}
          <div className="hidden xl:flex items-center gap-2 mr-2">
            {headerIcons.map((item) => (
              <Link key={item.icon} href={item.path}
                className="w-11 h-11 rounded-xl hover:bg-surface-container-low flex items-center justify-center transition-all duration-300 cursor-pointer text-outline-variant hover:text-on-surface relative group"
              >
                <span className="material-symbols-outlined text-[22px] transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                {/* Tooltip background effect */}
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-outline-variant/30 group-hover:shadow-sm transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Profile Component — Overflows header with hexagonal tech-panel frame */}
          <Link href="/profile" 
            className="flex items-center gap-0 cursor-pointer relative group transition-all duration-500 -my-3 pr-8 pl-2"
            style={{ 
              '--env-hex': activeTab.hex,
              '--env-rgb': activeTab.rgb
            } as React.CSSProperties}
          >
            {/* ── Hexagonal Tech Panel Frame (SVG) ── */}
            <svg className="absolute -inset-x-1 -inset-y-3 w-[calc(100%+8px)] h-[calc(100%+24px)] pointer-events-none z-0 transition-opacity duration-500 opacity-[0.25] group-hover:opacity-[0.45]" viewBox="0 0 400 100" fill="none" preserveAspectRatio="none">
              {/* Outer Chamfered Box */}
              <path d="M 25,2 L 375,2 L 398,25 L 398,75 L 375,98 L 25,98 L 2,75 L 2,25 Z" stroke="currentColor" strokeWidth="1" fill="rgba(255,255,255,0.05)" style={{ color: 'var(--env-hex)' }} />
              {/* Inner Dashed Accent */}
              <path d="M 27,6 L 373,6 L 392,25 L 392,75 L 373,94 L 27,94 L 8,75 L 8,25 Z" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" style={{ color: 'var(--env-hex)' }} />
              {/* Corner Accents */}
              <path d="M 25,2 L 40,2 M 375,2 L 360,2 M 25,98 L 40,98 M 375,98 L 360,98" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--env-hex)' }} />
            </svg>

            {/* Glowing background on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-none z-0" style={{ background: 'var(--env-hex)', clipPath: 'polygon(15px 0%, calc(100% - 15px) 0%, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0% calc(100% - 15px), 0% 15px)' }} />

            {/* Avatar Container — large, circular, overflows header */}
            <div className="relative shrink-0 w-[64px] h-[64px] z-20">
              {/* Outer Tech Ring (animated) */}
              <div 
                className="absolute -inset-[5px] rounded-full border transition-colors duration-500 animate-[spin_10s_linear_infinite]" 
                style={{ borderColor: 'rgba(var(--env-rgb), 0.3)', borderTopColor: 'var(--env-hex)' }}
              />
              {/* Inner Tech Ring */}
              <div 
                className="absolute -inset-[2px] rounded-full border transition-colors duration-500 animate-[spin_15s_linear_infinite_reverse]" 
                style={{ borderColor: 'rgba(var(--env-rgb), 0.15)', borderBottomColor: 'var(--env-hex)' }}
              />
              
              {/* Avatar Circle */}
              <div 
                className="w-full h-full rounded-full bg-surface-container-high border-[2px] flex items-center justify-center overflow-hidden transition-all duration-500 relative z-10 group-hover:scale-[1.03] shadow-md bg-white"
                style={{ borderColor: 'var(--env-hex)' }}
              >
                <span className="material-symbols-outlined text-[30px] text-on-surface-variant transition-colors duration-500 group-hover:text-[var(--env-hex)]">person</span>
              </div>
              
              {/* Premium Shield Level Badge */}
              <div 
                className="absolute -bottom-2 -left-2 w-[30px] h-[36px] flex flex-col items-center justify-start shadow-xl z-30 transition-all duration-500 overflow-hidden group-hover:scale-105"
                style={{ 
                  background: 'linear-gradient(135deg, #222 0%, #000 100%)',
                  clipPath: 'polygon(50% 100%, 100% 80%, 100% 0%, 0% 0%, 0% 80%)',
                  border: '1px solid rgba(var(--env-rgb), 0.5)'
                }}
              >
                <div className="w-full text-center text-[6px] font-black uppercase text-white tracking-widest pt-[2px] pb-[1px]" style={{ background: 'var(--env-hex)' }}>
                  LEVEL
                </div>
                <div className="text-white text-[13px] font-black leading-none mt-[3px] tracking-tighter" style={{ textShadow: '0 0 4px rgba(255,255,255,0.3)' }}>
                  99
                </div>
              </div>
            </div>
            
            {/* Info Section — Extended width for long XP bar */}
            <div className="flex flex-col justify-center pl-4 min-w-[200px] max-w-[260px] relative z-10 mt-1">
              <div className="flex items-end justify-between">
                <span className="text-[16px] font-display font-black text-on-surface tracking-wider uppercase truncate transition-colors duration-500 group-hover:text-[var(--env-hex)] leading-none">{userName}</span>
              </div>
              
              <div className="flex items-center gap-1.5 mt-1.5 mb-2">
                <span className="material-symbols-outlined text-[12px] transition-colors duration-500" style={{ color: 'var(--env-hex)' }}>keyboard_double_arrow_up</span>
                <span className="text-[8px] font-bold text-outline-variant uppercase tracking-[0.2em]">Elite Rank</span>
              </div>
              
              {/* Extended XP Bar */}
              <div className="flex items-center gap-2 w-full">
                <span className="text-[9px] font-black uppercase tracking-widest shrink-0 transition-colors duration-500" style={{ color: 'var(--env-hex)' }}>XP</span>
                <div className="flex-1 h-[4px] bg-outline-variant/20 rounded-full overflow-hidden relative shadow-inner">
                  <div 
                    className="w-[78%] h-full rounded-full relative overflow-hidden transition-all duration-500"
                    style={{ background: 'var(--env-hex)', boxShadow: '0 0 8px var(--env-hex)' }}
                  >
                    <div className="absolute inset-0 bg-white/50 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  </div>
                </div>
                <span className="text-[9px] font-mono font-medium text-outline-variant shrink-0 tracking-tighter"><span style={{ color: 'var(--env-hex)' }}>78,450</span> / 100,000</span>
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          SIDEBAR
          ═══════════════════════════════════════════════════════════ */}
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[70]" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant/20 z-[75] transform transition-transform duration-400 cubic-bezier(0.2, 0.8, 0.2, 1) ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} flex flex-col pt-24 pb-6 overflow-y-auto`}>

        <div className="px-6 mb-8">
          <p className="text-sm font-display font-bold text-on-surface mb-1">Core Learning</p>
          <p className="text-[10px] uppercase font-mono tracking-wider text-outline">Environment: Active</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {([
            { label: "Dashboard", icon: "space_dashboard", path: "/platform" },
            { label: "Drona AI", icon: "bolt", path: "/drona" },
            { label: "Syllabus & Planner", icon: "edit_calendar", path: "/planner" },
            { label: "Progress", icon: "leaderboard", path: "/progress" },
            { label: "Knowledge Base", icon: "psychology", path: "/kb" },
          ] as const).map(item => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.label} href={item.path} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer group ${isActive ? "bg-primary text-white shadow-md shadow-primary/20" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface hover:translate-x-1"}`}>
                <span className="material-symbols-outlined text-[20px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 mt-8 mb-4">
          <p className="text-[10px] uppercase font-mono tracking-wider text-outline font-bold">AI Agents</p>
        </div>

        <nav className="px-3 space-y-1 mb-8">
          {([
            { label: "Physics Agent", emoji: "🔬" },
            { label: "Chemistry Agent", emoji: "⚗️" },
            { label: "Math Agent", emoji: "📐" },
            { label: "Biology Agent", emoji: "🧬" },
          ]).map(agent => (
            <button key={agent.label} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface hover:translate-x-1 transition-all cursor-pointer">
              <span className="text-lg">{agent.emoji}</span>
              {agent.label}
            </button>
          ))}
        </nav>

        <div className="px-6 mt-auto space-y-4">
          <button className="w-full bg-primary text-white font-bold text-sm py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg shadow-primary/20 transition-all cursor-pointer">
            Open Agent Dock
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Settings
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col pt-[76px]">
        {children}
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
