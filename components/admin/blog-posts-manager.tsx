"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Pencil, X, Newspaper } from "lucide-react";
import { AdminButton, Card, EmptyState, Pill, Field, inputClass } from "@/components/admin/ui";
import { ConfirmDeleteButton } from "@/components/admin/confirm-button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { createBlogPost, deleteBlogPost, updateBlogPost, type BlogPostInput } from "@/lib/actions/admin/blog";
import type { BlogPostRow } from "@/lib/types/database";

const emptyForm: BlogPostInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: null,
  seo_title: "",
  seo_description: "",
  published: true,
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function BlogPostsManager({ initialPosts }: { initialPosts: BlogPostRow[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [editing, setEditing] = useState<BlogPostRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<BlogPostInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const openCreate = () => { setForm(emptyForm); setEditing(null); setCreating(true); setError(null); };
  const openEdit = (post: BlogPostRow) => {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content ?? "",
      cover_image_url: post.cover_image_url,
      seo_title: post.seo_title ?? "",
      seo_description: post.seo_description ?? "",
      published: post.published,
    });
    setEditing(post);
    setCreating(false);
    setError(null);
  };
  const close = () => { setEditing(null); setCreating(false); };

  const save = () => {
    startTransition(async () => {
      const result = editing ? await updateBlogPost(editing.id, form) : await createBlogPost(form);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        toast.error(result.error ?? "Something went wrong.");
        return;
      }
      if (editing) {
        setPosts((prev) => prev.map((p) => (p.id === editing.id ? result.data : p)));
        toast.success("Post updated");
      } else {
        setPosts((prev) => [result.data, ...prev]);
        toast.success("Post published");
      }
      close();
    });
  };

  const remove = async (id: string) => {
    const result = await deleteBlogPost(id);
    if (result.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted");
    } else {
      toast.error(result.error ?? "Failed to delete post.");
    }
  };

  const sorted = [...posts].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  const showForm = creating || editing;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <Card className="p-0">
        {sorted.length === 0 ? (
          <div className="p-6"><EmptyState message="No blog posts yet. Publish your first article." /></div>
        ) : (
          <ul className="divide-y divide-black/5">
            {sorted.map((post) => (
              <li key={post.id} className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-navy/5 text-navy">
                  {post.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.cover_image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Newspaper size={18} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{post.title}</p>
                  <p className="truncate text-xs text-text-grey">/blog/{post.slug} · {formatDate(post.published_at)}</p>
                </div>
                <Pill tone={post.published ? "success" : "default"}>{post.published ? "Published" : "Draft"}</Pill>
                <button onClick={() => openEdit(post)} className="text-text-grey hover:text-navy" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <ConfirmDeleteButton action={() => remove(post.id)} />
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-black/5 p-4">
          <AdminButton onClick={openCreate}><Plus size={16} /> New Post</AdminButton>
        </div>
      </Card>

      {showForm && (
        <Card className="h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-navy">{editing ? "Edit Post" : "New Post"}</h2>
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
            <Field label="Excerpt">
              {(id) => <textarea id={id} rows={2} className={inputClass} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />}
            </Field>
            <Field label="Content">
              {() => <RichTextEditor value={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} />}
            </Field>
            <Field label="SEO Title">
              {(id) => <input id={id} className={inputClass} value={form.seo_title} onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))} />}
            </Field>
            <Field label="SEO Description">
              {(id) => <textarea id={id} rows={2} className={inputClass} value={form.seo_description} onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))} />}
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
              Published
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <AdminButton onClick={save} disabled={pending || !form.title || !form.slug} className="w-full">
              {pending ? "Saving…" : "Save Post"}
            </AdminButton>
          </div>
        </Card>
      )}
    </div>
  );
}
