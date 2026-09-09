import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/public/reveal";
import type { PageSectionRow } from "@/lib/types/database";

export function ValueCardsGrid({ sections }: { sections: PageSectionRow[] }) {
  if (sections.length === 0) return null;
  const background = sections[0].background_style;

  return (
    <Section background={background}>
      <div className="grid gap-6 md:grid-cols-3">
        {sections.map((section, i) => (
          <Reveal key={section.id} delay={i * 80}>
            <div className="h-full rounded-2xl border border-black/5 bg-white p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl">
              {section.title && <h3 className="font-heading text-lg font-bold text-navy">{section.title}</h3>}
              {section.body && <div className="rich-text mt-3 text-sm opacity-80" dangerouslySetInnerHTML={{ __html: section.body }} />}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
