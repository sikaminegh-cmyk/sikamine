import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { TeamManager } from "@/components/admin/team-manager";
import type { TeamMemberRow } from "@/lib/types/database";

export default async function AdminTeamPage() {
  const supabase = await createClient();
  const { data: members } = await supabase.from("team_members").select("*").order("position", { ascending: true });

  return (
    <div>
      <PageHeader title="Team Members" description="Leadership and team profiles shown on the About page." />
      <TeamManager initialMembers={(members ?? []) as TeamMemberRow[]} />
    </div>
  );
}
