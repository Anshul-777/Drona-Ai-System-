"use client";

import { useEffect, useState, useRef } from "react";
import { storageAdapter } from "@/lib/storageAdapter";
import { achievements } from "@/lib/data/achievements";
import { getAchievementIcon } from "@/components/ui/AchievementIcons";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// Components

function SVGRadarChart({ data }: { data: { name: string, value: number, trendColor?: string, trend?: string }[] }) {
  const size = 220;
  const center = size / 2;
  const radius = (size / 2) - 40;
  const sides = 6;

  if (!data || data.length === 0) return null;

  const getPoint = (val: number, i: number, r: number = radius) => {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    const distance = (val / 100) * r;
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance
    };
  };

  const gridLevels = [25, 50, 75, 100];
  const dataPoints = data.map((d, i) => getPoint(d.value, i));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  return (
    <div className="relative w-full h-[220px] flex items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Web/Grid Background */}
        {gridLevels.map((level) => {
          const points = Array.from({ length: 6 }).map((_, i) => getPoint(level, i)).map(p => `${p.x},${p.y}`).join(' ');
          return <polygon key={level} points={points} fill="none" stroke="#44444450" strokeWidth="1" />;
        })}

        {/* Spokes */}
        {Array.from({ length: 6 }).map((_, i) => {
          const outer = getPoint(100, i);
          return <line key={i} x1={center} y1={center} x2={outer.x} y2={outer.y} stroke="#44444450" strokeWidth="1" />;
        })}

        {/* The Data Polygon */}
        <polygon points={dataPath} fill="var(--color-primary)" fillOpacity="0.15" stroke="var(--color-primary)" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Labels */}
        {data.map((d, i) => {
          const labelP = getPoint(100, i, radius + 20);
          return (
            <text key={i} x={labelP.x} y={labelP.y} textAnchor="middle" alignmentBaseline="middle" fill="currentColor" fontSize="10" fontWeight="700" className="uppercase tracking-wider text-on-surface-variant">
              {d.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function CircularProgress({ value, label, color }: { value: number, label: string, color: string }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  // Real Mastery mapping instead of W/L
  const level = Math.floor(value / 20) + 1;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Subject Title */}
      <span className="text-[12px] font-medium text-on-surface mb-2">{label}</span>
      
      {/* SVG Ring Container */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-2">
        <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}>
          <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" className="text-surface-container-high" strokeWidth="6" />
          <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" className="text-surface-container-highest" strokeWidth="2" />
          <circle 
            cx="50" cy="50" r={radius} 
            fill="none" stroke={color} 
            strokeWidth="6" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="butt" 
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }} 
          />
          <circle 
            cx="50" cy="50" r={radius - 4} 
            fill="none" stroke={color} 
            strokeWidth="1" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="butt"
            opacity="0.5"
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }} 
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
          <span className="text-2xl font-normal text-on-surface leading-none font-sans tracking-tight">{value}%</span>
          <span className="text-[9px] text-on-surface-variant font-medium tracking-wide mt-1 uppercase">Mastery</span>
        </div>
      </div>

      {/* Subtext */}
      <div className="text-[10px] font-bold mt-1 text-on-surface-variant uppercase tracking-wider">
        Level <span className="text-primary">{level}</span>
      </div>
    </div>
  );
}

