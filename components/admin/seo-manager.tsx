"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { AdminButton, Card, Field, inputClass } from "@/components/admin/ui";
import { updateSeoSettings, type SeoInput } from "@/lib/actions/admin/seo";
import type { SeoSettingsRow } from "@/lib/types/database";

const routes = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "governance-compliance", label: "Governance & Compliance" },
  { key: "responsible-sourcing", label: "Responsible Sourcing" },
  { key: "partnerships", label: "Partnerships" },
  { key: "contact", label: "Contact" },
  { key: "terms", label: "Terms & Conditions" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "cookies", label: "Cookie Policy" },
];

function emptyInput(): SeoInput {
  return { seo_title: "", meta_description: "", keywords: "", og_title: "", og_description: "", og_image: "", canonical_url: "", no_index: false };
}

function toSeoInput(row: SeoSettingsRow | undefined): SeoInput {
  if (!row) return emptyInput();
  return {
    seo_title: row.seo_title ?? "",
    meta_description: row.meta_description ?? "",
    keywords: row.keywords ?? "",
    og_title: row.og_title ?? "",
    og_description: row.og_description ?? "",
    og_image: row.og_image ?? "",
    canonical_url: row.canonical_url ?? "",
    no_index: row.no_index,
  };
}

export function SeoManager({ initialSeo }: { initialSeo: SeoSettingsRow[] }) {
  const [seo, setSeo] = useState<Record<string, SeoSettingsRow | undefined>>(Object.fromEntries(initialSeo.map((s) => [s.route_key, s])));
  const [activeKey, setActiveKey] = useState("home");
  const active = seo[activeKey];
  const [form, setForm] = useState<SeoInput>(toSeoInput(active));
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const selectRoute = (key: string) => {
    setActiveKey(key);
    setForm(toSeoInput(seo[key]));
  };

  const save = () => {
    startTransition(async () => {
      const result = await updateSeoSettings(activeKey, form);
      if (result.ok) {
        setSeo((prev) => ({ ...prev, [activeKey]: result.data }));
        toast.success("SEO settings saved");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <Card className="h-fit p-2">
        {routes.map((r) => (
          <button
            key={r.key}
            onClick={() => selectRoute(r.key)}
            className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium ${activeKey === r.key ? "bg-navy text-white" : "text-text hover:bg-bg-alt"}`}
          >
            {r.label}
          </button>
        ))}
      </Card>

      <Card>
        <div className="space-y-4">
          <Field label="SEO Title">{(id) => <input id={id} className={inputClass} value={form.seo_title} onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))} />}</Field>
          <Field label="Meta Description">{(id) => <textarea id={id} rows={2} className={inputClass} value={form.meta_description} onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))} />}</Field>
          <Field label="Keywords">{(id) => <input id={id} className={inputClass} value={form.keywords} onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} />}</Field>
          <Field label="OG Title">{(id) => <input id={id} className={inputClass} value={form.og_title} onChange={(e) => setForm((f) => ({ ...f, og_title: e.target.value }))} />}</Field>
          <Field label="OG Description">{(id) => <textarea id={id} rows={2} className={inputClass} value={form.og_description} onChange={(e) => setForm((f) => ({ ...f, og_description: e.target.value }))} />}</Field>
          <Field label="OG Image URL">{(id) => <input id={id} className={inputClass} value={form.og_image} onChange={(e) => setForm((f) => ({ ...f, og_image: e.target.value }))} />}</Field>
          <Field label="Canonical URL">{(id) => <input id={id} className={inputClass} value={form.canonical_url} onChange={(e) => setForm((f) => ({ ...f, canonical_url: e.target.value }))} />}</Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.no_index} onChange={(e) => setForm((f) => ({ ...f, no_index: e.target.checked }))} />
            No-index (hide from search engines)
          </label>
          <AdminButton onClick={save} disabled={pending}><Save size={15} /> {saved ? "Saved" : pending ? "Saving…" : "Save SEO"}</AdminButton>
        </div>
      </Card>
    </div>
  );
}
