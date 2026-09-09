import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/public/reveal";
import { PartnershipForm } from "@/components/public/partnership-form";
import type { PageSectionRow } from "@/lib/types/database";

export function PartnershipFormSection({ section }: { section: PageSectionRow }) {
  return (
    <Section background={section.background_style}>
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          {section.title && <h2 className="font-heading text-3xl font-bold sm:text-4xl">{section.title}</h2>}
          {section.subtitle && <p className="mt-4 text-lg opacity-80">{section.subtitle}</p>}
        </Reveal>
        <div className="mt-10">
          <PartnershipForm />
        </div>
      </div>
    </Section>
  );
}
