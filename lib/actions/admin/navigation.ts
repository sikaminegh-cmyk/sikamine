"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";
import type { NavigationItemRow, NavLocation } from "@/lib/types/database";

export interface NavItemInput {
  label: string;
  url: string;
  location: NavLocation;
  group_key: string | null;
  is_external: boolean;
  visible: boolean;
}

function revalidateNav() {
  revalidatePath("/admin/navigation");
  revalidatePath("/", "layout");
}

export async function createNavItem(input: NavItemInput) {
  const admin = await requireAdmin(["super_admin", "administrator"]);
  const supabase = await createClient();
  const { count } = await supabase.from("navigation_items").select("id", { count: "exact", head: true }).eq("location", input.location);

  const { data, error } = await supabase.from("navigation_items").insert({ ...input, position: count ?? 0 }).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "create", entity: "navigation_items", entityId: data.id, metadata: { label: data.label } });
  revalidateNav();
  return { ok: true as const, data };
}

export async function updateNavItem(id: string, input: Partial<NavItemInput>) {
  const admin = await requireAdmin(["super_admin", "administrator"]);
  const supabase = await createClient();
  const { data, error } = await supabase.from("navigation_items").update(input).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "navigation_items", entityId: id, metadata: { label: data.label } });
  revalidateNav();
  return { ok: true as const, data };
}

export async function deleteNavItem(id: string) {
  const admin = await requireAdmin(["super_admin", "administrator"]);
  const supabase = await createClient();
  const { error } = await supabase.from("navigation_items").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "navigation_items", entityId: id });
  revalidateNav();
  return { ok: true as const };
}

export async function reorderNavItem(id: string, direction: "up" | "down", items: NavigationItemRow[]) {
  const admin = await requireAdmin(["super_admin", "administrator"]);
  const supabase = await createClient();
  const sorted = [...items].sort((a, b) => a.position - b.position);
  const index = sorted.findIndex((i) => i.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return { ok: false as const, error: "Cannot move further." };

  const a = sorted[index];
  const b = sorted[swapWith];
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("navigation_items").update({ position: b.position }).eq("id", a.id),
    supabase.from("navigation_items").update({ position: a.position }).eq("id", b.id),
  ]);
  if (e1 || e2) return { ok: false as const, error: (e1 ?? e2)?.message };

  await logAuditEvent({ admin, action: "reorder", entity: "navigation_items", entityId: id });
  revalidateNav();
  return { ok: true as const };
}
