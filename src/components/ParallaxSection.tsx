import React, { useEffect, useRef, useState } from "react";
import { useParallax } from "@/hooks/use-parallax";
import { cn } from "@/lib/utils";

interface ParallaxSectionProps {
  speed?: number;
  className?: string;
  children: React.ReactNode;
  beforeChildren?: React.ReactNode;
  noReveal?: boolean;
  base?: "center" | "top";
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  speed = 0.1,
  className,
  children,
  beforeChildren,
  noReveal = false,
  base = "center",
}) => {
  const { ref, offset } = useParallax(speed, base);
  const [isVisible, setIsVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      style={{
        transform: `translateY(${offset}px)`,
        transition: "none",
      }}
    >
      <div ref={sentinelRef} className="absolute top-0 left-0 h-px w-px" aria-hidden />
      {beforeChildren}
      <div
        className={cn(
          "transition-[opacity,transform] duration-700 ease-out",
          (isVisible || noReveal) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;
