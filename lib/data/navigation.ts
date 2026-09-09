import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { NavigationItemRow, NavLocation } from "@/lib/types/database";

export const getNavigation = cache(async (location: NavLocation) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("navigation_items")
    .select("*")
    .eq("location", location)
    .eq("visible", true)
    .order("position", { ascending: true });
  return (data ?? []) as NavigationItemRow[];
});
