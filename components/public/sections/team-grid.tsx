import Image from "next/image";
import { ExternalLink, Mail, User } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/public/reveal";
import { getTeamMembers } from "@/lib/data/team";
import type { PageSectionRow } from "@/lib/types/database";

export async function TeamGrid({ section }: { section: PageSectionRow }) {
  const members = await getTeamMembers();
  if (members.length === 0) return null;

  return (
    <Section background={section.background_style}>
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          {section.title && <h2 className="font-heading text-3xl font-bold sm:text-4xl">{section.title}</h2>}
          {section.subtitle && <p className="mt-4 text-lg opacity-80">{section.subtitle}</p>}
        </Reveal>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member, i) => (
          <Reveal key={member.id} delay={i * 80}>
            <div className="group overflow-hidden rounded-2xl border border-black/5 bg-white text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-navy/5">
                {member.photo_url ? (
                  <Image
                    src={member.photo_url}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-navy/20"><User size={56} /></div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-heading text-base font-bold">{member.name}</h3>
                {member.title && <p className="text-sm text-orange">{member.title}</p>}
                {member.bio && <p className="mt-3 text-sm leading-relaxed opacity-70">{member.bio}</p>}
                {(member.email || member.linkedin_url) && (
                  <div className="mt-4 flex justify-center gap-3">
                    {member.email && (
                      <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} className="text-text-grey hover:text-orange">
                        <Mail size={16} />
                      </a>
                    )}
                    {member.linkedin_url && (
                      <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`} className="text-text-grey hover:text-orange">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
