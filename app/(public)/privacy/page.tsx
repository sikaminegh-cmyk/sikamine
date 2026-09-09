import { LegalDocument } from "@/components/public/legal-document";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata(
    "privacy",
    "Privacy Policy | Sikamine Gold Trading Ltd",
    "How Sikamine Gold Trading Ltd collects, uses and protects your information."
  );
}

export default function PrivacyPage() {
  return <LegalDocument type="privacy" />;
}
