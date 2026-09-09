"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, ChevronUp, ChevronDown, Pencil, X, User } from "lucide-react";
import { AdminButton, Card, EmptyState, Pill, Field, inputClass } from "@/components/admin/ui";
import { ConfirmDeleteButton } from "@/components/admin/confirm-button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  createTeamMember,
  deleteTeamMember,
  reorderTeamMember,
  updateTeamMember,
  type TeamMemberInput,
} from "@/lib/actions/admin/team";
import type { TeamMemberRow } from "@/lib/types/database";

const emptyForm: TeamMemberInput = { name: "", title: "", bio: "", photo_url: null, email: "", linkedin_url: "", visible: true };

export function TeamManager({ initialMembers }: { initialMembers: TeamMemberRow[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [editing, setEditing] = useState<TeamMemberRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<TeamMemberInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const openCreate = () => { setForm(emptyForm); setEditing(null); setCreating(true); setError(null); };
  const openEdit = (m: TeamMemberRow) => {
    setForm({
      name: m.name, title: m.title ?? "", bio: m.bio ?? "", photo_url: m.photo_url,
      email: m.email ?? "", linkedin_url: m.linkedin_url ?? "", visible: m.visible,
    });
    setEditing(m); setCreating(false); setError(null);
  };
  const close = () => { setEditing(null); setCreating(false); };

  const save = () => {
    startTransition(async () => {
      const result = editing ? await updateTeamMember(editing.id, form) : await createTeamMember(form);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        toast.error(result.error ?? "Something went wrong.");
        return;
      }
      if (editing) {
        setMembers((prev) => prev.map((m) => (m.id === editing.id ? result.data : m)));
        toast.success("Team member updated");
      } else {
        setMembers((prev) => [...prev, result.data]);
        toast.success("Team member created");
      }
      close();
    });
  };

  const remove = async (id: string) => {
    const result = await deleteTeamMember(id);
    if (result.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success("Team member deleted");
    } else {
      toast.error(result.error ?? "Failed to delete team member.");
    }
  };

  const move = (member: TeamMemberRow, direction: "up" | "down") => {
    startTransition(async () => {
      const result = await reorderTeamMember(member.id, direction, members);
      if (result.ok) {
        const sorted = [...members].sort((a, b) => a.position - b.position);
        const index = sorted.findIndex((m) => m.id === member.id);
        const swapWith = direction === "up" ? index - 1 : index + 1;
        const tmp = sorted[index].position;
        sorted[index].position = sorted[swapWith].position;
        sorted[swapWith].position = tmp;
        setMembers([...sorted]);
      }
    });
  };

  const sorted = [...members].sort((a, b) => a.position - b.position);
  const showForm = creating || editing;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card className="p-0">
        {sorted.length === 0 ? (
          <div className="p-6"><EmptyState message="No team members yet." /></div>
        ) : (
          <ul className="divide-y divide-black/5">
            {sorted.map((member, i) => (
              <li key={member.id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-0.5">
                  <button disabled={i === 0} onClick={() => move(member, "up")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move up"><ChevronUp size={16} /></button>
                  <button disabled={i === sorted.length - 1} onClick={() => move(member, "down")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move down"><ChevronDown size={16} /></button>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy/5">
                  {member.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.photo_url} alt={member.name} className="h-full w-full object-cover" />
                  ) : (
                    <User size={18} className="text-navy/40" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{member.name}</p>
                  <p className="truncate text-xs text-text-grey">{member.title}</p>
                </div>
                {!member.visible && <Pill tone="default">Hidden</Pill>}
                <button onClick={() => openEdit(member)} className="text-text-grey hover:text-navy" aria-label="Edit"><Pencil size={16} /></button>
                <ConfirmDeleteButton action={() => remove(member.id)} />
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-black/5 p-4">
          <AdminButton onClick={openCreate}><Plus size={16} /> Add Team Member</AdminButton>
        </div>
      </Card>

      {showForm && (
        <Card className="h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-navy">{editing ? "Edit Team Member" : "New Team Member"}</h2>
            <button onClick={close} aria-label="Close"><X size={18} className="text-text-grey" /></button>
          </div>
          <div className="space-y-4">
            <ImageUploadField label="Photo" value={form.photo_url} onChange={(url) => setForm((f) => ({ ...f, photo_url: url }))} />
            <Field label="Name">{(id) => <input id={id} className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />}</Field>
            <Field label="Title / Role">{(id) => <input id={id} className={inputClass} placeholder="e.g. Chief Executive Officer" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />}</Field>
            <Field label="Bio">{(id) => <textarea id={id} rows={3} className={inputClass} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />}</Field>
            <Field label="Email (optional)">{(id) => <input id={id} type="email" className={inputClass} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />}</Field>
            <Field label="LinkedIn URL (optional)">{(id) => <input id={id} className={inputClass} value={form.linkedin_url} onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value }))} />}</Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))} />
              Visible on website
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <AdminButton onClick={save} disabled={pending || !form.name} className="w-full">{pending ? "Saving…" : "Save Team Member"}</AdminButton>
          </div>
        </Card>
      )}
    </div>
  );
}
