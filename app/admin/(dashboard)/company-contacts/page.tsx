import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { CompanyContactsManager } from "@/components/admin/company-contacts-manager";

export default async function AdminCompanyContactsPage() {
  const supabase = await createClient();
  const { data: contacts } = await supabase.from("company_contacts").select("*").order("position", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Company Contact Information"
        description="Phone numbers, addresses and department emails (CEO, Director, Compliance, Partnerships, etc.). Toggle Public to control what appears on the website."
      />
      <CompanyContactsManager initialContacts={contacts ?? []} />
    </div>
  );
}
