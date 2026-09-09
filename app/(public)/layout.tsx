import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { CookieConsent } from "@/components/public/cookie-consent";
import { PartnerLogosCarousel } from "@/components/public/partner-logos-carousel";
import { Preloader } from "@/components/public/preloader";
import { ScrollToTop } from "@/components/public/scroll-to-top";
import { getSiteSettings } from "@/lib/data/settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  if (settings?.maintenance_mode) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center text-white">
        <h1 className="font-heading text-2xl font-bold">{settings.site_name}</h1>
        <p className="mt-4 max-w-md text-white/70">
          We are currently performing scheduled maintenance. Please check back shortly.
        </p>
      </div>
    );
  }

  return (
    <>
      <Preloader />
      <Header />
      <main className="flex-1">{children}</main>
      <PartnerLogosCarousel />
      <Footer />
      <CookieConsent analyticsId={settings?.analytics_id ?? null} />
      <ScrollToTop />
    </>
  );
}
