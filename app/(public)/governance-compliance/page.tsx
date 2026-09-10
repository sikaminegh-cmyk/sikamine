import { notFound } from "next/navigation";
import { getPageWithSections } from "@/lib/data/pages";
import { SectionRenderer } from "@/components/public/section-renderer";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata(
    "governance-compliance",
    "Governance & Compliance | Sikamine Gold Trading Ltd",
    "How Sikamine structures its operations around governance, compliance and traceability in Ghanaian gold trade."
  );
}

export default async function GovernanceCompliancePage() {
  const result = await getPageWithSections("governance-compliance");
  if ("debug" in result) return <pre style={{ padding: 40 }}>{result.debug}</pre>;

  return <SectionRenderer sections={result.sections} />;
}
