import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client. Bypasses RLS — only use for admin-invite (Supabase
 * Auth Admin API) and private-document signed URLs. Never import this into
 * client components; the `server-only` guard above enforces that at build time.
 *
 * No <Database> generic — see the comment in lib/supabase/server.ts.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
