import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { ServiceRow } from "@/lib/types/database";

export const getServices = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .order("position", { ascending: true });
  return (data ?? []) as ServiceRow[];
});

export const getServiceBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data as ServiceRow | null;
});
