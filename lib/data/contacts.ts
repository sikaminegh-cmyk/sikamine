import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { CompanyContactRow } from "@/lib/types/database";

export const getCompanyContacts = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("company_contacts")
    .select("*")
    .eq("public_visible", true)
    .order("position", { ascending: true });
  return (data ?? []) as CompanyContactRow[];
});

export function pickContact(contacts: CompanyContactRow[], key: string) {
  return contacts.find((c) => c.key === key)?.value ?? null;
}
