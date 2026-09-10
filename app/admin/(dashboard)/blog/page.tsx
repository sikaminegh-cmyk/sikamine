import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { BlogAdminTabs } from "@/components/admin/blog-admin-tabs";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const [{ data: posts }, { data: albums }, { data: albumImages }] = await Promise.all([
    supabase.from("blog_posts").select("*").order("published_at", { ascending: false }),
    supabase.from("albums").select("*").order("published_at", { ascending: false }),
    supabase.from("album_images").select("*").order("position", { ascending: true }),
  ]);

  return (
    <div>
      <PageHeader title="Blog & Albums" description="Publish blog articles and photo albums shown on the public website." />
      <BlogAdminTabs initialPosts={posts ?? []} initialAlbums={albums ?? []} initialAlbumImages={albumImages ?? []} />
    </div>
  );
}
