import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Image as ImageIcon, Code, Edit3, Search, X, MessageSquare, Globe, Sparkles, Languages, PenTool } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrambleText } from "@/components/ScrambleText";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ShieldCheck, TerminalSquare } from "lucide-react";

const featuredTools = [
  {
    name: "Sikt.no",
    description: "Sikre KI-tjenester for utdanningssektoren. Designet for å ivareta personvern og datahåndtering i tråd med norske retningslinjer.",
    link: "https://ki.sikt.no/nb",
    icon: ShieldCheck,
    image: "/tool-logos/sikt.png",
    iconColor: "text-purple-400",
  },
  {
    name: "GitHub Copilot",
    description: "Din KI-parprogrammerer. Forslår kodesnutter og hele funksjoner i sanntid, direkte i din kodeeditor.",
    link: "https://github.com/features/copilot",
    icon: Code,
    image: "/tool-logos/github.svg",
    iconColor: "text-white",
    forceWhite: true,
  },
  {
    name: "Microsoft Copilot",
    description: "Integrert KI-assistent i Microsoft 365-økosystemet. Hjelper med tekstbehandling, analyse og presentasjon.",
    link: "https://copilot.microsoft.com/",
    icon: TerminalSquare,
    image: "/tool-logos/microsoft.svg",
    iconColor: "text-white",
    forceWhite: true,
  },
];

