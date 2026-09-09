import Link from "next/link";
import Image from "next/image";
import { getNavigation } from "@/lib/data/navigation";
import { getSiteSettings } from "@/lib/data/settings";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { HeaderShell } from "./header-shell";

export async function Header() {
  const [items, settings] = await Promise.all([getNavigation("header"), getSiteSettings()]);

  return (
    <HeaderShell>
      {settings?.logo_url ? (
        <Link href="/" className="shrink-0" aria-label="Sikamine Gold Trading Ltd — Home">
          <Image src={settings.logo_url} alt={settings.site_name} width={160} height={40} className="h-10 w-auto" priority />
        </Link>
      ) : (
        <Logo />
      )}

      <nav className="hidden items-center gap-8 lg:flex">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.url}
            target={item.is_external ? "_blank" : undefined}
            rel={item.is_external ? "noopener noreferrer" : undefined}
            className="nav-underline text-sm font-medium text-navy/90 transition-colors hover:text-orange"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden lg:block">
        <Link
          href="/partnerships"
          className="inline-flex items-center justify-center rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-orange-dark hover:shadow-md hover:shadow-orange/20 active:translate-y-0 active:scale-[0.97]"
        >
          Partner With Us
        </Link>
      </div>

      <MobileNav items={items} ctaLabel="Partner With Us" ctaHref="/partnerships" />
    </HeaderShell>
  );
}
