import { Link } from "react-router-dom";
import Logo from "./Logo";

// Variation 1: Minimalist Split (Editorial Design)
// A clean, professional left-to-right split. Very spacious.
const FooterVariant1 = () => (
  <footer className="border-t border-border bg-background py-16 mt-20">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
      <div className="flex flex-col gap-6 max-w-sm">
        <Link to="/" className="w-fit">
          <Logo variant="auto" className="h-7 opacity-90 hover:opacity-100 transition-opacity duration-300" />
        </Link>
        <p className="text-muted-foreground/60 text-sm leading-relaxed">
          Støtter akademisk integritet i en tid med kunstig intelligens. Få oversikt, verktøy og retningslinjer for sikker bruk.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-12 sm:gap-24 text-sm mt-4 md:mt-0">
        <div className="flex flex-col gap-4">
          <span className="font-bold text-foreground tracking-widest uppercase text-[10px]">Utforsk</span>
          <Link to="/guidelines" className="text-muted-foreground hover:text-foreground transition-colors">Retningslinjer</Link>
          <Link to="/interactive" className="text-muted-foreground hover:text-foreground transition-colors">AI-Pipeline</Link>
          <Link to="/tools" className="text-muted-foreground hover:text-foreground transition-colors">Verktøy</Link>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-bold text-foreground tracking-widest uppercase text-[10px]">Juridisk</span>
          <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Personvern</Link>
          <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Vilkår for bruk</Link>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-6 mt-16 pt-8 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground/40 font-mono">
      <span>© {new Date().getFullYear()} AIGuidebook.</span>
    </div>
  </footer>
);

// Variation 2: Brutalist Grid
// Edgy, strict grid layout with raw borders and uppercase monospace typography.
const FooterVariant2 = () => (
  <footer className="border-t-2 border-foreground bg-background mt-20">
    <div className="grid grid-cols-1 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 border-b-2 border-foreground divide-foreground">
      <div className="p-8 flex items-end justify-start min-h-[150px]">
        <Link to="/" className="w-fit">
          <Logo variant="auto" className="h-6 grayscale hover:grayscale-0 transition-all" />
        </Link>
      </div>
      <div className="p-8 flex flex-col justify-end gap-3 font-mono text-sm tracking-tight">
        <Link to="/guidelines" className="hover:bg-foreground hover:text-background w-fit px-1 transition-colors">RETNINGSLINJER</Link>
        <Link to="/interactive" className="hover:bg-foreground hover:text-background w-fit px-1 transition-colors">PIPELINE</Link>
      </div>
      <div className="p-8 flex flex-col justify-end gap-3 font-mono text-sm tracking-tight">
        <Link to="/tools" className="hover:bg-foreground hover:text-background w-fit px-1 transition-colors">VERKTØY</Link>
        <Link to="/privacy" className="hover:bg-foreground hover:text-background w-fit px-1 transition-colors">PERSONVERN</Link>
      </div>
      <div className="p-8 flex items-end font-mono text-xs text-muted-foreground">
        © {new Date().getFullYear()}
      </div>
    </div>
  </footer>
);

// Variation 3: Dark Asymmetrical Typographic
// Striking inverted footer. It uses the dark background in light mode, and a muted white background in dark mode.
const FooterVariant3 = () => (
  <footer className="bg-foreground text-background dark:bg-[#ececec] dark:text-[#0a0a0b] pt-24 pb-8 overflow-hidden rounded-t-[2.5rem] mt-20 mx-2 shadow-2xl transition-colors duration-500">
    <div className="container mx-auto px-8 md:px-12 relative flex flex-col gap-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter leading-[1.1] max-w-xl text-background dark:text-[#18181b]">
          Fremtidens <br /> <span className="italic font-serif opacity-70">læring.</span>
        </h2>

        <div className="flex flex-col gap-1.5 font-mono text-xs opacity-70 text-background dark:text-[#27272a] tracking-[0.15em] uppercase text-right">
          <div className="flex justify-end gap-3 items-center mb-2">
            <span>SYS_STATUS: ONLINE</span>
            <span className="w-2 h-2 rounded-full bg-green-500/80 animate-pulse"></span>
          </div>
          <p>VERSION // 1.0.4_BETA</p>
          <p>LAST_BUILD // {new Date().toISOString().split('T')[0].replace(/-/g, '.')}</p>
          <div className="flex justify-end gap-2 items-center mt-4">
            <span>END_OF_TRANSMISSION</span>
            <span className="w-2 h-3 bg-background dark:bg-black animate-[pulse_1s_ease-in-out_infinite]"></span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-background/20 dark:border-black/15 pt-8">
        <Link to="/" className="group">
          {/* Light mode (page light, footer dark) -> We need a light logo */}
          <div className="block dark:hidden">
            <Logo variant="light" className="h-5 opacity-90 group-hover:opacity-100 transition-opacity" />
          </div>
          {/* Dark mode (page dark, footer muted white) -> We need a dark logo */}
          <div className="hidden dark:block">
            <Logo variant="dark" className="h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
        <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest text-background dark:text-black">
          AIGuidebook © {new Date().getFullYear()}
        </span>
      </div>
    </div>
  </footer>
);

// Change this export to FooterVariant2 or FooterVariant3 to see the other designs!
const Footer = FooterVariant3;

export default Footer;

