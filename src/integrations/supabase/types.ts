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
      admin_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      api_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      bot_activity: {
        Row: {
          bot_enabled: boolean
          compound_profits: boolean
          created_at: string
          daily_trade_limit: number
          id: string
          last_reset_at: string
          loss_today: number
          profit_today: number
          risk_profile: string
          trades_today: number
          user_id: string
        }
        Insert: {
          bot_enabled?: boolean
          compound_profits?: boolean
          created_at?: string
          daily_trade_limit?: number
          id?: string
          last_reset_at?: string
          loss_today?: number
          profit_today?: number
          risk_profile?: string
          trades_today?: number
          user_id: string
        }
        Update: {
          bot_enabled?: boolean
          compound_profits?: boolean
          created_at?: string
          daily_trade_limit?: number
          id?: string
          last_reset_at?: string
          loss_today?: number
          profit_today?: number
          risk_profile?: string
          trades_today?: number
          user_id?: string
        }
        Relationships: []
      }
      deposits: {
        Row: {
          admin_note: string | null
          amount: number
          created_at: string
          currency: string
          id: string
          method: string
          network: string | null
          screenshot_url: string | null
          status: string
          tx_hash: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          method?: string
          network?: string | null
          screenshot_url?: string | null
          status?: string
          tx_hash?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          method?: string
          network?: string | null
          screenshot_url?: string | null
          status?: string
          tx_hash?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      homepage_faq: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      kyc: {
        Row: {
          admin_note: string | null
          document_type: string | null
          document_url: string | null
          id: string
          reviewed_at: string | null
          selfie_url: string | null
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          document_type?: string | null
          document_url?: string | null
          id?: string
          reviewed_at?: string | null
          selfie_url?: string | null
          status?: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          document_type?: string | null
          document_url?: string | null
          id?: string
          reviewed_at?: string | null
          selfie_url?: string | null
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_stats: {
        Row: {
          auto_calculate: boolean
          id: string
          key: string
          label: string
          updated_at: string
          value: string
        }
        Insert: {
          auto_calculate?: boolean
          id?: string
          key: string
          label: string
          updated_at?: string
          value?: string
        }
        Update: {
          auto_calculate?: boolean
          id?: string
          key?: string
          label?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          is_frozen: boolean
          kyc_status: string
          referral_code: string | null
          referred_by: string | null
          two_factor_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_frozen?: boolean
          kyc_status?: string
          referral_code?: string | null
          referred_by?: string | null
          two_factor_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_frozen?: boolean
          kyc_status?: string
          referral_code?: string | null
          referred_by?: string | null
          two_factor_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          commission_percent: number
          created_at: string
          id: string
          referred_id: string
          referrer_id: string
          total_commission: number
        }
        Insert: {
          commission_percent?: number
          created_at?: string
          id?: string
          referred_id: string
          referrer_id: string
          total_commission?: number
        }
        Update: {
          commission_percent?: number
          created_at?: string
          id?: string
          referred_id?: string
          referrer_id?: string
          total_commission?: number
        }
        Relationships: []
      }
      trade_entries: {
        Row: {
          amount: number
          completed_at: string | null
          id: string
          profit: number | null
          started_at: string
          status: string
          trade_id: string
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          id?: string
          profit?: number | null
          started_at?: string
          status?: string
          trade_id: string
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          id?: string
          profit?: number | null
          started_at?: string
          status?: string
          trade_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_entries_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
      trades: {
        Row: {
          created_at: string
          duration_hours: number
          expires_at: string | null
          id: string
          max_investment: number
          min_investment: number
          risk_level: string
          roi_percent: number
          slot_limit: number
          slots_filled: number
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          duration_hours: number
          expires_at?: string | null
          id?: string
          max_investment: number
          min_investment: number
          risk_level?: string
          roi_percent: number
          slot_limit?: number
          slots_filled?: number
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          duration_hours?: number
          expires_at?: string | null
          id?: string
          max_investment?: number
          min_investment?: number
          risk_level?: string
          roi_percent?: number
          slot_limit?: number
          slots_filled?: number
          status?: string
          title?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          address: string
          created_at: string
          currency: string
          id: string
          is_active: boolean
          min_deposit: number
          network: string
        }
        Insert: {
          address: string
          created_at?: string
          currency: string
          id?: string
          is_active?: boolean
          min_deposit?: number
          network: string
        }
        Update: {
          address?: string
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          min_deposit?: number
          network?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          admin_note: string | null
          amount: number
          created_at: string
          currency: string
          id: string
          status: string
          updated_at: string
          user_id: string
          wallet_address: string
        }
        Insert: {
          admin_note?: string | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
          wallet_address: string
        }
        Update: {
          admin_note?: string | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
