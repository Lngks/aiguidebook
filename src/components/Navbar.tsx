import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const navItems = [
  { label: "Verktøy", path: "/tools" },
  { label: "Retningslinjer", path: "/guidelines" },
  { label: "Personvern", path: "/privacy" },
  { label: "Interaktiv", path: "/interactive" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-secondary-foreground/10 bg-secondary">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <Logo variant="auto" className="h-5" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-secondary-foreground ${
                  location.pathname === item.path ? "text-secondary-foreground" : "text-secondary-foreground/70"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/guidelines"
          className="hidden rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105 md:inline-flex"
        >
          Kom i gang
        </Link>

        {/* Mobile toggle */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-secondary-foreground/80 hover:text-secondary-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-secondary-foreground/10 bg-secondary md:hidden">
          <ul className="container mx-auto space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.path ? "text-secondary-foreground" : "text-secondary-foreground/70"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/guidelines"
                onClick={() => setMobileOpen(false)}
                className="mt-2 block rounded-md bg-accent px-3 py-2 text-center text-sm font-semibold text-accent-foreground"
              >
                Kom i gang
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
