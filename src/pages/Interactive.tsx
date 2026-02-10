import { Suspense, lazy } from "react";
import { Construction } from "lucide-react";
import { Link } from "react-router-dom";

const CRTMonitorScene = lazy(() => import("@/components/CRTMonitorScene"));

const Interactive = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-10 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="section-fade-in mb-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground/60">
            Interaktiv
          </p>
          <h1 className="section-fade-in text-4xl font-bold md:text-5xl">
            AI Pipeline
          </h1>
          <p className="section-fade-in-delay-1 mx-auto mt-4 max-w-xl text-lg text-primary-foreground/70">
            Utforsk hvordan AI-en behandler spørsmålet ditt — fra input til svar.
          </p>
        </div>
      </section>

      {/* CRT Scene */}
      <section className="relative bg-[#050a05]">
        <Suspense
          fallback={
            <div className="flex h-[80vh] items-center justify-center bg-[#050a05]">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#0aff0a]/30 border-t-[#0aff0a]" />
                <p className="font-mono text-sm text-[#0aff0a]/60">Laster 3D-scene...</p>
              </div>
            </div>
          }
        >
          <CRTMonitorScene />
        </Suspense>
      </section>

      {/* WIP notice */}
      <section className="bg-[#050a05] pb-12 pt-4">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-warning/15 px-4 py-2 text-sm font-medium text-warning">
            <Construction className="h-4 w-4" />
            Under utvikling — scroll-animasjon og 3D-landskap kommer snart
          </span>
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
            <Link
              to="/guidelines"
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              Retningslinjer
            </Link>
            <Link
              to="/tools"
              className="rounded-md border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Verktøy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Interactive;
