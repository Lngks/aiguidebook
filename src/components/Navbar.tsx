import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrambleText } from "./ScrambleText";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const navItems = [
  { label: "Verktøy", path: "/tools" },
  { label: "Retningslinjer - WIP", path: "/guidelines" },
  { label: "Personvern - WIP", path: "/privacy" },
  { label: "Interaktiv - WIP", path: "/interactive" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

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
          // Base mobile classes
          "mt-0 h-16 w-full max-w-none rounded-none",
          // Mobile scrolled state
          isScrolled && "max-md:mt-4 max-md:h-14 max-md:w-[95%] max-md:max-w-5xl max-md:rounded-lg max-md:shadow-sm",
          // Mobile open state
          mobileOpen ? "max-md:h-auto max-md:rounded-b-lg max-md:w-full max-md:max-w-none max-md:mt-0 max-md:flex-col max-md:items-stretch" : "flex-row",
          // Desktop fixed dark background
          "md:bg-background md:border-b md:border-border/40"
        )}
      >
        {/* Isolated Decorative Layer - Handles background, blur, border, and shadow */}
        <div
          className={cn(
            "absolute inset-0 -z-10 transition-all duration-500 max-md:block md:hidden",
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
            "container flex w-full items-center justify-between px-4 mx-auto shrink-0 transition-all duration-500",
            // Mobile sizes keep dynamic height
            isScrolled ? "h-14" : "h-16",
            // Desktop consistent height
            "md:h-16"
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
                    <ScrambleText text={item.label} duration={0.4} triggerOnHover={true} />
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
              <button
                onClick={() => setIsDark(!isDark)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-muted/20 text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 transition-all duration-300 dark:-rotate-90 dark:scale-0 dark:opacity-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 opacity-0 transition-all duration-300 dark:rotate-0 dark:scale-100 dark:opacity-100" />
              </button>
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
                      <ScrambleText text={item.label} duration={0.4} triggerOnHover={true} />
                    </Link>
                  </li>
                ))}
                <li className="pt-4 flex justify-between items-center px-4 py-3 border-t border-border/10">
                  <span className="text-sm font-medium text-muted-foreground">Tema</span>
                  <button
                    onClick={() => {
                      setIsDark(!isDark);
                      setMobileOpen(false);
                    }}
                    className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-muted/20 text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
                    aria-label="Toggle theme"
                  >
                    <Sun className="h-4 w-4 transition-all duration-300 dark:-rotate-90 dark:scale-0 dark:opacity-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 opacity-0 transition-all duration-300 dark:rotate-0 dark:scale-100 dark:opacity-100" />
                  </button>
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
