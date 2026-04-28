## Goal

Make the AI on `/interactive` actually respond, and constrain it to answer **only** from two sources:
1. USN's official guidelines page: `https://www.usn.no/om-usn/regelverk/retningslinjer-for-bruk-av-kunstig-intelligens-ki-ved-eksamen-og-studentoppgaver`
2. This site's own pages (Index, Guidelines, Tools, Privacy)

## Why it's currently broken

The `/interactive` UI is wired up correctly and calls the `chat` edge function. The edge function calls a Postgres RPC `check_anonymous_rate_limit` for anonymous users — but **that function and its table were never actually applied to the database** (the migration file exists in `supabase/migrations/` but was never run). So every anonymous request fails with a 500 "Feil ved sjekk av begrensninger". That's why nothing comes back.

## Plan

### 1. Apply the missing rate-limit migration
Run a migration that creates `anonymous_chat_usage` table + `check_anonymous_rate_limit` and `cleanup_old_anonymous_usage` functions (contents already drafted in `supabase/migrations/20260214_anonymous_chat_usage.sql`). Allows 3 anonymous questions per fingerprint+IP per 24h.

### 2. Build the grounded knowledge base
Create a new file `supabase/functions/chat/knowledge.ts` containing:
- A trimmed, plain-text snapshot of the USN KI-guidelines page (fetched from the URL above, headers/footers/nav removed, kept ~3–6 KB).
- A trimmed plain-text summary of this site's own content (Guidelines, Tools, Privacy, Index — extracted from the existing TSX pages).

Embedding once at build time keeps latency low, costs nothing per request, and makes the assistant deterministic.

### 3. Rewrite the chat edge function in strict mode
Update `supabase/functions/chat/index.ts`:
- Import the knowledge text.
- Replace the current Norwegian system prompt with a strict one (in Norwegian) that:
  - Tells the model it is "AI Guidebook-assistenten for USN".
  - Provides the USN guidelines and site content as the only allowed sources.
  - Requires answers in Norwegian, max 4 sentences, plain text.
  - Instructs: if the question can't be answered from the sources, reply with a short fallback (e.g. *"Det står ikke i USNs retningslinjer eller på denne siden. Sjekk usn.no for mer."*) and a link to the USN guidelines page.
  - Forbids inventing rules, citing other universities, or speculation.
- Keep streaming, CORS, auth, and rate-limit logic unchanged.
- Bump model to `google/gemini-2.5-flash` for slightly better instruction-following on grounded Q&A (still cheap/fast).

### 4. Verify
After deploy, test via the edge function tester with a sample question ("Får jeg bruke ChatGPT på eksamen?") and confirm a streamed answer appears in the CRT monitor.

## Technical notes

- No frontend changes required — `CRTMonitorScene.tsx` already streams correctly.
- USN page text is embedded as a static string; refreshing it later means re-pasting from the source URL (acceptable since these guidelines change rarely).
- Rate limit (3/day anonymous) stays in place; logged-in users are unlimited.
- Strict mode applies only to the `chat` function — no other functionality is affected.

## Files touched

- New migration to create `anonymous_chat_usage` + RPC functions
- New: `supabase/functions/chat/knowledge.ts`
- Edited: `supabase/functions/chat/index.ts`
