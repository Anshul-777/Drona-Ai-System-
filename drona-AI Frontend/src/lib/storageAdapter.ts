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

export const BASE_MISSIONS = [
  {
    id: "d1000000-0000-0000-0000-000000000001",
    mission_type: "tutorial",
    title: "Diagnostic Master",
    description: "The learning engine requires fresh telemetry. Calibrate your personalized curriculum by starting your cognitive profile assessment. This ensures your learning path is fully optimized and adapted to your current learning speed.",
    target_metric: "assessment_completed",
    target_value: 1,
    xp_reward: 150,
    coins_reward: 2500,
    subject: "Onboarding",
    difficulty: "Novice"
  },
  {
    id: "d2000000-0000-0000-0000-000000000002",
    mission_type: "tutorial",
    title: "Socratic Engagement",
    description: "Curiosity is the engine of intellect. Engage with Drona AI in the Learning Hub and ask deep conceptual questions to further understand your current chapter. A brief conversation might help you move closer to the truth and unravel complex molecular structures.",
    target_metric: "chat_messages_count",
    target_value: 1,
    xp_reward: 200,
    coins_reward: 1000,
    subject: "Communication",
    difficulty: "Novice"
  },
  {
    id: "d3000000-0000-0000-0000-000000000003",
    mission_type: "tutorial",
    title: "Agent Calibration",
    description: "Select your primary teaching mode and configure your preferences in settings to optimize your Drona AI companion's responses.",
    target_metric: "teaching_mode_configured",
    target_value: 1,
    xp_reward: 100,
    coins_reward: 500,
    subject: "System Config",
    difficulty: "Novice"
  },
  {
    id: "d4000000-0000-0000-0000-000000000004",
    mission_type: "archon",
    title: "Flawless Execution",
    description: "Thanks to your efforts, the elemental flow of knowledge has returned to normal. Complete any chapter quiz in the Test Environment and achieve a perfect score to prove your absolute mastery of the subject matter.",
    target_metric: "perfect_quiz_score",
    target_value: 1,
    xp_reward: 500,
    coins_reward: 5000,
    subject: "Comprehension",
    difficulty: "Expert"
  },
  {
    id: "d5000000-0000-0000-0000-000000000005",
    mission_type: "archon",
    title: "Shadow Over The Arena",
    description: "Put your skills to the ultimate test. Enter the Arena and face a Boss. Whether you win or lose, the experience gained will forge you into a stronger learner and prepare you for the ultimate exams.",
    target_metric: "boss_battle_completed",
    target_value: 1,
    xp_reward: 300,
    coins_reward: 1500,
    subject: "Combat Study",
    difficulty: "Advanced"
  },
  {
    id: "d6000000-0000-0000-0000-000000000006",
    mission_type: "archon",
    title: "Tournament Contender",
    description: "Compete against peers in the Test Arena to rank up on the competitive leaderboards.",
    target_metric: "tournament_joined",
    target_value: 1,
    xp_reward: 400,
    coins_reward: 2000,
    subject: "Arena",
    difficulty: "Advanced"
  },
  {
    id: "d7000000-0000-0000-0000-000000000007",
    mission_type: "world",
    title: "The Periodic Table",
    description: "Understanding the building blocks of matter is essential for advanced alchemy and synthesis. Review the periodic trends in the Chemistry workspace to permanently unlock your synthesis abilities.",
    target_metric: "chemistry_workspace_visited",
    target_value: 1,
    xp_reward: 100,
    coins_reward: 500,
    subject: "Chemistry",
    difficulty: "Medium"
  },
  {
    id: "d8000000-0000-0000-0000-000000000008",
    mission_type: "world",
    title: "Formula Architect",
    description: "Identify a key physics formula, review its derivation, and bookmark it to your personalized cheat sheet.",
    target_metric: "formula_bookmarked",
    target_value: 1,
    xp_reward: 120,
    coins_reward: 600,
    subject: "Physics",
    difficulty: "Medium"
  },
  {
    id: "d9000000-0000-0000-0000-000000000009",
    mission_type: "world",
    title: "Study Marathon",
    description: "Commit to a productive study session without distractions by starting a focus session in your workspace.",
    target_metric: "focus_session_minutes",
    target_value: 1,
    xp_reward: 150,
    coins_reward: 800,
    subject: "Discipline",
    difficulty: "Medium"
  },
  {
    id: "da100000-0000-0000-0000-000000000010",
    mission_type: "milestone",
    title: "Consistent Habits",
    description: "Consistency is key to mastery. Build a habit by keeping a study streak active. Your dedication to the curriculum will yield exponential results over time.",
    target_metric: "streak_days",
    target_value: 3,
    xp_reward: 1000,
    coins_reward: 10000,
    subject: "Consistency",
    difficulty: "Legendary"
  },
  {
    id: "db110000-0000-0000-0000-000000000011",
    mission_type: "milestone",
    title: "Spaced Repetition Master",
    description: "Review and master at least one complete flashcard deck using spaced repetition in the Study lounge.",
    target_metric: "flashcard_deck_mastered",
    target_value: 1,
    xp_reward: 350,
    coins_reward: 1800,
    subject: "Memory",
    difficulty: "Advanced"
  },
  {
    id: "dc120000-0000-0000-0000-000000000012",
    mission_type: "world",
    title: "Formula Master",
    description: "Review and memorize 3 distinct formulas in the physics formula vault to complete this training. Keep your cheat sheet updated with the latest tools.",
    target_metric: "formula_entries_count",
    target_value: 3,
    xp_reward: 250,
    coins_reward: 1200,
    subject: "Physics",
    difficulty: "Advanced"
  },
  {
    id: "dd130000-0000-0000-0000-000000000013",
    mission_type: "world",
    title: "Vocabulary Expansion",
    description: "Create or review at least 5 revision notes/cards in your workspace to consolidate your understanding of biological systems.",
    target_metric: "revision_cards_count",
    target_value: 5,
    xp_reward: 180,
    coins_reward: 900,
    subject: "Biology",
    difficulty: "Medium"
  },
  {
    id: "de140000-0000-0000-0000-000000000014",
    mission_type: "milestone",
    title: "Syllabus Progressor",
    description: "Engage in 3 separate learning session topics with Drona AI to cover multiple chapters and expand your scope.",
    target_metric: "chat_sessions_count",
    target_value: 3,
    xp_reward: 400,
    coins_reward: 3000,
    subject: "Curriculum",
    difficulty: "Expert"
  },
  {
    id: "df150000-0000-0000-0000-000000000015",
    mission_type: "tutorial",
    title: "Shop Patron",
    description: "Visit the marketplace armory to inspect the available elite tech gear and learning boosters that will aid your journey.",
    target_metric: "shop_visited",
    target_value: 1,
    xp_reward: 100,
    coins_reward: 500,
    subject: "Economy",
    difficulty: "Novice"
  },
  {
    id: "e1600000-0000-0000-0000-000000000016",
    mission_type: "tutorial",
    title: "Daily Briefing",
    description: "Synchronize with Drona's daily curriculum. Visit the main learning platform dashboard to review today's study outline.",
    target_metric: "daily_login",
    target_value: 1,
    xp_reward: 150,
    coins_reward: 800,
    subject: "General",
    difficulty: "Novice"
  },
  {
    id: "e1700000-0000-0000-0000-000000000017",
    mission_type: "world",
    title: "Workspace Architect",
    description: "Initialize your knowledge vault by creating at least one revision note in the workspace to catalog your learning milestones.",
    target_metric: "revision_cards_count",
    target_value: 1,
    xp_reward: 120,
    coins_reward: 600,
    subject: "General",
    difficulty: "Novice"
  },
  {
    id: "e1800000-0000-0000-0000-000000000018",
    mission_type: "archon",
    title: "Quiz Initiate",
    description: "Complete any subject quiz in the Test Hub. Even if you don't get a perfect score, taking the test triggers critical recall pathways.",
    target_metric: "quiz_completed",
    target_value: 1,
    xp_reward: 250,
    coins_reward: 1500,
    subject: "Comprehension",
    difficulty: "Medium"
  },
  {
    id: "e1900000-0000-0000-0000-000000000019",
    mission_type: "world",
    title: "Academic Organizer",
    description: "Create a learning milestone or study checklist item in the workspace task manager to stay on track.",
    target_metric: "todo_created",
    target_value: 1,
    xp_reward: 120,
    coins_reward: 600,
    subject: "Discipline",
    difficulty: "Novice"
  },
  {
    id: "e2000000-0000-0000-0000-000000000020",
    mission_type: "world",
    title: "Objective Executed",
    description: "Complete at least one task or agenda item in your study checklist.",
    target_metric: "todo_completed",
    target_value: 1,
    xp_reward: 200,
    coins_reward: 1000,
    subject: "Discipline",
    difficulty: "Medium"
  }
];

