import { LinkButton } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/public/reveal";
import type { PageSectionRow } from "@/lib/types/database";

export function CtaSection({ section }: { section: PageSectionRow }) {
  return (
    <Section background={section.background_style} className="text-center">
      <Reveal className="mx-auto max-w-2xl">
        {section.title && <h2 className="font-heading text-3xl font-bold sm:text-4xl">{section.title}</h2>}
        {section.subtitle && <p className="mt-4 text-lg opacity-80">{section.subtitle}</p>}
        {(section.cta_label || section.secondary_cta_label) && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
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
      </Reveal>
    </Section>
  );
}
