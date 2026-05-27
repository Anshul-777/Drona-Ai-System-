"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AgentDockLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { label: "Architecture", icon: "account_tree", href: "/agent-dock/architecture" },
    { label: "Memory", icon: "hub", href: "/agent-dock/memory" },
    { label: "Teacher Lounge", icon: "forum", href: "/agent-dock/lounge" },
    { label: "Settings", icon: "tune", href: "/agent-dock/settings" },
  ];

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex flex-col antialiased overflow-hidden selection:bg-primary/20">
      {/* ═══════════════════════════════════════════════════════
          TOP BAR — Agent Dock Header
          ═══════════════════════════════════════════════════════ */}
      <header className="bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 z-50 flex-shrink-0">
        <div className="flex items-center justify-between px-6 h-14">
          {/* Left: Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined filled text-on-primary text-[16px]">smart_toy</span>
              </div>
              <h1 className="font-display font-bold text-lg text-on-surface tracking-tight">Agent Dock</h1>
              <span className="text-[10px] font-mono font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Live</span>
            </div>
          </div>

          {/* Center: View Tabs */}
          <nav className="hidden md:flex items-center gap-6 h-full">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`relative px-2 py-2 text-sm font-medium transition-colors h-full flex items-center gap-2 group ${
                    isActive ? "text-primary font-bold" : "text-secondary hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  {tab.label}
                  <div
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-primary rounded-t-full transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-1/2 group-hover:bg-outline-variant/50"
                    }`}
                  ></div>
                </Link>
              );
            })}
          </nav>

          {/* Right: Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-secondary">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              <span>7 agents online</span>
            </div>
            <div className="w-px h-6 bg-outline-variant/30"></div>
            <div className="flex items-center gap-2 text-xs font-mono text-secondary">
              <span className="material-symbols-outlined text-[14px] text-primary">speed</span>
              <span>14ms</span>
            </div>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex border-t border-outline-variant/20 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex-1 min-w-max px-4 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  isActive ? "text-primary border-primary" : "text-secondary border-transparent"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span> {tab.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
