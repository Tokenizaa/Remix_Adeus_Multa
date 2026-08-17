-- ==============================================================================
-- DEFESAI RLS PERFORMANCE FIXES (estado real aplicado ao banco)
-- Reescrita das policies com subselects (auth.uid()/is_admin()) para eliminar
-- initplans por linha e consolidação por comando (evita multiple_permissive_policies)
-- + índices parciais para FKs usadas em filtros RLS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Índices parciais para FKs (evitam seq scans em policies / joins frequentes)
-- ------------------------------------------------------------------------------
DROP INDEX IF EXISTS idx_k_documents_current_version;
CREATE INDEX idx_k_documents_current_version
ON public.knowledge_documents USING btree (current_version_id)
WHERE (current_version_id IS NOT NULL);

DROP INDEX IF EXISTS idx_campaigns_created_by;
CREATE INDEX idx_campaigns_created_by
ON public.marketing_campaigns USING btree (created_by)
WHERE (created_by IS NOT NULL);

DROP INDEX IF EXISTS idx_platform_events_user;
CREATE INDEX idx_platform_events_user
ON public.platform_events USING btree (user_id)
WHERE (user_id IS NOT NULL);

-- ==============================================================================
-- KNOWLEDGE BASE (service_role full; authenticated leitura de ativos)
-- ==============================================================================
DROP POLICY IF EXISTS "knowledge_sources_auth_read" ON public.knowledge_sources;
DROP POLICY IF EXISTS "knowledge_sources_service_full" ON public.knowledge_sources;
CREATE POLICY "knowledge_sources_auth_read" ON public.knowledge_sources
    FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "knowledge_sources_service_full" ON public.knowledge_sources
    FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "knowledge_documents_auth_read" ON public.knowledge_documents;
DROP POLICY IF EXISTS "knowledge_documents_service_full" ON public.knowledge_documents;
CREATE POLICY "knowledge_documents_auth_read" ON public.knowledge_documents
    FOR SELECT TO authenticated USING (status = 'ACTIVE');
CREATE POLICY "knowledge_documents_service_full" ON public.knowledge_documents
    FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "knowledge_document_versions_auth_read" ON public.knowledge_document_versions;
DROP POLICY IF EXISTS "knowledge_document_versions_service_full" ON public.knowledge_document_versions;
CREATE POLICY "knowledge_document_versions_auth_read" ON public.knowledge_document_versions
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "knowledge_document_versions_service_full" ON public.knowledge_document_versions
    FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "knowledge_chunks_auth_read" ON public.knowledge_chunks;
DROP POLICY IF EXISTS "knowledge_chunks_service_full" ON public.knowledge_chunks;
CREATE POLICY "knowledge_chunks_auth_read" ON public.knowledge_chunks
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "knowledge_chunks_service_full" ON public.knowledge_chunks
    FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "knowledge_embeddings_auth_read" ON public.knowledge_embeddings;
DROP POLICY IF EXISTS "knowledge_embeddings_service_full" ON public.knowledge_embeddings;
CREATE POLICY "knowledge_embeddings_auth_read" ON public.knowledge_embeddings
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "knowledge_embeddings_service_full" ON public.knowledge_embeddings
    FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "knowledge_ingestions_service_full" ON public.knowledge_ingestions;
CREATE POLICY "knowledge_ingestions_service_full" ON public.knowledge_ingestions
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- USER PROFILES
-- ==============================================================================
DROP POLICY IF EXISTS "user_profiles_own_select" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_own_insert" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_own_update" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_service_full" ON public.user_profiles;
CREATE POLICY "user_profiles_own_select" ON public.user_profiles
    FOR SELECT TO authenticated USING ((user_id = (select auth.uid())) OR (select public.is_admin()));
CREATE POLICY "user_profiles_own_insert" ON public.user_profiles
    FOR INSERT TO authenticated WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "user_profiles_own_update" ON public.user_profiles
    FOR UPDATE TO authenticated USING ((user_id = (select auth.uid())) OR (select public.is_admin()));
CREATE POLICY "user_profiles_service_full" ON public.user_profiles
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- CASES
-- ==============================================================================
DROP POLICY IF EXISTS "cases_own_all" ON public.cases;
DROP POLICY IF EXISTS "cases_service_full" ON public.cases;
CREATE POLICY "cases_own_all" ON public.cases
    FOR ALL TO authenticated USING ((user_id = (select auth.uid())) OR (select public.is_admin()))
    WITH CHECK ((user_id = (select auth.uid())) OR (select public.is_admin()));
