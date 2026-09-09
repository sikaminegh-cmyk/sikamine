import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { LegalDocumentsManager } from "@/components/admin/legal-documents-manager";

export default async function AdminLegalPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase.from("legal_documents").select("*");

  return (
    <div>
      <PageHeader title="Legal Documents" description="Terms & Conditions, Privacy Policy, Cookie Policy and other legal content." />
      <LegalDocumentsManager initialDocuments={documents ?? []} />
    </div>
  );
}
