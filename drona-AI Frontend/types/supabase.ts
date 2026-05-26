export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_logs: {
        Row: {
          action_items: Json | null
          applied: boolean | null
          created_at: string | null
          decisions: Json | null
          discussion: Json
          id: string
          log_type: string
          participating_agents: string[]
          trigger_event: string | null
          user_id: string
        }
        Insert: {
          action_items?: Json | null
          applied?: boolean | null
          created_at?: string | null
          decisions?: Json | null
          discussion: Json
          id?: string
          log_type: string
          participating_agents: string[]
          trigger_event?: string | null
          user_id: string
        }
        Update: {
          action_items?: Json | null
          applied?: boolean | null
          created_at?: string | null
          decisions?: Json | null
          discussion?: Json
          id?: string
          log_type?: string
          participating_agents?: string[]
          trigger_event?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analogy_library: {
        Row: {
          analogy_text: string
          chapter: string | null
          concept: string
          created_at: string | null
          id: string
          interest_category: string
          is_ai_generated: boolean | null
          is_verified: boolean | null
          quality_score: number | null
          subject: string
          topic: string | null
          usage_count: number | null
        }
        Insert: {
          analogy_text: string
          chapter?: string | null
          concept: string
          created_at?: string | null
          id?: string
          interest_category: string
          is_ai_generated?: boolean | null
          is_verified?: boolean | null
          quality_score?: number | null
          subject: string
          topic?: string | null
          usage_count?: number | null
        }
        Update: {
          analogy_text?: string
          chapter?: string | null
          concept?: string
          created_at?: string | null
          id?: string
          interest_category?: string
          is_ai_generated?: boolean | null
          is_verified?: boolean | null
          quality_score?: number | null
          subject?: string
          topic?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      assessment_answers: {
        Row: {
          ai_evaluation: string | null
          assessment_id: string
          correct_answer: string | null
          created_at: string | null
          difficulty: string | null
          id: string
          is_correct: boolean | null
          options: Json | null
          question_index: number
          question_text: string
          question_type: string | null
          subject: string | null
          time_spent_secs: number | null
          topic: string | null
          user_answer: string | null
          user_id: string
        }
        Insert: {
          ai_evaluation?: string | null
          assessment_id: string
          correct_answer?: string | null
          created_at?: string | null
          difficulty?: string | null
          id?: string
          is_correct?: boolean | null
          options?: Json | null
          question_index: number
          question_text: string
          question_type?: string | null
          subject?: string | null
          time_spent_secs?: number | null
          topic?: string | null
          user_answer?: string | null
          user_id: string
        }
        Update: {
          ai_evaluation?: string | null
          assessment_id?: string
          correct_answer?: string | null
          created_at?: string | null
          difficulty?: string | null
          id?: string
          is_correct?: boolean | null
          options?: Json | null
          question_index?: number
          question_text?: string
          question_type?: string | null
          subject?: string | null
          time_spent_secs?: number | null
          topic?: string | null
          user_answer?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_answers_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          ai_grader_report: Json | null
          ai_profile_summary: string | null
          answered_count: number | null
          assessment_type: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          learning_style: string | null
          started_at: string | null
          status: string | null
          strengths: Json | null
          test_duration_mins: number | null
          test_score: number | null
          test_taken: boolean | null
          total_questions: number | null
          user_id: string
          weaknesses: Json | null
        }
        Insert: {
          ai_grader_report?: Json | null
          ai_profile_summary?: string | null
          answered_count?: number | null
          assessment_type?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          learning_style?: string | null
          started_at?: string | null
          status?: string | null
          strengths?: Json | null
          test_duration_mins?: number | null
          test_score?: number | null
          test_taken?: boolean | null
          total_questions?: number | null
          user_id: string
          weaknesses?: Json | null
        }
        Update: {
          ai_grader_report?: Json | null
          ai_profile_summary?: string | null
          answered_count?: number | null
          assessment_type?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          learning_style?: string | null
          started_at?: string | null
          status?: string | null
          strengths?: Json | null
          test_duration_mins?: number | null
          test_score?: number | null
          test_taken?: boolean | null
          total_questions?: number | null
          user_id?: string
          weaknesses?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attention_logs: {
        Row: {
          created_at: string | null
          expected_time_ms: number | null
          focus_score: number | null
          gap_before_next_ms: number | null
          id: string
          is_distracted: boolean | null
          reading_time_ms: number | null
          response_length: number | null
          scroll_depth_pct: number | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expected_time_ms?: number | null
          focus_score?: number | null
          gap_before_next_ms?: number | null
          id?: string
          is_distracted?: boolean | null
          reading_time_ms?: number | null
          response_length?: number | null
          scroll_depth_pct?: number | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expected_time_ms?: number | null
          focus_score?: number | null
          gap_before_next_ms?: number | null
          id?: string
          is_distracted?: boolean | null
          reading_time_ms?: number | null
          response_length?: number | null
          scroll_depth_pct?: number | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attention_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attention_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          icon: string
          id: string
          is_active: boolean | null
          name: string
          rarity: string
          sort_order: number | null
          trigger_config: Json | null
          trigger_rule: string
          xp_reward: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          icon: string
          id?: string
          is_active?: boolean | null
          name: string
          rarity: string
          sort_order?: number | null
          trigger_config?: Json | null
          trigger_rule: string
          xp_reward?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          is_active?: boolean | null
          name?: string
          rarity?: string
          sort_order?: number | null
          trigger_config?: Json | null
          trigger_rule?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      boss_battle_participants: {
        Row: {
          badge_earned_id: string | null
          battle_id: string
          completed_at: string | null
          correct_count: number | null
          id: string
          joined_at: string | null
          rank: number | null
          score: number | null
          time_taken_secs: number | null
          user_id: string
          wrong_count: number | null
          xp_earned: number | null
        }
        Insert: {
          badge_earned_id?: string | null
          battle_id: string
          completed_at?: string | null
          correct_count?: number | null
          id?: string
          joined_at?: string | null
          rank?: number | null
          score?: number | null
          time_taken_secs?: number | null
          user_id: string
          wrong_count?: number | null
          xp_earned?: number | null
        }
        Update: {
          badge_earned_id?: string | null
          battle_id?: string
          completed_at?: string | null
          correct_count?: number | null
          id?: string
          joined_at?: string | null
          rank?: number | null
          score?: number | null
          time_taken_secs?: number | null
          user_id?: string
          wrong_count?: number | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "boss_battle_participants_badge_earned_id_fkey"
            columns: ["badge_earned_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boss_battle_participants_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "boss_battles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boss_battle_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      boss_battles: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          difficulty: string | null
          id: string
          max_players: number | null
          min_players: number | null
          question_count: number | null
          started_at: string | null
          status: string | null
          subject: string
          test_id: string | null
          time_limit_mins: number | null
          topic: string
          winner_user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          difficulty?: string | null
          id?: string
          max_players?: number | null
          min_players?: number | null
          question_count?: number | null
          started_at?: string | null
          status?: string | null
          subject: string
          test_id?: string | null
          time_limit_mins?: number | null
          topic: string
          winner_user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          difficulty?: string | null
          id?: string
          max_players?: number | null
          min_players?: number | null
          question_count?: number | null
          started_at?: string | null
          status?: string | null
          subject?: string
          test_id?: string | null
          time_limit_mins?: number | null
          topic?: string
          winner_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "boss_battles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boss_battles_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boss_battles_winner_user_id_fkey"
            columns: ["winner_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      byok_keys: {
        Row: {
          added_at: string | null
          encrypted_key: string
          encryption_method: string | null
          id: string
          is_active: boolean | null
          is_valid: boolean | null
          key_label: string | null
          last_used_at: string | null
          provider: string
          total_tokens_used: number | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          encrypted_key: string
          encryption_method?: string | null
          id?: string
          is_active?: boolean | null
          is_valid?: boolean | null
          key_label?: string | null
          last_used_at?: string | null
          provider: string
          total_tokens_used?: number | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          encrypted_key?: string
          encryption_method?: string | null
          id?: string
          is_active?: boolean | null
          is_valid?: boolean | null
          key_label?: string | null
          last_used_at?: string | null
          provider?: string
          total_tokens_used?: number | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "byok_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      career_roadmaps: {
        Row: {
          ai_assessment: string | null
          created_at: string | null
          current_phase: number | null
          estimated_years: number | null
          id: string
          is_active: boolean | null
          phases: Json
          skills_required: string[] | null
          target_career: string
          target_college: string | null
          target_company: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_assessment?: string | null
          created_at?: string | null
          current_phase?: number | null
          estimated_years?: number | null
          id?: string
          is_active?: boolean | null
          phases?: Json
          skills_required?: string[] | null
          target_career: string
          target_college?: string | null
          target_company?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_assessment?: string | null
          created_at?: string | null
          current_phase?: number | null
          estimated_years?: number | null
          id?: string
          is_active?: boolean | null
          phases?: Json
          skills_required?: string[] | null
          target_career?: string
          target_college?: string | null
          target_company?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_roadmaps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          agent: string | null
          attachments: Json | null
          content: string
          created_at: string | null
          id: string
          is_bookmarked: boolean | null
          model_used: string | null
          reading_time_ms: number | null
          role: string
          session_id: string
          tokens_input: number | null
          tokens_output: number | null
          tools_called: Json | null
          user_id: string
        }
        Insert: {
          agent?: string | null
          attachments?: Json | null
          content: string
          created_at?: string | null
          id?: string
          is_bookmarked?: boolean | null
          model_used?: string | null
          reading_time_ms?: number | null
          role: string
          session_id: string
          tokens_input?: number | null
          tokens_output?: number | null
          tools_called?: Json | null
          user_id: string
        }
        Update: {
          agent?: string | null
          attachments?: Json | null
          content?: string
          created_at?: string | null
          id?: string
          is_bookmarked?: boolean | null
          model_used?: string | null
          reading_time_ms?: number | null
          role?: string
          session_id?: string
          tokens_input?: number | null
          tokens_output?: number | null
          tools_called?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          attention_score: number | null
          chapter: string | null
          created_at: string | null
          duration_secs: number | null
          ended_at: string | null
          environment: string | null
          id: string
          is_active: boolean | null
          message_count: number | null
          model_used: string | null
          primary_agent: string | null
          session_mode: string | null
          started_at: string | null
          subject: string | null
          topic: string | null
          total_tokens: number | null
          use_personal_db: boolean | null
          user_id: string
          xp_awarded: number | null
        }
        Insert: {
          attention_score?: number | null
          chapter?: string | null
          created_at?: string | null
          duration_secs?: number | null
          ended_at?: string | null
          environment?: string | null
          id?: string
          is_active?: boolean | null
          message_count?: number | null
          model_used?: string | null
          primary_agent?: string | null
          session_mode?: string | null
          started_at?: string | null
          subject?: string | null
          topic?: string | null
          total_tokens?: number | null
          use_personal_db?: boolean | null
          user_id: string
          xp_awarded?: number | null
        }
        Update: {
          attention_score?: number | null
          chapter?: string | null
          created_at?: string | null
          duration_secs?: number | null
          ended_at?: string | null
          environment?: string | null
          id?: string
          is_active?: boolean | null
          message_count?: number | null
          model_used?: string | null
          primary_agent?: string | null
          session_mode?: string | null
          started_at?: string | null
          subject?: string | null
          topic?: string | null
          total_tokens?: number | null
          use_personal_db?: boolean | null
          user_id?: string
          xp_awarded?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcard_decks: {
        Row: {
          card_count: number | null
          chapter: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          last_reviewed: string | null
          mastered_count: number | null
          review_interval_days: number | null
          source: string | null
          source_id: string | null
          subject: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          card_count?: number | null
          chapter?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_reviewed?: string | null
          mastered_count?: number | null
          review_interval_days?: number | null
          source?: string | null
          source_id?: string | null
          subject?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          card_count?: number | null
          chapter?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_reviewed?: string | null
          mastered_count?: number | null
          review_interval_days?: number | null
          source?: string | null
          source_id?: string | null
          subject?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_decks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcard_reviews: {
        Row: {
          card_id: string
          created_at: string | null
          id: string
          new_ease: number | null
          new_interval: number | null
          previous_ease: number | null
          previous_interval: number | null
          response_quality: number
          time_taken_ms: number | null
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string | null
          id?: string
          new_ease?: number | null
          new_interval?: number | null
          previous_ease?: number | null
          previous_interval?: number | null
          response_quality: number
          time_taken_ms?: number | null
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string | null
          id?: string
          new_ease?: number | null
          new_interval?: number | null
          previous_ease?: number | null
          previous_interval?: number | null
          response_quality?: number
          time_taken_ms?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_reviews_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcard_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          back: string
          back_image: string | null
          back_latex: string | null
          created_at: string | null
          deck_id: string
          difficulty_score: number | null
          ease_factor: number | null
          front: string
          front_image: string | null
          front_latex: string | null
          id: string
          interval_days: number | null
          is_mastered: boolean | null
          next_review: string | null
          repetitions: number | null
          sort_order: number | null
          subject: string | null
          topic: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          back: string
          back_image?: string | null
          back_latex?: string | null
          created_at?: string | null
          deck_id: string
          difficulty_score?: number | null
          ease_factor?: number | null
          front: string
          front_image?: string | null
          front_latex?: string | null
          id?: string
          interval_days?: number | null
          is_mastered?: boolean | null
          next_review?: string | null
          repetitions?: number | null
          sort_order?: number | null
          subject?: string | null
          topic?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          back?: string
          back_image?: string | null
          back_latex?: string | null
          created_at?: string | null
          deck_id?: string
          difficulty_score?: number | null
          ease_factor?: number | null
          front?: string
          front_image?: string | null
          front_latex?: string | null
          id?: string
          interval_days?: number | null
          is_mastered?: boolean | null
          next_review?: string | null
          repetitions?: number | null
          sort_order?: number | null
          subject?: string | null
          topic?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "flashcard_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_sessions: {
        Row: {
          break_interval_mins: number | null
          completed_cycles: number | null
          created_at: string | null
          dnd_enabled: boolean | null
          ended_at: string | null
          id: string
          linked_note_id: string | null
          linked_task_id: string | null
          planned_cycles: number | null
          started_at: string | null
          status: string | null
          total_focus_mins: number | null
          user_id: string
          work_interval_mins: number | null
          xp_earned: number | null
        }
        Insert: {
          break_interval_mins?: number | null
          completed_cycles?: number | null
          created_at?: string | null
          dnd_enabled?: boolean | null
          ended_at?: string | null
          id?: string
          linked_note_id?: string | null
          linked_task_id?: string | null
          planned_cycles?: number | null
          started_at?: string | null
          status?: string | null
          total_focus_mins?: number | null
          user_id: string
          work_interval_mins?: number | null
          xp_earned?: number | null
        }
        Update: {
          break_interval_mins?: number | null
          completed_cycles?: number | null
          created_at?: string | null
          dnd_enabled?: boolean | null
          ended_at?: string | null
          id?: string
          linked_note_id?: string | null
          linked_task_id?: string | null
          planned_cycles?: number | null
          started_at?: string | null
          status?: string | null
          total_focus_mins?: number | null
          user_id?: string
          work_interval_mins?: number | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "focus_sessions_linked_note_id_fkey"
            columns: ["linked_note_id"]
            isOneToOne: false
            referencedRelation: "workspace_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "focus_sessions_linked_task_id_fkey"
            columns: ["linked_task_id"]
            isOneToOne: false
            referencedRelation: "todos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "focus_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      formula_entries: {
        Row: {
          chapter: string
          class_level: number | null
          common_mistakes: Json | null
          created_at: string | null
          derivation_source: string | null
          description: string | null
          difficulty: string | null
          exam_relevance: string[] | null
          examiner_traps: Json | null
          formula_latex: string
          formula_name: string
          id: string
          is_approved: boolean | null
          is_cheat_sheet: boolean | null
          is_shortcut: boolean | null
          is_user_submitted: boolean | null
          related_formulas: string[] | null
          shortcut_method: string | null
          subject: string
          submitted_by: string | null
          tags: string[] | null
          topic: string | null
          usage_count: number | null
          variables: Json
          worked_example: string | null
        }
        Insert: {
          chapter: string
          class_level?: number | null
          common_mistakes?: Json | null
          created_at?: string | null
          derivation_source?: string | null
          description?: string | null
          difficulty?: string | null
          exam_relevance?: string[] | null
          examiner_traps?: Json | null
          formula_latex: string
          formula_name: string
          id?: string
          is_approved?: boolean | null
          is_cheat_sheet?: boolean | null
          is_shortcut?: boolean | null
          is_user_submitted?: boolean | null
          related_formulas?: string[] | null
          shortcut_method?: string | null
          subject: string
          submitted_by?: string | null
          tags?: string[] | null
          topic?: string | null
          usage_count?: number | null
          variables: Json
          worked_example?: string | null
        }
        Update: {
          chapter?: string
          class_level?: number | null
          common_mistakes?: Json | null
          created_at?: string | null
          derivation_source?: string | null
          description?: string | null
          difficulty?: string | null
          exam_relevance?: string[] | null
          examiner_traps?: Json | null
          formula_latex?: string
          formula_name?: string
          id?: string
          is_approved?: boolean | null
          is_cheat_sheet?: boolean | null
          is_shortcut?: boolean | null
          is_user_submitted?: boolean | null
          related_formulas?: string[] | null
          shortcut_method?: string | null
          subject?: string
          submitted_by?: string | null
          tags?: string[] | null
          topic?: string | null
          usage_count?: number | null
          variables?: Json
          worked_example?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "formula_entries_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_requests: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          receiver_id: string
          responded_at: string | null
          sender_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id: string
          responded_at?: string | null
          sender_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          receiver_id?: string
          responded_at?: string | null
          sender_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friend_requests_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_requests_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_media: {
        Row: {
          content_text: string | null
          created_at: string | null
          duration_secs: number | null
          file_size_bytes: number | null
          folder_id: string | null
          id: string
          media_type: string
          mime_type: string | null
          model_used: string | null
          prompt_used: string | null
          quality: string | null
          source_mode: string | null
          source_note_id: string | null
          storage_bucket: string | null
          storage_path: string | null
          subject: string | null
          title: string | null
          topic: string | null
          user_id: string
        }
        Insert: {
          content_text?: string | null
          created_at?: string | null
          duration_secs?: number | null
          file_size_bytes?: number | null
          folder_id?: string | null
          id?: string
          media_type: string
          mime_type?: string | null
          model_used?: string | null
          prompt_used?: string | null
          quality?: string | null
          source_mode?: string | null
          source_note_id?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
          subject?: string | null
          title?: string | null
          topic?: string | null
          user_id: string
        }
        Update: {
          content_text?: string | null
          created_at?: string | null
          duration_secs?: number | null
          file_size_bytes?: number | null
          folder_id?: string | null
          id?: string
          media_type?: string
          mime_type?: string | null
          model_used?: string | null
          prompt_used?: string | null
          quality?: string | null
          source_mode?: string | null
          source_note_id?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
          subject?: string | null
          title?: string | null
          topic?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_media_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "workspace_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_media_source_note_id_fkey"
            columns: ["source_note_id"]
            isOneToOne: false
            referencedRelation: "workspace_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_media_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_sessions: {
        Row: {
          ai_evaluations: Json | null
          communication_score: number | null
          confidence_score: number | null
          created_at: string | null
          duration_secs: number | null
          id: string
          improvement_report: string | null
          interview_type: string
          mode: string | null
          overall_score: number | null
          question_count: number | null
          questions_asked: Json | null
          target_company: string | null
          target_role: string | null
          user_id: string
          user_responses: Json | null
        }
        Insert: {
          ai_evaluations?: Json | null
          communication_score?: number | null
          confidence_score?: number | null
          created_at?: string | null
          duration_secs?: number | null
          id?: string
          improvement_report?: string | null
          interview_type: string
          mode?: string | null
          overall_score?: number | null
          question_count?: number | null
          questions_asked?: Json | null
          target_company?: string | null
          target_role?: string | null
          user_id: string
          user_responses?: Json | null
        }
        Update: {
          ai_evaluations?: Json | null
          communication_score?: number | null
          confidence_score?: number | null
          created_at?: string | null
          duration_secs?: number | null
          id?: string
          improvement_report?: string | null
          interview_type?: string
          mode?: string | null
          overall_score?: number | null
          question_count?: number | null
          questions_asked?: Json | null
          target_company?: string | null
          target_role?: string | null
          user_id?: string
          user_responses?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_snapshots: {
        Row: {
          academic_year: number | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          level: number
          rank: number
          score: number | null
          snapshot_date: string
          snapshot_type: string
          user_id: string
          xp_total: number
        }
        Insert: {
          academic_year?: number | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          level: number
          rank: number
          score?: number | null
          snapshot_date?: string
          snapshot_type: string
          user_id: string
          xp_total: number
        }
        Update: {
          academic_year?: number | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          level?: number
          rank?: number
          score?: number | null
          snapshot_date?: string
          snapshot_type?: string
          user_id?: string
          xp_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_entries: {
        Row: {
          access_count: number | null
          category: string
          content: string
          created_at: string | null
          embedding_id: string | null
          id: string
          importance: number | null
          is_active: boolean | null
          last_accessed: string | null
          source: string | null
          source_id: string | null
          subject: string | null
          topic: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_count?: number | null
          category: string
          content: string
          created_at?: string | null
          embedding_id?: string | null
          id?: string
          importance?: number | null
          is_active?: boolean | null
          last_accessed?: string | null
          source?: string | null
          source_id?: string | null
          subject?: string | null
          topic?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_count?: number | null
          category?: string
          content?: string
          created_at?: string | null
          embedding_id?: string | null
          id?: string
          importance?: number | null
          is_active?: boolean | null
          last_accessed?: string | null
          source?: string | null
          source_id?: string | null
          subject?: string | null
          topic?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          badge_reward_id: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          difficulty: string | null
          generated_by: string | null
          id: string
          mission_type: string
          subject: string | null
          target_metric: string
          target_value: number
          title: string
          user_id: string
          xp_reward: number | null
        }
        Insert: {
          badge_reward_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          difficulty?: string | null
          generated_by?: string | null
          id?: string
          mission_type: string
          subject?: string | null
          target_metric: string
          target_value: number
          title: string
          user_id: string
          xp_reward?: number | null
        }
        Update: {
          badge_reward_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          difficulty?: string | null
          generated_by?: string | null
          id?: string
          mission_type?: string
          subject?: string | null
          target_metric?: string
          target_value?: number
          title?: string
          user_id?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "missions_badge_reward_id_fkey"
            columns: ["badge_reward_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          body: string | null
          created_at: string | null
          expires_at: string | null
          icon: string | null
          id: string
          is_dismissed: boolean | null
          is_read: boolean | null
          metadata: Json | null
          notification_type: string
          priority: string | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          body?: string | null
          created_at?: string | null
          expires_at?: string | null
          icon?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          metadata?: Json | null
          notification_type: string
          priority?: string | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          body?: string | null
          created_at?: string | null
          expires_at?: string | null
          icon?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          metadata?: Json | null
          notification_type?: string
          priority?: string | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_reports: {
        Row: {
          attendance_score: number | null
          created_at: string | null
          email_sent: boolean | null
          email_sent_at: string | null
          flags: Json | null
          id: string
          parent_email: string
          progress_pct: number | null
          report_week: string
          study_hours: number | null
          summary: string | null
          test_trend: string | null
          user_id: string
        }
        Insert: {
          attendance_score?: number | null
          created_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          flags?: Json | null
          id?: string
          parent_email: string
          progress_pct?: number | null
          report_week: string
          study_hours?: number | null
          summary?: string | null
          test_trend?: string | null
          user_id: string
        }
        Update: {
          attendance_score?: number | null
          created_at?: string | null
          email_sent?: boolean | null
          email_sent_at?: string | null
          flags?: Json | null
          id?: string
          parent_email?: string
          progress_pct?: number | null
          report_week?: string
          study_hours?: number | null
          summary?: string | null
          test_trend?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_content: {
        Row: {
          admin_id: string | null
          board: string | null
          chapter: string | null
          class_level: number | null
          content: string
          content_html: string | null
          content_type: string
          created_at: string | null
          difficulty: string | null
          embedding_id: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          source: string | null
          source_page: number | null
          subject: string
          tags: string[] | null
          title: string
          topic: string | null
          updated_at: string | null
        }
        Insert: {
          admin_id?: string | null
          board?: string | null
          chapter?: string | null
          class_level?: number | null
          content: string
          content_html?: string | null
          content_type: string
          created_at?: string | null
          difficulty?: string | null
          embedding_id?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          source?: string | null
          source_page?: number | null
          subject: string
          tags?: string[] | null
          title: string
          topic?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_id?: string | null
          board?: string | null
          chapter?: string | null
          class_level?: number | null
          content?: string
          content_html?: string | null
          content_type?: string
          created_at?: string | null
          difficulty?: string | null
          embedding_id?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          source?: string | null
          source_page?: number | null
          subject?: string
          tags?: string[] | null
          title?: string
          topic?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_questions: {
        Row: {
          admin_id: string | null
          chapter: string
          class_level: number | null
          common_mistakes: Json | null
          correct_answer: string
          created_at: string | null
          difficulty: string | null
          exam_source: string | null
          explanation_style: string | null
          frequency_score: number | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          marks: number | null
          negative_marks: number | null
          options: Json | null
          predicted_probability: number | null
          pyq_year: number | null
          question_image: string | null
          question_text: string
          question_type: string
          related_questions: string[] | null
          solution: string | null
          solution_image: string | null
          subject: string
          tags: string[] | null
          topic: string | null
          usage_count: number | null
        }
        Insert: {
          admin_id?: string | null
          chapter: string
          class_level?: number | null
          common_mistakes?: Json | null
          correct_answer: string
          created_at?: string | null
          difficulty?: string | null
          exam_source?: string | null
          explanation_style?: string | null
          frequency_score?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          marks?: number | null
          negative_marks?: number | null
          options?: Json | null
          predicted_probability?: number | null
          pyq_year?: number | null
          question_image?: string | null
          question_text: string
          question_type: string
          related_questions?: string[] | null
          solution?: string | null
          solution_image?: string | null
          subject: string
          tags?: string[] | null
          topic?: string | null
          usage_count?: number | null
        }
        Update: {
          admin_id?: string | null
          chapter?: string
          class_level?: number | null
          common_mistakes?: Json | null
          correct_answer?: string
          created_at?: string | null
          difficulty?: string | null
          exam_source?: string | null
          explanation_style?: string | null
          frequency_score?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          marks?: number | null
          negative_marks?: number | null
          options?: Json | null
          predicted_probability?: number | null
          pyq_year?: number | null
          question_image?: string | null
          question_text?: string
          question_type?: string
          related_questions?: string[] | null
          solution?: string | null
          solution_image?: string | null
          subject?: string
          tags?: string[] | null
          topic?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          assessment_completed: boolean | null
          avatar_url: string | null
          board: string | null
          class_level: number | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          exam_target: string | null
          full_name: string | null
          gender: string | null
          id: string
          last_seen_at: string | null
          learning_speed: Json | null
          level: number | null
          medium: string | null
          onboarding_completed: boolean | null
          parent_email: string | null
          parent_name: string | null
          persona_mode: string | null
          phone: string | null
          rank_title: string | null
          school_name: string | null
          subjects: string[] | null
          teaching_mode: string | null
          tier: string | null
          tour_completed: boolean | null
          tour_mode: string | null
          updated_at: string | null
          xp_total: number | null
        }
        Insert: {
          assessment_completed?: boolean | null
          avatar_url?: string | null
          board?: string | null
          class_level?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          exam_target?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          last_seen_at?: string | null
          learning_speed?: Json | null
          level?: number | null
          medium?: string | null
          onboarding_completed?: boolean | null
          parent_email?: string | null
          parent_name?: string | null
          persona_mode?: string | null
          phone?: string | null
          rank_title?: string | null
          school_name?: string | null
          subjects?: string[] | null
          teaching_mode?: string | null
          tier?: string | null
          tour_completed?: boolean | null
          tour_mode?: string | null
          updated_at?: string | null
          xp_total?: number | null
        }
        Update: {
          assessment_completed?: boolean | null
          avatar_url?: string | null
          board?: string | null
          class_level?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          exam_target?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          last_seen_at?: string | null
          learning_speed?: Json | null
          level?: number | null
          medium?: string | null
          onboarding_completed?: boolean | null
          parent_email?: string | null
          parent_name?: string | null
          persona_mode?: string | null
          phone?: string | null
          rank_title?: string | null
          school_name?: string | null
          subjects?: string[] | null
          teaching_mode?: string | null
          tier?: string | null
          tour_completed?: boolean | null
          tour_mode?: string | null
          updated_at?: string | null
          xp_total?: number | null
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string | null
          id: string
          is_bookmarked: boolean | null
          query: string
          result_count: number | null
          results_summary: Json | null
          search_mode: string
          sources_used: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_bookmarked?: boolean | null
          query: string
          result_count?: number | null
          results_summary?: Json | null
          search_mode: string
          sources_used?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_bookmarked?: boolean | null
          query?: string
          result_count?: number | null
          results_summary?: Json | null
          search_mode?: string
          sources_used?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_events: {
        Row: {
          checklist: Json | null
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_mins: number | null
          end_time: string
          event_type: string | null
          id: string
          is_all_day: boolean | null
          is_completed: boolean | null
          is_locked: boolean | null
          is_recurring: boolean | null
          linked_note_id: string | null
          linked_test_id: string | null
          notification_mins_before: number | null
          priority: string | null
          recurrence_rule: string | null
          start_time: string
          subject: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          checklist?: Json | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_mins?: number | null
          end_time: string
          event_type?: string | null
          id?: string
          is_all_day?: boolean | null
          is_completed?: boolean | null
          is_locked?: boolean | null
          is_recurring?: boolean | null
          linked_note_id?: string | null
          linked_test_id?: string | null
          notification_mins_before?: number | null
          priority?: string | null
          recurrence_rule?: string | null
          start_time: string
          subject?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          checklist?: Json | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_mins?: number | null
          end_time?: string
          event_type?: string | null
          id?: string
          is_all_day?: boolean | null
          is_completed?: boolean | null
          is_locked?: boolean | null
          is_recurring?: boolean | null
          linked_note_id?: string | null
          linked_test_id?: string | null
          notification_mins_before?: number | null
          priority?: string | null
          recurrence_rule?: string | null
          start_time?: string
          subject?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_events_linked_note_id_fkey"
            columns: ["linked_note_id"]
            isOneToOne: false
            referencedRelation: "workspace_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_events_linked_test_id_fkey"
            columns: ["linked_test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_assessments: {
        Row: {
          ai_recommendations: string | null
          created_at: string | null
          current_skills: Json
          gap_score: number | null
          id: string
          improvement_plan: Json | null
          required_skills: Json
          target_company: string | null
          target_role: string
          user_id: string
        }
        Insert: {
          ai_recommendations?: string | null
          created_at?: string | null
          current_skills: Json
          gap_score?: number | null
          id?: string
          improvement_plan?: Json | null
          required_skills: Json
          target_company?: string | null
          target_role: string
          user_id: string
        }
        Update: {
          ai_recommendations?: string | null
          created_at?: string | null
          current_skills?: Json
          gap_score?: number | null
          id?: string
          improvement_plan?: Json | null
          required_skills?: Json
          target_company?: string | null
          target_role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stat_snapshots: {
        Row: {
          avg_score: number | null
          created_at: string | null
          depth_score: number | null
          discipline_score: number | null
          exploration_score: number | null
          id: string
          level: number | null
          precision_score: number | null
          recall_score: number | null
          snapshot_date: string
          snapshot_type: string | null
          study_hours: number | null
          tests_taken: number | null
          user_id: string
          velocity_score: number | null
          xp_total: number | null
        }
        Insert: {
          avg_score?: number | null
          created_at?: string | null
          depth_score?: number | null
          discipline_score?: number | null
          exploration_score?: number | null
          id?: string
          level?: number | null
          precision_score?: number | null
          recall_score?: number | null
          snapshot_date?: string
          snapshot_type?: string | null
          study_hours?: number | null
          tests_taken?: number | null
          user_id: string
          velocity_score?: number | null
          xp_total?: number | null
        }
        Update: {
          avg_score?: number | null
          created_at?: string | null
          depth_score?: number | null
          discipline_score?: number | null
          exploration_score?: number | null
          id?: string
          level?: number | null
          precision_score?: number | null
          recall_score?: number | null
          snapshot_date?: string
          snapshot_type?: string | null
          study_hours?: number | null
          tests_taken?: number | null
          user_id?: string
          velocity_score?: number | null
          xp_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stat_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      streaks: {
        Row: {
          broken_count: number | null
          created_at: string | null
          current_count: number | null
          id: string
          is_active: boolean | null
          last_active_date: string | null
          longest_ever: number | null
          started_at: string | null
          streak_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          broken_count?: number | null
          created_at?: string | null
          current_count?: number | null
          id?: string
          is_active?: boolean | null
          last_active_date?: string | null
          longest_ever?: number | null
          started_at?: string | null
          streak_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          broken_count?: number | null
          created_at?: string | null
          current_count?: number | null
          id?: string
          is_active?: boolean | null
          last_active_date?: string | null
          longest_ever?: number | null
          started_at?: string | null
          streak_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_stats: {
        Row: {
          attention_avg_mins: number | null
          avg_test_score: number | null
          concepts_in_progress: number | null
          concepts_mastered: number | null
          concepts_weak: number | null
          depth_score: number | null
          discipline_score: number | null
          discovery_rate: number | null
          error_patterns: Json | null
          exploration_score: number | null
          forgetting_curves: Json | null
          id: string
          learning_velocity: Json | null
          optimal_focus_window: string | null
          precision_score: number | null
          recall_score: number | null
          strength_heatmap: Json | null
          topic_mastery: Json | null
          total_sessions: number | null
          total_study_hours: number | null
          total_tests_taken: number | null
          updated_at: string | null
          user_id: string
          velocity_score: number | null
          weakness_heatmap: Json | null
        }
        Insert: {
          attention_avg_mins?: number | null
          avg_test_score?: number | null
          concepts_in_progress?: number | null
          concepts_mastered?: number | null
          concepts_weak?: number | null
          depth_score?: number | null
          discipline_score?: number | null
          discovery_rate?: number | null
          error_patterns?: Json | null
          exploration_score?: number | null
          forgetting_curves?: Json | null
          id?: string
          learning_velocity?: Json | null
          optimal_focus_window?: string | null
          precision_score?: number | null
          recall_score?: number | null
          strength_heatmap?: Json | null
          topic_mastery?: Json | null
          total_sessions?: number | null
          total_study_hours?: number | null
          total_tests_taken?: number | null
          updated_at?: string | null
          user_id: string
          velocity_score?: number | null
          weakness_heatmap?: Json | null
        }
        Update: {
          attention_avg_mins?: number | null
          avg_test_score?: number | null
          concepts_in_progress?: number | null
          concepts_mastered?: number | null
          concepts_weak?: number | null
          depth_score?: number | null
          discipline_score?: number | null
          discovery_rate?: number | null
          error_patterns?: Json | null
          exploration_score?: number | null
          forgetting_curves?: Json | null
          id?: string
          learning_velocity?: Json | null
          optimal_focus_window?: string | null
          precision_score?: number | null
          recall_score?: number | null
          strength_heatmap?: Json | null
          topic_mastery?: Json | null
          total_sessions?: number | null
          total_study_hours?: number | null
          total_tests_taken?: number | null
          updated_at?: string | null
          user_id?: string
          velocity_score?: number | null
          weakness_heatmap?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "student_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          auto_renew: boolean | null
          cancelled_at: string | null
          created_at: string | null
          currency: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          payment_id: string | null
          payment_provider: string | null
          price_monthly: number | null
          status: string | null
          subscription_id: string | null
          tier: string
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          cancelled_at?: string | null
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          payment_id?: string | null
          payment_provider?: string | null
          price_monthly?: number | null
          status?: string | null
          subscription_id?: string | null
          tier?: string
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          cancelled_at?: string | null
          created_at?: string | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          payment_id?: string | null
          payment_provider?: string | null
          price_monthly?: number | null
          status?: string | null
          subscription_id?: string | null
          tier?: string
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      test_questions: {
        Row: {
          chapter: string | null
          correct_answer: string
          created_at: string | null
          difficulty: string | null
          id: string
          marks: number | null
          negative_marks: number | null
          options: Json | null
          pyq_exam: string | null
          pyq_year: number | null
          question_image: string | null
          question_index: number
          question_text: string
          question_type: string
          solution: string | null
          source: string | null
          subject: string | null
          test_id: string
          time_expected_secs: number | null
          topic: string | null
        }
        Insert: {
          chapter?: string | null
          correct_answer: string
          created_at?: string | null
          difficulty?: string | null
          id?: string
          marks?: number | null
          negative_marks?: number | null
          options?: Json | null
          pyq_exam?: string | null
          pyq_year?: number | null
          question_image?: string | null
          question_index: number
          question_text: string
          question_type: string
          solution?: string | null
          source?: string | null
          subject?: string | null
          test_id: string
          time_expected_secs?: number | null
          topic?: string | null
        }
        Update: {
          chapter?: string | null
          correct_answer?: string
          created_at?: string | null
          difficulty?: string | null
          id?: string
          marks?: number | null
          negative_marks?: number | null
          options?: Json | null
          pyq_exam?: string | null
          pyq_year?: number | null
          question_image?: string | null
          question_index?: number
          question_text?: string
          question_type?: string
          solution?: string | null
          source?: string | null
          subject?: string | null
          test_id?: string
          time_expected_secs?: number | null
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_responses: {
        Row: {
          ai_feedback: string | null
          answer_image: string | null
          confidence_level: number | null
          created_at: string | null
          error_type: string | null
          id: string
          is_correct: boolean | null
          is_flagged: boolean | null
          is_skipped: boolean | null
          marks_awarded: number | null
          question_id: string
          selected_option: string | null
          test_id: string
          time_spent_secs: number | null
          user_id: string
          written_answer: string | null
        }
        Insert: {
          ai_feedback?: string | null
          answer_image?: string | null
          confidence_level?: number | null
          created_at?: string | null
          error_type?: string | null
          id?: string
          is_correct?: boolean | null
          is_flagged?: boolean | null
          is_skipped?: boolean | null
          marks_awarded?: number | null
          question_id: string
          selected_option?: string | null
          test_id: string
          time_spent_secs?: number | null
          user_id: string
          written_answer?: string | null
        }
        Update: {
          ai_feedback?: string | null
          answer_image?: string | null
          confidence_level?: number | null
          created_at?: string | null
          error_type?: string | null
          id?: string
          is_correct?: boolean | null
          is_flagged?: boolean | null
          is_skipped?: boolean | null
          marks_awarded?: number | null
          question_id?: string
          selected_option?: string | null
          test_id?: string
          time_spent_secs?: number | null
          user_id?: string
          written_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "test_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_responses_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      test_results: {
        Row: {
          ai_grader_report: string | null
          ai_improvement_tips: Json | null
          confidence_accuracy: Json | null
          correct_count: number | null
          created_at: string | null
          duration_secs: number | null
          error_breakdown: Json | null
          id: string
          marks_obtained: number
          per_chapter: Json | null
          per_subject: Json | null
          percentile: number | null
          rank: number | null
          score_pct: number
          skipped_count: number | null
          test_id: string
          total_marks: number
          total_questions: number
          user_id: string
          wrong_count: number | null
          xp_earned: number | null
        }
        Insert: {
          ai_grader_report?: string | null
          ai_improvement_tips?: Json | null
          confidence_accuracy?: Json | null
          correct_count?: number | null
          created_at?: string | null
          duration_secs?: number | null
          error_breakdown?: Json | null
          id?: string
          marks_obtained: number
          per_chapter?: Json | null
          per_subject?: Json | null
          percentile?: number | null
          rank?: number | null
          score_pct: number
          skipped_count?: number | null
          test_id: string
          total_marks: number
          total_questions: number
          user_id: string
          wrong_count?: number | null
          xp_earned?: number | null
        }
        Update: {
          ai_grader_report?: string | null
          ai_improvement_tips?: Json | null
          confidence_accuracy?: Json | null
          correct_count?: number | null
          created_at?: string | null
          duration_secs?: number | null
          error_breakdown?: Json | null
          id?: string
          marks_obtained?: number
          per_chapter?: Json | null
          per_subject?: Json | null
          percentile?: number | null
          rank?: number | null
          score_pct?: number
          skipped_count?: number | null
          test_id?: string
          total_marks?: number
          total_questions?: number
          user_id?: string
          wrong_count?: number | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: true
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          allow_calculator: boolean | null
          boss_battle_id: string | null
          chapters: string[] | null
          completed_at: string | null
          created_at: string | null
          difficulty: string | null
          id: string
          is_timed: boolean | null
          negative_mark_value: number | null
          negative_marking: boolean | null
          question_count: number
          show_solutions_after: boolean | null
          shuffle_options: boolean | null
          shuffle_questions: boolean | null
          started_at: string | null
          status: string | null
          subjects: string[] | null
          test_type: string
          time_limit_mins: number | null
          title: string | null
          user_id: string
        }
        Insert: {
          allow_calculator?: boolean | null
          boss_battle_id?: string | null
          chapters?: string[] | null
          completed_at?: string | null
          created_at?: string | null
          difficulty?: string | null
          id?: string
          is_timed?: boolean | null
          negative_mark_value?: number | null
          negative_marking?: boolean | null
          question_count: number
          show_solutions_after?: boolean | null
          shuffle_options?: boolean | null
          shuffle_questions?: boolean | null
          started_at?: string | null
          status?: string | null
          subjects?: string[] | null
          test_type: string
          time_limit_mins?: number | null
          title?: string | null
          user_id: string
        }
        Update: {
          allow_calculator?: boolean | null
          boss_battle_id?: string | null
          chapters?: string[] | null
          completed_at?: string | null
          created_at?: string | null
          difficulty?: string | null
          id?: string
          is_timed?: boolean | null
          negative_mark_value?: number | null
          negative_marking?: boolean | null
          question_count?: number
          show_solutions_after?: boolean | null
          shuffle_options?: boolean | null
          shuffle_questions?: boolean | null
          started_at?: string | null
          status?: string | null
          subjects?: string[] | null
          test_type?: string
          time_limit_mins?: number | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          event_id: string | null
          id: string
          is_completed: boolean | null
          note_id: string | null
          priority: string | null
          sort_order: number | null
          subject: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          is_completed?: boolean | null
          note_id?: string | null
          priority?: string | null
          sort_order?: number | null
          subject?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          is_completed?: boolean | null
          note_id?: string | null
          priority?: string | null
          sort_order?: number | null
          subject?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "schedule_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todos_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "workspace_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_quotas: {
        Row: {
          audio_generated: number | null
          audio_limit: number | null
          chat_limit: number | null
          chat_messages: number | null
          created_at: string | null
          diagram_limit: number | null
          diagrams_created: number | null
          flashcards_created: number | null
          id: string
          image_limit: number | null
          images_solved: number | null
          quota_date: string
          search_limit: number | null
          searches_made: number | null
          storage_limit_bytes: number | null
          storage_used_bytes: number | null
          test_limit: number | null
          tests_taken: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audio_generated?: number | null
          audio_limit?: number | null
          chat_limit?: number | null
          chat_messages?: number | null
          created_at?: string | null
          diagram_limit?: number | null
          diagrams_created?: number | null
          flashcards_created?: number | null
          id?: string
          image_limit?: number | null
          images_solved?: number | null
          quota_date?: string
          search_limit?: number | null
          searches_made?: number | null
          storage_limit_bytes?: number | null
          storage_used_bytes?: number | null
          test_limit?: number | null
          tests_taken?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audio_generated?: number | null
          audio_limit?: number | null
          chat_limit?: number | null
          chat_messages?: number | null
          created_at?: string | null
          diagram_limit?: number | null
          diagrams_created?: number | null
          flashcards_created?: number | null
          id?: string
          image_limit?: number | null
          images_solved?: number | null
          quota_date?: string
          search_limit?: number | null
          searches_made?: number | null
          storage_limit_bytes?: number | null
          storage_used_bytes?: number | null
          test_limit?: number | null
          tests_taken?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_quotas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          claimed_at: string | null
          earned_at: string | null
          id: string
          is_claimed: boolean | null
          is_displayed: boolean | null
          user_id: string
        }
        Insert: {
          badge_id: string
          claimed_at?: string | null
          earned_at?: string | null
          id?: string
          is_claimed?: boolean | null
          is_displayed?: boolean | null
          user_id: string
        }
        Update: {
          badge_id?: string
          claimed_at?: string | null
          earned_at?: string | null
          id?: string
          is_claimed?: boolean | null
          is_displayed?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_knowledge_items: {
        Row: {
          ai_tags: string[] | null
          chapter_tags: string[] | null
          content_preview: string | null
          created_at: string | null
          description: string | null
          embedding_id: string | null
          file_size_bytes: number | null
          folder_id: string | null
          id: string
          is_indexed: boolean | null
          item_type: string
          mime_type: string | null
          original_url: string | null
          processing_status: string | null
          storage_path: string | null
          subject_tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_tags?: string[] | null
          chapter_tags?: string[] | null
          content_preview?: string | null
          created_at?: string | null
          description?: string | null
          embedding_id?: string | null
          file_size_bytes?: number | null
          folder_id?: string | null
          id?: string
          is_indexed?: boolean | null
          item_type: string
          mime_type?: string | null
          original_url?: string | null
          processing_status?: string | null
          storage_path?: string | null
          subject_tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_tags?: string[] | null
          chapter_tags?: string[] | null
          content_preview?: string | null
          created_at?: string | null
          description?: string | null
          embedding_id?: string | null
          file_size_bytes?: number | null
          folder_id?: string | null
          id?: string
          is_indexed?: boolean | null
          item_type?: string
          mime_type?: string | null
          original_url?: string | null
          processing_status?: string | null
          storage_path?: string | null
          subject_tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_knowledge_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_missions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          mission_id: string
          progress_pct: number | null
          progress_value: number | null
          started_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          xp_claimed: boolean | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          mission_id: string
          progress_pct?: number | null
          progress_value?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          xp_claimed?: boolean | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          mission_id?: string
          progress_pct?: number | null
          progress_value?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          xp_claimed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_missions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          about_me: string | null
          answer_depth: string | null
          answer_format: string | null
          auto_language_switch: boolean | null
          created_at: string | null
          current_mood: string | null
          custom_instructions: string | null
          custom_slash_commands: Json | null
          id: string
          notification_push: boolean | null
          notification_sound: boolean | null
          preferred_language: string | null
          sidebar_default_open: boolean | null
          theme: string | null
          updated_at: string | null
          use_personal_db_default: boolean | null
          user_id: string
        }
        Insert: {
          about_me?: string | null
          answer_depth?: string | null
          answer_format?: string | null
          auto_language_switch?: boolean | null
          created_at?: string | null
          current_mood?: string | null
          custom_instructions?: string | null
          custom_slash_commands?: Json | null
          id?: string
          notification_push?: boolean | null
          notification_sound?: boolean | null
          preferred_language?: string | null
          sidebar_default_open?: boolean | null
          theme?: string | null
          updated_at?: string | null
          use_personal_db_default?: boolean | null
          user_id: string
        }
        Update: {
          about_me?: string | null
          answer_depth?: string | null
          answer_format?: string | null
          auto_language_switch?: boolean | null
          created_at?: string | null
          current_mood?: string | null
          custom_instructions?: string | null
          custom_slash_commands?: Json | null
          id?: string
          notification_push?: boolean | null
          notification_sound?: boolean | null
          preferred_language?: string | null
          sidebar_default_open?: boolean | null
          theme?: string | null
          updated_at?: string | null
          use_personal_db_default?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_reports: {
        Row: {
          ai_assessment: string | null
          ai_recommendations: Json | null
          avg_test_score: number | null
          concerns: Json | null
          created_at: string | null
          focus_minutes: number | null
          highlights: Json | null
          id: string
          is_shared: boolean | null
          level_change: number | null
          missions_completed: number | null
          pdf_url: string | null
          report_week: string
          stat_changes: Json | null
          streak_statuses: Json | null
          test_scores: Json | null
          tests_taken: number | null
          topics_covered: string[] | null
          total_study_hours: number | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          ai_assessment?: string | null
          ai_recommendations?: Json | null
          avg_test_score?: number | null
          concerns?: Json | null
          created_at?: string | null
          focus_minutes?: number | null
          highlights?: Json | null
          id?: string
          is_shared?: boolean | null
          level_change?: number | null
          missions_completed?: number | null
          pdf_url?: string | null
          report_week: string
          stat_changes?: Json | null
          streak_statuses?: Json | null
          test_scores?: Json | null
          tests_taken?: number | null
          topics_covered?: string[] | null
          total_study_hours?: number | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          ai_assessment?: string | null
          ai_recommendations?: Json | null
          avg_test_score?: number | null
          concerns?: Json | null
          created_at?: string | null
          focus_minutes?: number | null
          highlights?: Json | null
          id?: string
          is_shared?: boolean | null
          level_change?: number | null
          missions_completed?: number | null
          pdf_url?: string | null
          report_week?: string
          stat_changes?: Json | null
          streak_statuses?: Json | null
          test_scores?: Json | null
          tests_taken?: number | null
          topics_covered?: string[] | null
          total_study_hours?: number | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_files: {
        Row: {
          chapter_tags: string[] | null
          created_at: string | null
          embedding_id: string | null
          extracted_text: string | null
          file_name: string
          file_size_bytes: number | null
          file_type: string
          folder_id: string | null
          id: string
          is_indexed: boolean | null
          mime_type: string | null
          ocr_status: string | null
          original_url: string | null
          storage_bucket: string | null
          storage_path: string
          subject_tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chapter_tags?: string[] | null
          created_at?: string | null
          embedding_id?: string | null
          extracted_text?: string | null
          file_name: string
          file_size_bytes?: number | null
          file_type: string
          folder_id?: string | null
          id?: string
          is_indexed?: boolean | null
          mime_type?: string | null
          ocr_status?: string | null
          original_url?: string | null
          storage_bucket?: string | null
          storage_path: string
          subject_tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          chapter_tags?: string[] | null
          created_at?: string | null
          embedding_id?: string | null
          extracted_text?: string | null
          file_name?: string
          file_size_bytes?: number | null
          file_type?: string
          folder_id?: string | null
          id?: string
          is_indexed?: boolean | null
          mime_type?: string | null
          ocr_status?: string | null
          original_url?: string | null
          storage_bucket?: string | null
          storage_path?: string
          subject_tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_files_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "workspace_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_folders: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_prebuilt: boolean | null
          name: string
          parent_id: string | null
          prebuilt_type: string | null
          sort_order: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_prebuilt?: boolean | null
          name: string
          parent_id?: string | null
          prebuilt_type?: string | null
          sort_order?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_prebuilt?: boolean | null
          name?: string
          parent_id?: string | null
          prebuilt_type?: string | null
          sort_order?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "workspace_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_folders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_notes: {
        Row: {
          ai_tags: string[] | null
          chapter_tags: string[] | null
          content_blocks: Json | null
          content_markdown: string | null
          content_preview: string | null
          created_at: string | null
          embedding_id: string | null
          folder_id: string | null
          id: string
          is_archived: boolean | null
          is_indexed: boolean | null
          is_pinned: boolean | null
          subject_tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          word_count: number | null
        }
        Insert: {
          ai_tags?: string[] | null
          chapter_tags?: string[] | null
          content_blocks?: Json | null
          content_markdown?: string | null
          content_preview?: string | null
          created_at?: string | null
          embedding_id?: string | null
          folder_id?: string | null
          id?: string
          is_archived?: boolean | null
          is_indexed?: boolean | null
          is_pinned?: boolean | null
          subject_tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id: string
          word_count?: number | null
        }
        Update: {
          ai_tags?: string[] | null
          chapter_tags?: string[] | null
          content_blocks?: Json | null
          content_markdown?: string | null
          content_preview?: string | null
          created_at?: string | null
          embedding_id?: string | null
          folder_id?: string | null
          id?: string
          is_archived?: boolean | null
          is_indexed?: boolean | null
          is_pinned?: boolean | null
          subject_tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_notes_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "workspace_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_ledger: {
        Row: {
          amount: number
          balance_after: number | null
          created_at: string | null
          description: string | null
          id: string
          source: string | null
          source_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          source?: string | null
          source_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          source?: string | null
          source_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "xp_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

