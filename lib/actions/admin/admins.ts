"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";
import type { AdminRole } from "@/lib/types/database";

export async function inviteAdmin(email: string, fullName: string, role: AdminRole) {
  const admin = await requireAdmin(["super_admin"]);
  const supabaseAdmin = createAdminClient();
  const supabase = await createClient();

  const { data: invited, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
  });
  if (inviteError || !invited.user) return { ok: false as const, error: inviteError?.message ?? "Failed to send invite." };

  const { data, error } = await supabase
    .from("admin_users")
    .insert({ user_id: invited.user.id, email, full_name: fullName, role, status: "active" })
    .select()
    .single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "create", entity: "admin_users", entityId: data.id, metadata: { email, role } });
  revalidatePath("/admin/admins");
  return { ok: true as const, data };
}

export async function updateAdminRole(id: string, role: AdminRole) {
  const admin = await requireAdmin(["super_admin"]);
  const supabase = await createClient();
  const { data, error } = await supabase.from("admin_users").update({ role }).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "admin_users", entityId: id, metadata: { role } });
  revalidatePath("/admin/admins");
  return { ok: true as const, data };
}

export async function setAdminStatus(id: string, status: "active" | "inactive") {
  const admin = await requireAdmin(["super_admin"]);
  if (admin.id === id && status === "inactive") {
    return { ok: false as const, error: "You cannot deactivate your own account." };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("admin_users").update({ status }).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: status === "active" ? "reactivate" : "deactivate", entity: "admin_users", entityId: id });
  revalidatePath("/admin/admins");
  return { ok: true as const, data };
}
