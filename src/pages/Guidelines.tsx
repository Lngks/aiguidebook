import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  PenTool,
  IterationCcw,
  Search,
  Mic,
  AlertTriangle,
  AlertCircle,
  CheckSquare,
  ChevronDown,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ScrambleText } from "@/components/ScrambleText";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const keyTopics = [
  {
    title: "Akseptabel bruk",
    description: "AI skal brukes som en veileder, ikke en erstatning. Bruk det til idémyldring, forklaring av komplekse konsepter eller koding-assistanse.",
    icon: ShieldCheck,
    borderColor: "border-primary",
    iconColor: "text-primary",
  },
  {
    title: "Personvern",
    description: "Del aldri sensitive data, personopplysninger eller upublisert forskning med kommersielle AI-modeller. Din data er ditt ansvar.",
    icon: Lock,
    borderColor: "border-tertiary",
    iconColor: "text-tertiary",
  },
  {
    title: "Akademisk integritet",
    description: "All bruk av AI skal oppgis. Å lime inn tekst generert av AI uten kildehenvisning regnes som fusk. Vær transparent om dine metoder.",
    icon: PenTool,
    borderColor: "border-[#caf300]",
    iconColor: "text-[#caf300]",
  },
];

const usageTips = [
  {
    number: "01",
    title: "Iterativ Prompting",
    description: "Ikke nøy deg med første svar. Gi oppfølgingsspørsmål for å drøfte nyanser og be om ulike perspektiver.",
  },
  {
    number: "02",
    title: "Kildekritikk",
    description: "AI-modeller kan hallusinere fakta. Verifiser alltid påstander mot troverdige, faglige kilder.",
  },
  {
    number: "03",
    title: "Stemmestyring",
    description: "Bruk AI til å polere ditt eget språk, men behold din unike stemme og dine egne argumenter.",
  },
];

const risks = [
  {
    title: "Ekko-kamre",
    description: "AI kan forsterke dine egne fordommer om du ikke ber den utfordre deg.",
  },
  {
    title: "Manglende logikk",
    description: "Modeller forstår ikke årsakssammenheng, de forutsier bare neste ord.",
  },
  {
    title: "Utdatert info",
    description: "Mange modeller har en kunnskapsstopp som gjør dem upålitelige for dagsaktuelle saker.",
  },
];

const checklistItems = [
  "Har jeg opplyst om AI-bruk?",
  "Er alle kilder verifisert manuelt?",
  "Inneholder teksten min stemme?",
  "Er metoden beskrevet i vedlegg?",
];

const faqs = [
  {
    q: "Er det lov å bruke ChatGPT til eksamen?",
    a: "Dette avhenger av emnebeskrivelsen din. Noen emner tillater alle hjelpemidler, mens andre har strikte forbud. Sjekk alltid emneguiden din på Canvas før du starter.",
  },
  {
    q: "Hvordan refererer jeg til AI-generert innhold?",
    a: "Du bør oppgi hvilket verktøy som er brukt, datoen det ble brukt, og hvilke spørsmål (prompter) du stilte. Følg institusjonens spesifikke retningslinjer for kildehenvisning.",
  },
  {
    q: "Kan læreren se om jeg har brukt AI?",
    a: "Det finnes deteksjonsverktøy, men de er ikke 100% pålitelige. Det viktigste er å være ærlig og transparent om din bruk av AI-verktøy.",
  },
];

