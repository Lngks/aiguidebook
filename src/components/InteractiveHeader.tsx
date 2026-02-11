import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const InteractiveHeader = () => (
  <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
    <Link to="/" className="text-white/80 hover:text-white transition-colors">
      <ArrowLeft className="h-7 w-7" />
    </Link>
    <Link to="/interactive" reloadDocument className="hover:opacity-80 transition-opacity">
      <img src="/favicon.svg" alt="Logo" className="h-9 w-9" />
    </Link>
  </header>
);

export default InteractiveHeader;
