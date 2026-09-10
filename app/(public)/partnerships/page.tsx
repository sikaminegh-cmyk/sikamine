import { notFound } from "next/navigation";
import { getPageWithSections } from "@/lib/data/pages";
import { SectionRenderer } from "@/components/public/section-renderer";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata(
    "partnerships",
    "Partnerships | Sikamine Gold Trading Ltd",
    "Partner with Sikamine Gold Trading Ltd as a licensed miner, verified buyer, off-taker or institutional partner."
  );
}

export default async function PartnershipsPage() {
  const result = await getPageWithSections("partnerships");
  if ("debug" in result) return <pre style={{ padding: 40 }}>{result.debug}</pre>;

  return <SectionRenderer sections={result.sections} />;
}