// A unified storage adapter that routes to either LocalStorage or Supabase
export const storageAdapter = {

  // --- Profile Data ---
  async getProfileDashboardData() {
    let ign = "GUEST";
    let avatarUrl = "";
    let creationDate = "April 2026";
    let title = "NOVICE";
    let coinBalance = 0;

    if (USE_LOCAL_STORAGE) {
      if (typeof window !== 'undefined') {
        const user = localStorage.getItem("drona_current_user");
        if (user) {
          try {
            const parsed = JSON.parse(user);
            if (parsed.email) {
              ign = parsed.email.split('@')[0].toUpperCase();
            }
            if (parsed.user_metadata?.ign) {
              ign = parsed.user_metadata.ign.toUpperCase();
            }
            if (parsed.user_metadata?.avatar_url) {
              avatarUrl = parsed.user_metadata.avatar_url;
            }
          } catch (e) { }
        }
        const storedCoins = localStorage.getItem(getDronaKey("total_coins"));
        coinBalance = storedCoins ? parseInt(storedCoins, 10) : 0;
      }
    } else {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (user.email) {
          ign = user.email.split('@')[0].toUpperCase();
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
          if (profile.coin_balance) coinBalance = profile.coin_balance;
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
        try { activeLoadout = JSON.parse(agents); } catch (e) { }
      }
      const settings = localStorage.getItem(getDronaKey("profile_settings"));
      if (settings) {
        try { isPublic = JSON.parse(settings).isPublic; } catch (e) { }
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
        kc: `${coinBalance} KC`,
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
      } catch (e) { }
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
      try { return JSON.parse(saved); } catch (e) { }
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
  },

  async getMissions() {

    if (USE_LOCAL_STORAGE) {
      if (typeof window === 'undefined') return [];
      try {
        let localUserMissions = localStorage.getItem(getDronaKey("user_missions"));
        let userMissions = localUserMissions ? JSON.parse(localUserMissions) : [];

        // Incremental seed for local storage
        const missingFromLocal = BASE_MISSIONS.filter(
          bm => !userMissions.some((um: any) => um.mission_id === bm.id)
        );

        if (missingFromLocal.length > 0) {
          const newLocalMissions = missingFromLocal.map(m => ({
            id: m.id,
            mission_id: m.id,
            status: m.id === "d1000000-0000-0000-0000-000000000001" ? "claimed" : "active",
            progress_value: m.id === "d1000000-0000-0000-0000-000000000001" ? 1 : 0,
            progress_pct: m.id === "d1000000-0000-0000-0000-000000000001" ? 100 : 0
          }));
          userMissions = [...userMissions, ...newLocalMissions];
          localStorage.setItem(getDronaKey("user_missions"), JSON.stringify(userMissions));
        }

        const hasLoggedIn = localStorage.getItem(getDronaKey("has_logged_in_before"));

        userMissions = userMissions.map((um: any) => {
          if (um.status === "claimed") return um;

          const mission = BASE_MISSIONS.find(m => m.id === um.mission_id);
          if (!mission) return um;

          let progress = um.progress_value || 0;

          if (mission.target_metric === "chat_messages_count") {
            try {
              const sessionsStr = localStorage.getItem(getDronaKey("chat_sessions"));
              const sessions = sessionsStr ? JSON.parse(sessionsStr) : [];
              if (sessions.length > 0) progress = 1;
            } catch { }
          } else if (mission.target_metric === "assessment_completed") {
            if (hasLoggedIn) progress = 1;
          } else if (mission.target_metric === "teaching_mode_configured") {
            progress = 1;
          } else if (mission.target_metric === "streak_days") {
            try {
              const streak = parseInt(localStorage.getItem(getDronaKey("streak_count")) || "1", 10);
              progress = streak;
            } catch {
              progress = 1;
            }
          } else if (mission.target_metric === "chat_sessions_count") {
            try {
              const sessionsStr = localStorage.getItem(getDronaKey("chat_sessions"));
              const sessions = sessionsStr ? JSON.parse(sessionsStr) : [];
              progress = sessions.length;
            } catch { }
          } else if (mission.target_metric === "formula_entries_count") {
            progress = 3;
          } else if (mission.target_metric === "revision_cards_count") {
            try {
              const notesStr = localStorage.getItem(getDronaKey("workspace_notes"));
              const notes = notesStr ? JSON.parse(notesStr) : [];
              progress = notes.length;
            } catch {
              progress = 0;
            }
          } else if (mission.target_metric === "shop_visited") {
            progress = 1;
          } else if (mission.target_metric === "daily_login") {
            progress = 1;
          } else if (mission.target_metric === "quiz_completed") {
            try {
              const resultsStr = localStorage.getItem(getDronaKey("test_results"));
              const results = resultsStr ? JSON.parse(resultsStr) : [];
              progress = results.length;
            } catch {
              progress = 0;
            }
          } else if (mission.target_metric === "todo_created") {
            try {
              const todosStr = localStorage.getItem(getDronaKey("todos"));
              const todos = todosStr ? JSON.parse(todosStr) : [];
              progress = todos.length;
            } catch {
              progress = 0;
            }
          } else if (mission.target_metric === "todo_completed") {
            try {
              const todosStr = localStorage.getItem(getDronaKey("todos"));
              const todos = todosStr ? JSON.parse(todosStr) : [];
              progress = todos.filter((t: any) => t.is_completed || t.completed).length;
            } catch {
              progress = 0;
            }
          }

          const progress_pct = Math.min(100, Math.floor((progress / mission.target_value) * 100));
          const status = progress_pct >= 100 ? "claimable" : "active";

          return {
            ...um,
            progress_value: progress,
            progress_pct,
            status
          };
        });

        localStorage.setItem(getDronaKey("user_missions"), JSON.stringify(userMissions));

        return BASE_MISSIONS.map(m => {
          const um = userMissions.find((x: any) => x.mission_id === m.id) || { status: "active", progress_value: 0, progress_pct: 0 };
          return {
            ...m,
            status: um.status,
            progress_value: um.progress_value,
            progress_pct: um.progress_pct
          };
        });
      } catch (e) {
        return BASE_MISSIONS.map(m => ({ ...m, status: "active", progress_value: 0, progress_pct: 0 }));
      }
    } else {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        // Fallback for guest/non-logged-in views during testing
        return BASE_MISSIONS.map(m => ({
          id: m.id,
          mission_type: m.mission_type,
          title: m.title,
          description: m.description,
          target_metric: m.target_metric,
          target_value: m.target_value,
          xp_reward: m.xp_reward || 0,
          coins_reward: m.coins_reward || 0,
          subject: m.subject || "General",
          difficulty: m.difficulty || "Medium",
          status: m.id === "d1000000-0000-0000-0000-000000000001" ? "claimed" : (m.target_metric === "daily_login" || m.target_metric === "shop_visited" ? "claimable" : "active"),
          progress_value: m.id === "d1000000-0000-0000-0000-000000000001" ? 1 : (m.target_metric === "daily_login" || m.target_metric === "shop_visited" ? 1 : 0),
          progress_pct: m.id === "d1000000-0000-0000-0000-000000000001" ? 100 : (m.target_metric === "daily_login" || m.target_metric === "shop_visited" ? 100 : 0)
        }));
      }
      const userId = session.user.id;

      // Ensure missions table has the base templates for this user
      const { data: existingMissions, error: checkError } = await supabase
        .from("missions")
        .select("id")
        .eq("user_id", userId);

      if (checkError) return [];

      const missingMissions = BASE_MISSIONS.filter(
        bm => !existingMissions.some(em => em.id === bm.id)
      );

      if (missingMissions.length > 0) {
        const seedPayload = missingMissions.map(m => ({
          id: m.id,
          user_id: userId,
          mission_type: m.mission_type,
          title: m.title,
          description: m.description,
          target_metric: m.target_metric,
          target_value: m.target_value,
          xp_reward: m.xp_reward,
          coins_reward: m.coins_reward,
          subject: m.subject,
          difficulty: m.difficulty
        }));

        await supabase.from("missions").insert(seedPayload);

        const userMissionsPayload = missingMissions.map(m => ({
          user_id: userId,
          mission_id: m.id,
          status: m.id === "d1000000-0000-0000-0000-000000000001" ? "claimed" : "active",
          progress_value: m.id === "d1000000-0000-0000-0000-000000000001" ? 1 : 0,
          progress_pct: m.id === "d1000000-0000-0000-0000-000000000001" ? 100 : 0
        }));

        await supabase.from("user_missions").insert(userMissionsPayload);
      }

      const { data: dbMissions } = await supabase.from("missions").select("*").eq("user_id", userId);
      const { data: dbUserMissions } = await supabase.from("user_missions").select("*").eq("user_id", userId);

      if (!dbMissions || !dbUserMissions) return [];

      for (const um of dbUserMissions) {
        if (um.status === "claimed") continue;

        const m = dbMissions.find(x => x.id === um.mission_id);
        if (!m) continue;

        let evaluatedValue = 0;

        try {
          if (m.target_metric === "assessment_completed") {
            const { data: profile } = await supabase.from("profiles").select("assessment_completed").eq("id", userId).maybeSingle();
            evaluatedValue = profile?.assessment_completed ? 1 : 0;
          }
          else if (m.target_metric === "chat_messages_count") {
            const { count } = await supabase.from("chat_messages").select("*", { count: "exact", head: true }).eq("user_id", userId);
            evaluatedValue = count || 0;
          }
          else if (m.target_metric === "teaching_mode_configured") {
            const { data: profile } = await supabase.from("profiles").select("teaching_mode").eq("id", userId).maybeSingle();
            evaluatedValue = profile?.teaching_mode ? 1 : 0;
          }
          else if (m.target_metric === "perfect_quiz_score") {
            const { data: quizResults } = await supabase.from("test_results").select("score_pct").eq("user_id", userId).eq("score_pct", 100).limit(1);
            evaluatedValue = (quizResults && quizResults.length > 0) ? 1 : 0;
          }
          else if (m.target_metric === "boss_battle_completed") {
            const { count } = await supabase.from("boss_battle_participants").select("*", { count: "exact", head: true }).eq("user_id", userId);
            evaluatedValue = count || 0;
          }
          else if (m.target_metric === "tournament_joined") {
            const { count } = await supabase.from("tests").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("test_type", "tournament");
            evaluatedValue = count || 0;
          }
          else if (m.target_metric === "chemistry_workspace_visited") {
            const { count } = await supabase.from("workspace_notes").select("*", { count: "exact", head: true }).eq("user_id", userId);
            evaluatedValue = (count && count > 0) ? 1 : 0;
          }
          else if (m.target_metric === "formula_bookmarked") {
            const { count } = await supabase.from("workspace_files").select("*", { count: "exact", head: true }).eq("user_id", userId);
            evaluatedValue = (count && count > 0) ? 1 : 0;
          }
          else if (m.target_metric === "focus_session_minutes") {
            const { data: focus } = await supabase.from("focus_sessions").select("total_focus_mins").eq("user_id", userId).eq("status", "completed");
            evaluatedValue = (focus && focus.length > 0) ? 1 : 0;
          }
          else if (m.target_metric === "streak_days") {
            const { data: streak } = await supabase.from("streaks").select("current_count").eq("user_id", userId).maybeSingle();
            evaluatedValue = streak?.current_count || 0;
          }
          else if (m.target_metric === "flashcard_deck_mastered") {
            const { count } = await supabase.from("flashcard_decks").select("*", { count: "exact", head: true }).eq("user_id", userId);
            evaluatedValue = count || 0;
          }
          else if (m.target_metric === "chat_sessions_count") {
            const { count } = await supabase.from("chat_sessions").select("*", { count: "exact", head: true }).eq("user_id", userId);
            evaluatedValue = count || 0;
          }
          else if (m.target_metric === "formula_entries_count") {
            const { count } = await supabase.from("formula_entries").select("*", { count: "exact", head: true });
            evaluatedValue = count || 0;
          }
          else if (m.target_metric === "revision_cards_count") {
            const { count } = await supabase.from("workspace_notes").select("*", { count: "exact", head: true }).eq("user_id", userId);
            evaluatedValue = count || 0;
          }
          else if (m.target_metric === "shop_visited") {
            evaluatedValue = 1;
          }
          else if (m.target_metric === "daily_login") {
            evaluatedValue = 1;
          }
          else if (m.target_metric === "quiz_completed") {
            const { count } = await supabase.from("test_results").select("*", { count: "exact", head: true }).eq("user_id", userId);
            evaluatedValue = count || 0;
          }
          else if (m.target_metric === "todo_created") {
            const { count } = await supabase.from("todos").select("*", { count: "exact", head: true }).eq("user_id", userId);
            evaluatedValue = count || 0;
          }
          else if (m.target_metric === "todo_completed") {
            const { count } = await supabase.from("todos").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("is_completed", true);
            evaluatedValue = count || 0;
          }
        } catch (telemetryErr) {
          console.error("Telemetry check error for", m.target_metric, telemetryErr);
        }

        const pct = Math.min(100, Math.floor((evaluatedValue / m.target_value) * 100));
        const newStatus = pct >= 100 ? "claimable" : "active";

        if (um.progress_value !== evaluatedValue || um.status !== newStatus) {
          await supabase
            .from("user_missions")
            .update({
              progress_value: evaluatedValue,
              progress_pct: pct,
              status: newStatus,
              updated_at: new Date().toISOString()
            })
            .eq("id", um.id);

          um.progress_value = evaluatedValue;
          um.progress_pct = pct;
          um.status = newStatus;
        }
      }

      return dbMissions.map(m => {
        const um = dbUserMissions.find(x => x.mission_id === m.id) || { status: "active", progress_value: 0, progress_pct: 0 };
        return {
          id: m.id,
          mission_type: m.mission_type,
          title: m.title,
          description: m.description,
          target_metric: m.target_metric,
          target_value: m.target_value,
          xp_reward: m.xp_reward || 0,
          coins_reward: m.coins_reward || 0,
          subject: m.subject || "General",
          difficulty: m.difficulty || "Medium",
          status: um.status,
          progress_value: um.progress_value,
          progress_pct: um.progress_pct
        };
      });
    }
  },

  async claimMission(missionId: string) {
    if (USE_LOCAL_STORAGE) {
      if (typeof window === 'undefined') return { xp: 0, coins: 0 };
      try {
        let localUserMissions = localStorage.getItem(getDronaKey("user_missions"));
        let userMissions = localUserMissions ? JSON.parse(localUserMissions) : [];
        const um = userMissions.find((x: any) => x.mission_id === missionId);

        if (um && um.status === "claimable") {
          um.status = "claimed";
          localStorage.setItem(getDronaKey("user_missions"), JSON.stringify(userMissions));

          const mDetails = BASE_MISSIONS.find(x => x.id === missionId) || { xp_reward: 100, coins_reward: 500 };

          const currentXp = parseInt(localStorage.getItem(getDronaKey("total_xp")) || "0", 10);
          const currentCoins = parseInt(localStorage.getItem(getDronaKey("total_coins")) || "0", 10);

          localStorage.setItem(getDronaKey("total_xp"), (currentXp + mDetails.xp_reward).toString());
          localStorage.setItem(getDronaKey("total_coins"), (currentCoins + mDetails.coins_reward).toString());

          window.dispatchEvent(new Event("drona_profile_updated"));
          return { xp: mDetails.xp_reward, coins: mDetails.coins_reward };
        }
        return { xp: 0, coins: 0 };
      } catch (e) {
        return { xp: 0, coins: 0 };
      }
    } else {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return { xp: 0, coins: 0 };
      const userId = session.user.id;

      const { data: um, error } = await supabase
        .from("user_missions")
        .select("*")
        .eq("user_id", userId)
        .eq("mission_id", missionId)
        .maybeSingle();

      if (error || !um || um.status !== "claimable") return { xp: 0, coins: 0 };

      const { data: m } = await supabase
        .from("missions")
        .select("xp_reward, coins_reward")
        .eq("id", missionId)
        .maybeSingle();

      if (!m) return { xp: 0, coins: 0 };

      const xpReward = m.xp_reward || 0;
      const coinsReward = m.coins_reward || 0;

      await supabase
        .from("user_missions")
        .update({
          status: "claimed",
          completed_at: new Date().toISOString(),
          xp_claimed: true,
          updated_at: new Date().toISOString()
        })
        .eq("id", um.id);

      const { data: profile } = await supabase.from("profiles").select("xp_total, coin_balance").eq("id", userId).single();
      if (profile) {
        const newXp = (profile.xp_total || 0) + xpReward;
        const newCoins = (profile.coin_balance || 0) + coinsReward;
        await supabase
          .from("profiles")
          .update({
            xp_total: newXp,
            coin_balance: newCoins,
            updated_at: new Date().toISOString()
          })
          .eq("id", userId);
      }

      const notifId = crypto.randomUUID();
      await supabase.from("notifications").insert({
        id: notifId,
        user_id: userId,
        title: "Quest Completed",
        body: `You completed the quest & claimed rewards!`,
        notification_type: "mission",
        is_read: false,
        created_at: new Date().toISOString()
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event("drona_profile_updated"));
      }

      return { xp: xpReward, coins: coinsReward };
    }
  }

};
