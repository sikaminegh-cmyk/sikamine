"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";
import { sanitizeRichText } from "@/lib/sanitize";
import type { AlbumImageRow } from "@/lib/types/database";

export interface BlogPostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  seo_title: string;
  seo_description: string;
  published: boolean;
}

export interface AlbumInput {
  title: string;
  slug: string;
  description: string;
  cover_image_url: string | null;
  published: boolean;
}

function revalidateBlog(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  if (slug) revalidatePath(`/blog/${slug}`);
}

function revalidateAlbums(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/albums");
  if (slug) revalidatePath(`/albums/${slug}`);
}

// ── blog posts ──────────────────────────────────────────────────────────

export async function createBlogPost(input: BlogPostInput) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ ...input, content: sanitizeRichText(input.content) })
    .select()
    .single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "create", entity: "blog_posts", entityId: data.id, metadata: { title: data.title } });
  revalidateBlog(data.slug);
  return { ok: true as const, data };
}

export async function updateBlogPost(id: string, input: Partial<BlogPostInput>) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const payload = { ...input };
  if (payload.content) payload.content = sanitizeRichText(payload.content);

  const { data, error } = await supabase.from("blog_posts").update(payload).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "blog_posts", entityId: id, metadata: { title: data.title } });
  revalidateBlog(data.slug);
  return { ok: true as const, data };
}

export async function deleteBlogPost(id: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "blog_posts", entityId: id });
  revalidateBlog();
  return { ok: true as const };
}

// ── albums ──────────────────────────────────────────────────────────────

export async function createAlbum(input: AlbumInput) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase.from("albums").insert(input).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "create", entity: "albums", entityId: data.id, metadata: { title: data.title } });
  revalidateAlbums(data.slug);
  return { ok: true as const, data };
}

export async function updateAlbum(id: string, input: Partial<AlbumInput>) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase.from("albums").update(input).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "albums", entityId: id, metadata: { title: data.title } });
  revalidateAlbums(data.slug);
  return { ok: true as const, data };
}

export async function deleteAlbum(id: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("albums").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "albums", entityId: id });
  revalidateAlbums();
  return { ok: true as const };
}

// ── album images ────────────────────────────────────────────────────────

export async function createAlbumImage(albumId: string, imageUrl: string, caption: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { count } = await supabase.from("album_images").select("id", { count: "exact", head: true }).eq("album_id", albumId);

  const { data, error } = await supabase
    .from("album_images")
    .insert({ album_id: albumId, image_url: imageUrl, caption, position: count ?? 0 })
    .select()
    .single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "create", entity: "album_images", entityId: data.id, metadata: { album_id: albumId } });
  revalidateAlbums();
  return { ok: true as const, data };
}

export async function updateAlbumImage(id: string, caption: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase.from("album_images").update({ caption }).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "album_images", entityId: id });
  revalidateAlbums();
  return { ok: true as const, data };
}

export async function deleteAlbumImage(id: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("album_images").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "album_images", entityId: id });
  revalidateAlbums();
  return { ok: true as const };
}

export async function reorderAlbumImage(id: string, direction: "up" | "down", images: AlbumImageRow[]) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const sorted = [...images].sort((a, b) => a.position - b.position);
  const index = sorted.findIndex((i) => i.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return { ok: false as const, error: "Cannot move further." };

  const a = sorted[index];
  const b = sorted[swapWith];
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from("album_images").update({ position: b.position }).eq("id", a.id),
    supabase.from("album_images").update({ position: a.position }).eq("id", b.id),
  ]);
  if (e1 || e2) return { ok: false as const, error: (e1 ?? e2)?.message };

  await logAuditEvent({ admin, action: "reorder", entity: "album_images", entityId: id });
  revalidateAlbums();
  return { ok: true as const };
}
