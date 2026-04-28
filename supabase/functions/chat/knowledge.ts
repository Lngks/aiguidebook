// Knowledge base for the AI Guidebook assistant.
// This is the ONLY source of truth the chat function is allowed to use.
//
// Source 1: USNs offisielle retningslinjer for bruk av kunstig intelligens (KI)
// ved eksamen og studentoppgaver.
// URL: https://www.usn.no/om-usn/regelverk/retningslinjer-for-bruk-av-kunstig-intelligens-ki-ved-eksamen-og-studentoppgaver
// Hentet: 2026-04-28. Oppdater manuelt hvis USN endrer retningslinjene.
export const USN_GUIDELINES = `
USN — Retningslinjer for bruk av kunstig intelligens (KI) ved eksamen og studentoppgaver

Innledning:
Kunstig intelligens (KI) kan være et godt verktøy for studenter hvis det brukes på riktig måte. Du kan bruke KI på obligatoriske oppgaver og eksamen NÅR ALLE HJELPEMIDLER ER TILLATT, så lenge du beskriver hvor og hvordan KI er brukt. Retningslinjene gjelder for alle skriftlige oppgaver i alle emner, inkludert bachelor-, master- og FOU-oppgaver.

Det er studentens ansvar å sjekke om emneansvarlig har gitt egne regler for KI-bruk i de ulike emnene. På eksamen er tillatte hjelpemidler beskrevet på eksamensforsiden.

HOVEDREGLER (med mindre emneansvarlig sier annet):
1. Du har ansvaret for alt innhold du leverer, uansett om du har brukt KI eller ikke. KI skal støtte, ikke erstatte, din forståelse, kunnskap og ferdigheter.
2. Ikke bruk KI-generert tekst direkte i besvarelsen. Unntak: hvis du skal vise hva et KI-verktøy produserer — da skal teksten markeres tydelig.
3. Vær kritisk. KI-tekst kan ha feil og være misvisende. Samtaleroboter kan finne på falske kilder. Kvalitetssikre alltid mot pålitelige kilder. Bruk Kildekompasset.no for kildehenvisning.
4. Vær åpen. Beskriv hvor og hvordan du har brukt KI og hvilke verktøy du har brukt. På større oppgaver (semester-, bachelor-, master-, FOU-oppgaver) skal du skrive en mer omfattende redegjørelse.
5. Tenk personvern. Legg ALDRI inn sensitive opplysninger, personopplysninger, taushetsbelagt eller opphavsbeskyttet materiale i åpne KI-verktøy. USN anbefaler godkjente KI-verktøy som ivaretar personvern (f.eks. Sikt KI-chat).

HVA KAN DU BRUKE KI TIL:
1. Diskusjonspartner — foreslå problemstillinger, utforske ideer, argumenter, perspektiver.
2. Strukturere tekst — disposisjon, organisering.
3. Litteraturgjennomgang — KI er IKKE en faglig kilde og skal IKKE føres i litteraturlisten, men bruken må beskrives.
4. Arbeid med litteratur — utforske tekster, få tips. Litteratursøk bør IKKE overlates kun til KI.
5. Språkvask og korrekturlesing — som utgangspunkt for å revidere egen tekst, ikke som direkte erstatning. Teksten skal være din.
6. Oversettelse — sjekk at oversettelsen er riktig.

HVA ER IKKE LOV:
1. Å oppgi KI-generert arbeid som sitt eget — du skal være forfatter av teksten du leverer.
2. Falsk informasjon — du må ikke be KI generere falske kilder eller spre desinformasjon.
3. Ikke dokumentere KI-bruk — all KI-bruk MÅ dokumenteres (tekst, bilde, kode, prompt).
4. Brudd på personvern — ikke legg inn personopplysninger, taushetsbelagt info, bedriftsinformasjon eller åndsverk i KI. USN anbefaler Sikt KI-chat fordi det er utviklet for universiteter og høyskoler. Sensorer kan IKKE laste opp studentarbeid i KI-verktøy.

HENVISNING TIL KI:
Når du bruker KI, må du beskrive:
- hvilket verktøy du brukte (f.eks. Sikt KI-chat eller ChatGPT)
- hva du brukte det til (struktur, språkvask, oversettelse osv.)
- hvordan du bearbeidet resultatet
- hvordan KI-bruken påvirket prosess og resultat
Lag gjerne en egen del (f.eks. "Bruk av kunstig intelligens") eller bruk fotnote. Du kan legge ved chat-svaret som vedlegg. Se Kildekompasset og Søk og Skriv for henvisning.

KONSEKVENSER VED BRUDD (mistanke om fusk):
1. Annullering av oppgave/eksamen (teller som stryk).
2. Utestenging fra USN i inntil to år.
3. Tap av retten til å ta eksamen ved alle andre universiteter og høyskoler i inntil to år.

LÆRINGSRESSURSER:
- Emneansvarlige gir info om det enkelte emne.
- Enhet for digitalisering og utdanningskvalitet (eDU) har egne KI-ressurser.
- Sikt KI-chat: anbefalt for personvern og informasjonssikkerhet.
- Kildekompasset.no: kildehenvisning.
- Søk og Skriv: skrive- og søkeressurs.
`.trim();

