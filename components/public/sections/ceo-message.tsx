import Image from "next/image";
import { Quote, User } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/public/reveal";
import type { PageSectionRow } from "@/lib/types/database";

export function CeoMessage({ section }: { section: PageSectionRow }) {
  return (
    <Section background={section.background_style}>
      <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:items-start">
        <Reveal className="lg:sticky lg:top-24">
          <div className="mx-auto flex max-w-70 flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-navy/5 shadow-sm">
              {section.image_url ? (
                <Image src={section.image_url} alt={section.subtitle ?? "Chief Executive Officer"} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-navy/20">
                  <User size={64} />
                </div>
              )}
            </div>
            {section.subtitle && <p className="mt-4 font-heading text-sm font-bold text-navy">{section.subtitle}</p>}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <Quote size={32} className="text-orange/40" />
          {section.title && <h2 className="mt-3 font-heading text-2xl font-bold text-navy sm:text-3xl">{section.title}</h2>}
          {section.body && <div className="rich-text mt-6 opacity-90" dangerouslySetInnerHTML={{ __html: section.body }} />}
        </Reveal>
      </div>
    </Section>
  );
}
