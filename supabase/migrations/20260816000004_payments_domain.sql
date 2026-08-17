-- ==============================================================================
-- DEFESAI PAYMENTS DOMAIN SCHEMA
-- Migration: 20260816000004_payments_domain.sql
-- Domains: Payment Orders | Payment Webhook Events (idempotência PagBank)
-- ==============================================================================

-- ==============================================================================
-- 1. PAYMENT ORDERS (Pedidos de pagamento via PagBank)
-- Espelha PagBankOrderResponse e o estado persistido do checkout
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Referências externas (PagBank)
    reference_id TEXT,             -- ID interno enviado ao PagBank como reference
    pagbank_order_id TEXT,         -- ID da ordem criada no PagBank
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'CANCELED', 'DECLINED', 'REFUNDED')),

    -- Valores
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    currency TEXT NOT NULL DEFAULT 'BRL',
    payment_method TEXT CHECK (payment_method IN ('pix', 'credit_card', 'boleto')),

    -- Pix (QR Code)
    qr_code_url TEXT,
    qr_code_text TEXT,
    qr_code_data_url TEXT,

    -- Breakdown comercial aplicado no momento do checkout
    base_amount NUMERIC(10,2),
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount_type TEXT,
    coupon_code TEXT,
    bonus_used_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    final_amount NUMERIC(10,2) NOT NULL DEFAULT 0,

    -- Timestamps
    expires_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_payment_orders_case UNIQUE (case_id)
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_user ON public.payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON public.payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_payment_orders_pagbank ON public.payment_orders(pagbank_order_id) WHERE pagbank_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payment_orders_created ON public.payment_orders(created_at DESC);

-- ==============================================================================
-- 2. PAYMENT WEBHOOK EVENTS (Eventos recebidos do PagBank — append-only e idempotente)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_order_id UUID REFERENCES public.payment_orders(id) ON DELETE CASCADE,

    -- Idempotência: identidade do evento vinda do PagBank
    pagbank_event_id TEXT UNIQUE,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Processamento
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    processing_error TEXT,
    attempts INTEGER NOT NULL DEFAULT 0,

    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_order ON public.payment_webhook_events(payment_order_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON public.payment_webhook_events(processed, received_at) WHERE processed = FALSE;

-- ==============================================================================
-- 3. TRIGGER updated_at
-- ==============================================================================
DROP TRIGGER IF EXISTS trg_payment_orders_updated ON public.payment_orders;
CREATE TRIGGER trg_payment_orders_updated
BEFORE UPDATE ON public.payment_orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
