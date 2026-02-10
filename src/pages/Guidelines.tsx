import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle, AlertTriangle, Image as ImageIcon, Scale } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const keyTopics = [
  {
    title: "Akseptabel og uakseptabel bruk",
    description: "Bruk AI til å forstå. Ikke til å kopiere. Aldri send inn AI-generert tekst som ditt eget arbeid.",
  },
  {
    title: "Personvern og databeskyttelse",
    description: "Dine data er viktige. Aldri del sensitive opplysninger med AI-verktøy. Les personvernreglene.",
  },
  {
    title: "Akademisk integritet og plagiat",
    description: "Hvis du bruker AI, si det. Ikke ta æren for noe som ikke er ditt. Følg universitetets retningslinjer.",
  },
];

const checklistItems = [
  "Jeg forstår hva oppgaven krever angående AI-bruk.",
  "Jeg har sjekket institusjonens retningslinjer for denne typen arbeid.",
  "Jeg har brukt AI som støtteverktøy, ikke for å generere innleveringen.",
  "Jeg har verifisert alle AI-genererte fakta mot pålitelige kilder.",
  "Jeg kan forklare og forsvare alle deler av innleveringen med egne ord.",
  "Jeg har oppgitt bruken av AI-verktøy som påkrevd.",
  "Jeg har sitert AI-assistert innhold etter institusjonens retningslinjer.",
  "Jeg har gjennomgått output for bias, feil og hallusinasjoner.",
];

const faqs = [
  { q: "Kan jeg bruke AI til alt?", a: "Nei. Det er viktige områder som er basert på forelesning, forskning og fagkunnskap, oppdagelse, eller lignende, der du trenger å bruke andre metoder enn AI for å lære." },
  { q: "Hva skjer med datasikkerhet mitt?", a: "Det kan varieres noe, men er lik. Les om brukerens og retningslinjer og la oss bli med i å bruke AI-verktøy. Sjekk alltid verktøyenes personvernerklæring." },
  { q: "Hva er hallusinasjoner i AI?", a: "Hallusinasjoner skjer at AI-genererer informasjon som låter riktig, men som ikke finnes. Det kan være falske kilder og fakta." },
  { q: "Er det plagiat å bruke AI?", a: "Hvis du avslører det. Hvis du bruker fakta, oppgaver etc, i forsøk av det som ikke er sant, kan det anses som plagiat." },
  { q: "Hvordan siterer jeg AI?", a: "Oppgi verktøyet du har brukt, for eksempel \"Denne teksten ble generert med ChatGPT\", en kontroll for å sjekke det etter dine metoder." },
  { q: "Har du flere spørsmål?", a: "Kontakt dine veiled- eller fagansatte ved ditt universitet." },
];