CREATE POLICY "cases_service_full" ON public.cases
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- APP SETTINGS
-- ==============================================================================
DROP POLICY IF EXISTS "app_settings_public_read" ON public.app_settings;
DROP POLICY IF EXISTS "app_settings_anon_read" ON public.app_settings;
DROP POLICY IF EXISTS "app_settings_auth_read" ON public.app_settings;
DROP POLICY IF EXISTS "app_settings_admin_write" ON public.app_settings;
DROP POLICY IF EXISTS "app_settings_admin_update" ON public.app_settings;
DROP POLICY IF EXISTS "app_settings_admin_delete" ON public.app_settings;
DROP POLICY IF EXISTS "app_settings_service_full" ON public.app_settings;
CREATE POLICY "app_settings_anon_read" ON public.app_settings
    FOR SELECT TO anon USING (is_public = true);
CREATE POLICY "app_settings_auth_read" ON public.app_settings
    FOR SELECT TO authenticated USING ((is_public = true) OR (select public.is_admin()));
CREATE POLICY "app_settings_admin_write" ON public.app_settings
    FOR INSERT TO authenticated WITH CHECK ((select public.is_admin()));
CREATE POLICY "app_settings_admin_update" ON public.app_settings
    FOR UPDATE TO authenticated USING ((select public.is_admin()));
CREATE POLICY "app_settings_admin_delete" ON public.app_settings
    FOR DELETE TO authenticated USING ((select public.is_admin()));
CREATE POLICY "app_settings_service_full" ON public.app_settings
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- NOTIFICATIONS
-- ==============================================================================
DROP POLICY IF EXISTS "notifications_own_all" ON public.notifications;
DROP POLICY IF EXISTS "notifications_service_full" ON public.notifications;
CREATE POLICY "notifications_own_all" ON public.notifications
    FOR ALL TO authenticated USING ((user_id = (select auth.uid())) OR (select public.is_admin()))
    WITH CHECK ((user_id = (select auth.uid())) OR (select public.is_admin()));
CREATE POLICY "notifications_service_full" ON public.notifications
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- SERVICE PRICINGS
-- ==============================================================================
DROP POLICY IF EXISTS "service_pricings_public_read" ON public.service_pricings;
DROP POLICY IF EXISTS "service_pricings_anon_read" ON public.service_pricings;
DROP POLICY IF EXISTS "service_pricings_auth_read" ON public.service_pricings;
DROP POLICY IF EXISTS "service_pricings_admin_write" ON public.service_pricings;
DROP POLICY IF EXISTS "service_pricings_admin_insert" ON public.service_pricings;
DROP POLICY IF EXISTS "service_pricings_admin_update" ON public.service_pricings;
DROP POLICY IF EXISTS "service_pricings_admin_delete" ON public.service_pricings;
DROP POLICY IF EXISTS "service_pricings_service_full" ON public.service_pricings;
CREATE POLICY "service_pricings_anon_read" ON public.service_pricings
    FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "service_pricings_auth_read" ON public.service_pricings
    FOR SELECT TO authenticated USING ((is_active = true) OR (select public.is_admin()));
CREATE POLICY "service_pricings_admin_insert" ON public.service_pricings
    FOR INSERT TO authenticated WITH CHECK ((select public.is_admin()));
CREATE POLICY "service_pricings_admin_update" ON public.service_pricings
    FOR UPDATE TO authenticated USING ((select public.is_admin()));
CREATE POLICY "service_pricings_admin_delete" ON public.service_pricings
    FOR DELETE TO authenticated USING ((select public.is_admin()));
