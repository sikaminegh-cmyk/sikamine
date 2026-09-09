import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { PartnerLogosManager } from "@/components/admin/partner-logos-manager";
import type { PartnerLogoRow } from "@/lib/types/database";

export default async function AdminPartnerLogosPage() {
  const supabase = await createClient();
  const { data: logos } = await supabase.from("partner_logos").select("*").order("position", { ascending: true });

  return (
    <div>
      <PageHeader title="Partner & Regulator Logos" description="Banking partners and regulatory body logos shown in the trust carousel above the footer." />
      <PartnerLogosManager initialLogos={(logos ?? []) as PartnerLogoRow[]} />
    </div>
  );
}
