-- ==============================================================================
-- DEFESAI ROW LEVEL SECURITY & POLICIES
-- Migration: 20260816000007_rls_policies.sql
-- Princípio: usuário acessa somente os próprios dados; admin via role; service_role p/ backend
-- ==============================================================================

-- ==============================================================================
-- 0. HELPER FUNCTIONS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
    SELECT auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
$$;

-- ==============================================================================
-- 1. KNOWLEDGE BASE (service_role full; authenticated leitura de ativos)
-- ==============================================================================
ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_ingestions ENABLE ROW LEVEL SECURITY;

-- service_role: acesso total (backend vector-store / ingestion CLI)
CREATE POLICY "knowledge_sources_service_full" ON public.knowledge_sources
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "knowledge_documents_service_full" ON public.knowledge_documents
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "knowledge_document_versions_service_full" ON public.knowledge_document_versions
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "knowledge_chunks_service_full" ON public.knowledge_chunks
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "knowledge_embeddings_service_full" ON public.knowledge_embeddings
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "knowledge_ingestions_service_full" ON public.knowledge_ingestions
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- authenticated: leitura de fontes ativas e documentos publicados (RAG em app)
CREATE POLICY "knowledge_sources_auth_read" ON public.knowledge_sources
    FOR SELECT TO authenticated USING (is_active = TRUE);
CREATE POLICY "knowledge_documents_auth_read" ON public.knowledge_documents
    FOR SELECT TO authenticated USING (status = 'ACTIVE');
CREATE POLICY "knowledge_document_versions_auth_read" ON public.knowledge_document_versions
    FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "knowledge_chunks_auth_read" ON public.knowledge_chunks
    FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "knowledge_embeddings_auth_read" ON public.knowledge_embeddings
    FOR SELECT TO authenticated USING (TRUE);

-- ==============================================================================
-- 2. USER PROFILES
-- ==============================================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_profiles_own_select" ON public.user_profiles
    FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "user_profiles_own_insert" ON public.user_profiles
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_profiles_own_update" ON public.user_profiles
    FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "user_profiles_service_full" ON public.user_profiles
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 3. CASES
-- ==============================================================================
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cases_own_all" ON public.cases
    FOR ALL TO authenticated USING (user_id = auth.uid() OR public.is_admin()) WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "cases_service_full" ON public.cases
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 4. APP SETTINGS (públicas somente is_public; escrita admin/service_role)
-- ==============================================================================
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "app_settings_public_read" ON public.app_settings
    FOR SELECT TO anon, authenticated USING (is_public = TRUE);
CREATE POLICY "app_settings_admin_write" ON public.app_settings
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "app_settings_service_full" ON public.app_settings
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 5. NOTIFICATIONS
-- ==============================================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_own_all" ON public.notifications
    FOR ALL TO authenticated USING (user_id = auth.uid() OR public.is_admin()) WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "notifications_service_full" ON public.notifications
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 6. SERVICE PRICINGS (leitura pública dos ativos; escrita admin/service_role)
-- ==============================================================================
ALTER TABLE public.service_pricings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_pricings_public_read" ON public.service_pricings
    FOR SELECT TO anon, authenticated USING (is_active = TRUE);
CREATE POLICY "service_pricings_admin_write" ON public.service_pricings
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "service_pricings_service_full" ON public.service_pricings
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 7. PROMOTION CAMPAIGNS
-- ==============================================================================
ALTER TABLE public.promotion_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "promotion_campaigns_public_read" ON public.promotion_campaigns
    FOR SELECT TO anon, authenticated USING (status IN ('active', 'scheduled'));
CREATE POLICY "promotion_campaigns_admin_write" ON public.promotion_campaigns
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "promotion_campaigns_service_full" ON public.promotion_campaigns
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 8. COUPONS (leitura pública dos ativos; escrita admin/service_role)
-- ==============================================================================
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coupons_public_read" ON public.coupons
    FOR SELECT TO anon, authenticated USING (is_active = TRUE);
