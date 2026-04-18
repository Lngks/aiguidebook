import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Lightbulb, Wrench, ShieldCheck, PenTool, Bot, Mail, MapPin, Phone } from "lucide-react";
import DarkVeil from "@/components/DarkVeil/DarkVeil";
import AsciiHero from "@/components/AsciiHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrambleText } from "@/components/ScrambleText";
import ColorBends from "@/components/ui/ColorBends";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

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
    highlight: true,
  },
  {
    title: "Verktøy som virker",
    description: "Teknologi og tips du kan ta i bruk med én gang i studiene dine.",
    icon: Wrench,
  },
];

const OverviewCard = ({ card }: { card: typeof overviewCards[0] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-25% 0px -25% 0px" });

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-xl border bg-card p-10 transition-all duration-500 dark:bg-card/30 dark:shadow-none",
        inView
          ? "border-tertiary/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:border-tertiary/40"
          : "border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-border/10"
      )}
    >
      <div className="mb-8 flex items-center transition-transform">
        <card.icon className="h-8 w-8 text-tertiary transition-transform duration-500" style={{ transform: inView ? "scale(1.1)" : "scale(1)" }} />
      </div>
      <h3 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground">{card.title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground font-light">{card.description}</p>
    </div>
  );
};

const trustCards = [
  {
    label: "Regler",
    title: "Forstå reglene som gjelder",
    description: "Få god oversikt over hva som er lov og hva som ikke er det i studiene dine.",
    path: "/guidelines",
    icon: ShieldCheck,
  },
  {
    label: "Integritet",
    title: "Hold det akademiske arbeidet ærlig",
    description: "Lær på din egen måte uten å gå på kompromiss med integriteten din.",
    path: "/guidelines",
    icon: PenTool,
  },
  {
    label: "Praktisk",
    title: "Lær hvordan AI faktisk fungerer",
    description: "Praktiske verktøy og forklaringer om hvordan AI-verktøy egentlig virker.",
    path: "/tools",
    icon: Bot,
  },
];

const faqs = [
  {
    q: "Kan jeg bruke AI til oppgaven?",
    a: "Det kommer an på hva oppgaven krever. Noen ganger er AI-bruk greit, andre ganger ikke. Snakk med faglærer og sjekk institusjonens retningslinjer.",
  },
  {
    q: "Hva er hallusinasjoner i AI?",
    a: "AI kan generere informasjon som høres riktig ut, men som er feil eller oppdiktet. Verifiser alltid fakta og kilder mot pålitelige kilder.",
  },
  {
    q: "Hvor havner dataene mine?",
    a: "Les personvernerklæringen til verktøyet. Noen AI-verktøy lagrer dataene dine for trening. Sjekk innstillingene dine.",
  },
  {
    q: "Er det plagiat å bruke AI?",
    a: "Ikke nødvendigvis. Men du må oppgi at du har brukt AI i oppgaven, ellers kan det få konsekvenser.",
  },
];

