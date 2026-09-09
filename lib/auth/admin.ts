import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AdminRole, AdminUserRow } from "@/lib/types/database";

/**
 * Fetches the current authenticated admin's row. Returns null if not
 * logged in or not an active admin — RLS already blocks writes either way,
 * this is for UI gating and audit attribution.
 */
export async function getCurrentAdmin(): Promise<AdminUserRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  return data as AdminUserRow | null;
}

/**
 * Server-action / server-component guard. Redirects to login if not an
 * active admin, or throws if the role requirement isn't met (RLS would
 * reject the write anyway — this gives a clearer error earlier).
 */
export async function requireAdmin(roles?: AdminRole[]): Promise<AdminUserRow> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (roles && !roles.includes(admin.role)) {
    throw new Error("You do not have permission to perform this action.");
  }
  return admin;
}
