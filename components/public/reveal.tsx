"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-triggered entrance (translate + scale + a slight opacity dip).
 * Content is never hidden via opacity: 0, so it stays fully present for
 * crawlers, screenshots, print, and any visitor whose JS is slow or fails
 * (IntersectionObserver support, ad blockers, etc.). Only the motion itself
 * is progressive enhancement.
 */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100",
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-80 translate-y-6 scale-[0.97]",
        className
      )}
    >
      {children}
    </div>
  );
}
