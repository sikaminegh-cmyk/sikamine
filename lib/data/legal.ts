import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { LegalDocType, LegalDocumentRow } from "@/lib/types/database";

export const getLegalDocument = cache(async (type: LegalDocType) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("legal_documents")
    .select("*")
    .eq("type", type)
    .eq("published", true)
    .maybeSingle();
  return data as LegalDocumentRow | null;
});
