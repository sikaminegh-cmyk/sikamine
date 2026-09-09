"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, X, UserX, UserCheck } from "lucide-react";
import { AdminButton, Card, EmptyState, Field, Pill, inputClass } from "@/components/admin/ui";
import { inviteAdmin, setAdminStatus, updateAdminRole } from "@/lib/actions/admin/admins";
import { formatDate } from "@/lib/utils";
import type { AdminRole, AdminUserRow } from "@/lib/types/database";

const roles: AdminRole[] = ["super_admin", "administrator", "editor"];

export function AdminsManager({ initialAdmins, currentAdminId }: { initialAdmins: AdminUserRow[]; currentAdminId: string }) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [inviting, setInviting] = useState(false);
  const [form, setForm] = useState({ email: "", full_name: "", role: "editor" as AdminRole });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const invite = () => {
    startTransition(async () => {
      const result = await inviteAdmin(form.email, form.full_name, form.role);
      if (!result.ok) {
        setError(result.error ?? "Failed to invite admin.");
        toast.error(result.error ?? "Failed to invite admin.");
        return;
      }
      setAdmins((prev) => [...prev, result.data]);
      toast.success("Invitation sent");
      setInviting(false);
      setForm({ email: "", full_name: "", role: "editor" });
      setError(null);
    });
  };

  const changeRole = async (id: string, role: AdminRole) => {
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, role } : a)));
    const result = await updateAdminRole(id, role);
    if (result.ok) toast.success("Role updated");
    else toast.error(result.error ?? "Failed to update role.");
  };

  const toggleStatus = async (admin: AdminUserRow) => {
    const nextStatus = admin.status === "active" ? "inactive" : "active";
    const result = await setAdminStatus(admin.id, nextStatus);
    if (result.ok) {
      setAdmins((prev) => prev.map((a) => (a.id === admin.id ? { ...a, status: nextStatus } : a)));
      toast.success(nextStatus === "active" ? "Admin reactivated" : "Admin deactivated");
    } else {
      toast.error(result.error ?? "Failed to update admin status.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card className="p-0">
        {admins.length === 0 ? (
          <div className="p-6"><EmptyState message="No admins found." /></div>
        ) : (
          <ul className="divide-y divide-black/5">
            {admins.map((admin) => (
              <li key={admin.id} className="flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">
                    {admin.full_name} {admin.id === currentAdminId && <span className="text-xs font-normal text-text-grey">(you)</span>}
                  </p>
                  <p className="truncate text-xs text-text-grey">{admin.email} · Last login {admin.last_login_at ? formatDate(admin.last_login_at) : "never"}</p>
                </div>
                <select
                  className={`${inputClass} w-auto py-1.5 text-xs`}
                  value={admin.role}
                  onChange={(e) => changeRole(admin.id, e.target.value as AdminRole)}
                  disabled={admin.id === currentAdminId}
                >
                  {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <Pill tone={admin.status === "active" ? "success" : "danger"}>{admin.status}</Pill>
                <button
                  onClick={() => toggleStatus(admin)}
                  disabled={admin.id === currentAdminId}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-grey hover:text-navy disabled:opacity-30"
                >
                  {admin.status === "active" ? <><UserX size={14} /> Deactivate</> : <><UserCheck size={14} /> Reactivate</>}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-black/5 p-4">
          <AdminButton onClick={() => setInviting(true)}><Plus size={16} /> Invite Admin</AdminButton>
        </div>
      </Card>

      {inviting && (
        <Card className="h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-navy">Invite Admin</h2>
            <button onClick={() => setInviting(false)} aria-label="Close"><X size={18} className="text-text-grey" /></button>
          </div>
          <div className="space-y-4">
            <Field label="Full Name">{(id) => <input id={id} className={inputClass} value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />}</Field>
            <Field label="Email">{(id) => <input id={id} type="email" className={inputClass} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />}</Field>
            <Field label="Role">
              {(id) => (
                <select id={id} className={inputClass} value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as AdminRole }))}>
                  {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              )}
            </Field>
            <p className="text-xs text-text-grey">An invitation email will be sent with a link to set their password. No public registration exists — this is the only way to create new admins.</p>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <AdminButton onClick={invite} disabled={pending || !form.email || !form.full_name} className="w-full">{pending ? "Sending…" : "Send Invite"}</AdminButton>
          </div>
        </Card>
      )}
    </div>
  );
}
