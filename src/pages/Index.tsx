
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Lightbulb, Wrench, Image as ImageIcon } from "lucide-react";
import DarkVeil from "@/components/DarkVeil/DarkVeil";
import ParallaxSection from "@/components/ParallaxSection";
import AsciiHero from "@/components/AsciiHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const overviewCards = [
  {
    title: "Klare retningslinjer",
    description: "Vit hva som er lov og hva som ikke er det. Tydelig informasjon om dine rettigheter og plikter.",
    icon: FileText,
  },
  {
    title: "Praktiske eksempler",
    description: "Se hvordan ansvarlig AI-bruk ser ut i praksis, dag etter dag.",
    icon: Lightbulb,
  },
  {
    title: "Verktøy som virker",
    description: "Teknologi og tips du kan ta i bruk med én gang i studiene dine.",
    icon: Wrench,
  },
];

const trustCards = [
  {
    label: "Regler",
    title: "Forstå reglene som gjelder",
    description: "Få god oversikt over hva som er lov og hva som ikke er det i studiene dine.",
    path: "/guidelines",
  },
  {
    label: "Integritet",
    title: "Hold det akademiske arbeidet ærlig",
    description: "Lær på din egen måte uten å gå på kompromiss med integriteten din.",
    path: "/guidelines",
  },
  {
    label: "Praktisk",
    title: "Lær hvordan AI faktisk fungerer",
    description: "Praktiske verktøy og forklaringer om hvordan AI-verktøy egentlig virker.",
    path: "/tools",
  },
];

const faqs = [
  {
    q: "Kan jeg bruke AI til oppgaven?",
    a: "Det kommer an på hva oppgaven krever. Noen ganger er AI-bruk greit, andre ganger ikke. Snakk med faglærer og sjekk institusjonens retningslinjer.",
  },
  {
    q: "Kan AI «lære» partisk?",
    a: "Ja. AI trener på data som kan inneholde fordommer. Det kan gjøre svarene ubalanserte eller stereotype. Vær kritisk og sjekk alltid informasjonen.",
  },
  {
    q: "Hva er hallusinasjoner i AI?",
    a: "AI kan generere informasjon som høres riktig ut, men som er feil eller oppdiktet. Verifiser alltid fakta og kilder mot pålitelige kilder.",
  },
  {
    q: "Hvor trygge er dataene mine?",
    a: "Det er viktig å forstå hva som skjer med dataene dine. Ikke del personlig informasjon med AI-verktøy, og les alltid personvernvilkårene.",
  },
  {
    q: "Hvor havner dataene mine?",
    a: "Les personvernerklæringen til verktøyet. Noen AI-verktøy lagrer dataene dine for trening. Sjekk innstillingene dine.",
  },
  {
    q: "Hva hvis jeg glemmer å oppgi AI-bruk?",
    a: "Det kan regnes som brudd på akademisk integritet. Oppgi alltid AI-bruk for å unngå konsekvenser.",
  },
  {
    q: "Er det plagiat å bruke AI?",
    a: "Ikke nødvendigvis. Men du må oppgi at du har brukt AI i oppgaven, ellers kan det få konsekvenser.",
  },
  {
    q: "Hvordan sjekker jeg AI-svar?",
    a: "Bruk kilder du stoler på. Se etter sammenheng i informasjonen. Dobbeltsjekk fakta og sitater.",
  },
  {
    q: "Hvilket AI-verktøy er billigst?",
    a: "Det finnes mange gratisalternativer. Prøv GitHub Copilot og Microsoft Copilot, som har gratis studentkontoer. Andre verktøy varierer i pris.",
  },
  {
    q: "Hvordan bruker jeg AI til læring?",
    a: "AI kan gi deg enklere forklaringer, stille prøvespørsmål og lage quizer. Men bruk det som et verktøy, ikke som en erstatning for å lære selv.",
  },
  {
    q: "Er personvernet mitt ivaretatt?",
    a: "Det avhenger av verktøyet. Bruk bare tjenester du stoler på, og sjekk personvernerklæringen for å se hva som lagres.",
  },
];