const Guidelines = () => {
  const [checked, setChecked] = useState<boolean[]>(new Array(checklistItems.length).fill(false));
  const completedCount = checked.filter(Boolean).length;
  const progress = (completedCount / checklistItems.length) * 100;

  const toggle = (index: number) => {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="section-fade-in mb-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground/60">Retningslinjer</p>
          <h1 className="section-fade-in text-4xl font-bold md:text-5xl">Bruk AI ansvarlig</h1>
          <p className="section-fade-in-delay-1 mx-auto mt-4 max-w-xl text-lg text-primary-foreground/70">
            Lær hvordan du holder kursing, intelligens, riktig i dine studier.
          </p>
          <div className="section-fade-in-delay-2 mt-6 flex justify-center gap-3">
            <a href="#checklist" className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">Les</a>
            <a href="#faq" className="rounded-md border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground">Spørsmål</a>
          </div>
        </div>
      </section>

      {/* Tre ting */}
      <section className="container mx-auto px-4 py-20">
        <div className="section-fade-in mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Kjernepunktene</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Tre ting du må vite før du bruker AI</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Retningslinjene inneholder tips som hjelper deg å navigere AI-bruken på en måte som er trygg, ærlig og ansvarlig.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {keyTopics.map((topic, i) => (
            <div key={topic.title} className={`section-fade-in-delay-${i + 1} rounded-xl border border-border bg-card p-6 shadow-sm`}>
              <div className="mb-4 flex aspect-video items-center justify-center rounded-lg bg-muted">
                <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-card-foreground">{topic.title}</h3>
              <p className="text-sm text-muted-foreground">{topic.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/tools" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Utforsk
          </Link>
          <Link to="#" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            Mer <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* Slik bruker du AI korrekt */}
      <section className="border-y border-border bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-sm">
              <HelpCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Slik bruker du AI korrekt</h2>
            <p className="mt-3 text-muted-foreground">
              Det er et enkelt ansvar som følger med å bruke AI. Bruk det til å utforske emner, sjekke din forståelse og lære mer. Men still alltid spørsmål og kontroller alt selv.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/tools" className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Les mer</Link>
              <Link to="/privacy" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                Mer <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-8 flex max-w-xl justify-center gap-4 text-sm text-muted-foreground">
            <span>Eksempler</span>
            <span>•</span>
            <span>Hallusinasjonssjekk</span>
            <span>•</span>
            <span>Verktøyliste</span>
          </div>
        </div>
      </section>

      {/* Kjenn farene */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="section-fade-in mb-6">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Risikoer</p>
            <h2 className="text-3xl font-bold text-foreground">Kjenn farene</h2>
            <p className="mt-3 text-muted-foreground">
              AI-systemer kan gjøre feil. Du kan aldri påvirke et utspørre rolle, applikasjonen baker, og andre elementer. Kontroller alt.
            </p>
          </div>
          <div className="flex aspect-video items-center justify-center rounded-xl bg-muted">
            <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
          </div>
        </div>
      </section>

      {/* AI bias */}
      <section className="border-y border-border bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="section-fade-in">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Objektiv</p>
              <h2 className="text-3xl font-bold text-foreground">AI kan arve fordommer fra treningsdata</h2>
              <p className="mt-3 text-muted-foreground">
                AI modeller kan gjøre feil som resultat av skjevheter i treningsdataen. Det kan resultere i stereotypiske svar. Aldri stol blindt på AI.
              </p>
              <div className="mt-6 flex gap-3">
                <Link to="/privacy" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                  Personvern
                </Link>
                <Link to="#" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Mer <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <div className="flex aspect-video items-center justify-center rounded-xl bg-card shadow-sm">
              <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Sjekkliste CTA */}
      <section id="checklist" className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-fade-in text-3xl font-bold md:text-4xl">Sjekkliste</h2>
          <p className="section-fade-in-delay-1 mx-auto mt-3 max-w-lg text-primary-foreground/70">
            Last ned vår sjekkliste og bruk den hver gang du skriver en innlevering.
          </p>
          <div className="section-fade-in-delay-2 mt-6 flex justify-center gap-3">
            <a href="#checklist-section" className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">Start</a>
            <Link to="/tools" className="rounded-md border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground">Verktøy</Link>
          </div>
        </div>
      </section>

      {/* Interactive Checklist */}
      <section id="checklist-section" className="container mx-auto max-w-2xl px-4 py-20">
        <div className="section-fade-in rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-card-foreground">
                {completedCount} av {checklistItems.length} fullført
              </span>
              <span className="font-semibold text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2.5" />
          </div>
          <ul className="space-y-4">
            {checklistItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Checkbox
                  id={`check-${i}`}
                  checked={checked[i]}
                  onCheckedChange={() => toggle(i)}
                  className="mt-0.5"
                />
                <label
                  htmlFor={`check-${i}`}
                  className={`cursor-pointer text-sm transition-colors ${
                    checked[i] ? "text-muted-foreground line-through" : "text-card-foreground"
                  }`}
                >
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-4 pb-20">
        <div className="section-fade-in mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Spørsmål</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Her finner du svar på det du lurer på om AI i studiene.
          </p>
        </div>
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-x-8 md:grid-cols-2">
            {faqs.map((faq, i) => (
              <Accordion key={i} type="single" collapsible>
                <AccordionItem value={`faq-${i}`} className="border-b border-border">
                  <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
        <div className="mt-10 text-center">
          <p className="text-lg font-bold text-foreground">Har du flere spørsmål?</p>
          <p className="mt-1 text-sm text-muted-foreground">Kontakt dine veiled- eller fagansatte ved ditt universitet.</p>
          <Link to="#" className="mt-4 inline-flex rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            Kontakt
          </Link>
        </div>
      </section>

      {/* Juridiske rammer */}
      <section className="border-t border-border bg-muted/50 py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="section-fade-in mb-6 text-3xl font-bold text-foreground">Juridiske rammer</h2>
          <div className="section-fade-in-delay-1 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              AIGuidebook er utviklet for å hjelpe deg med å forstå AI-bruk i kontekst med gjeldende retningslinjer og regler.
              Ikke noe av dette innholdet skal brukes som juridisk rådgivning eller erstatte offisielle retningslinjer fra din utdanningsinstitusjon.
            </p>
            <p>
              Personvernforordningen (GDPR) regulerer hvordan personopplysninger behandles, og dette gjelder AI-verktøy som behandler slike data.
              Åndsverksloven beskytter opphavsrett, og studenters innleveringer er beskyttet som åndsverk.
            </p>
            <p>
              Universitetsloven inneholder viktige bestemmelser om akademisk integritet. Ved brudd på reglene kan studentene bli utestengt.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Guidelines;
