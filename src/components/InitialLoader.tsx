import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const InitialLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [textIndex, setTextIndex] = useState(0);
  
  const texts = [
    "BOOT_SEQUENCE_INIT...",
    "VERIFYING_INTEGRITY...",
    "AIGUIDEBOOK_ONLINE.",
  ];

  useEffect(() => {
    // Custom timing for each step
    const timer1 = setTimeout(() => setTextIndex(1), 800);
    const timer2 = setTimeout(() => setTextIndex(2), 1600);
    const timer3 = setTimeout(() => onComplete(), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-stitch-primary dark:text-tertiary shadow-2xl"
    >
      <div className="font-mono text-[11px] tracking-[0.3em] opacity-90 uppercase flex flex-col items-center gap-6">
        <span>{texts[textIndex]}</span>
        <div className="w-40 h-[1px] bg-stitch-primary/20 dark:bg-tertiary/20 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-stitch-primary dark:bg-tertiary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.6, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
};
