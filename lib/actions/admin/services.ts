"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";
import { sanitizeRichText } from "@/lib/sanitize";
import type { ServiceRow } from "@/lib/types/database";

export interface ServiceInput {
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  icon: string;
  image_url: string | null;
  seo_title: string;
  seo_description: string;
  published: boolean;
}

function revalidateServices(slug?: string) {
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  if (slug) revalidatePath(`/services/${slug}`);
}

export async function createService(input: ServiceInput) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { count } = await supabase.from("services").select("id", { count: "exact", head: true });

  const { data, error } = await supabase
    .from("services")
    .insert({ ...input, full_description: sanitizeRichText(input.full_description), position: count ?? 0 })
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "create", entity: "services", entityId: data.id, metadata: { name: data.name } });
  revalidateServices(data.slug);
  return { ok: true as const, data };
}

export async function updateService(id: string, input: Partial<ServiceInput>) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const payload = { ...input };
  if (payload.full_description) payload.full_description = sanitizeRichText(payload.full_description);

  const { data, error } = await supabase.from("services").update(payload).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "services", entityId: id, metadata: { name: data.name } });
  revalidateServices(data.slug);
  return { ok: true as const, data };
}

export async function deleteService(id: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "services", entityId: id });
  revalidateServices();
  return { ok: true as const };
}

export async function reorderService(id: string, direction: "up" | "down", services: ServiceRow[]) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const sorted = [...services].sort((a, b) => a.position - b.position);
  const index = sorted.findIndex((s) => s.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return { ok: false as const, error: "Cannot move further." };

  const a = sorted[index];
  const b = sorted[swapWith];

  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("services").update({ position: b.position }).eq("id", a.id),
    supabase.from("services").update({ position: a.position }).eq("id", b.id),
  ]);
  if (e1 || e2) return { ok: false as const, error: (e1 ?? e2)?.message };

  await logAuditEvent({ admin, action: "reorder", entity: "services", entityId: id });
  revalidateServices();
  return { ok: true as const };
}
