"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex h-screen w-full bg-surface-container-lowest text-on-surface font-body">
      {/* Sidebar */}
      <aside className="w-64 border-r border-outline-variant/20 bg-surface-container-lowest p-6 flex flex-col h-full shrink-0 hidden md:flex">
        <Link href="/" className="flex items-center gap-3 group mb-10">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md border border-white/10 group-hover:scale-105 transition-transform">
            <span className="text-white font-serif font-bold text-xl">D</span>
          </div>
          <span className="font-serif font-black text-2xl tracking-tighter text-black">
            DRONA<sup className="text-[0.5em] text-primary font-sans tracking-normal ml-0.5">AI</sup>
          </span>
        </Link>

        <nav className="flex-1 space-y-2">
          {["Dashboard", "Study Modules", "Assessments", "Analytics", "Settings"].map((item, i) => (
            <button key={item} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${i === 0 ? "bg-primary text-white shadow-md" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"}`}>
              {item}
              {i === 0 && <span className="material-symbols-outlined text-[18px]">chevron_right</span>}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              U
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">Student Workspace</p>
              <p className="text-xs text-on-surface-variant">Active Session</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto bg-surface-container-lowest animate-[fadeIn_0.5s_ease]">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl mb-1 text-on-surface">Welcome back.</h1>
            <p className="text-on-surface-variant">Here is an overview of your learning progress.</p>
          </div>
          <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border border-outline-variant/30 shadow-sm rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            Updates
          </button>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: "Current Module", value: "Advanced Mathematics", icon: "school", color: "bg-blue-50 text-blue-600 border-blue-100" },
            { title: "Assessments Pending", value: "2", icon: "assignment", color: "bg-purple-50 text-purple-600 border-purple-100" },
            { title: "Accuracy Score", value: "87%", icon: "trending_up", color: "bg-green-50 text-green-600 border-green-100" }
          ].map(stat => (
            <div key={stat.title} className="bg-white p-6 rounded-3xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${stat.color}`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <p className="text-on-surface-variant text-sm font-bold mb-1 uppercase tracking-wider">{stat.title}</p>
              <p className="font-display text-2xl font-black text-on-surface">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Dummy Chart Area */}
        <div className="bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">insights</span>
          </div>
          <h2 className="font-display text-xl font-bold mb-2">Learning Analytics</h2>
          <p className="text-on-surface-variant text-center max-w-md">Your recent test performance and memory retention charts will be displayed here once you complete your first assessment.</p>
        </div>
      </main>
    </div>
  );
}
