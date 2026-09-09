import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 shrink-0", className)} aria-label="Sikamine Gold Trading Ltd — Home">
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg border-2 font-heading text-lg font-bold",
          dark ? "border-orange text-orange" : "border-navy text-navy"
        )}
      >
        S
      </span>
      <span className={cn("font-heading leading-tight", dark ? "text-white" : "text-navy")}>
        <span className="block text-sm font-bold tracking-wide">SIKAMINE</span>
        <span className="block text-[10px] font-medium tracking-[0.2em] opacity-80">GOLD TRADING LTD</span>
      </span>
    </Link>
  );
}
