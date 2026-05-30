"use client";

import React from "react";
import { useNotifications } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

export default function NotificationPopup() {
  const { activeToasts: rawToasts, markAsRead, removeToast } = useNotifications();
  
  const activeToasts = rawToasts
    .filter((t) => t.type !== "achievement")
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);
    
  const router = useRouter();

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {activeToasts.map((toast) => {
        
        let icon = "notifications";
        let color = "text-primary";
        let bg = "bg-primary/10";
        
        if (toast.type === "agent") {
          icon = "psychology";
          color = "text-violet-500";
          bg = "bg-violet-500/10";
        } else if (toast.type === "alert") {
          icon = "warning";
          color = "text-amber-500";
          bg = "bg-amber-500/10";
        } else if (toast.type === "achievement") {
          icon = "emoji_events";
          color = "text-emerald-500";
          bg = "bg-emerald-500/10";
        } else if (toast.type === "recommended") {
          icon = "star";
          color = "text-orange-500";
          bg = "bg-orange-500/10";
        }

        return (
          <div
            key={toast.id}
            onClick={() => {
              markAsRead(toast.id);
              removeToast(toast.id);
              if (toast.href) {
                router.push(toast.href);
              } else {
                router.push("/notifications");
              }
            }}
            className={`pointer-events-auto w-[350px] bg-white border border-outline-variant/30 rounded-2xl p-4 shadow-2xl flex items-start gap-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
              toast.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
              <span className={`material-symbols-outlined text-[20px] ${color}`}>
                {icon}
              </span>
            </div>
            <div className="flex-1 pr-2">
              <h4 className="text-sm font-bold text-on-surface leading-tight mb-1">{toast.title}</h4>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed line-clamp-2">{toast.message}</p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
              className="text-outline hover:text-on-surface transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