const Index = () => {
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroContentOpacity, setHeroContentOpacity] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const sectionHeight = heroRef.current.offsetHeight;
      // Use scrollY since sticky element's rect.top is always 0
      const scrolled = window.scrollY;
      const opacity = Math.max(0, 1 - scrolled / (sectionHeight * 0.6));
      setHeroContentOpacity(opacity);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Hero — sticky, stays behind */}
      <div ref={heroRef} className="sticky top-0 z-0">
        <section className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden bg-secondary pb-32 pt-20 text-primary-foreground md:pb-48 md:pt-28">
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
          <div
            className="container relative z-10 mx-auto px-4 transition-opacity duration-100"
            style={{ opacity: heroContentOpacity }}
          >
            <div className="relative grid items-center gap-10 md:grid-cols-[1fr_minmax(0,480px)]">
              {/* ASCII — hidden on mobile, right column on desktop */}
              {!isMobile && (
                <div className="relative order-2 h-full min-h-[600px]">
                  <AsciiHero />
                </div>
              )}

              <div className="relative z-10 text-center md:text-left md:order-1">
                <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                  Lær å bruke AI ansvarlig
                </h1>
                <p className="mb-8 mx-auto max-w-lg text-lg text-muted-foreground md:mx-0">
                  AI er her. Å vite hvordan du bruker det riktig betyr alt. AI Guidebook gir deg klare svar om hva som
                  er tillatt, hvordan du beskytter dataene dine, og hvordan du ivaretar akademisk integritet.
                </p>
                <div className="flex justify-center gap-3 md:justify-start">
                  <Link
                    to="/guidelines"
                    className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition-transform hover:scale-105"
                  >
                    Start
                  </Link>
                  <Link
                    to="/tools"
                    className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    Les mer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Separator line + decorative tab — static, NOT inside any animated container */}
      <div className="relative z-20">
        <div className="absolute top-0 left-0 w-full h-px bg-border/20" />
        <div className="absolute top-[-31px] left-1/2 -translate-x-1/2 w-[1040px] h-[32px] pointer-events-none">
          <svg
            viewBox="0 0 640 48"
            preserveAspectRatio="none"
            className="w-full h-full text-background fill-current"
          >
            <path d="M0 48 L 180 48 C 220 48 240 0 280 0 L 360 0 C 400 0 420 48 460 48 L 640 48 Z" />
          </svg>
          {/* Accent Line */}
          <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-12 h-0 bg-primary/30 rounded-full blur-[0.5px]" />
        </div>
      </div>

      {/* Tre ting du må vite — scrolls OVER hero */}
      <section className="relative z-10 bg-background px-4 pt-10 pb-20">

        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Hovedpoengene
            </p>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Tre ting du må vite</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Vi bryter ned det kompliserte og gjør det enkelt. Ingen forvirrende fagord, bare svar du kan stole på.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {overviewCards.map((card) => (
              <div key={card.title} className="text-center">
                <div className="mx-auto mb-4 inline-flex rounded-lg p-3 text-muted-foreground">
                  <card.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center gap-3">
            <Link
              to="/guidelines"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Utforsk
            </Link>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Alle verktøy <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bruk AI med tillit — transparent, hero background shows through */}
      <ParallaxSection speed={0.15} className="relative z-[5]">
        <section className="relative py-20">
          <div className="absolute inset-0 -top-64 -bottom-64 md:-top-48 md:-bottom-48 lg:-top-40 lg:-bottom-40 bg-muted" />
          <div className="container relative z-10 mx-auto px-4">
            <div className="mb-12 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-secondary-foreground/70">
                Trygghet
              </p>
              <h2
                className="text-3xl font-bold text-secondary-foreground md:text-4xl"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
              >
                Bruk AI med tillit
              </h2>
              <p
                className="mx-auto mt-3 max-w-xl text-secondary-foreground/70"
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.2)" }}
              >
                Vit at du handler riktig når du bruker AI-verktøy.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {trustCards.map((card) => (
                <Link
                  key={card.title}
                  to={card.path}
                  className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex aspect-video items-center justify-center rounded-lg bg-muted/30 mb-4">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {card.label}
                  </p>
                  <h3 className="mb-2 text-lg font-bold text-foreground">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                    Les mer <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection >

      {/* Se det i praksis — static, no gap */}
      < section className="relative z-10 bg-primary py-16 text-primary-foreground" >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Se det i praksis</h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/70">
            Utforsk retningslinjene våre eller test AI-pipelinen selv.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/guidelines"
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
            >
              Retningslinjer
            </Link>
            <Link
              to="/interactive"
              className="rounded-md border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Pipeline
            </Link>
          </div>
        </div>
      </section >

      {/* Placeholder image — static */}
      < section className="relative z-10 bg-background" >
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto flex max-w-md items-center justify-center rounded-2xl bg-muted py-20">
            <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
          </div>
        </div>
      </section >

      {/* FAQ — static */}
      < section className="relative z-10 bg-background" >
        <div className="container mx-auto px-4 pb-20">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Spørsmål</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">Svar på det du lurer på om ansvarlig AI-bruk.</p>
          </div>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-x-8 md:grid-cols-2">
              {faqs.map((faq, i) => (
                <Accordion key={i} type="single" collapsible>
                  <AccordionItem value={`faq - ${i} `} className="border-b border-border">
                    <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </section >

      {/* Trenger du mer hjelp — static */}
      < section className="relative z-10 bg-background" >
        <div className="container mx-auto px-4 pb-20 text-center">
          <h3 className="text-2xl font-bold text-foreground">Trenger du mer hjelp?</h3>
          <p className="mt-2 text-muted-foreground">Kontakt instruktøren din eller les retningslinjene i detalj.</p>
          <Link
            to="/guidelines"
            className="mt-4 inline-flex rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Kontakt
          </Link>
        </div>
      </section >
    </>
  );
};

export default Index;
