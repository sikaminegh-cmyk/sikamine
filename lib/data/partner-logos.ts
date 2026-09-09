import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { PartnerLogoRow } from "@/lib/types/database";

export const getPartnerLogos = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("partner_logos")
    .select("*")
    .eq("visible", true)
    .order("position", { ascending: true });
  return (data ?? []) as PartnerLogoRow[];
});
