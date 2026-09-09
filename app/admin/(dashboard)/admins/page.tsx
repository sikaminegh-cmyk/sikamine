import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { AdminsManager } from "@/components/admin/admins-manager";

export default async function AdminAdminsPage() {
  const currentAdmin = await requireAdmin(["super_admin"]);
  const supabase = await createClient();
  const { data: admins } = await supabase.from("admin_users").select("*").order("created_at", { ascending: true });

  return (
    <div>
      <PageHeader title="Admin Users" description="Invite administrators, manage roles and deactivate access. No public registration exists." />
      <AdminsManager initialAdmins={admins ?? []} currentAdminId={currentAdmin.id} />
    </div>
  );
}
