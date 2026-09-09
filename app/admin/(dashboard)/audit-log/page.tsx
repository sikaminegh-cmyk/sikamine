import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { Card, PageHeader, Pill } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

export default async function AdminAuditLogPage() {
  await requireAdmin(["super_admin", "administrator"]);
  const supabase = await createClient();
  const { data: logs } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200);

  const actionTone: Record<string, "success" | "warning" | "danger" | "default"> = {
    create: "success", update: "default", delete: "danger", reorder: "default", deactivate: "warning", reactivate: "success",
  };

  return (
    <div>
      <PageHeader title="Audit Log" description="A record of admin logins and content changes across the site." />
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs font-semibold uppercase tracking-wide text-text-grey">
              <th className="px-6 py-3">Admin</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {(logs ?? []).map((log) => (
              <tr key={log.id} className="border-b border-black/5 last:border-0">
                <td className="px-6 py-3 font-medium text-navy">{log.admin_name ?? "Unknown"}</td>
                <td className="px-4 py-3"><Pill tone={actionTone[log.action] ?? "default"}>{log.action}</Pill></td>
                <td className="px-4 py-3 text-text-grey">{log.entity}</td>
                <td className="px-4 py-3 text-text-grey">{formatDate(log.created_at)}</td>
                <td className="px-4 py-3 text-text-grey">{log.ip_address ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(logs ?? []).length === 0 && <p className="p-6 text-sm text-text-grey">No activity recorded yet.</p>}
      </Card>
    </div>
  );
}
