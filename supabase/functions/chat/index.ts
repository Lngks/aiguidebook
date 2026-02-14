import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Authenticate OR Rate Limit
    const authHeader = req.headers.get("Authorization");
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader ?? "" } } }
    );

    let profileId = "anonymous";
    let isAnonymous = true;

    // 1. Try to get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (user && !authError) {
      profileId = user.id;
      isAnonymous = false;
    } else {
      // 2. If not authenticated, check anonymous rate limit
      const fingerprint = req.headers.get("x-client-fingerprint");
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

      if (!fingerprint) {
        return new Response(
          JSON.stringify({ error: "Manglende identifikasjon for anonym tilgang" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check rate limit via RPC
      // Create admin client to bypass RLS for rate limit check
      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      const { data: limitCheck, error: limitError } = await adminClient.rpc(
        'check_anonymous_rate_limit',
        { p_fingerprint: fingerprint, p_ip_address: ip }
      );

      if (limitError) {
        console.error("Rate limit check error:", limitError);
        return new Response(
          JSON.stringify({ error: "Feil ved sjekk av begrensninger" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!limitCheck || !limitCheck.allowed) {
        return new Response(
          JSON.stringify({
            error: "Daglig grense nådd. Logg inn for ubegrenset tilgang.",
            limit_reached: true
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const { question } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content:
                "Du er en hjelpsom AI-assistent som svarer på norsk. Hold svarene korte og konsise (maks 3-4 setninger). Svar i ren tekst uten markdown-formatering.",
            },
            { role: "user", content: question },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "For mange forespørsler. Prøv igjen om litt." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Kreditter oppbrukt. Legg til mer i Lovable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway feil" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Ukjent feil" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
