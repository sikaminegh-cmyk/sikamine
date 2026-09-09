import { CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/public/reveal";
import type { PageSectionRow } from "@/lib/types/database";

function extractListItems(html: string | null) {
  if (!html) return [];
  const matches = [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)];
  return matches.map((m) => m[1]);
}

export function WhySikamine({ section }: { section: PageSectionRow }) {
  const items = extractListItems(section.body);

  return (
    <Section background={section.background_style}>
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          {section.title && <h2 className="font-heading text-3xl font-bold sm:text-4xl">{section.title}</h2>}
          {section.subtitle && <p className="mt-4 text-lg opacity-80">{section.subtitle}</p>}
        </Reveal>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={i} delay={i * 60}>
            <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-white px-5 py-4 shadow-sm">
              <CheckCircle2 size={20} className="shrink-0 text-orange" />
              <span className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: item }} />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
