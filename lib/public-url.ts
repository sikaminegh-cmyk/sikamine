/**
 * In development, Supabase Storage's `getPublicUrl()` returns an absolute
 * `http://127.0.0.1:54321/...` URL — that host only means anything on the
 * machine actually running Supabase, so it's broken for anyone else (e.g. a
 * client viewing a tunnelled preview). Storing just the path instead lets
 * `next.config.ts`'s dev-only rewrite serve it through this app's own
 * origin, wherever that ends up being reachable from. Production keeps the
 * real absolute Supabase URL unchanged (no dev server to route through).
 */
export function toPortableUrl(url: string): string {
  if (process.env.NODE_ENV === "production") return url;
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}
