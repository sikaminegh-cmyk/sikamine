import type { Metadata } from "next";
import { getSeoSettings } from "@/lib/data/settings";

export async function buildMetadata(routeKey: string, fallbackTitle: string, fallbackDescription: string): Promise<Metadata> {
  const seo = await getSeoSettings(routeKey);

  return {
    title: seo?.seo_title || fallbackTitle,
    description: seo?.meta_description || fallbackDescription,
    keywords: seo?.keywords ?? undefined,
    alternates: seo?.canonical_url ? { canonical: seo.canonical_url } : undefined,
    robots: seo?.no_index ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo?.og_title || seo?.seo_title || fallbackTitle,
      description: seo?.og_description || seo?.meta_description || fallbackDescription,
      images: seo?.og_image ? [seo.og_image] : undefined,
    },
  };
}
