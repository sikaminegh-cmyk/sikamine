import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/public/reveal";
import type { PageSectionRow } from "@/lib/types/database";

export function TextSection({ section }: { section: PageSectionRow }) {
  const hasImage = Boolean(section.image_url);

  return (
    <Section background={section.background_style}>
      <div className={hasImage ? "grid gap-12 lg:grid-cols-2 lg:items-center" : "mx-auto max-w-3xl"}>
        <Reveal>
          {section.title && <h2 className="font-heading text-3xl font-bold sm:text-4xl">{section.title}</h2>}
          {section.subtitle && <p className="mt-4 text-lg opacity-80">{section.subtitle}</p>}
          {section.body && (
            <div className="rich-text mt-6 opacity-90" dangerouslySetInnerHTML={{ __html: section.body }} />
          )}
          {section.cta_label && section.cta_url && (
            <LinkButton href={section.cta_url} variant={section.background_style === "navy" ? "primary" : "secondary"} className="mt-4">
              {section.cta_label}
            </LinkButton>
          )}
        </Reveal>
        {hasImage && (
          <Reveal delay={150}>
            <div className="group relative aspect-4/3 overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={section.image_url!}
                alt={section.title ?? ""}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
