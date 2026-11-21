-- ==============================================================================
-- MIGRATION: 20261121000001_zus_core_schema.sql
-- PROJECT: Zasiłkowy Przewodnik Przyszłego Rodzica (HackNation ZUS 2026)
-- DESCRIPTION: Core Database Schema with RLS, Foreign Key Indexes, and Triggers
-- ==============================================================================

-- 1. Rozszerzenia UUID i Crypto
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Funkcja wyzwalacza aktualizująca updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- TABELA 1: legislative_parameters
-- Przechowuje wersjonowane wskaźniki prawne, stawki procentowe i limity ZUS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.legislative_parameters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(32) NOT NULL UNIQUE,
    effective_from DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,

    -- Wskaźniki płacowe i składkowe
    minimum_wage_gross NUMERIC(10, 2) NOT NULL DEFAULT 4806.00,
    employee_deduction_rate NUMERIC(6, 4) NOT NULL DEFAULT 0.1371,
    debt_threshold_pct NUMERIC(6, 4) NOT NULL DEFAULT 0.0100,
    jdg_max_contribution_base NUMERIC(10, 2) NOT NULL DEFAULT 23550.00,
    funeral_benefit_amount NUMERIC(10, 2) NOT NULL DEFAULT 7000.00,

    -- Stawki procentowe świadczeń
    maternity_standard_rate NUMERIC(6, 4) NOT NULL DEFAULT 1.0000,
    parental_standard_rate NUMERIC(6, 4) NOT NULL DEFAULT 0.7000,
    unified_long_rate NUMERIC(6, 4) NOT NULL DEFAULT 0.8150,
    dad_reserved_rate NUMERIC(6, 4) NOT NULL DEFAULT 0.7000,
    supplementary_preterm_rate NUMERIC(6, 4) NOT NULL DEFAULT 1.0000,
    paternity_rate NUMERIC(6, 4) NOT NULL DEFAULT 1.0000,
    care_allowance_rate NUMERIC(6, 4) NOT NULL DEFAULT 0.8000,
    pregnancy_sick_rate NUMERIC(6, 4) NOT NULL DEFAULT 1.0000,

    -- Wymiary tygodniowe urlopów
    maternity_single_weeks INT NOT NULL DEFAULT 20,
    maternity_twins_weeks INT NOT NULL DEFAULT 31,
    maternity_triplets_weeks INT NOT NULL DEFAULT 33,
    maternity_quadruplets_weeks INT NOT NULL DEFAULT 35,
    maternity_quintuplets_weeks INT NOT NULL DEFAULT 37,
    maternity_mandatory_mother_weeks INT NOT NULL DEFAULT 14,

    parental_single_weeks INT NOT NULL DEFAULT 41,
    parental_multi_weeks INT NOT NULL DEFAULT 43,
    parental_life_single_weeks INT NOT NULL DEFAULT 65,
    parental_life_multi_weeks INT NOT NULL DEFAULT 67,
    parental_reserved_dad_weeks INT NOT NULL DEFAULT 9,

    preterm_max_weeks_early INT NOT NULL DEFAULT 15,
    preterm_max_weeks_standard INT NOT NULL DEFAULT 8,

    -- Terminy i okresy wyczekiwania (dni / miesiące)
    waiting_period_uop_days INT NOT NULL DEFAULT 30,
    waiting_period_other_days INT NOT NULL DEFAULT 90,
    long_app_deadline_days INT NOT NULL DEFAULT 21,
    debt_grace_period_months INT NOT NULL DEFAULT 6,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indeks na aktywną konfigurację
CREATE INDEX IF NOT EXISTS idx_legislative_params_active 
    ON public.legislative_parameters(is_active) 
    WHERE is_active = true;

-- Wyzwalacz updated_at dla legislative_parameters
DROP TRIGGER IF EXISTS trigger_update_legislative_parameters ON public.legislative_parameters;
CREATE TRIGGER trigger_update_legislative_parameters
    BEFORE UPDATE ON public.legislative_parameters
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- TABELA 2: audit_config_logs
-- Rejestr audytowy zmian parametrów dokonywanych w Panelu Administratora ZUS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_config_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parameter_id UUID NOT NULL REFERENCES public.legislative_parameters(id) ON DELETE CASCADE,
    changed_by_email VARCHAR(255) NOT NULL,
    old_values JSONB NOT NULL,
    new_values JSONB NOT NULL,
    change_reason TEXT NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indeks klucza obcego (Reguła wydajnościowa supabase-postgres-splinter)
CREATE INDEX IF NOT EXISTS idx_audit_config_param_id 
    ON public.audit_config_logs(parameter_id);

CREATE INDEX IF NOT EXISTS idx_audit_config_changed_at 
    ON public.audit_config_logs(changed_at DESC);

-- ==============================================================================
-- TABELA 3: zus_test_cases
-- Oficjalne kazusy testowe ZUS dla Strefy Jurora (Jury Sandbox) i testów E2E
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.zus_test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_code VARCHAR(32) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    input_data JSONB NOT NULL,
    expected_output JSONB NOT NULL,
    pdf_fixture_url TEXT,
    is_seeded BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indeksy dla szybkiego wyszukiwania kazusów
