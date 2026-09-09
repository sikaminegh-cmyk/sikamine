import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { PageRow, PageSectionRow } from "@/lib/types/database";

export const getPageWithSections = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  const typedPage = page as PageRow | null;
  if (!typedPage) return null;

  const { data: sections } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", typedPage.id)
    .eq("visible", true)
    .order("position", { ascending: true });

  return { page: typedPage, sections: (sections ?? []) as PageSectionRow[] };
});
