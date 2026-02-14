
-- Fix mutable search_path on all database functions
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.is_superuser(uuid) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.superuser_grant_access(text) SET search_path = public;
