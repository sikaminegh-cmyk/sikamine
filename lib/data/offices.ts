import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { OfficeLocationRow } from "@/lib/types/database";

export const getOffices = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("office_locations")
    .select("*")
    .eq("visible", true)
    .order("position", { ascending: true });
  return (data ?? []) as OfficeLocationRow[];
});
