import { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import InteractiveHeader from "./InteractiveHeader";
import { X } from "lucide-react";

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isInteractive = location.pathname === "/interactive";
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        Hopp til hovedinnhold
      </a>

      {/* Student Project Banner */}
      {showBanner && (
        <div className="fixed bottom-4 left-4 z-[100] max-w-[calc(100vw-32px)] rounded-xl border border-tertiary/30 bg-background/80 backdrop-blur-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] sm:bottom-6 sm:left-6 sm:max-w-xs dark:shadow-none">
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Lukk banner"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3">
            <div className="flex mt-0.5 h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary/20 text-tertiary">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </div>
            <div className="pr-2">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-tertiary">Studentprosjekt</p>
              <p className="text-xs font-medium leading-relaxed text-foreground/80">
                Dette er et studentprosjekt og ikke en ekte nettside. / This is a student project and not a real website.
              </p>
            </div>
          </div>
        </div>
      )}

      {isInteractive ? <InteractiveHeader /> : <Navbar />}
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        {children}
      </main>
      {!isInteractive && <Footer />}
    </div>
  );
};

export default Layout;
