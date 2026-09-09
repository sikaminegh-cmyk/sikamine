"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, ChevronDown, ChevronUp, Save } from "lucide-react";
import { AdminButton, Card, EmptyState, Pill, inputClass } from "@/components/admin/ui";
import { ConfirmDeleteButton } from "@/components/admin/confirm-button";
import { updatePartnershipEnquiry, deletePartnershipEnquiry } from "@/lib/actions/admin/partnership-enquiries";
import { downloadCsv } from "@/lib/csv";
import { formatDate } from "@/lib/utils";
import type { PartnershipEnquiryRow, PartnershipStatus } from "@/lib/types/database";

const statuses: PartnershipStatus[] = ["new", "reviewing", "contacted", "qualified", "declined", "completed"];
const toneFor: Record<PartnershipStatus, "warning" | "default" | "success" | "danger"> = {
  new: "warning", reviewing: "default", contacted: "default", qualified: "success", declined: "danger", completed: "success",
};

function NotesField({ enquiry }: { enquiry: PartnershipEnquiryRow }) {
  const [notes, setNotes] = useState(enquiry.internal_notes ?? "");
  const [saved, setSaved] = useState(false);
  const dirty = notes !== (enquiry.internal_notes ?? "");

  return (
    <div className="mt-2">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-grey">Internal Notes</label>
      <textarea rows={2} className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
      <button
        disabled={!dirty}
        onClick={async () => {
          const result = await updatePartnershipEnquiry(enquiry.id, { internal_notes: notes });
          if (result.ok) {
            toast.success("Notes saved");
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
          } else {
            toast.error(result.error ?? "Failed to save notes.");
          }
        }}
        className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-navy disabled:opacity-30"
      >
        <Save size={13} /> {saved ? "Saved" : "Save Notes"}
      </button>
    </div>
  );
}

export function PartnershipEnquiriesInbox({ initialEnquiries }: { initialEnquiries: PartnershipEnquiryRow[] }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [statusFilter, setStatusFilter] = useState<PartnershipStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (search && !`${e.full_name} ${e.email} ${e.company_name ?? ""} ${e.partnership_type}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [enquiries, statusFilter, search]);

  const setStatus = async (id: string, status: PartnershipStatus) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    const result = await updatePartnershipEnquiry(id, { status });
    if (result.ok) toast.success(`Marked as ${status}`);
    else toast.error(result.error ?? "Failed to update status.");
  };

  const remove = async (id: string) => {
    const result = await deletePartnershipEnquiry(id);
    if (result.ok) {
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Enquiry deleted");
    } else {
      toast.error(result.error ?? "Failed to delete enquiry.");
    }
  };

  const exportCsv = () => {
    downloadCsv(
      "sikamine-partnership-enquiries.csv",
      filtered.map((e) => ({
        name: e.full_name, company: e.company_name, email: e.email, phone: e.phone, country: e.country,
        partnership_type: e.partnership_type, message: e.message, status: e.status, date: e.created_at,
      }))
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input className={`${inputClass} max-w-xs`} placeholder="Search enquiries…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className={inputClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as PartnershipStatus | "all")}>
          <option value="all">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <AdminButton variant="secondary" onClick={exportCsv}><Download size={15} /> Export CSV</AdminButton>
      </div>

      <Card className="p-0">
        {filtered.length === 0 ? (
          <div className="p-6"><EmptyState message="No enquiries match your filters." /></div>
        ) : (
          <ul className="divide-y divide-black/5">
            {filtered.map((e) => (
              <li key={e.id} className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={() => setExpanded(expanded === e.id ? null : e.id)} className="text-text-grey">
                    {expanded === e.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy">{e.full_name} {e.company_name && <span className="font-normal text-text-grey">· {e.company_name}</span>}</p>
                    <p className="truncate text-xs text-text-grey">{e.partnership_type} · {formatDate(e.created_at)}</p>
                  </div>
                  <Pill tone={toneFor[e.status]}>{e.status}</Pill>
                  <select className={`${inputClass} w-auto py-1.5 text-xs`} value={e.status} onChange={(ev) => setStatus(e.id, ev.target.value as PartnershipStatus)}>
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ConfirmDeleteButton action={() => remove(e.id)} />
                </div>
                {expanded === e.id && (
                  <div className="mt-3 rounded-lg bg-bg-alt p-4 text-sm">
                    <p><span className="font-semibold">Email:</span> <a href={`mailto:${e.email}`} className="text-orange">{e.email}</a></p>
                    {e.phone && <p><span className="font-semibold">Phone:</span> {e.phone}</p>}
                    {e.country && <p><span className="font-semibold">Country:</span> {e.country}</p>}
                    {e.message && <p className="mt-2 whitespace-pre-wrap">{e.message}</p>}
                    <NotesField enquiry={e} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
