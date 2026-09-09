"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { recordMediaUpload } from "@/lib/actions/admin/media";
import { labelClass } from "@/components/admin/ui";

export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error: uploadError } = await supabase.storage.from("public-media").upload(path, file);
    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("public-media").getPublicUrl(path);
    await recordMediaUpload({
      filename: file.name,
      storage_path: path,
      bucket: "public-media",
      public_url: data.publicUrl,
      mime_type: file.type,
      size_bytes: file.size,
      alt_text: "",
      is_public: true,
    });

    onChange(data.publicUrl);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="h-14 w-14 rounded-lg border border-black/10 object-contain bg-white p-1" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-black/15 text-text-grey">—</div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold text-text hover:bg-bg-alt"
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />} {uploading ? "Uploading…" : "Upload"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange(null)} className="text-text-grey hover:text-red-600" aria-label="Remove">
            <X size={16} />
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
