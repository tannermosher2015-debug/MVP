"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ListingGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, photos.length]);

  if (photos.length === 0) return null;
  const go = (d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(i)}
            className={`group relative overflow-hidden rounded-xl ${i === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-[4/3]"}`}
            aria-label={`Open photo ${i + 1} of ${photos.length}`}
          >
            <Image
              src={src}
              alt={`${alt} — photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="graded object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-espresso-deep/95 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
        >
          <button type="button" className="absolute right-5 top-5 text-ivory/80 transition-colors hover:text-ivory" aria-label="Close" onClick={() => setOpen(null)}>
            <X className="h-7 w-7" />
          </button>
          <button type="button" className="absolute left-3 text-ivory/80 transition-colors hover:text-ivory sm:left-6" aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); go(-1); }}>
            <ChevronLeft className="h-9 w-9" />
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={photos[open]} alt={`${alt} — photo ${open + 1}`} fill sizes="100vw" className="object-contain" />
          </div>
          <button type="button" className="absolute right-3 text-ivory/80 transition-colors hover:text-ivory sm:right-6" aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); go(1); }}>
            <ChevronRight className="h-9 w-9" />
          </button>
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-wide-2 text-ivory/70">
            {open + 1} / {photos.length}
          </span>
        </div>
      )}
    </>
  );
}
