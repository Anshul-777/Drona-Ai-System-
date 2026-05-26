"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const stats = [
    { label: "Learning Streak", value: "12 days", icon: "local_fire_department", color: "from-orange-400 to-red-500" },
    { label: "XP Earned", value: "2,450", icon: "star", color: "from-yellow-400 to-orange-500" },
    { label: "Achievements", value: "18", icon: "emoji_events", color: "from-blue-400 to-purple-500" },
    { label: "Quiz Score", value: "92%", icon: "assessment", color: "from-green-400 to-emerald-500" },
  ];

  const quickAccess = [
    { title: "Chat with Drona", desc: "AI-powered learning", icon: "smart_toy", path: "/platform/main-learning/drona", color: "from-purple-500 to-pink-500" },
    { title: "Knowledge Games", desc: "Learn while playing", icon: "sports_esports", path: "/platform/main-learning/kb", color: "from-blue-500 to-cyan-500" },
    { title: "Test Arena", desc: "Practice & assessments", icon: "assignment", path: "/platform/test", color: "from-green-500 to-emerald-500" },
    { title: "Progress Tracker", desc: "View your growth", icon: "trending_up", path: "/platform/main-learning/progress", color: "from-yellow-500 to-orange-500" },
    { title: "Resources", desc: "Study materials", icon: "library_books", path: "/platform/resources", color: "from-indigo-500 to-purple-500" },
    { title: "Achievements", desc: "Your milestones", icon: "trophy", path: "/platform/main-learning/achievements", color: "from-red-500 to-pink-500" },
  ];

  const subjects = [
    { name: "Mathematics", progress: 78, icon: "calculate", color: "from-blue-400 to-blue-600" },
    { name: "Physics", progress: 65, icon: "science", color: "from-green-400 to-green-600" },
    { name: "Chemistry", progress: 82, icon: "lab_research", color: "from-purple-400 to-purple-600" },
    { name: "Biology", progress: 71, icon: "biotech", color: "from-orange-400 to-orange-600" },
  ];

  const recentActivity = [
    { action: "Completed", detail: "Algebra Basics Quiz", time: "2 hours ago", icon: "check_circle", color: "green" },
    { action: "Earned", detail: "Physics Master Badge", time: "5 hours ago", icon: "star", color: "yellow" },
    { action: "Played", detail: "Chemistry Puzzle Game", time: "Yesterday", icon: "sports_esports", color: "blue" },
  ];

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-background via-surface-container to-background p-6 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="relative rounded-3xl bg-gradient-to-r from-primary/20 via-tertiary/20 to-secondary/20 border border-outline-variant/30 p-8 md:p-12 overflow-hidden group hover:border-outline-variant/50 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h1 className="font-display text-4xl md:text-5xl font-black text-on-surface mb-2 tracking-tight">
              Welcome back! 👋
            </h1>
            <p className="text-on-surface-variant text-lg font-medium">
              You're on a <span className="text-primary font-bold">12-day</span> learning streak. Keep it up!
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="group rounded-2xl bg-surface-container border border-outline-variant/30 p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-2 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="material-symbols-outlined text-white text-6xl leading-none" style={{ fontSize: "24px" }}>
                  {stat.icon}
                </span>
              </div>
              <p className="text-on-surface-variant text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-on-surface font-display text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Subject Progress */}
        <div className="rounded-3xl bg-surface-container border border-outline-variant/30 p-8 hover:border-outline-variant/50 transition-all duration-500">
          <h2 className="font-display text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">school</span>
            Subject Progress
          </h2>
          <div className="space-y-6">
            {subjects.map((subject, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-white text-5xl leading-none" style={{ fontSize: "20px" }}>
                        {subject.icon}
                      </span>
                    </div>
                    <span className="font-semibold text-on-surface">{subject.name}</span>
                  </div>
                  <span className="text-primary font-bold">{subject.progress}%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden border border-outline-variant/30">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${subject.color} transition-all duration-1000`}
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div>
          <h2 className="font-display text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">dashboard</span>
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccess.map((item, idx) => (
              <div
                key={idx}
                onClick={() => router.push(item.path)}
                className="group rounded-2xl bg-surface-container border border-outline-variant/30 p-6 cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="material-symbols-outlined text-white text-6xl leading-none" style={{ fontSize: "28px" }}>
                    {item.icon}
                  </span>
                </div>
                <h3 className="font-semibold text-on-surface text-lg mb-1">{item.title}</h3>
                <p className="text-on-surface-variant text-sm mb-4">{item.desc}</p>
                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>Explore</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity & Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity */}
          <div className="rounded-2xl bg-surface-container border border-outline-variant/30 p-6">
            <h3 className="font-display text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">history</span>
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 pb-4 border-b border-outline-variant/30 last:border-b-0">
                  <div className={`w-10 h-10 rounded-full bg-${item.color}-500/20 flex items-center justify-center flex-shrink-0 mt-1`}>
                    <span className={`material-symbols-outlined text-${item.color}-600`} style={{ color: item.color === 'green' ? '#10b981' : item.color === 'yellow' ? '#f59e0b' : '#3b82f6' }}>
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface">
                      {item.action} <span className="font-normal text-on-surface-variant">{item.detail}</span>
                    </p>
                    <p className="text-sm text-on-surface-variant">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-tertiary/10 border border-outline-variant/30 p-6">
            <h3 className="font-display text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">event</span>
              Upcoming Events
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-outline-variant/30">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-primary">calendar_today</span>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">Monthly Quiz Challenge</p>
                  <p className="text-sm text-on-surface-variant">Ends in 5 days</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b border-outline-variant/30">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-secondary">gavel</span>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">Subject Mastery Test</p>
                  <p className="text-sm text-on-surface-variant">Next Friday</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-tertiary">trophy</span>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">Weekly Leaderboard Reset</p>
                  <p className="text-sm text-on-surface-variant">Tomorrow at 12:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
