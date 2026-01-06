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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          address: string | null
          created_at: string | null
          created_by: string | null
          id: string
          industry: string | null
          name: string
          phone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          industry?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          industry?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          approver_id: string
          comments: string | null
          created_at: string | null
          id: string
          quote_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          approver_id: string
          comments?: string | null
          created_at?: string | null
          id?: string
          quote_id: string
          status: string
          updated_at?: string | null
        }
        Update: {
          approver_id?: string
          comments?: string | null
          created_at?: string | null
          id?: string
          quote_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approvals_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes_for_operations"
            referencedColumns: ["id"]
          },
        ]
      }
      handovers: {
        Row: {
          accepted_by: string | null
          created_at: string | null
          deal_value: number
          expected_end_date: string | null
          expected_start_date: string | null
          flagged_reason: string | null
          id: string
          opportunity_id: string
          quote_id: string | null
          scope: string | null
          state: Database["public"]["Enums"]["handover_state"]
          updated_at: string | null
        }
        Insert: {
          accepted_by?: string | null
          created_at?: string | null
          deal_value: number
          expected_end_date?: string | null
          expected_start_date?: string | null
          flagged_reason?: string | null
          id?: string
          opportunity_id: string
          quote_id?: string | null
          scope?: string | null
          state?: Database["public"]["Enums"]["handover_state"]
          updated_at?: string | null
        }
        Update: {
          accepted_by?: string | null
          created_at?: string | null
          deal_value?: number
          expected_end_date?: string | null
          expected_start_date?: string | null
          flagged_reason?: string | null
          id?: string
          opportunity_id?: string
          quote_id?: string | null
          scope?: string | null
          state?: Database["public"]["Enums"]["handover_state"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "handovers_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "handovers_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "handovers_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "handovers_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes_for_operations"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          account_id: string
          created_at: string | null
          deal_value: number
          description: string | null
          expected_close_date: string | null
          id: string
          name: string
          owner_id: string
          state: Database["public"]["Enums"]["opportunity_state"]
          updated_at: string | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          deal_value: number
          description?: string | null
          expected_close_date?: string | null
          id?: string
          name: string
          owner_id: string
          state?: Database["public"]["Enums"]["opportunity_state"]
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          deal_value?: number
          description?: string | null
          expected_close_date?: string | null
          id?: string
          name?: string
          owner_id?: string
          state?: Database["public"]["Enums"]["opportunity_state"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          cost: number | null
          created_at: string | null
          created_by: string
          deal_value: number
          discount_percentage: number | null
          id: string
          margin: number | null
          margin_percentage: number | null
          opportunity_id: string
          quote_number: string
          scope: string | null
          state: Database["public"]["Enums"]["quote_state"]
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          created_by: string
          deal_value: number
          discount_percentage?: number | null
          id?: string
          margin?: number | null
          margin_percentage?: number | null
          opportunity_id: string
          quote_number: string
          scope?: string | null
          state?: Database["public"]["Enums"]["quote_state"]
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          created_by?: string
          deal_value?: number
          discount_percentage?: number | null
          id?: string
          margin?: number | null
          margin_percentage?: number | null
          opportunity_id?: string
          quote_number?: string
          scope?: string | null
          state?: Database["public"]["Enums"]["quote_state"]
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      quotes_for_operations: {
        Row: {
          created_at: string | null
          created_by: string | null
          deal_value: number | null
          id: string | null
          opportunity_id: string | null
          quote_number: string | null
          scope: string | null
          state: Database["public"]["Enums"]["quote_state"] | null
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          deal_value?: number | null
          id?: string | null
          opportunity_id?: string | null
          quote_number?: string | null
          scope?: string | null
          state?: Database["public"]["Enums"]["quote_state"] | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          deal_value?: number | null
          id?: string | null
          opportunity_id?: string | null
          quote_number?: string | null
          scope?: string | null
          state?: Database["public"]["Enums"]["quote_state"] | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_any_role: {
        Args: { required_roles: Database["public"]["Enums"]["user_role"][] }
        Returns: boolean
      }
      has_role: {
        Args: { required_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
    }
    Enums: {
      handover_state: "pending" | "accepted" | "flagged"
      opportunity_state:
        | "lead"
        | "qualified"
        | "proposal"
        | "closed_won"
        | "closed_lost"
      quote_state: "draft" | "pending_approval" | "approved" | "rejected"
      user_role: "executive" | "sales" | "finance" | "operations"
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
    Enums: {
      handover_state: ["pending", "accepted", "flagged"],
      opportunity_state: [
        "lead",
        "qualified",
        "proposal",
        "closed_won",
        "closed_lost",
      ],
      quote_state: ["draft", "pending_approval", "approved", "rejected"],
      user_role: ["executive", "sales", "finance", "operations"],
    },
  },
} as const

