import Link from "next/link";
import Image from "next/image";
import { Images } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/public/reveal";
import { Hero } from "@/components/public/sections/hero";
import { getAlbums } from "@/lib/data/blog";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata(
    "albums",
    "Photo Albums | Sikamine Gold Trading Ltd",
    "Photo albums and galleries from Sikamine Gold Trading Ltd."
  );
}

export default async function AlbumsPage() {
  const albums = await getAlbums();

  return (
    <>
      <Hero
        compact
        section={{
          title: "Photo Albums",
          subtitle: "A look at Sikamine's operations, partnerships and people.",
          image_url: null,
          cta_label: null,
          cta_url: null,
          secondary_cta_label: null,
          secondary_cta_url: null,
        }}
      />

      <Section background="light">
        {albums.length === 0 ? (
          <p className="text-center text-sm text-text-grey">No albums published yet. Check back soon.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album, i) => (
              <Reveal key={album.id} delay={i * 80}>
                <Link
                  href={`/albums/${album.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-orange/20 hover:shadow-xl"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-navy/5">
                    {album.cover_image_url ? (
                      <Image
                        src={album.cover_image_url}
                        alt={album.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-navy/20">
                        <Images size={40} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-heading text-lg font-bold text-navy">{album.title}</h2>
                    {album.description && <p className="mt-3 flex-1 text-sm leading-relaxed opacity-70">{album.description}</p>}
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
