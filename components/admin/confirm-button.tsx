"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";

export function ConfirmDeleteButton({
  action,
  confirmMessage = "Are you sure? This cannot be undone.",
  label,
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-xs">
        <span className="text-text-grey">{confirmMessage}</span>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(async () => { await action(); setConfirming(false); })}
          className="font-semibold text-red-600 hover:underline"
        >
          {pending ? <Loader2 size={14} className="animate-spin" /> : "Confirm"}
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="text-text-grey hover:underline">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline"
      aria-label="Delete"
    >
      <Trash2 size={14} /> {label ?? "Delete"}
    </button>
  );
}
