#!/usr/bin/env node
// Creates (or promotes) an admin user. Run this once to bootstrap the first
// Super Admin, or any time afterwards to create additional admins outside
// the UI. Requires SUPABASE_SERVICE_ROLE_KEY — never run this against
// production from an untrusted machine.
//
// Usage:
//   node scripts/create-admin.mjs "owner@sikamine.example" "StrongPassw0rd!" "Full Name" super_admin

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const [, , email, password, fullName, role = "super_admin"] = process.argv;

if (!email || !password || !fullName) {
  console.error('Usage: node scripts/create-admin.mjs "email" "password" "Full Name" [role]');
  process.exit(1);
}

if (!["super_admin", "administrator", "editor"].includes(role)) {
  console.error("role must be one of: super_admin, administrator, editor");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (in .env.local or the environment).");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  let userId = created?.user?.id;

  if (createError) {
    if (createError.message?.toLowerCase().includes("already")) {
      const { data: list, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;
      const existing = list.users.find((u) => u.email === email);
      if (!existing) throw createError;
      userId = existing.id;
      console.log(`Auth user already existed for ${email} — reusing it.`);
    } else {
      throw createError;
    }
  }

  const { error: upsertError } = await supabase
    .from("admin_users")
    .upsert(
      { user_id: userId, email, full_name: fullName, role, status: "active" },
      { onConflict: "user_id" }
    );

  if (upsertError) throw upsertError;

  console.log(`✔ ${role} ready: ${email}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
