-- =====================================================
-- ANONYMOUS CHAT USAGE TRACKING
-- =====================================================
-- This migration creates a table to track anonymous chat usage
-- to prevent abuse while allowing legitimate users to try the feature
-- =====================================================

-- Table to track anonymous user chat requests
CREATE TABLE public.anonymous_chat_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fingerprint TEXT NOT NULL,
    ip_address INET NOT NULL,
    questions_asked INTEGER NOT NULL DEFAULT 1,
    last_asked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_anon_user UNIQUE(fingerprint, ip_address)
);

-- Enable RLS (only service role can access)
ALTER TABLE public.anonymous_chat_usage ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write (used by edge functions)
CREATE POLICY "Service role can manage anonymous usage"
    ON public.anonymous_chat_usage
    FOR ALL
    USING (false); -- No one can access via RLS, only service role can bypass

-- Indexes for fast lookups
CREATE INDEX idx_anon_usage_lookup ON public.anonymous_chat_usage(fingerprint, ip_address);
CREATE INDEX idx_anon_usage_created_at ON public.anonymous_chat_usage(created_at DESC);
CREATE INDEX idx_anon_usage_last_asked ON public.anonymous_chat_usage(last_asked_at DESC);

-- Function to check and update anonymous usage
CREATE OR REPLACE FUNCTION public.check_anonymous_rate_limit(
    p_fingerprint TEXT,
    p_ip_address INET,
    p_max_questions INTEGER DEFAULT 3,
    p_window_hours INTEGER DEFAULT 24
)
RETURNS JSONB AS $$
DECLARE
    v_usage RECORD;
    v_window_start TIMESTAMPTZ;
    v_result JSONB;
BEGIN
    v_window_start := NOW() - (p_window_hours || ' hours')::INTERVAL;
    
    -- Try to get existing usage within the time window
    SELECT * INTO v_usage
    FROM public.anonymous_chat_usage
    WHERE fingerprint = p_fingerprint
      AND ip_address = p_ip_address
      AND created_at >= v_window_start;
    
    IF v_usage IS NULL THEN
        -- First time user or outside window, create new record
        INSERT INTO public.anonymous_chat_usage (fingerprint, ip_address, questions_asked)
        VALUES (p_fingerprint, p_ip_address, 1)
        RETURNING * INTO v_usage;
        
        RETURN jsonb_build_object(
            'allowed', true,
            'questions_asked', 1,
            'questions_remaining', p_max_questions - 1,
            'reset_at', v_usage.created_at + (p_window_hours || ' hours')::INTERVAL
        );
    ELSIF v_usage.questions_asked >= p_max_questions THEN
        -- Limit reached
        RETURN jsonb_build_object(
            'allowed', false,
            'questions_asked', v_usage.questions_asked,
            'questions_remaining', 0,
            'reset_at', v_usage.created_at + (p_window_hours || ' hours')::INTERVAL
        );
    ELSE
        -- Increment usage
        UPDATE public.anonymous_chat_usage
        SET questions_asked = questions_asked + 1,
            last_asked_at = NOW()
        WHERE id = v_usage.id
        RETURNING * INTO v_usage;
        
        RETURN jsonb_build_object(
            'allowed', true,
            'questions_asked', v_usage.questions_asked,
            'questions_remaining', p_max_questions - v_usage.questions_asked,
            'reset_at', v_usage.created_at + (p_window_hours || ' hours')::INTERVAL
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old anonymous usage records
CREATE OR REPLACE FUNCTION public.cleanup_old_anonymous_usage()
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    -- Delete records older than 7 days
    DELETE FROM public.anonymous_chat_usage
    WHERE created_at < NOW() - INTERVAL '7 days';
    
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    
    RAISE NOTICE 'Cleaned up % old anonymous usage records', v_deleted;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE public.anonymous_chat_usage IS 'Tracks anonymous user chat usage to prevent abuse';
COMMENT ON FUNCTION public.check_anonymous_rate_limit IS 'Checks if anonymous user has exceeded rate limit and updates usage count';
COMMENT ON FUNCTION public.cleanup_old_anonymous_usage IS 'Removes anonymous usage records older than 7 days';

-- =====================================================
-- USAGE INSTRUCTIONS
-- =====================================================
-- 
-- To check rate limit in edge function:
-- SELECT public.check_anonymous_rate_limit('fingerprint', '192.168.1.1'::inet);
-- 
-- To cleanup old records (run periodically):
-- SELECT public.cleanup_old_anonymous_usage();
-- 
-- =====================================================
