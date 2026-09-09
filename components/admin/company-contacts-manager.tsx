"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Save, X } from "lucide-react";
import { AdminButton, Card, Field, inputClass, Pill } from "@/components/admin/ui";
import { ConfirmDeleteButton } from "@/components/admin/confirm-button";
import { createCompanyContact, deleteCompanyContact, updateCompanyContact, type CompanyContactInput } from "@/lib/actions/admin/company-contacts";
import type { CompanyContactRow } from "@/lib/types/database";

const contactTypes = ["text", "email", "phone", "whatsapp", "url"];

function ContactRow({ contact, onUpdated, onDeleted }: { contact: CompanyContactRow; onUpdated: (row: CompanyContactRow) => void; onDeleted: (id: string) => void }) {
  const [label, setLabel] = useState(contact.label);
  const [value, setValue] = useState(contact.value ?? "");
  const [publicVisible, setPublicVisible] = useState(contact.public_visible);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const dirty = label !== contact.label || value !== (contact.value ?? "") || publicVisible !== contact.public_visible;

  const save = () => {
    startTransition(async () => {
      const result = await updateCompanyContact(contact.id, { label, value, public_visible: publicVisible });
      if (!result.ok) {
        setError(result.error ?? "Failed to save.");
        toast.error(result.error ?? "Failed to save.");
      } else {
        onUpdated(result.data);
        toast.success("Contact saved");
      }
    });
  };

  return (
    <tr className="border-b border-black/5 last:border-0">
      <td className="py-3 pr-4 align-top">
        <p className="text-xs font-mono text-text-grey">{contact.key}</p>
        <input className={`${inputClass} mt-1`} value={label} onChange={(e) => setLabel(e.target.value)} />
      </td>
      <td className="py-3 pr-4 align-top">
        <input className={inputClass} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Not set" />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </td>
      <td className="py-3 pr-4 align-top"><Pill>{contact.type}</Pill></td>
      <td className="py-3 pr-4 align-top">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={publicVisible} onChange={(e) => setPublicVisible(e.target.checked)} />
          Public
        </label>
      </td>
      <td className="py-3 align-top">
        <div className="flex items-center gap-3">
          <button disabled={!dirty || pending} onClick={save} className="text-navy hover:opacity-70 disabled:opacity-30" aria-label="Save">
            <Save size={16} />
          </button>
          <ConfirmDeleteButton
            action={async () => {
              const result = await deleteCompanyContact(contact.id);
              if (result.ok) {
                onDeleted(contact.id);
                toast.success("Contact deleted");
              } else {
                toast.error(result.error ?? "Failed to delete contact.");
              }
            }}
          />
        </div>
      </td>
    </tr>
  );
}

export function CompanyContactsManager({ initialContacts }: { initialContacts: CompanyContactRow[] }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<CompanyContactInput>({ key: "", label: "", value: "", type: "email", department: "", public_visible: false });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const addContact = () => {
    startTransition(async () => {
      const key = form.key.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
      const result = await createCompanyContact({ ...form, key });
      if (!result.ok) {
        setError(result.error ?? "Failed to add contact.");
        toast.error(result.error ?? "Failed to add contact.");
        return;
      }
      setContacts((prev) => [...prev, result.data]);
      toast.success("Contact added");
      setCreating(false);
      setForm({ key: "", label: "", value: "", type: "email", department: "", public_visible: false });
    });
  };

  const grouped = contacts.reduce<Record<string, CompanyContactRow[]>>((acc, c) => {
    const dept = c.department || "General";
    (acc[dept] ??= []).push(c);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([department, rows]) => (
        <Card key={department} className="p-0">
          <h2 className="border-b border-black/5 px-6 py-4 font-heading text-sm font-bold text-navy">{department}</h2>
          <div className="overflow-x-auto p-6 pt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-text-grey">
                  <th className="pb-2 pr-4">Label / Key</th>
                  <th className="pb-2 pr-4">Value</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">Visibility</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((contact) => (
                  <ContactRow
                    key={contact.id}
                    contact={contact}
                    onUpdated={(row) => setContacts((prev) => prev.map((c) => (c.id === row.id ? row : c)))}
                    onDeleted={(id) => setContacts((prev) => prev.filter((c) => c.id !== id))}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}

      <Card>
        {!creating ? (
          <AdminButton onClick={() => setCreating(true)}><Plus size={16} /> Add Custom Contact</AdminButton>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-base font-bold text-navy">New Contact</h2>
              <button onClick={() => setCreating(false)} aria-label="Close"><X size={18} className="text-text-grey" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Key (e.g. legal_email)">{(id) => <input id={id} className={inputClass} value={form.key} onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))} />}</Field>
              <Field label="Label">{(id) => <input id={id} className={inputClass} value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />}</Field>
              <Field label="Value">{(id) => <input id={id} className={inputClass} value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} />}</Field>
              <Field label="Department">{(id) => <input id={id} className={inputClass} value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />}</Field>
              <Field label="Type">
                {(id) => (
                  <select id={id} className={inputClass} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                    {contactTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                )}
              </Field>
              <label className="flex items-center gap-2 self-end pb-2.5 text-sm">
                <input type="checkbox" checked={form.public_visible} onChange={(e) => setForm((f) => ({ ...f, public_visible: e.target.checked }))} />
                Public on website
              </label>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <AdminButton onClick={addContact} disabled={pending || !form.key || !form.label}>{pending ? "Adding…" : "Add Contact"}</AdminButton>
          </div>
        )}
      </Card>
    </div>
  );
}
