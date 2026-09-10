import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Newspaper } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/public/reveal";
import { Hero } from "@/components/public/sections/hero";
import { getBlogPosts } from "@/lib/data/blog";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata(
    "blog",
    "Blog | Sikamine Gold Trading Ltd",
    "News, insights and updates from Sikamine Gold Trading Ltd."
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <Hero
        compact
        section={{
          title: "Blog",
          subtitle: "News, insights and updates from Sikamine Gold Trading Ltd.",
          image_url: null,
          cta_label: null,
          cta_url: null,
          secondary_cta_label: null,
          secondary_cta_url: null,
        }}
      />

      <Section background="light">
        {posts.length === 0 ? (
          <p className="text-center text-sm text-text-grey">No articles published yet. Check back soon.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 80}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-orange/20 hover:shadow-xl"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-navy/5">
                    {post.cover_image_url ? (
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-navy/20">
                        <Newspaper size={40} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange">{formatDate(post.published_at)}</p>
                    <h2 className="mt-2 font-heading text-lg font-bold text-navy">{post.title}</h2>
                    {post.excerpt && <p className="mt-3 flex-1 text-sm leading-relaxed opacity-70">{post.excerpt}</p>}
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange">
                      Read More <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
