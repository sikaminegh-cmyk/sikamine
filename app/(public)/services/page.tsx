import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/public/reveal";
import { LinkButton } from "@/components/ui/button";
import { DynamicIcon } from "@/lib/icon-registry";
import { getServices } from "@/lib/data/services";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata(
    "services",
    "Our Services | Sikamine Gold Trading Ltd",
    "Gold trading, aggregator funding, compliance advisory and off-take partnerships from Sikamine Gold Trading Ltd."
  );
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="bg-navy py-24 text-center text-white lg:py-32">
        <div className="mx-auto max-w-2xl px-6">
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">Our Core Services</h1>
          <p className="mt-5 text-lg text-white/75">
            Structured gold trading, funding, compliance and off-take services built around governance and traceability.
          </p>
        </div>
      </section>

      <Section background="light">
        <div className="grid gap-8 lg:grid-cols-2">
          {services.map((service, i) => {
            return (
              <Reveal key={service.id} delay={i * 80}>
                <div className="group flex h-full flex-col rounded-2xl border border-black/5 bg-white p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-orange/20 hover:shadow-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5 text-navy transition-all duration-300 group-hover:scale-110 group-hover:bg-orange group-hover:text-white">
                    <DynamicIcon name={service.icon} size={24} />
                  </div>
                  <h2 className="mt-6 font-heading text-xl font-bold">{service.name}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed opacity-70">{service.short_description}</p>
                  <Link href={`/services/${service.slug}`} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange">
                    Learn More <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section background="navy" className="text-center">
        <h2 className="font-heading text-3xl font-bold">Interested in Working With Sikamine?</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">
          Speak with our team about gold supply, purchasing, off-take arrangements, partnerships or corporate enquiries.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <LinkButton href="/contact">Contact Sikamine</LinkButton>
          <LinkButton href="/partnerships" variant="outline" className="border-white/40 text-white hover:bg-white/10">
            Partnership Enquiry
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
