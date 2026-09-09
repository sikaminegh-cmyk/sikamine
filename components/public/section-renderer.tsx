import type { PageSectionRow } from "@/lib/types/database";
import { Hero } from "./sections/hero";
import { TextSection } from "./sections/text-section";
import { ServicesGrid } from "./sections/services-grid";
import { PillarsGrid } from "./sections/pillars-grid";
import { PartnerCategoriesGrid } from "./sections/partner-categories-grid";
import { WhySikamine } from "./sections/why-sikamine";
import { CtaSection } from "./sections/cta-section";
import { OfficesGrid } from "./sections/offices-grid";
import { ContactFormSection } from "./sections/contact-form-section";
import { PartnershipFormSection } from "./sections/partnership-form-section";
import { ValueCardsGrid } from "./sections/value-cards-grid";
import { CeoMessage } from "./sections/ceo-message";
import { TeamGrid } from "./sections/team-grid";
import { ContactSplit } from "./sections/contact-split";

// Adjacent `value_card` sections are grouped into a single grid so each card
// stays its own admin-editable row while rendering as one layout block.
function groupSections(sections: PageSectionRow[]) {
  const groups: (PageSectionRow | PageSectionRow[])[] = [];
  for (const section of sections) {
    if (section.type === "value_card") {
      const last = groups[groups.length - 1];
      if (Array.isArray(last)) last.push(section);
      else groups.push([section]);
    } else {
      groups.push(section);
    }
  }
  return groups;
}

export function SectionRenderer({ sections }: { sections: PageSectionRow[] }) {
  const groups = groupSections(sections);

  return (
    <>
      {groups.map((group) => {
        if (Array.isArray(group)) {
          return <ValueCardsGrid key={group[0].id} sections={group} />;
        }
        const section = group;
        switch (section.type) {
          case "hero":
            return <Hero key={section.id} section={section} />;
          case "hero_compact":
            return <Hero key={section.id} section={section} compact />;
          case "services_grid":
            return <ServicesGrid key={section.id} section={section} />;
          case "pillars_grid":
            return <PillarsGrid key={section.id} section={section} />;
          case "partner_categories_grid":
            return <PartnerCategoriesGrid key={section.id} section={section} />;
          case "why_sikamine":
            return <WhySikamine key={section.id} section={section} />;
          case "cta":
            return <CtaSection key={section.id} section={section} />;
          case "offices_grid":
            return <OfficesGrid key={section.id} section={section} />;
          case "contact_form":
            return <ContactFormSection key={section.id} section={section} />;
          case "partnership_form":
            return <PartnershipFormSection key={section.id} section={section} />;
          case "ceo_message":
            return <CeoMessage key={section.id} section={section} />;
          case "team_grid":
            return <TeamGrid key={section.id} section={section} />;
          case "contact_split":
            return <ContactSplit key={section.id} section={section} />;
          case "text":
          case "compliance":
          default:
            return <TextSection key={section.id} section={section} />;
        }
      })}
    </>
  );
}
