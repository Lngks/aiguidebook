import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Image as ImageIcon, Code, Edit3, Search, X, MessageSquare, Globe, Sparkles, Languages, PenTool } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DarkVeil from "@/components/DarkVeil/DarkVeil";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const featuredTools = [
  {
    name: "Sikt.no for kilder og sitater",
    description: "Søk gjennom norske forskningskilder og få sitater direkte.",
    link: "https://ki.sikt.no/nb",
    icon: Search,
  },
  {
    name: "GitHub Copilot for koding",
    description: "AI-hjelp med programmering og kodeassistert utvikling.",
    link: "https://github.com/features/copilot",
    icon: Code,
  },
  {
    name: "Microsoft Copilot for skriving",
    description: "Skriv bedre tekster og få støtte i skriveprosessen.",
    link: "https://copilot.microsoft.com/",
    icon: Edit3,
  },
];

const altTools = [
  {
    id: "claude",
    name: "Claude",
    description: "Avansert samtale-AI fra Anthropic.",
    longDescription: "Claude er kjent for sin naturlige samtalestil og sterke evne til resonnering. Den er spesielt god på å analysere store tekstmengder, skrive kreativt og kode.",
    image: "/tool-logos/claude.svg",
    icon: MessageSquare,
    color: "bg-orange-500/10",
    iconColor: "text-orange-500",
    link: "https://claude.ai"
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Googles kraftigste AI-modell.",
    longDescription: "Gemini er integrert i Googles økosystem og er beryktet for sin multimodalitet. Den kan behandle tekst, bilder, video og lyd sømløst.",
    image: "/tool-logos/gemini.svg",
    icon: Sparkles,
    color: "bg-blue-500/10",
    iconColor: "text-blue-500",
    link: "https://gemini.google.com"
  },
  {
    id: "perplexity",
    name: "Perplexity",
    description: "AI-drevet søkemotor med kilder.",
    longDescription: "Perplexity fungerer som en hybrid mellom en søkemotor og en chatbot. Den gir deg svar med direkte kildehenvisninger til nettsider.",
    image: "/tool-logos/perplexity.svg",
    icon: Globe,
    color: "bg-teal-500/10",
    iconColor: "text-teal-500",
    link: "https://perplexity.ai"
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description: "Banebrytende AI-bildegenerering.",
    longDescription: "Midjourney er kanskje den mest kunstneriske AI-en for bildegenerering. Den kjører gjennom Discord og skaper fotorealistiske og kunstneriske bilder.",
    image: "/tool-logos/midjourney.svg",
    icon: ImageIcon,
    color: "bg-purple-500/10",
    iconColor: "text-purple-500",
    link: "https://midjourney.com"
  },
  {
    id: "deepl",
    name: "DeepL",
    description: "Verdens beste AI-oversettelse.",
    longDescription: "DeepL overgår ofte Google Translate i nyanse og nøyaktighet. Den er uunnværlig for studenter som jobber med akademiske tekster på tvers av språk.",
    image: "/tool-logos/deepl.svg",
    icon: Languages,
    color: "bg-sky-600/10",
    iconColor: "text-sky-600",
    link: "https://deepl.com"
  },
  {
    id: "grammarly",
    name: "Grammarly",
    description: "AI-assistent for skriving og retting.",
    longDescription: "Grammarly hjelper deg med å forbedre grammatikk, rettskriving og toneleie i sanntid. Perfekt for å polere essays og rapporter.",
    image: "/tool-logos/grammarly.svg",
    icon: PenTool,
    color: "bg-green-500/10",
    iconColor: "text-green-500",
    link: "https://grammarly.com"
  },
];

const faqs = [
  { q: "Koster disse verktøyene penger?", a: "Ikke nødvendigvis. GitHub Copilot og Microsoft Copilot er tilgjengelige gratis for studenter. Andre verktøy varierer i pris." },
  { q: "Hvordan beskytter jeg personvernet mitt?", a: "Les personvernvilkårene. Ikke del personlige data med AI-verktøy, og unngå å sende sensitiv informasjon." },
  { q: "Hva er hallusinasjoner i AI?", a: "AI kan generere informasjon som høres riktig ut, men som ikke stemmer. Verifiser alltid mot pålitelige kilder." },
  { q: "Når er det akseptabelt å bruke AI?", a: "Det avhenger av oppgaven og institusjonens retningslinjer. Sjekk alltid hva som er tillatt før du bruker AI-verktøy i akademisk arbeid." },
  { q: "Hvilket AI-verktøy bør jeg velge?", a: "Det avhenger av behovet ditt. Sikt.no er bra for kilder, GitHub Copilot for koding, og Microsoft Copilot for skriving." },
  { q: "Hvordan bruker jeg AI til læring?", a: "AI kan gi deg enklere forklaringer, stille prøvespørsmål og lage quizer. Men bruk det som et støtteverktøy, ikke som en erstatning for egen læring." },
];

