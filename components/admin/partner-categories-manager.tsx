"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, ChevronUp, ChevronDown, Pencil, X } from "lucide-react";
import { AdminButton, Card, EmptyState, Pill, Field, inputClass } from "@/components/admin/ui";
import { ConfirmDeleteButton } from "@/components/admin/confirm-button";
import { IconPreview } from "@/components/admin/icon-preview";
import {
  createPartnerCategory,
  deletePartnerCategory,
  reorderPartnerCategory,
  updatePartnerCategory,
  type PartnerCategoryInput,
} from "@/lib/actions/admin/partner-categories";
import type { PartnerCategoryRow } from "@/lib/types/database";

const emptyForm: PartnerCategoryInput = { name: "", description: "", icon: "Handshake", status: "active" };

export function PartnerCategoriesManager({ initialCategories }: { initialCategories: PartnerCategoryRow[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [editing, setEditing] = useState<PartnerCategoryRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<PartnerCategoryInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const openCreate = () => { setForm(emptyForm); setEditing(null); setCreating(true); setError(null); };
  const openEdit = (c: PartnerCategoryRow) => {
    setForm({ name: c.name, description: c.description ?? "", icon: c.icon ?? "Handshake", status: c.status });
    setEditing(c); setCreating(false); setError(null);
  };
  const close = () => { setEditing(null); setCreating(false); };

  const save = () => {
    startTransition(async () => {
      const result = editing ? await updatePartnerCategory(editing.id, form) : await createPartnerCategory(form);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        toast.error(result.error ?? "Something went wrong.");
        return;
      }
      if (editing) {
        setCategories((prev) => prev.map((c) => (c.id === editing.id ? result.data : c)));
        toast.success("Category updated");
      } else {
        setCategories((prev) => [...prev, result.data]);
        toast.success("Category created");
      }
      close();
    });
  };

  const remove = async (id: string) => {
    const result = await deletePartnerCategory(id);
    if (result.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } else {
      toast.error(result.error ?? "Failed to delete category.");
    }
  };

  const move = (category: PartnerCategoryRow, direction: "up" | "down") => {
    startTransition(async () => {
      const result = await reorderPartnerCategory(category.id, direction, categories);
      if (result.ok) {
        const sorted = [...categories].sort((a, b) => a.position - b.position);
        const index = sorted.findIndex((c) => c.id === category.id);
        const swapWith = direction === "up" ? index - 1 : index + 1;
        const tmp = sorted[index].position;
        sorted[index].position = sorted[swapWith].position;
        sorted[swapWith].position = tmp;
        setCategories([...sorted]);
      }
    });
  };

  const sorted = [...categories].sort((a, b) => a.position - b.position);
  const showForm = creating || editing;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card className="p-0">
        {sorted.length === 0 ? (
          <div className="p-6"><EmptyState message="No partner categories yet." /></div>
        ) : (
          <ul className="divide-y divide-black/5">
            {sorted.map((category, i) => (
              <li key={category.id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-0.5">
                  <button disabled={i === 0} onClick={() => move(category, "up")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move up"><ChevronUp size={16} /></button>
                  <button disabled={i === sorted.length - 1} onClick={() => move(category, "down")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move down"><ChevronDown size={16} /></button>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold"><IconPreview name={category.icon ?? ""} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{category.name}</p>
                  <p className="truncate text-xs text-text-grey">{category.description}</p>
                </div>
                <Pill tone={category.status === "active" ? "success" : "default"}>{category.status}</Pill>
                <button onClick={() => openEdit(category)} className="text-text-grey hover:text-navy" aria-label="Edit"><Pencil size={16} /></button>
                <ConfirmDeleteButton action={() => remove(category.id)} />
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-black/5 p-4">
          <AdminButton onClick={openCreate}><Plus size={16} /> Add Category</AdminButton>
        </div>
      </Card>

      {showForm && (
        <Card className="h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-navy">{editing ? "Edit Category" : "New Category"}</h2>
            <button onClick={close} aria-label="Close"><X size={18} className="text-text-grey" /></button>
          </div>
          <div className="space-y-4">
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
            <AdminButton onClick={save} disabled={pending || !form.name} className="w-full">{pending ? "Saving…" : "Save Category"}</AdminButton>
          </div>
        </Card>
      )}
    </div>
  );
}
