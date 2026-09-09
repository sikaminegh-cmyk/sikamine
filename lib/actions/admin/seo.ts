"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";

export interface SeoInput {
  seo_title: string;
  meta_description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  canonical_url: string;
  no_index: boolean;
}

export async function updateSeoSettings(routeKey: string, input: SeoInput) {
  const admin = await requireAdmin(["super_admin", "administrator"]);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seo_settings")
    .upsert({ route_key: routeKey, ...input }, { onConflict: "route_key" })
    .select()
    .single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "seo_settings", entityId: data.id, metadata: { route_key: routeKey } });
  revalidatePath("/admin/seo");
  revalidatePath(routeKey === "home" ? "/" : `/${routeKey}`);
  return { ok: true as const, data };
}