CREATE POLICY "service_pricings_service_full" ON public.service_pricings
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- PROMOTION CAMPAIGNS
-- ==============================================================================
DROP POLICY IF EXISTS "promotion_campaigns_public_read" ON public.promotion_campaigns;
DROP POLICY IF EXISTS "promotion_campaigns_anon_read" ON public.promotion_campaigns;
DROP POLICY IF EXISTS "promotion_campaigns_auth_read" ON public.promotion_campaigns;
DROP POLICY IF EXISTS "promotion_campaigns_admin_write" ON public.promotion_campaigns;
DROP POLICY IF EXISTS "promotion_campaigns_admin_insert" ON public.promotion_campaigns;
DROP POLICY IF EXISTS "promotion_campaigns_admin_update" ON public.promotion_campaigns;
DROP POLICY IF EXISTS "promotion_campaigns_admin_delete" ON public.promotion_campaigns;
DROP POLICY IF EXISTS "promotion_campaigns_service_full" ON public.promotion_campaigns;
CREATE POLICY "promotion_campaigns_anon_read" ON public.promotion_campaigns
    FOR SELECT TO anon USING (status IN ('active', 'scheduled'));
CREATE POLICY "promotion_campaigns_auth_read" ON public.promotion_campaigns
    FOR SELECT TO authenticated USING ((status IN ('active', 'scheduled')) OR (select public.is_admin()));
CREATE POLICY "promotion_campaigns_admin_insert" ON public.promotion_campaigns
    FOR INSERT TO authenticated WITH CHECK ((select public.is_admin()));
CREATE POLICY "promotion_campaigns_admin_update" ON public.promotion_campaigns
    FOR UPDATE TO authenticated USING ((select public.is_admin()));
CREATE POLICY "promotion_campaigns_admin_delete" ON public.promotion_campaigns
    FOR DELETE TO authenticated USING ((select public.is_admin()));
CREATE POLICY "promotion_campaigns_service_full" ON public.promotion_campaigns
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- COUPONS
-- ==============================================================================
DROP POLICY IF EXISTS "coupons_public_read" ON public.coupons;
DROP POLICY IF EXISTS "coupons_anon_read" ON public.coupons;
DROP POLICY IF EXISTS "coupons_auth_read" ON public.coupons;
DROP POLICY IF EXISTS "coupons_admin_write" ON public.coupons;
DROP POLICY IF EXISTS "coupons_admin_insert" ON public.coupons;
DROP POLICY IF EXISTS "coupons_admin_update" ON public.coupons;
DROP POLICY IF EXISTS "coupons_admin_delete" ON public.coupons;
DROP POLICY IF EXISTS "coupons_service_full" ON public.coupons;
CREATE POLICY "coupons_anon_read" ON public.coupons
    FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "coupons_auth_read" ON public.coupons
    FOR SELECT TO authenticated USING ((is_active = true) OR (select public.is_admin()));
CREATE POLICY "coupons_admin_insert" ON public.coupons
    FOR INSERT TO authenticated WITH CHECK ((select public.is_admin()));
CREATE POLICY "coupons_admin_update" ON public.coupons
    FOR UPDATE TO authenticated USING ((select public.is_admin()));
CREATE POLICY "coupons_admin_delete" ON public.coupons
    FOR DELETE TO authenticated USING ((select public.is_admin()));
CREATE POLICY "coupons_service_full" ON public.coupons
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- BONUS LEDGER
-- ==============================================================================
DROP POLICY IF EXISTS "bonus_ledger_own_select" ON public.bonus_ledger;
DROP POLICY IF EXISTS "bonus_ledger_admin_insert" ON public.bonus_ledger;
DROP POLICY IF EXISTS "bonus_ledger_service_full" ON public.bonus_ledger;
CREATE POLICY "bonus_ledger_own_select" ON public.bonus_ledger
    FOR SELECT TO authenticated USING ((user_id = (select auth.uid())) OR (select public.is_admin()));
CREATE POLICY "bonus_ledger_admin_insert" ON public.bonus_ledger
    FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "bonus_ledger_service_full" ON public.bonus_ledger
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- REFERRAL CONFIG
-- ==============================================================================
DROP POLICY IF EXISTS "referral_config_auth_read" ON public.referral_config;
DROP POLICY IF EXISTS "referral_config_admin_write" ON public.referral_config;
DROP POLICY IF EXISTS "referral_config_admin_insert" ON public.referral_config;
DROP POLICY IF EXISTS "referral_config_admin_update" ON public.referral_config;
DROP POLICY IF EXISTS "referral_config_admin_delete" ON public.referral_config;
DROP POLICY IF EXISTS "referral_config_service_full" ON public.referral_config;
CREATE POLICY "referral_config_auth_read" ON public.referral_config
    FOR SELECT TO authenticated USING (true OR (select public.is_admin()));
