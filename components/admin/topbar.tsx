"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { Sidebar } from "./sidebar";
import type { AdminRole } from "@/lib/types/database";

const roleLabels: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  administrator: "Administrator",
  editor: "Editor",
};

export function Topbar({ name, role }: { name: string; role: AdminRole }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onSignOut = async () => {
    await signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-black/5 bg-white px-4 lg:px-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md p-2 text-navy lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm font-semibold text-navy">Sikamine Admin</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-navy">{name}</p>
          <p className="text-xs text-text-grey">{roleLabels[role]}</p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-text-grey hover:text-orange"
          aria-label="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-72 overflow-y-auto bg-navy p-5">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-heading text-sm font-bold text-white">Sikamine Admin</p>
              <button onClick={() => setOpen(false)} className="text-white" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <Sidebar role={role} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}
    </header>
  );
}
