"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, ChevronUp, ChevronDown, Pencil, X, Landmark } from "lucide-react";
import { AdminButton, Card, EmptyState, Pill, Field, inputClass } from "@/components/admin/ui";
import { ConfirmDeleteButton } from "@/components/admin/confirm-button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  createPartnerLogo,
  deletePartnerLogo,
  reorderPartnerLogo,
  updatePartnerLogo,
  type PartnerLogoInput,
} from "@/lib/actions/admin/partner-logos";
import type { PartnerLogoRow } from "@/lib/types/database";

const categories = [
  { value: "banking_partner", label: "Banking Partner" },
  { value: "regulatory_body", label: "Regulatory Body" },
  { value: "partner", label: "Other Partner" },
];

const emptyForm: PartnerLogoInput = { name: "", category: "banking_partner", logo_url: "", link_url: "", visible: true };

export function PartnerLogosManager({ initialLogos }: { initialLogos: PartnerLogoRow[] }) {
  const [logos, setLogos] = useState(initialLogos);
  const [editing, setEditing] = useState<PartnerLogoRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<PartnerLogoInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const openCreate = () => { setForm(emptyForm); setEditing(null); setCreating(true); setError(null); };
  const openEdit = (logo: PartnerLogoRow) => {
    setForm({ name: logo.name, category: logo.category, logo_url: logo.logo_url, link_url: logo.link_url ?? "", visible: logo.visible });
    setEditing(logo); setCreating(false); setError(null);
  };
  const close = () => { setEditing(null); setCreating(false); };

  const save = () => {
    startTransition(async () => {
      const result = editing ? await updatePartnerLogo(editing.id, form) : await createPartnerLogo(form);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        toast.error(result.error ?? "Something went wrong.");
        return;
      }
      if (editing) {
        setLogos((prev) => prev.map((l) => (l.id === editing.id ? result.data : l)));
        toast.success("Logo updated");
      } else {
        setLogos((prev) => [...prev, result.data]);
        toast.success("Logo created");
      }
      close();
    });
  };

  const remove = async (id: string) => {
    const result = await deletePartnerLogo(id);
    if (result.ok) {
      setLogos((prev) => prev.filter((l) => l.id !== id));
      toast.success("Logo deleted");
    } else {
      toast.error(result.error ?? "Failed to delete logo.");
    }
  };

  const move = (logo: PartnerLogoRow, direction: "up" | "down") => {
    startTransition(async () => {
      const result = await reorderPartnerLogo(logo.id, direction, logos);
      if (result.ok) {
        const sorted = [...logos].sort((a, b) => a.position - b.position);
        const index = sorted.findIndex((l) => l.id === logo.id);
        const swapWith = direction === "up" ? index - 1 : index + 1;
        const tmp = sorted[index].position;
        sorted[index].position = sorted[swapWith].position;
        sorted[swapWith].position = tmp;
        setLogos([...sorted]);
      }
    });
  };

  const sorted = [...logos].sort((a, b) => a.position - b.position);
  const showForm = creating || editing;
  const categoryLabel = (value: string) => categories.find((c) => c.value === value)?.label ?? value;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card className="p-0">
        {sorted.length === 0 ? (
          <div className="p-6"><EmptyState message="No partner or regulator logos yet." /></div>
        ) : (
          <ul className="divide-y divide-black/5">
            {sorted.map((logo, i) => (
              <li key={logo.id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-0.5">
                  <button disabled={i === 0} onClick={() => move(logo, "up")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move up"><ChevronUp size={16} /></button>
                  <button disabled={i === sorted.length - 1} onClick={() => move(logo, "down")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move down"><ChevronDown size={16} /></button>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white p-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {logo.logo_url ? <img src={logo.logo_url} alt={logo.name} className="max-h-full max-w-full object-contain" /> : <Landmark size={18} className="text-text-grey" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{logo.name}</p>
                  <p className="truncate text-xs text-text-grey">{categoryLabel(logo.category)}</p>
                </div>
                {!logo.visible && <Pill tone="default">Hidden</Pill>}
                <button onClick={() => openEdit(logo)} className="text-text-grey hover:text-navy" aria-label="Edit"><Pencil size={16} /></button>
                <ConfirmDeleteButton action={() => remove(logo.id)} />
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-black/5 p-4">
          <AdminButton onClick={openCreate}><Plus size={16} /> Add Logo</AdminButton>
        </div>
      </Card>

      {showForm && (
        <Card className="h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-navy">{editing ? "Edit Logo" : "New Logo"}</h2>
            <button onClick={close} aria-label="Close"><X size={18} className="text-text-grey" /></button>
          </div>
          <div className="space-y-4">
            <Field label="Name">{(id) => <input id={id} className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />}</Field>
            <Field label="Category">
              {(id) => (
                <select id={id} className={inputClass} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                  {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              )}
            </Field>
            <ImageUploadField label="Logo" value={form.logo_url || null} onChange={(url) => setForm((f) => ({ ...f, logo_url: url ?? "" }))} />
            <Field label="Link URL (optional)">{(id) => <input id={id} className={inputClass} placeholder="https://…" value={form.link_url} onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))} />}</Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))} />
              Visible on website
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <AdminButton onClick={save} disabled={pending || !form.name || !form.logo_url} className="w-full">{pending ? "Saving…" : "Save Logo"}</AdminButton>
          </div>
        </Card>
      )}
    </div>
  );
}
