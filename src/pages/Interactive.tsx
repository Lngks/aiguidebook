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

    </>
  );
};

export default Interactive;
