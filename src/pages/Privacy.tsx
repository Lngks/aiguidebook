import { Link } from "react-router-dom";
import { Shield, Eye, AlertTriangle, Brain, Lock, Fingerprint, ArrowRight, Image as ImageIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const risks = [
  {
    title: "Dataprivatliv",
    icon: Eye,
    description: "Når du bruker AI-verktøy, kan dine inndata bli lagret, brukt til trening, eller delt med tredjeparter.",
    tips: [
      "Unngå å dele personlig eller sensitiv informasjon i AI-spørsmål.",
      "Sjekk verktøyets personvernpolicy før bruk.",
      "Bruk anonymiserte data når mulig.",
    ],
  },
  {
    title: "Bias i AI",
    icon: Brain,
    description: "AI-modeller kan reflektere og forsterke fordommer i treningsdataene, noe som fører til urettferdige eller skjeve resultater.",
    tips: [
      "Kryssreferanse AI-output med mangfoldige, pålitelige kilder.",
      "Vær kritisk til AI-genererte sammendrag og perspektiver.",
      "Rapporter partiske resultater når du møter dem.",
    ],
  },
  {
    title: "Hallusinasjoner",
    icon: AlertTriangle,
    description: "AI kan generere selvsikker, men helt feilaktig informasjon, inkludert falske sitater og oppdiktede fakta.",
    tips: [
      "Alltid verifiser AI-genererte fakta og sitater i originale kilder.",
      "Aldri stol på en AI-generert referanse uten å sjekke at den eksisterer.",
      "Bruk AI for ideer, ikke som primær kilde til sannhet.",
    ],
  },
  {
    title: "Akademisk integritet",
    icon: Shield,
    description: "Å levere AI-generert arbeid som ditt eget kan utgjøre akademisk uredelighet og ha alvorlige konsekvenser.",
    tips: [
      "Sjekk alltid kursets spesifikke retningslinjer for AI-bruk.",
      "Oppgi AI-bruk åpent og ærlig.",
      "Bruk vår sjekkliste i Retningslinjer før innlevering.",
    ],
  },
];

const protectionTips = [
  { icon: Lock, title: "Sterke personverninnstillinger", text: "Velg bort datadeling og trening der det er mulig." },
  { icon: Fingerprint, title: "Unngå PII i spørsmål", text: "Aldri skriv inn passord, student-ID, eller personlige detaljer." },
  { icon: Shield, title: "Bruk institusjonelle verktøy", text: "Foretrekk AI-verktøy fra universitetet — de har ofte bedre dataavtaler." },
];

const faqs = [
  { q: "Hvordan beskytter jeg personvernet mitt?", a: "Les privatlivsvilkårene for alle AI-verktøy du bruker. Ikke del personlige data. Unngå sensitiv informasjon i spørsmål." },
  { q: "Hva er hallusinasjoner i AI?", a: "AI kan generere informasjon som høres riktig ut, men som ikke stemmer. Sjekk alltid mot pålitelige kilder." },
  { q: "Når er det uakseptabelt å bruke KI?", a: "Det er ikke tillatt å bruke KI for å generere svar uten å oppgi det. Sjekk alltid retningslinjene for din oppgave." },
  { q: "Er det plagiat å bruke KI?", a: "Hvis du avslører og siterer ditt AI-bruk, er det vanligvis akseptabelt. Men sjekk retningslinjene for din institusjon." },
  { q: "Hvilken KI-verktøy er billigst?", a: "GitHub Copilot, Microsoft Copilot er gratis for studenter. Andre verktøy varierer i pris." },
  { q: "Er personvernet mitt sikker?", a: "Det avhenger av verktøyet. Bruk bare tjenester du stoler på. Sjekk personvernerklæring for å se hva som lagres." },
];

const Privacy = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="section-fade-in mb-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground/60">Personvern</p>
          <h1 className="section-fade-in text-4xl font-bold md:text-5xl">Personvern & Risikoer</h1>
          <p className="section-fade-in-delay-1 mx-auto mt-4 max-w-xl text-lg text-primary-foreground/70">
            Forstå risikoene ved AI-verktøy — fra dataprivatliv til hallusinasjoner — og lær hvordan du beskytter deg.
          </p>
        </div>
      </section>

      {/* Risk Sections */}
      <section className="container mx-auto px-4 py-20">
        <div className="space-y-8">
          {risks.map((risk, i) => (
            <article
              key={risk.title}
              className={`section-fade-in-delay-${(i % 3) + 1} grid items-start gap-6 rounded-xl border border-border bg-card p-6 shadow-sm md:grid-cols-[auto_1fr] md:p-8`}
            >
              <div className="rounded-lg bg-destructive/10 p-3 text-destructive">
                <risk.icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="mb-2 text-2xl font-bold text-card-foreground">{risk.title}</h2>
                <p className="mb-4 text-muted-foreground">{risk.description}</p>
                <ul className="space-y-2">
                  {risk.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-card-foreground">
                      <Shield className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Protecting Data */}
      <section className="border-y border-border bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="section-fade-in mb-10 text-center text-3xl font-bold text-foreground">Beskyttelse av data</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {protectionTips.map((tip, i) => (
              <div
                key={tip.title}
                className={`section-fade-in-delay-${i + 1} rounded-xl border border-border bg-card p-6 text-center shadow-sm`}
              >
                <div className="mx-auto mb-4 inline-flex rounded-lg bg-accent/10 p-3 text-accent">
                  <tip.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-card-foreground">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-20">
        <div className="section-fade-in mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Spørsmål</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Svar på vanlige spørsmål om personvern og AI-risikoer.
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
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-fade-in text-3xl font-bold md:text-4xl">Bruk KI med omtanke</h2>
          <p className="section-fade-in-delay-1 mx-auto mt-3 max-w-lg text-primary-foreground/70">
            Ansvarlig bruk starter med kunnskap. Les retningslinjene våre.
          </p>
          <div className="section-fade-in-delay-2 mt-6 flex justify-center gap-3">
            <Link to="/guidelines" className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">
              Retningslinjer
            </Link>
            <Link to="/tools" className="rounded-md border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Verktøy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Privacy;
