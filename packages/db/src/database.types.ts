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
      legislative_parameters: {
        Row: {
          id: string;
          version: string;
          effective_from: string;
          is_active: boolean;
          minimum_wage_gross: number;
          employee_deduction_rate: number;
          debt_threshold_pct: number;
          jdg_max_contribution_base: number;
          funeral_benefit_amount: number;
          maternity_standard_rate: number;
          parental_standard_rate: number;
          unified_long_rate: number;
          dad_reserved_rate: number;
          supplementary_preterm_rate: number;
          paternity_rate: number;
          care_allowance_rate: number;
          pregnancy_sick_rate: number;
          maternity_single_weeks: number;
          maternity_twins_weeks: number;
          maternity_triplets_weeks: number;
          maternity_quadruplets_weeks: number;
          maternity_quintuplets_weeks: number;
          maternity_mandatory_mother_weeks: number;
          parental_single_weeks: number;
          parental_multi_weeks: number;
          parental_life_single_weeks: number;
          parental_life_multi_weeks: number;
          parental_reserved_dad_weeks: number;
          preterm_max_weeks_early: number;
          preterm_max_weeks_standard: number;
          waiting_period_uop_days: number;
          waiting_period_other_days: number;
          long_app_deadline_days: number;
          debt_grace_period_months: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          version: string;
          effective_from: string;
          is_active?: boolean;
          minimum_wage_gross?: number;
          employee_deduction_rate?: number;
          debt_threshold_pct?: number;
          jdg_max_contribution_base?: number;
          funeral_benefit_amount?: number;
          maternity_standard_rate?: number;
          parental_standard_rate?: number;
          unified_long_rate?: number;
          dad_reserved_rate?: number;
          supplementary_preterm_rate?: number;
          paternity_rate?: number;
          care_allowance_rate?: number;
          pregnancy_sick_rate?: number;
          maternity_single_weeks?: number;
          maternity_twins_weeks?: number;
          maternity_triplets_weeks?: number;
          maternity_quadruplets_weeks?: number;
          maternity_quintuplets_weeks?: number;
          maternity_mandatory_mother_weeks?: number;
          parental_single_weeks?: number;
          parental_multi_weeks?: number;
          parental_life_single_weeks?: number;
          parental_life_multi_weeks?: number;
          parental_reserved_dad_weeks?: number;
          preterm_max_weeks_early?: number;
          preterm_max_weeks_standard?: number;
          waiting_period_uop_days?: number;
          waiting_period_other_days?: number;
          long_app_deadline_days?: number;
          debt_grace_period_months?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          version?: string;
          effective_from?: string;
          is_active?: boolean;
          minimum_wage_gross?: number;
          employee_deduction_rate?: number;
          debt_threshold_pct?: number;
          jdg_max_contribution_base?: number;
          funeral_benefit_amount?: number;
          maternity_standard_rate?: number;
          parental_standard_rate?: number;
          unified_long_rate?: number;
          dad_reserved_rate?: number;
          supplementary_preterm_rate?: number;
          paternity_rate?: number;
          care_allowance_rate?: number;
          pregnancy_sick_rate?: number;
          maternity_single_weeks?: number;
          maternity_twins_weeks?: number;
          maternity_triplets_weeks?: number;
          maternity_quadruplets_weeks?: number;
          maternity_quintuplets_weeks?: number;
          maternity_mandatory_mother_weeks?: number;
          parental_single_weeks?: number;
          parental_multi_weeks?: number;
          parental_life_single_weeks?: number;
          parental_life_multi_weeks?: number;
          parental_reserved_dad_weeks?: number;
          preterm_max_weeks_early?: number;
          preterm_max_weeks_standard?: number;
          waiting_period_uop_days?: number;
          waiting_period_other_days?: number;
          long_app_deadline_days?: number;
          debt_grace_period_months?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_config_logs: {
        Row: {
          id: string;
          parameter_id: string;
          changed_by_email: string;
          old_values: Json;
          new_values: Json;
          change_reason: string;
          changed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          parameter_id: string;
          changed_by_email: string;
          old_values: Json;
          new_values: Json;
          change_reason: string;
          changed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          parameter_id?: string;
          changed_by_email?: string;
          old_values?: Json;
          new_values?: Json;
          change_reason?: string;
          changed_at?: string;
          created_at?: string;
        };
      };
      zus_test_cases: {
        Row: {
          id: string;
          case_code: string;
          title: string;
          category: string;
          description: string;
          input_data: Json;
          expected_output: Json;
          pdf_fixture_url: string | null;
          is_seeded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          case_code: string;
          title: string;
          category: string;
          description: string;
          input_data: Json;
          expected_output: Json;
          pdf_fixture_url?: string | null;
          is_seeded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          case_code?: string;
          title?: string;
          category?: string;
          description?: string;
          input_data?: Json;
          expected_output?: Json;
          pdf_fixture_url?: string | null;
          is_seeded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      benefit_calculation_history: {
        Row: {
          id: string;
          session_token: string;
          parameter_id: string | null;
          calculation_input: Json;
          calculation_output: Json;
          client_ip_hash: string | null;
          user_agent: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_token: string;
          parameter_id?: string | null;
          calculation_input: Json;
          calculation_output: Json;
          client_ip_hash?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_token?: string;
          parameter_id?: string | null;
          calculation_input?: Json;
          calculation_output?: Json;
          client_ip_hash?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      jury_pdf_test_cases: {
        Row: {
          id: string;
          case_code: string;
          title: string;
          category: string;
          description: string;
          input_data: Json;
          expected_output: Json;
          pdf_fixture_url: string | null;
          is_seeded: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      user_simulation_sessions: {
        Row: {
          id: string;
          session_token: string;
          simulation_state: Json;
          last_active_at: string;
          created_at: string;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type LegislativeParametersRow = Tables<'legislative_parameters'>;
export type LegislativeParametersInsert = Inserts<'legislative_parameters'>;
export type LegislativeParametersUpdate = Updates<'legislative_parameters'>;

export type AuditConfigLogRow = Tables<'audit_config_logs'>;
export type AuditConfigLogInsert = Inserts<'audit_config_logs'>;
export type AuditConfigLogUpdate = Updates<'audit_config_logs'>;

export type ZusTestCaseRow = Tables<'zus_test_cases'>;
export type ZusTestCaseInsert = Inserts<'zus_test_cases'>;
export type ZusTestCaseUpdate = Updates<'zus_test_cases'>;

export type BenefitCalculationHistoryRow = Tables<'benefit_calculation_history'>;
export type BenefitCalculationHistoryInsert = Inserts<'benefit_calculation_history'>;
export type BenefitCalculationHistoryUpdate = Updates<'benefit_calculation_history'>;
