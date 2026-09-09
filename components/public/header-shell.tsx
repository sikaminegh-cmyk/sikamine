"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ScrolledContext = createContext(false);
export const useHeaderScrolled = () => useContext(ScrolledContext);

export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <ScrolledContext.Provider value={scrolled}>
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-[height,box-shadow,border-color] duration-300 ease-out",
          scrolled ? "h-16 border-black/5 shadow-sm" : "h-18 border-transparent"
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-6 lg:px-10">{children}</div>
      </header>
    </ScrolledContext.Provider>
  );
}