CREATE POLICY "coupons_admin_write" ON public.coupons
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "coupons_service_full" ON public.coupons
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 9. BONUS LEDGER (usuário vê apenas o próprio saldo; admin/service_role full)
-- ==============================================================================
ALTER TABLE public.bonus_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bonus_ledger_own_select" ON public.bonus_ledger
    FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "bonus_ledger_admin_insert" ON public.bonus_ledger
    FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "bonus_ledger_service_full" ON public.bonus_ledger
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 10. REFERRAL CONFIG (singleton — leitura authenticated; escrita admin/service_role)
-- ==============================================================================
ALTER TABLE public.referral_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referral_config_auth_read" ON public.referral_config
    FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "referral_config_admin_write" ON public.referral_config
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "referral_config_service_full" ON public.referral_config
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 11. REFERRAL RELATIONS (usuário vê relações em que é referrer ou referred)
-- ==============================================================================
ALTER TABLE public.referral_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referral_relations_own_select" ON public.referral_relations
    FOR SELECT TO authenticated USING (referrer_id = auth.uid() OR referred_id = auth.uid() OR public.is_admin());
CREATE POLICY "referral_relations_service_all" ON public.referral_relations
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "referral_relations_admin_insert" ON public.referral_relations
    FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- ==============================================================================
-- 12. COMMISSION LEDGER (beneficiário vê as próprias comissões)
-- ==============================================================================
ALTER TABLE public.commission_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "commission_ledger_own_select" ON public.commission_ledger
    FOR SELECT TO authenticated USING (beneficiary_id = auth.uid() OR public.is_admin());
CREATE POLICY "commission_ledger_service_full" ON public.commission_ledger
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 13. COMMERCIAL AUDIT LOG (append-only; service_role full; admin read)
-- ==============================================================================
ALTER TABLE public.commercial_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "commercial_audit_admin_read" ON public.commercial_audit_log
    FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "commercial_audit_service_full" ON public.commercial_audit_log
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 14. PAYMENT ORDERS (usuário vê os próprios pedidos; admin/service_role full)
-- ==============================================================================
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payment_orders_own_select" ON public.payment_orders
    FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "payment_orders_service_full" ON public.payment_orders
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "payment_orders_own_insert" ON public.payment_orders
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- ==============================================================================
-- 15. PAYMENT WEBHOOK EVENTS (append-only; service_role somente)
-- ==============================================================================
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payment_webhook_events_service_full" ON public.payment_webhook_events
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "payment_webhook_events_admin_read" ON public.payment_webhook_events
    FOR SELECT TO authenticated USING (public.is_admin());

-- ==============================================================================
-- 16. META ACCOUNTS (usuário vê a própria conexão; tokens ocultos de anon)
-- ==============================================================================
ALTER TABLE public.meta_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meta_accounts_own_select" ON public.meta_accounts
    FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "meta_accounts_own_write" ON public.meta_accounts
    FOR ALL TO authenticated USING (user_id = auth.uid() OR public.is_admin()) WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "meta_accounts_service_full" ON public.meta_accounts
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 17. EDITORIAL CONTENT (leitura pública; escrita admin/service_role)
-- ==============================================================================
ALTER TABLE public.editorial_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "editorial_content_public_read" ON public.editorial_content
    FOR SELECT TO anon, authenticated USING (status IN ('aprovado_qualidade', 'agendado', 'publicado'));
CREATE POLICY "editorial_content_admin_write" ON public.editorial_content
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "editorial_content_service_full" ON public.editorial_content
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 18. MARKETING CAMPAIGNS
-- ==============================================================================
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "marketing_campaigns_public_read" ON public.marketing_campaigns
    FOR SELECT TO anon, authenticated USING (status = 'active');
CREATE POLICY "marketing_campaigns_admin_write" ON public.marketing_campaigns
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "marketing_campaigns_service_full" ON public.marketing_campaigns
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 19. AUDIT LOGS (append-only; service_role full; admin read)
-- ==============================================================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_admin_read" ON public.audit_logs
    FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "audit_logs_service_full" ON public.audit_logs
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 20. PLATFORM EVENTS
-- ==============================================================================
ALTER TABLE public.platform_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "platform_events_service_full" ON public.platform_events
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "platform_events_own_read" ON public.platform_events
    FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

-- ==============================================================================
-- 21. AI EXECUTION LOGS (service_role full; admin read)
-- ==============================================================================
ALTER TABLE public.ai_execution_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_execution_logs_admin_read" ON public.ai_execution_logs
    FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "ai_execution_logs_service_full" ON public.ai_execution_logs
    FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- 22. GRANTS COMPLEMENTARES (segurança em profundidade)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON public.knowledge_sources, public.knowledge_documents,
    public.knowledge_document_versions, public.knowledge_chunks,
    public.knowledge_embeddings, public.knowledge_ingestions,
    public.service_pricings, public.promotion_campaigns, public.coupons,
    public.editorial_content, public.marketing_campaigns
    TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.match_knowledge_chunks(vector, float, int, text, text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.emit_event(text, text, text, uuid, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.current_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
