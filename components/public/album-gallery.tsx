"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { AlbumImageRow } from "@/lib/types/database";

export function AlbumGallery({ images }: { images: AlbumImageRow[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => setIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)), [images.length]);
  const next = useCallback(() => setIndex((i) => (i === null ? null : (i + 1) % images.length)), [images.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, close, prev, next]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, i) => (
          <button
            key={image.id}
            onClick={() => setIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-navy/5"
          >
            <Image
              src={image.image_url}
              alt={image.caption ?? ""}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {index !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 motion-safe:animate-[fadeUp_0.2s_ease-out]"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button onClick={close} aria-label="Close" className="absolute right-5 top-5 text-white/70 hover:text-white">
            <X size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white sm:left-6"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white sm:right-6"
          >
            <ChevronRight size={36} />
          </button>

          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image src={images[index].image_url} alt={images[index].caption ?? ""} fill className="object-contain" />
          </div>
          {images[index].caption && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-white/80">{images[index].caption}</p>
          )}
        </div>
      )}
    </>
  );
}
