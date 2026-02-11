import React, { useEffect, useRef, useState } from "react";
import { useParallax } from "@/hooks/use-parallax";
import { cn } from "@/lib/utils";

interface ParallaxSectionProps {
  speed?: number;
  className?: string;
  children: React.ReactNode;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  speed = 0.1,
  className,
  children,
}) => {
  const { ref, offset } = useParallax(speed);
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
      className={cn(
        "relative transition-[opacity,transform] duration-700 ease-out",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        transform: isVisible
          ? `translateY(${offset}px)`
          : "translateY(2rem)",
        willChange: "transform",
      }}
    >
      <div ref={sentinelRef} className="absolute top-0 left-0 h-px w-px" aria-hidden />
      {children}
    </div>
  );
};

export default ParallaxSection;
