"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";
import type { OfficeLocationRow } from "@/lib/types/database";

export interface OfficeInput {
  title: string;
  is_headquarters: boolean;
  country: string;
  region: string;
  city: string;
  street_address: string;
  postal_address: string;
  phone: string;
  whatsapp: string;
  email: string;
  maps_url: string;
  business_hours: Record<string, string>;
  visible: boolean;
}

function revalidateOffices() {
  revalidatePath("/admin/offices");
  revalidatePath("/contact");
}

export async function createOffice(input: OfficeInput) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { count } = await supabase.from("office_locations").select("id", { count: "exact", head: true });

  const { data, error } = await supabase.from("office_locations").insert({ ...input, position: count ?? 0 }).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "create", entity: "office_locations", entityId: data.id, metadata: { title: data.title } });
  revalidateOffices();
  return { ok: true as const, data };
}

export async function updateOffice(id: string, input: Partial<OfficeInput>) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("office_locations").update(input).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "office_locations", entityId: id, metadata: { title: data.title } });
  revalidateOffices();
  return { ok: true as const, data };
}

export async function deleteOffice(id: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("office_locations").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "office_locations", entityId: id });
  revalidateOffices();
  return { ok: true as const };
}

export async function toggleOfficeVisibility(id: string, visible: boolean) {
  return updateOffice(id, { visible });
}

export async function reorderOffice(id: string, direction: "up" | "down", offices: OfficeLocationRow[]) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const sorted = [...offices].sort((a, b) => a.position - b.position);
  const index = sorted.findIndex((o) => o.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return { ok: false as const, error: "Cannot move further." };

  const a = sorted[index];
  const b = sorted[swapWith];
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("office_locations").update({ position: b.position }).eq("id", a.id),
    supabase.from("office_locations").update({ position: a.position }).eq("id", b.id),
  ]);
  if (e1 || e2) return { ok: false as const, error: (e1 ?? e2)?.message };

  await logAuditEvent({ admin, action: "reorder", entity: "office_locations", entityId: id });
  revalidateOffices();
  return { ok: true as const };
}
