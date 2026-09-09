import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { DynamicIcon } from "@/lib/icon-registry";
import { getServiceBySlug } from "@/lib/data/services";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.seo_title || `${service.name} | Sikamine Gold Trading Ltd`,
    description: service.seo_description || service.short_description || undefined,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <section className="bg-navy py-24 text-white lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-orange">
            <DynamicIcon name={service.icon} size={28} />
          </div>
          <h1 className="mt-6 font-heading text-4xl font-bold sm:text-5xl">{service.name}</h1>
          {service.short_description && <p className="mt-5 text-lg text-white/75">{service.short_description}</p>}
        </div>
      </section>

      <Section background="light">
        <div className="mx-auto max-w-3xl">
          {service.full_description && (
            <div className="rich-text" dangerouslySetInnerHTML={{ __html: service.full_description }} />
          )}
          <div className="mt-12 flex flex-wrap gap-4">
            <LinkButton href="/contact">Contact Sikamine</LinkButton>
            <LinkButton href="/partnerships" variant="secondary">
              Partnership Enquiry
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
