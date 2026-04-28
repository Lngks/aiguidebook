CREATE TABLE IF NOT EXISTS public.anonymous_chat_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fingerprint TEXT NOT NULL,
    ip_address INET NOT NULL,
    questions_asked INTEGER NOT NULL DEFAULT 1,
    last_asked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_anon_user UNIQUE(fingerprint, ip_address)
);

ALTER TABLE public.anonymous_chat_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage anonymous usage"
    ON public.anonymous_chat_usage
    FOR ALL
    USING (false)
    WITH CHECK (false);

CREATE INDEX IF NOT EXISTS idx_anon_usage_lookup ON public.anonymous_chat_usage(fingerprint, ip_address);
CREATE INDEX IF NOT EXISTS idx_anon_usage_created_at ON public.anonymous_chat_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_anon_usage_last_asked ON public.anonymous_chat_usage(last_asked_at DESC);

CREATE OR REPLACE FUNCTION public.check_anonymous_rate_limit(
    p_fingerprint TEXT,
    p_ip_address INET,
    p_max_questions INTEGER DEFAULT 3,
    p_window_hours INTEGER DEFAULT 24
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_usage RECORD;
    v_window_start TIMESTAMPTZ;
BEGIN
    v_window_start := NOW() - (p_window_hours || ' hours')::INTERVAL;

    SELECT * INTO v_usage
    FROM public.anonymous_chat_usage
    WHERE fingerprint = p_fingerprint
      AND ip_address = p_ip_address
      AND created_at >= v_window_start;

    IF v_usage IS NULL THEN
        INSERT INTO public.anonymous_chat_usage (fingerprint, ip_address, questions_asked)
        VALUES (p_fingerprint, p_ip_address, 1)
        ON CONFLICT (fingerprint, ip_address) DO UPDATE
          SET questions_asked = public.anonymous_chat_usage.questions_asked + 1,
              last_asked_at = NOW()
        RETURNING * INTO v_usage;

        RETURN jsonb_build_object(
            'allowed', true,
            'questions_asked', v_usage.questions_asked,
            'questions_remaining', GREATEST(p_max_questions - v_usage.questions_asked, 0),
            'reset_at', v_usage.created_at + (p_window_hours || ' hours')::INTERVAL
        );
    ELSIF v_usage.questions_asked >= p_max_questions THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'questions_asked', v_usage.questions_asked,
            'questions_remaining', 0,
            'reset_at', v_usage.created_at + (p_window_hours || ' hours')::INTERVAL
        );
    ELSE
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
$$;

CREATE OR REPLACE FUNCTION public.cleanup_old_anonymous_usage()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM public.anonymous_chat_usage
    WHERE created_at < NOW() - INTERVAL '7 days';
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$;