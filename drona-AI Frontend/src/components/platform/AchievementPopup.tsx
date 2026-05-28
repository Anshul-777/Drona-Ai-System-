"use client";

import React, { useEffect, useState } from "react";
import { useNotifications, ToastNotification } from "@/context/NotificationContext";
import { getAchievementById } from "@/lib/data/achievements";
import { getAchievementIcon } from "@/components/ui/AchievementIcons";

function AchievementToastItem({ toast, removeToast }: { toast: ToastNotification, removeToast: (id: string) => void }) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // Start exit animation after 2.5 seconds
    const hideTimer = setTimeout(() => {
      setIsAnimatingOut(true);
    }, 2500);

    // Fully remove from DOM exactly at 3 seconds
    const removeTimer = setTimeout(() => {
      removeToast(toast.id);
    }, 3000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, removeToast]);

  const achievementDetails = toast.achievementId 
    ? getAchievementById(toast.achievementId)
    : null;

  const badgeColor = achievementDetails?.badgeColor || "#c9a84c";
  const badgeBg = achievementDetails?.badgeBg || "#1a1a1a";
  const title = toast.title;
  // "claimed" vs "unlocked" determined by message content
  const isClaimed = toast.message?.toLowerCase().includes("claimed");
  const headerText = isClaimed ? "Trophy Claimed" : "New Trophy";

  return (
    <div 
      className="relative flex items-center shadow-[0_8px_40px_rgba(0,0,0,0.4)] rounded-full pr-10 pl-1 py-1 overflow-hidden origin-left"
      style={{
        background: `linear-gradient(135deg, #fdf5e6 0%, #f5edd6 50%, #ece0c0 100%)`,
        border: `1.5px solid ${badgeColor}40`,
        animation: isAnimatingOut ? 'collapseLeft 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards' : 'expandRight 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards',
        maxWidth: '500px',
      }}
    >
      {/* Intense Diagonal Shine Sweep */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ borderRadius: 'inherit' }}
      >
        <div
          className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            transform: 'skewX(-25deg)',
            animation: 'fastShine 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            opacity: 0,
          }}
        />
      </div>

      {/* Glowing Stars */}
      <div 
        className="absolute -top-3 left-6 w-6 h-6 z-20 pointer-events-none"
        style={{ 
          color: badgeColor,
          animation: 'starGlow 2s ease-in-out infinite',
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
      <div 
        className="absolute -bottom-2 right-12 w-4 h-4 z-20 pointer-events-none"
        style={{ 
          color: badgeColor,
          animation: 'starGlow 2s ease-in-out infinite 0.7s', // delay for offset
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Circular Icon Badge */}
      <div 
        className="relative w-14 h-14 rounded-full flex items-center justify-center shrink-0 z-10 mr-4"
        style={{ 
          background: badgeBg,
          border: `2px solid ${badgeColor}80`,
          boxShadow: `0 0 20px ${badgeColor}30, inset 0 0 15px ${badgeColor}10`,
        }}
      >
        <div 
          className="absolute inset-[2px] rounded-full" 
          style={{ 
            border: `1px dashed ${badgeColor}50`,
            animation: 'spin 8s linear infinite',
          }} 
        />
        <div className="relative z-10">
          {getAchievementIcon(
            toast.achievementId || "", 
            badgeColor, 
            "w-8 h-8"
          )}
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col justify-center z-10 py-1.5 whitespace-nowrap overflow-hidden pr-6"
           style={{ animation: isAnimatingOut ? 'fadeOutText 0.3s ease-out forwards' : 'fadeInText 0.8s ease-out forwards' }}>
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5">
            <span 
              className="font-display font-black text-xs uppercase tracking-[0.2em]"
              style={{ color: badgeColor }}
            >
              {headerText}
            </span>
            <span className="text-sm text-black">✦</span>
          </div>
        </div>
        <div 
          className="w-full h-[1px] mb-1" 
          style={{ background: `linear-gradient(to right, ${badgeColor}50, transparent)` }}
        />
        <h3 className="font-display font-bold text-lg text-[#3d3321] leading-tight pr-4">
          &ldquo;{title}&rdquo;
        </h3>
      </div>

      {/* Floating XP Animation */}
      {achievementDetails && (
        <div 
          className="absolute font-display font-black text-2xl z-50 pointer-events-none whitespace-nowrap drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ 
            color: badgeColor,
            top: '-10px',
            left: '50%',
            animation: 'floatUpXP 1.2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards' 
          }}
        >
          +{achievementDetails.xpReward} XP
        </div>
      )}
    </div>
  );
}

export default function AchievementPopup() {
  const { activeToasts, removeToast } = useNotifications();
  
  // Get achievement toasts, sort newest first, limit to 3 stacked
  const achievementToasts = activeToasts
    .filter((t) => t.type === "achievement")
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);

  if (achievementToasts.length === 0) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] pointer-events-none flex flex-col-reverse gap-3 items-center">
      
      {achievementToasts.map(toast => (
        <AchievementToastItem 
          key={toast.id} 
          toast={toast} 
          removeToast={removeToast} 
        />
      ))}

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes expandRight {
          0% { opacity: 0; max-width: 60px; padding-right: 0px; }
          20% { opacity: 1; max-width: 60px; padding-right: 0px; }
          100% { opacity: 1; max-width: 500px; padding-right: 40px; }
        }
        @keyframes collapseLeft {
          0% { opacity: 1; max-width: 500px; padding-right: 40px; }
          80% { opacity: 1; max-width: 60px; padding-right: 0px; }
          100% { opacity: 0; max-width: 60px; padding-right: 0px; }
        }
        @keyframes fadeInText {
          0% { opacity: 0; transform: translateX(-10px); }
          50% { opacity: 0; transform: translateX(-10px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOutText {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-10px); }
        }
        @keyframes fastShine {
          0% { transform: skewX(-25deg) translateX(-150px); opacity: 0; }
          20% { opacity: 0.8; }
          60% { transform: skewX(-25deg) translateX(600px); opacity: 0; }
          100% { transform: skewX(-25deg) translateX(600px); opacity: 0; }
        }
        @keyframes starGlow {
          0%, 100% { transform: scale(0.8); opacity: 0.5; filter: drop-shadow(0 0 5px rgba(255,255,255,0.5)); }
          50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 15px rgba(255,255,255,0.9)); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes floatUpXP {
          0% { opacity: 0; transform: translate(-50%, 0) scale(0.5); }
          15% { opacity: 1; transform: translate(-50%, -20px) scale(1.1); }
          100% { opacity: 0; transform: translate(-50%, -60px) scale(1); }
        }
      `}</style>
    </div>
  );
}
