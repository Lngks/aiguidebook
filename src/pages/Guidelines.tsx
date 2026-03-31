import { useState } from "react";
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
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const toggleItem = (index: number) => {
    setCheckedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
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
            <p className="mb-4 text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary/40">Etikk / Ansvar</p>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1]">
              Bruk AI <span className="text-[#d2bbff]">ansvarlig.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl">
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
            <h2 className="font-bold tracking-tight text-white uppercase tracking-widest px-4">Tre ting du må vite</h2>
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
                  "group relative overflow-hidden rounded-xl border-l-4 bg-card p-8 shadow-sm transition-all hover:bg-[#2A2A2C]",
                  topic.borderColor
                )}
              >
                <div className="mb-6 inline-flex rounded-lg bg-muted p-3 border border-white/5">
                  <topic.icon className={cn("h-6 w-6", topic.iconColor)} />
                </div>
                <h3 className="mb-4 text-xl font-bold text-white">{topic.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-400 font-medium">
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
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Slik bruker du AI korrekt</h2>
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
                  className="flex items-start gap-6 rounded-xl bg-card p-6 border border-white/5 hover:bg-[#2A2A2C] transition-colors"
                >
                  <span className="text-3xl font-bold text-neutral-700 font-mono">{tip.number}</span>
                  <div>
                    <h4 className="mb-2 font-bold text-white uppercase tracking-wide text-sm">{tip.title}</h4>
                    <p className="text-sm text-neutral-400 font-medium">{tip.description}</p>
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
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-white">Kjenn farene</h2>
            <ul className="relative z-10 space-y-6">
              {risks.map((risk, i) => (
                <li key={risk.title} className="flex gap-4">
                  <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                  <p className="text-sm text-neutral-300 font-medium">
                    <strong className="text-white">{risk.title}:</strong> {risk.description}
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
            <div className="grid gap-4 sm:grid-cols-2 md:w-2/3 w-full">
              {checklistItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggleItem(i)}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-xl border transition-all text-left group",
                    checkedItems.includes(i)
                      ? "bg-white text-[#7c3aed] border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      : "bg-white/10 text-white border-white/5 hover:bg-white/20"
                  )}
                >
                  <Checkbox 
                    checked={checkedItems.includes(i)}
                    className={cn(
                      "h-5 w-5 border-2 transition-colors",
                      checkedItems.includes(i) 
                        ? "border-[#7c3aed] data-[state=checked]:bg-[#7c3aed] data-[state=checked]:text-white" 
                        : "border-white/30"
                    )}
                  />
                  <span className={cn(
                    "text-sm font-bold uppercase tracking-wide transition-opacity",
                    checkedItems.includes(i) ? "opacity-100" : "opacity-80"
                  )}>
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">Spørsmål & Svar</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Accordion key={i} type="single" collapsible className="w-full">
                <AccordionItem value={`faq-${i}`} className="border-none mb-2">
                  <AccordionTrigger className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:no-underline hover:bg-white/[0.02] px-6 rounded-xl group data-[state=open]:text-[#d2bbff] border border-white/5">
                    <span className="text-left text-base font-semibold">{faq.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-4">
                    <div className="text-sm sm:text-base text-neutral-400 leading-relaxed bg-[#1b1b1e] p-6 rounded-xl border border-white/5">
                      {faq.a}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Guidelines;
