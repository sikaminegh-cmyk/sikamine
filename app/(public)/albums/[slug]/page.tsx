import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/section";
import { AlbumGallery } from "@/components/public/album-gallery";
import { getAlbumBySlug } from "@/lib/data/blog";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getAlbumBySlug(slug);
  if (!result) return {};
  return {
    title: `${result.album.title} | Sikamine Gold Trading Ltd`,
    description: result.album.description || undefined,
  };
}

export default async function AlbumDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getAlbumBySlug(slug);
  if (!result) notFound();
  const { album, images } = result;

  return (
    <>
      <section className="bg-navy py-20 text-white lg:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/albums" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-orange">
            <ArrowLeft size={15} /> Back to Albums
          </Link>
          <h1 className="mt-6 font-heading text-3xl font-bold leading-tight sm:text-4xl">{album.title}</h1>
          {album.description && <p className="mt-5 text-lg text-white/75">{album.description}</p>}
        </div>
      </section>

      <Section background="light">
        {images.length === 0 ? (
          <p className="text-center text-sm text-text-grey">No photos in this album yet.</p>
        ) : (
          <AlbumGallery images={images} />
        )}
      </Section>
    </>
  );
}
