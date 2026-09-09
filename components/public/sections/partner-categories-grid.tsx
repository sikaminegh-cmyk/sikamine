import { LinkButton } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/public/reveal";
import { DynamicIcon } from "@/lib/icon-registry";
import { getPartnerCategories } from "@/lib/data/partners";
import type { PageSectionRow } from "@/lib/types/database";

export async function PartnerCategoriesGrid({ section }: { section: PageSectionRow }) {
  const categories = await getPartnerCategories();
  if (categories.length === 0) return null;

  return (
    <Section background={section.background_style}>
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          {section.title && <h2 className="font-heading text-3xl font-bold sm:text-4xl">{section.title}</h2>}
          {section.subtitle && <p className="mt-4 text-lg leading-relaxed opacity-80">{section.subtitle}</p>}
          {section.cta_label && section.cta_url && (
            <LinkButton href={section.cta_url} variant="secondary" className="mt-8">
              {section.cta_label}
            </LinkButton>
          )}
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category, i) => {
            return (
              <Reveal key={category.id} delay={i * 60}>
                <div className="group flex items-start gap-3 rounded-xl border border-black/5 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold transition-transform duration-300 group-hover:scale-110">
                    <DynamicIcon name={category.icon} size={18} />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold">{category.name}</h3>
                    {category.description && <p className="mt-1 text-xs leading-relaxed opacity-70">{category.description}</p>}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
