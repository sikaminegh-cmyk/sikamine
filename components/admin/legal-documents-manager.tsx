"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { AdminButton, Card, Field, Pill, inputClass } from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { upsertLegalDocument, type LegalDocInput } from "@/lib/actions/admin/legal";
import type { LegalDocType, LegalDocumentRow } from "@/lib/types/database";

const docTypes: { type: LegalDocType; label: string; defaultTitle: string }[] = [
  { type: "terms", label: "Terms & Conditions", defaultTitle: "Terms & Conditions" },
  { type: "privacy", label: "Privacy Policy", defaultTitle: "Privacy Policy" },
  { type: "cookies", label: "Cookie Policy", defaultTitle: "Cookie Policy" },
  { type: "disclaimer", label: "Disclaimer", defaultTitle: "Disclaimer" },
  { type: "responsible_sourcing_policy", label: "Responsible Sourcing Policy", defaultTitle: "Responsible Sourcing Policy" },
];

function emptyForm(defaultTitle: string): LegalDocInput {
  return { title: defaultTitle, content: "", version: "1.0", effective_date: new Date().toISOString().slice(0, 10), published: false };
}

export function LegalDocumentsManager({ initialDocuments }: { initialDocuments: LegalDocumentRow[] }) {
  const [documents, setDocuments] = useState<Record<string, LegalDocumentRow | undefined>>(
    Object.fromEntries(initialDocuments.map((d) => [d.type, d]))
  );
  const [activeType, setActiveType] = useState<LegalDocType>("terms");
  const activeDoc = documents[activeType];
  const activeDefault = docTypes.find((d) => d.type === activeType)!;
  const [form, setForm] = useState<LegalDocInput>(activeDoc ?? emptyForm(activeDefault.defaultTitle));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selectType = (type: LegalDocType) => {
    setActiveType(type);
    const doc = documents[type];
    const def = docTypes.find((d) => d.type === type)!;
    setForm(doc ? { title: doc.title, content: doc.content, version: doc.version, effective_date: doc.effective_date, published: doc.published } : emptyForm(def.defaultTitle));
    setError(null);
  };

  const save = () => {
    startTransition(async () => {
      const result = await upsertLegalDocument(activeType, form);
      if (!result.ok) {
        setError(result.error ?? "Failed to save.");
        toast.error(result.error ?? "Failed to save.");
        return;
      }
      setDocuments((prev) => ({ ...prev, [activeType]: result.data }));
      toast.success("Document saved");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <Card className="h-fit p-2">
        {docTypes.map((d) => (
          <button
            key={d.type}
            onClick={() => selectType(d.type)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
              activeType === d.type ? "bg-navy text-white" : "text-text hover:bg-bg-alt"
            }`}
          >
            {d.label}
            {!documents[d.type] && <Pill tone="default">Not created</Pill>}
          </button>
        ))}
      </Card>

      <Card>
        <div className="space-y-4">
          <Field label="Title">{(id) => <input id={id} className={inputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />}</Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Version">{(id) => <input id={id} className={inputClass} value={form.version} onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))} />}</Field>
            <Field label="Effective Date">{(id) => <input id={id} type="date" className={inputClass} value={form.effective_date} onChange={(e) => setForm((f) => ({ ...f, effective_date: e.target.value }))} />}</Field>
            <label className="flex items-center gap-2 self-end pb-2.5 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
              Published
            </label>
          </div>
          <Field label="Content">{() => <RichTextEditor value={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} />}</Field>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <AdminButton onClick={save} disabled={pending}>
            <Save size={15} /> {saved ? "Saved" : pending ? "Saving…" : "Save Document"}
          </AdminButton>
        </div>
      </Card>
    </div>
  );
}