CREATE INDEX IF NOT EXISTS idx_zus_test_cases_code 
    ON public.zus_test_cases(case_code);

CREATE INDEX IF NOT EXISTS idx_zus_test_cases_category 
    ON public.zus_test_cases(category);

-- Wyzwalacz updated_at dla zus_test_cases
DROP TRIGGER IF EXISTS trigger_update_zus_test_cases ON public.zus_test_cases;
CREATE TRIGGER trigger_update_zus_test_cases
    BEFORE UPDATE ON public.zus_test_cases
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- TABELA 4: benefit_calculation_history
-- Anonimowe sesje kalkulacji i historia symulacji rodziców
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.benefit_calculation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token VARCHAR(64) NOT NULL,
    parameter_id UUID REFERENCES public.legislative_parameters(id) ON DELETE SET NULL,
    calculation_input JSONB NOT NULL,
    calculation_output JSONB NOT NULL,
    client_ip_hash VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indeks klucza obcego i indeksy wyszukiwania sesji
CREATE INDEX IF NOT EXISTS idx_calc_history_parameter_id 
    ON public.benefit_calculation_history(parameter_id);

CREATE INDEX IF NOT EXISTS idx_calc_history_session_token 
    ON public.benefit_calculation_history(session_token);

CREATE INDEX IF NOT EXISTS idx_calc_history_created_at 
    ON public.benefit_calculation_history(created_at DESC);

-- Wyzwalacz updated_at dla benefit_calculation_history
DROP TRIGGER IF EXISTS trigger_update_benefit_calculation_history ON public.benefit_calculation_history;
CREATE TRIGGER trigger_update_benefit_calculation_history
    BEFORE UPDATE ON public.benefit_calculation_history
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- WIDOKI KOMPATYBILNOŚCI WSTECZNEJ DLA ARCHITECTURE.md
-- ==============================================================================
CREATE OR REPLACE VIEW public.jury_pdf_test_cases AS
    SELECT * FROM public.zus_test_cases;

CREATE OR REPLACE VIEW public.user_simulation_sessions AS
    SELECT 
        id, 
        session_token, 
        calculation_input AS simulation_state, 
        updated_at AS last_active_at, 
        created_at 
    FROM public.benefit_calculation_history;

-- ==============================================================================
-- BEZPIECZEŃSTWO: WŁĄCZENIE ROW LEVEL SECURITY (RLS) NA KAŻDEJ TABELI
-- ==============================================================================
ALTER TABLE public.legislative_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_config_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zus_test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benefit_calculation_history ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- JAWNE POLITYKI RLS (SELECT, INSERT, UPDATE) DLA KAŻDEJ TABELI
-- ==============================================================================

-- 1. Polityki dla legislative_parameters:
DROP POLICY IF EXISTS "legislative_params_select_policy" ON public.legislative_parameters;
CREATE POLICY "legislative_params_select_policy" 
    ON public.legislative_parameters 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "legislative_params_insert_policy" ON public.legislative_parameters;
CREATE POLICY "legislative_params_insert_policy" 
    ON public.legislative_parameters 
    FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "legislative_params_update_policy" ON public.legislative_parameters;
CREATE POLICY "legislative_params_update_policy" 
    ON public.legislative_parameters 
    FOR UPDATE 
    USING (true) 
    WITH CHECK (true);

-- 2. Polityki dla audit_config_logs:
DROP POLICY IF EXISTS "audit_logs_select_policy" ON public.audit_config_logs;
CREATE POLICY "audit_logs_select_policy" 
    ON public.audit_config_logs 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "audit_logs_insert_policy" ON public.audit_config_logs;
CREATE POLICY "audit_logs_insert_policy" 
    ON public.audit_config_logs 
    FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "audit_logs_update_policy" ON public.audit_config_logs;
CREATE POLICY "audit_logs_update_policy" 
    ON public.audit_config_logs 
    FOR UPDATE 
    USING (true) 
    WITH CHECK (true);

-- 3. Polityki dla zus_test_cases:
DROP POLICY IF EXISTS "zus_cases_select_policy" ON public.zus_test_cases;
CREATE POLICY "zus_cases_select_policy" 
    ON public.zus_test_cases 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "zus_cases_insert_policy" ON public.zus_test_cases;
CREATE POLICY "zus_cases_insert_policy" 
    ON public.zus_test_cases 
    FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "zus_cases_update_policy" ON public.zus_test_cases;
CREATE POLICY "zus_cases_update_policy" 
    ON public.zus_test_cases 
    FOR UPDATE 
    USING (true) 
    WITH CHECK (true);

-- 4. Polityki dla benefit_calculation_history:
DROP POLICY IF EXISTS "benefit_calc_select_policy" ON public.benefit_calculation_history;
CREATE POLICY "benefit_calc_select_policy" 
    ON public.benefit_calculation_history 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "benefit_calc_insert_policy" ON public.benefit_calculation_history;
CREATE POLICY "benefit_calc_insert_policy" 
    ON public.benefit_calculation_history 
    FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "benefit_calc_update_policy" ON public.benefit_calculation_history;
CREATE POLICY "benefit_calc_update_policy" 
    ON public.benefit_calculation_history 
    FOR UPDATE 
    USING (true) 
    WITH CHECK (true);
