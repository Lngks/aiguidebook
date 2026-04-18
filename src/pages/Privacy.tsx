import { Link } from "react-router-dom";
import {
  Shield,
  Scale,
  EyeOff,
  GraduationCap,
  Lock,
  Eye,
  History,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  X
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Er mine prompts offentlig tilgjengelige?",
    a: "Som hovedregel kan data du skriver inn brukes til å trene modellene videre, med mindre du eksplisitt slår av dette i innstillingene (f.eks. i ChatGPT Plus eller ved bruk av API-løsninger). Sjekk alltid vilkårene for tjenesten du bruker."
  },
  {
    q: "Hvordan vet jeg om AI-en lyver?",
    a: "Det finnes ingen innebygd indikator, men du kan teste svar ved å be om kilder, eller be AI-en om å kritisere sitt eget svar for logiske brister. Den beste metoden er alltid ekstern faktasjekking."
  },
  {
    q: "Kan jeg bruke AI til å skrive eksamen?",
    a: "Dette avhenger helt av institusjonens regelverk. De fleste skoler og universiteter i Norge har nå strenge regler for AI-bruk. Sjekk din studieplan eller spør faglærer før du bruker AI som verktøy i vurderingssituasjoner."
  },
];

const Privacy = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16 text-stitch-on-surface">
      {/* Hero Header */}
      <header className="mb-20 mt-20">
        <div className="uppercase tracking-[0.2em] text-stitch-secondary font-medium mb-4 flex items-center gap-2 text-sm">
          <span className="w-8 h-[1px] bg-stitch-secondary"></span>
          Sikkerhet & Etikk
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-stitch-on-surface mb-6 tracking-tight section-fade-in">
          Personvern og <span className="text-stitch-primary italic">risikoer</span>.
        </h1>
        <p className="max-w-2xl text-stitch-on-surface-variant text-lg leading-relaxed section-fade-in-delay-1">
          Navigering i AI-landskapet krever en dyp forståelse av sikkerhet, etikk og integritet. Vi har identifisert de mest kritiske områdene du bør kjenne til.
        </p>
      </header>

      {/* Bento Grid Risks Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24 section-fade-in-delay-2">
        {/* Risk 1: Data Privacy */}
        <div className="md:col-span-7 bg-stitch-surface-container-low rounded-xl p-8 border border-stitch-outline-variant/30 hover:bg-stitch-surface-container-highest/20 transition-all group flex flex-col hover:-translate-y-1">
          <div className="flex items-start justify-between mb-8">
            <div className="inline-flex">
              <Shield className="text-stitch-primary w-10 h-10" />
            </div>
            <span className="text-stitch-primary font-bold text-4xl opacity-40">01</span>
          </div>
          <h3 className="text-3xl font-bold mb-4 text-stitch-on-surface">Dataprivatliv</h3>
          <p className="text-stitch-on-surface-variant mb-6">Informasjonen du mater inn i AI-modeller kan bli brukt til fremtidig trening. Beskytt dine sensitive data.</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm text-stitch-on-surface">
              <CheckCircle className="text-stitch-tertiary w-5 h-5 flex-shrink-0" />
              Del aldri personopplysninger eller konfidensielle dokumenter.
            </li>
            <li className="flex items-center gap-3 text-sm text-stitch-on-surface">
              <CheckCircle className="text-stitch-tertiary w-5 h-5 flex-shrink-0" />
              Bruk anonymiserte datasett når du ber om analyse.
            </li>
            <li className="flex items-center gap-3 text-sm text-stitch-on-surface">
              <CheckCircle className="text-stitch-tertiary w-5 h-5 flex-shrink-0" />
              Sjekk personverninnstillingene for hvert spesifikke verktøy.
            </li>
          </ul>
          <div className="mt-auto pt-6 border-t border-stitch-outline-variant/30">
            <div className="text-xs uppercase tracking-widest text-stitch-on-surface-variant font-bold mb-2">Tiltak</div>
            <p className="text-sm font-medium text-stitch-tertiary">Aktiver &quot;Private Mode&quot; eller &quot;Opt-out&quot; i plattforminnstillingene.</p>
          </div>
        </div>

        {/* Risk 2: Bias */}
        <div className="md:col-span-5 bg-stitch-surface-container-low rounded-xl p-8 border border-stitch-outline-variant/30 hover:bg-stitch-surface-container-highest/20 transition-all group flex flex-col hover:-translate-y-1">
          <div className="flex items-start justify-between mb-8">
            <div className="inline-flex">
              <Scale className="text-stitch-secondary w-10 h-10" />
            </div>
            <span className="text-stitch-secondary font-bold text-4xl opacity-40">02</span>
          </div>
          <h3 className="text-3xl font-bold mb-4 text-stitch-on-surface">Skjevheter i AI</h3>
          <p className="text-stitch-on-surface-variant mb-6">AI-modeller gjenspeiler fordommer i treningsdataene sine, noe som kan føre til diskriminerende resultater.</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm text-stitch-on-surface">
              <AlertTriangle className="text-stitch-secondary w-5 h-5 flex-shrink-0" />
              Vær kritisk til kulturelle og demografiske antagelser.
            </li>
            <li className="flex items-center gap-3 text-sm text-stitch-on-surface">
              <AlertTriangle className="text-stitch-secondary w-5 h-5 flex-shrink-0" />
              Mangfold i prompts gir mer balanserte svar.
            </li>
          </ul>
          <div className="mt-auto pt-6 border-t border-stitch-outline-variant/30">
            <div className="text-xs uppercase tracking-widest text-stitch-on-surface-variant font-bold mb-2">Tiltak</div>
            <p className="text-sm font-medium text-stitch-secondary">Kryssjekk AI-generert innhold med uavhengige, objektive kilder.</p>
          </div>
        </div>

        {/* Risk 3: Hallucinations */}
        <div className="md:col-span-5 bg-stitch-surface-container-low rounded-xl p-8 border border-stitch-outline-variant/30 hover:bg-stitch-surface-container-highest/20 transition-all group flex flex-col hover:-translate-y-1">
          <div className="flex items-start justify-between mb-8">
            <div className="inline-flex">
              <EyeOff className="text-stitch-error w-10 h-10" />
            </div>
            <span className="text-stitch-error font-bold text-4xl opacity-40">03</span>
          </div>
          <h3 className="text-3xl font-bold mb-4 text-stitch-on-surface">Hallusinasjoner</h3>
          <p className="text-stitch-on-surface-variant mb-6">AI kan presentere falsk informasjon med stor selvsikkerhet. Dette er spesielt kritisk ved faktasjekking.</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm text-stitch-on-surface">
              <X className="text-stitch-error w-5 h-5 flex-shrink-0" />
              Stol aldri på kildehenvisninger fra AI uten å sjekke dem.
            </li>
            <li className="flex items-center gap-3 text-sm text-stitch-on-surface">
              <X className="text-stitch-error w-5 h-5 flex-shrink-0" />
              Verifiser alle årstall, sitater og statistikker manuelt.
            </li>
          </ul>
          <div className="mt-auto pt-6 border-t border-stitch-outline-variant/30">
            <div className="text-xs uppercase tracking-widest text-stitch-on-surface-variant font-bold mb-2">Tiltak</div>
            <p className="text-sm font-medium text-stitch-error">Be AI-en om å &quot;tenke steg for steg&quot; for å redusere feilrater.</p>
          </div>
        </div>

        {/* Risk 4: Academic Integrity */}
        <div className="md:col-span-7 bg-stitch-surface-container-low rounded-xl p-8 border border-stitch-outline-variant/30 hover:bg-stitch-surface-container-highest/20 transition-all relative overflow-hidden flex flex-col group hover:-translate-y-1">

          <div className="flex items-start justify-between mb-8 relative z-10">
            <div className="inline-flex">
              <GraduationCap className="text-stitch-primary w-10 h-10" />
            </div>
            <span className="text-stitch-primary font-bold text-4xl opacity-40">04</span>
          </div>
          <h3 className="text-3xl font-bold mb-4 text-stitch-on-surface relative z-10">Akademisk integritet</h3>
          <p className="text-stitch-on-surface-variant mb-6 relative z-10">Bruk av AI uten å oppgi kilde kan anses som plagiat. Balanser assistanse med original tenkning.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 relative z-10">
            <div className="bg-stitch-surface p-4 rounded-lg border border-stitch-outline-variant/20">
              <div className="text-stitch-primary font-bold text-sm mb-1">Gjennomsiktighet</div>
              <p className="text-xs text-stitch-on-surface-variant leading-relaxed">Deklarer alltid når og hvordan AI har blitt brukt i arbeidet ditt.</p>
            </div>
            <div className="bg-stitch-surface p-4 rounded-lg border border-stitch-outline-variant/20">
              <div className="text-stitch-tertiary font-bold text-sm mb-1">Kildekritikk</div>
              <p className="text-xs text-stitch-on-surface-variant leading-relaxed">AI skal være en samtalepartner, ikke din primære informasjonskilde.</p>
            </div>
          </div>
          <div className="mt-auto pt-6 border-t border-stitch-outline-variant/30 flex items-center justify-between relative z-10">
            <div>
              <div className="text-xs uppercase tracking-widest text-stitch-on-surface-variant font-bold mb-2">Tiltak</div>
              <p className="text-sm font-medium text-stitch-primary">Følg institusjonens spesifikke retningslinjer for AI-bruk.</p>
            </div>
            <Link to="https://www.usn.no/om-usn/regelverk/retningslinjer-for-bruk-av-kunstig-intelligens-ki-ved-eksamen-og-studentoppgaver" className="bg-stitch-surface-container-highest hover:bg-stitch-surface-bright text-stitch-on-surface text-xs font-bold py-2 px-4 rounded-full transition-colors flex items-center gap-2">
              Les retningslinjer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Data Protection Principles */}
      <section className="bg-stitch-surface-container-low/50 rounded-2xl p-12 border border-stitch-outline-variant/30 mb-24 relative overflow-hidden section-fade-in-delay-3">

        <div className="relative z-10">
          <div className="uppercase tracking-[0.2em] text-stitch-secondary font-medium mb-12 text-center text-sm">Beskyttelse av data</div>
          <h2 className="text-4xl font-bold text-center mb-16 text-stitch-on-surface">
            Våre tre kjerneprinsipper for <span className="text-stitch-secondary">sikker bruk</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Lock className="text-stitch-secondary w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-stitch-on-surface">Minimumseksponering</h4>
              <p className="text-stitch-on-surface-variant text-sm leading-relaxed">Mat kun inn nødvendig data. Jo mindre informasjon du deler, desto mindre er risikoen for lekkasjer.</p>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Eye className="text-stitch-secondary w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-stitch-on-surface">Menneskelig tilsyn</h4>
              <p className="text-stitch-on-surface-variant text-sm leading-relaxed">AI-generert innhold skal aldri publiseres eller brukes uten en grundig manuell kvalitetskontroll.</p>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <History className="text-stitch-secondary w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-stitch-on-surface">Full sporbarhet</h4>
              <p className="text-stitch-on-surface-variant text-sm leading-relaxed">Dokumenter alle steg i prosessen der AI har blitt brukt til å forme det endelige resultatet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto mb-24 section-fade-in-delay-3">
        <h2 className="text-4xl font-bold mb-12 text-center text-stitch-on-surface">
          Spørsmål & Svar
        </h2>

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

      {/* CTA / Help Card */}
      <section className="relative p-1 bg-stitch-primary-container rounded-2xl section-fade-in-delay-3">
        <div className="bg-stitch-surface p-12 rounded-[0.9rem] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-3xl font-bold mb-4 text-stitch-on-surface">Fortsatt usikker på sikkerheten?</h3>
            <p className="text-stitch-on-surface-variant">Ta en titt på våre studierelaterte retningslinjer for å lære mer om trygg og etisk bruk av AI i din studiehverdag.</p>
          </div>
          <Link to="/guidelines" className="whitespace-nowrap bg-stitch-secondary text-stitch-surface px-8 py-4 rounded-lg font-bold hover:scale-105 transition-transform text-center shadow-md">
            Oppdag våre retningslinjer
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Privacy;
