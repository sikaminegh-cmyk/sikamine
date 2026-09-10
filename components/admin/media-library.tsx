"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Copy, Check, FileText, Film, Loader2 } from "lucide-react";
import { AdminButton, Card, EmptyState, Pill, inputClass } from "@/components/admin/ui";
import { ConfirmDeleteButton } from "@/components/admin/confirm-button";
import { createClient } from "@/lib/supabase/client";
import { deleteMedia, recordMediaUpload, updateMedia } from "@/lib/actions/admin/media";
import { toPortableUrl } from "@/lib/public-url";
import type { MediaRow } from "@/lib/types/database";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif", "video/mp4", "application/pdf"];
const MAX_SIZE = 25 * 1024 * 1024;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:underline"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy URL"}
    </button>
  );
}

export function MediaLibrary({ initialMedia }: { initialMedia: MediaRow[] }) {
  const [media, setMedia] = useState(initialMedia);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = media.filter((m) => m.filename.toLowerCase().includes(search.toLowerCase()));

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        const message = `${file.name}: unsupported file type.`;
        setError(message);
        toast.error(message);
        continue;
      }
      if (file.size > MAX_SIZE) {
        const message = `${file.name}: file exceeds 25MB limit.`;
        setError(message);
        toast.error(message);
        continue;
      }

      setUploading(true);
      const supabase = createClient();
      const isPublic = true;
      const bucket = isPublic ? "public-media" : "private-documents";
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;

      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
      if (uploadError) {
        const message = `${file.name}: ${uploadError.message}`;
        setError(message);
        toast.error(message);
        setUploading(false);
        continue;
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);

      const result = await recordMediaUpload({
        filename: file.name,
        storage_path: path,
        bucket,
        public_url: isPublic ? toPortableUrl(publicUrlData.publicUrl) : null,
        mime_type: file.type,
        size_bytes: file.size,
        alt_text: "",
        is_public: isPublic,
      });

      if (result.ok) {
        setMedia((prev) => [result.data, ...prev]);
        toast.success("File uploaded");
      } else {
        setError(result.error ?? "Upload failed.");
        toast.error(result.error ?? "Upload failed.");
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = async (item: MediaRow) => {
    const result = await deleteMedia(item.id, item.bucket, item.storage_path);
    if (result.ok) {
      setMedia((prev) => prev.filter((m) => m.id !== item.id));
      toast.success("File deleted");
    } else {
      toast.error(result.error ?? "Failed to delete file.");
    }
  };

  const togglePublic = async (item: MediaRow) => {
    const result = await updateMedia(item.id, { is_public: !item.is_public });
    if (result.ok) setMedia((prev) => prev.map((m) => (m.id === item.id ? result.data : m)));
  };

  return (
    <div>
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <AdminButton onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} {uploading ? "Uploading…" : "Upload Files"}
          </AdminButton>
          <input ref={inputRef} type="file" multiple accept={ALLOWED_TYPES.join(",")} className="hidden" onChange={(e) => handleUpload(e.target.files)} />
          <input className={`${inputClass} max-w-xs`} placeholder="Search files…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <p className="text-xs text-text-grey">JPG, PNG, WebP, SVG, GIF, MP4, PDF — up to 25MB each</p>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </Card>

      {filtered.length === 0 ? (
        <EmptyState message="No media uploaded yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <Card key={item.id} className="p-0 overflow-hidden">
              <div className="flex h-36 items-center justify-center bg-bg-alt">
                {item.mime_type.startsWith("image/") && item.public_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.public_url} alt={item.alt_text ?? ""} className="h-full w-full object-cover" />
                ) : item.mime_type.startsWith("video/") ? (
                  <Film size={32} className="text-text-grey" />
                ) : (
                  <FileText size={32} className="text-text-grey" />
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-semibold text-navy" title={item.filename}>{item.filename}</p>
                <p className="text-[11px] text-text-grey">{formatSize(item.size_bytes)}</p>
                <div className="mt-2 flex items-center justify-between">
                  <button onClick={() => togglePublic(item)}>
                    <Pill tone={item.is_public ? "success" : "default"}>{item.is_public ? "Public" : "Private"}</Pill>
                  </button>
                  {item.public_url && <CopyButton url={item.public_url} />}
                </div>
                <div className="mt-2"><ConfirmDeleteButton action={() => remove(item)} /></div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