const altTools = [
  {
    id: "claude",
    name: "Claude",
    description: "Kjent for naturlig dialog og avansert resonneringsevne.",
    longDescription: "Claude er kjent for sin naturlige samtalestil og sterke evne til resonnering. Den er spesielt god på å analysere store tekstmengder, skrive kreativt og kode.",
    image: "/tool-logos/claude.svg",
    icon: MessageSquare,
    color: "bg-orange-500/10",
    iconColor: "text-orange-500",
    gradientFrom: "#f97316", // orange-500
    gradientTo: "#c2410c",   // orange-700
    link: "https://claude.ai",
    badgeText: "LLM",
    badgeColor: "bg-emerald-500/10 text-emerald-500",
    actionColor: "text-emerald-500",
    colSpan: "col-span-1",
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Googles mest kapable KI-modell, integrert i deres tjenester.",
    longDescription: "Gemini er integrert i Googles økosystem og er beryktet for sin multimodalitet. Den kan behandle tekst, bilder, video og lyd sømløst.",
    image: "/tool-logos/gemini.svg",
    icon: Sparkles,
    color: "bg-blue-500/10",
    iconColor: "text-blue-500",
    gradientFrom: "#3b82f6", // blue-500
    gradientTo: "#1d4ed8",   // blue-700
    link: "https://gemini.google.com",
    badgeText: "MULTIMODAL",
    badgeColor: "bg-indigo-500/10 text-indigo-400",
    actionColor: "text-yellow-500",
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    description: "En KI-søkemotor som gir kildehenvisninger i sanntid.",
    longDescription: "Perplexity fungerer som en hybrid mellom en søkemotor og en chatbot. Den gir deg svar med direkte kildehenvisninger til nettsider.",
    image: "/tool-logos/perplexity.svg",
    icon: Globe,
    color: "bg-teal-500/10",
    iconColor: "text-teal-500",
    gradientFrom: "#14b8a6", // teal-500
    gradientTo: "#0f766e",   // teal-700
    link: "https://perplexity.ai",
    badgeText: "SØK",
    badgeColor: "bg-lime-500/10 text-lime-500",
    actionColor: "text-lime-500",
    colSpan: "col-span-1",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description: "Markedsledende verktøy for generering av fotorealistiske bilder og digital kunst via Discord.",
    longDescription: "Midjourney er kanskje den mest kunstneriske AI-en for bildegenerering. Den kjører gjennom Discord og skaper fotorealistiske og kunstneriske bilder.",
    image: "/tool-logos/midjourney.svg",
    icon: ImageIcon,
    color: "bg-purple-500/10",
    iconColor: "text-purple-500",
    gradientFrom: "#a855f7", // purple-500
    gradientTo: "#7e22ce",   // purple-700
    link: "https://midjourney.com",
    badgeText: "KREATIV",
    badgeColor: "bg-emerald-500/10 text-emerald-400",
    actionColor: "text-lime-500",
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    id: "deepl",
    name: "DeepL",
    description: "Verdens mest presise oversettelsestjeneste.",
    longDescription: "DeepL overgår ofte Google Translate i nyanse og nøyaktighet. Den er uunnværlig for studenter som jobber med akademiske tekster på tvers av språk.",
    image: "/tool-logos/deepl.svg",
    icon: Languages,
    color: "bg-sky-600/10",
    iconColor: "text-sky-600",
    gradientFrom: "#0284c7", // sky-600
    gradientTo: "#0369a1",   // sky-700
    link: "https://deepl.com",
    badgeText: "SPRÅK",
    badgeColor: "bg-purple-500/10 text-purple-400",
    actionColor: "text-yellow-500",
    colSpan: "col-span-1",
  },
  {
    id: "grammarly",
    name: "Grammarly",
    description: "KI-basert skriveassistent for engelsk tekst.",
    longDescription: "Grammarly hjelper deg med å forbedre grammatikk, rettskriving og toneleie i sanntid. Perfekt for å polere essays og rapporter.",
    image: "/tool-logos/grammarly.svg",
    icon: PenTool,
    color: "bg-green-500/10",
    iconColor: "text-green-500",
    gradientFrom: "#22c55e", // green-500
    gradientTo: "#15803d",   // green-700
    link: "https://grammarly.com",
    badgeText: "SKRIVING",
    badgeColor: "bg-green-500/10 text-green-500",
    actionColor: "text-yellow-500",
    colSpan: "col-span-1",
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

const ExpandableCard = ({ tool, onExpand, index }: { tool: any; onExpand: (id: string) => void; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onExpand(tool.id)}
      className={cn(
        "cursor-pointer group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-card p-6 shadow-sm transition-all hover:bg-[#2A2A2C] border border-white/5 hover:border-white/10 hover:shadow-lg",
        tool.colSpan
      )}
    >
      <div className="flex justify-between items-start mb-12">
        <div className="h-8 w-8 flex-shrink-0">
          {tool.image ? (
            <img src={tool.image} alt={tool.name} className="h-full w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
          ) : (
            <tool.icon className={cn("h-full w-full", tool.iconColor)} />
          )}
        </div>

        {tool.badgeText && (
          <span className={cn("text-[10px] sm:text-xs font-mono font-bold px-2 py-1 rounded-sm tracking-wider uppercase", tool.badgeColor)}>
            {tool.badgeText}
          </span>
        )}
      </div>

      <div className="relative z-10 w-full md:w-2/3 lg:w-3/4">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{tool.name}</h3>
        <p className="text-sm text-neutral-400 line-clamp-2 pr-4">{tool.description}</p>
      </div>

      <div className="h-10" /> {/* Spacer to restore card height */}




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
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-2xl bg-card rounded-2xl p-8 border border-border shadow-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div
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
                  </div>

                  <div className="flex-1">
                    <h3
                      className="text-3xl font-bold text-foreground mb-4"
                    >
                      {selectedTool?.name}
                    </h3>
                    <p
                      className="text-muted-foreground mb-6"
                    >
                      {selectedTool?.description}
                    </p>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Om verktøyet</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedTool?.longDescription}
                      </p>

                      <div className="pt-6">
                        <a
                          href={selectedTool?.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn("inline-flex items-center gap-2 text-sm font-mono font-bold tracking-widest uppercase transition-opacity hover:opacity-80", selectedTool?.actionColor)}
                        >
                          ÅPNE VERKTØY <ArrowRight className="h-4 w-4" />
                        </a>
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
      <section className="relative overflow-hidden bg-background pt-40 pb-32 md:pt-56 border-b border-border/10">
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start text-left"
          >
            <p className="mb-4 text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary/40">Bibliotek / Ressurser</p>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1]">
              Finn de rette <span className="text-[#d2bbff]">verktøyene</span> for din hverdag
            </h1>
            <p className="mt-6 text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl">
              En kuratert samling av KI-tjenester tilpasset dine akademiske behov og institusjonens retningslinjer.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="container mx-auto px-4 py-24 sm:py-32">
        <div className="mb-16 flex flex-col items-start text-left max-w-2xl">
          <p className="mb-3 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#caf300]/80">Anbefalte verktøy</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl tracking-tight">Kvalitetssikrede plattformer</h2>
          <p className="mt-4 text-neutral-400 leading-relaxed">
            Universitetet har valgt ut og vurdert disse plattformene for å sikre trygg og effektiv bruk i utdanningssektoren.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredTools.map((tool, i) => (
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              key={tool.name}
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-card p-8 shadow-sm transition-all hover:bg-[#2A2A2C] border border-white/5"
            >
              <div>
                <div className="mb-10 h-10 w-10 flex-shrink-0">
                  {tool.image ? (
                    <img 
                      src={tool.image} 
                      alt={tool.name} 
                      className={cn(
                        "h-full w-full object-contain transition-all duration-300",
                        tool.forceWhite ? "brightness-0 invert" : "filter grayscale group-hover:grayscale-0"
                      )} 
                    />
                  ) : (
                    <tool.icon className={cn("h-full w-full stroke-[2.5]", tool.iconColor)} />
                  )}
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white tracking-tight">{tool.name}</h3>
                <p className="text-[15px] leading-relaxed text-neutral-400 font-medium pr-4">{tool.description}</p>
              </div>
              <div className="mt-8 flex items-center gap-2 font-mono">
                <span className="text-xs font-bold tracking-widest uppercase text-tertiary">
                  ÅPNE VERKTØY
                </span>
                <ArrowRight className="h-4 w-4 text-tertiary transition-transform group-hover:translate-x-1" />
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Alt verktøy */}
      <section className="border-y border-border bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="section-fade-in mb-12">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Alternativer</p>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Andre verktøy som kan hjelpe deg
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {altTools.map((tool, index) => (
              <ExpandableCard
                key={tool.id}
                tool={tool}
                index={index}
                onExpand={(id) => setExpandedId(id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-24 sm:py-32 border-t border-border/10">
        <div className="mb-16 flex flex-col items-start text-left max-w-2xl">
          <p className="mb-3 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-primary/40">Ofte stilte spørsmål</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl tracking-tight">Det du måtte lure på</h2>
        </div>
        <div className="mx-auto max-w-none">
          <div className="grid gap-x-12 md:grid-cols-2">
            {faqs.map((faq, i) => (
              <Accordion key={i} type="single" collapsible className="w-full">
                <AccordionItem value={`faq-${i}`} className="border-none mb-2">
                  <AccordionTrigger className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:no-underline hover:bg-white/[0.02] px-4 rounded-lg group data-[state=open]:text-[#d2bbff]">
                    <span className="text-left text-sm sm:text-base font-semibold transition-colors">{faq.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-6 pt-2">
                    <div className="text-sm sm:text-base text-neutral-400 leading-relaxed bg-[#1b1b1e] p-6 rounded-xl border border-white/5">
                      {faq.a}
                    </div>
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
          Kontakt oss
        </Link>
      </section>
    </>
  );
};

export default Tools;
