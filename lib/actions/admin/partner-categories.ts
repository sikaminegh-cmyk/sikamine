"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";
import type { PartnerCategoryRow } from "@/lib/types/database";

export interface PartnerCategoryInput {
  name: string;
  description: string;
  icon: string;
  status: "active" | "inactive";
}

function revalidateCategories() {
  revalidatePath("/admin/partner-categories");
  revalidatePath("/");
  revalidatePath("/partnerships");
}

export async function createPartnerCategory(input: PartnerCategoryInput) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { count } = await supabase.from("partner_categories").select("id", { count: "exact", head: true });

  const { data, error } = await supabase.from("partner_categories").insert({ ...input, position: count ?? 0 }).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "create", entity: "partner_categories", entityId: data.id, metadata: { name: data.name } });
  revalidateCategories();
  return { ok: true as const, data };
}

export async function updatePartnerCategory(id: string, input: Partial<PartnerCategoryInput>) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("partner_categories").update(input).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "partner_categories", entityId: id, metadata: { name: data.name } });
  revalidateCategories();
  return { ok: true as const, data };
}

export async function deletePartnerCategory(id: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("partner_categories").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "partner_categories", entityId: id });
  revalidateCategories();
  return { ok: true as const };
}

export async function reorderPartnerCategory(id: string, direction: "up" | "down", categories: PartnerCategoryRow[]) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const sorted = [...categories].sort((a, b) => a.position - b.position);
  const index = sorted.findIndex((c) => c.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return { ok: false as const, error: "Cannot move further." };

  const a = sorted[index];
  const b = sorted[swapWith];
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("partner_categories").update({ position: b.position }).eq("id", a.id),
    supabase.from("partner_categories").update({ position: a.position }).eq("id", b.id),
  ]);
  if (e1 || e2) return { ok: false as const, error: (e1 ?? e2)?.message };

  await logAuditEvent({ admin, action: "reorder", entity: "partner_categories", entityId: id });
  revalidateCategories();
  return { ok: true as const };
}
