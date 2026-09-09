import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/public/reveal";
import { DynamicIcon } from "@/lib/icon-registry";
import { getPillars } from "@/lib/data/pillars";
import type { PageSectionRow } from "@/lib/types/database";

export async function PillarsGrid({ section }: { section: PageSectionRow }) {
  const pillars = await getPillars();
  if (pillars.length === 0) return null;

  return (
    <Section background={section.background_style}>
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          {section.title && <h2 className="font-heading text-3xl font-bold sm:text-4xl">{section.title}</h2>}
          {section.subtitle && <p className="mt-4 text-lg opacity-80">{section.subtitle}</p>}
        </Reveal>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar, i) => {
          return (
            <Reveal key={pillar.id} delay={i * 80}>
              <div className="group relative rounded-2xl border-t-4 border-orange bg-white p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl">
                <span className="font-heading text-4xl font-extrabold text-navy/10">{pillar.number}</span>
                <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-lg bg-navy text-white transition-transform duration-300 group-hover:scale-110">
                  <DynamicIcon name={pillar.icon} size={20} className="text-white" />
                </div>
                <h3 className="mt-5 font-heading text-base font-bold">{pillar.name}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-70">{pillar.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
