import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { PageSectionsEditor } from "@/components/admin/page-sections-editor";

export default async function AdminPageEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
  if (!page) notFound();

  const { data: sections } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", page.id)
    .order("position", { ascending: true });

  return (
    <div>
      <Link href="/admin/pages" className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-grey hover:text-navy">
        <ArrowLeft size={14} /> All Pages
      </Link>
      <PageHeader title={page.title} description={`/${slug === "home" ? "" : slug}`} />
      <PageSectionsEditor page={page} initialSections={sections ?? []} />
    </div>
  );
}
