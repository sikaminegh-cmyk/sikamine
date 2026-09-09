import { createBrowserClient } from "@supabase/ssr";

// Deliberately untyped generic here — see the comment in lib/supabase/server.ts
// for why passing <Database> through SupabaseClient's generics is avoided.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
