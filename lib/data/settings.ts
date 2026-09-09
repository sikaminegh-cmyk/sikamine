import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { SeoSettingsRow, SiteSettingsRow } from "@/lib/types/database";

export const getSiteSettings = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  return data as SiteSettingsRow | null;
});

export const getSeoSettings = cache(async (routeKey: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("seo_settings")
    .select("*")
    .eq("route_key", routeKey)
    .maybeSingle();
  return data as SeoSettingsRow | null;
});
