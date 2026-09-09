import "server-only";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { AdminUserRow } from "@/lib/types/database";

interface AuditInput {
  admin: AdminUserRow;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent({ admin, action, entity, entityId, metadata }: AuditInput) {
  const supabase = await createClient();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null;

  const { error } = await supabase.from("audit_logs").insert({
    admin_id: admin.id,
    admin_name: admin.full_name,
    action,
    entity,
    entity_id: entityId ?? null,
    metadata: metadata ?? {},
    ip_address: ip,
  });

  if (error) console.error("[audit] failed to log event", action, entity, error);
}
