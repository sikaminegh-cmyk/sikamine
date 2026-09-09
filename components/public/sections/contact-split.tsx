import { Building2, Mail, MapPin, Phone, Clock } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/public/reveal";
import { ContactForm } from "@/components/public/contact-form";
import { getOffices } from "@/lib/data/offices";
import { getCompanyContacts } from "@/lib/data/contacts";
import type { PageSectionRow } from "@/lib/types/database";

// Fixed display order — Postgres jsonb does not preserve key insertion order,
// so iterating Object.entries() directly can shuffle the days on each read.
const dayOrder = ["mon_fri", "sat", "sun"] as const;
const dayLabels: Record<string, string> = {
  mon_fri: "Mon – Fri",
  sat: "Saturday",
  sun: "Sunday",
};

export async function ContactSplit({ section }: { section: PageSectionRow }) {
  const [offices, contacts] = await Promise.all([getOffices(), getCompanyContacts()]);
  const departmentContacts = contacts.filter((c) => c.type === "email" && c.key !== "general_email");

  return (
    <Section background={section.background_style}>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          {(section.title || section.subtitle) && (
            <Reveal>
              {section.title && <h2 className="font-heading text-3xl font-bold sm:text-4xl">{section.title}</h2>}
              {section.subtitle && <p className="mt-4 text-lg opacity-80">{section.subtitle}</p>}
            </Reveal>
          )}

          {offices.map((office, i) => (
            <Reveal key={office.id} delay={i * 80}>
              <div className="group rounded-2xl border border-black/5 bg-white p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy/5 text-navy transition-transform duration-300 group-hover:scale-110">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold">{office.title}</h3>
                    {office.is_headquarters && (
                      <span className="text-xs font-semibold uppercase tracking-wide text-orange">Headquarters</span>
                    )}
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm opacity-80">
                  {(office.street_address || office.city || office.country) && (
                    <p className="flex items-start gap-2">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-text-grey" />
                      {[office.street_address, office.city, office.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {office.postal_address && <p className="pl-6">{office.postal_address}</p>}
                  {office.phone && (
                    <p className="flex items-center gap-2">
                      <Phone size={16} className="shrink-0 text-text-grey" />
                      <a href={`tel:${office.phone.replace(/\s+/g, "")}`} className="hover:text-orange">{office.phone}</a>
                    </p>
                  )}
                  {office.email && (
                    <p className="flex items-center gap-2">
                      <Mail size={16} className="shrink-0 text-text-grey" />
                      <a href={`mailto:${office.email}`} className="hover:text-orange">{office.email}</a>
                    </p>
                  )}
                  {Object.keys(office.business_hours ?? {}).length > 0 && (
                    <div className="flex items-start gap-2">
                      <Clock size={16} className="mt-0.5 shrink-0 text-text-grey" />
                      <ul>
                        {[...dayOrder, ...Object.keys(office.business_hours).filter((d) => !dayOrder.includes(d as (typeof dayOrder)[number]))]
                          .filter((day) => office.business_hours[day])
                          .map((day) => (
                            <li key={day}>{dayLabels[day] ?? day}: {office.business_hours[day]}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                  {office.maps_url && (
                    <a href={office.maps_url} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-semibold text-orange">
                      View on Google Maps →
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}

          {departmentContacts.length > 0 && (
            <Reveal delay={120}>
              <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
                <h3 className="font-heading text-base font-bold">Department Contacts</h3>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  {departmentContacts.map((c) => (
                    <div key={c.id}>
                      <dt className="text-xs font-semibold uppercase tracking-wide opacity-60">{c.label}</dt>
                      <dd className="mt-1 text-sm">
                        <a href={`mailto:${c.value}`} className="text-orange hover:underline">{c.value}</a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          )}
        </div>

        <Reveal delay={160} className="lg:sticky lg:top-24">
          <h3 className="mb-5 font-heading text-lg font-bold text-navy">Send Us a Message</h3>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
