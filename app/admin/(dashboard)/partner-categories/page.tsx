import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { PartnerCategoriesManager } from "@/components/admin/partner-categories-manager";

export default async function AdminPartnerCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("partner_categories").select("*").order("position", { ascending: true });

  return (
    <div>
      <PageHeader title="Partner Categories" description="The types of partners Sikamine works with, shown on the homepage and Partnerships page." />
      <PartnerCategoriesManager initialCategories={categories ?? []} />
    </div>
  );
}
