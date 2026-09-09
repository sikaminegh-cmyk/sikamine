"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";
import type { PillarRow } from "@/lib/types/database";

export interface PillarInput {
  name: string;
  number: string;
  description: string;
  icon: string;
  status: "active" | "inactive";
}

function revalidatePillars() {
  revalidatePath("/admin/pillars");
  revalidatePath("/");
  revalidatePath("/about");
}

export async function createPillar(input: PillarInput) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { count } = await supabase.from("pillars").select("id", { count: "exact", head: true });

  const { data, error } = await supabase.from("pillars").insert({ ...input, position: count ?? 0 }).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "create", entity: "pillars", entityId: data.id, metadata: { name: data.name } });
  revalidatePillars();
  return { ok: true as const, data };
}

export async function updatePillar(id: string, input: Partial<PillarInput>) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("pillars").update(input).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "pillars", entityId: id, metadata: { name: data.name } });
  revalidatePillars();
  return { ok: true as const, data };
}

export async function deletePillar(id: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("pillars").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "pillars", entityId: id });
  revalidatePillars();
  return { ok: true as const };
}

export async function reorderPillar(id: string, direction: "up" | "down", pillars: PillarRow[]) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const sorted = [...pillars].sort((a, b) => a.position - b.position);
  const index = sorted.findIndex((p) => p.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return { ok: false as const, error: "Cannot move further." };

  const a = sorted[index];
  const b = sorted[swapWith];
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("pillars").update({ position: b.position }).eq("id", a.id),
    supabase.from("pillars").update({ position: a.position }).eq("id", b.id),
  ]);
  if (e1 || e2) return { ok: false as const, error: (e1 ?? e2)?.message };

  await logAuditEvent({ admin, action: "reorder", entity: "pillars", entityId: id });
  revalidatePillars();
  return { ok: true as const };
}