CREATE POLICY "referral_config_admin_insert" ON public.referral_config
    FOR INSERT TO authenticated WITH CHECK ((select public.is_admin()));
CREATE POLICY "referral_config_admin_update" ON public.referral_config
    FOR UPDATE TO authenticated USING ((select public.is_admin()));
CREATE POLICY "referral_config_admin_delete" ON public.referral_config
    FOR DELETE TO authenticated USING ((select public.is_admin()));
CREATE POLICY "referral_config_service_full" ON public.referral_config
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- REFERRAL RELATIONS
-- ==============================================================================
DROP POLICY IF EXISTS "referral_relations_own_select" ON public.referral_relations;
DROP POLICY IF EXISTS "referral_relations_admin_insert" ON public.referral_relations;
DROP POLICY IF EXISTS "referral_relations_service_all" ON public.referral_relations;
CREATE POLICY "referral_relations_own_select" ON public.referral_relations
    FOR SELECT TO authenticated USING ((referrer_id = (select auth.uid())) OR (referred_id = (select auth.uid())) OR (select public.is_admin()));
CREATE POLICY "referral_relations_admin_insert" ON public.referral_relations
    FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "referral_relations_service_all" ON public.referral_relations
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- COMMISSION LEDGER
-- ==============================================================================
DROP POLICY IF EXISTS "commission_ledger_own_select" ON public.commission_ledger;
DROP POLICY IF EXISTS "commission_ledger_service_full" ON public.commission_ledger;
CREATE POLICY "commission_ledger_own_select" ON public.commission_ledger
    FOR SELECT TO authenticated USING ((beneficiary_id = (select auth.uid())) OR (select public.is_admin()));
CREATE POLICY "commission_ledger_service_full" ON public.commission_ledger
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- COMMERCIAL AUDIT LOG
-- ==============================================================================
DROP POLICY IF EXISTS "commercial_audit_admin_read" ON public.commercial_audit_log;
DROP POLICY IF EXISTS "commercial_audit_service_full" ON public.commercial_audit_log;
CREATE POLICY "commercial_audit_admin_read" ON public.commercial_audit_log
    FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "commercial_audit_service_full" ON public.commercial_audit_log
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- PAYMENT ORDERS
-- ==============================================================================
DROP POLICY IF EXISTS "payment_orders_own_select" ON public.payment_orders;
DROP POLICY IF EXISTS "payment_orders_own_insert" ON public.payment_orders;
DROP POLICY IF EXISTS "payment_orders_service_full" ON public.payment_orders;
CREATE POLICY "payment_orders_own_select" ON public.payment_orders
    FOR SELECT TO authenticated USING ((user_id = (select auth.uid())) OR (select public.is_admin()));
CREATE POLICY "payment_orders_own_insert" ON public.payment_orders
    FOR INSERT TO authenticated WITH CHECK ((user_id = (select auth.uid())) OR (select public.is_admin()));
CREATE POLICY "payment_orders_service_full" ON public.payment_orders
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- PAYMENT WEBHOOK EVENTS (append-only; service_role; admin read)
-- ==============================================================================
DROP POLICY IF EXISTS "payment_webhook_events_admin_read" ON public.payment_webhook_events;
DROP POLICY IF EXISTS "payment_webhook_events_service_full" ON public.payment_webhook_events;
CREATE POLICY "payment_webhook_events_admin_read" ON public.payment_webhook_events
    FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "payment_webhook_events_service_full" ON public.payment_webhook_events
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- META ACCOUNTS
-- ==============================================================================
DROP POLICY IF EXISTS "meta_accounts_own_select" ON public.meta_accounts;
DROP POLICY IF EXISTS "meta_accounts_own_write" ON public.meta_accounts;
DROP POLICY IF EXISTS "meta_accounts_own_all" ON public.meta_accounts;
DROP POLICY IF EXISTS "meta_accounts_service_full" ON public.meta_accounts;
CREATE POLICY "meta_accounts_own_all" ON public.meta_accounts
    FOR ALL TO authenticated USING ((user_id = (select auth.uid())) OR (select public.is_admin()))
    WITH CHECK ((user_id = (select auth.uid())) OR (select public.is_admin()));
