# Listing card photo slideshow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn each listing card on `/listings` into a manual photo slideshow (arrows + dots/counter) instead of a single static photo.

**Architecture:** A new client component `ListingCardMedia` owns the photo area (current photo, preloaded next, prev/next buttons, dots-or-counter, swipe, keyboard). `ListingCard` (stays a server component) is restructured from a single `<a>` into an `<article>` with a stretched `<Link>` on the title, so the media controls are sibling `<button>`s (not nested in the link). Listing-specific overlays (badges, price) pass into `ListingCardMedia` as children.

**Tech Stack:** Next.js App Router, next/image, lucide-react, Tailwind v4. No new deps. No React test runner in repo → verification is eslint + tsc + next build + browser.

**Spec:** `docs/superpowers/specs/2026-06-16-listing-card-slideshow-design.md`

## File structure

- Create: `components/ListingCardMedia.tsx` — client carousel for the card photo area.
- Modify: `components/ListingCard.tsx` — restructure to `<article>` + stretched link; render `ListingCardMedia`.
- No other files change. Data already present in `listing.photos[]` (+ `listing.image` fallback).

---

### Task 1: ListingCardMedia component

**Files:**
- Create: `components/ListingCardMedia.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

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
          sizes="1px"
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
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: exit 0 (component not yet imported anywhere — just type-checks).

---

### Task 2: Restructure ListingCard to use it

**Files:**
- Modify: `components/ListingCard.tsx` (replace entire file)

- [ ] **Step 1: Replace the file**

```tsx
import Link from "next/link";
import { BedDouble, Bath, Maximize, MapPin, Trees, ArrowUpRight } from "lucide-react";
import { type Listing, formatPrice, formatBaths, typeLabel } from "@/lib/listings";
import ListingCardMedia from "@/components/ListingCardMedia";

export default function ListingCard({ listing }: { listing: Listing }) {
  const hasBeds = listing.type !== "Land" && listing.type !== "Commercial";
  const href = `/listings/${listing.slug}`;
  const photos = listing.photos?.length ? listing.photos : [listing.image];
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(33,24,20,0.06)] ring-1 ring-ink/5 transition-all duration-500 ease-luxe hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(33,24,20,0.35)]">
      <ListingCardMedia photos={photos} alt={listing.imageAlt}>
        {/* gentle bottom scrim */}
        <div className="scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/2" aria-hidden />
        <span className="pointer-events-none absolute left-4 top-4 z-[1] rounded-full bg-ivory/95 px-3 py-1 text-[10px] tracking-luxe uppercase text-ink">
          {typeLabel(listing.type)}
        </span>
        <span className="pointer-events-none absolute right-4 top-4 z-[1] rounded-full bg-bronze/90 px-3 py-1 text-[10px] tracking-luxe uppercase text-ivory">
          {listing.status}
        </span>
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-[1] flex items-end justify-between">
          <p className="nums font-display text-2xl text-ivory drop-shadow">{formatPrice(listing.price)}</p>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory/95 text-ink transition-colors duration-300 group-hover:bg-gold">
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </ListingCardMedia>

      <div className="p-6">
        <h3 className="font-display text-xl text-ink">
          <Link
            href={href}
            aria-label={`${listing.title} — ${formatPrice(listing.price)}. View listing.`}
            className="transition-colors after:absolute after:inset-0 after:z-10 hover:text-bronze-deep focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-bronze-deep"
          >
            {listing.title}
          </Link>
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-taupe">
          <MapPin className="h-3.5 w-3.5 text-bronze" aria-hidden />
          {listing.city}, {listing.region}
        </p>

        <div className="mt-5 flex items-center gap-5 border-t border-ink/8 pt-4 text-sm text-cocoa">
          {hasBeds ? (
            <>
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 text-bronze" strokeWidth={1.5} aria-hidden />
                {listing.beds > 0 ? (
                  <>
                    <span className="nums">{listing.beds}</span>
                    <span className="text-taupe">bd</span>
                  </>
                ) : (
                  <span className="text-taupe">Studio</span>
                )}
              </span>
              <span className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-bronze" strokeWidth={1.5} aria-hidden />
                <span className="nums">{formatBaths(listing.baths)}</span>
                <span className="text-taupe">ba</span>
              </span>
            </>
          ) : (
            <span className="flex items-center gap-1.5">
              <Trees className="h-4 w-4 text-bronze" strokeWidth={1.5} aria-hidden />
              <span className="text-taupe">Vacant land</span>
            </span>
          )}
          {listing.sqft > 0 && (
            <span className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4 text-bronze" strokeWidth={1.5} aria-hidden />
              <span className="nums">{listing.sqft.toLocaleString()}</span>
              <span className="text-taupe">sq ft</span>
            </span>
          )}
        </div>

        <p className="mt-4 inline-flex items-center gap-1 text-[11px] tracking-wide-2 uppercase text-bronze-deep">
          View details
          <ArrowUpRight className="h-3 w-3" aria-hidden />
        </p>
      </div>
    </article>
  );
}
```

Notes on the z-index layering (why this works):
- Stretched link `::after` is `z-10`, covering the whole `relative` `<article>` → clicking the photo/card body opens the listing (client-side).
- Arrow + dot buttons are `z-20` (above the link overlay) → they change the photo and `stopPropagation`/`preventDefault` so they never navigate.
- Badges/scrim/price are `z-[1]` and `pointer-events-none` → purely visual; clicks pass through to the link.

- [ ] **Step 2: Type + lint + build**

Run: `npx tsc --noEmit` → exit 0
Run: `npx eslint app components lib` → exit 0
Run: `npx next build` → "✓ Compiled successfully", build exit 0

---

### Task 3: Verify in the browser

**Files:** none (verification only). Dev server: `molokai-dev` (port 3210).

- [ ] **Step 1:** Load `/listings`. Confirm each card shows arrows on hover and a dots-or-counter indicator; advancing changes the photo and wraps at the ends.
- [ ] **Step 2:** Click an arrow → photo changes, URL does NOT change. Click the photo/body → navigates to `/listings/<slug>` (client-side; a JS flag set before the click survives).
- [ ] **Step 3:** Confirm a card with ≤8 photos shows dots and one with >8 shows the "N / M" counter (most listings have ~18 → counter).
- [ ] **Step 4:** Network check: loading `/listings` fetches ~one photo per card up front, not every photo.
- [ ] **Step 5:** Console: no errors/warnings (beyond the pre-existing dev LCP hint).

- [ ] **Step 6: Commit + deploy**

```bash
git add components/ListingCardMedia.tsx components/ListingCard.tsx docs/superpowers
git commit -m "feat(listings): photo slideshow on listing cards"
git pull --rebase origin main
git push origin main
```

Then watch the live deploy for the change.

---

## Self-review

- **Spec coverage:** cards-only ✓ (Task 2); manual arrows + dots/counter ✓ (Task 1); ≤8 dots / >8 counter ✓; swipe ✓; keyboard ✓; reduced-motion → no autoplay (none exists) and image swap has no transition ✓; lazy current+next ✓ (Task 1); stretched link / no nested interactives ✓ (Task 2); per-photo alt ✓.
- **Placeholders:** none — full code in each step.
- **Type consistency:** `ListingCardMedia({ photos, alt, children })` defined Task 1, used Task 2 with the same props. `wrap`/`change`/`arrow` consistent within Task 1.
