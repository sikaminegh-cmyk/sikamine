import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { PartnerCategoryRow } from "@/lib/types/database";

export const getPartnerCategories = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("partner_categories")
    .select("*")
    .eq("status", "active")
    .order("position", { ascending: true });
  return (data ?? []) as PartnerCategoryRow[];
});
