"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";

export interface CompanyContactInput {
  key: string;
  label: string;
  value: string;
  type: string;
  department: string;
  public_visible: boolean;
}

function revalidateContacts() {
  revalidatePath("/admin/company-contacts");
  revalidatePath("/contact");
  revalidatePath("/");
}

export async function createCompanyContact(input: CompanyContactInput) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { count } = await supabase.from("company_contacts").select("id", { count: "exact", head: true });

  const { data, error } = await supabase.from("company_contacts").insert({ ...input, position: count ?? 0 }).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "create", entity: "company_contacts", entityId: data.id, metadata: { key: data.key } });
  revalidateContacts();
  return { ok: true as const, data };
}

export async function updateCompanyContact(id: string, input: Partial<CompanyContactInput>) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("company_contacts").update(input).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "company_contacts", entityId: id, metadata: { key: data.key } });
  revalidateContacts();
  return { ok: true as const, data };
}

export async function deleteCompanyContact(id: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("company_contacts").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "company_contacts", entityId: id });
  revalidateContacts();
  return { ok: true as const };
}
