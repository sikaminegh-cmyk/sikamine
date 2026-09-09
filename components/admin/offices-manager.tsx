"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, ChevronUp, ChevronDown, Pencil, X, Building2, EyeOff } from "lucide-react";
import { AdminButton, Card, EmptyState, Pill, Field, inputClass } from "@/components/admin/ui";
import { ConfirmDeleteButton } from "@/components/admin/confirm-button";
import { createOffice, deleteOffice, reorderOffice, updateOffice, type OfficeInput } from "@/lib/actions/admin/offices";
import type { OfficeLocationRow } from "@/lib/types/database";

const emptyForm: OfficeInput = {
  title: "",
  is_headquarters: false,
  country: "",
  region: "",
  city: "",
  street_address: "",
  postal_address: "",
  phone: "",
  whatsapp: "",
  email: "",
  maps_url: "",
  business_hours: { mon_fri: "", sat: "", sun: "" },
  visible: true,
};

export function OfficesManager({ initialOffices }: { initialOffices: OfficeLocationRow[] }) {
  const [offices, setOffices] = useState(initialOffices);
  const [editing, setEditing] = useState<OfficeLocationRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<OfficeInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const openCreate = () => { setForm(emptyForm); setEditing(null); setCreating(true); setError(null); };
  const openEdit = (o: OfficeLocationRow) => {
    setForm({
      title: o.title,
      is_headquarters: o.is_headquarters,
      country: o.country,
      region: o.region ?? "",
      city: o.city ?? "",
      street_address: o.street_address ?? "",
      postal_address: o.postal_address ?? "",
      phone: o.phone ?? "",
      whatsapp: o.whatsapp ?? "",
      email: o.email ?? "",
      maps_url: o.maps_url ?? "",
      business_hours: { mon_fri: "", sat: "", sun: "", ...o.business_hours },
      visible: o.visible,
    });
    setEditing(o); setCreating(false); setError(null);
  };
  const close = () => { setEditing(null); setCreating(false); };

  const save = () => {
    startTransition(async () => {
      const result = editing ? await updateOffice(editing.id, form) : await createOffice(form);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        toast.error(result.error ?? "Something went wrong.");
        return;
      }
      if (editing) {
        setOffices((prev) => prev.map((o) => (o.id === editing.id ? result.data : o)));
        toast.success("Office updated");
      } else {
        setOffices((prev) => [...prev, result.data]);
        toast.success("Office created");
      }
      close();
    });
  };

  const remove = async (id: string) => {
    const result = await deleteOffice(id);
    if (result.ok) {
      setOffices((prev) => prev.filter((o) => o.id !== id));
      toast.success("Office deleted");
    } else {
      toast.error(result.error ?? "Failed to delete office.");
    }
  };

  const move = (office: OfficeLocationRow, direction: "up" | "down") => {
    startTransition(async () => {
      const result = await reorderOffice(office.id, direction, offices);
      if (result.ok) {
        const sorted = [...offices].sort((a, b) => a.position - b.position);
        const index = sorted.findIndex((o) => o.id === office.id);
        const swapWith = direction === "up" ? index - 1 : index + 1;
        const tmp = sorted[index].position;
        sorted[index].position = sorted[swapWith].position;
        sorted[swapWith].position = tmp;
        setOffices([...sorted]);
      }
    });
  };

  const sorted = [...offices].sort((a, b) => a.position - b.position);
  const showForm = creating || editing;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <Card className="p-0">
        {sorted.length === 0 ? (
          <div className="p-6"><EmptyState message="No offices yet." /></div>
        ) : (
          <ul className="divide-y divide-black/5">
            {sorted.map((office, i) => (
              <li key={office.id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-0.5">
                  <button disabled={i === 0} onClick={() => move(office, "up")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move up"><ChevronUp size={16} /></button>
                  <button disabled={i === sorted.length - 1} onClick={() => move(office, "down")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move down"><ChevronDown size={16} /></button>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy"><Building2 size={18} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{office.title}</p>
                  <p className="truncate text-xs text-text-grey">{[office.city, office.country].filter(Boolean).join(", ")}</p>
                </div>
                {office.is_headquarters && <Pill tone="warning">HQ</Pill>}
                {!office.visible && <EyeOff size={15} className="text-text-grey" aria-label="Hidden" />}
                <button onClick={() => openEdit(office)} className="text-text-grey hover:text-navy" aria-label="Edit"><Pencil size={16} /></button>
                <ConfirmDeleteButton action={() => remove(office.id)} />
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-black/5 p-4">
          <AdminButton onClick={openCreate}><Plus size={16} /> Add Office</AdminButton>
        </div>
      </Card>

      {showForm && (
        <Card className="h-fit max-h-[85vh] overflow-y-auto">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-navy">{editing ? "Edit Office" : "New Office"}</h2>
            <button onClick={close} aria-label="Close"><X size={18} className="text-text-grey" /></button>
          </div>
          <div className="space-y-4">
            <Field label="Office Title">{(id) => <input id={id} className={inputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />}</Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Country">{(id) => <input id={id} className={inputClass} value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} />}</Field>
              <Field label="Region">{(id) => <input id={id} className={inputClass} value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} />}</Field>
            </div>
            <Field label="City">{(id) => <input id={id} className={inputClass} value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />}</Field>
            <Field label="Street Address">{(id) => <input id={id} className={inputClass} value={form.street_address} onChange={(e) => setForm((f) => ({ ...f, street_address: e.target.value }))} />}</Field>
            <Field label="Postal Address">{(id) => <input id={id} className={inputClass} value={form.postal_address} onChange={(e) => setForm((f) => ({ ...f, postal_address: e.target.value }))} />}</Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone">{(id) => <input id={id} className={inputClass} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />}</Field>
              <Field label="WhatsApp">{(id) => <input id={id} className={inputClass} value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} />}</Field>
            </div>
            <Field label="Email">{(id) => <input id={id} type="email" className={inputClass} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />}</Field>
            <Field label="Google Maps URL">{(id) => <input id={id} className={inputClass} value={form.maps_url} onChange={(e) => setForm((f) => ({ ...f, maps_url: e.target.value }))} />}</Field>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-grey">Business Hours</p>
              <div className="grid grid-cols-3 gap-2">
                <input className={inputClass} placeholder="Mon–Fri" value={form.business_hours.mon_fri ?? ""} onChange={(e) => setForm((f) => ({ ...f, business_hours: { ...f.business_hours, mon_fri: e.target.value } }))} />
                <input className={inputClass} placeholder="Saturday" value={form.business_hours.sat ?? ""} onChange={(e) => setForm((f) => ({ ...f, business_hours: { ...f.business_hours, sat: e.target.value } }))} />
                <input className={inputClass} placeholder="Sunday" value={form.business_hours.sun ?? ""} onChange={(e) => setForm((f) => ({ ...f, business_hours: { ...f.business_hours, sun: e.target.value } }))} />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_headquarters} onChange={(e) => setForm((f) => ({ ...f, is_headquarters: e.target.checked }))} />
              Headquarters
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))} />
              Visible on website
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}
            <AdminButton onClick={save} disabled={pending || !form.title || !form.country} className="w-full">{pending ? "Saving…" : "Save Office"}</AdminButton>
          </div>
        </Card>
      )}
    </div>
  );
}