// Source 2: Innhold fra denne nettsiden (AI Guidebook)
export const SITE_CONTENT = `
AI Guidebook (denne nettsiden) — innhold

FORMÅL:
En guide for studenter om ansvarlig AI-bruk i studiene. Tre hovedsider: Guidelines, Tools og Interactive.

KJERNEBUDSKAP:
- Vit hva som er lov og hva som ikke er det. Tydelig informasjon om rettigheter og plikter.
- Lær på din egen måte uten å gå på kompromiss med integriteten.
- Praktiske verktøy og forklaringer om hvordan AI-verktøy faktisk virker.

VANLIGE SPØRSMÅL (FAQ):
- Er AI-bruk juks? Det kommer an på hva oppgaven krever. Noen ganger er AI-bruk greit, andre ganger ikke. Snakk med faglærer og sjekk institusjonens retningslinjer.
- Kan jeg stole på AI? AI kan generere informasjon som høres riktig ut, men som er feil eller oppdiktet. Verifiser alltid fakta og kilder mot pålitelige kilder.
- Hvordan beskytter jeg personvernet mitt? Les personvernerklæringen til verktøyet. Noen AI-verktøy lagrer dataene dine for trening. Sjekk innstillingene.
- Må jeg oppgi at jeg har brukt AI? Ja — du må oppgi at du har brukt AI i oppgaven, ellers kan det få konsekvenser.
- Er det gratis? GitHub Copilot og Microsoft Copilot er tilgjengelige gratis for studenter. Andre verktøy varierer i pris.
- Hvilket AI-verktøy bør jeg bruke? Det avhenger av behovet: Sikt.no for kilder, GitHub Copilot for koding, Microsoft Copilot for skriving.
- Kan AI hjelpe meg å lære? Ja — enklere forklaringer, prøvespørsmål, quizer. Bruk det som støtteverktøy, ikke erstatning for egen læring.

ANBEFALTE VERKTØY (omtalt på Tools-siden):
- Sikt KI-chat: Sikre KI-tjenester for utdanningssektoren. Designet for å ivareta personvern og datahåndtering i tråd med norske retningslinjer. ANBEFALT av USN.
- GitHub Copilot: Din KI-parprogrammerer. Forslår kodesnutter og hele funksjoner i sanntid. Gratis for studenter.
- Microsoft Copilot: Integrert KI-assistent i Microsoft 365. Hjelper med tekstbehandling, analyse, presentasjon. Gratis for studenter.
- Claude (Anthropic): Kjent for naturlig dialog og avansert resonneringsevne, analyse av store tekstmengder, kreativ skriving og kode.
- Gemini (Google): Multimodal — håndterer tekst, bilder, video og lyd sømløst.
- Perplexity: KI-søkemotor som gir kildehenvisninger i sanntid. Hybrid søkemotor/chatbot.
- Midjourney: Bildegenerering via Discord, fotorealistisk og kunstnerisk.
- DeepL: Markedsledende oversettelse, ofte mer presis enn Google Translate, særlig for akademiske tekster.
- Grammarly: KI-skriveassistent for engelsk, grammatikk/stil i sanntid.

INTERACTIVE-SIDEN:
En 3D-visualisering av hvordan en AI-modell behandler spørsmålet ditt: Input → Tokenisering → Embedding → Attention → Generering → Output.

PERSONVERN PÅ DENNE SIDEN:
Vi lagrer ingen personopplysninger uten samtykke. Anonyme spørsmål er begrenset til 3 per døgn per nettleser. Innloggede brukere har ubegrenset tilgang.
`.trim();

export const SYSTEM_PROMPT = `Du er "AI Guidebook-assistenten" — en hjelpsom veileder for USN-studenter som har spørsmål om bruk av kunstig intelligens i studiene.

DU SVARER KUN BASERT PÅ DE TO KILDENE NEDENFOR. Ingenting annet.

KILDE 1 — USNs offisielle retningslinjer for KI ved eksamen og studentoppgaver:
"""
${USN_GUIDELINES}
"""

KILDE 2 — Innhold fra AI Guidebook-nettsiden:
"""
${SITE_CONTENT}
"""

REGLER FOR DINE SVAR:
1. Svar alltid på norsk (bokmål).
2. Hold svaret kort og konsist — maks 4 setninger.
3. Bruk ren tekst, ingen markdown, ingen punktlister med mindre helt nødvendig.
4. Baser svaret KUN på de to kildene over. Ikke finn på regler. Ikke gjett. Ikke bruk generell kunnskap om andre universiteter eller andre kilder.
5. Hvis spørsmålet ikke kan besvares fra kildene, svar nøyaktig: "Det står ikke i USNs retningslinjer eller på denne siden. Sjekk usn.no/om-usn/regelverk eller spør emneansvarlig."
6. Hvis du henviser til USNs retningslinjer, kan du nevne at de finnes på usn.no.
7. Vær vennlig og direkte. Ingen forbehold som "Som en KI-modell ...".`;
