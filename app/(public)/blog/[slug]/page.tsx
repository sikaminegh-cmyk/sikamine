import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { getBlogPostBySlug } from "@/lib/data/blog";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seo_title || `${post.title} | Sikamine Gold Trading Ltd`,
    description: post.seo_description || post.excerpt || undefined,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <section className="bg-navy py-20 text-white lg:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-orange">
            <ArrowLeft size={15} /> Back to Blog
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-orange">{formatDate(post.published_at)}</p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>
          {post.excerpt && <p className="mt-5 text-lg text-white/75">{post.excerpt}</p>}
        </div>
      </section>

      <Section background="light">
        <div className="mx-auto max-w-3xl">
          {post.cover_image_url && (
            <div className="relative mb-10 h-64 w-full overflow-hidden rounded-2xl sm:h-96">
              <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" priority />
            </div>
          )}
          {post.content && <div className="rich-text" dangerouslySetInnerHTML={{ __html: post.content }} />}
        </div>
      </Section>
    </>
  );
}
