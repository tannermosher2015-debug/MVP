"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

/**
 * Detail-page photo slideshow: one large image (arrows, counter, click-to-enlarge)
 * with a thumbnail strip below, plus a fullscreen lightbox. Compact vertically so
 * the structured property info can sit beneath it.
 */
export default function ListingGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const n = photos.length;
  const [i, setI] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchX = useRef<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const wrap = (v: number) => ((v % n) + n) % n;
  const change = (d: number) => setI((v) => wrap(v + d));

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowRight") change(1);
      else if (e.key === "ArrowLeft") change(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, n]);

  useEffect(() => {
    const el = stripRef.current?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [i]);

  if (n === 0) return null;
  const many = n > 1;

  const sideBtn =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-ink opacity-0 transition-opacity duration-300 hover:bg-ivory focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-deep group-hover:opacity-100";

  return (
    <div>
      <div
        className="group relative aspect-[3/2] overflow-hidden rounded-2xl bg-espresso/5"
        onTouchStart={many ? (e) => { touchX.current = e.touches[0].clientX; } : undefined}
        onTouchEnd={
          many
            ? (e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 40) change(dx < 0 ? 1 : -1);
                touchX.current = null;
              }
            : undefined
        }
      >
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label={`Enlarge photo ${i + 1} of ${n}`}
          className="absolute inset-0 cursor-zoom-in"
        >
          <Image
            src={photos[i]}
            alt={`${alt} — photo ${i + 1} of ${n}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="graded object-cover"
          />
        </button>
        <span className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-[10px] tracking-luxe uppercase text-ivory">
          <Maximize2 className="h-3 w-3" aria-hidden /> Enlarge
        </span>
        {many && (
          <>
            <button type="button" aria-label="Previous photo" onClick={() => change(-1)} className={`left-3 ${sideBtn}`}>
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => change(1)} className={`right-3 ${sideBtn}`}>
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
            <span className="nums absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-ink/70 px-3 py-1 text-xs text-ivory">
              {i + 1} / {n}
            </span>
          </>
        )}
      </div>

      {many && (
        <div ref={stripRef} className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((src, d) => (
            <button
              key={src}
              type="button"
              onClick={() => setI(d)}
              aria-label={`Photo ${d + 1} of ${n}`}
              aria-current={d === i}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-deep ${
                d === i ? "ring-2 ring-bronze ring-offset-2 ring-offset-ivory" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="graded object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-espresso-deep/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setLightbox(false)}
        >
          <button type="button" className="absolute right-5 top-5 z-10 text-ivory/80 transition-colors hover:text-ivory" aria-label="Close" onClick={() => setLightbox(false)}>
            <X className="h-7 w-7" />
          </button>
          {many && (
            <button type="button" className="absolute left-3 z-10 text-ivory/80 transition-colors hover:text-ivory sm:left-6" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); change(-1); }}>
              <ChevronLeft className="h-9 w-9" />
            </button>
          )}
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={photos[i]} alt={`${alt} — photo ${i + 1} of ${n}`} fill sizes="100vw" className="object-contain" />
          </div>
          {many && (
            <button type="button" className="absolute right-3 z-10 text-ivory/80 transition-colors hover:text-ivory sm:right-6" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); change(1); }}>
              <ChevronRight className="h-9 w-9" />
            </button>
          )}
          <span className="nums absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-wide-2 text-ivory/70">
            {i + 1} / {n}
          </span>
        </div>
      )}
    </div>
  );
}
