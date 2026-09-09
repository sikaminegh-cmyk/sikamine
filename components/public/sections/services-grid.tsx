import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/public/reveal";
import { DynamicIcon } from "@/lib/icon-registry";
import { getServices } from "@/lib/data/services";
import type { PageSectionRow } from "@/lib/types/database";

export async function ServicesGrid({ section }: { section: PageSectionRow }) {
  const services = await getServices();
  if (services.length === 0) return null;

  return (
    <Section background={section.background_style}>
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          {section.title && <h2 className="font-heading text-3xl font-bold sm:text-4xl">{section.title}</h2>}
          {section.subtitle && <p className="mt-4 text-lg opacity-80">{section.subtitle}</p>}
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, i) => {
          return (
            <Reveal key={service.id} delay={i * 80}>
              <div className="group flex h-full flex-col rounded-2xl border border-black/5 bg-white p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-orange/20 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5 text-navy transition-all duration-300 group-hover:scale-110 group-hover:bg-orange group-hover:text-white">
                  <DynamicIcon name={service.icon} size={24} />
                </div>
                <h3 className="mt-6 font-heading text-lg font-bold">{service.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed opacity-70">{service.short_description}</p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange"
                >
                  Learn More <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
