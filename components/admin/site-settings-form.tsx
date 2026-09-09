"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { AdminButton, Card, Field, inputClass } from "@/components/admin/ui";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { updateSiteSettings, type SiteSettingsInput } from "@/lib/actions/admin/settings";
import type { SiteSettingsRow } from "@/lib/types/database";

const socialPlatforms = ["facebook", "linkedin", "instagram", "x"];

export function SiteSettingsForm({ settings }: { settings: SiteSettingsRow }) {
  const [form, setForm] = useState<SiteSettingsInput>({ ...settings });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const socialLinks = (form.social_links ?? {}) as Record<string, string>;

  const save = () => {
    startTransition(async () => {
      const result = await updateSiteSettings(form);
      if (!result.ok) {
        setError(result.error ?? "Failed to save.");
        toast.error(result.error ?? "Failed to save.");
        return;
      }
      toast.success("Settings saved");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="mb-4 font-heading text-base font-bold text-navy">Branding</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <ImageUploadField label="Logo (light backgrounds)" value={form.logo_url ?? null} onChange={(url) => setForm((f) => ({ ...f, logo_url: url }))} />
          <ImageUploadField label="Logo (dark backgrounds)" value={form.dark_logo_url ?? null} onChange={(url) => setForm((f) => ({ ...f, dark_logo_url: url }))} />
          <ImageUploadField label="Favicon" value={form.favicon_url ?? null} onChange={(url) => setForm((f) => ({ ...f, favicon_url: url }))} />
          <ImageUploadField label="Default Social Share Image" value={form.default_seo_image ?? null} onChange={(url) => setForm((f) => ({ ...f, default_seo_image: url }))} />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Field label="Primary Color">{(id) => <input id={id} type="color" className="h-10 w-full rounded-lg border border-black/10" value={form.primary_color} onChange={(e) => setForm((f) => ({ ...f, primary_color: e.target.value }))} />}</Field>
          <Field label="Secondary Color">{(id) => <input id={id} type="color" className="h-10 w-full rounded-lg border border-black/10" value={form.secondary_color} onChange={(e) => setForm((f) => ({ ...f, secondary_color: e.target.value }))} />}</Field>
          <Field label="Accent Color">{(id) => <input id={id} type="color" className="h-10 w-full rounded-lg border border-black/10" value={form.accent_color} onChange={(e) => setForm((f) => ({ ...f, accent_color: e.target.value }))} />}</Field>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-heading text-base font-bold text-navy">Company & Footer</h2>
        <div className="space-y-4">
          <Field label="Site Name">{(id) => <input id={id} className={inputClass} value={form.site_name} onChange={(e) => setForm((f) => ({ ...f, site_name: e.target.value }))} />}</Field>
          <Field label="Footer Description">{(id) => <textarea id={id} rows={2} className={inputClass} value={form.footer_description} onChange={(e) => setForm((f) => ({ ...f, footer_description: e.target.value }))} />}</Field>
          <Field label="Footer Copyright Text">{(id) => <input id={id} className={inputClass} value={form.footer_copyright} onChange={(e) => setForm((f) => ({ ...f, footer_copyright: e.target.value }))} />}</Field>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-heading text-base font-bold text-navy">Social Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {socialPlatforms.map((platform) => (
            <Field key={platform} label={platform}>
              {(id) => (
                <input
                  id={id}
                  className={inputClass}
                  placeholder={`https://${platform}.com/sikamine`}
                  value={socialLinks[platform] ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, social_links: { ...socialLinks, [platform]: e.target.value } }))}
                />
              )}
            </Field>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-heading text-base font-bold text-navy">Analytics & Maintenance</h2>
        <div className="space-y-4">
          <Field label="Google Analytics Measurement ID (optional, client-owned)">
            {(id) => <input id={id} className={inputClass} placeholder="G-XXXXXXXXXX" value={form.analytics_id ?? ""} onChange={(e) => setForm((f) => ({ ...f, analytics_id: e.target.value || null }))} />}
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.maintenance_mode ?? false} onChange={(e) => setForm((f) => ({ ...f, maintenance_mode: e.target.checked }))} />
            Maintenance mode (shows a holding page to visitors — admin remains accessible)
          </label>
        </div>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <AdminButton onClick={save} disabled={pending}><Save size={15} /> {saved ? "Saved" : pending ? "Saving…" : "Save Settings"}</AdminButton>
    </div>
  );
}
