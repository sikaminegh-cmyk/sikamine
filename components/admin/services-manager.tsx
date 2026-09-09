"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, ChevronUp, ChevronDown, Pencil, X } from "lucide-react";
import { AdminButton, Card, EmptyState, Pill, Field, inputClass } from "@/components/admin/ui";
import { ConfirmDeleteButton } from "@/components/admin/confirm-button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { IconPreview } from "@/components/admin/icon-preview";
import { createService, deleteService, reorderService, updateService, type ServiceInput } from "@/lib/actions/admin/services";
import type { ServiceRow } from "@/lib/types/database";

const emptyForm: ServiceInput = {
  name: "",
  slug: "",
  short_description: "",
  full_description: "",
  icon: "Coins",
  image_url: null,
  seo_title: "",
  seo_description: "",
  published: true,
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ServicesManager({ initialServices }: { initialServices: ServiceRow[] }) {
  const [services, setServices] = useState(initialServices);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<ServiceInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setCreating(true);
    setError(null);
  };

  const openEdit = (service: ServiceRow) => {
    setForm({
      name: service.name,
      slug: service.slug,
      short_description: service.short_description ?? "",
      full_description: service.full_description ?? "",
      icon: service.icon ?? "Coins",
      image_url: service.image_url,
      seo_title: service.seo_title ?? "",
      seo_description: service.seo_description ?? "",
      published: service.published,
    });
    setEditing(service);
    setCreating(false);
    setError(null);
  };

  const close = () => {
    setEditing(null);
    setCreating(false);
  };

  const save = () => {
    startTransition(async () => {
      const result = editing ? await updateService(editing.id, form) : await createService(form);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        toast.error(result.error ?? "Something went wrong.");
        return;
      }
      if (editing) {
        setServices((prev) => prev.map((s) => (s.id === editing.id ? result.data : s)));
        toast.success("Service updated");
      } else {
        setServices((prev) => [...prev, result.data]);
        toast.success("Service created");
      }
      close();
    });
  };

  const remove = async (id: string) => {
    const result = await deleteService(id);
    if (result.ok) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success("Service deleted");
    } else {
      toast.error(result.error ?? "Failed to delete service.");
    }
  };

  const move = (service: ServiceRow, direction: "up" | "down") => {
    startTransition(async () => {
      const result = await reorderService(service.id, direction, services);
      if (result.ok) {
        const sorted = [...services].sort((a, b) => a.position - b.position);
        const index = sorted.findIndex((s) => s.id === service.id);
        const swapWith = direction === "up" ? index - 1 : index + 1;
        const a = sorted[index];
        const b = sorted[swapWith];
        const tmp = a.position;
        a.position = b.position;
        b.position = tmp;
        setServices([...sorted]);
      }
    });
  };

  const sorted = [...services].sort((a, b) => a.position - b.position);
  const showForm = creating || editing;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card className="p-0">
        {sorted.length === 0 ? (
          <div className="p-6"><EmptyState message="No services yet. Add your first service." /></div>
        ) : (
          <ul className="divide-y divide-black/5">
            {sorted.map((service, i) => (
              <li key={service.id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-0.5">
                  <button disabled={i === 0} onClick={() => move(service, "up")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move up">
                    <ChevronUp size={16} />
                  </button>
                  <button disabled={i === sorted.length - 1} onClick={() => move(service, "down")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move down">
                    <ChevronDown size={16} />
                  </button>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">
                  <IconPreview name={service.icon ?? ""} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{service.name}</p>
                  <p className="truncate text-xs text-text-grey">/{service.slug}</p>
                </div>
                <Pill tone={service.published ? "success" : "default"}>{service.published ? "Published" : "Draft"}</Pill>
                <button onClick={() => openEdit(service)} className="text-text-grey hover:text-navy" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <ConfirmDeleteButton action={() => remove(service.id)} />
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-black/5 p-4">
          <AdminButton onClick={openCreate}><Plus size={16} /> Add Service</AdminButton>
        </div>
      </Card>

      {showForm && (
        <Card className="h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-navy">{editing ? "Edit Service" : "New Service"}</h2>
            <button onClick={close} aria-label="Close"><X size={18} className="text-text-grey" /></button>
          </div>

          <div className="space-y-4">
            <Field label="Name">
              {(id) => (
                <input
                  id={id}
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({ ...f, name, slug: editing ? f.slug : slugify(name) }));
                  }}
                />
              )}
            </Field>
            <Field label="Slug">
              {(id) => <input id={id} className={inputClass} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} />}
            </Field>
            <Field label="Icon (lucide-react name)">
              {(id) => (
                <div className="flex items-center gap-2">
                  <input id={id} className={inputClass} value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10"><IconPreview name={form.icon} /></div>
                </div>
              )}
            </Field>
            <Field label="Short Description">
              {(id) => <textarea id={id} rows={2} className={inputClass} value={form.short_description} onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))} />}
            </Field>
            <Field label="Full Description">
              {() => <RichTextEditor value={form.full_description} onChange={(html) => setForm((f) => ({ ...f, full_description: html }))} />}
            </Field>
            <Field label="SEO Title">
              {(id) => <input id={id} className={inputClass} value={form.seo_title} onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))} />}
            </Field>
            <Field label="SEO Description">
              {(id) => <textarea id={id} rows={2} className={inputClass} value={form.seo_description} onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))} />}
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
              Published
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <AdminButton onClick={save} disabled={pending || !form.name || !form.slug} className="w-full">
              {pending ? "Saving…" : "Save Service"}
            </AdminButton>
          </div>
        </Card>
      )}
    </div>
  );
}
