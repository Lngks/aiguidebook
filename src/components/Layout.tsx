import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import InteractiveHeader from "./InteractiveHeader";

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isInteractive = location.pathname === "/interactive";

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        Hopp til hovedinnhold
      </a>
      {isInteractive ? <InteractiveHeader /> : <Navbar />}
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        {children}
      </main>
      {!isInteractive && <Footer />}
    </div>
  );
};

export default Layout;
