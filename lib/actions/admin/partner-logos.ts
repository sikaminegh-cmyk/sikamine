"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";
import type { PartnerLogoRow } from "@/lib/types/database";

export interface PartnerLogoInput {
  name: string;
  category: string;
  logo_url: string;
  link_url: string;
  visible: boolean;
}

function revalidatePartnerLogos() {
  revalidatePath("/admin/partner-logos");
  revalidatePath("/", "layout");
}

export async function createPartnerLogo(input: PartnerLogoInput) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { count } = await supabase.from("partner_logos").select("id", { count: "exact", head: true });

  const { data, error } = await supabase
    .from("partner_logos")
    .insert({ ...input, link_url: input.link_url || null, position: count ?? 0 })
    .select()
    .single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "create", entity: "partner_logos", entityId: data.id, metadata: { name: data.name } });
  revalidatePartnerLogos();
  return { ok: true as const, data: data as PartnerLogoRow };
}

export async function updatePartnerLogo(id: string, input: Partial<PartnerLogoInput>) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const payload = { ...input, link_url: input.link_url !== undefined ? input.link_url || null : undefined };

  const { data, error } = await supabase.from("partner_logos").update(payload).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "partner_logos", entityId: id, metadata: { name: data.name } });
  revalidatePartnerLogos();
  return { ok: true as const, data: data as PartnerLogoRow };
}

export async function deletePartnerLogo(id: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("partner_logos").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "partner_logos", entityId: id });
  revalidatePartnerLogos();
  return { ok: true as const };
}

export async function reorderPartnerLogo(id: string, direction: "up" | "down", logos: PartnerLogoRow[]) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const sorted = [...logos].sort((a, b) => a.position - b.position);
  const index = sorted.findIndex((l) => l.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return { ok: false as const, error: "Cannot move further." };

  const a = sorted[index];
  const b = sorted[swapWith];
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("partner_logos").update({ position: b.position }).eq("id", a.id),
    supabase.from("partner_logos").update({ position: a.position }).eq("id", b.id),
  ]);
  if (e1 || e2) return { ok: false as const, error: (e1 ?? e2)?.message };

  await logAuditEvent({ admin, action: "reorder", entity: "partner_logos", entityId: id });
  revalidatePartnerLogos();
  return { ok: true as const };
}
