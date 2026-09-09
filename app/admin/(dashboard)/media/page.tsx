import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { MediaLibrary } from "@/components/admin/media-library";

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data: media } = await supabase.from("media").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Media Library" description="Images, videos and documents used across the website." />
      <MediaLibrary initialMedia={media ?? []} />
    </div>
  );
}
