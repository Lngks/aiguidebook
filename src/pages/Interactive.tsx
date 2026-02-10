import { Construction, Monitor, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Interactive = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="section-fade-in mb-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground/60">Interaktiv</p>
          <h1 className="section-fade-in text-4xl font-bold md:text-5xl">AI Pipeline</h1>
          <p className="section-fade-in-delay-1 mx-auto mt-4 max-w-xl text-lg text-primary-foreground/70">
            En interaktiv 3D-opplevelse som viser AI-pipelinen fra spørsmål til svar.
          </p>
        </div>
      </section>

      <section className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <div className="section-fade-in max-w-xl rounded-2xl border-2 border-dashed border-border bg-muted/30 p-12 md:p-16">
          <Construction className="mx-auto mb-6 h-16 w-16 text-warning" />
          <h2 className="mb-4 text-3xl font-bold text-foreground">Kommer snart</h2>
          <p className="mx-auto mb-8 text-muted-foreground">
            Vi bygger en interaktiv 3D-visualisering av AI-pipelinen — fra det øyeblikket du skriver et spørsmål til svaret du mottar. Drevet av Three.js med scroll-drevne animasjoner.
          </p>

          <div className="mx-auto grid max-w-md gap-4 text-left">
            <div className="flex items-start gap-3 rounded-lg bg-card p-4 shadow-sm">
              <Monitor className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
              <div>
                <h4 className="text-sm font-semibold text-card-foreground">Retro CRT-grensesnitt</h4>
                <p className="text-xs text-muted-foreground">
                  Start ved en 1980-talls CRT-skjerm med AIGuidebook-logoen og et tekstfelt.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-card p-4 shadow-sm">
              <Zap className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
              <div>
                <h4 className="text-sm font-semibold text-card-foreground">Scroll-drevet reise</h4>
                <p className="text-xs text-muted-foreground">
                  Zoom gjennom skjermen inn i et 3D-landskap og scroll gjennom hvert steg i AI-pipelinen.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-warning/15 px-4 py-2 text-sm font-medium text-warning">
              <Construction className="h-4 w-4" />
              Under utvikling
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Utforsk i mellomtiden</h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/70">
            Sjekk ut retningslinjene og verktøyene våre mens vi bygger denne opplevelsen.
          </p>
          <div className="mt-6 flex justify-center gap-3">
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

export default Interactive;
