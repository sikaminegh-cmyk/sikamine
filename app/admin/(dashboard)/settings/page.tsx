import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export default async function AdminSettingsPage() {
  await requireAdmin(["super_admin", "administrator"]);
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  return (
    <div>
      <PageHeader title="Site Settings" description="Global branding, footer, social links and analytics configuration." />
      {settings && <SiteSettingsForm settings={settings} />}
    </div>
  );
}
