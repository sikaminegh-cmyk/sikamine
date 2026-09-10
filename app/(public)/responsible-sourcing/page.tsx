import { notFound } from "next/navigation";
import { getPageWithSections } from "@/lib/data/pages";
import { SectionRenderer } from "@/components/public/section-renderer";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata(
    "responsible-sourcing",
    "Responsible Sourcing | Sikamine Gold Trading Ltd",
    "Sikamine's commitment to licensed suppliers, due diligence, traceability and responsible gold sourcing."
  );
}

export default async function ResponsibleSourcingPage() {
  const result = await getPageWithSections("responsible-sourcing");
  if ("debug" in result) return <pre style={{ padding: 40 }}>{result.debug}</pre>;

  return <SectionRenderer sections={result.sections} />;
}
