"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";
import { sanitizeRichText } from "@/lib/sanitize";
import type { LegalDocType } from "@/lib/types/database";

export interface LegalDocInput {
  title: string;
  content: string;
  version: string;
  effective_date: string;
  published: boolean;
}

const routeFor: Record<LegalDocType, string> = {
  terms: "/terms",
  privacy: "/privacy",
  cookies: "/cookies",
  disclaimer: "/disclaimer",
  responsible_sourcing_policy: "/responsible-sourcing",
};

export async function upsertLegalDocument(type: LegalDocType, input: LegalDocInput) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("legal_documents")
    .upsert({ type, ...input, content: sanitizeRichText(input.content) }, { onConflict: "type" })
    .select()
    .single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "legal_documents", entityId: data.id, metadata: { type } });
  revalidatePath("/admin/legal");
  revalidatePath(routeFor[type]);
  return { ok: true as const, data };
}
