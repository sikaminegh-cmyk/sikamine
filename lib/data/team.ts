import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { TeamMemberRow } from "@/lib/types/database";

export const getTeamMembers = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("visible", true)
    .order("position", { ascending: true });
  return (data ?? []) as TeamMemberRow[];
});
