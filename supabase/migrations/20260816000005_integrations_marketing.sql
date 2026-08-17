-- ==============================================================================
-- DEFESAI INTEGRATIONS & MARKETING SCHEMA
-- Migration: 20260816000005_integrations_marketing.sql
-- Domains: Meta (Facebook/Instagram) | Editorial Content | Marketing Campaigns
-- ==============================================================================

-- ==============================================================================
-- 1. META ACCOUNTS (Conexão Facebook/Instagram do usuário)
-- Tokens NUNCA expostos ao frontend (coluna protegida por RLS service_role)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.meta_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Estado da conexão
    is_connected BOOLEAN NOT NULL DEFAULT FALSE,
    meta_user_id TEXT,
    meta_user_name TEXT,
    meta_user_email TEXT,

    -- Páginas e contas conectadas (sem tokens no jsonb público)
    pages JSONB NOT NULL DEFAULT '[]'::jsonb,
    selected_page_id TEXT,
    selected_instagram_id TEXT,

    -- Tokens (apenas service_role / admin)
    access_token TEXT,
    token_expires_at TIMESTAMPTZ,

    connected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_meta_accounts_user UNIQUE (user_id)
);

-- ==============================================================================
-- 2. EDITORIAL CONTENT (Conteúdo gerado pelos agentes de marketing)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.editorial_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('instagram', 'blog', 'tiktok', 'linkedin', 'email')),
    format TEXT NOT NULL CHECK (format IN ('carrossel', 'artigo_seo', 'reels_roteiro', 'infografico', 'newsletter')),
    legal_theme TEXT,
    infraction_target_code TEXT,
    status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'aprovado_qualidade', 'agendado', 'publicado')),
    scheduled_date TIMESTAMPTZ,
    estimated_reach INTEGER NOT NULL DEFAULT 0,
    copy_text TEXT,
    hashtags TEXT[] NOT NULL DEFAULT '{}',
    visual_prompt TEXT,
    author_agent TEXT NOT NULL DEFAULT 'estrategico',
    quality_review_score NUMERIC(5,2) CHECK (quality_review_score IS NULL OR quality_review_score BETWEEN 0 AND 100),
    meta_post_id TEXT, -- ID da postagem publicada na Meta
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_editorial_status ON public.editorial_content(status, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_editorial_channel ON public.editorial_content(channel);

-- ==============================================================================
-- 3. MARKETING CAMPAIGNS (Campanhas publicitárias e de crescimento)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    channel TEXT NOT NULL DEFAULT 'meta' CHECK (channel IN ('meta', 'google', 'email', 'organic', 'referral', 'other')),
    budget NUMERIC(12,2),
    spent NUMERIC(12,2) NOT NULL DEFAULT 0,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    target_audience JSONB NOT NULL DEFAULT '{}'::jsonb,
    metrics JSONB NOT NULL DEFAULT '{}'::jsonb, -- {impressions, clicks, conversions, ctr, roas}
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_campaign_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.marketing_campaigns(status);

-- ==============================================================================
-- 4. TRIGGERS updated_at
-- ==============================================================================
DROP TRIGGER IF EXISTS trg_meta_accounts_updated ON public.meta_accounts;
CREATE TRIGGER trg_meta_accounts_updated
BEFORE UPDATE ON public.meta_accounts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_editorial_content_updated ON public.editorial_content;
CREATE TRIGGER trg_editorial_content_updated
BEFORE UPDATE ON public.editorial_content
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_marketing_campaigns_updated ON public.marketing_campaigns;
CREATE TRIGGER trg_marketing_campaigns_updated
BEFORE UPDATE ON public.marketing_campaigns
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
