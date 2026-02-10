

## Vis AI-svar pa CRT-monitor ved slutten av reisen

### Oversikt
Nar brukeren scroller til slutten av landskapet, vises en ny CRT-monitor (samme design som start-monitoren) som viser et AI-generert svar pa sporsmalet brukeren skrev inn i starten. Svaret streames via Lovable AI (gratis inkludert).

### Brukeropplevelse
1. Brukeren skriver et sporsmal pa CRT-monitoren og trykker Enter
2. Brukeren reiser gjennom AI-pipelinen (6 steg)
3. Ved enden av reisen (z = -185) dukker en ny CRT-monitor opp med svaret
4. Svaret streames inn token for token med CRT-estetikk (gron tekst, scanlines)

### Tekniske endringer

**1. Opprett edge function: `supabase/functions/chat/index.ts`**
- Mottar brukerens sporsmal
- Kaller Lovable AI Gateway med `google/gemini-3-flash-preview`
- Streamer svaret tilbake via SSE
- Hanterer 429/402 feilkoder

**2. Oppdater `src/components/CRTMonitorScene.tsx`**

Nye komponenter og endringer:
- **EndCRTMonitor**: En ny CRT-monitor ved z=-185 som viser AI-svaret med samme retro-stil (gron tekst, scanlines, CRT-ramme)
- **ScreenContent for svar**: Viser "Svar:" header og streamet tekst med blinkende cursor
- **AI-kall trigger**: Nar brukeren starter reisen, sendes sporsmalet til edge function. Svaret lagres i state og vises pa slutt-monitoren
- Erstatter det eksisterende "Svaret ditt er klart"-tekst-elementet (linje 716-723) med EndCRTMonitor
- `inputText` sendes videre slik at sporsmalet ogsa kan vises pa slutt-monitoren

State-endringer i hovedkomponenten:
- `aiResponse: string` - akkumulert svar fra AI
- `isLoadingAI: boolean` - viser loading-indikator pa monitoren
- `aiError: string | null` - viser feilmelding om noe gar galt

Flyten:
```text
[Enter trykket] --> setJourneyStarted(true)
                --> fetch() til /functions/v1/chat (SSE stream)
                --> onDelta oppdaterer aiResponse state
                --> EndCRTMonitor viser aiResponse ved z=-185
```

**3. Oppdater `supabase/config.toml`**
- Legg til chat-funksjonen med `verify_jwt = false` (offentlig tilgjengelig)

### Detaljer om EndCRTMonitor
- Samme visuelle design som start-CRTMonitor (RoundedBox, ScanlineMaterial, gron tekst)
- Plassert ved `[0, 0.2, -185]` (der slutt-teksten er na)
- Viser brukerens sporsmal oppe og AI-svaret under
- Scrollbar tekst hvis svaret er langt (begrenset maxWidth)
- Blinkende cursor mens svaret streames
- "Laster svar..." tekst mens AI jobber

