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
