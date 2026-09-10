import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Not passing <Database> here deliberately: @supabase/supabase-js's
// SupabaseClient type resolves its Row/Insert/Update generics through five
// chained, mutually-defaulted type parameters, and as of supabase-js 2.114–
// 2.116 that chain reliably collapses to `never` for any hand-written (or
// even codegen-shaped) Database type passed through createClient/
// createServerClient/createBrowserClient — reproduced in isolation outside
// this project too. lib/types/database.ts's interfaces are still the
// source of truth and are used directly as prop/return types throughout the
// app; only the automatic inference through the client's generic is
// unusable until upstream fixes it.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component; safe to ignore
            // because middleware refreshes the session on every request.
          }
        },
      },
      // Next.js patches global fetch to cache requests by default. This is
      // admin-editable CMS content queried straight from Postgres — it must
      // never be served from Next's Data Cache (an admin edit should show
      // up on the next request, not whenever that cache entry expires).
      global: {
        fetch: (url, options = {}) => fetch(url, { ...options, cache: "no-store" }),
      },
    }
  );
}
