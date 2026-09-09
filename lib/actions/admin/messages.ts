"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";
import type { ContactStatus } from "@/lib/types/database";

export async function updateContactMessageStatus(id: string, status: ContactStatus) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "contact_messages", entityId: id, metadata: { status } });
  revalidatePath("/admin/messages");
  return { ok: true as const };
}

export async function deleteContactMessage(id: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "contact_messages", entityId: id });
  revalidatePath("/admin/messages");
  return { ok: true as const };
}
