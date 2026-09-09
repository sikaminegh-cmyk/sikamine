"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";
import type { SiteSettingsRow } from "@/lib/types/database";

export type SiteSettingsInput = Partial<
  Omit<SiteSettingsRow, "id" | "updated_at">
>;

export async function updateSiteSettings(input: SiteSettingsInput) {
  const admin = await requireAdmin(["super_admin", "administrator"]);
  const supabase = await createClient();

  const { data, error } = await supabase.from("site_settings").update(input).eq("id", 1).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "site_settings" });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { ok: true as const, data };
}
