import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 py-10">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2 font-bold">
            <BookOpen className="h-5 w-5" />
            <span style={{ fontFamily: "'Merriweather', serif" }}>AIGuidebook</span>
          </div>
          <p className="text-sm opacity-80">
            Helping university students navigate AI tools responsibly, ethically, and with confidence.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">Pages</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="opacity-80 transition-opacity hover:opacity-100">Home</Link></li>
            <li><Link to="/tools" className="opacity-80 transition-opacity hover:opacity-100">Tools</Link></li>
            <li><Link to="/guidelines" className="opacity-80 transition-opacity hover:opacity-100">Guidelines</Link></li>
            <li><Link to="/privacy" className="opacity-80 transition-opacity hover:opacity-100">Privacy & Risks</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">References</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>UNESCO AI in Education Guidelines (2023)</li>
            <li>EU AI Act — Education Provisions</li>
            <li>JISC AI in Tertiary Education (2024)</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t border-primary-foreground/20 pt-6 text-center text-xs opacity-60">
        © {new Date().getFullYear()} AIGuidebook. Created for educational purposes. All content is for guidance only.
      </div>
    </div>
  </footer>
);

export default Footer;