const Index = () => {
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroContentOpacity, setHeroContentOpacity] = useState(1);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const sectionHeight = heroRef.current.offsetHeight;
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
      <div ref={heroRef} className="sticky top-0 z-0 bg-background text-foreground overflow-hidden">
        <section className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden bg-background pb-32 pt-20 text-foreground md:pb-48 md:pt-28 dark:bg-secondary">
          <div className="absolute inset-0">
            {isDark ? (
              <DarkVeil
                hueShift={0}
                noiseIntensity={0}
                scanlineIntensity={0}
                speed={0.5}
                scanlineFrequency={0}
                warpAmount={0}
              />
            ) : (
              <ColorBends
                rotation={45}
                speed={0.2}
                colors={["#5227FF", "#FF9FFC", "#7cff67"]}
                transparent
                autoRotate={0}
                scale={1.3}
                frequency={1}
                warpStrength={1}
                mouseInfluence={0}
                parallax={0}
                noise={0.1}
              />
            )}
          </div>
          <div
            className="container relative z-10 mx-auto mt-20 px-4 transition-opacity duration-100"
            style={{ opacity: heroContentOpacity }}
          >
            <div className="relative grid items-center gap-10 md:grid-cols-[1fr_minmax(0,680px)]">
              {!isMobile && (
                <div className="relative order-2 h-full min-h-[600px]">
                  <AsciiHero />
                </div>
              )}

              <div className="relative z-10 text-center md:text-left md:order-1">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.4)_0%,transparent_80%)] blur-2xl pointer-events-none scale-150" />

                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stitch-primary dark:text-tertiary">
                  AIGuidebook
                </p>
                <h1 className="mb-8 text-5xl font-bold leading-[0.9] tracking-tighter md:text-7xl">
                  Mestre <br /> <span className="italic text-stitch-primary dark:text-tertiary"><ScrambleText text="fremtidens" /></span><br /> studieteknikk.
                </h1>
                <p className="mb-10 mx-auto max-w-xl text-lg leading-relaxed text-foreground/90 font-medium md:mx-0 dark:text-muted-foreground dark:font-normal dark:[text-shadow:none]">
                  AI er her. Å vite hvordan du bruker det riktig betyr alt. AI Guidebook gir deg klare svar om hva som
                  er tillatt, hvordan du beskytter dataene dine, og hvordan du ivaretar akademisk integritet.
                </p>
                <div className="flex flex-row items-center justify-center gap-4 md:justify-start">
                  <Button
                    asChild
                    variant="custom"
                    size="lg"
                    className="uppercase tracking-widest"
                    style={{
                      "--btn-gradient-from": isDark ? "hsl(var(--tertiary))" : "hsl(var(--stitch-primary))",
                      "--btn-gradient-to": isDark ? "hsl(var(--tertiary))" : "hsl(var(--stitch-primary))"
                    } as React.CSSProperties}
                  >
                    <Link to="/guidelines" aria-label="Start lesing av retningslinjer">Start</Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg" className="uppercase tracking-widest">
                    <Link to="/tools" aria-label="Utforsk alle AI-verktøy">Les mer</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Separator line + decorative tab */}
      <div className="relative z-20 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-px bg-border/20" />
        <div className="absolute top-[-28px] left-1/2 -translate-x-1/2 w-full max-w-[1100px] h-[29px] pointer-events-none px-4">
          <svg viewBox="0 0 640 48" preserveAspectRatio="none" className="w-full h-full text-background fill-current">
            <path d="M0 48 L 180 48 C 220 48 240 0 280 0 L 360 0 C 400 0 420 48 460 48 L 640 48 Z" />
          </svg>
          <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-12 h-0 bg-primary/30 rounded-full blur-[0.5px]" />
        </div>
      </div>

      {/* Key Points — Tre ting du må vite */}
      <section className="relative z-10 bg-background px-4 pt-32 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-tertiary">Oppdag mulighetene</p>
            <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Hovedpoengene</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Vi bryter ned det kompliserte og gjør det enkelt. Ingen forvirrende fagord, bare svar du kan stole på.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {overviewCards.map((card) => (
              <OverviewCard key={card.title} card={card} />
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-tertiary transition-all hover:opacity-80"
            >
              Utforsk alle verktøy <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section — Bruk AI med tillit */}
      <section className="relative z-10 border-y border-border/10 bg-background py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-tertiary">Trygghet</p>
            <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Bruk AI med tillit
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Vit at du handler riktig når du bruker AI-verktøy.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {trustCards.map((card) => (
              <Link
                key={card.title}
                to={card.path}
                className="group flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:border-tertiary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:border-border/10 dark:shadow-none"
              >
                <div className="relative flex h-56 items-center justify-center bg-muted/20">
                  <card.icon className="h-16 w-16 text-muted-foreground/20 group-hover:text-tertiary/20 transition-colors" />
                  <div className="absolute inset-0 bg-tertiary/0 transition-colors group-hover:bg-tertiary/5" />
                </div>
                <div className="flex flex-grow flex-col p-8">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-tertiary">
                    {card.label}
                  </p>
                  <h3 className="mb-4 text-xl font-bold leading-tight text-foreground">{card.title}</h3>
                  <p className="mb-8 flex-grow text-sm font-light text-muted-foreground">{card.description}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-foreground group-hover:text-tertiary transition-colors">
                    Les mer <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner — Se det i praksis */}
      <section className="relative z-10 bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-[#7c3aed] py-20 text-center text-white">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-[100px]" />
            </div>
            <div className="relative z-10 mx-auto max-w-4xl px-6">
              <h2 className="mb-6 text-4xl font-bold uppercase tracking-tight text-white">Se det i praksis</h2>
              <p className="mb-10 text-xl opacity-95 text-white">
                Få et unikt innblikk i prosessene som styrer dagens kunstige intelligens.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild variant="tertiary" size="lg" className="uppercase tracking-widest hover:scale-105 transition-all font-bold">
                  <Link to="/interactive">Prøv selv</Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="border-white/20 bg-white uppercase tracking-widest hover:bg-white/90 transition-all text-zinc-900 font-bold dark:bg-white/10 dark:hover:bg-white/20 dark:text-white">
                  <Link to="/guidelines">Retningslinjer</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — Spørsmål & Svar */}
      <section className="relative z-10 bg-background px-6 pt-32 pb-32">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-tertiary">Lær mer</p>
            <h2 className="text-4xl font-bold uppercase tracking-tight text-foreground">Spørsmål & Svar</h2>
            <p className="mt-4 text-muted-foreground">Svar på det du lurer på om ansvarlig AI-bruk.</p>
          </div>
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

          <div className="mt-20 rounded-2xl border border-border/5 bg-card/50 p-10 text-center shadow-2xl">
            <h3 className="mb-3 text-2xl font-bold text-foreground">Trenger du mer hjelp?</h3>
            <p className="mb-6 text-sm text-muted-foreground">Kontakt instruktøren din eller les retningslinjene i detalj.</p>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="group mx-auto flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-tertiary transition-all hover:text-foreground"
                >
                  Kontakt oss i dag <Mail className="h-4 w-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] sm:max-w-[650px] p-0 overflow-hidden rounded-xl border border-border/40 shadow-2xl">
                <div className="flex flex-col md:flex-row">
                  {/* Left Side: USN Contact Info */}
                  <div className="bg-muted/50 p-8 md:w-[45%] flex flex-col justify-between border-b md:border-b-0 md:border-r border-border/40">
                    <div>
                      <h4 className="font-bold text-xl mb-3 text-foreground">Ta kontakt med USN</h4>
                      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                        Har du spørsmål vedrørende AI-bruk, retningslinjer eller verktøyene vi nevner? Vi vil gjerne høre fra deg.
                      </p>
                      
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-tertiary/10">
                            <MapPin className="h-4 w-4 text-tertiary" />
                          </div>
                          <div className="text-sm">
                            <p className="font-bold text-foreground">Hovedkontor</p>
                            <p className="text-muted-foreground">Raveien 215, 3184 Borre</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-tertiary/10">
                            <Phone className="h-4 w-4 text-tertiary" />
                          </div>
                          <div className="text-sm">
                            <p className="font-bold text-foreground">Telefon</p>
                            <p className="text-muted-foreground">31 00 80 00</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-tertiary/10">
                            <Mail className="h-4 w-4 text-tertiary" />
                          </div>
                          <div className="text-sm">
                            <p className="font-bold text-foreground">E-post</p>
                            <p className="text-muted-foreground">postmottak@usn.no</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side: Form */}
                  <div className="p-8 md:w-[55%] bg-card text-left">
                    <h4 className="font-bold text-xl mb-6 text-foreground">Skriv en melding</h4>
                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Navn</Label>
                        <Input id="name" placeholder="Ditt navn" className="bg-background/50 h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">E-post</Label>
                        <Input id="email" type="email" placeholder="din@epost.no" className="bg-background/50 h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Melding</Label>
                        <Textarea id="message" placeholder="Hva kan vi hjelpe deg med?" className="min-h-[120px] resize-none bg-background/50" />
                      </div>
                      <Button className="w-full mt-4 h-11 bg-tertiary hover:bg-tertiary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs transition-transform active:scale-[0.98]" type="submit">
                        Send Melding
                      </Button>
                    </form>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

    </>
  );
};

export default Index;