const ExpandableCard = ({ tool, onExpand }: { tool: any; onExpand: (id: string) => void }) => {
  return (
    <motion.div
      layoutId={`card-${tool.id}`}
      onClick={() => onExpand(tool.id)}
      className="cursor-pointer group relative flex flex-col items-center justify-center rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md border border-border/50"
    >
      <motion.div
        layoutId={`icon-bg-${tool.id}`}
        className={cn("mb-4 inline-flex rounded-lg p-3", tool.color)}
      >
        {tool.image ? (
          <img
            src={tool.image}
            alt={tool.name}
            className="h-8 w-8 object-contain"
          />
        ) : (
          <tool.icon className={cn("h-8 w-8", tool.iconColor)} />
        )}
      </motion.div>
      <motion.h3 layoutId={`title-${tool.id}`} className="text-lg font-bold text-foreground">{tool.name}</motion.h3>
      <motion.p layoutId={`desc-${tool.id}`} className="mt-2 text-center text-sm text-muted-foreground line-clamp-2">
        {tool.description}
      </motion.p>
    </motion.div>
  );
};

const Tools = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const selectedTool = altTools.find(t => t.id === expandedId);

  return (
    <>
      <div className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none",
        expandedId ? "pointer-events-auto" : ""
      )}>
        <AnimatePresence>
          {expandedId && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setExpandedId(null)}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              />
              <motion.div
                layoutId={`card-${expandedId}`}
                className="relative w-full max-w-2xl bg-card rounded-2xl p-8 border border-border shadow-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <motion.div
                    layoutId={`icon-bg-${expandedId}`}
                    className={cn("inline-flex rounded-xl p-6", selectedTool?.color)}
                  >
                    {selectedTool?.image ? (
                      <img
                        src={selectedTool.image}
                        alt={selectedTool.name}
                        className="h-12 w-12 object-contain"
                      />
                    ) : (
                      selectedTool && <selectedTool.icon className={cn("h-12 w-12", selectedTool.iconColor)} />
                    )}
                  </motion.div>

                  <div className="flex-1">
                    <motion.h3
                      layoutId={`title-${expandedId}`}
                      className="text-3xl font-bold text-foreground mb-4"
                    >
                      {selectedTool?.name}
                    </motion.h3>
                    <motion.p
                      layoutId={`desc-${expandedId}`}
                      className="text-muted-foreground mb-6"
                    >
                      {selectedTool?.description}
                    </motion.p>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Om verktøyet</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedTool?.longDescription}
                      </p>

                      <div className="pt-6">
                        <Button asChild className="w-full md:w-auto">
                          <a href={selectedTool?.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                            Besøk nettside <ArrowRight className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary py-32 text-primary-foreground">
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
          <p className="section-fade-in mb-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground/60">Verktøy</p>
          <h1 className="section-fade-in text-4xl font-bold md:text-5xl">AI for studier</h1>
          <p className="section-fade-in-delay-1 mx-auto mt-4 max-w-xl text-lg text-primary-foreground/70">
            Lær hvilke verktøy som fungerer best og hvordan du bruker dem riktig.
          </p>
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
            <a
              key={tool.name}
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`section-fade-in-delay-${i + 1} group relative block overflow-hidden rounded-xl bg-muted/50 p-6 text-primary-foreground shadow-md transition-all hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary-foreground/10 p-3">
                <tool.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold">{tool.name}</h3>
              <p className="mb-4 text-sm text-primary-foreground/70">{tool.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-tertiary transition-colors group-hover:text-tertiary/90">
                Besøk <ArrowRight className="h-3 w-3" />
              </span>
            </a>
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {altTools.map((tool) => (
              <ExpandableCard
                key={tool.id}
                tool={tool}
                onExpand={(id) => setExpandedId(id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-20">
        <div className="section-fade-in mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Spørsmål</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Her finner du svar på det du lurer på om AI-verktøy og ansvarlig bruk.
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
        <p className="mt-2 text-muted-foreground">Les våre retningslinjer eller kontakt universitetet ditt.</p>
        <Link to="/guidelines" className="mt-4 inline-flex rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
          Kontakt
        </Link>
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
              to="/guidelines"
              className="rounded-md border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Retningslinjer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Tools;
