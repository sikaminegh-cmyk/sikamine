"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { logAuditEvent } from "@/lib/audit";

export interface RecordMediaInput {
  filename: string;
  storage_path: string;
  bucket: string;
  public_url: string | null;
  mime_type: string;
  size_bytes: number;
  alt_text: string;
  is_public: boolean;
}

export async function recordMediaUpload(input: RecordMediaInput) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase.from("media").insert({ ...input, uploaded_by: admin.id }).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "create", entity: "media", entityId: data.id, metadata: { filename: data.filename } });
  revalidatePath("/admin/media");
  return { ok: true as const, data };
}

export async function updateMedia(id: string, input: { alt_text?: string; is_public?: boolean }) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("media").update(input).eq("id", id).select().single();
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "update", entity: "media", entityId: id });
  revalidatePath("/admin/media");
  return { ok: true as const, data };
}

export async function deleteMedia(id: string, bucket: string, storagePath: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { error: storageError } = await supabase.storage.from(bucket).remove([storagePath]);
  if (storageError) return { ok: false as const, error: storageError.message };

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  await logAuditEvent({ admin, action: "delete", entity: "media", entityId: id });
  revalidatePath("/admin/media");
  return { ok: true as const };
}
