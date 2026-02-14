import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Verktøy", path: "/tools" },
  { label: "Retningslinjer", path: "/guidelines" },
  { label: "Personvern", path: "/privacy" },
  { label: "Interaktiv", path: "/interactive" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-0 transition-all duration-500 pointer-events-none">
      <header
        className={cn(
          "relative pointer-events-auto transition-all duration-500 ease-in-out flex items-center overflow-hidden",
          isScrolled
            ? "mt-4 h-14 w-[95%] max-w-5xl rounded-2xl"
            : "mt-0 h-16 w-full max-w-none rounded-none",
          mobileOpen && "h-auto rounded-2xl w-full max-w-none mt-0 flex-col items-stretch"
        )}
      >
        {/* Isolated Decorative Layer - Handles background, blur, border, and shadow with asymmetric transitions */}
        <div className={cn(
          "absolute inset-0 -z-10 transition-all",
          (isScrolled || mobileOpen)
            ? "opacity-100 duration-200"
            : "opacity-0 duration-0 pointer-events-none"
        )}>
          <div className={cn(
            "absolute inset-0 bg-background/50 backdrop-blur-md shadow-sm border border-border/40 rounded-2xl",
            mobileOpen && "bg-background/95 backdrop-blur-xl shadow-lg border-border/10"
          )} />
        </div>

        <div className={cn(
          "flex w-full items-center justify-between px-6 transition-all duration-500 mx-auto h-14 md:h-full",
          !isScrolled && "max-w-7xl"
        )}>
          <Link to="/" className="flex items-center gap-2 shrink-0 transition-transform duration-300 hover:scale-105 active:scale-95">
            <Logo variant="auto" className="h-4 w-auto transition-all duration-300" />
          </Link>

          {/* Desktop nav */}
          {!mobileOpen && (
            <>
              <ul className="hidden items-center gap-8 md:flex">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "text-xs font-medium transition-all duration-300 hover:text-primary relative group",
                        location.pathname === item.path
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                      <span className={cn(
                        "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                        location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"
                      )} />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="hidden items-center gap-4 md:flex shrink-0">
                <Link
                  to="/guidelines"
                  className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5"
                >
                  Kom i gang
                </Link>
              </div>
            </>
          )}

          {/* Mobile toggle */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu content */}
        {mobileOpen && (
          <div className="overflow-hidden border-t border-border/10 md:hidden w-full relative">
            <ul className="flex flex-col space-y-1 px-4 py-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 hover:bg-primary/5",
                      location.pathname === item.path
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link
                  to="/guidelines"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-full bg-primary px-4 py-3.5 text-center text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95 transition-all"
                >
                  Kom i gang
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;
