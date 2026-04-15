import { motion } from "framer-motion";
import { ReactNode, useEffect } from "react";

export const PageTransition = ({ children }: { children: ReactNode }) => {
  // Ensure the scroll position is reset on page transition explicitly just in case
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.99 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};
