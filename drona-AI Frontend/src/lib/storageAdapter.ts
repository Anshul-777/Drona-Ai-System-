"use client";

import { createClient } from "@/lib/supabase/client";

// ==========================================
// 🔴 TOGGLE THIS 1 LINE TO SWITCH BACKENDS 🔴
// ==========================================
export const USE_LOCAL_STORAGE = false; 

export const getDronaKey = (key: string) => {
  if (typeof window === "undefined") return `drona_${key}`;
  const userId = localStorage.getItem("drona_current_user_id");
  if (userId) {
    return `drona_${userId}_${key}`;
  }
  return `drona_guest_${key}`;
};

// A unified storage adapter that routes to either LocalStorage or Supabase
export const storageAdapter = {

  // --- Profile Data ---
  async getProfileDashboardData() {
    let ign = "GUEST";
    let email = "";
    let avatarUrl = "";
    let creationDate = "April 2026";
    let title = "NOVICE";
    
    if (USE_LOCAL_STORAGE) {
      if (typeof window !== 'undefined') {
        const user = localStorage.getItem("drona_current_user");
        if (user) {
          try {
            const parsed = JSON.parse(user);
            if (parsed.email) {
              ign = parsed.email.split('@')[0].toUpperCase();
              email = parsed.email;
            }
            if (parsed.user_metadata?.ign) {
              ign = parsed.user_metadata.ign.toUpperCase();
            }
            if (parsed.user_metadata?.avatar_url) {
              avatarUrl = parsed.user_metadata.avatar_url;
            }
          } catch(e){}
        }
      }
    } else {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (user.email) {
          ign = user.email.split('@')[0].toUpperCase();
          email = user.email;
        }
        if (user.user_metadata?.ign) {
          ign = user.user_metadata.ign.toUpperCase();
        }
        if (user.user_metadata?.avatar_url) {
          avatarUrl = user.user_metadata.avatar_url;
        }
        creationDate = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
        if (profile) {
          if (profile.rank_title) title = profile.rank_title;
        }
      }
    }

    const achData = await this.getUserAchievements();
    const totalXp = achData.totalXp;
    
    // Level calculation (1 level = 1000 XP)
    const level = Math.floor(totalXp / 1000) + 1;
    const xpCurrentLevel = totalXp % 1000;
    const xpMaxLevel = 1000;
    
    if (title === "NOVICE") {
      if (level >= 5) title = "ADEPT";
      if (level >= 10) title = "SCHOLAR";
      if (level >= 25) title = "MASTER";
      if (level >= 50) title = "GRANDMASTER";
    }

    let activeLoadout = [];
    let isPublic = false;
    
    if (typeof window !== 'undefined') {
      const agents = localStorage.getItem(getDronaKey("active_agents"));
      if (agents) {
        try { activeLoadout = JSON.parse(agents); } catch(e){}
      }
      const settings = localStorage.getItem(getDronaKey("profile_settings"));
      if (settings) {
        try { isPublic = JSON.parse(settings).isPublic; } catch(e){}
      }
    }

    const masteryRates = {
      "Physics": 0,
      "Chemistry": 0,
      "Math": 0,
      "Biology": 0
    };

    let summaryText = "";
    if (totalXp === 0) {
      summaryText = `Agent Drona has analyzed ${ign}'s profile. Insufficient telemetry detected. The subject is advised to begin learning modules and assessments to establish a cognitive baseline.`;
    } else {
      const strongestSubject = Object.entries(masteryRates).sort((a, b) => b[1] - a[1])[0]?.[0] || 'core disciplines';
      const totalMasteryScore = Object.values(masteryRates).reduce((a, b) => a + b, 0) / (Object.keys(masteryRates).length || 1);
      const performanceRating = totalMasteryScore > 75 ? 'Exceptional' : totalMasteryScore > 50 ? 'Optimal' : 'Developing';
      summaryText = `Agent Drona has analyzed ${ign}'s performance matrix. The subject demonstrates ${performanceRating.toLowerCase()} retention in ${strongestSubject}, maintaining a steady pace of acquisition. Current trajectory suggests mastery of upcoming core modules within the next learning cycle. Neural efficiency rating: ${performanceRating}.`;
    }

    return {
      profile: {
        ign: ign,
        avatarUrl: avatarUrl,
        level: level,
        title: title,
        playerClass: "INITIATE",
        kc: "0 KC",
        xp: xpCurrentLevel,
        xpMax: xpMaxLevel,
        airRank: 0,
        percentile: "TOP 100%",
        creationDate: creationDate,
        timePlayed: "0 hrs",
        mostPlayed: "None",
        isPublic: isPublic
      },
      summary: summaryText,
      cognitive: [
        { name: "Logic", value: 0, trend: "0%", trendColor: "text-on-surface-variant" },
        { name: "Recall", value: 0, trend: "0%", trendColor: "text-on-surface-variant" },
        { name: "Speed", value: 0, trend: "0%", trendColor: "text-on-surface-variant" },
        { name: "Discipline", value: 0, trend: "0%", trendColor: "text-on-surface-variant" },
        { name: "Creativity", value: 0, trend: "0%", trendColor: "text-on-surface-variant" },
        { name: "Focus", value: 0, trend: "0%", trendColor: "text-on-surface-variant" }
      ],
      engagement: {
        attentionSpan: [0, 0, 0, 0, 0, 0, 0],
        learningVelocity: [0, 0, 0, 0, 0, 0, 0]
      },
      loadout: activeLoadout,
      missionLog: [],
      mastery: masteryRates,
      topAchievements: achData.claimed.slice(-3).reverse() // Last 3 claimed, newest first
    };
  },

  // --- Profile Settings ---
  async updateUserProfile(updates: { ign?: string, avatarUrl?: string }) {
    if (typeof window === 'undefined') return;
    
    // Update local storage representation
    const userJson = localStorage.getItem("drona_current_user");
    if (userJson) {
      try {
        let parsed = JSON.parse(userJson);
        if (updates.avatarUrl) {
          parsed.user_metadata = parsed.user_metadata || {};
          parsed.user_metadata.avatar_url = updates.avatarUrl;
        }
        if (updates.ign) {
          // If using email as IGN, we might have to fake it in local storage, or store a custom metadata field
          parsed.user_metadata = parsed.user_metadata || {};
          parsed.user_metadata.ign = updates.ign;
        }
        localStorage.setItem("drona_current_user", JSON.stringify(parsed));
      } catch(e) {}
    }

    if (!USE_LOCAL_STORAGE) {
      const supabase = createClient();
      const metadataUpdates: any = {};
      if (updates.avatarUrl) metadataUpdates.avatar_url = updates.avatarUrl;
      if (updates.ign) metadataUpdates.ign = updates.ign;
      
      if (Object.keys(metadataUpdates).length > 0) {
        await supabase.auth.updateUser({
          data: metadataUpdates
        });

        // Also sync to profiles database table
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const profileUpdates: any = {};
          if (updates.avatarUrl) profileUpdates.avatar_url = updates.avatarUrl;
          if (updates.ign) profileUpdates.full_name = updates.ign;
          profileUpdates.updated_at = new Date().toISOString();
          
          await supabase.from("profiles").update(profileUpdates).eq("id", user.id);
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event("drona_profile_updated"));
    }
  },

  async getProfileSettings() {
    if (typeof window === 'undefined') return { isPublic: false, notifications: true, theme: 'dark' };
    const saved = localStorage.getItem(getDronaKey("profile_settings"));
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return { isPublic: false, notifications: true, theme: 'dark' };
  },

  async updateProfileSettings(updates: any) {
    if (typeof window === 'undefined') return;
    const current = await this.getProfileSettings();
    const merged = { ...current, ...updates };
    localStorage.setItem(getDronaKey("profile_settings"), JSON.stringify(merged));
    return merged;
  },

  // --- Achievements & XP ---

  async getUserAchievements() {
    if (USE_LOCAL_STORAGE) {
      try {
        const u = localStorage.getItem(getDronaKey("unlocked_achievements"));
        const c = localStorage.getItem(getDronaKey("claimed_achievements"));
        const xp = localStorage.getItem(getDronaKey("total_xp"));
        
        let unlocked = u ? JSON.parse(u) : [];
        let claimed = c ? JSON.parse(c) : [];
        let totalXp = xp ? parseInt(xp, 10) : 0;
        
        // Auto-unlock welcome
        const hasLoggedIn = localStorage.getItem(getDronaKey("has_logged_in_before"));
        if (hasLoggedIn && !unlocked.includes("welcome-to-drona")) {
          unlocked.push("welcome-to-drona");
          localStorage.setItem(getDronaKey("unlocked_achievements"), JSON.stringify(unlocked));
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

  async unlockAchievement(achievementId: string) {
    if (USE_LOCAL_STORAGE) {
      const u = localStorage.getItem(getDronaKey("unlocked_achievements"));
      let unlocked = u ? JSON.parse(u) : [];
      if (!unlocked.includes(achievementId)) {
        unlocked.push(achievementId);
        localStorage.setItem(getDronaKey("unlocked_achievements"), JSON.stringify(unlocked));
        return true;
      }
      return false;
    } else {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;
      const { data } = await supabase.from("user_achievements")
        .select("id").eq("user_id", session.user.id).eq("achievement_id", achievementId).maybeSingle();
      if (!data) {
        await supabase.from("user_achievements").insert({ user_id: session.user.id, achievement_id: achievementId, is_claimed: false });
        return true;
      }
      return false;
    }
  },

  async claimAchievement(achievementId: string, xpReward: number) {
    const isTestBadge = achievementId === "test-infinite-claim";
    if (USE_LOCAL_STORAGE) {
      const c = localStorage.getItem(getDronaKey("claimed_achievements"));
      const xp = localStorage.getItem(getDronaKey("total_xp"));
      let claimed = c ? JSON.parse(c) : [];
      let totalXp = xp ? parseInt(xp, 10) : 0;
      
      if (!claimed.includes(achievementId) || isTestBadge) {
        if (!claimed.includes(achievementId)) {
          claimed.push(achievementId);
        }
        totalXp += xpReward;
        localStorage.setItem(getDronaKey("claimed_achievements"), JSON.stringify(claimed));
        localStorage.setItem(getDronaKey("total_xp"), totalXp.toString());
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
        const stored = localStorage.getItem(getDronaKey("notifications"));
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
      localStorage.setItem(getDronaKey("notifications"), JSON.stringify(notifications));
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
  },

  // --- Chat Sessions ---
  
  async getChatSessions(status: 'active' | 'archived' | 'trashed' = 'active') {
    if (USE_LOCAL_STORAGE) {
      try {
        const stored = localStorage.getItem(getDronaKey("chat_sessions"));
        let sessions = stored ? JSON.parse(stored) : [];
        if (status === 'archived') {
          sessions = sessions.filter((s: any) => s.is_archived && !s.is_trashed);
        } else if (status === 'trashed') {
          sessions = sessions.filter((s: any) => s.is_trashed);
        } else {
          sessions = sessions.filter((s: any) => !s.is_archived && !s.is_trashed);
        }
        return sessions.sort((a: any, b: any) => (new Date(b.updated_at).getTime() || 0) - (new Date(a.updated_at).getTime() || 0));
      } catch {
        return [];
      }
    } else {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      
      let query = supabase.from("chat_sessions").select("*").eq("user_id", session.user.id);
      if (status === 'archived') {
        query = query.eq('is_archived', true).eq('is_trashed', false);
      } else if (status === 'trashed') {
        query = query.eq('is_trashed', true);
      } else {
        query = query.eq('is_archived', false).eq('is_trashed', false);
      }
      
      const { data } = await query.order('updated_at', { ascending: false });
      return data || [];
    }
  },

  async getChatMessages(sessionId: string) {
    if (USE_LOCAL_STORAGE) {
      try {
        const stored = localStorage.getItem(getDronaKey(`chat_messages_${sessionId}`));
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    } else {
      const supabase = createClient();
      const { data } = await supabase.from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      
      return (data || []).map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        time: msg.created_at,
        isNew: false
      }));
    }
  },

  async createChatSession(id: string, title: string) {
    if (USE_LOCAL_STORAGE) {
      const stored = localStorage.getItem(getDronaKey("chat_sessions"));
      let sessions = stored ? JSON.parse(stored) : [];
      const newSession = {
        id, title, updated_at: new Date().toISOString(), is_archived: false, is_trashed: false
      };
      sessions.push(newSession);
      localStorage.setItem(getDronaKey("chat_sessions"), JSON.stringify(sessions));
      return newSession;
    } else {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;
      
      const newSession = {
        id, user_id: session.user.id, title, updated_at: new Date().toISOString(), is_archived: false, is_trashed: false
      };
      await supabase.from("chat_sessions").insert(newSession);
      return newSession;
    }
  },

  async updateChatSession(id: string, updates: any) {
    if (USE_LOCAL_STORAGE) {
      const stored = localStorage.getItem(getDronaKey("chat_sessions"));
      let sessions = stored ? JSON.parse(stored) : [];
      const idx = sessions.findIndex((s: any) => s.id === id);
      if (idx !== -1) {
        sessions[idx] = { ...sessions[idx], ...updates, updated_at: new Date().toISOString() };
        localStorage.setItem(getDronaKey("chat_sessions"), JSON.stringify(sessions));
      }
    } else {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      await supabase.from("chat_sessions").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", session.user.id);
    }
  },

  async deleteChatSession(id: string) {
    if (USE_LOCAL_STORAGE) {
      const stored = localStorage.getItem(getDronaKey("chat_sessions"));
      let sessions = stored ? JSON.parse(stored) : [];
      sessions = sessions.filter((s: any) => s.id !== id);
      localStorage.setItem(getDronaKey("chat_sessions"), JSON.stringify(sessions));
      localStorage.removeItem(getDronaKey(`chat_messages_${id}`));
    } else {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      await supabase.from("chat_messages").delete().eq("session_id", id);
      await supabase.from("chat_sessions").delete().eq("id", id).eq("user_id", session.user.id);
    }
  },

  async saveChatMessage(sessionId: string, msg: any) {
    if (USE_LOCAL_STORAGE) {
      const key = getDronaKey(`chat_messages_${sessionId}`);
      const stored = localStorage.getItem(key);
      let messages = stored ? JSON.parse(stored) : [];
      const newMsg = { ...msg, time: msg.time || new Date().toISOString() };
      messages.push(newMsg);
      localStorage.setItem(key, JSON.stringify(messages));
      
      // Update session timestamp
      this.updateChatSession(sessionId, {});
      return newMsg;
    } else {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;
      
      const newMsg = {
        id: msg.id || crypto.randomUUID(),
        session_id: sessionId,
        user_id: session.user.id,
        role: msg.role,
        content: msg.content,
        created_at: new Date().toISOString()
      };
      await supabase.from("chat_messages").insert(newMsg);
      this.updateChatSession(sessionId, {});
      return newMsg;
    }
  }

};
