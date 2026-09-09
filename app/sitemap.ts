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
  ];

  const supabase = await createClient();
  const { data: services } = await supabase.from("services").select("slug").eq("published", true);

  const serviceRoutes = (services ?? []).map((s) => `/services/${s.slug}`);

  return [...staticRoutes, ...serviceRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
