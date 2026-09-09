"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, ChevronUp, ChevronDown, Pencil, X } from "lucide-react";
import { AdminButton, Card, EmptyState, Pill, Field, inputClass } from "@/components/admin/ui";
import { ConfirmDeleteButton } from "@/components/admin/confirm-button";
import { createNavItem, deleteNavItem, reorderNavItem, updateNavItem, type NavItemInput } from "@/lib/actions/admin/navigation";
import type { NavigationItemRow, NavLocation } from "@/lib/types/database";

const emptyForm: NavItemInput = { label: "", url: "", location: "header", is_external: false, visible: true };

function NavList({ items, setItems }: { items: NavigationItemRow[]; setItems: (fn: (prev: NavigationItemRow[]) => NavigationItemRow[]) => void }) {
  const [editing, setEditing] = useState<NavigationItemRow | null>(null);
  const [creating, setCreating] = useState<NavLocation | null>(null);
  const [form, setForm] = useState<NavItemInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const openCreate = (location: NavLocation) => { setForm({ ...emptyForm, location }); setEditing(null); setCreating(location); setError(null); };
  const openEdit = (item: NavigationItemRow) => { setForm(item); setEditing(item); setCreating(null); setError(null); };
  const close = () => { setEditing(null); setCreating(null); };

  const save = () => {
    startTransition(async () => {
      const result = editing ? await updateNavItem(editing.id, form) : await createNavItem(form);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        toast.error(result.error ?? "Something went wrong.");
        return;
      }
      if (editing) {
        setItems((prev) => prev.map((i) => (i.id === editing.id ? result.data : i)));
        toast.success("Navigation item updated");
      } else {
        setItems((prev) => [...prev, result.data]);
        toast.success("Navigation item created");
      }
      close();
    });
  };

  const remove = async (id: string) => {
    const result = await deleteNavItem(id);
    if (result.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Navigation item deleted");
    } else {
      toast.error(result.error ?? "Failed to delete navigation item.");
    }
  };

  const move = (item: NavigationItemRow, direction: "up" | "down", siblings: NavigationItemRow[]) => {
    startTransition(async () => {
      const result = await reorderNavItem(item.id, direction, siblings);
      if (result.ok) {
        const sorted = [...siblings].sort((a, b) => a.position - b.position);
        const index = sorted.findIndex((i) => i.id === item.id);
        const swapWith = direction === "up" ? index - 1 : index + 1;
        const tmp = sorted[index].position;
        sorted[index].position = sorted[swapWith].position;
        sorted[swapWith].position = tmp;
        setItems((prev) => prev.map((i) => sorted.find((s) => s.id === i.id) ?? i));
      }
    });
  };

  const renderGroup = (location: NavLocation, label: string) => {
    const groupItems = items.filter((i) => i.location === location).sort((a, b) => a.position - b.position);
    return (
      <Card className="p-0" key={location}>
        <h2 className="border-b border-black/5 px-6 py-4 font-heading text-sm font-bold text-navy">{label}</h2>
        {groupItems.length === 0 ? (
          <div className="p-6"><EmptyState message="No items yet." /></div>
        ) : (
          <ul className="divide-y divide-black/5">
            {groupItems.map((item, i) => (
              <li key={item.id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-0.5">
                  <button disabled={i === 0} onClick={() => move(item, "up", groupItems)} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move up"><ChevronUp size={16} /></button>
                  <button disabled={i === groupItems.length - 1} onClick={() => move(item, "down", groupItems)} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move down"><ChevronDown size={16} /></button>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{item.label}</p>
                  <p className="truncate text-xs text-text-grey">{item.url}</p>
                </div>
                {item.is_external && <Pill>External</Pill>}
                {!item.visible && <Pill tone="default">Hidden</Pill>}
                <button onClick={() => openEdit(item)} className="text-text-grey hover:text-navy" aria-label="Edit"><Pencil size={16} /></button>
                <ConfirmDeleteButton action={() => remove(item.id)} />
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-black/5 p-4">
          <AdminButton onClick={() => openCreate(location)}><Plus size={16} /> Add {label} Item</AdminButton>
        </div>
      </Card>
    );
  };

  const showForm = creating || editing;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {renderGroup("header", "Header Navigation")}
        {renderGroup("footer", "Footer Navigation")}
      </div>

      {showForm && (
        <Card className="h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-navy">{editing ? "Edit Item" : "New Item"}</h2>
            <button onClick={close} aria-label="Close"><X size={18} className="text-text-grey" /></button>
          </div>
          <div className="space-y-4">
            <Field label="Label">{(id) => <input id={id} className={inputClass} value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />}</Field>
            <Field label="URL">{(id) => <input id={id} className={inputClass} value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} />}</Field>
            <Field label="Location">
              {(id) => (
                <select id={id} className={inputClass} value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value as NavLocation }))}>
                  <option value="header">Header</option>
                  <option value="footer">Footer</option>
                </select>
              )}
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_external} onChange={(e) => setForm((f) => ({ ...f, is_external: e.target.checked }))} />
              Opens in new tab (external link)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))} />
              Visible
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <AdminButton onClick={save} disabled={pending || !form.label || !form.url} className="w-full">{pending ? "Saving…" : "Save Item"}</AdminButton>
          </div>
        </Card>
      )}
    </div>
  );
}

export function NavigationManager({ initialItems }: { initialItems: NavigationItemRow[] }) {
  const [items, setItems] = useState(initialItems);
  return <NavList items={items} setItems={setItems} />;
}
