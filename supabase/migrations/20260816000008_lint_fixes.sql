-- ==============================================================================
-- DEFESAI LINT FIXES
-- 1. SET search_path em funções (function_search_path_mutable)
-- 2. REVOKE EXECUTE de emit_event p/ anon/authenticated (SECURITY DEFINER)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
SET search_path = public
AS $$
    SELECT auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
$$;

REVOKE EXECUTE ON FUNCTION public.emit_event(text, text, text, uuid, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.emit_event(text, text, text, uuid, jsonb) TO service_role;
