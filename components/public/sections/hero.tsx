import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { PageSectionRow } from "@/lib/types/database";

export function Hero({ section, compact = false }: { section: PageSectionRow; compact?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-orange/30 blur-3xl motion-safe:animate-[floatSlow_9s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full bg-gold/20 blur-3xl motion-safe:animate-[floatSlowReverse_11s_ease-in-out_infinite]" />
      </div>

      {section.image_url && (
        <Image
          src={section.image_url}
          alt=""
          fill
          priority
          className="object-cover opacity-25"
        />
      )}

      <Container className={compact ? "relative py-16 lg:py-20" : "relative py-28 lg:py-40"}>
        <div className="max-w-3xl motion-safe:animate-[fadeUp_0.8s_ease-out]">
          {section.title && (
            <h1 className={compact ? "font-heading text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl" : "font-heading text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"}>
              {section.title}
            </h1>
          )}
          {section.subtitle && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{section.subtitle}</p>
          )}
          {(section.cta_label || section.secondary_cta_label) && (
            <div className="mt-10 flex flex-wrap gap-4">
              {section.cta_label && section.cta_url && (
                <LinkButton href={section.cta_url} variant="primary">
                  {section.cta_label}
                </LinkButton>
              )}
              {section.secondary_cta_label && section.secondary_cta_url && (
                <LinkButton href={section.secondary_cta_url} variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  {section.secondary_cta_label}
                </LinkButton>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
