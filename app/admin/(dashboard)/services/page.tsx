import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { ServicesManager } from "@/components/admin/services-manager";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase.from("services").select("*").order("position", { ascending: true });

  return (
    <div>
      <PageHeader title="Services" description="Manage the services shown on the homepage and Services page." />
      <ServicesManager initialServices={services ?? []} />
    </div>
  );
}
