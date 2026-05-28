"use client";

import { createClient } from "@/lib/supabase/client";

// ==========================================
// 🔴 TOGGLE THIS 1 LINE TO SWITCH BACKENDS 🔴
// ==========================================
export const USE_LOCAL_STORAGE = true; 

// A unified storage adapter that routes to either LocalStorage or Supabase
export const storageAdapter = {

  // --- Achievements & XP ---

  async getUserAchievements() {
    if (USE_LOCAL_STORAGE) {
      try {
        const u = localStorage.getItem("drona_unlocked_achievements");
        const c = localStorage.getItem("drona_claimed_achievements");
        const xp = localStorage.getItem("drona_total_xp");
        
        let unlocked = u ? JSON.parse(u) : [];
        let claimed = c ? JSON.parse(c) : [];
        let totalXp = xp ? parseInt(xp, 10) : 0;
        
        // Auto-unlock welcome
        const hasLoggedIn = localStorage.getItem("drona_has_logged_in_before");
        if (hasLoggedIn && !unlocked.includes("welcome-to-drona")) {
          unlocked.push("welcome-to-drona");
          localStorage.setItem("drona_unlocked_achievements", JSON.stringify(unlocked));
        }
        return { unlocked, claimed, totalXp };
      } catch {
        return { unlocked: [], claimed: [], totalXp: 0 };
      }
    } else {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return { unlocked: [], claimed: [], totalXp: 0 };
      
      const { data: profile } = await supabase.from("profiles").select("xp_total").eq("id", session.user.id).single();
      const { data: userAchvs } = await supabase.from("user_achievements").select("achievement_id, is_claimed").eq("user_id", session.user.id);
      
      let unlocked = userAchvs ? userAchvs.map((a: any) => a.achievement_id) : [];
      let claimed = userAchvs ? userAchvs.filter((a: any) => a.is_claimed).map((a: any) => a.achievement_id) : [];
      
      if (!unlocked.includes("welcome-to-drona")) {
        await supabase.from("user_achievements").insert({ user_id: session.user.id, achievement_id: "welcome-to-drona", is_claimed: false });
        unlocked.push("welcome-to-drona");
      }
      
      return { unlocked, claimed, totalXp: profile?.xp_total || 0 };
    }
  },

  async claimAchievement(achievementId: string, xpReward: number) {
    const isTestBadge = achievementId === "test-infinite-claim";
    if (USE_LOCAL_STORAGE) {
      const c = localStorage.getItem("drona_claimed_achievements");
      const xp = localStorage.getItem("drona_total_xp");
      let claimed = c ? JSON.parse(c) : [];
      let totalXp = xp ? parseInt(xp, 10) : 0;
      
      if (!claimed.includes(achievementId) || isTestBadge) {
        if (!claimed.includes(achievementId)) {
          claimed.push(achievementId);
        }
        totalXp += xpReward;
        localStorage.setItem("drona_claimed_achievements", JSON.stringify(claimed));
        localStorage.setItem("drona_total_xp", totalXp.toString());
      }
    } else {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      await supabase.from("user_achievements")
        .update({ is_claimed: true, claimed_at: new Date().toISOString() })
        .eq("user_id", session.user.id)
        .eq("achievement_id", achievementId);
        
      const { data: profile } = await supabase.from("profiles").select("xp_total").eq("id", session.user.id).single();
      if (profile) {
        await supabase.from("profiles").update({ xp_total: (profile.xp_total || 0) + xpReward }).eq("id", session.user.id);
      }
    }
  },

  // --- Notifications ---

  async getNotifications() {
    if (USE_LOCAL_STORAGE) {
      try {
        const stored = localStorage.getItem("drona_notifications");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    } else {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      
      const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
      if (error || !data) return [];
      
      return data.map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.body,
        type: n.notification_type,
        href: n.action_url,
        isRead: n.is_read,
        achievementId: n.metadata?.achievement_id,
        timestamp: new Date(n.created_at).getTime(),
      }));
    }
  },

  async saveNotifications(notifications: any[]) {
    if (USE_LOCAL_STORAGE) {
      localStorage.setItem("drona_notifications", JSON.stringify(notifications));
    }
  },

  async insertNotification(newNotif: any) {
    if (USE_LOCAL_STORAGE) {
      // Handled by saveNotifications in local mode.
      return;
    } else {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const validTypes = ['reminder', 'achievement', 'warning', 'system', 'mission', 'streak', 'test', 'revision', 'agent', 'social', 'break_suggestion', 'procrastination', 'level_up', 'badge', 'boss_battle', 'report'];
      const safeType = validTypes.includes(newNotif.type) ? newNotif.type : (newNotif.type === 'alert' ? 'warning' : 'system');

      await supabase.from("notifications").insert({
        id: newNotif.id,
        user_id: session.user.id,
        title: newNotif.title,
        body: newNotif.message,
        notification_type: safeType,
        action_url: newNotif.href || null,
        is_read: newNotif.isRead,
        metadata: newNotif.achievementId ? { achievement_id: newNotif.achievementId } : null,
        created_at: new Date(newNotif.timestamp).toISOString()
      });
    }
  },

  async updateNotificationReadStatus(id: string | null = null, all: boolean = false) {
    if (USE_LOCAL_STORAGE) return; // Handled in context state for local storage
    
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    
    if (all) {
      await supabase.from("notifications").update({ is_read: true }).eq("user_id", session.user.id);
    } else if (id) {
      await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    }
  },

  async deleteNotification(id: string | null = null, all: boolean = false) {
    if (USE_LOCAL_STORAGE) return; // Handled in context state for local storage
    
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    
    if (all) {
      await supabase.from("notifications").delete().eq("user_id", session.user.id);
    } else if (id) {
      await supabase.from("notifications").delete().eq("id", id);
    }
  }
};
