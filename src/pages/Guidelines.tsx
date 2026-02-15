import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle, Image as ImageIcon } from "lucide-react";
import DarkVeil from "@/components/DarkVeil/DarkVeil";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const keyTopics = [
  {
    title: "Akseptabel og uakseptabel bruk",
    description: "Bruk AI til å forstå, ikke til å kopiere. Aldri send inn AI-generert tekst som ditt eget arbeid.",
  },
  {
    title: "Personvern og databeskyttelse",
    description: "Dataene dine er viktige. Del aldri sensitive opplysninger med AI-verktøy, og les alltid personvernreglene.",
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
  "Jeg har gjennomgått resultatene for skjevheter, feil og hallusinasjoner.",
];

const faqs = [
  { q: "Kan jeg bruke AI til alt?", a: "Nei. Det finnes viktige områder, som forelesningsbasert forskning og fagkunnskap, der du trenger andre metoder enn AI for å lære." },
  { q: "Hva skjer med dataene mine?", a: "Det varierer mellom verktøy. Les alltid personvernerklæringen og sjekk hvilke data som lagres når du bruker AI-verktøy." },
  { q: "Hva er hallusinasjoner i AI?", a: "Hallusinasjoner oppstår når AI genererer informasjon som høres riktig ut, men som ikke stemmer. Det kan være falske kilder og oppdiktede fakta." },
  { q: "Er det plagiat å bruke AI?", a: "Ikke i seg selv, men hvis du leverer AI-generert innhold som ditt eget uten å oppgi det, kan det anses som plagiat." },
  { q: "Hvordan siterer jeg AI?", a: "Oppgi verktøyet du har brukt, for eksempel: «Denne teksten ble utarbeidet med hjelp av ChatGPT.» Følg institusjonens retningslinjer for korrekt sitering." },
  { q: "Har du flere spørsmål?", a: "Kontakt veilederen din eller fagansatte ved universitetet ditt." },
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
      <section className="relative overflow-hidden bg-secondary py-16 text-primary-foreground">
        <div className="absolute inset-0">
          <DarkVeil
            hueShift={0}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.5}
            scanlineFrequency={0}
            warpAmount={0}
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <p className="section-fade-in mb-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground/60">Retningslinjer</p>
          <h1 className="section-fade-in text-4xl font-bold md:text-5xl">Bruk AI ansvarlig</h1>
          <p className="section-fade-in-delay-1 mx-auto mt-4 max-w-xl text-lg text-primary-foreground/70">
            Lær hvordan du bruker kunnskap, teknologi og integritet riktig i studiene dine.
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
            Retningslinjene inneholder tips som hjelper deg å navigere AI-bruken på en trygg, ærlig og ansvarlig måte.
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
              Det følger et ansvar med å bruke AI. Bruk det til å utforske emner, sjekke forståelsen din og lære mer. Men still alltid spørsmål og kontroller alt selv.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild>
                <Link to="/tools">Les mer</Link>
              </Button>
              <Link to="/privacy" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                Personvern <ArrowRight className="h-3 w-3" />
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
              AI-systemer kan gjøre feil. Du kan ikke alltid vite hvordan modellen tolker spørsmålet ditt, eller hvilke data den baserer svaret på. Kontroller alltid resultatene.
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
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Objektivitet</p>
              <h2 className="text-3xl font-bold text-foreground">AI kan arve fordommer fra treningsdata</h2>
              <p className="mt-3 text-muted-foreground">
                AI-modeller kan gjøre feil som følge av skjevheter i treningsdataene. Det kan resultere i stereotype eller ubalanserte svar. Stol aldri blindt på AI.
              </p>
              <div className="mt-6 flex gap-3">
                <Button asChild>
                  <Link to="/privacy">Personvern</Link>
                </Button>
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
      <section id="checklist" className="relative z-10 bg-accent-secondary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-fade-in text-3xl font-bold md:text-4xl">Sjekkliste</h2>
          <p className="section-fade-in-delay-1 mx-auto mt-3 max-w-lg text-primary-foreground/70">
            Bruk sjekklisten vår hver gang du skriver en innlevering med AI-støtte.
          </p>
          <div className="section-fade-in-delay-2 mt-6 flex justify-center gap-3">
            <a
              href="#checklist-section"
              className="rounded-md bg-tertiary px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-105"
            >
              Start
            </a>
            <Link
              to="/tools"
              className="rounded-md border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Verktøy
            </Link>
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
                  className={`cursor-pointer text-sm transition-colors ${checked[i] ? "text-muted-foreground line-through" : "text-card-foreground"
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
          <p className="mt-1 text-sm text-muted-foreground">Kontakt veilederen din eller fagansatte ved universitetet ditt.</p>
          <Link to="#" className="mt-4 inline-flex rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            Kontakt
          </Link>
        </div>
      </section>


      {/* CTA Banner */}
      <section className="relative z-10 bg-accent-secondary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Se det i praksis</h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/70">
            Få et unikt innblikk i prosessene som styrer dagens kunstige intelligens.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/interactive"
              className="rounded-md bg-tertiary px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-105"
            >
              Prøv selv
            </Link>
            <Link
              to="/tools"
              className="rounded-md border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Se verktøy
            </Link>
          </div>
        </div>
      </section>

      {/* Juridiske rammer */}
      <section className="border-t border-border bg-muted/50 py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="section-fade-in mb-6 text-3xl font-bold text-foreground">Juridiske rammer</h2>
          <div className="section-fade-in-delay-1 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              AIGuidebook er utviklet for å hjelpe deg med å forstå AI-bruk i lys av gjeldende retningslinjer og regler.
              Innholdet skal ikke brukes som juridisk rådgivning eller erstatte offisielle retningslinjer fra din utdanningsinstitusjon.
            </p>
            <p>
              Personvernforordningen (GDPR) regulerer hvordan personopplysninger behandles, og dette gjelder også AI-verktøy som behandler slike data.
              Åndsverkloven beskytter opphavsrett, og studenters innleveringer er beskyttet som åndsverk.
            </p>
            <p>
              Universitetsloven inneholder viktige bestemmelser om akademisk integritet. Ved brudd på reglene kan studenter bli utestengt.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Guidelines;
