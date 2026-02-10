import { Link } from "react-router-dom";
import { ArrowRight, Image as ImageIcon, Code, Edit3, Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const featuredTools = [
  {
    name: "Sikt.no for kilder og sitater",
    description: "Søk gjennom norske forskningskilder og få sitater direkte.",
    icon: Search,
  },
  {
    name: "GitHub Copilot for koding",
    description: "AI-hjelp med programmering og kodeassistert utvikling.",
    icon: Code,
  },
  {
    name: "Microsoft Copilot for skriving",
    description: "Skriv bedre tekster og få støtte i skriveprosessen.",
    icon: Edit3,
  },
];

const altTools = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  name: `Verktøy ${i + 1}`,
}));

const faqs = [
  { q: "Koster disse verktøyene penger?", a: "Nei, mange. GitHub Copilot og Microsoft Copilot er tilgjengelige gratis for studenter. Andre verktøy varierer." },
  { q: "Hvordan beskytter jeg personvernet mitt?", a: "Les privatlivsvilkårene. Ikke del personlige data med AI-verktøy. Unngå å sende sensitiv informasjon." },
  { q: "Hva er hallusinasjoner i AI?", a: "AI kan generere informasjon som låter riktig men som ikke er korrekt. Verifiser alltid mot pålitelige kilder." },
  { q: "Når er det akseptabelt å bruke KI?", a: "Det avhenger av hva du trenger. Still AI er best for kilder, GitHub Copilot for koding, og Microsoft Copilot for skriving. Eksperimenter med ulike verktøy og se hva som fungerer best for dine studier." },
  { q: "Hvilken KI bør jeg velge?", a: "Det avhenger av hva du trenger. Still AI er best for kilder, GitHub Copilot for koding, og Microsoft Copilot for skriving." },
  { q: "Hvordan bruker jeg AI til læring?", a: "AI kan gi deg enklere forklaringer. Stille prøvespørsmål, lage quizer. Men bruk det som et verktøy." },
];

const Tools = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="section-fade-in mb-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground/60">Verktøy</p>
          <h1 className="section-fade-in text-4xl font-bold md:text-5xl">AI for studier</h1>
          <p className="section-fade-in-delay-1 mx-auto mt-4 max-w-xl text-lg text-primary-foreground/70">
            Lær hvilke verktøy som fungerer best og hvordan du bruker dem riktig.
          </p>
          <div className="section-fade-in-delay-2 mt-6 flex justify-center gap-3">
            <button className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground">Utforsk</button>
            <button className="rounded-md border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground">Retningslinjer</button>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="container mx-auto px-4 py-20">
        <div className="section-fade-in mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Anbefalte</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Verktøy som fungerer</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Universitetet har valgt disse plattformene for deg.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredTools.map((tool, i) => (
            <div
              key={tool.name}
              className={`section-fade-in-delay-${i + 1} group relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground shadow-md transition-all hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary-foreground/10 p-3">
                <tool.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold">{tool.name}</h3>
              <p className="mb-4 text-sm text-primary-foreground/70">{tool.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors group-hover:text-accent/80">
                Besøk <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Alt verktøy */}
      <section className="border-y border-border bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="section-fade-in mb-12 grid gap-6 md:grid-cols-2 md:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Alternativer</p>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Andre verktøy som kan hjelpe deg
              </h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Disse plattformene tilbyr ulike styrker. Velg det som passer best for dine behov og oppgaver.
              </p>
              <div className="mt-3 flex justify-end gap-3">
                <Link to="/guidelines" className="text-sm font-medium text-foreground">Utforsk</Link>
                <Link to="#" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Mer <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {altTools.map((tool) => (
              <div key={tool.id} className="flex aspect-[4/3] items-center justify-center rounded-xl bg-card shadow-sm">
                <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
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
            Her finner du svar på det du lurer på om KI-verktøy og ansvarlig bruk.
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

      {/* Trenger du mer hjelp */}
      <section className="container mx-auto px-4 pb-10 text-center">
        <h3 className="text-2xl font-bold text-foreground">Trenger du mer hjelp?</h3>
        <p className="mt-2 text-muted-foreground">Les mer på våre retningslinjer eller kontakt ditt universitet.</p>
        <Link to="/guidelines" className="mt-4 inline-flex rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
          Kontakt
        </Link>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-fade-in text-3xl font-bold md:text-4xl">Bruk KI med omtanke</h2>
          <p className="section-fade-in-delay-1 mx-auto mt-3 max-w-lg text-primary-foreground/70">
            Ansvarlig bruk starter med kunnskap. Les retningslinjene våre før du begynner.
          </p>
          <div className="section-fade-in-delay-2 mt-6 flex justify-center gap-3">
            <Link to="/guidelines" className="rounded-md border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10">
              Les
            </Link>
            <Link to="/privacy" className="rounded-md border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10">
              Hjelp
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Tools;
