import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { getSiteSettings } from "@/lib/data/settings";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.site_name ?? "Sikamine Gold Trading Ltd";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: { default: siteName, template: `%s | ${siteName}` },
    description: settings?.footer_description ?? "Structured, transparent and responsible gold trading built on governance and compliance.",
    icons: { icon: settings?.favicon_url || "/favicon.svg" },
    openGraph: {
      siteName,
      type: "website",
      images: settings?.default_seo_image ? [settings.default_seo_image] : undefined,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.site_name ?? "Sikamine Gold Trading Ltd",
    url: siteUrl,
    logo: settings?.logo_url ?? undefined,
    description: settings?.footer_description,
  };

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${manrope.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NextTopLoader color="#F9660E" height={3} showSpinner={false} shadow="0 0 10px #F9660E, 0 0 5px #F9660E" />
        {children}
      </body>
    </html>
  );
}
