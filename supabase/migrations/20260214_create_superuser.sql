-- =====================================================
-- SUPERUSER SETUP
-- =====================================================
-- This migration creates the initial superuser account
-- Email: your-email@example.com
--
-- IMPORTANT: After running this migration, you must:
-- 1. Sign up with the email: your-email@example.com
-- 2. Run the function below to grant superuser privileges
-- =====================================================

-- Function to grant superuser privileges
CREATE OR REPLACE FUNCTION public.grant_superuser(target_email TEXT)
RETURNS VOID AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Find the user by email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = target_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', target_email;
    END IF;
    
    -- Insert into superusers table
    INSERT INTO public.superusers (user_id, granted_at, granted_by)
    VALUES (target_user_id, NOW(), NULL)
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Superuser privileges granted to %', target_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for superuser to grant privileges to others
CREATE OR REPLACE FUNCTION public.superuser_grant_access(target_email TEXT)
RETURNS VOID AS $$
DECLARE
    target_user_id UUID;
    current_is_super BOOLEAN;
BEGIN
    -- Check if current user is a superuser
    SELECT public.is_superuser(auth.uid()) INTO current_is_super;
    
    IF NOT current_is_super THEN
        RAISE EXCEPTION 'Only superusers can grant superuser privileges';
    END IF;
    
    -- Find the target user
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = target_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', target_email;
    END IF;
    
    -- Grant superuser access
    INSERT INTO public.superusers (user_id, granted_at, granted_by)
    VALUES (target_user_id, NOW(), auth.uid())
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Superuser privileges granted to % by %', target_email, auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS bypass policies for superusers
-- These policies allow superusers to read all data for administrative purposes

CREATE POLICY "Superusers can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_superuser(auth.uid()));

CREATE POLICY "Superusers can view all chat sessions"
    ON public.chat_sessions FOR SELECT
    USING (public.is_superuser(auth.uid()));

CREATE POLICY "Superusers can view all chat messages"
    ON public.chat_messages FOR SELECT
    USING (public.is_superuser(auth.uid()));

CREATE POLICY "Superusers can view all user preferences"
    ON public.user_preferences FOR SELECT
    USING (public.is_superuser(auth.uid()));

CREATE POLICY "Superusers can view audit logs"
    ON public.audit_log FOR SELECT
    USING (public.is_superuser(auth.uid()));

-- =====================================================
-- SETUP INSTRUCTIONS
-- =====================================================
-- 
-- TO COMPLETE SUPERUSER SETUP:
-- 
-- 1. Sign up at your Supabase app with email: your-email@example.com
-- 
-- 2. After signup, run this SQL in the Supabase SQL Editor:
--    SELECT public.grant_superuser('your-email@example.com');
-- 
-- 3. Verify superuser status:
--    SELECT * FROM public.superusers;
-- 
-- 4. Test superuser access by querying any table
-- 
-- =====================================================

COMMENT ON FUNCTION public.grant_superuser IS 'Administrative function to grant initial superuser privileges';
COMMENT ON FUNCTION public.superuser_grant_access IS 'Allows superusers to grant privileges to other users';
COMMENT ON FUNCTION public.is_superuser IS 'Check if a user has superuser privileges';
