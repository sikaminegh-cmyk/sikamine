import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { PillarsManager } from "@/components/admin/pillars-manager";

export default async function AdminPillarsPage() {
  const supabase = await createClient();
  const { data: pillars } = await supabase.from("pillars").select("*").order("position", { ascending: true });

  return (
    <div>
      <PageHeader title="Company Pillars" description="The principles shown behind every transaction on the homepage and About page." />
      <PillarsManager initialPillars={pillars ?? []} />
    </div>
  );
}
