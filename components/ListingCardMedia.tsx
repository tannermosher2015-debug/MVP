"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

/**
 * Photo slideshow for a listing card: current photo + preloaded next, manual
 * prev/next arrows (hover/focus), swipe, keyboard, and a dots-or-counter
 * indicator. Listing-specific overlays (badges, price) come in as `children`.
 * Used inside ListingCard, whose stretched <Link> handles card navigation; the
 * controls here are buttons (z-20) that sit above that link and never navigate.
 */
export default function ListingCardMedia({
  photos,
  alt,
  children,
}: {
  photos: string[];
  alt: string;
  children?: React.ReactNode;
}) {
  const n = photos.length;
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);

  if (n === 0) return null;

  const wrap = (v: number) => ((v % n) + n) % n;
  const change = (delta: number) => setI((v) => wrap(v + delta));
  const arrow = (delta: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    change(delta);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      change(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      change(-1);
    }
  };
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) change(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const many = n > 1;
  const useDots = many && n <= 8;
  const dot =
    "transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-deep";
  const arrowBtn =
    "absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-ink opacity-0 transition-opacity duration-300 hover:bg-ivory focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-deep group-hover:opacity-100";

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden"
      onKeyDown={many ? onKey : undefined}
      onTouchStart={many ? onTouchStart : undefined}
      onTouchEnd={many ? onTouchEnd : undefined}
    >
      <Image
        src={photos[i]}
        alt={`${alt} — photo ${i + 1} of ${n}`}
        fill
        sizes={SIZES}
        className="graded object-cover transition-transform duration-[1.1s] ease-luxe group-hover:scale-[1.06]"
      />
      {many && (
        <Image
          src={photos[wrap(i + 1)]}
          alt=""
          aria-hidden
          fill
          sizes={SIZES}
          className="pointer-events-none invisible"
        />
      )}

      {children}

      {many && (
        <>
          <button type="button" aria-label="Previous photo" onClick={arrow(-1)} className={`left-2.5 ${arrowBtn}`}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button type="button" aria-label="Next photo" onClick={arrow(1)} className={`right-2.5 ${arrowBtn}`}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>

          {useDots ? (
            <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center gap-1.5">
              {photos.map((_, d) => (
                <button
                  key={d}
                  type="button"
                  aria-label={`Go to photo ${d + 1}`}
                  aria-current={d === i}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setI(d);
                  }}
                  className={`${dot} h-1.5 rounded-full ${d === i ? "w-4 bg-ivory" : "w-1.5 bg-ivory/60 hover:bg-ivory/80"}`}
                />
              ))}
            </div>
          ) : (
            <span className="nums absolute bottom-16 right-3 z-20 rounded-full bg-ink/75 px-2.5 py-0.5 text-[11px] text-ivory">
              {i + 1} / {n}
            </span>
          )}
        </>
      )}
    </div>
  );
}
