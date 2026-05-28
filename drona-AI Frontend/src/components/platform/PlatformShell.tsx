"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";
import { useNotifications } from "@/context/NotificationContext";

export default function PlatformShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Scholar");
  const pathname = usePathname();
  const router = useRouter();
  const { addNotification, unreadCount } = useNotifications();

  useEffect(() => {
    setMounted(true);
    
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.replace('/');
      }
    };

    checkAuth();

    // Aggressive BFCache (Back/Forward Cache) prevention
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) checkAuth();
    };
    
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') checkAuth();
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Login Notification Logic
  useEffect(() => {
    if (mounted && userName) {
      const hasLoggedIn = localStorage.getItem("drona_has_logged_in_before");
      
      if (!hasLoggedIn) {
        // First Registration
        localStorage.setItem("drona_has_logged_in_before", "true");
        setTimeout(() => {
          addNotification({
            title: `Welcome to Drona, ${userName}!`,
            message: "Your cognitive baseline is initializing. We are thrilled to have you onboard.",
            type: "system",
            href: "/platform"
          });
        }, 1000);
        
        setTimeout(() => {
          addNotification({
            title: "Drona AI Protocol Active",
            message: "I am Drona, your advanced Multi-Agent system. I will orchestrate your learning, analyze your telemetry, and guide your journey to mastery.",
            type: "agent",
            href: "/agent-dock/architecture"
          });
        }, 2500);

        setTimeout(() => {
          // Silently unlock the achievement in localStorage so the achievements page can see it
          try {
            const existing = JSON.parse(localStorage.getItem("drona_unlocked_achievements") || "[]");
            if (!existing.includes("welcome-to-drona")) {
              existing.push("welcome-to-drona");
              localStorage.setItem("drona_unlocked_achievements", JSON.stringify(existing));
            }
          } catch {}

          addNotification({
            title: "Welcome to Drona",
            message: "Achievement Unlocked!",
            type: "achievement",
            achievementId: "welcome-to-drona"
          });
        }, 4000);
      } else {
        // Normal login, run only once per session
        const sessionLogged = sessionStorage.getItem("drona_session_welcome");
        if (!sessionLogged) {
          sessionStorage.setItem("drona_session_welcome", "true");
          setTimeout(() => {
            addNotification({
              title: `Welcome back, ${userName}!`,
              message: "Your dashboard and agents are ready for your next sprint.",
              type: "system",
              href: "/platform"
            });
          }, 1000);
        }
      }
    }
  }, [mounted, userName]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Force a hard reload to completely flush the Next.js client-side router cache
    window.location.href = '/';
  };

  const envTabs = [
    { id: 'learning', name: 'Learn', path: '/platform', hex: '#2a5cff', rgb: '42, 92, 255' },
    { id: 'test', name: 'Test', path: '/test', hex: '#e8362a', rgb: '232, 54, 42' },
    { id: 'game', name: 'Play', path: '/game', hex: '#c9a84c', rgb: '201, 168, 76' },
    { id: 'workspace', name: 'Workspace', path: '/workspace', hex: '#00c896', rgb: '0, 200, 150' },
    { id: 'resources', name: 'Resources', path: '/resources', hex: '#9b5de5', rgb: '155, 93, 229' },
    { id: 'career', name: 'Career', path: '/career', hex: '#1a1a24', rgb: '26, 26, 36' }
  ];

  const activeTab = envTabs.find(t => pathname.startsWith(t.path)) || envTabs[0];

  const [displayEnv, setDisplayEnv] = useState(activeTab.id);
  const [isFading, setIsFading] = useState(false);

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

  useEffect(() => {
    if (activeTab.id !== displayEnv) {
      setIsFading(true);
      const timer = setTimeout(() => {
        setDisplayEnv(activeTab.id);
        setIsFading(false);
      }, 250); // 250ms crossfade duration
      return () => clearTimeout(timer);
    }
  }, [activeTab.id, displayEnv]);

  if (!mounted) return <div className="min-h-screen bg-surface-container-lowest" />;

  const environmentSidebars: Record<string, any> = {
    learning: {
      title: "Core Learning",
      subtitle: "Environment: Active",
      navItems: [
        { label: "Dashboard", icon: "space_dashboard", path: "/platform" },
        { label: "Drona AI", icon: "bolt", path: "/drona" },
        { label: "Syllabus & Planner", icon: "edit_calendar", path: "/planner" },
        { label: "Progress", icon: "leaderboard", path: "/progress" },
        { label: "Knowledge Base", icon: "psychology", path: "/kb" },
        { label: "Achievements", icon: "emoji_events", path: "/achievements" },
      ],
      agentsTitle: "AI Agents",
      agents: [
        { label: "Physics Agent", emoji: "🔬", path: "/agent/physics" },
        { label: "Chemistry Agent", emoji: "⚗️", path: "/agent/chemistry" },
        { label: "Math Agent", emoji: "📐", path: "/agent/math" },
        { label: "Biology Agent", emoji: "🧬", path: "/agent/biology" },
        { label: "Other Subjects", emoji: "📚", path: "/agent/others" },
      ]
    },
    test: {
      title: "Assessment",
      subtitle: "Environment: Test Arena",
      navItems: [
        { label: "Mock Test Generator", icon: "quiz", path: "/test" },
        { label: "Viva Examiner", icon: "mic", path: "/test/viva" },
        { label: "Time Pressure Mode", icon: "timer", path: "/test/pressure" },
        { label: "Surprise Test", icon: "warning", path: "/test/surprise" },
      ],
      agentsTitle: "Analysis & Modes",
      agents: [
        { label: "Post-Exam Breakdown", emoji: "📈", path: "/test/breakdown" },
        { label: "Rank Predictor", emoji: "🎯", path: "/test/predictor" },
        { label: "Weak Topic Tests", emoji: "🔥", path: "/test/weak" },
        { label: "Exam Day Sim", emoji: "🏛️", path: "/test/sim" },
        { label: "Handwritten Eval", emoji: "📸", path: "/test/handwritten" },
      ]
    },
    game: {
      title: "The Arena",
      subtitle: "Environment: Gamified",
      navItems: [
        { label: "The Lobby", icon: "stadia_controller", path: "/game" },
        { label: "XP & Streaks", icon: "local_fire_department", path: "/game/xp" },
        { label: "Leaderboard", icon: "social_leaderboard", path: "/game/leaderboard" },
        { label: "Boss Battles", icon: "swords", path: "/game/boss" },
        { label: "Missions & Quests", icon: "tour", path: "/game/missions" },
      ],
      agentsTitle: "Achievements",
      agents: [
        { label: "Badges", emoji: "🎖️", path: "/game/badges" },
        { label: "Weekly Tournaments", emoji: "🏆", path: "/game/tournaments" },
        { label: "Reward Marketplace", emoji: "🎁", path: "/game/marketplace" },
      ]
    },
    workspace: {
      title: "Second Brain",
      subtitle: "Environment: Workspace",
      navItems: [
        { label: "My Notes", icon: "description", path: "/workspace" },
        { label: "Database", icon: "folder", path: "/workspace/database" },
        { label: "Planner & Calendar", icon: "calendar_month", path: "/workspace/planner" },
        { label: "To-Do & Tasks", icon: "task_alt", path: "/workspace/tasks" },
        { label: "Focus Timer", icon: "hourglass_bottom", path: "/workspace/timer" },
      ],
      agentsTitle: "Reports & Prefs",
      agents: [
        { label: "Weekly Report", emoji: "📊", path: "/workspace/weekly" },
        { label: "Parent Report", emoji: "📬", path: "/workspace/parent" },
        { label: "Personalize", emoji: "🎨", path: "/workspace/personalize" },
      ]
    },
    resources: {
      title: "The Toolbox",
      subtitle: "Environment: Resources",
      navItems: [
        { label: "Image-to-Solution", icon: "image_search", path: "/resources" },
        { label: "Audio Podcast", icon: "podcasts", path: "/resources/audio" },
        { label: "Diagrams & Flows", icon: "account_tree", path: "/resources/flow" },
        { label: "Academic Search", icon: "search", path: "/resources/search" },
        { label: "Formula Vault", icon: "functions", path: "/resources/formulas" },
      ],
      agentsTitle: "Study Tools",
      agents: [
        { label: "Flashcards", emoji: "🃏", path: "/resources/flashcards" },
        { label: "PYQ Analyzer", emoji: "📜", path: "/resources/pyq" },
        { label: "PDF Reader", emoji: "📖", path: "/resources/pdf" },
        { label: "Video Hub", emoji: "🎬", path: "/resources/video" },
      ]
    },
    career: {
      title: "Your Future",
      subtitle: "Environment: Career",
      navItems: [
        { label: "Career Roadmap", icon: "map", path: "/career" },
        { label: "Skill Gap Analyzer", icon: "troubleshoot", path: "/career/skills" },
        { label: "Resume Builder", icon: "document_scanner", path: "/career/resume" },
        { label: "Interview Practice", icon: "record_voice_over", path: "/career/interview" },
      ],
      agentsTitle: "Industry",
      agents: [
        { label: "Coding Challenges", emoji: "💻", path: "/career/challenges" },
        { label: "Industry Trends", emoji: "🌐", path: "/career/trends" },
      ]
    }
  };

  const currentSidebar = environmentSidebars[displayEnv] || environmentSidebars['learning'];

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
          <Logo href="/platform" isSpan={false} className="hover:opacity-80 transition-opacity" />
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
        <div className="flex items-center gap-4 -mr-2 lg:-mr-4">
          {/* Utility Icons */}
          <div className="hidden xl:flex items-center gap-2 mr-2">
            {headerIcons.map((item) => (
              <Link key={item.icon} href={item.path}
                className="w-11 h-11 rounded-xl hover:bg-surface-container-low flex items-center justify-center transition-all duration-300 cursor-pointer text-outline-variant hover:text-on-surface relative group"
              >
                <span className="material-symbols-outlined text-[22px] transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                {item.icon === 'notifications' && unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white pointer-events-none animate-pulse" />
                )}
                {/* Tooltip background effect */}
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-outline-variant/30 group-hover:shadow-sm transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Profile Component — Circular to Hexagonal Tech Design */}
          <Link href="/profile"
            className="flex items-center gap-0 cursor-pointer relative group transition-all duration-500 min-w-[300px] ml-6 -my-3 translate-y-[3px]"
            style={{
              '--env-hex': activeTab.hex,
              '--env-rgb': activeTab.rgb
            } as React.CSSProperties}
          >
            {/* ── Hexagonal Background & Tech Lines ── */}
            <div className="absolute inset-y-0 right-0 left-[32px] z-0 pointer-events-none transition-all duration-500 group-hover:scale-[1.01] origin-left">
              <svg className="w-full h-full drop-shadow-sm" preserveAspectRatio="none" viewBox="0 0 250 60">
                {/* Hexagonal Background Box */}
                <path d="M 0,0 L 235,0 L 250,15 L 250,60 L 15,60 L 0,45 Z" fill="white" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" className="transition-colors duration-500" style={{ color: 'rgba(var(--env-rgb), 0.2)' }} />

                {/* Horizontal Tech Lines (Very low visibility) */}
                {/* Top line positioned to stay safely above the name text */}
                <line x1="5" y1="2" x2="232" y2="2" stroke="currentColor" strokeWidth="0.5" className="opacity-[0.08] group-hover:opacity-20 transition-all duration-500" style={{ color: 'var(--env-hex)' }} />

                {/* Bottom line positioned to exactly touch the bottom of the header */}
                <line x1="12" y1="59.5" x2="242" y2="59.5" stroke="currentColor" strokeWidth="0.5" className="opacity-[0.15] group-hover:opacity-30 transition-all duration-500" style={{ color: 'var(--env-hex)' }} />

                {/* Shiny Diagonal Accent Stripes near the beveled corner (Top Right) */}
                <line x1="228" y1="0" x2="238" y2="10" stroke="currentColor" strokeWidth="1" className="opacity-[0.15] group-hover:opacity-50 transition-opacity duration-500" style={{ color: 'var(--env-hex)' }} />
                <line x1="232" y1="0" x2="242" y2="10" stroke="currentColor" strokeWidth="1.5" className="opacity-[0.22] group-hover:opacity-70 transition-opacity duration-500" style={{ color: 'var(--env-hex)' }} />
                <line x1="236" y1="0" x2="246" y2="10" stroke="currentColor" strokeWidth="1" className="opacity-[0.15] group-hover:opacity-50 transition-opacity duration-500" style={{ color: 'var(--env-hex)' }} />

                {/* Tech Geometric Shield Emblem sitting subtle in the empty right background */}
                <g className="opacity-[0.07] group-hover:opacity-[0.18] transition-opacity duration-500" style={{ color: 'var(--env-hex)' }}>
                  <polygon points="215,22 225,27 225,37 215,42 205,37 205,27" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  <line x1="215" y1="22" x2="215" y2="42" stroke="currentColor" strokeWidth="0.6" />
                  <line x1="205" y1="27" x2="225" y2="37" stroke="currentColor" strokeWidth="0.6" />
                  <line x1="205" y1="37" x2="225" y2="27" stroke="currentColor" strokeWidth="0.6" />
                  <circle cx="215" cy="32" r="3" fill="none" stroke="currentColor" strokeWidth="0.6" />
                </g>
              </svg>
            </div>

            {/* Avatar Container */}
            <div className="relative shrink-0 w-[64px] h-[64px] z-20">
              {/* 2 Very Small Circular Lines (Inside) */}
              <div
                className="absolute -inset-[2px] rounded-full border-[1.5px] border-dashed transition-colors duration-500 animate-[spin_8s_linear_infinite] opacity-30 group-hover:opacity-60"
                style={{ borderColor: 'var(--env-hex)' }}
              />
              <div
                className="absolute -inset-[4px] rounded-full border transition-colors duration-500 animate-[spin_15s_linear_infinite_reverse] opacity-20 group-hover:opacity-50"
                style={{ borderColor: 'var(--env-hex)' }}
              />

              {/* Outside Broken Hexagon separately (STATIC as requested) */}
              <div
                className="absolute -inset-[10px] border-[1.5px] border-dashed transition-colors duration-500 opacity-40 group-hover:opacity-70"
                style={{
                  borderColor: 'var(--env-hex)',
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                }}
              />

              {/* Avatar Circle */}
              <div
                className="w-full h-full rounded-full bg-surface-container-high border-[2px] flex items-center justify-center overflow-hidden transition-all duration-500 relative z-10 group-hover:scale-[1.05] shadow-md bg-white"
                style={{ borderColor: 'var(--env-hex)' }}
              >
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant transition-colors duration-500 group-hover:text-[var(--env-hex)]">person</span>
              </div>

              {/* Premium Environment-colored Shield Level Badge */}
              <div
                className="absolute -bottom-1 -left-1 w-[26px] h-[32px] flex flex-col items-center justify-start shadow-xl z-30 transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, var(--env-hex) 0%, rgba(var(--env-rgb), 0.7) 100%)',
                  clipPath: 'polygon(50% 100%, 100% 80%, 100% 0%, 0% 0%, 0% 80%)',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                }}
              >
                <div className="w-full text-center text-[5px] font-black uppercase text-white/90 tracking-widest pt-[3px] pb-[1px]">
                  LVL
                </div>
                <div className="text-white text-[12px] font-black leading-none mt-[1px]">
                  0
                </div>
              </div>
            </div>

            {/* Info Section — Extended full right */}
            <div className="flex flex-col justify-center pl-6 pr-6 py-1 relative z-10 flex-1">
              <div className="flex items-end justify-between w-full">
                {/* Bold Highlighted Name */}
                <span className="text-[17px] font-display font-black text-on-surface tracking-widest uppercase truncate transition-colors duration-500 group-hover:text-[var(--env-hex)] leading-none" style={{ textShadow: '0 1px 2px rgba(var(--env-rgb), 0.1)' }}>{userName}</span>
              </div>

              {/* Decreased Rank Size */}
              <div className="flex items-center gap-1.5 my-[2px]">
                <span className="material-symbols-outlined text-[9px] transition-colors duration-500" style={{ color: 'var(--env-hex)' }}>star_half</span>
                <span className="text-[7px] font-bold text-outline-variant uppercase tracking-[0.25em]">Recruit</span>
              </div>

              {/* Extended XP Bar with starting stats (0 / 100) */}
              <div className="flex items-center gap-2 w-full mt-[2px]">
                <span className="text-[7px] font-black uppercase tracking-widest shrink-0 transition-colors duration-500" style={{ color: 'var(--env-hex)' }}>XP</span>
                <div className="flex-1 h-[5px] bg-surface-variant/40 rounded-full overflow-hidden relative shadow-inner">
                  <div
                    className="w-0 h-full rounded-full relative overflow-hidden transition-all duration-500"
                    style={{ background: 'var(--env-hex)', boxShadow: '0 0 10px rgba(var(--env-rgb), 0.8)' }}
                  >
                    <div className="absolute inset-0 bg-white/40 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  </div>
                </div>
                <span className="text-[7.5px] font-mono font-medium text-outline-variant shrink-0 tracking-tight">
                  <span style={{ color: 'var(--env-hex)' }} className="font-bold transition-colors duration-500">0</span> / 100
                </span>
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

      <aside className={`fixed top-0 left-0 h-full w-[290px] bg-white border-r border-outline-variant/20 z-[75] transform transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>

        <div className={`flex flex-col flex-1 pt-24 pb-6 transition-all duration-250 ease-in-out w-full ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className={`px-6 mb-8 transition-all duration-500 ${sidebarOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: sidebarOpen ? '100ms' : '0ms' }}>
            <p className="text-sm font-display font-bold text-on-surface mb-1" style={{ color: activeTab.hex }}>{currentSidebar.title}</p>
            <p className="text-[10px] uppercase font-mono tracking-wider text-outline">{currentSidebar.subtitle}</p>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {currentSidebar.navItems.map((item: any, i: number) => {
              const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== activeTab.path);
              return (
                <Link key={item.label} href={item.path} onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer group ${sidebarOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${isActive ? "" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface hover:translate-x-1"}`}
                style={{
                  backgroundColor: isActive ? activeTab.hex : undefined,
                  color: isActive ? '#ffffff' : undefined,
                  boxShadow: isActive ? `0 4px 14px rgba(${activeTab.rgb}, 0.25)` : undefined,
                  transitionDuration: '500ms',
                  transitionDelay: sidebarOpen ? `${150 + i * 50}ms` : '0ms'
                }}
              >
                <span className="material-symbols-outlined text-[20px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={`px-6 mt-8 mb-4 transition-all duration-500 ${sidebarOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: sidebarOpen ? '400ms' : '0ms' }}>
          <p className="text-[10px] uppercase font-mono tracking-wider text-outline font-bold">{currentSidebar.agentsTitle}</p>
        </div>

        <nav className="px-3 space-y-1 mb-8">
          {currentSidebar.agents.map((agent: any, i: number) => (
            <Link key={agent.label} href={agent.path || '#'} onClick={() => setSidebarOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${sidebarOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface hover:translate-x-1`}
              style={{ transitionDuration: '500ms', transitionDelay: sidebarOpen ? `${450 + i * 50}ms` : '0ms' }}
            >
              <span className="text-lg">{agent.emoji}</span>
              {agent.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 mt-auto space-y-4">
          <Link href="/agent-dock/architecture"
            className={`w-full flex justify-center text-white font-bold text-sm py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer ${sidebarOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{
              backgroundColor: activeTab.hex,
              boxShadow: `0 4px 14px rgba(${activeTab.rgb}, 0.25)`,
              transitionDuration: '500ms',
              transitionDelay: sidebarOpen ? '650ms' : '0ms'
            }}
            onClick={() => setSidebarOpen(false)}
          >
            Open Agent Dock
          </Link>
          <Link href="/settings"
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer group ${sidebarOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface`}
            style={{ transitionDuration: '500ms', transitionDelay: sidebarOpen ? '700ms' : '0ms' }}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">settings</span>
            Settings
          </Link>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer group ${sidebarOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} text-on-surface-variant hover:bg-red-500/10 hover:text-red-500`}
            style={{ transitionDuration: '500ms', transitionDelay: sidebarOpen ? '750ms' : '0ms' }}
          >
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">logout</span>
            Log Out
          </button>
        </div>
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
        
        /* Globally hide scrollbars but allow scrolling */
        body, html {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        ::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
}
