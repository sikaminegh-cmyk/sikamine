"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useHeaderScrolled } from "./header-shell";
import { cn } from "@/lib/utils";
import type { NavigationItemRow } from "@/lib/types/database";

export function MobileNav({ items, ctaLabel, ctaHref }: { items: NavigationItemRow[]; ctaLabel: string; ctaHref: string }) {
  const [open, setOpen] = useState(false);
  const scrolled = useHeaderScrolled();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="rounded-md p-2 text-navy transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange active:scale-90"
      >
        <span className="relative block h-6.5 w-6.5">
          <Menu size={26} className={`absolute inset-0 transition-all duration-200 ${open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`} />
          <X size={26} className={`absolute inset-0 transition-all duration-200 ${open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`} />
        </span>
      </button>

      {open && (
        <div
          className={cn(
            "fixed inset-x-0 z-40 overflow-y-auto bg-white px-6 py-8 transition-[top,height] duration-300 ease-out motion-safe:animate-[pageEnter_0.3s_ease-out]",
            scrolled ? "top-16 h-[calc(100vh-4rem)]" : "top-18 h-[calc(100vh-4.5rem)]"
          )}
        >
          <nav className="flex flex-col gap-1">
            {items.map((item, i) => (
              <Link
                key={item.id}
                href={item.url}
                onClick={() => setOpen(false)}
                target={item.is_external ? "_blank" : undefined}
                rel={item.is_external ? "noopener noreferrer" : undefined}
                style={{ animationDelay: `${i * 40}ms` }}
                className="rounded-lg px-3 py-3 text-base font-medium text-navy opacity-0 transition-colors hover:bg-bg-alt motion-safe:animate-[fadeUp_0.4s_ease-out_forwards]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href={ctaHref}
            onClick={() => setOpen(false)}
            className="mt-6 block rounded-full bg-orange px-6 py-3 text-center text-sm font-semibold text-white transition-transform duration-200 active:scale-[0.97]"
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
