import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// No <Database> generic — see the comment in lib/supabase/server.ts.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
      // See lib/supabase/server.ts — never let Next's fetch cache serve a
      // stale auth/admin-status result here.
      global: {
        fetch: (url, options = {}) => fetch(url, { ...options, cache: "no-store" }),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && user) {
    // Confirm the session still maps to an active admin before bouncing away
    // from the login page — a stale cookie for a deactivated user should not
    // redirect into the dashboard.
    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminRow?.status === "active") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.searchParams.delete("next");
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
