import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PageRow, PageSectionRow } from "@/lib/types/database";

export const getPageWithSections = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  const typedPage = page as PageRow | null;
  if (!typedPage) {
    const message = `no page for slug="${slug}" pageError=${JSON.stringify(pageError)} url=${process.env.NEXT_PUBLIC_SUPABASE_URL}`;
    console.error(`[getPageWithSections] ${message}`);
    try {
      await createAdminClient().from("_debug_log").insert({ message });
    } catch {
      // best-effort diagnostic only
    }
    return null;
  }

  const { data: sections, error: sectionsError } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", typedPage.id)
    .eq("visible", true)
    .order("position", { ascending: true });

  if (sectionsError) {
    console.error(`[getPageWithSections] sections error for slug="${slug}"`, { sectionsError });
  }

  return { page: typedPage, sections: (sections ?? []) as PageSectionRow[] };
});
