"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY } from "@/lib/gallery";

const N = GALLERY.length;
const wrap = (i: number) => ((i % N) + N) % N;
// Mosaic rhythm — a repeating pattern of "tall" tiles so the grid feels
// editorial rather than uniform. Works for any photo count.
const isTall = (i: number) => i % 6 === 0 || i % 6 === 4;

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") setOpen((v) => (v === null ? v : wrap(v + 1)));
      else if (e.key === "ArrowLeft") setOpen((v) => (v === null ? v : wrap(v - 1)));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const iconBtn =
    "flex items-center justify-center rounded-full bg-ivory/10 text-ivory backdrop-blur-sm transition-colors hover:bg-ivory/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ivory";

  return (
    <>
      <div className="grid grid-flow-row-dense auto-rows-[150px] grid-cols-2 gap-2.5 sm:auto-rows-[190px] sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {GALLERY.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open photo: ${p.alt}`}
            className={`group relative overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-deep ${
              isTall(i) ? "row-span-2" : ""
            }`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="graded object-cover transition-transform duration-[900ms] ease-luxe group-hover:scale-[1.06]"
            />
            <span
              className="absolute inset-0 bg-espresso/0 transition-colors duration-300 group-hover:bg-espresso/15"
              aria-hidden
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-espresso-deep/95 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            onClick={() => setOpen(null)}
          >
            <span className="absolute left-5 top-5 text-sm tracking-wide-2 text-ivory/60 nums">
              {open + 1} / {N}
            </span>
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close"
              className={`absolute right-4 top-4 z-10 h-11 w-11 ${iconBtn}`}
            >
              <X className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((v) => (v === null ? v : wrap(v - 1)));
              }}
              aria-label="Previous photo"
              className={`absolute left-2 z-10 h-12 w-12 sm:left-5 ${iconBtn}`}
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((v) => (v === null ? v : wrap(v + 1)));
              }}
              aria-label="Next photo"
              className={`absolute right-2 z-10 h-12 w-12 sm:right-5 ${iconBtn}`}
            >
              <ChevronRight className="h-7 w-7" />
            </button>

            <m.div
              key={open}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[80vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={GALLERY[open].src}
                alt={GALLERY[open].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </m.div>

            <p className="absolute inset-x-0 bottom-5 mx-auto max-w-2xl px-6 text-center text-sm text-ivory/70">
              {GALLERY[open].alt}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
