import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import Guidelines from "./pages/Guidelines";
import Privacy from "./pages/Privacy";
import Interactive from "./pages/Interactive";
import NotFound from "./pages/NotFound";
import { InitialLoader } from "./components/InitialLoader";
import { PageTransition } from "./components/PageTransition";

const NoiseOverlay = () => (
  <svg
    className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.04] mix-blend-overlay"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

const queryClient = new QueryClient();

// The animated route container requires useLocation inside the BrowserRouter context.
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/tools" element={<PageTransition><Tools /></PageTransition>} />
        <Route path="/guidelines" element={<PageTransition><Guidelines /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/interactive" element={<PageTransition><Interactive /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

export const AppContent = () => {
  const [showLoader, setShowLoader] = useState(() => {
    // Check if the loader has already been shown in this session
    return sessionStorage.getItem("hasLoaded") !== "true";
  });

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <InitialLoader 
            onComplete={() => {
              sessionStorage.setItem("hasLoaded", "true");
              setShowLoader(false);
            }} 
          />
        )}
      </AnimatePresence>
      <NoiseOverlay />
      <ScrollToTop />
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