CREATE POLICY "meta_accounts_service_full" ON public.meta_accounts
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- EDITORIAL CONTENT
-- ==============================================================================
DROP POLICY IF EXISTS "editorial_content_public_read" ON public.editorial_content;
DROP POLICY IF EXISTS "editorial_content_anon_read" ON public.editorial_content;
DROP POLICY IF EXISTS "editorial_content_auth_read" ON public.editorial_content;
DROP POLICY IF EXISTS "editorial_content_admin_write" ON public.editorial_content;
DROP POLICY IF EXISTS "editorial_content_admin_insert" ON public.editorial_content;
DROP POLICY IF EXISTS "editorial_content_admin_update" ON public.editorial_content;
DROP POLICY IF EXISTS "editorial_content_admin_delete" ON public.editorial_content;
DROP POLICY IF EXISTS "editorial_content_service_full" ON public.editorial_content;
CREATE POLICY "editorial_content_anon_read" ON public.editorial_content
    FOR SELECT TO anon USING (status IN ('aprovado_qualidade', 'agendado', 'publicado'));
CREATE POLICY "editorial_content_auth_read" ON public.editorial_content
    FOR SELECT TO authenticated USING ((status IN ('aprovado_qualidade', 'agendado', 'publicado')) OR (select public.is_admin()));
CREATE POLICY "editorial_content_admin_insert" ON public.editorial_content
    FOR INSERT TO authenticated WITH CHECK ((select public.is_admin()));
CREATE POLICY "editorial_content_admin_update" ON public.editorial_content
    FOR UPDATE TO authenticated USING ((select public.is_admin()));
CREATE POLICY "editorial_content_admin_delete" ON public.editorial_content
    FOR DELETE TO authenticated USING ((select public.is_admin()));
CREATE POLICY "editorial_content_service_full" ON public.editorial_content
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- MARKETING CAMPAIGNS
-- ==============================================================================
DROP POLICY IF EXISTS "marketing_campaigns_public_read" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "marketing_campaigns_anon_read" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "marketing_campaigns_auth_read" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "marketing_campaigns_admin_write" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "marketing_campaigns_admin_insert" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "marketing_campaigns_admin_update" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "marketing_campaigns_admin_delete" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "marketing_campaigns_service_full" ON public.marketing_campaigns;
CREATE POLICY "marketing_campaigns_anon_read" ON public.marketing_campaigns
    FOR SELECT TO anon USING (status = 'active');
CREATE POLICY "marketing_campaigns_auth_read" ON public.marketing_campaigns
    FOR SELECT TO authenticated USING ((status = 'active') OR (select public.is_admin()));
CREATE POLICY "marketing_campaigns_admin_insert" ON public.marketing_campaigns
    FOR INSERT TO authenticated WITH CHECK ((select public.is_admin()));
CREATE POLICY "marketing_campaigns_admin_update" ON public.marketing_campaigns
    FOR UPDATE TO authenticated USING ((select public.is_admin()));
CREATE POLICY "marketing_campaigns_admin_delete" ON public.marketing_campaigns
    FOR DELETE TO authenticated USING ((select public.is_admin()));
CREATE POLICY "marketing_campaigns_service_full" ON public.marketing_campaigns
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- AUDIT LOGS (append-only; service_role full; admin read)
-- ==============================================================================
DROP POLICY IF EXISTS "audit_logs_admin_read" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_service_full" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_read" ON public.audit_logs
    FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "audit_logs_service_full" ON public.audit_logs
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- PLATFORM EVENTS
-- ==============================================================================
DROP POLICY IF EXISTS "platform_events_own_read" ON public.platform_events;
DROP POLICY IF EXISTS "platform_events_service_full" ON public.platform_events;
CREATE POLICY "platform_events_own_read" ON public.platform_events
    FOR SELECT TO authenticated USING ((user_id = (select auth.uid())) OR (select public.is_admin()));
CREATE POLICY "platform_events_service_full" ON public.platform_events
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- AI EXECUTION LOGS
-- ==============================================================================
DROP POLICY IF EXISTS "ai_execution_logs_admin_read" ON public.ai_execution_logs;
DROP POLICY IF EXISTS "ai_execution_logs_service_full" ON public.ai_execution_logs;
CREATE POLICY "ai_execution_logs_admin_read" ON public.ai_execution_logs
    FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "ai_execution_logs_service_full" ON public.ai_execution_logs
    FOR ALL TO service_role USING (true) WITH CHECK (true);
