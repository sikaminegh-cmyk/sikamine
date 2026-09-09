import { LegalDocument } from "@/components/public/legal-document";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata(
    "terms",
    "Terms & Conditions | Sikamine Gold Trading Ltd",
    "Terms and conditions governing services and transactions with Sikamine Gold Trading Ltd."
  );
}

export default function TermsPage() {
  return <LegalDocument type="terms" />;
}
