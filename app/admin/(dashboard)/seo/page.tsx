import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { SeoManager } from "@/components/admin/seo-manager";

export default async function AdminSeoPage() {
  await requireAdmin(["super_admin", "administrator"]);
  const supabase = await createClient();
  const { data: seo } = await supabase.from("seo_settings").select("*");

  return (
    <div>
      <PageHeader title="SEO" description="Meta titles, descriptions and social sharing details for every public page." />
      <SeoManager initialSeo={seo ?? []} />
    </div>
  );
}
