import { Link } from "react-router-dom";
import Logo from "./Logo";

const footerColumns = [
  {
    title: "Ressurser",
    links: [
      { label: "Retningslinjer", to: "/guidelines" },
      { label: "AI-pipeline", to: "/interactive" },
      { label: "Spørsmål", to: "/tools" },
      { label: "Kontakt", to: "#" },
      { label: "Hjelp", to: "#" },
    ],
  },
  {
    title: "Lær mer",
    links: [
      { label: "Akademisk integritet", to: "/guidelines" },
      { label: "Personvern", to: "/privacy" },
      { label: "Hallusinasjoner", to: "/privacy" },
      { label: "Bias", to: "/privacy" },
      { label: "Eksempler", to: "/guidelines" },
    ],
  },
  {
    title: "Veiledning",
    links: [
      { label: "Beste praksis", to: "/guidelines" },
      { label: "Sjekkliste", to: "/guidelines" },
      { label: "Verktøyvalg", to: "/tools" },
      { label: "Ressurser", to: "#" },
      { label: "Lenker", to: "#" },
    ],
  },
  {
    title: "Om",
    links: [
      { label: "Om AIGuidebook", to: "#" },
      { label: "Vår oppdrag", to: "#" },
      { label: "Teamet", to: "#" },
      { label: "Tilbakemelding", to: "#" },
    ],
  },
  {
    title: "Juridisk",
    links: [
      { label: "Personvernerklæring", to: "#" },
      { label: "Vilkår for bruk", to: "#" },
      { label: "Tilgjengelighetserklæring", to: "#" },
      { label: "Innstillinger", to: "#" },
    ],
  },
];

const Footer = () => (
  <footer className="border-t border-border bg-muted">
    {/* Newsletter */}
    <div className="border-b border-border bg-primary">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
        <div>
          <p className="font-medium text-primary-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Få oppdateringer
          </p>
          <p className="text-sm text-primary-foreground/70">Motta tips og veiledning direkte</p>
        </div>
        <div className="flex w-full max-w-md gap-2">
          <input
            type="email"
            placeholder="Din e-post"
            className="flex-1 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105">
            Abonner
          </button>
        </div>
      </div>
    </div>

    {/* Logo + Columns */}
    <div className="container mx-auto px-4 py-10">
      <div className="grid gap-8 md:grid-cols-6">
        <div className="md:col-span-1">
          <Link to="/">
            <Logo variant="auto" className="h-5" />
          </Link>
        </div>
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold text-foreground">{col.title}</h4>
            <ul className="space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-border">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-4 text-xs text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} AIGuidebook. Alle rettigheter forbeholdt.</p>
        <div className="flex gap-4">
          <Link to="#" className="hover:text-foreground">Personvern</Link>
          <Link to="#" className="hover:text-foreground">Vilkår for bruk</Link>
          <Link to="#" className="hover:text-foreground">Cookies</Link>
        </div>
        <div className="flex gap-3">
          {["f", "in", "X", "▶", "○"].map((icon, i) => (
            <a key={i} href="#" className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground">
              <span className="text-xs">{icon}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
