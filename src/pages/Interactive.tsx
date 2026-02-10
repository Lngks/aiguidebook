import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";

const CRTMonitorScene = lazy(() => import("@/components/CRTMonitorScene"));

const Interactive = () => {
  return (
    <>
      {/* CRT Scene — full immersive experience */}
      <section className="relative bg-[#050a05]">
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center bg-[#050a05]">
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

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Utforsk mer</h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/70">
            Nå som du har sett hvordan AI fungerer, les retningslinjene for ansvarlig bruk.
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
