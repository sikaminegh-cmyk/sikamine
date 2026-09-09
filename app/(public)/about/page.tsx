import { notFound } from "next/navigation";
import { getPageWithSections } from "@/lib/data/pages";
import { SectionRenderer } from "@/components/public/section-renderer";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata(
    "about",
    "About Sikamine Gold Trading Ltd",
    "A Ghana-based gold trading and aggregation company focused on structured, compliant operations."
  );
}

export default async function AboutPage() {
  const result = await getPageWithSections("about");
  if (!result) notFound();

  return <SectionRenderer sections={result.sections} />;
}
