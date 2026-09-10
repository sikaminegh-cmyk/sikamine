"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Pencil, X, Images, ChevronUp, ChevronDown, Upload, Loader2 } from "lucide-react";
import { AdminButton, Card, EmptyState, Pill, Field, inputClass } from "@/components/admin/ui";
import { ConfirmDeleteButton } from "@/components/admin/confirm-button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { createClient } from "@/lib/supabase/client";
import { toPortableUrl } from "@/lib/public-url";
import {
  createAlbum,
  createAlbumImage,
  deleteAlbum,
  deleteAlbumImage,
  reorderAlbumImage,
  updateAlbum,
  updateAlbumImage,
  type AlbumInput,
} from "@/lib/actions/admin/blog";
import type { AlbumImageRow, AlbumRow } from "@/lib/types/database";

const emptyForm: AlbumInput = { title: "", slug: "", description: "", cover_image_url: null, published: true };

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AlbumImagesPanel({ album, initialImages }: { album: AlbumRow; initialImages: AlbumImageRow[] }) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error: uploadError } = await supabase.storage.from("public-media").upload(path, file);
      if (uploadError) {
        toast.error(`${file.name}: ${uploadError.message}`);
        continue;
      }
      const { data } = supabase.storage.from("public-media").getPublicUrl(path);
      const result = await createAlbumImage(album.id, toPortableUrl(data.publicUrl), "");
      if (result.ok) {
        setImages((prev) => [...prev, result.data]);
      } else {
        toast.error(result.error ?? `${file.name}: failed to save.`);
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    toast.success("Photos uploaded");
  };

  const remove = async (id: string) => {
    const result = await deleteAlbumImage(id);
    if (result.ok) {
      setImages((prev) => prev.filter((i) => i.id !== id));
      toast.success("Photo removed");
    } else {
      toast.error(result.error ?? "Failed to remove photo.");
    }
  };

  const move = async (image: AlbumImageRow, direction: "up" | "down") => {
    const result = await reorderAlbumImage(image.id, direction, images);
    if (result.ok) {
      const sorted = [...images].sort((a, b) => a.position - b.position);
      const index = sorted.findIndex((i) => i.id === image.id);
      const swapWith = direction === "up" ? index - 1 : index + 1;
      const tmp = sorted[index].position;
      sorted[index].position = sorted[swapWith].position;
      sorted[swapWith].position = tmp;
      setImages([...sorted]);
    }
  };

  const updateCaption = async (id: string, caption: string) => {
    const result = await updateAlbumImage(id, caption);
    if (result.ok) setImages((prev) => prev.map((i) => (i.id === id ? result.data : i)));
  };

  const sorted = [...images].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-4 border-t border-black/5 bg-bg-alt p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-grey">{sorted.length} photo{sorted.length === 1 ? "" : "s"}</p>
        <AdminButton variant="secondary" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} {uploading ? "Uploading…" : "Add Photos"}
        </AdminButton>
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
      </div>

      {sorted.length === 0 ? (
        <EmptyState message="No photos in this album yet." />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {sorted.map((image, i) => (
            <li key={image.id} className="flex gap-3 rounded-lg border border-black/5 bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.image_url} alt={image.caption ?? ""} className="h-16 w-16 shrink-0 rounded-md object-cover" />
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  className={inputClass}
                  placeholder="Caption (optional)"
                  defaultValue={image.caption ?? ""}
                  onBlur={(e) => { if (e.target.value !== (image.caption ?? "")) updateCaption(image.id, e.target.value); }}
                />
                <div className="flex items-center gap-2">
                  <button disabled={i === 0} onClick={() => move(image, "up")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move up"><ChevronUp size={15} /></button>
                  <button disabled={i === sorted.length - 1} onClick={() => move(image, "down")} className="text-text-grey hover:text-navy disabled:opacity-20" aria-label="Move down"><ChevronDown size={15} /></button>
                  <ConfirmDeleteButton action={() => remove(image.id)} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AlbumsManager({ initialAlbums, initialAlbumImages }: { initialAlbums: AlbumRow[]; initialAlbumImages: AlbumImageRow[] }) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [editing, setEditing] = useState<AlbumRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState<AlbumInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const openCreate = () => { setForm(emptyForm); setEditing(null); setCreating(true); setError(null); };
  const openEdit = (album: AlbumRow) => {
    setForm({ title: album.title, slug: album.slug, description: album.description ?? "", cover_image_url: album.cover_image_url, published: album.published });
    setEditing(album);
    setCreating(false);
    setError(null);
  };
  const close = () => { setEditing(null); setCreating(false); };

  const save = () => {
    startTransition(async () => {
      const result = editing ? await updateAlbum(editing.id, form) : await createAlbum(form);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        toast.error(result.error ?? "Something went wrong.");
        return;
      }
      if (editing) {
        setAlbums((prev) => prev.map((a) => (a.id === editing.id ? result.data : a)));
        toast.success("Album updated");
      } else {
        setAlbums((prev) => [result.data, ...prev]);
        toast.success("Album created");
      }
      close();
    });
  };

  const remove = async (id: string) => {
    const result = await deleteAlbum(id);
    if (result.ok) {
      setAlbums((prev) => prev.filter((a) => a.id !== id));
      toast.success("Album deleted");
    } else {
      toast.error(result.error ?? "Failed to delete album.");
    }
  };

  const sorted = [...albums].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  const showForm = creating || editing;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card className="p-0">
        {sorted.length === 0 ? (
          <div className="p-6"><EmptyState message="No photo albums yet. Create your first album." /></div>
        ) : (
          <ul className="divide-y divide-black/5">
            {sorted.map((album) => (
              <li key={album.id}>
                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-navy/5 text-navy">
                    {album.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={album.cover_image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Images size={18} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy">{album.title}</p>
                    <p className="truncate text-xs text-text-grey">/albums/{album.slug}</p>
                  </div>
                  <Pill tone={album.published ? "success" : "default"}>{album.published ? "Published" : "Draft"}</Pill>
                  <button
                    onClick={() => setExpanded((prev) => (prev === album.id ? null : album.id))}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
                  >
                    Photos <ChevronDown size={14} className={expanded === album.id ? "rotate-180 transition-transform" : "transition-transform"} />
                  </button>
                  <button onClick={() => openEdit(album)} className="text-text-grey hover:text-navy" aria-label="Edit"><Pencil size={16} /></button>
                  <ConfirmDeleteButton action={() => remove(album.id)} />
                </div>
                {expanded === album.id && (
                  <AlbumImagesPanel album={album} initialImages={initialAlbumImages.filter((i) => i.album_id === album.id)} />
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-black/5 p-4">
          <AdminButton onClick={openCreate}><Plus size={16} /> New Album</AdminButton>
        </div>
      </Card>

      {showForm && (
        <Card className="h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-navy">{editing ? "Edit Album" : "New Album"}</h2>
            <button onClick={close} aria-label="Close"><X size={18} className="text-text-grey" /></button>
          </div>

          <div className="space-y-4">
            <Field label="Title">
              {(id) => (
                <input
                  id={id}
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((f) => ({ ...f, title, slug: editing ? f.slug : slugify(title) }));
                  }}
                />
              )}
            </Field>
            <Field label="Slug">
              {(id) => <input id={id} className={inputClass} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} />}
            </Field>
            <ImageUploadField label="Cover Image" value={form.cover_image_url} onChange={(url) => setForm((f) => ({ ...f, cover_image_url: url }))} />
            <Field label="Description">
              {(id) => <textarea id={id} rows={3} className={inputClass} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />}
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
              Published
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <AdminButton onClick={save} disabled={pending || !form.title || !form.slug} className="w-full">
              {pending ? "Saving…" : "Save Album"}
            </AdminButton>
            {!editing && (
              <p className="text-xs text-text-grey">Save the album first, then use “Photos” on the list to upload images.</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
