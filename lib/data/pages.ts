import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { PageRow, PageSectionRow } from "@/lib/types/database";

export const getPageWithSections = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data: page, error: pageError, status, statusText } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  const typedPage = page as PageRow | null;
  if (!typedPage) {
    const debug = `slug="${slug}" status=${status} statusText="${statusText}" pageError=${JSON.stringify(pageError)} url=${process.env.NEXT_PUBLIC_SUPABASE_URL} hasAnon=${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY} nodeEnv=${process.env.NODE_ENV} vercelEnv=${process.env.VERCEL_ENV}`;
    return { debug };
  }

  const { data: sections } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", typedPage.id)
    .eq("visible", true)
    .order("position", { ascending: true });

  return { page: typedPage, sections: (sections ?? []) as PageSectionRow[] };
});
