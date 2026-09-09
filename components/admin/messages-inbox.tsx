"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import { AdminButton, Card, EmptyState, Pill, inputClass } from "@/components/admin/ui";
import { ConfirmDeleteButton } from "@/components/admin/confirm-button";
import { updateContactMessageStatus, deleteContactMessage } from "@/lib/actions/admin/messages";
import { downloadCsv } from "@/lib/csv";
import { formatDate } from "@/lib/utils";
import type { ContactMessageRow, ContactStatus } from "@/lib/types/database";

const statuses: ContactStatus[] = ["new", "read", "responded", "archived"];
const toneFor: Record<ContactStatus, "warning" | "default" | "success"> = {
  new: "warning", read: "default", responded: "success", archived: "default",
};

export function MessagesInbox({ initialMessages }: { initialMessages: ContactMessageRow[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (search && !`${m.full_name} ${m.email} ${m.subject ?? ""} ${m.message}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [messages, statusFilter, search]);

  const setStatus = async (id: string, status: ContactStatus) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    const result = await updateContactMessageStatus(id, status);
    if (result.ok) toast.success(`Marked as ${status}`);
    else toast.error(result.error ?? "Failed to update status.");
  };

  const remove = async (id: string) => {
    const result = await deleteContactMessage(id);
    if (result.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted");
    } else {
      toast.error(result.error ?? "Failed to delete message.");
    }
  };

  const exportCsv = () => {
    downloadCsv(
      "sikamine-contact-messages.csv",
      filtered.map((m) => ({
        name: m.full_name, company: m.company, email: m.email, phone: m.phone,
        subject: m.subject, enquiry_type: m.enquiry_type, message: m.message,
        status: m.status, date: m.created_at,
      }))
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input className={`${inputClass} max-w-xs`} placeholder="Search enquiries…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className={inputClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ContactStatus | "all")}>
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
            {filtered.map((m) => (
              <li key={m.id} className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={() => setExpanded(expanded === m.id ? null : m.id)} className="text-text-grey">
                    {expanded === m.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy">{m.full_name} {m.company && <span className="font-normal text-text-grey">· {m.company}</span>}</p>
                    <p className="truncate text-xs text-text-grey">{m.subject || m.enquiry_type} · {formatDate(m.created_at)}</p>
                  </div>
                  <Pill tone={toneFor[m.status]}>{m.status}</Pill>
                  <select className={`${inputClass} w-auto py-1.5 text-xs`} value={m.status} onChange={(e) => setStatus(m.id, e.target.value as ContactStatus)}>
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ConfirmDeleteButton action={() => remove(m.id)} />
                </div>
                {expanded === m.id && (
                  <div className="mt-3 rounded-lg bg-bg-alt p-4 text-sm">
                    <p><span className="font-semibold">Email:</span> <a href={`mailto:${m.email}`} className="text-orange">{m.email}</a></p>
                    {m.phone && <p><span className="font-semibold">Phone:</span> {m.phone}</p>}
                    <p className="mt-2 whitespace-pre-wrap">{m.message}</p>
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
