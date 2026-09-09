"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCookieConsentPending } from "./cookie-consent";

export function ScrollToTop() {
  const [scrolled, setScrolled] = useState(false);
  const consentPending = useCookieConsentPending();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hidden while the cookie banner is still up — it occupies the same
  // corner and would otherwise sit underneath it, blocking clicks.
  const visible = scrolled && !consentPending;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-navy-dark active:scale-95",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <ArrowUp size={18} />
    </button>
  );
}
