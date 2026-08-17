-- ==============================================================================
-- DEFESAI COMMERCIAL DOMAIN SCHEMA
-- Migration: 20260816000003_commercial_domain.sql
-- Domains: Service Pricing | Promotions | Coupons | Bonus Ledger |
--          Referrals (3 níveis) | Commission Ledger | Commercial Audit
-- ==============================================================================

-- ==============================================================================
-- 1. SERVICE PRICINGS (Preços por serviço com histórico de alterações)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.service_pricings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type TEXT NOT NULL CHECK (service_type IN (
        'recurso_multa', 'suspensao', 'cassacao', 'indicacao_condutor',
        'conversao_advertencia', 'analise_tecnica', 'recurso_jari',
        'recurso_cetran', 'geracao_documento'
    )),
    service_name TEXT NOT NULL,
    description TEXT,
    standard_price NUMERIC(10,2) NOT NULL CHECK (standard_price >= 0),
    promotional_price NUMERIC(10,2) CHECK (promotional_price IS NULL OR promotional_price >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    history JSONB NOT NULL DEFAULT '[]'::jsonb, -- PriceHistoryEntry[]
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT NOT NULL DEFAULT 'system',
    CONSTRAINT uq_service_pricings_type UNIQUE (service_type)
);

-- ==============================================================================
-- 2. PROMOTION CAMPAIGNS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.promotion_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'special_price', 'first_purchase')),
    discount_value NUMERIC(10,2) NOT NULL DEFAULT 0,
    applicable_services TEXT[] NOT NULL DEFAULT '{all}', -- ['all'] ou tipos específicos
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    usage_limit INTEGER NOT NULL DEFAULT 0, -- 0 = ilimitado
    usage_count INTEGER NOT NULL DEFAULT 0,
    user_usage_limit INTEGER NOT NULL DEFAULT 1,
    promo_code TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('active', 'scheduled', 'expired', 'paused')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_promotion_dates CHECK (end_date > start_date)
);

-- ==============================================================================
-- 3. COUPONS (com histórico de uso)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_value NUMERIC(10,2),
    max_discount_amount NUMERIC(10,2),
    applicable_services TEXT[] NOT NULL DEFAULT '{all}',
    total_limit INTEGER NOT NULL DEFAULT 0, -- 0 = ilimitado
    used_count INTEGER NOT NULL DEFAULT 0,
    user_limit INTEGER NOT NULL DEFAULT 1,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    usage_history JSONB NOT NULL DEFAULT '[]'::jsonb, -- CouponUsageLog[]
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_coupon_dates CHECK (valid_until > valid_from)
);

-- ==============================================================================
-- 4. BONUS LEDGER (Créditos/bônus do usuário com saldo após cada movimentação)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bonus_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('CREDIT', 'DEBIT', 'EXPIRATION', 'REVERSAL', 'ADJUSTMENT')),
    amount NUMERIC(10,2) NOT NULL,
    origin TEXT NOT NULL CHECK (origin IN (
        'signup', 'referral', 'campaign', 'manual_adjustment', 'checkout_redemption', 'refund_reversal'
    )),
    reason TEXT,
    reference_id TEXT, -- Order / Payment / Referral ID
    admin_author TEXT,
    balance_after NUMERIC(10,2) NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bonus_ledger_user ON public.bonus_ledger(user_id, created_at DESC);

-- ==============================================================================
-- 5. REFERRAL RULES (Configuração canônica do programa de indicações — singleton)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.referral_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- singleton
    level1_percent NUMERIC(5,2) NOT NULL DEFAULT 10,
    level2_percent NUMERIC(5,2) NOT NULL DEFAULT 5,
    level3_percent NUMERIC(5,2) NOT NULL DEFAULT 2,
    calculation_base TEXT NOT NULL DEFAULT 'effectively_paid' CHECK (calculation_base IN (
        'gross_amount', 'net_amount', 'after_discount', 'effectively_paid'
    )),
    payout_delay_days INTEGER NOT NULL DEFAULT 7,
    min_withdrawal_amount NUMERIC(10,2) NOT NULL DEFAULT 20,
    signup_bonus_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    referrer_bonus_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    is_program_active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT NOT NULL DEFAULT 'system'
);

-- ==============================================================================
-- 6. REFERRAL RELATIONS (Árvore de indicações — até 3 níveis)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.referral_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    level SMALLINT NOT NULL CHECK (level BETWEEN 1 AND 3),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'BLOCKED', 'REVERSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_referral_relation UNIQUE (referrer_id, referred_id, level),
    CONSTRAINT chk_referral_not_self CHECK (referrer_id <> referred_id)
);

CREATE INDEX IF NOT EXISTS idx_referral_referrer ON public.referral_relations(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_referred ON public.referral_relations(referred_id);

-- ==============================================================================
-- 7. COMMISSION LEDGER (Comissões por nível, congeladas no momento da venda)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.commission_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    buyer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    level SMALLINT NOT NULL CHECK (level BETWEEN 1 AND 3),
    applied_percent NUMERIC(5,2) NOT NULL,
    base_amount NUMERIC(10,2) NOT NULL,
    commission_amount NUMERIC(10,2) NOT NULL,
    payment_id UUID,
    case_id UUID,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'AVAILABLE', 'PAID', 'REVERSED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    available_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    reversed_at TIMESTAMPTZ,
    reversal_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_commission_beneficiary ON public.commission_ledger(beneficiary_id, status);
CREATE INDEX IF NOT EXISTS idx_commission_buyer ON public.commission_ledger(buyer_user_id);

-- ==============================================================================
-- 8. COMMERCIAL AUDIT LOG (Trilha imutável de ações comerciais)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.commercial_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL CHECK (action IN (
        'PRICE_CHANGE', 'PROMO_CHANGE', 'COUPON_CHANGE', 'BONUS_CREDIT',
        'BONUS_ADJUSTMENT', 'REFERRAL_CONFIG_CHANGE', 'COMMISSION_PAYOUT', 'COMMISSION_REVERSAL'
    )),
    changed_by TEXT NOT NULL,
    target TEXT NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    reason TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commercial_audit_ts ON public.commercial_audit_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_commercial_audit_action ON public.commercial_audit_log(action);

-- ==============================================================================
-- 9. TRIGGERS updated_at
-- ==============================================================================
DROP TRIGGER IF EXISTS trg_service_pricings_updated ON public.service_pricings;
CREATE TRIGGER trg_service_pricings_updated
BEFORE UPDATE ON public.service_pricings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_promotion_campaigns_updated ON public.promotion_campaigns;
CREATE TRIGGER trg_promotion_campaigns_updated
BEFORE UPDATE ON public.promotion_campaigns
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_coupons_updated ON public.coupons;
CREATE TRIGGER trg_coupons_updated
BEFORE UPDATE ON public.coupons
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_referral_config_updated ON public.referral_config;
CREATE TRIGGER trg_referral_config_updated
BEFORE UPDATE ON public.referral_config
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
