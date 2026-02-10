import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const InteractiveHeader = () => (
  <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
    <Link to="/" className="text-white/80 hover:text-white transition-colors">
      <ArrowLeft className="h-6 w-6" />
    </Link>
    <img src="/favicon.svg" alt="Logo" className="h-7 w-7" />
  </header>
);

export default InteractiveHeader;
