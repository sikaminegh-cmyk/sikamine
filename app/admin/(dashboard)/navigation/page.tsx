import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { NavigationManager } from "@/components/admin/navigation-manager";

export default async function AdminNavigationPage() {
  await requireAdmin(["super_admin", "administrator"]);
  const supabase = await createClient();
  const { data: items } = await supabase.from("navigation_items").select("*").order("position", { ascending: true });

  return (
    <div>
      <PageHeader title="Navigation" description="Manage header and footer navigation links." />
      <NavigationManager initialItems={items ?? []} />
    </div>
  );
}
