import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen } from "lucide-react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Tools", path: "/tools" },
  { label: "Guidelines", path: "/guidelines" },
  { label: "Privacy & Risks", path: "/privacy" },
  { label: "Interactive Tool", path: "/interactive" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary">
          <BookOpen className="h-6 w-6" />
          <span className="text-xl" style={{ fontFamily: "'Merriweather', serif" }}>
            AIGuidebook
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary ${
                  location.pathname === item.path
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <ul className="container mx-auto space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                    location.pathname === item.path
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
