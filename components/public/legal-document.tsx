import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { getLegalDocument } from "@/lib/data/legal";
import { formatDate } from "@/lib/utils";
import type { LegalDocType } from "@/lib/types/database";

export async function LegalDocument({ type }: { type: LegalDocType }) {
  const doc = await getLegalDocument(type);
  if (!doc) notFound();

  return (
    <>
      <section className="bg-navy py-20 text-center text-white">
        <h1 className="font-heading text-4xl font-bold">{doc.title}</h1>
        <p className="mt-3 text-sm text-white/60">
          Version {doc.version} · Effective {formatDate(doc.effective_date)}
        </p>
      </section>
      <Section background="light">
        <div className="rich-text mx-auto max-w-3xl" dangerouslySetInnerHTML={{ __html: doc.content }} />
      </Section>
    </>
  );
}
