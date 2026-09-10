import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/governance-compliance",
    "/responsible-sourcing",
    "/partnerships",
    "/contact",
    "/terms",
    "/privacy",
    "/cookies",
    "/blog",
    "/albums",
  ];

  const supabase = await createClient();
  const [{ data: services }, { data: posts }, { data: albums }] = await Promise.all([
    supabase.from("services").select("slug").eq("published", true),
    supabase.from("blog_posts").select("slug").eq("published", true),
    supabase.from("albums").select("slug").eq("published", true),
  ]);

  const serviceRoutes = (services ?? []).map((s) => `/services/${s.slug}`);
  const blogRoutes = (posts ?? []).map((p) => `/blog/${p.slug}`);
  const albumRoutes = (albums ?? []).map((a) => `/albums/${a.slug}`);

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes, ...albumRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
