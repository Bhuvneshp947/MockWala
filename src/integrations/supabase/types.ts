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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      attempts: {
        Row: {
          answers: Json
          correct_count: number
          duration_seconds: number
          exam_id: string
          id: string
          max_score: number
          question_ids: string[]
          score: number
          started_at: string
          status: string
          subject_id: string
          submitted_at: string | null
          time_taken_seconds: number
          total_questions: number
          unattempted_count: number
          user_id: string
          wrong_count: number
        }
        Insert: {
          answers?: Json
          correct_count?: number
          duration_seconds?: number
          exam_id: string
          id?: string
          max_score?: number
          question_ids?: string[]
          score?: number
          started_at?: string
          status?: string
          subject_id: string
          submitted_at?: string | null
          time_taken_seconds?: number
          total_questions?: number
          unattempted_count?: number
          user_id: string
          wrong_count?: number
        }
        Update: {
          answers?: Json
          correct_count?: number
          duration_seconds?: number
          exam_id?: string
          id?: string
          max_score?: number
          question_ids?: string[]
          score?: number
          started_at?: string
          status?: string
          subject_id?: string
          submitted_at?: string | null
          time_taken_seconds?: number
          total_questions?: number
          unattempted_count?: number
          user_id?: string
          wrong_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "attempts_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempts_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          accent: string
          category: string
          created_at: string
          description: string
          exam_date: string
          id: string
          name: string
          registration_note: string | null
          short_name: string
          slug: string
          sort_order: number
        }
        Insert: {
          accent?: string
          category: string
          created_at?: string
          description: string
          exam_date: string
          id?: string
          name: string
          registration_note?: string | null
          short_name: string
          slug: string
          sort_order?: number
        }
        Update: {
          accent?: string
          category?: string
          created_at?: string
          description?: string
          exam_date?: string
          id?: string
          name?: string
          registration_note?: string | null
          short_name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          class_level: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          school: string | null
          target_exam: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          class_level?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id: string
          phone?: string | null
          school?: string | null
          target_exam?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          class_level?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          school?: string | null
          target_exam?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          body: string
          correct_index: number
          created_at: string
          difficulty: string
          exam_id: string
          explanation: string
          id: string
          options: Json
          subject_id: string
          topic: string
        }
        Insert: {
          body: string
          correct_index: number
          created_at?: string
          difficulty?: string
          exam_id: string
          explanation?: string
          id?: string
          options: Json
          subject_id: string
          topic?: string
        }
        Update: {
          body?: string
          correct_index?: number
          created_at?: string
          difficulty?: string
          exam_id?: string
          explanation?: string
          id?: string
          options?: Json
          subject_id?: string
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          description: string
          duration_minutes: number
          exam_id: string
          id: string
          name: string
          questions_per_test: number
          slug: string
          sort_order: number
        }
        Insert: {
          description?: string
          duration_minutes?: number
          exam_id: string
          id?: string
          name: string
          questions_per_test?: number
          slug: string
          sort_order?: number
        }
        Update: {
          description?: string
          duration_minutes?: number
          exam_id?: string
          id?: string
          name?: string
          questions_per_test?: number
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "subjects_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
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
