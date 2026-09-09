import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getNavigation } from "@/lib/data/navigation";
import { getSiteSettings } from "@/lib/data/settings";
import { getCompanyContacts, pickContact } from "@/lib/data/contacts";
import { Logo } from "./logo";

const legalSlugs = new Set(["/terms", "/privacy", "/cookies"]);

export async function Footer() {
  const [items, settings, contacts] = await Promise.all([
    getNavigation("footer"),
    getSiteSettings(),
    getCompanyContacts(),
  ]);

  const mainLinks = items.filter((i) => !legalSlugs.has(i.url));
  const legalLinks = items.filter((i) => legalSlugs.has(i.url));
  const phone = pickContact(contacts, "phone");
  const email = pickContact(contacts, "general_email");
  const infoEmail = pickContact(contacts, "info_email");
  const postalAddress = pickContact(contacts, "postal_address");
  const physicalAddress = pickContact(contacts, "physical_address");
  const socialLinks = Object.entries(settings?.social_links ?? {}).filter(([, url]) => url);

  return (
    <footer className="bg-dark-bg text-white/80">
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1.3fr]">
        <div>
          {settings?.dark_logo_url ? (
            <Image src={settings.dark_logo_url} alt={settings.site_name} width={160} height={40} className="h-10 w-auto" />
          ) : settings?.logo_url ? (
            <div className="inline-block rounded-lg bg-white p-2">
              <Image src={settings.logo_url} alt={settings.site_name} width={160} height={40} className="h-8 w-auto" />
            </div>
          ) : (
            <Logo dark />
          )}
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            {settings?.footer_description ?? "Structured, transparent and responsible gold trading built on governance and compliance."}
          </p>
          {socialLinks.length > 0 && (
            <div className="mt-6 flex gap-3">
              {socialLinks.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-orange hover:text-orange"
                >
                  <Globe size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Navigation</h3>
          <ul className="space-y-3">
            {mainLinks.map((item) => (
              <li key={item.id}>
                <Link href={item.url} className="text-sm text-white/70 hover:text-orange">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Contact</h3>
          <address className="space-y-3 text-sm not-italic text-white/70">
            <p className="font-semibold text-white">Sikamine Gold Trading Ltd</p>
            {physicalAddress && (
              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-orange" /> {physicalAddress}
              </p>
            )}
            {postalAddress && <p className="pl-6">{postalAddress}</p>}
            {phone && (
              <p className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-orange" />
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-orange">
                  {phone}
                </a>
              </p>
            )}
            {email && (
              <p className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-orange" />
                <a href={`mailto:${email}`} className="hover:text-orange">
                  {email}
                </a>
              </p>
            )}
            {infoEmail && (
              <p className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-orange" />
                <a href={`mailto:${infoEmail}`} className="hover:text-orange">
                  {infoEmail}
                </a>
              </p>
            )}
          </address>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings?.footer_copyright ?? "Sikamine Gold Trading Ltd. All Rights Reserved."}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((item) => (
              <li key={item.id}>
                <Link href={item.url} className="hover:text-orange">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
