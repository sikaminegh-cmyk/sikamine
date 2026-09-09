import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { PillarRow } from "@/lib/types/database";

export const getPillars = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pillars")
    .select("*")
    .eq("status", "active")
    .order("position", { ascending: true });
  return (data ?? []) as PillarRow[];
});
