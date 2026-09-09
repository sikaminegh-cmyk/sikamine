import { requireAdmin } from "@/lib/auth/admin";
import { Card, PageHeader } from "@/components/admin/ui";
import packageJson from "@/package.json";

function maskUrl(url: string | undefined) {
  if (!url) return "Not configured";
  try {
    return new URL(url).hostname;
  } catch {
    return "Invalid URL";
  }
}

export default async function AdminSystemInfoPage() {
  await requireAdmin(["super_admin"]);

  const rows = [
    { label: "Application Version", value: packageJson.version },
    { label: "Deployment Environment", value: process.env.NODE_ENV === "production" ? "Production" : "Development" },
    { label: "Database Provider", value: "Supabase (PostgreSQL)" },
    { label: "Database Host", value: maskUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) },
    { label: "Storage Provider", value: "Supabase Storage" },
    { label: "Hosting Provider", value: process.env.VERCEL ? "Vercel" : "Self-hosted / Node.js" },
    { label: "Site URL", value: process.env.NEXT_PUBLIC_SITE_URL ?? "Not configured" },
    { label: "SMTP Configured", value: process.env.SMTP_HOST ? "Yes" : "No — set SMTP_* env vars" },
    { label: "Analytics", value: "Configured via Site Settings (client-owned Google Analytics)" },
  ];

  const docs = [
    { label: "Deployment Guide", href: "/docs/DEPLOYMENT.md" },
    { label: "Database Setup & Backup", href: "/docs/DATABASE.md" },
    { label: "Client Handover Checklist", href: "/docs/HANDOVER.md" },
    { label: "Environment Variables Reference", href: "/.env.example" },
  ];

  return (
    <div>
      <PageHeader title="System Information" description="Read-only technical overview. No credentials are displayed here — see the handover documentation for setup instructions." />

      <Card className="mb-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-grey">{row.label}</dt>
              <dd className="mt-1 text-sm font-medium text-navy">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card>
        <h2 className="mb-3 font-heading text-base font-bold text-navy">Documentation</h2>
        <p className="mb-4 text-sm text-text-grey">
          These files ship in the project repository and cover deployment, database backup/restore, environment
          variables, adding admins, and the full ownership handover checklist.
        </p>
        <ul className="space-y-2 text-sm">
          {docs.map((doc) => (
            <li key={doc.href} className="text-navy">{doc.label} — <code className="text-xs text-text-grey">{doc.href.replace("/", "")}</code></li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
