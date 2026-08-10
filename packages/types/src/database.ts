export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      badge_requirements: {
        Row: {
          badge_id: string
          created_at: string
          details: Json
          id: string
          is_required: boolean
          metric: Database["public"]["Enums"]["badge_metric"]
          sort_order: number
          target_value: number
          updated_at: string
        }
        Insert: {
          badge_id: string
          created_at?: string
          details?: Json
          id?: string
          is_required?: boolean
          metric: Database["public"]["Enums"]["badge_metric"]
          sort_order?: number
          target_value: number
          updated_at?: string
        }
        Update: {
          badge_id?: string
          created_at?: string
          details?: Json
          id?: string
          is_required?: boolean
          metric?: Database["public"]["Enums"]["badge_metric"]
          sort_order?: number
          target_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "badge_requirements_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          award_mode: Database["public"]["Enums"]["badge_award_mode"]
          category: Database["public"]["Enums"]["badge_category"]
          created_at: string
          description: string
          icon_key: string
          id: string
          is_published: boolean
          name: string
          phase_id: string | null
          slug: string
          sort_order: number
          track_id: string | null
          updated_at: string
        }
        Insert: {
          award_mode?: Database["public"]["Enums"]["badge_award_mode"]
          category: Database["public"]["Enums"]["badge_category"]
          created_at?: string
          description: string
          icon_key?: string
          id?: string
          is_published?: boolean
          name: string
          phase_id?: string | null
          slug: string
          sort_order?: number
          track_id?: string | null
          updated_at?: string
        }
        Update: {
          award_mode?: Database["public"]["Enums"]["badge_award_mode"]
          category?: Database["public"]["Enums"]["badge_category"]
          created_at?: string
          description?: string
          icon_key?: string
          id?: string
          is_published?: boolean
          name?: string
          phase_id?: string | null
          slug?: string
          sort_order?: number
          track_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "badges_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "badges_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          created_at: string
          description: string | null
          estimated_minutes: number | null
          id: string
          is_required: boolean
          official_checklist_id: string | null
          position: number
          slug: string | null
          title: string
          updated_at: string
          user_checklist_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_required?: boolean
          official_checklist_id?: string | null
          position?: number
          slug?: string | null
          title: string
          updated_at?: string
          user_checklist_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_required?: boolean
          official_checklist_id?: string | null
          position?: number
          slug?: string | null
          title?: string
          updated_at?: string
          user_checklist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_official_checklist_id_fkey"
            columns: ["official_checklist_id"]
            isOneToOne: false
            referencedRelation: "official_checklists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_items_user_checklist_id_fkey"
            columns: ["user_checklist_id"]
            isOneToOne: false
            referencedRelation: "user_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      official_checklists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          position: number
          skill_id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          position?: number
          skill_id: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          position?: number
          skill_id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "official_checklists_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      phases: {
        Row: {
          created_at: string
          description: string | null
          estimated_hours: number | null
          id: string
          is_published: boolean
          name: string
          position: number
          slug: string
          track_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          is_published?: boolean
          name: string
          position?: number
          slug: string
          track_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          is_published?: boolean
          name?: string
          position?: number
          slug?: string
          track_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "phases_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_job_title: string | null
          display_name: string | null
          experience_level: string | null
          headline: string | null
          id: string
          onboarding_completed: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_job_title?: string | null
          display_name?: string | null
          experience_level?: string | null
          headline?: string | null
          id: string
          onboarding_completed?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_job_title?: string | null
          display_name?: string | null
          experience_level?: string | null
          headline?: string | null
          id?: string
          onboarding_completed?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      project_skills: {
        Row: {
          created_at: string
          custom_skill_id: string | null
          id: string
          project_id: string
          skill_id: string | null
        }
        Insert: {
          created_at?: string
          custom_skill_id?: string | null
          id?: string
          project_id: string
          skill_id?: string | null
        }
        Update: {
          created_at?: string
          custom_skill_id?: string | null
          id?: string
          project_id?: string
          skill_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_skills_custom_skill_id_fkey"
            columns: ["custom_skill_id"]
            isOneToOne: false
            referencedRelation: "user_custom_skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_skills_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          live_url: string | null
          name: string
          repository_url: string | null
          started_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          name: string
          repository_url?: string | null
          started_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          name?: string
          repository_url?: string | null
          started_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skill_evidence: {
        Row: {
          created_at: string
          custom_skill_id: string | null
          description: string | null
          evidence_date: string | null
          id: string
          issuer: string | null
          project_id: string | null
          skill_id: string | null
          storage_path: string | null
          title: string
          type: Database["public"]["Enums"]["evidence_type"]
          updated_at: string
          url: string | null
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          created_at?: string
          custom_skill_id?: string | null
          description?: string | null
          evidence_date?: string | null
          id?: string
          issuer?: string | null
          project_id?: string | null
          skill_id?: string | null
          storage_path?: string | null
          title: string
          type: Database["public"]["Enums"]["evidence_type"]
          updated_at?: string
          url?: string | null
          user_id: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          created_at?: string
          custom_skill_id?: string | null
          description?: string | null
          evidence_date?: string | null
          id?: string
          issuer?: string | null
          project_id?: string | null
          skill_id?: string | null
          storage_path?: string | null
          title?: string
          type?: Database["public"]["Enums"]["evidence_type"]
          updated_at?: string
          url?: string | null
          user_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "skill_evidence_custom_skill_id_fkey"
            columns: ["custom_skill_id"]
            isOneToOne: false
            referencedRelation: "user_custom_skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_evidence_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_evidence_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_prerequisites: {
        Row: {
          created_at: string
          prerequisite_skill_id: string
          skill_id: string
        }
        Insert: {
          created_at?: string
          prerequisite_skill_id: string
          skill_id: string
        }
        Update: {
          created_at?: string
          prerequisite_skill_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_prerequisites_prerequisite_skill_id_fkey"
            columns: ["prerequisite_skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_prerequisites_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          estimated_hours: number | null
          id: string
          is_published: boolean
          is_required: boolean
          name: string
          phase_id: string
          position: number
          slug: string
          source: Database["public"]["Enums"]["content_source"]
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          is_published?: boolean
          is_required?: boolean
          name: string
          phase_id: string
          position?: number
          slug: string
          source?: Database["public"]["Enums"]["content_source"]
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          is_published?: boolean
          is_required?: boolean
          name?: string
          phase_id?: string
          position?: number
          slug?: string
          source?: Database["public"]["Enums"]["content_source"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_published: boolean
          name: string
          position: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean
          name: string
          position?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean
          name?: string
          position?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string | null
          badge_id: string
          created_at: string
          evaluation_snapshot: Json
          evidence_score: number | null
          id: string
          knowledge_score: number | null
          practice_score: number | null
          readiness_score: number | null
          revoked_at: string | null
          status: Database["public"]["Enums"]["badge_achievement_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          awarded_at?: string | null
          badge_id: string
          created_at?: string
          evaluation_snapshot?: Json
          evidence_score?: number | null
          id?: string
          knowledge_score?: number | null
          practice_score?: number | null
          readiness_score?: number | null
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["badge_achievement_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          awarded_at?: string | null
          badge_id?: string
          created_at?: string
          evaluation_snapshot?: Json
          evidence_score?: number | null
          id?: string
          knowledge_score?: number | null
          practice_score?: number | null
          readiness_score?: number | null
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["badge_achievement_status"]
          updated_at?: string
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
        ]
      }
      user_checklist_item_progress: {
        Row: {
          checklist_item_id: string
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          checklist_item_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          checklist_item_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_checklist_item_progress_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_checklists: {
        Row: {
          created_at: string
          custom_skill_id: string | null
          description: string | null
          id: string
          position: number
          skill_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_skill_id?: string | null
          description?: string | null
          id?: string
          position?: number
          skill_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          custom_skill_id?: string | null
          description?: string | null
          id?: string
          position?: number
          skill_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_checklists_custom_skill_id_fkey"
            columns: ["custom_skill_id"]
            isOneToOne: false
            referencedRelation: "user_custom_skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_checklists_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_custom_skills: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          evidence_score: number
          id: string
          knowledge_score: number
          mastery_status: Database["public"]["Enums"]["mastery_status"]
          name: string
          phase_id: string | null
          practice_score: number
          professional_readiness_score: number
          track_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          evidence_score?: number
          id?: string
          knowledge_score?: number
          mastery_status?: Database["public"]["Enums"]["mastery_status"]
          name: string
          phase_id?: string | null
          practice_score?: number
          professional_readiness_score?: number
          track_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          evidence_score?: number
          id?: string
          knowledge_score?: number
          mastery_status?: Database["public"]["Enums"]["mastery_status"]
          name?: string
          phase_id?: string | null
          practice_score?: number
          professional_readiness_score?: number
          track_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_custom_skills_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_custom_skills_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          completed_at: string | null
          created_at: string
          evidence_score: number
          id: string
          knowledge_score: number
          last_practiced_at: string | null
          mastery_status: Database["public"]["Enums"]["mastery_status"]
          notes: string | null
          practice_score: number
          professional_readiness_score: number
          skill_id: string
          started_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          evidence_score?: number
          id?: string
          knowledge_score?: number
          last_practiced_at?: string | null
          mastery_status?: Database["public"]["Enums"]["mastery_status"]
          notes?: string | null
          practice_score?: number
          professional_readiness_score?: number
          skill_id: string
          started_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          evidence_score?: number
          id?: string
          knowledge_score?: number
          last_practiced_at?: string | null
          mastery_status?: Database["public"]["Enums"]["mastery_status"]
          notes?: string | null
          practice_score?: number
          professional_readiness_score?: number
          skill_id?: string
          started_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tracks: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          is_primary: boolean
          started_at: string
          track_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          started_at?: string
          track_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          started_at?: string
          track_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
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
      badge_achievement_status: "eligible" | "awarded" | "revoked"
      badge_award_mode: "automatic" | "review_required" | "manual"
      badge_category:
        | "capability"
        | "portfolio"
        | "career"
        | "seniority"
        | "market"
        | "platform"
      badge_metric: "knowledge" | "practice" | "evidence" | "readiness"
      content_source: "official" | "ai_suggested" | "team_approved"
      evidence_type:
        | "github_repository"
        | "live_project"
        | "project"
        | "certificate"
        | "image"
        | "note"
        | "professional_experience"
      mastery_status:
        | "not_started"
        | "studying"
        | "understands_concept"
        | "practiced"
        | "used_in_project"
        | "independent"
        | "can_teach"
      verification_status: "unverified" | "pending" | "verified" | "rejected"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      badge_achievement_status: ["eligible", "awarded", "revoked"],
      badge_award_mode: ["automatic", "review_required", "manual"],
      badge_category: [
        "capability",
        "portfolio",
        "career",
        "seniority",
        "market",
        "platform",
      ],
      badge_metric: ["knowledge", "practice", "evidence", "readiness"],
      content_source: ["official", "ai_suggested", "team_approved"],
      evidence_type: [
        "github_repository",
        "live_project",
        "project",
        "certificate",
        "image",
        "note",
        "professional_experience",
      ],
      mastery_status: [
        "not_started",
        "studying",
        "understands_concept",
        "practiced",
        "used_in_project",
        "independent",
        "can_teach",
      ],
      verification_status: ["unverified", "pending", "verified", "rejected"],
    },
  },
} as const
