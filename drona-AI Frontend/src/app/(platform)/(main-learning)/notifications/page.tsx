"use client";

import React, { useState } from "react";
import { useNotifications, Notification } from "@/context/NotificationContext";
import Link from "next/link";
import Image from "next/image";

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all"); // all, unread, system, agent, alert

  const filteredNotifications = notifications.filter((notif) => {
    // Search
    const matchesSearch =
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter
    if (filterType === "unread") return matchesSearch && !notif.isRead;
    if (filterType !== "all" && filterType !== "unread") return matchesSearch && notif.type === filterType;
    
    return matchesSearch;
  });

  const getIconData = (type: string) => {
    switch (type) {
      case "agent": return { icon: "psychology", color: "text-violet-500", bg: "bg-violet-50", border: "border-violet-200" };
      case "alert": return { icon: "warning", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" };
      case "achievement": return { icon: "emoji_events", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" };
      default: return { icon: "notifications", color: "text-primary", bg: "bg-blue-50", border: "border-blue-200" };
    }
  };

  const timeAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-8 animate-fadeIn transition-all duration-300 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-on-surface mb-2">Notification Center</h1>
          <p className="text-on-surface-variant font-medium">Manage your alerts, agent messages, and system updates.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm font-bold text-on-surface hover:text-primary transition-colors flex items-center gap-2 rounded-xl hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[20px]">done_all</span>
            Mark all as read
          </button>
          <button 
            onClick={clearAll}
            className="px-4 py-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 rounded-xl hover:bg-red-50"
          >
            <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
            Clear all
          </button>
        </div>
      </div>

      {/* Controls: Search and Filter */}
      <div className="bg-white border border-outline-variant/30 p-4 rounded-2xl flex flex-col md:flex-row gap-4 mb-8 shadow-sm">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">search</span>
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar shrink-0">
          {[
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
            { id: "agent", label: "Agent" },
            { id: "system", label: "System" },
            { id: "alert", label: "Alert" }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
                filterType === f.id 
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                  : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:border-outline-variant/60 hover:text-on-surface"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-60">
            <span className="material-symbols-outlined text-6xl mb-4 text-outline-variant">notifications_off</span>
            <h3 className="text-xl font-bold text-on-surface mb-2">No notifications found</h3>
            <p className="text-on-surface-variant">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const { icon, color, bg, border } = getIconData(notif.type);
            
            const content = (
              <div 
                className={`w-full group bg-white border rounded-2xl p-5 flex items-start gap-4 transition-all duration-300 hover:shadow-md cursor-pointer relative overflow-hidden ${
                  !notif.isRead ? "border-primary/40 shadow-[0_0_15px_rgba(42,92,255,0.05)]" : "border-outline-variant/30 opacity-70 hover:opacity-100"
                }`}
                onClick={() => markAsRead(notif.id)}
              >
                {!notif.isRead && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                )}
                
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${bg} ${border}`}>
                  <span className={`material-symbols-outlined text-[24px] ${color}`}>{icon}</span>
                </div>
                
                <div className="flex-1 pr-12">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`text-base font-bold text-on-surface ${!notif.isRead ? "" : ""}`}>{notif.title}</h3>
                    <span className="text-[10px] uppercase font-black tracking-wider text-outline-variant px-2 py-0.5 rounded-full bg-surface-variant/30">
                      {notif.type}
                    </span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-2 max-w-4xl">
                    {notif.message}
                  </p>
                  <p className="text-xs font-bold text-outline-variant">{timeAgo(notif.timestamp)}</p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-lowest text-outline-variant hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Delete"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            );

            return notif.href ? (
              <Link href={notif.href} key={notif.id} className="block w-full">
                {content}
              </Link>
            ) : (
              <div key={notif.id}>{content}</div>
            );
          })
        )}
      </div>

    </main>
  );
}