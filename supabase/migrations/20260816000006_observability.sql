-- ==============================================================================
-- DEFESAI OBSERVABILITY SCHEMA
-- Migration: 20260816000006_observability.sql
-- Domains: Audit Logs | Platform Events | AI Execution Logs
-- ==============================================================================

-- ==============================================================================
-- 1. AUDIT LOGS (Trilha de auditoria de ações críticas — append-only)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor TEXT NOT NULL,
    actor_role TEXT CHECK (actor_role IN ('citizen', 'legal_ai', 'law_enforcement', 'system_orchestrator', 'admin')),
    action TEXT NOT NULL,
    target_resource TEXT NOT NULL,
    target_id TEXT,
    ip_hash TEXT,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    correlation_id TEXT,
    gdpr_compliant BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_ts ON public.audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON public.audit_logs(target_resource, target_id);

-- ==============================================================================
-- 2. PLATFORM EVENTS (Eventos internos do domínio — bus persistido)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.platform_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL CHECK (event_type IN (
        'case.created', 'case.analysis.started', 'case.analysis.completed',
        'case.document.generated', 'case.payment.pending', 'case.payment.confirmed',
        'user.registered', 'user.login', 'referral.created', 'commission.created',
        'bonus.credited', 'document.downloaded'
    )),
    aggregate_type TEXT, -- 'case', 'user', 'payment', 'referral'
    aggregate_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_events_type ON public.platform_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_events_aggregate ON public.platform_events(aggregate_type, aggregate_id);

-- ==============================================================================
-- 3. AI EXECUTION LOGS (Telemetria de chamadas de IA — provider, modelo, custo)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ai_execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,               -- 'NVIDIA', '9ROUTER', 'GEMINI'
    model TEXT NOT NULL,
    operation TEXT NOT NULL,              -- 'analysis', 'embedding', 'rag_search', 'document_generation'
    case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'cancelled')),
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    latency_ms INTEGER NOT NULL DEFAULT 0,
    cost_estimate NUMERIC(10,6) NOT NULL DEFAULT 0,
    error_message TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_logs_created ON public.ai_execution_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_logs_provider ON public.ai_execution_logs(provider, model);
CREATE INDEX IF NOT EXISTS idx_ai_logs_case ON public.ai_execution_logs(case_id) WHERE case_id IS NOT NULL;

-- ==============================================================================
-- 4. FUNCTION: emit_event (API canônica para registrar eventos de plataforma)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.emit_event(
    p_event_type TEXT,
    p_aggregate_type TEXT DEFAULT NULL,
    p_aggregate_id TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_payload JSONB DEFAULT '{}'::jsonb
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO public.platform_events (event_type, aggregate_type, aggregate_id, user_id, payload)
    VALUES (p_event_type, p_aggregate_type, p_aggregate_id, p_user_id, p_payload)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$;
