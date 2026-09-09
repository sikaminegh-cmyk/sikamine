"use server";

import { createClient } from "@/lib/supabase/server";

export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false as const, error: "Invalid email or password." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Invalid email or password." };

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin || admin.status !== "active") {
    await supabase.auth.signOut();
    return { ok: false as const, error: "This account does not have admin access." };
  }

  await supabase.from("admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", admin.id);

  return { ok: true as const };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
