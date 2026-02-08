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
      agent_feed: {
        Row: {
          agent_id: string
          content: Json
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          locality: string
          parent_id: string | null
          post_type: string
          reply_count: number | null
          thread_root_id: string | null
          updated_at: string | null
          view_count: number | null
          visibility: string | null
        }
        Insert: {
          agent_id: string
          content: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          locality: string
          parent_id?: string | null
          post_type: string
          reply_count?: number | null
          thread_root_id?: string | null
          updated_at?: string | null
          view_count?: number | null
          visibility?: string | null
        }
        Update: {
          agent_id?: string
          content?: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          locality?: string
          parent_id?: string | null
          post_type?: string
          reply_count?: number | null
          thread_root_id?: string | null
          updated_at?: string | null
          view_count?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_feed_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_feed_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "agent_feed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_feed_thread_root_id_fkey"
            columns: ["thread_root_id"]
            isOneToOne: false
            referencedRelation: "agent_feed"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          agent_type: string
          company_id: string
          constraints: Json | null
          created_at: string | null
          geographic_range_km: number | null
          id: string
          last_active_at: string | null
          locality: string
          name: string
          performance: Json | null
          status: string | null
        }
        Insert: {
          agent_type: string
          company_id: string
          constraints?: Json | null
          created_at?: string | null
          geographic_range_km?: number | null
          id?: string
          last_active_at?: string | null
          locality: string
          name: string
          performance?: Json | null
          status?: string | null
        }
        Update: {
          agent_type?: string
          company_id?: string
          constraints?: Json | null
          created_at?: string | null
          geographic_range_km?: number | null
          id?: string
          last_active_at?: string | null
          locality?: string
          name?: string
          performance?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          entity_type: string | null
          id: string
          industry: string
          locality: string | null
          location: Json
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_type?: string | null
          id?: string
          industry: string
          locality?: string | null
          location: Json
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_type?: string | null
          id?: string
          industry?: string
          locality?: string | null
          location?: Json
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      company_kpis: {
        Row: {
          carbon_emissions: number | null
          carbon_saved_potential: number | null
          company_id: string | null
          created_at: string | null
          emission_intensity: number | null
          id: string
          industry_percentile: number | null
          landfill_diversion_percentage: number | null
          mci_score: number | null
          net_circular_value: number | null
          period: string
          potential_circular_revenue: number | null
          total_input_volume: number | null
          total_output_volume: number | null
          total_waste_cost: number | null
          total_waste_volume: number | null
          waste_to_value_ratio: number | null
        }
        Insert: {
          carbon_emissions?: number | null
          carbon_saved_potential?: number | null
          company_id?: string | null
          created_at?: string | null
          emission_intensity?: number | null
          id?: string
          industry_percentile?: number | null
          landfill_diversion_percentage?: number | null
          mci_score?: number | null
          net_circular_value?: number | null
          period: string
          potential_circular_revenue?: number | null
          total_input_volume?: number | null
          total_output_volume?: number | null
          total_waste_cost?: number | null
          total_waste_volume?: number | null
          waste_to_value_ratio?: number | null
        }
        Update: {
          carbon_emissions?: number | null
          carbon_saved_potential?: number | null
          company_id?: string | null
          created_at?: string | null
          emission_intensity?: number | null
          id?: string
          industry_percentile?: number | null
          landfill_diversion_percentage?: number | null
          mci_score?: number | null
          net_circular_value?: number | null
          period?: string
          potential_circular_revenue?: number | null
          total_input_volume?: number | null
          total_output_volume?: number | null
          total_waste_cost?: number | null
          total_waste_volume?: number | null
          waste_to_value_ratio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_kpis_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          agent_reasoning: string | null
          agent_recommendation: string | null
          buyer_agent_id: string
          buyer_approved_at: string | null
          buyer_approved_by: string | null
          buyer_company_id: string
          created_at: string | null
          delivery_terms: string | null
          duration_months: number | null
          end_date: string | null
          id: string
          material_category: string
          material_subtype: string
          negotiation_rounds: number | null
          negotiation_thread_id: string | null
          passport_id: string
          payment_terms: string | null
          price_per_unit: number
          quality_tier: number | null
          seller_agent_id: string
          seller_approved_at: string | null
          seller_approved_by: string | null
          seller_company_id: string
          start_date: string | null
          status: string | null
          total_value: number
          unit: string
          updated_at: string | null
          volume: number
        }
        Insert: {
          agent_reasoning?: string | null
          agent_recommendation?: string | null
          buyer_agent_id: string
          buyer_approved_at?: string | null
          buyer_approved_by?: string | null
          buyer_company_id: string
          created_at?: string | null
          delivery_terms?: string | null
          duration_months?: number | null
          end_date?: string | null
          id?: string
          material_category: string
          material_subtype: string
          negotiation_rounds?: number | null
          negotiation_thread_id?: string | null
          passport_id: string
          payment_terms?: string | null
          price_per_unit: number
          quality_tier?: number | null
          seller_agent_id: string
          seller_approved_at?: string | null
          seller_approved_by?: string | null
          seller_company_id: string
          start_date?: string | null
          status?: string | null
          total_value: number
          unit: string
          updated_at?: string | null
          volume: number
        }
        Update: {
          agent_reasoning?: string | null
          agent_recommendation?: string | null
          buyer_agent_id?: string
          buyer_approved_at?: string | null
          buyer_approved_by?: string | null
          buyer_company_id?: string
          created_at?: string | null
          delivery_terms?: string | null
          duration_months?: number | null
          end_date?: string | null
          id?: string
          material_category?: string
          material_subtype?: string
          negotiation_rounds?: number | null
          negotiation_thread_id?: string | null
          passport_id?: string
          payment_terms?: string | null
          price_per_unit?: number
          quality_tier?: number | null
          seller_agent_id?: string
          seller_approved_at?: string | null
          seller_approved_by?: string | null
          seller_company_id?: string
          start_date?: string | null
          status?: string | null
          total_value?: number
          unit?: string
          updated_at?: string | null
          volume?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_buyer_agent_id_fkey"
            columns: ["buyer_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_buyer_company_id_fkey"
            columns: ["buyer_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_negotiation_thread_id_fkey"
            columns: ["negotiation_thread_id"]
            isOneToOne: false
            referencedRelation: "agent_feed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_passport_id_fkey"
            columns: ["passport_id"]
            isOneToOne: false
            referencedRelation: "material_passports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_seller_agent_id_fkey"
            columns: ["seller_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_seller_company_id_fkey"
            columns: ["seller_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          company_id: string | null
          confidence_score: number | null
          created_at: string | null
          extracted_text: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          materials_identified: Json | null
          parsed_data: Json | null
          processed_at: string | null
          processing_errors: Json | null
          status: string | null
        }
        Insert: {
          company_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          extracted_text?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          materials_identified?: Json | null
          parsed_data?: Json | null
          processed_at?: string | null
          processing_errors?: Json | null
          status?: string | null
        }
        Update: {
          company_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          extracted_text?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          materials_identified?: Json | null
          parsed_data?: Json | null
          processed_at?: string | null
          processing_errors?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      material_passports: {
        Row: {
          carbon_footprint: number | null
          contamination_level: number | null
          created_at: string | null
          current_owner_company_id: string | null
          id: string
          is_active: boolean | null
          material_category: string
          material_subtype: string
          physical_form: string
          quality_grade: string | null
          quality_tier: number | null
          technical_properties: Json | null
          unit: string
          updated_at: string | null
          verification_provider: string | null
          verification_score: number | null
          verification_status: string | null
          volume: number
          waste_stream_id: string | null
        }
        Insert: {
          carbon_footprint?: number | null
          contamination_level?: number | null
          created_at?: string | null
          current_owner_company_id?: string | null
          id?: string
          is_active?: boolean | null
          material_category: string
          material_subtype: string
          physical_form: string
          quality_grade?: string | null
          quality_tier?: number | null
          technical_properties?: Json | null
          unit: string
          updated_at?: string | null
          verification_provider?: string | null
          verification_score?: number | null
          verification_status?: string | null
          volume: number
          waste_stream_id?: string | null
        }
        Update: {
          carbon_footprint?: number | null
          contamination_level?: number | null
          created_at?: string | null
          current_owner_company_id?: string | null
          id?: string
          is_active?: boolean | null
          material_category?: string
          material_subtype?: string
          physical_form?: string
          quality_grade?: string | null
          quality_tier?: number | null
          technical_properties?: Json | null
          unit?: string
          updated_at?: string | null
          verification_provider?: string | null
          verification_score?: number | null
          verification_status?: string | null
          volume?: number
          waste_stream_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_passports_current_owner_company_id_fkey"
            columns: ["current_owner_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_passports_waste_stream_id_fkey"
            columns: ["waste_stream_id"]
            isOneToOne: false
            referencedRelation: "waste_streams"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          carbon_footprint: number | null
          category: string
          company_id: string | null
          cost_per_unit: number | null
          created_at: string | null
          date_recorded: string | null
          id: string
          material_category: string | null
          material_subtype: string | null
          material_type: string
          monthly_volume: number
          physical_form: string | null
          technical_properties: Json | null
          unit: string
        }
        Insert: {
          carbon_footprint?: number | null
          category: string
          company_id?: string | null
          cost_per_unit?: number | null
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          material_category?: string | null
          material_subtype?: string | null
          material_type: string
          monthly_volume: number
          physical_form?: string | null
          technical_properties?: Json | null
          unit?: string
        }
        Update: {
          carbon_footprint?: number | null
          category?: string
          company_id?: string | null
          cost_per_unit?: number | null
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          material_category?: string | null
          material_subtype?: string | null
          material_type?: string
          monthly_volume?: number
          physical_form?: string | null
          technical_properties?: Json | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "materials_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          company_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          related_deal_id: string | null
          related_feed_post_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          related_deal_id?: string | null
          related_feed_post_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          related_deal_id?: string | null
          related_feed_post_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_deal_id_fkey"
            columns: ["related_deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_feed_post_id_fkey"
            columns: ["related_feed_post_id"]
            isOneToOne: false
            referencedRelation: "agent_feed"
            referencedColumns: ["id"]
          },
        ]
      }
      passport_documents: {
        Row: {
          created_at: string | null
          document_type: string | null
          file_url: string
          id: string
          passport_id: string | null
          uploaded_by: string | null
          verification_status: string | null
        }
        Insert: {
          created_at?: string | null
          document_type?: string | null
          file_url: string
          id?: string
          passport_id?: string | null
          uploaded_by?: string | null
          verification_status?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string | null
          file_url?: string
          id?: string
          passport_id?: string | null
          uploaded_by?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "passport_documents_passport_id_fkey"
            columns: ["passport_id"]
            isOneToOne: false
            referencedRelation: "material_passports"
            referencedColumns: ["id"]
          },
        ]
      }
      passport_events: {
        Row: {
          carbon_delta: number | null
          created_at: string | null
          description: string | null
          event_type: string
          from_company_id: string | null
          id: string
          metadata: Json | null
          passport_id: string
          quality_delta: number | null
          to_company_id: string | null
        }
        Insert: {
          carbon_delta?: number | null
          created_at?: string | null
          description?: string | null
          event_type: string
          from_company_id?: string | null
          id?: string
          metadata?: Json | null
          passport_id: string
          quality_delta?: number | null
          to_company_id?: string | null
        }
        Update: {
          carbon_delta?: number | null
          created_at?: string | null
          description?: string | null
          event_type?: string
          from_company_id?: string | null
          id?: string
          metadata?: Json | null
          passport_id?: string
          quality_delta?: number | null
          to_company_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "passport_events_from_company_id_fkey"
            columns: ["from_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passport_events_passport_id_fkey"
            columns: ["passport_id"]
            isOneToOne: false
            referencedRelation: "material_passports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passport_events_to_company_id_fkey"
            columns: ["to_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      
      waste_streams: {
        Row: {
          classification: string
          company_id: string | null
          contamination_level: number | null
          created_at: string | null
          current_disposal_cost: number | null
          id: string
          material_id: string | null
          monthly_volume: number
          passport_id: string | null
          potential_value: number | null
          processability_score: number | null
          quality_grade: string | null
          recyclable_score: number | null
        }
        Insert: {
          classification: string
          company_id?: string | null
          contamination_level?: number | null
          created_at?: string | null
          current_disposal_cost?: number | null
          id?: string
          material_id?: string | null
          monthly_volume: number
          passport_id?: string | null
          potential_value?: number | null
          processability_score?: number | null
          quality_grade?: string | null
          recyclable_score?: number | null
        }
        Update: {
          classification?: string
          company_id?: string | null
          contamination_level?: number | null
          created_at?: string | null
          current_disposal_cost?: number | null
          id?: string
          material_id?: string | null
          monthly_volume?: number
          passport_id?: string | null
          potential_value?: number | null
          processability_score?: number | null
          quality_grade?: string | null
          recyclable_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "waste_streams_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waste_streams_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waste_streams_passport_id_fkey"
            columns: ["passport_id"]
            isOneToOne: false
            referencedRelation: "material_passports"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      transfer_passport_ownership: {
        Args: { new_owner: string; passport_id: string }
        Returns: undefined
      }
      update_agent_performance: {
        Args: { p_agent_id: string; p_increment?: number; p_metric: string }
        Returns: undefined
      }
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
