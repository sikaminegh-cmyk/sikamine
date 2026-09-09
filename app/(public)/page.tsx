import { notFound } from "next/navigation";
import { getPageWithSections } from "@/lib/data/pages";
import { SectionRenderer } from "@/components/public/section-renderer";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata(
    "home",
    "Sikamine Gold Trading Ltd | Responsible Gold Trading, Ghana",
    "Structured, transparent and compliant gold sourcing, aggregation and trade solutions from Sikamine Gold Trading Ltd, Ghana."
  );
}

export default async function HomePage() {
  const result = await getPageWithSections("home");
  if (!result) notFound();

  return <SectionRenderer sections={result.sections} />;
}
