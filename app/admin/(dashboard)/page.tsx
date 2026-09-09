import Link from "next/link";
import { Inbox, Handshake, Package, Building2, Image as ImageIcon, Users2, Mail, ScrollText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { Card, PageHeader, Pill } from "@/components/admin/ui";
import { CountUp } from "@/components/admin/count-up";
import { formatDate } from "@/lib/utils";

async function countRows(table: string, filter?: Record<string, unknown>) {
  const supabase = await createClient();
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter) {
    for (const [key, value] of Object.entries(filter)) query = query.eq(key, value);
  }
  const { count } = await query;
  return count ?? 0;
}

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const [
    contactMessages,
    unreadMessages,
    partnershipEnquiries,
    publishedPages,
    draftPages,
    services,
    offices,
    media,
    admins,
  ] = await Promise.all([
    countRows("contact_messages"),
    countRows("contact_messages", { status: "new" }),
    countRows("partnership_enquiries"),
    countRows("pages", { published: true }),
    countRows("pages", { published: false }),
    countRows("services"),
    countRows("office_locations"),
    countRows("media"),
    countRows("admin_users"),
  ]);

  const { data: recentMessages } = await supabase
    .from("contact_messages")
    .select("id, full_name, subject, enquiry_type, created_at, status")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentActivity } = await supabase
    .from("audit_logs")
    .select("id, admin_name, action, entity, created_at")
    .order("created_at", { ascending: false })
    .limit(6);

  const stats = [
    { label: "Contact Enquiries", value: contactMessages, icon: Inbox, href: "/admin/messages" },
    { label: "Unread Enquiries", value: unreadMessages, icon: Mail, href: "/admin/messages" },
    { label: "Partnership Enquiries", value: partnershipEnquiries, icon: Handshake, href: "/admin/partnership-enquiries" },
    { label: "Published Pages", value: publishedPages, icon: ScrollText, href: "/admin/pages" },
    { label: "Draft Pages", value: draftPages, icon: ScrollText, href: "/admin/pages" },
    { label: "Services", value: services, icon: Package, href: "/admin/services" },
    { label: "Offices", value: offices, icon: Building2, href: "/admin/offices" },
    { label: "Media Files", value: media, icon: ImageIcon, href: "/admin/media" },
    { label: "Admin Users", value: admins, icon: Users2, href: "/admin/admins" },
  ];

  return (
    <div>
      <PageHeader title={`Welcome, ${admin.full_name.split(" ")[0]}`} description="Here's what's happening across the Sikamine website." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5 text-navy">
                    <Icon size={18} />
                  </div>
                  <span className="font-heading text-2xl font-bold text-navy"><CountUp value={stat.value} /></span>
                </div>
                <p className="mt-3 text-sm font-medium text-text-grey">{stat.label}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-heading text-base font-bold text-navy">Recent Enquiries</h2>
          {recentMessages && recentMessages.length > 0 ? (
            <ul className="divide-y divide-black/5">
              {recentMessages.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy">{m.full_name}</p>
                    <p className="truncate text-xs text-text-grey">{m.subject || m.enquiry_type} · {formatDate(m.created_at)}</p>
                  </div>
                  <Pill tone={m.status === "new" ? "warning" : "default"}>{m.status}</Pill>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-grey">No enquiries yet.</p>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 font-heading text-base font-bold text-navy">Recent Admin Activity</h2>
          {recentActivity && recentActivity.length > 0 ? (
            <ul className="divide-y divide-black/5">
              {recentActivity.map((a) => (
                <li key={a.id} className="py-3 text-sm">
                  <span className="font-medium text-navy">{a.admin_name ?? "Unknown"}</span>{" "}
                  <span className="text-text-grey">{a.action}d {a.entity}</span>
                  <p className="text-xs text-text-grey">{formatDate(a.created_at)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-grey">No activity recorded yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
