import { LegalDocument } from "@/components/public/legal-document";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata(
    "cookies",
    "Cookie Policy | Sikamine Gold Trading Ltd",
    "How Sikamine Gold Trading Ltd uses cookies on this website."
  );
}

export default function CookiesPage() {
  return <LegalDocument type="cookies" />;
}
