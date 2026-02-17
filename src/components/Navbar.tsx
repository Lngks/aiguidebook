import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
      <motion.header
        className={cn(
          "relative pointer-events-auto flex items-center overflow-hidden transition-all duration-500 ease-in-out",
          isScrolled ? "mt-4 h-14 w-[95%] max-w-5xl rounded-lg shadow-sm" : "mt-0 h-16 w-full max-w-none rounded-none",
          mobileOpen ? "h-auto rounded-b-lg w-full max-w-none mt-0 flex-col items-stretch" : "flex-row",
        )}
      >
        {/* Isolated Decorative Layer - Handles background, blur, border, and shadow */}
        <div
          className={cn(
            "absolute inset-0 -z-10 transition-all duration-500",
            (isScrolled || mobileOpen) ? "opacity-100" : "opacity-0",
          )}
        >
          <div
            className={cn(
              "absolute inset-0 bg-background/50 backdrop-blur-md border border-border/40 rounded-lg transition-all duration-500",
              mobileOpen && "bg-background/95 backdrop-blur-xl border-border/10 rounded-t-none rounded-b-lg",
            )}
          />
        </div>

        <div
          className={cn(
            "flex w-full items-center justify-between px-6 mx-auto h-14 shrink-0 transition-all duration-500",
            !isScrolled && !mobileOpen && "max-w-7xl h-16",
          )}
        >
          <Link
            to="/"
            className="flex items-center py-2.5 gap-2 shrink-0 rounded-md p-1.5 transition-colors duration-200 hover:bg-muted/50"
          >
            <Logo variant="auto" className="h-4 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex flex-1 items-center justify-between ml-8">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "text-xs font-medium transition-all duration-300 hover:text-primary relative group",
                      location.pathname === item.path ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                        location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full",
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 shrink-0">
              <Button asChild size="sm">
                <Link to="/guidelines">Kom i gang</Link>
              </Button>
            </div>
          </div>

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
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden border-t border-border/10 md:hidden w-full relative"
            >
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
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-4">
                  <Button asChild className="w-full">
                    <Link to="/guidelines" onClick={() => setMobileOpen(false)}>
                      Kom i gang
                    </Link>
                  </Button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
};

export default Navbar;
