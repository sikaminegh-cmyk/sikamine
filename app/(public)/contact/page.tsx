import { notFound } from "next/navigation";
import { getPageWithSections } from "@/lib/data/pages";
import { SectionRenderer } from "@/components/public/section-renderer";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata(
    "contact",
    "Contact Sikamine Gold Trading Ltd",
    "Get in touch with Sikamine Gold Trading Ltd for gold supply, purchasing, partnerships and corporate enquiries."
  );
}

export default async function ContactPage() {
  const result = await getPageWithSections("contact");
  if ("debug" in result) return <pre style={{ padding: 40 }}>{result.debug}</pre>;

  return <SectionRenderer sections={result.sections} />;
}
