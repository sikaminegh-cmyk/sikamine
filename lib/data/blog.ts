import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { AlbumImageRow, AlbumRow, BlogPostRow } from "@/lib/types/database";

export const getBlogPosts = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return (data ?? []) as BlogPostRow[];
});

export const getBlogPostBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data as BlogPostRow | null;
});

export const getAlbums = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("albums")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return (data ?? []) as AlbumRow[];
});

export const getAlbumBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data: album } = await supabase
    .from("albums")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (!album) return null;

  const { data: images } = await supabase
    .from("album_images")
    .select("*")
    .eq("album_id", album.id)
    .order("position", { ascending: true });

  return { album: album as AlbumRow, images: (images ?? []) as AlbumImageRow[] };
});
