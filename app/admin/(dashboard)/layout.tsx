import { requireAdmin } from "@/lib/auth/admin";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import { Toaster } from "@/components/admin/toaster";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="flex h-screen overflow-hidden bg-bg-alt">
      <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto bg-navy px-4 py-6 lg:flex">
        <div className="mb-8 px-2">
          <p className="font-heading text-sm font-bold text-white">SIKAMINE</p>
          <p className="text-[10px] font-medium tracking-[0.2em] text-white/50">ADMIN DASHBOARD</p>
        </div>
        <Sidebar role={admin.role} className="flex-1" />
      </aside>

      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <Topbar name={admin.full_name} role={admin.role} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>

      <Toaster />
    </div>
  );
}
