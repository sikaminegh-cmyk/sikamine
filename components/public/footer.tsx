import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getNavigation } from "@/lib/data/navigation";
import { getSiteSettings } from "@/lib/data/settings";
import { getCompanyContacts, pickContact } from "@/lib/data/contacts";
import { Logo } from "./logo";

const legalSlugs = new Set(["/terms", "/privacy", "/cookies"]);

// lucide-react deliberately excludes trademarked brand logos, so these
// platform icons are small inline SVGs instead.
const socialIcons: Record<string, React.ReactNode> = {
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  ),
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56a5.9 5.9 0 0 0-2.13 1.39A5.9 5.9 0 0 0 .62 4.15c-.3.76-.5 1.63-.56 2.9C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.3.79.71 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.76.3 1.63.5 2.9.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.9.06-1.29.07-1.7.07-4.96s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-10.85a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
    </svg>
  ),
  facebook: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  ),
  x: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.24 2H21l-6.55 7.5L22.2 22h-6.16l-4.83-6.3L5.66 22H2.9l7.01-8.02L2 2h6.32l4.37 5.77L18.24 2Zm-1.08 18.17h1.52L7.9 3.75H6.27l10.89 16.42Z" />
    </svg>
  ),
};

export async function Footer() {
  const [items, settings, contacts] = await Promise.all([
    getNavigation("footer"),
    getSiteSettings(),
    getCompanyContacts(),
  ]);

  const mainLinks = items.filter((i) => !legalSlugs.has(i.url) && i.group_key !== "other");
  const legalLinks = items.filter((i) => legalSlugs.has(i.url));
  const otherLinks = items.filter((i) => i.group_key === "other");
  const phone = pickContact(contacts, "phone");
  const email = pickContact(contacts, "general_email");
  const infoEmail = pickContact(contacts, "info_email");
  const postalAddress = pickContact(contacts, "postal_address");
  const physicalAddress = pickContact(contacts, "physical_address");
  const socialLinks = Object.entries(settings?.social_links ?? {}).filter(([, url]) => url);

  return (
    <footer className="bg-dark-bg text-white/80">
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.2fr_0.85fr_0.85fr_1.1fr]">
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
                  {socialIcons[key] ?? <Globe size={16} />}
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

        {otherLinks.length > 0 && (
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Other Links</h3>
            <ul className="space-y-3">
              {otherLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.url}
                    target={item.is_external ? "_blank" : undefined}
                    rel={item.is_external ? "noopener noreferrer" : undefined}
                    className="text-sm text-white/70 hover:text-orange"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

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
