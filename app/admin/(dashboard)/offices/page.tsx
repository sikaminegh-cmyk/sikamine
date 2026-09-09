import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { OfficesManager } from "@/components/admin/offices-manager";

export default async function AdminOfficesPage() {
  const supabase = await createClient();
  const { data: offices } = await supabase.from("office_locations").select("*").order("position", { ascending: true });

  return (
    <div>
      <PageHeader title="Office Locations" description="Add, edit or remove Sikamine office locations shown on the Contact page." />
      <OfficesManager initialOffices={offices ?? []} />
    </div>
  );
}
