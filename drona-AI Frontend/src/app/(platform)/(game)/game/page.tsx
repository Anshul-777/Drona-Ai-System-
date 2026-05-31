"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { storageAdapter } from "@/lib/storageAdapter";

// ── Radar Math ──────────────────────────────────────────────────────
const getRadarPoint = (
  index: number,
  value: number,
  total: number,
  cx: number,
  cy: number,
  maxR: number
) => {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const r = (Math.min(Math.max(value, 0), 100) / 100) * maxR;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
};

const getGridPoint = (
  index: number,
  total: number,
  cx: number,
  cy: number,
  r: number
) => {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
};

// ── Helpers ──────────────────────────────────────────────────────────
const formatClock = (d: Date) =>
  d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// ── Constants ─────────────────────────────────────────────────────────
const THEME_HEX = "#c9a84c";
const THEME_RGB = "201, 168, 76";
const N_AXES = 6;
const CX = 50;
const CY = 50;
const MAX_R = 37;
const RINGS = [0.25, 0.5, 0.75, 1];

const DIFF_COLORS: Record<string, string> = {
  Novice: "#22c55e",
  Medium: "#3b82f6",
  Advanced: "#c9a84c",
  Expert: "#f97316",
  Legendary: "#a855f7",
};

// ═══════════════════════════════════════════════════════════════════
//  GAME LOBBY PAGE
// ═══════════════════════════════════════════════════════════════════

