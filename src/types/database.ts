export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          industry: string;
          location: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          industry: string;
          location: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          industry?: string;
          location?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      materials: {
        Row: {
          id: string;
          company_id: string;
          material_type: string;
          category: string;
          monthly_volume: number;
          unit: string;
          cost_per_unit: number | null;
          carbon_footprint: number | null;
          date_recorded: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          material_type: string;
          category: string;
          monthly_volume: number;
          unit?: string;
          cost_per_unit?: number | null;
          carbon_footprint?: number | null;
          date_recorded?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          material_type?: string;
          category?: string;
          monthly_volume?: number;
          unit?: string;
          cost_per_unit?: number | null;
          carbon_footprint?: number | null;
          date_recorded?: string;
          created_at?: string;
        };
      };
      waste_streams: {
        Row: {
          id: string;
          company_id: string;
          material_id: string;
          classification: string;
          monthly_volume: number;
          current_disposal_cost: number;
          contamination_level: number | null;
          quality_grade: string | null;
          potential_value: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          material_id: string;
          classification: string;
          monthly_volume: number;
          current_disposal_cost: number;
          contamination_level?: number | null;
          quality_grade?: string | null;
          potential_value?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          material_id?: string;
          classification?: string;
          monthly_volume?: number;
          current_disposal_cost?: number;
          contamination_level?: number | null;
          quality_grade?: string | null;
          potential_value?: number | null;
          created_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          company_id: string;
          file_url: string;
          file_name: string;
          file_size: number;
          file_type: string;
          status: string;
          extracted_text: string | null;
          parsed_data: Json | null;
          materials_identified: Json | null;
          confidence_score: number | null;
          processing_errors: Json | null;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          file_url: string;
          file_name: string;
          file_size: number;
          file_type: string;
          status?: string;
          extracted_text?: string | null;
          parsed_data?: Json | null;
          materials_identified?: Json | null;
          confidence_score?: number | null;
          processing_errors?: Json | null;
          processed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          file_url?: string;
          file_name?: string;
          file_size?: number;
          file_type?: string;
          status?: string;
          extracted_text?: string | null;
          parsed_data?: Json | null;
          materials_identified?: Json | null;
          confidence_score?: number | null;
          processing_errors?: Json | null;
          processed_at?: string | null;
          created_at?: string;
        };
      };
      company_kpis: {
        Row: {
          id: string;
          company_id: string;
          period: string;
          mci_score: number | null;
          waste_to_value_ratio: number | null;
          landfill_diversion_percentage: number | null;
          total_input_volume: number | null;
          total_output_volume: number | null;
          total_waste_volume: number | null;
          total_waste_cost: number | null;
          potential_circular_revenue: number | null;
          net_circular_value: number | null;
          carbon_emissions: number | null;
          carbon_saved_potential: number | null;
          emission_intensity: number | null;
          industry_percentile: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          period: string;
          mci_score?: number | null;
          waste_to_value_ratio?: number | null;
          landfill_diversion_percentage?: number | null;
          total_input_volume?: number | null;
          total_output_volume?: number | null;
          total_waste_volume?: number | null;
          total_waste_cost?: number | null;
          potential_circular_revenue?: number | null;
          net_circular_value?: number | null;
          carbon_emissions?: number | null;
          carbon_saved_potential?: number | null;
          emission_intensity?: number | null;
          industry_percentile?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          period?: string;
          mci_score?: number | null;
          waste_to_value_ratio?: number | null;
          landfill_diversion_percentage?: number | null;
          total_input_volume?: number | null;
          total_output_volume?: number | null;
          total_waste_volume?: number | null;
          total_waste_cost?: number | null;
          potential_circular_revenue?: number | null;
          net_circular_value?: number | null;
          carbon_emissions?: number | null;
          carbon_saved_potential?: number | null;
          emission_intensity?: number | null;
          industry_percentile?: number | null;
          created_at?: string;
        };
      };
    };
  };
}
