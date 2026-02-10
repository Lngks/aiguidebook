import { Construction, Monitor, Zap } from "lucide-react";

const Interactive = () => {
  return (
    <>
      <section className="bg-primary py-14 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="section-fade-in text-4xl font-bold">Interactive Tool</h1>
          <p className="section-fade-in-delay-1 mx-auto mt-4 max-w-2xl text-lg opacity-85">
            An immersive 3D experience is being built here. Stay tuned.
          </p>
        </div>
      </section>

      <section className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <div className="section-fade-in rounded-2xl border-2 border-dashed border-border bg-muted/30 p-12 md:p-16">
          <Construction className="mx-auto mb-6 h-16 w-16 text-warning" />
          <h2 className="mb-4 text-3xl font-bold text-foreground">Coming Soon</h2>
          <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
            We're building an interactive 3D visualisation of the AI pipeline — from the moment you
            type a question to the answer you receive. Powered by Three.js with scroll-driven animations.
          </p>

          <div className="mx-auto grid max-w-md gap-4 text-left">
            <div className="flex items-start gap-3 rounded-lg bg-card p-4 shadow-sm">
              <Monitor className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
              <div>
                <h4 className="text-sm font-semibold text-card-foreground">Retro CRT Interface</h4>
                <p className="text-xs text-muted-foreground">
                  Start at a 1980's-style CRT monitor with the AIGuidebook logo and a text input field.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-card p-4 shadow-sm">
              <Zap className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
              <div>
                <h4 className="text-sm font-semibold text-card-foreground">Scroll-Driven Journey</h4>
                <p className="text-xs text-muted-foreground">
                  Zoom through the monitor into a 3D landscape and scroll through each stage of the AI pipeline.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-warning/15 px-4 py-2 text-sm font-medium text-warning">
              <Construction className="h-4 w-4" />
              Work in Progress
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Interactive;
