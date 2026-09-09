import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, PageHeader, Pill } from "@/components/admin/ui";

export default async function AdminPagesListPage() {
  const supabase = await createClient();
  const { data: pages } = await supabase.from("pages").select("*, page_sections(count)").order("slug");

  return (
    <div>
      <PageHeader title="Pages" description="Edit the section-by-section content of every major page on the website." />
      <Card className="p-0">
        <ul className="divide-y divide-black/5">
          {(pages ?? []).map((page) => (
            <li key={page.id}>
              <Link href={`/admin/pages/${page.slug}`} className="flex items-center gap-4 p-4 hover:bg-bg-alt">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5 text-navy"><FileText size={18} /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy">{page.title}</p>
                  <p className="text-xs text-text-grey">/{page.slug === "home" ? "" : page.slug} · {(page as unknown as { page_sections: { count: number }[] }).page_sections?.[0]?.count ?? 0} sections</p>
                </div>
                <Pill tone={page.published ? "success" : "default"}>{page.published ? "Published" : "Draft"}</Pill>
                <ChevronRight size={18} className="text-text-grey" />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
