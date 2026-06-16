# Listing card photo slideshow — design

Date: 2026-06-16

## Goal

Let visitors browse each listing's photos directly on the `/listings` grid, without
clicking into the detail page. Today every card shows a single static photo
(`listing.image`); each listing already carries its full photo set
(`listing.photos[]`, avg ~18, range 7–20). Turn the card's photo area into a
manual mini-carousel (arrows + dots/counter).

## Scope

- **In scope:** the listing **cards** rendered by `ListingCard` on the `/listings`
  grid (`ListingsGrid`).
- **Out of scope:** the detail pages (`/listings/[slug]`) — they already have the
  `ListingGallery` lightbox and keep it unchanged. No data/scraper changes. No
  autoplay. No new dependencies (hand-rolled, matching the existing `Gallery` /
  `ListingGallery` components).

## Behavior

- **Advance:** manual only. Prev/next arrows fade in on hover or keyboard focus
  (desktop); always tappable on touch. Horizontal swipe on touch devices.
- **Position indicator:** dots when a listing has ≤ 8 photos; a compact "4 / 18"
  counter pill when > 8 (avoids cramped dot rows).
- **Wrap-around:** next from the last photo goes to the first, and vice-versa.
- **Reduced motion:** `prefers-reduced-motion` → photo changes are instant (no
  slide/fade transition). (There is no autoplay to disable.)
- The rest of the card is unchanged (badges, price overlay, title, beds/baths,
  "View details").

## Architecture

Two pieces with clear boundaries:

1. **`components/ListingCardMedia.tsx`** (new, client component) — owns ONLY the
   photo area. Props: `{ photos: string[]; alt: string }`. Internal state: current
   index. Renders the current photo (plus a quietly-preloaded next), the prev/next
   `<button>`s, and the dots/counter. Exposes no behavior to the parent beyond
   rendering the media box. Depends on: `next/image` and `lucide-react` icons
   only. The photo change uses a CSS opacity transition (gated by
   `motion-reduce:transition-none`) — no motion library.

2. **`components/ListingCard.tsx`** (existing, stays a server component) —
   restructured from a single `<a>` wrapping everything into an `<article
   className="group relative …">`. The card-to-detail navigation becomes a
   **stretched link**: the title is a `<Link href={detail}>` whose `::after`
   (`after:absolute after:inset-0`) covers the whole card. This lets
   `ListingCardMedia`'s arrow/dot `<button>`s live as siblings with a higher
   `z-index` — they are **not nested inside the link** (valid + accessible), and
   clicking them changes the photo while clicking anywhere else opens the listing.

Data flow: `ListingsGrid` → `ListingCard listing={…}` → `ListingCardMedia
photos={listing.photos} alt={listing.imageAlt}`. `ListingCard` falls back to
`[listing.image]` if `photos` is empty.

## Performance

- Render only the current photo, plus the next index preloaded, per card. The grid
  therefore loads ~27 images on first paint (one per card), not ~480. Remaining
  photos load on demand as the user advances. `next/image` with appropriate
  `sizes` (same as today: `(max-width: 640px) 100vw, (max-width: 1024px) 50vw,
  33vw`). The first card MAY pass `priority` for LCP (optional, via a `priority`
  prop from the grid for index 0).

## Accessibility (WCAG 2.1 AA — non-negotiable)

- Prev/next and dot controls are real `<button>`s with `aria-label`
  ("Previous photo" / "Next photo" / "Go to photo N").
- Per-photo `alt`: `"{listing.imageAlt} — photo N of M"`.
- Keyboard: Left/Right arrow keys change the photo when a control inside the media
  box is focused; controls are `focus-visible` outlined.
- `prefers-reduced-motion`: instant photo change (no transition).
- The stretched detail link remains keyboard-reachable; controls are not nested in
  it (no invalid interactive nesting).

## Testing / acceptance criteria

- On `/listings`, each card shows arrows on hover/focus and a dots-or-counter
  indicator; advancing changes the photo and wraps at the ends.
- Clicking the photo or card body (not a control) navigates to the detail page
  client-side; clicking an arrow/dot does NOT navigate.
- Swipe advances on touch.
- Keyboard: tab to a card's arrow, press Right/Left to change photos; Enter on the
  card opens the listing.
- Network: loading the grid does not fetch every photo of every listing up front.
- `npx eslint app components lib` clean, `npx tsc --noEmit` clean, `npx next build`
  passes.

## Non-goals

- No autoplay, no hover-scrub, no thumbnails strip on the card.
- No change to the detail-page gallery.
- No change to how photos are synced/stored.