const Guidelines = () => {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const leftCardRef = useRef<HTMLDivElement>(null);
  const leftCardInView = useInView(leftCardRef, { margin: "-35% 0px -35% 0px" });

  const rightCardRef = useRef<HTMLDivElement>(null);
  const rightCardInView = useInView(rightCardRef, { margin: "-35% 0px -35% 0px" });

  const [announcement, setAnnouncement] = useState("");

  const toggleItem = (index: number) => {
    const isChecking = !checkedItems.includes(index);
    const itemName = checklistItems[index];

    setCheckedItems(prev =>
      isChecking
        ? [...prev, index]
        : prev.filter(i => i !== index)
    );

    setAnnouncement(`${isChecking ? "Markert som fullført" : "Avmarkert"}: ${itemName}`);

    // Clear announcement after a delay so it can be re-announced if needed
    setTimeout(() => setAnnouncement(""), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background pt-40 pb-32 md:pt-56 border-b border-border/10">
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start text-left"
          >
            <div className="uppercase tracking-[0.2em] text-stitch-secondary font-medium mb-4 flex items-center gap-2 text-sm">
              <span className="w-8 h-[1px] bg-stitch-secondary"></span>
              Etikk & Ansvar
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[1.1]">
              Bruk AI <span className="text-stitch-primary">ansvarlig.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Kunstig intelligens er en kraftig partner i læringsprosessen, men krever kritisk tenkning og etisk bevissthet. Her finner du rammeverket for korrekt bruk.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-24">
        {/* Tre ting du må vite */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12 text-center text-xs">
            <div className="h-px flex-grow bg-border/40"></div>
            <h2 className="font-bold tracking-tight text-foreground uppercase tracking-widest px-4">Tre ting du må vite</h2>
            <div className="h-px flex-grow bg-border/40"></div>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {keyTopics.map((topic, i) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={cn(
                  "group relative overflow-hidden rounded-xl border-l-4 bg-card p-8 shadow-sm transition-all hover:bg-muted",
                  topic.borderColor
                )}
              >
                <div className="mb-6 inline-flex">
                  <topic.icon className={cn("h-8 w-8", topic.iconColor)} />
                </div>
                <h3 className="mb-4 text-xl font-bold text-foreground">{topic.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                  {topic.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bento Layout: Tips & Risks */}
        <div className="grid gap-8 lg:grid-cols-5 mb-32">
          {/* AI Usage Tips (3/5 width) */}
          <section className="lg:col-span-3 space-y-8">
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Slik bruker du AI korrekt</h2>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#caf300]/80">Best practices</span>
            </div>
            <div className="space-y-4">
              {usageTips.map((tip, i) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-6 rounded-xl bg-card p-6 border border-border hover:bg-muted transition-colors"
                >
                  <span className="text-3xl font-bold text-foreground font-mono">{tip.number}</span>
                  <div>
                    <h4 className="mb-2 font-bold text-foreground uppercase tracking-wide text-sm">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground font-medium">{tip.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Risks (2/5 width) */}
          <section className="relative overflow-hidden rounded-xl bg-destructive/5 border border-destructive/20 p-8 lg:col-span-2">
            <div className="absolute -right-8 -top-8 opacity-5">
              <AlertTriangle className="h-40 w-40 text-destructive" />
            </div>
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">Kjenn farene</h2>
            <ul className="relative z-10 space-y-6">
              {risks.map((risk, i) => (
                <li key={risk.title} className="flex gap-4">
                  <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                  <p className="text-sm text-muted-foreground font-medium">
                    <strong className="text-foreground">{risk.title}:</strong> {risk.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Checklist for Students */}
        <section className="relative mb-32 overflow-hidden rounded-3xl bg-[#7c3aed] p-12 text-white">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl"></div>
          </div>
          <div className="relative z-10 flex flex-col gap-12 md:flex-row items-center">
            <div className="md:w-1/3">
              <h2 className="mb-4 text-3xl font-bold leading-tight md:text-4xl text-white">Sjekkliste før innlevering</h2>
              <p className="text-white/80 font-medium">Gå gjennom disse punktene før du sender inn arbeidet ditt for å sikre full overholdelse av reglementet.</p>
            </div>
            <div className="md:w-2/3 w-full relative">
              <div
                className="sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {announcement}
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 w-full" role="group" aria-label="Sjekkliste før innlevering">
                {checklistItems.map((item, i) => (
                  <li key={i}>
                    <label
                      className={cn(
                        "flex items-center gap-4 p-5 rounded-xl border transition-all text-left group cursor-pointer h-full",
                        checkedItems.includes(i)
                          ? "bg-white text-[#7c3aed] border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                          : "bg-white/15 text-white border-white/20 hover:bg-white/25"
                      )}
                    >
                      <Checkbox
                        id={`checklist-item-${i}`}
                        checked={checkedItems.includes(i)}
                        onCheckedChange={() => toggleItem(i)}
                        className={cn(
                          "h-5 w-5 border-2 transition-colors",
                          checkedItems.includes(i)
                            ? "border-[#7c3aed] data-[state=checked]:bg-[#7c3aed] data-[state=checked]:text-white"
                            : "border-white/30"
                        )}
                      />
                      <span className={cn(
                        "text-sm font-bold uppercase tracking-wide transition-opacity",
                        checkedItems.includes(i) ? "opacity-100" : "text-white opacity-100"
                      )}>
                        {item}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* APA Reference Examples */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12 text-center text-xs">
            <div className="h-px flex-grow bg-border/40"></div>
            <h2 className="font-bold tracking-tight text-foreground uppercase tracking-widest px-4">Kildereferanser / APA 7</h2>
            <div className="h-px flex-grow bg-border/40"></div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              ref={leftCardRef}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className={cn(
                "relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-colors duration-500",
                leftCardInView ? "border-[#7c3aed]/50" : "border-border"
              )}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-black text-foreground tracking-tight">I teksten</h3>
                <span className="rounded-full bg-[#7c3aed]/10 px-3 py-1 text-[10px] uppercase font-bold font-mono tracking-widest text-[#7c3aed] border border-[#7c3aed]/20">In-text</span>
              </div>
              <p className="mb-8 text-sm leading-relaxed font-medium text-muted-foreground">
                Når du bruker AI-generert innhold, enten som støtte for argumentasjon eller som direkte sitat, skal kilden oppgis i parentes rett i teksten.
              </p>
              <div className="relative rounded-xl bg-muted/30 p-6 border border-border/50 backdrop-blur-sm">
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1 bg-[#7c3aed] rounded-l-xl transition-opacity duration-500",
                  leftCardInView ? "opacity-100" : "opacity-50"
                )}></div>
                <div className="space-y-6 relative pl-2">
                  <div>
                    <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider mb-2">Generelt Format</p>
                    <p className="font-mono text-sm text-foreground bg-background rounded-lg p-3 border border-border/50 shadow-sm">
                      (Skaper, Årtall)
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold text-[#7c3aed] uppercase tracking-wider mb-2">Eksempler</p>
                    <div className="space-y-3 font-mono text-xs md:text-sm text-foreground bg-background rounded-lg p-4 border border-border/50 shadow-sm leading-relaxed">
                      <p>
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider mb-1">Parafrasering:</span>
                        Læringseffekten forbedres bemerkelsesverdig med hyppig interaksjon <span className="text-[#7c3aed] font-bold">(OpenAI, 2024)</span>.
                      </p>
                      <div className="h-px bg-border/50 my-3"></div>
                      <p>
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider mb-1">Direkte sitat:</span>
                        "Bruk AI-verktøy som diskusjonspartner" <span className="text-[#7c3aed] font-bold">(Anthropic, 2024)</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              ref={rightCardRef}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn(
                "relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-colors duration-500",
                rightCardInView ? "border-[#7c3aed]/50 dark:border-[#caf300]/50" : "border-border"
              )}
            >
              <div className={cn(
                "absolute -right-4 -top-4 transition-opacity duration-500 pointer-events-none",
                rightCardInView ? "opacity-10" : "opacity-[0.03]"
              )}>
                <BookOpen className="h-40 w-40 text-[#7c3aed] dark:text-[#caf300]" />
              </div>
              <div className="mb-6 flex items-center justify-between relative z-10">
                <h3 className="text-2xl font-black text-foreground dark:text-white tracking-tight">Kildelisten</h3>
                <span className="rounded-full bg-[#7c3aed]/10 dark:bg-[#caf300]/10 px-3 py-1 text-[10px] uppercase font-bold font-mono tracking-widest text-[#7c3aed] dark:text-[#caf300] border border-[#7c3aed]/20 dark:border-[#caf300]/20">Reference</span>
              </div>
              <p className="mb-8 text-sm leading-relaxed font-medium text-muted-foreground dark:text-zinc-400 relative z-10">
                I kildelisten/referanselisten skal du oppgi skaper, år, modellens navn, versjon, format og direkte url til modellen.
              </p>
              <div className="relative rounded-xl bg-muted/30 p-6 border border-border/50 backdrop-blur-sm z-10">
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1 bg-[#7c3aed] dark:bg-[#caf300] rounded-l-xl transition-opacity duration-500",
                  rightCardInView ? "opacity-100" : "opacity-50"
                )}></div>
                <div className="space-y-6 relative pl-2">
                  <div>
                    <p className="text-[10px] font-mono font-bold text-muted-foreground dark:text-zinc-500 uppercase tracking-wider mb-2">Generelt Format</p>
                    <p className="font-mono text-sm text-foreground bg-background rounded-lg p-3 border border-border/50 shadow-sm">
                      Skaper. (År). <i>Modellens navn</i> (Versjon) [Stor språkmodell]. URL
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold text-[#7c3aed] dark:text-[#caf300] uppercase tracking-wider mb-2">Eksempler</p>
                    <div className="space-y-4 font-mono text-xs md:text-sm text-foreground bg-background rounded-lg p-4 border border-border/50 shadow-sm leading-relaxed">
                      <div>
                        OpenAI. (2024). <i>ChatGPT</i> (14. mars-versjon) [Stor språkmodell].
                        <a href="#" className="text-[#7c3aed]/70 dark:text-[#caf300]/70 hover:text-[#7c3aed] dark:hover:text-[#caf300] transition-colors block mt-1 break-all">https://chat.openai.com/</a>
                      </div>
                      <div className="h-px bg-border/50 dark:bg-zinc-800/80 my-3"></div>
                      <div>
                        Anthropic. (2024). <i>Claude</i> (3.5 Sonnet) [Stor språkmodell].
                        <a href="#" className="text-[#7c3aed]/70 dark:text-[#caf300]/70 hover:text-[#7c3aed] dark:hover:text-[#caf300] transition-colors block mt-1 break-all">https://claude.ai/</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">Spørsmål & Svar</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-stitch-outline-variant/30 rounded-lg px-6 bg-stitch-surface-container-low data-[state=open]:bg-stitch-surface-container-highest/50 transition-colors">
                <AccordionTrigger className="text-lg font-medium hover:no-underline hover:text-stitch-primary data-[state=open]:text-stitch-primary transition-colors py-6 text-stitch-on-surface">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-stitch-on-surface-variant text-sm leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
    </div>
  );
};

export default Guidelines;