function ShieldBadge({ achievement }: { achievement: any }) {
  if (!achievement) return null;
  return (
    <div className="relative shrink-0 z-20 h-[154px] w-[128px] mx-auto transform scale-[0.85] origin-top">
      <svg viewBox="-20 -10 200 240" className="w-full h-full drop-shadow-2xl absolute top-0 left-0" style={{ filter: `drop-shadow(0 0 12px ${achievement.badgeColor}aa)` }}>
        <defs>
          <linearGradient id={`grad-${achievement.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`${achievement.badgeColor}30`} />
            <stop offset="100%" stopColor={achievement.badgeBg} />
          </linearGradient>
          <pattern id={`pattern-${achievement.id}`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="12" height="12" fill="none" />
            <line x1="0" y1="0" x2="0" y2="12" stroke={achievement.badgeColor} strokeWidth="2" opacity="0.12" />
          </pattern>
        </defs>
        <path d="M10,30 L150,30 L150,170 L80,190 L10,170 Z" fill={`url(#grad-${achievement.id})`} stroke={`${achievement.badgeColor}80`} strokeWidth="1.5" />
        <path d="M10,30 L150,30 L150,170 L80,190 L10,170 Z" fill={`url(#pattern-${achievement.id})`} />
        <path d="M18,36 L142,36 L142,165 L80,183 L18,165 Z" fill="none" stroke={`${achievement.badgeColor}25`} strokeWidth="0.8" />
        
        <circle cx="80" cy="115" r="32" fill={`${achievement.badgeBg}`} opacity="0.8" />
        <circle cx="80" cy="115" r="27" fill="none" stroke={`${achievement.badgeColor}20`} strokeWidth="0.8" />
        {[0, 90, 180, 270].map(deg => {
          const rad = (deg * Math.PI) / 180;
          return <circle key={deg} cx={80 + 32 * Math.cos(rad)} cy={115 + 32 * Math.sin(rad)} r="2.5" fill={achievement.badgeColor} />
        })}
        
        <rect x="30" y="165" width="100" height="4" fill={achievement.badgeColor} rx="2" />
        
        <path d="M-10,35 L170,35 L160,55 L170,75 L-10,75 L0,55 Z" fill="#1a1a1e" stroke={achievement.badgeColor} strokeWidth="1.5" />
        <path d="M-10,35 L0,25 L0,35 Z" fill={achievement.badgeColor} opacity="0.6" />
        <path d="M170,35 L160,25 L160,35 Z" fill={achievement.badgeColor} opacity="0.6" />
        <text x="80" y="59" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" letterSpacing="0.5">{achievement.name}</text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '15%' }}>
        {getAchievementIcon(achievement.id, achievement.badgeColor, "w-14 h-14 drop-shadow-[0_0_12px_currentColor]")}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editIgn, setEditIgn] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await storageAdapter.getProfileDashboardData();
      setDashboardData(data);
      setMounted(true);
    };
    fetchData();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is too large. Please select an image under 5MB.");
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file.");
        return;
      }

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Upload to storage bucket
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        await storageAdapter.updateUserProfile({ avatarUrl: publicUrl });
        window.location.reload();
      } catch (error) {
        console.error("Error uploading avatar:", error);
        alert("Failed to upload avatar.");
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!editIgn.trim()) return;
    await storageAdapter.updateUserProfile({ ign: editIgn.trim() });
    window.location.reload();
  };

  if (!mounted || !dashboardData) {
    return (
      <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-6 animate-fadeIn">
        <div className="w-full h-40 bg-surface-container-lowest rounded-2xl animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="h-96 bg-surface-container-lowest rounded-2xl animate-pulse"></div>
           <div className="h-96 bg-surface-container-lowest rounded-2xl animate-pulse"></div>
        </div>
      </main>
    );
  }

  const { profile, summary, cognitive, engagement, loadout, missionLog, mastery, topAchievements } = dashboardData;

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-6 animate-fadeIn relative">
      <div className="space-y-6">

        {/* HERO BANNER - Symmetrical Data Bar */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-md p-6 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group/hero">
          
          {/* Settings Button */}
          <button onClick={() => { setEditIgn(profile.ign); setIsEditingProfile(true); }} className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors z-10 opacity-0 group-hover/hero:opacity-100 p-2" title="Edit Profile">
             <span className="material-symbols-outlined text-xl">settings</span>
          </button>

          {/* Avatar Area */}
          <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
            {/* SVG Ring */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" className="text-surface-container-high" strokeWidth="4" />
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" className="text-primary" strokeWidth="4" strokeDasharray="289" strokeDashoffset={289 - (profile.xp / profile.xpMax) * 289} style={{ transition: 'all 1s ease-in-out' }} />
            </svg>
            <div onClick={() => fileRef.current?.click()} className="w-24 h-24 bg-surface-container-highest rounded-full overflow-hidden border-2 border-surface-container-lowest shadow-inner flex items-center justify-center relative group cursor-pointer">
              <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleAvatarChange} />
              {profile.avatarUrl ? (
                <Image src={profile.avatarUrl} alt="Avatar" layout="fill" objectFit="cover" />
              ) : (
                <span className="material-symbols-outlined text-5xl text-on-surface-variant">person</span>
              )}
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-3xl">add_photo_alternate</span>
              </div>
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#111114] text-white px-3 py-1 rounded shadow-lg border border-outline-variant/50 flex flex-col items-center justify-center leading-none">
              <span className="text-[8px] font-bold tracking-widest text-on-surface-variant mb-0.5">LEVEL</span>
              <span className="text-base font-black">{profile.level}</span>
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 flex flex-col justify-center w-full">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-on-surface font-serif mb-1">{profile.ign}</h1>
            
            <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-4">
              <span className="flex items-center gap-1 text-primary"><span className="material-symbols-outlined text-sm">emoji_events</span> {profile.title}</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant/50" />
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">my_location</span> {profile.playerClass}</span>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-lg">
              <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                <span className="tracking-widest text-primary">XP Progress</span>
                <span>{(profile.xp || 0).toLocaleString()} / {(profile.xpMax || 1).toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--color-primary),0.5)]" style={{ width: `${((profile.xp || 0) / (profile.xpMax || 1)) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Right Metrics Block */}
          <div className="shrink-0 flex items-center gap-8 md:pl-8 md:border-l border-outline-variant/30">
            <div className="flex flex-col items-center justify-center">
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Earnings</div>
              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
                <span className="material-symbols-outlined text-sm">generating_tokens</span> 
                <span className="font-bold text-sm">0</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Prestige</div>
              <span className="text-2xl font-black font-serif text-on-surface text-center">Unranked</span>
            </div>
          </div>
        </div>

        {/* TOP ROW: Account Details & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-md flex flex-col col-span-1">
             <div className="p-6">
               <h2 className="text-xl font-normal text-on-surface mb-6 font-sans tracking-tight uppercase tracking-wider">{profile.ign} <span className="text-primary text-sm">[{profile.title}]</span></h2>
               <div className="space-y-4 text-sm">
                 <div>
                   <span className="text-on-surface-variant block mb-1">Creation Date</span>
                   <div className="flex items-center gap-2 text-on-surface font-medium">
                     <span className="material-symbols-outlined text-lg">public</span> {profile.creationDate}
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-2">
                   <div>
                     <span className="text-on-surface-variant block mb-1">Time Played</span>
                     <span className="text-on-surface text-base font-normal">{profile.timePlayed}</span>
                   </div>
                   <div>
                     <span className="text-on-surface-variant block mb-1">Most Played</span>
                     <span className="text-[#a855f7] font-medium">{profile.mostPlayed}</span>
                   </div>
                 </div>
                 <div className="pt-2">
                   <span className="text-on-surface-variant block mb-1">Profile Visibility</span>
                   <span className={`font-bold ${profile.isPublic ? 'text-primary' : 'text-amber-500'}`}>{profile.isPublic ? 'Public' : 'Private'}</span>
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-md p-6 col-span-2 flex flex-col">
            <h2 className="text-xs font-bold text-on-surface-variant flex items-center gap-2 uppercase tracking-widest border-b border-outline-variant/20 pb-3 mb-4">
              <span className="material-symbols-outlined text-primary text-base">psychology</span>
              Drona AI Summary
            </h2>
            <p className="text-base text-on-surface leading-relaxed font-medium">
              {summary}
            </p>
          </div>
        </div>

        {/* FULL WIDTH CAREER SUMMARY STRIP */}
        <div className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-4 px-6 flex flex-wrap items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Quiz Pass Pct.</span>
            <span className="text-2xl font-medium text-emerald-500 leading-none">62%</span>
            <div className="flex gap-3 text-[10px] mt-1 font-medium">
               <div className="flex gap-1"><span className="text-on-surface-variant uppercase">Pass</span> <span className="text-on-surface">312</span></div>
               <div className="flex gap-1"><span className="text-on-surface-variant uppercase">Fail</span> <span className="text-on-surface">184</span></div>
            </div>
          </div>
          
          <div className="h-10 w-[1px] bg-outline-variant/20 hidden md:block"></div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Accuracy Ratio</span>
            <span className="text-2xl font-medium text-emerald-500 leading-none">1.45</span>
            <div className="flex gap-3 text-[10px] mt-1 font-medium">
               <div className="flex gap-1"><span className="text-on-surface-variant uppercase">Correct</span> <span className="text-on-surface">1,450</span></div>
               <div className="flex gap-1"><span className="text-on-surface-variant uppercase">Errors</span> <span className="text-on-surface">1,000</span></div>
            </div>
          </div>

          <div className="h-10 w-[1px] bg-outline-variant/20 hidden md:block"></div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total XP</span>
            <span className="text-2xl font-medium text-emerald-500 leading-none">{(profile.xp || 0).toLocaleString()}</span>
            <div className="flex gap-3 text-[10px] mt-1 font-medium">
               <div className="flex gap-1"><span className="text-on-surface-variant uppercase">Avg Session XP</span> <span className="text-on-surface">1,250</span></div>
            </div>
          </div>
        </div>

        {/* FULL WIDTH SUBJECT MASTERY */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-md p-6">
          <h2 className="text-sm font-bold flex items-center gap-2 text-on-surface mb-6 border-b border-outline-variant/20 pb-4">
            <span className="material-symbols-outlined text-primary">donut_large</span> Subject Mastery Rates
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-24 pt-2 pb-6">
            {Object.entries(mastery || {}).map(([subject, value], idx) => {
              const colors = ['#eab308', '#a855f7', '#3b82f6', '#ef4444'];
              return (
                <CircularProgress 
                  key={subject} 
                  label={subject} 
                  value={value as number} 
                  color={value === 0 ? "var(--color-outline-variant)" : colors[idx % colors.length]} 
                />
              );
            })}
          </div>
        </div>

        {/* 2-COLUMN LOWER LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* --- LEFT COLUMN --- */}
          <div className="flex flex-col gap-6">
            
            {/* Cognitive Metrics */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-md p-6">
              <div className="flex items-center justify-between mb-2 border-b border-outline-variant/20 pb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-primary">radar</span> Cognitive Baseline
                </h2>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex-1">
                  <SVGRadarChart data={cognitive || []} />
                </div>
                <div className="flex-1 space-y-3">
                  {(cognitive || []).map((metric: any, i: number) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex justify-between items-end text-xs">
                        <span className="font-bold text-on-surface-variant">{metric.name}</span>
                        <span className={`font-bold ${metric.trendColor}`}>{metric.value}%</span>
                      </div>
                      <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${metric.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Typology */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-md p-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-on-surface mb-6 border-b border-outline-variant/20 pb-4">
                <span className="material-symbols-outlined text-red-400">bug_report</span> Error Typology
              </h2>
              <div className="flex flex-col items-center justify-center py-8 opacity-50">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">check_circle</span>
                <p className="text-sm font-bold text-on-surface-variant tracking-wider uppercase">0 Errors Recorded</p>
                <p className="text-xs text-on-surface-variant/70 mt-1">Your record is clean.</p>
              </div>
            </div>

            {/* Mission Log */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-md p-6 flex-1">
              <h2 className="text-lg font-bold flex items-center gap-2 text-on-surface mb-6 border-b border-outline-variant/20 pb-4">
                <span className="material-symbols-outlined text-primary">history</span> Mission Log
              </h2>
              {missionLog && missionLog.length > 0 ? (
                <div className="relative border-l-2 border-outline-variant/20 ml-2 space-y-6">
                  {missionLog.map((log: any) => (
                    <div key={log.id} className="relative pl-6">
                      <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${log.color} ring-4 ring-surface-container-lowest`} />
                      <h4 className="font-bold text-on-surface text-sm leading-tight mb-1">{log.title}</h4>
                      <p className="text-xs text-on-surface-variant font-medium">{log.desc}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-50 h-full">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">assignment</span>
                  <p className="text-xs font-bold text-on-surface-variant uppercase">0 Missions Completed</p>
                </div>
              )}
            </div>
            
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="flex flex-col gap-6">

            {/* Top Achievements */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-md p-6">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-amber-400">military_tech</span> Top Honors
                </h2>
                <Link href="/achievements" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {topAchievements && topAchievements.length > 0 ? (
                  topAchievements.map((badgeId: string, idx: number) => {
                    const badge = achievements.find(a => a.id === badgeId);
                    if (!badge) return null;
                    return (
                      <Link href="/achievements" key={idx} className="flex items-center justify-center transform hover:scale-110 hover:drop-shadow-2xl transition-all duration-300 cursor-pointer">
                        <ShieldBadge achievement={badge} />
                      </Link>
                    );
                  })
                ) : (
                  <div className="col-span-3 flex flex-col items-center justify-center py-6 opacity-50">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">lock</span>
                    <p className="text-xs font-bold text-on-surface-variant uppercase">No Honors Yet</p>
                  </div>
                )}
                {/* Fill empty spots if less than 3 */}
                {Array.from({ length: Math.max(0, 3 - (topAchievements?.length || 0)) }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/10 bg-surface-container/30 opacity-50">
                     <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-surface-container-highest">
                        <span className="material-symbols-outlined text-on-surface-variant">lock</span>
                     </div>
                     <span className="text-[10px] font-bold text-on-surface-variant uppercase">Locked</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Analytics (New Section) */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-md p-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-on-surface mb-6 border-b border-outline-variant/20 pb-4">
                <span className="material-symbols-outlined text-emerald-400">monitoring</span> Performance Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/20 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-2">Study Streak</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-on-surface">3</span>
                    <span className="text-xs font-bold text-on-surface-variant">DAYS</span>
                  </div>
                </div>
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/20 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-2">Deep Work</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-on-surface">14</span>
                    <span className="text-xs font-bold text-on-surface-variant">HRS</span>
                  </div>
                </div>
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/20 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-2">Accuracy Rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-emerald-400">92%</span>
                  </div>
                </div>
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/20 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-2">Quizzes Passed</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-on-surface">18</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Active Loadout */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-md p-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-on-surface mb-6 border-b border-outline-variant/20 pb-4">
                <span className="material-symbols-outlined text-primary">inventory_2</span> Active Agent Loadout
              </h2>
              {loadout && loadout.length > 0 ? (
                <div className="space-y-3">
                  {loadout.map((agent: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border-l-4 bg-surface-container border-outline-variant/30 border-l-primary">
                      <div className="flex items-center gap-3">
                        <div className="text-primary">
                          <span className="material-symbols-outlined">psychology</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface text-sm">{agent}</h4>
                          <div className="text-[10px] font-bold text-on-surface-variant">Deployed</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 opacity-50">
                  <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">person_off</span>
                  <p className="text-xs font-bold text-on-surface-variant uppercase">0 Agents Active</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-6 w-full max-w-md border border-outline-variant/20">
            <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">edit</span>
              Update Profile Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant tracking-widest uppercase mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={editIgn}
                  onChange={(e) => setEditIgn(e.target.value)}
                  className="w-full bg-surface-container-highest border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter new IGN"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="px-5 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                className="px-6 py-2 text-sm font-bold bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-colors shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}