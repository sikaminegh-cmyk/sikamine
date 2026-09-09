"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, ChevronUp, ChevronDown, Pencil, X, Save } from "lucide-react";
import { AdminButton, Card, EmptyState, Pill, Field, inputClass } from "@/components/admin/ui";
import { ConfirmDeleteButton } from "@/components/admin/confirm-button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  createSection,
  deleteSection,
  reorderSection,
  updatePageMeta,
  updateSection,
  type SectionInput,
} from "@/lib/actions/admin/pages";
import type { PageRow, PageSectionRow } from "@/lib/types/database";

const sectionTypes = [
  "hero", "hero_compact", "text", "compliance", "services_grid", "pillars_grid", "partner_categories_grid",
  "why_sikamine", "cta", "offices_grid", "contact_form", "contact_split", "partnership_form", "value_card", "ceo_message", "team_grid",
];
const backgroundStyles = ["light", "alt", "navy", "dark", "white"];

const emptyForm: SectionInput = {
  type: "text", title: "", subtitle: "", body: "", image_url: null, video_url: null,
  cta_label: "", cta_url: "", secondary_cta_label: "", secondary_cta_url: "", background_style: "light", visible: true,
};

function PageMetaForm({ page }: { page: PageRow }) {
  const [title, setTitle] = useState(page.title);
  const [published, setPublished] = useState(page.published);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const dirty = title !== page.title || published !== page.published;

  const save = () => {
    startTransition(async () => {
      const result = await updatePageMeta(page.id, page.slug, { title, published });
      if (result.ok) {
        toast.success("Page updated");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  return (
    <Card className="mb-6 flex flex-wrap items-end gap-4">
      <div className="min-w-[220px] flex-1">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-grey">Page Title</label>
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <label className="flex items-center gap-2 pb-2.5 text-sm">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Published
      </label>
      <AdminButton onClick={save} disabled={!dirty || pending}>
        <Save size={15} /> {saved ? "Saved" : pending ? "Saving…" : "Save Page"}
      </AdminButton>
    </Card>
  );
}

export function PageSectionsEditor({ page, initialSections }: { page: PageRow; initialSections: PageSectionRow[] }) {
  const [sections, setSections] = useState(initialSections);
  const [editing, setEditing] = useState<PageSectionRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<SectionInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const openCreate = () => { setForm(emptyForm); setEditing(null); setCreating(true); setError(null); };
  const openEdit = (s: PageSectionRow) => {
    setForm({
      type: s.type, title: s.title ?? "", subtitle: s.subtitle ?? "", body: s.body ?? "",
      image_url: s.image_url, video_url: s.video_url, cta_label: s.cta_label ?? "", cta_url: s.cta_url ?? "",
      secondary_cta_label: s.secondary_cta_label ?? "", secondary_cta_url: s.secondary_cta_url ?? "",
      background_style: s.background_style, visible: s.visible,
    });
    setEditing(s); setCreating(false); setError(null);
  };
  const close = () => { setEditing(null); setCreating(false); };

  const save = () => {
    startTransition(async () => {
      const result = editing ? await updateSection(editing.id, page.slug, form) : await createSection(page.id, page.slug, form);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        toast.error(result.error ?? "Something went wrong.");
        return;
      }
      if (editing) {
        setSections((prev) => prev.map((s) => (s.id === editing.id ? result.data : s)));
        toast.success("Section updated");
      } else {
        setSections((prev) => [...prev, result.data]);
        toast.success("Section created");
      }
      close();
    });
  };

  const remove = async (id: string) => {
    const result = await deleteSection(id, page.slug);
    if (result.ok) {
      setSections((prev) => prev.filter((s) => s.id !== id));
      toast.success("Section deleted");
    } else {
      toast.error(result.error ?? "Failed to delete section.");
    }
  };

  const move = (section: PageSectionRow, direction: "up" | "down") => {
    startTransition(async () => {
      const result = await reorderSection(section.id, page.slug, direction, sections);
      if (result.ok) {
        const sorted = [...sections].sort((a, b) => a.position - b.position);
        const index = sorted.findIndex((s) => s.id === section.id);
        const swapWith = direction === "up" ? index - 1 : index + 1;
        const tmp = sorted[index].position;
        sorted[index].position = sorted[swapWith].position;
        sorted[swapWith].position = tmp;
        setSections([...sorted]);
      }
    });
  };

  const sorted = [...sections].sort((a, b) => a.position - b.position);
  const showForm = creating || editing;

  return (
    <div>
      <PageMetaForm page={page} />

      <div className="grid gap-6 lg:grid-cols-[1fr_460px]">
        <Card className="p-0">
          {sorted.length === 0 ? (
            <div className="p-6"><EmptyState message="No sections yet." /></div>
          ) : (
            <ul className="divide-y divide-black/5">
              {sorted.map((section, i) => (
                <li key={section.id} className="flex items-center gap-4 p-4">
                  <div className="flex flex-col gap-0.5">
                    <button disabled={i === 0} onClick={() => move(section, "up")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move up"><ChevronUp size={16} /></button>
                    <button disabled={i === sorted.length - 1} onClick={() => move(section, "down")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move down"><ChevronDown size={16} /></button>
                  </div>
                  <Pill>{section.type}</Pill>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy">{section.title || "(no title)"}</p>
                    <p className="truncate text-xs text-text-grey">{section.background_style}</p>
                  </div>
                  {!section.visible && <Pill tone="default">Hidden</Pill>}
                  <button onClick={() => openEdit(section)} className="text-text-grey hover:text-navy" aria-label="Edit"><Pencil size={16} /></button>
                  <ConfirmDeleteButton action={() => remove(section.id)} />
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-black/5 p-4">
            <AdminButton onClick={openCreate}><Plus size={16} /> Add Section</AdminButton>
          </div>
        </Card>

        {showForm && (
          <Card className="h-fit max-h-[85vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-base font-bold text-navy">{editing ? "Edit Section" : "New Section"}</h2>
              <button onClick={close} aria-label="Close"><X size={18} className="text-text-grey" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Section Type">
                {(id) => (
                  <select id={id} className={inputClass} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                    {sectionTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                )}
              </Field>
              <Field label="Title">{(id) => <input id={id} className={inputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />}</Field>
              <Field label="Subtitle">{(id) => <textarea id={id} rows={2} className={inputClass} value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} />}</Field>
              <Field label="Body">{() => <RichTextEditor value={form.body} onChange={(html) => setForm((f) => ({ ...f, body: html }))} />}</Field>
              <ImageUploadField label="Image" value={form.image_url} onChange={(url) => setForm((f) => ({ ...f, image_url: url }))} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="CTA Label">{(id) => <input id={id} className={inputClass} value={form.cta_label} onChange={(e) => setForm((f) => ({ ...f, cta_label: e.target.value }))} />}</Field>
                <Field label="CTA URL">{(id) => <input id={id} className={inputClass} value={form.cta_url} onChange={(e) => setForm((f) => ({ ...f, cta_url: e.target.value }))} />}</Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Secondary CTA Label">{(id) => <input id={id} className={inputClass} value={form.secondary_cta_label} onChange={(e) => setForm((f) => ({ ...f, secondary_cta_label: e.target.value }))} />}</Field>
                <Field label="Secondary CTA URL">{(id) => <input id={id} className={inputClass} value={form.secondary_cta_url} onChange={(e) => setForm((f) => ({ ...f, secondary_cta_url: e.target.value }))} />}</Field>
              </div>
              <Field label="Background Style">
                {(id) => (
                  <select id={id} className={inputClass} value={form.background_style} onChange={(e) => setForm((f) => ({ ...f, background_style: e.target.value }))}>
                    {backgroundStyles.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                )}
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.visible} onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))} />
                Visible
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}
              <AdminButton onClick={save} disabled={pending} className="w-full">{pending ? "Saving…" : "Save Section"}</AdminButton>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
