import { useEffect, useRef, useState } from "react";

export function useParallax(speed: number = 0.1, base: "center" | "top" = "center") {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let rafId: number;
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (base === "top") {
          // Offset is 0 when the top of the element hits the top of the viewport
          setOffset(rect.top * speed);
        } else {
          // When element center is at viewport center, offset = 0
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          const delta = elementCenter - viewportCenter;
          setOffset(delta * speed);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial calc

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return { ref, offset };
}
