"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";
import type { PartnershipStatus } from "@/lib/types/database";

export async function updatePartnershipEnquiry(id: string, input: { status?: PartnershipStatus; internal_notes?: string }) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("partnership_enquiries").update(input).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "partnership_enquiries", entityId: id, metadata: input });
  revalidatePath("/admin/partnership-enquiries");
  return { ok: true as const };
}

export async function deletePartnershipEnquiry(id: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("partnership_enquiries").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "partnership_enquiries", entityId: id });
  revalidatePath("/admin/partnership-enquiries");
  return { ok: true as const };
}
