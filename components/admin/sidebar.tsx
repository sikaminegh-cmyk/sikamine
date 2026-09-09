"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminNav } from "./nav-config";
import type { AdminRole } from "@/lib/types/database";

export function Sidebar({ role, className }: { role: AdminRole; className?: string }) {
  const pathname = usePathname();
  const items = adminNav.filter((item) => item.roles.includes(role));

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-orange/10 text-orange" : "text-white/70 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon size={17} className="shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