export default function GameDashboard() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [cognitive, setCognitive] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [topAchievements, setTopAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const data = await storageAdapter.getProfileDashboardData();
      setProfile(data.profile);
      setCognitive(data.cognitive || []);
      setTopAchievements(data.topAchievements || []);

      const rawMissions = await storageAdapter.getMissions();
      setMissions(rawMissions);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchData();

    window.addEventListener("drona_profile_updated", fetchData);
    return () => window.removeEventListener("drona_profile_updated", fetchData);
  }, [fetchData]);

  if (!mounted) return <div className="min-h-screen bg-[#0c0c15]" />;

  // ── Derived values ───────────────────────────────────────────────
  const currentXp = profile?.xp || 0;
  const xpMax = profile?.xpMax || 1000;
  const progressPct = Math.min(100, (currentXp / xpMax) * 100);
  const totalXp = ((profile?.level || 1) - 1) * 1000 + currentXp;
  const coinStr = profile?.kc || "0 KC";
  const coinNum = parseInt(coinStr.replace(/[^\d]/g, ""), 10) || 0;

  const activeMissions = missions
    .filter((m) => m.status === "active" || m.status === "claimable")
    .slice(0, 3);
  const completedCount = missions.filter((m) => m.status === "claimed").length;
  const claimableCount = missions.filter(
    (m) => m.status === "claimable"
  ).length;

  // ── Cognitive radar ──────────────────────────────────────────────
  const cogValues =
    cognitive.length > 0 ? cognitive.map((c) => c.value) : new Array(N_AXES).fill(0);
  const cogLabels =
    cognitive.length > 0
      ? cognitive.map((c) => c.name)
      : ["Logic", "Recall", "Speed", "Discipline", "Creativity", "Focus"];

  const dataPoints = cogValues.map((v, i) =>
    getRadarPoint(i, v, N_AXES, CX, CY, MAX_R)
  );
  const dataStr = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const maxRingPoints = RINGS[RINGS.length - 1]
    ? Array.from({ length: N_AXES }, (_, i) =>
        getGridPoint(i, N_AXES, CX, CY, MAX_R)
      )
    : [];

  // Label positions (beyond the outer ring)
  const labelPoints = Array.from({ length: N_AXES }, (_, i) =>
    getGridPoint(i, N_AXES, CX, CY, MAX_R + 12)
  );

  const statCards = [
    {
      label: "Total XP Earned",
      value: totalXp.toLocaleString(),
      icon: "emoji_events",
      color: THEME_HEX,
      sub: `Level ${profile?.level || 1}`,
    },
    {
      label: "KC Coins",
      value: coinNum.toLocaleString(),
      icon: "toll",
      color: "#00c896",
      sub: "Spendable balance",
    },
    {
      label: "Missions Done",
      value: completedCount,
      icon: "task_alt",
      color: "#3b82f6",
      sub: `${claimableCount} claimable`,
    },
    {
      label: "Current Rank",
      value: profile?.airRank > 0 ? `#${profile.airRank}` : "—",
      icon: "social_leaderboard",
      color: "#a855f7",
      sub: profile?.percentile || "Unranked",
    },
  ];

  const quickLinks = [
    { label: "Leaderboard", icon: "social_leaderboard", path: "/game/leaderboard", color: THEME_HEX },
    { label: "Boss Battle", icon: "swords", path: "/game/boss", color: "#ef4444" },
    { label: "All Missions", icon: "tour", path: "/game/missions", color: "#3b82f6" },
    { label: "Badges", icon: "military_tech", path: "/game/badges", color: "#a855f7" },
  ];

  return (
    <main className="w-full min-h-screen bg-[#0c0c15] relative flex flex-col text-white overflow-x-hidden">

      {/* ── Ambient Background ─────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -top-64 left-[15%] w-[800px] h-[800px] rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(${THEME_RGB}, 0.07) 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute top-[35%] -right-24 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-[5%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)",
          }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(${THEME_RGB}, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(${THEME_RGB}, 0.03) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
        {/* Diagonal scanner line */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            background: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              rgba(${THEME_RGB}, 1) 40px,
              rgba(${THEME_RGB}, 1) 41px
            )`,
          }}
        />
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1700px] mx-auto px-6 lg:px-10 py-8 flex flex-col gap-7">

        {/* ── TOP HEADER BAR ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: THEME_HEX }}
              />
              <span className="text-[10px] font-mono font-bold tracking-[0.35em] uppercase"
                style={{ color: THEME_HEX }}>
                The Arena • Gamification Environment
              </span>
            </div>
            <h1 className="font-display font-black text-[2.6rem] lg:text-5xl text-white tracking-tight leading-none">
              Gamification Lobby
            </h1>
            <p className="text-sm text-white/35 font-medium mt-2 max-w-xl leading-relaxed">
              Transform study hours into measurable conquests. Dominate leaderboards, conquer Boss Battles, and forge your academic legacy.
            </p>
          </div>

          {/* Live Date/Time */}
          <div
            className="flex flex-col items-start sm:items-end shrink-0 self-start sm:self-auto px-5 py-4 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span
              className="font-mono text-3xl font-black tabular-nums leading-none tracking-tight"
              style={{ color: THEME_HEX, textShadow: `0 0 20px rgba(${THEME_RGB}, 0.4)` }}
            >
              {formatClock(now)}
            </span>
            <span className="text-[11px] text-white/35 tracking-wider mt-1.5 font-medium">
              {formatDate(now)}
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">
                System Online
              </span>
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ROW ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-5 overflow-hidden group transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget.style.borderColor = `rgba(${THEME_RGB}, 0.25)`);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              {/* Background glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at top left, ${stat.color}12, transparent 70%)`,
                }}
              />
              <div className="relative z-10 flex items-start justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${stat.color}18`,
                    border: `1px solid ${stat.color}30`,
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{
                      color: stat.color,
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    {stat.icon}
                  </span>
                </div>
              </div>
              <div className="relative z-10">
                <div className="font-display font-black text-2xl text-white tabular-nums leading-none">
                  {stat.value}
                </div>
                <div className="text-[10px] text-white/35 font-bold uppercase tracking-widest mt-1.5">
                  {stat.label}
                </div>
                <div
                  className="text-[9px] font-bold mt-0.5"
                  style={{ color: `${stat.color}90` }}
                >
                  {stat.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID (Left 4 col + Right 8 col) ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ╔══════════════════════╗
              ║  LEFT COLUMN         ║
              ╚══════════════════════╝ */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* ── IDENTITY CARD ─────────────────────────────────── */}
            <div
              className="relative rounded-[1.75rem] p-7 flex flex-col items-center text-center overflow-hidden group transition-all duration-500"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `rgba(${THEME_RGB}, 0.3)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              {/* Corner accent lines */}
              <div
                className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, rgba(${THEME_RGB}, 0.15), transparent)`,
                  borderRadius: "1.75rem 0 0 0",
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none"
                style={{
                  background: `linear-gradient(315deg, rgba(${THEME_RGB}, 0.08), transparent)`,
                  borderRadius: "0 0 1.75rem 0",
                }}
              />

              {/* Avatar */}
              <div className="relative mb-5 z-10">
                {/* Outer dashed ring */}
                <div
                  className="absolute -inset-3 rounded-full border-dashed animate-[spin_12s_linear_infinite] opacity-30"
                  style={{ borderColor: THEME_HEX, borderWidth: "1.5px" }}
                />
                {/* Inner solid ring */}
                <div
                  className="w-[112px] h-[112px] rounded-full flex items-center justify-center overflow-hidden relative"
                  style={{
                    border: `3px solid ${THEME_HEX}`,
                    boxShadow: `0 0 40px rgba(${THEME_RGB}, 0.25), 0 0 0 6px rgba(${THEME_RGB}, 0.08)`,
                    background: "rgba(10,10,20,0.9)",
                  }}
                >
                  {profile?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      className="material-symbols-outlined text-5xl"
                      style={{ color: `${THEME_HEX}80` }}
                    >
                      person
                    </span>
                  )}
                </div>

                {/* Level badge */}
                <div
                  className="absolute -bottom-1 -right-1 min-w-[36px] h-9 flex flex-col items-center justify-center px-2 rounded-full border-2 shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${THEME_HEX}, #a07035)`,
                    borderColor: "#0c0c15",
                    boxShadow: `0 4px 14px rgba(${THEME_RGB}, 0.4)`,
                  }}
                >
                  <span className="text-[8px] font-black text-white/70 uppercase tracking-widest leading-none">
                    LVL
                  </span>
                  <span className="font-black text-sm text-white leading-none">
                    {profile?.level || 1}
                  </span>
                </div>
              </div>

              {/* Name */}
              <h2
                className="font-display font-black text-2xl text-white tracking-wider uppercase mb-1 z-10 relative"
                style={{ textShadow: `0 2px 10px rgba(${THEME_RGB}, 0.2)` }}
              >
                {profile?.ign || "Scholar"}
              </h2>

              {/* Title badge */}
              <div className="flex items-center gap-2 mb-5 z-10 relative flex-wrap justify-center">
                <span
                  className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full"
                  style={{
                    color: THEME_HEX,
                    background: `rgba(${THEME_RGB}, 0.12)`,
                    border: `1px solid rgba(${THEME_RGB}, 0.3)`,
                  }}
                >
                  {profile?.title || "NOVICE"}
                </span>
                <span className="text-[10px] font-bold uppercase text-white/25 tracking-widest">
                  {profile?.playerClass || "INITIATE"}
                </span>
              </div>

              {/* XP Progress */}
              <div className="w-full z-10 relative mb-5">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                  <span className="text-white/35">XP Progress</span>
                  <span style={{ color: THEME_HEX }}>
                    {currentXp.toLocaleString()} / {xpMax.toLocaleString()}
                  </span>
                </div>
                <div
                  className="w-full h-2.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="h-full rounded-full relative overflow-hidden transition-all duration-1000"
                    style={{
                      width: `${progressPct}%`,
                      background: `linear-gradient(90deg, rgba(${THEME_RGB}, 0.6), ${THEME_HEX})`,
                      boxShadow: `0 0 14px rgba(${THEME_RGB}, 0.5)`,
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full animate-[shimmer_2.5s_infinite]" />
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 w-full gap-3 z-10 relative">
                {[
                  { label: "KC", value: coinNum > 0 ? `${coinNum.toLocaleString()}` : "0", icon: "toll" },
                  { label: "Member Since", value: profile?.creationDate?.split(" ")?.[1] || "2026", icon: "calendar_today" },
                  { label: "Missions", value: completedCount.toString(), icon: "task_alt" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center py-3.5 px-2 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[15px] mb-1.5"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {item.icon}
                    </span>
                    <span className="font-black text-sm text-white leading-none">
                      {item.value}
                    </span>
                    <span className="text-[8px] uppercase tracking-widest text-white/25 mt-1 font-bold text-center leading-tight">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Profile link */}
              <Link
                href="/profile"
                className="mt-4 z-10 relative flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors"
                style={{ color: "rgba(255,255,255,0.25)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = THEME_HEX)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.25)")
                }
              >
                <span className="material-symbols-outlined text-[13px]">
                  manage_accounts
                </span>
                Edit Profile
              </Link>
            </div>

            {/* ── COGNITIVE RADAR ───────────────────────────────── */}
            <div
              className="rounded-[1.75rem] p-7 flex flex-col relative overflow-hidden"
              style={{
                background: "rgba(8, 8, 20, 0.95)",
                border: `1px solid rgba(${THEME_RGB}, 0.18)`,
                boxShadow: `0 0 60px rgba(${THEME_RGB}, 0.04) inset`,
              }}
            >
              {/* Top glow */}
              <div
                className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none rounded-full opacity-30"
                style={{
                  background: `radial-gradient(ellipse, rgba(${THEME_RGB}, 0.2), transparent)`,
                }}
              />

              <div className="flex items-center justify-between mb-5 relative z-10">
                <div>
                  <h3
                    className="font-mono text-xs font-bold tracking-[0.35em] uppercase"
                    style={{ color: THEME_HEX }}
                  >
                    Cognitive Radar
                  </h3>
                  <p className="text-[10px] text-white/30 mt-0.5 font-medium">
                    Real-time telemetry profile
                  </p>
                </div>
                <Link
                  href="/stats"
                  className="flex items-center gap-0.5 text-[9px] font-black uppercase tracking-widest transition-colors"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = THEME_HEX)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.25)")
                  }
                >
                  Deep Stats
                  <span className="material-symbols-outlined text-[12px]">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* SVG Radar Chart */}
              <div className="w-full max-w-[230px] mx-auto aspect-square relative z-10">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Grid rings */}
                  {RINGS.map((ring, ri) => {
                    const pts = Array.from({ length: N_AXES }, (_, i) =>
                      getGridPoint(i, N_AXES, CX, CY, MAX_R * ring)
                    );
                    return (
                      <polygon
                        key={ri}
                        points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
                        fill="none"
                        stroke={`rgba(${THEME_RGB}, ${0.08 + ri * 0.04})`}
                        strokeWidth="0.5"
                      />
                    );
                  })}

                  {/* Spokes */}
                  {maxRingPoints.map((pt, i) => (
                    <line
                      key={i}
                      x1={CX}
                      y1={CY}
                      x2={pt.x}
                      y2={pt.y}
                      stroke={`rgba(${THEME_RGB}, 0.15)`}
                      strokeWidth="0.5"
                    />
                  ))}

                  {/* Data polygon */}
                  <polygon
                    points={dataStr}
                    fill={`rgba(${THEME_RGB}, 0.12)`}
                    stroke={`rgba(${THEME_RGB}, 0.85)`}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    className="transition-all duration-1000"
                    style={{
                      filter: `drop-shadow(0 0 6px rgba(${THEME_RGB}, 0.5))`,
                    }}
                  />

                  {/* Data dots */}
                  {dataPoints.map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r="2"
                      fill={THEME_HEX}
                      style={{
                        filter: `drop-shadow(0 0 4px ${THEME_HEX})`,
                      }}
                    />
                  ))}

                  {/* Center dot */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r="1.2"
                    fill={`rgba(${THEME_RGB}, 0.4)`}
                  />
                </svg>

                {/* Axis Labels — positioned using SVG coord mapping */}
                {labelPoints.map((pt, i) => (
                  <div
                    key={i}
                    className="absolute text-[8px] font-black uppercase tracking-widest pointer-events-none"
                    style={{
                      left: `${pt.x}%`,
                      top: `${pt.y}%`,
                      transform: "translate(-50%, -50%)",
                      color: "rgba(255,255,255,0.45)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cogLabels[i]}
                  </div>
                ))}
              </div>

              {/* Metric bars */}
              <div className="flex flex-col gap-2.5 mt-6 relative z-10">
                {cognitive.map((c, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30 w-16 shrink-0">
                      {c.name}
                    </span>
                    <div
                      className="flex-1 h-1 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${c.value}%`,
                          background: THEME_HEX,
                          boxShadow: c.value > 0
                            ? `0 0 8px rgba(${THEME_RGB}, 0.4)`
                            : "none",
                        }}
                      />
                    </div>
                    <span
                      className="text-[9px] font-black tabular-nums w-6 text-right"
                      style={{ color: c.value > 0 ? THEME_HEX : "rgba(255,255,255,0.2)" }}
                    >
                      {c.value}
                    </span>
                    {c.trend && c.trend !== "0%" && (
                      <span className={`text-[8px] font-bold shrink-0 ${c.trendColor || "text-white/30"}`}>
                        {c.trend}
                      </span>
                    )}
                  </div>
                ))}
                {cognitive.length === 0 && (
                  <p className="text-[10px] text-white/20 text-center py-2 italic">
                    Complete assessments to build your profile.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ╔══════════════════════╗
              ║  RIGHT COLUMN        ║
              ╚══════════════════════╝ */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* ── QUICK NAV LINKS ───────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map((item, i) => (
                <Link
                  key={i}
                  href={item.path}
                  className="flex items-center gap-2.5 p-4 rounded-2xl transition-all duration-300 group hover:-translate-y-0.5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget.style.background = "rgba(255,255,255,0.07)");
                    (e.currentTarget.style.borderColor = `${item.color}35`);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${item.color}18`,
                      border: `1px solid ${item.color}30`,
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{
                        color: item.color,
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <span className="font-bold text-sm text-white/60 group-hover:text-white transition-colors truncate">
                    {item.label}
                  </span>
                  <span
                    className="material-symbols-outlined text-[13px] text-white/20 group-hover:text-white/40 ml-auto shrink-0 transition-colors"
                  >
                    chevron_right
                  </span>
                </Link>
              ))}
            </div>

            {/* ── ACTIVE MISSIONS ───────────────────────────────── */}
            <div
              className="rounded-[1.75rem] p-7 relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-display font-black text-xl text-white flex items-center gap-2.5">
                    <span
                      className="material-symbols-outlined text-[22px]"
                      style={{
                        color: THEME_HEX,
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      flag
                    </span>
                    Active Missions
                  </h3>
                  <p className="text-[11px] text-white/30 mt-1 font-medium">
                    {claimableCount > 0 ? (
                      <span className="text-green-400 font-bold">
                        ⚡ {claimableCount} mission{claimableCount > 1 ? "s" : ""} ready to claim!
                      </span>
                    ) : (
                      "Complete objectives to earn XP and KC rewards."
                    )}
                  </p>
                </div>
                <Link
                  href="/game/missions"
                  className="flex items-center gap-0.5 text-[10px] font-black uppercase tracking-widest transition-colors mt-1"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = THEME_HEX)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.25)")
                  }
                >
                  All Missions
                  <span className="material-symbols-outlined text-[14px]">
                    chevron_right
                  </span>
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-36 rounded-2xl animate-pulse"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    />
                  ))}
                </div>
              ) : activeMissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeMissions.map((mission) => {
                    const isClaimable = mission.status === "claimable";
                    const pct = mission.progress_pct || 0;
                    const diffColor =
                      DIFF_COLORS[mission.difficulty] || THEME_HEX;

                    return (
                      <Link
                        key={mission.id}
                        href="/game/missions"
                        className="flex flex-col p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group"
                        style={{
                          background: isClaimable
                            ? "rgba(34,197,94,0.06)"
                            : "rgba(255,255,255,0.03)",
                          border: isClaimable
                            ? "1px solid rgba(34,197,94,0.3)"
                            : "1px solid rgba(255,255,255,0.07)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = isClaimable
                            ? "rgba(34,197,94,0.5)"
                            : `rgba(${THEME_RGB}, 0.25)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = isClaimable
                            ? "rgba(34,197,94,0.3)"
                            : "rgba(255,255,255,0.07)";
                        }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          {/* XP badge / Claim badge */}
                          <span
                            className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                            style={
                              isClaimable
                                ? {
                                    color: "#22c55e",
                                    background: "rgba(34,197,94,0.15)",
                                    border: "1px solid rgba(34,197,94,0.3)",
                                  }
                                : {
                                    color: THEME_HEX,
                                    background: `rgba(${THEME_RGB}, 0.1)`,
                                    border: `1px solid rgba(${THEME_RGB}, 0.2)`,
                                  }
                            }
                          >
                            {isClaimable
                              ? "✓ Ready"
                              : `+${mission.xp_reward} XP`}
                          </span>
                          {/* Difficulty */}
                          <span
                            className="text-[8px] font-black uppercase tracking-widest"
                            style={{ color: `${diffColor}80` }}
                          >
                            {mission.difficulty}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-white mb-1 line-clamp-2 leading-snug">
                          {mission.title}
                        </h4>
                        <p className="text-[10px] text-white/35 mb-auto line-clamp-1">
                          {mission.subject} · {mission.mission_type}
                        </p>

                        {/* Progress bar */}
                        <div
                          className="w-full h-1 rounded-full overflow-hidden mt-4"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${pct}%`,
                              background: isClaimable
                                ? "#22c55e"
                                : THEME_HEX,
                              boxShadow: isClaimable
                                ? "0 0 8px rgba(34,197,94,0.5)"
                                : `0 0 8px rgba(${THEME_RGB}, 0.4)`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-bold mt-1.5"
                          style={{ color: "rgba(255,255,255,0.25)" }}>
                          <span>
                            {mission.progress_value}/{mission.target_value}
                          </span>
                          <span>{pct}%</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div
                  className="text-center py-10 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px dashed rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[40px] block mb-2"
                    style={{ color: "rgba(255,255,255,0.15)" }}
                  >
                    tour
                  </span>
                  <p className="text-sm text-white/25 font-medium">
                    No active missions found.
                  </p>
                  <Link
                    href="/game/missions"
                    className="inline-block mt-3 text-[10px] font-black uppercase tracking-widest transition-colors"
                    style={{ color: THEME_HEX }}
                  >
                    Browse Missions →
                  </Link>
                </div>
              )}
            </div>

            {/* ── BOSS BATTLE BANNER ────────────────────────────── */}
            <div
              className="rounded-[1.75rem] p-8 relative overflow-hidden group cursor-pointer min-h-[210px] flex items-center"
              style={{
                background:
                  "radial-gradient(ellipse at 65% 50%, #1c1215, #0c0c15)",
                border: `1px solid rgba(${THEME_RGB}, 0.15)`,
              }}
            >
              {/* Animated right glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to left, rgba(201,168,76,0.12) 0%, transparent 55%)",
                  transition: "opacity 0.6s",
                }}
              />
              <div
                className="absolute -right-8 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none opacity-10"
                style={{
                  background: `radial-gradient(circle, ${THEME_HEX}, transparent)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10 max-w-[58%]">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="material-symbols-outlined animate-pulse"
                    style={{
                      color: THEME_HEX,
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    crisis_alert
                  </span>
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.3em]"
                    style={{ color: THEME_HEX }}
                  >
                    Live Event
                  </span>
                </div>
                <h3 className="font-display text-[2rem] font-black mb-2 leading-tight text-white">
                  Organic Chemistry
                  <br />
                  Crucible
                </h3>
                <p className="text-white/40 text-sm mb-6 leading-relaxed max-w-[340px]">
                  High-stakes intellectual combat. Massive XP rewards and legendary artifacts await those who conquer the Boss.
                </p>
                <Link
                  href="/game/boss"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs transition-all duration-300"
                  style={{
                    border: `1px solid rgba(${THEME_RGB}, 0.35)`,
                    color: THEME_HEX,
                    background: "rgba(201,168,76,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = THEME_HEX;
                    e.currentTarget.style.color = "#0c0c15";
                    e.currentTarget.style.boxShadow = `0 8px 24px rgba(${THEME_RGB}, 0.3)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(201,168,76,0.06)";
                    e.currentTarget.style.color = THEME_HEX;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Enter Arena
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* Giant swords watermark */}
              <span
                className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 transition-all duration-700 pointer-events-none"
                style={{
                  fontSize: "150px",
                  color: "rgba(255,255,255,0.04)",
                  transform:
                    "translateY(-50%) rotate(-12deg)",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                swords
              </span>
            </div>

            {/* ── BOTTOM ROW: More Links ─────────────────────────── */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "XP & Streaks",
                  icon: "local_fire_department",
                  path: "/game/xp",
                  desc: "Track your momentum",
                  color: "#f97316",
                },
                {
                  label: "Tournaments",
                  icon: "emoji_events",
                  path: "/game/tournaments",
                  desc: "Weekly competitions",
                  color: THEME_HEX,
                },
                {
                  label: "Reward Shop",
                  icon: "storefront",
                  path: "/shop",
                  desc: `${coinNum.toLocaleString()} KC available`,
                  color: "#00c896",
                },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.path}
                  className="p-5 rounded-2xl flex flex-col transition-all duration-300 group hover:-translate-y-0.5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = `${item.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[22px] mb-3"
                    style={{
                      color: item.color,
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="font-bold text-sm text-white/70 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-white/25 mt-1">
                    {item.desc}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </main>
  );
}