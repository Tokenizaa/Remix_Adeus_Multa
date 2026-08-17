-- ==============================================================================
-- DEFESAI CORE PLATFORM SCHEMA
-- Migration: 20260816000002_core_platform.sql
-- Domains: User Profiles | Cases | App Settings | Notifications
-- ==============================================================================

-- ==============================================================================
-- 1. USER PROFILES
-- Extensão do auth.users do Supabase com dados de perfil do cidadão
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
    cpf TEXT,
    phone TEXT,
    cnh TEXT,
    city_state TEXT,
    avatar_url TEXT,
    referral_code TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_profiles_user UNIQUE (user_id)
);

-- ==============================================================================
-- 2. CASES (Caso canônico — espelha CaseRow / CaseDomain do código)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Identificação e status
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT,
    client_cpf TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'analisando', 'analisado', 'aguardando_pagamento',
        'gerando_documento', 'defesa_pronta', 'novo', 'aguardando_documentos', 'finalizado'
    )),
    current_stage SMALLINT NOT NULL DEFAULT 1 CHECK (current_stage BETWEEN 1 AND 4),
    service_type TEXT NOT NULL DEFAULT 'analise_tecnica',

    -- Veículo
    vehicle_plate TEXT NOT NULL,
    vehicle_brand_model TEXT NOT NULL,
    vehicle_renavam TEXT,
    vehicle_chassis TEXT,
    vehicle_year TEXT,
    vehicle_color TEXT,

    -- Infração
    ait_number TEXT NOT NULL,
    infraction_code TEXT,
    infraction_description TEXT NOT NULL,
    ctb_article TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'grave' CHECK (severity IN ('leve', 'media', 'grave', 'gravissima')),
    points INTEGER NOT NULL DEFAULT 0,
    fine_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    autuador_body TEXT NOT NULL,
    date_time TIMESTAMPTZ,
    location TEXT,
    speed_limit NUMERIC(7,2),
    measured_speed NUMERIC(7,2),
    considered_speed NUMERIC(7,2),
    radar_equipment_id TEXT,
    inmetro_aferition_date DATE,
    notification_expedition_date DATE,
    defense_deadline TEXT,

    -- Payloads ricos (análise IA, defesa, protocolo, timeline, OCR auxiliar)
    formal_flaws_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    analysis_json JSONB,
    defense_draft_json JSONB,
    protocol_info_json JSONB,
    timeline_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    ocr_auxiliary_json JSONB,

    -- Flags operacionais
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    claim_token TEXT,
    is_paid BOOLEAN NOT NULL DEFAULT FALSE,
    paid_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cases_user ON public.cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON public.cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cases_ait ON public.cases(ait_number);
CREATE INDEX IF NOT EXISTS idx_cases_client_cpf ON public.cases(client_cpf);

-- ==============================================================================
-- 3. APP SETTINGS (Configuração chave-valor por categoria, sem secrets)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    category TEXT NOT NULL DEFAULT 'platform' CHECK (category IN (
        'platform', 'ai', 'pricing', 'promotions', 'referrals',
        'payments', 'marketing', 'integrations', 'feature_flags'
    )),
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT
);

-- ==============================================================================
-- 4. NOTIFICATIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN (
        'case_update', 'analysis_ready', 'payment_pending', 'payment_confirmed',
        'document_ready', 'bonus_credit', 'commission_available', 'system', 'marketing'
    )),
    title TEXT NOT NULL,
    body TEXT,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id) WHERE read_at IS NULL;

-- ==============================================================================
-- 5. TRIGGER: updated_at automático
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_profiles_updated ON public.user_profiles;
CREATE TRIGGER trg_user_profiles_updated
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cases_updated ON public.cases;
CREATE TRIGGER trg_cases_updated
BEFORE UPDATE ON public.cases
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
