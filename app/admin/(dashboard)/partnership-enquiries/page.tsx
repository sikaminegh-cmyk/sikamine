import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { PartnershipEnquiriesInbox } from "@/components/admin/partnership-enquiries-inbox";

export default async function AdminPartnershipEnquiriesPage() {
  const supabase = await createClient();
  const { data: enquiries } = await supabase.from("partnership_enquiries").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Partnership Enquiries" description="Enquiries submitted through the Partnerships page." />
      <PartnershipEnquiriesInbox initialEnquiries={enquiries ?? []} />
    </div>
  );
}
