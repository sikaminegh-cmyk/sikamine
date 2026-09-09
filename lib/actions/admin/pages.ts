"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";
import { sanitizeRichText } from "@/lib/sanitize";
import type { PageSectionRow } from "@/lib/types/database";

export interface SectionInput {
  type: string;
  title: string;
  subtitle: string;
  body: string;
  image_url: string | null;
  video_url: string | null;
  cta_label: string;
  cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  background_style: string;
  visible: boolean;
}

function revalidatePageBySlug(slug: string) {
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${slug}`);
  revalidatePath(slug === "home" ? "/" : `/${slug}`);
}

export async function updatePageMeta(pageId: string, slug: string, input: { title: string; published: boolean }) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("pages").update(input).eq("id", pageId);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "pages", entityId: pageId, metadata: { slug } });
  revalidatePageBySlug(slug);
  return { ok: true as const };
}

export async function createSection(pageId: string, slug: string, input: SectionInput) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { count } = await supabase.from("page_sections").select("id", { count: "exact", head: true }).eq("page_id", pageId);

  const { data, error } = await supabase
    .from("page_sections")
    .insert({ ...input, body: sanitizeRichText(input.body), page_id: pageId, position: count ?? 0 })
    .select()
    .single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "create", entity: "page_sections", entityId: data.id, metadata: { slug, type: data.type } });
  revalidatePageBySlug(slug);
  return { ok: true as const, data };
}

export async function updateSection(id: string, slug: string, input: Partial<SectionInput>) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const payload = { ...input };
  if (payload.body !== undefined) payload.body = sanitizeRichText(payload.body);

  const { data, error } = await supabase.from("page_sections").update(payload).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "page_sections", entityId: id, metadata: { slug } });
  revalidatePageBySlug(slug);
  return { ok: true as const, data };
}

export async function deleteSection(id: string, slug: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("page_sections").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "page_sections", entityId: id, metadata: { slug } });
  revalidatePageBySlug(slug);
  return { ok: true as const };
}

export async function reorderSection(id: string, slug: string, direction: "up" | "down", sections: PageSectionRow[]) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const sorted = [...sections].sort((a, b) => a.position - b.position);
  const index = sorted.findIndex((s) => s.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return { ok: false as const, error: "Cannot move further." };

  const a = sorted[index];
  const b = sorted[swapWith];
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("page_sections").update({ position: b.position }).eq("id", a.id),
    supabase.from("page_sections").update({ position: a.position }).eq("id", b.id),
  ]);
  if (e1 || e2) return { ok: false as const, error: (e1 ?? e2)?.message };

  await logAuditEvent({ admin, action: "reorder", entity: "page_sections", entityId: id, metadata: { slug } });
  revalidatePageBySlug(slug);
  return { ok: true as const };
}
