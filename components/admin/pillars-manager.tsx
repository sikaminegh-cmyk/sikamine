"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, ChevronUp, ChevronDown, Pencil, X } from "lucide-react";
import { AdminButton, Card, EmptyState, Pill, Field, inputClass } from "@/components/admin/ui";
import { ConfirmDeleteButton } from "@/components/admin/confirm-button";
import { IconPreview } from "@/components/admin/icon-preview";
import { createPillar, deletePillar, reorderPillar, updatePillar, type PillarInput } from "@/lib/actions/admin/pillars";
import type { PillarRow } from "@/lib/types/database";

const emptyForm: PillarInput = { name: "", number: "", description: "", icon: "ShieldCheck", status: "active" };

export function PillarsManager({ initialPillars }: { initialPillars: PillarRow[] }) {
  const [pillars, setPillars] = useState(initialPillars);
  const [editing, setEditing] = useState<PillarRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<PillarInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const openCreate = () => { setForm(emptyForm); setEditing(null); setCreating(true); setError(null); };
  const openEdit = (p: PillarRow) => {
    setForm({ name: p.name, number: p.number ?? "", description: p.description ?? "", icon: p.icon ?? "ShieldCheck", status: p.status });
    setEditing(p); setCreating(false); setError(null);
  };
  const close = () => { setEditing(null); setCreating(false); };

  const save = () => {
    startTransition(async () => {
      const result = editing ? await updatePillar(editing.id, form) : await createPillar(form);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        toast.error(result.error ?? "Something went wrong.");
        return;
      }
      if (editing) {
        setPillars((prev) => prev.map((p) => (p.id === editing.id ? result.data : p)));
        toast.success("Pillar updated");
      } else {
        setPillars((prev) => [...prev, result.data]);
        toast.success("Pillar created");
      }
      close();
    });
  };

  const remove = async (id: string) => {
    const result = await deletePillar(id);
    if (result.ok) {
      setPillars((prev) => prev.filter((p) => p.id !== id));
      toast.success("Pillar deleted");
    } else {
      toast.error(result.error ?? "Failed to delete pillar.");
    }
  };

  const move = (pillar: PillarRow, direction: "up" | "down") => {
    startTransition(async () => {
      const result = await reorderPillar(pillar.id, direction, pillars);
      if (result.ok) {
        const sorted = [...pillars].sort((a, b) => a.position - b.position);
        const index = sorted.findIndex((p) => p.id === pillar.id);
        const swapWith = direction === "up" ? index - 1 : index + 1;
        const tmp = sorted[index].position;
        sorted[index].position = sorted[swapWith].position;
        sorted[swapWith].position = tmp;
        setPillars([...sorted]);
      }
    });
  };

  const sorted = [...pillars].sort((a, b) => a.position - b.position);
  const showForm = creating || editing;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card className="p-0">
        {sorted.length === 0 ? (
          <div className="p-6"><EmptyState message="No pillars yet." /></div>
        ) : (
          <ul className="divide-y divide-black/5">
            {sorted.map((pillar, i) => (
              <li key={pillar.id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-0.5">
                  <button disabled={i === 0} onClick={() => move(pillar, "up")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move up"><ChevronUp size={16} /></button>
                  <button disabled={i === sorted.length - 1} onClick={() => move(pillar, "down")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move down"><ChevronDown size={16} /></button>
                </div>
                <span className="font-heading text-lg font-bold text-navy/20">{pillar.number}</span>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy"><IconPreview name={pillar.icon ?? ""} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{pillar.name}</p>
                  <p className="truncate text-xs text-text-grey">{pillar.description}</p>
                </div>
                <Pill tone={pillar.status === "active" ? "success" : "default"}>{pillar.status}</Pill>
                <button onClick={() => openEdit(pillar)} className="text-text-grey hover:text-navy" aria-label="Edit"><Pencil size={16} /></button>
                <ConfirmDeleteButton action={() => remove(pillar.id)} />
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-black/5 p-4">
          <AdminButton onClick={openCreate}><Plus size={16} /> Add Pillar</AdminButton>
        </div>
      </Card>

      {showForm && (
        <Card className="h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-navy">{editing ? "Edit Pillar" : "New Pillar"}</h2>
            <button onClick={close} aria-label="Close"><X size={18} className="text-text-grey" /></button>
          </div>
          <div className="space-y-4">
            <Field label="Number (e.g. 01)">{(id) => <input id={id} className={inputClass} value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} />}</Field>
            <Field label="Name">{(id) => <input id={id} className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />}</Field>
            <Field label="Icon (lucide-react name)">
              {(id) => (
                <div className="flex items-center gap-2">
                  <input id={id} className={inputClass} value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10"><IconPreview name={form.icon} /></div>
                </div>
              )}
            </Field>
            <Field label="Description">{(id) => <textarea id={id} rows={3} className={inputClass} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />}</Field>
            <Field label="Status">
              {(id) => (
                <select id={id} className={inputClass} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "active" | "inactive" }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              )}
            </Field>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <AdminButton onClick={save} disabled={pending || !form.name} className="w-full">{pending ? "Saving…" : "Save Pillar"}</AdminButton>
          </div>
        </Card>
      )}
    </div>
  );
}
