# MLS Listings Sync — Design Spec

**Date:** 2026-06-14
**Status:** Design approved; scrape feasibility validated by spike
**Repo:** `C:\Users\Tanne\MVP` (real-estate-on-molokai)

## Goal

Import all of Dayna Harris's **active** RAM / Maui-MLS listings (full details + all
photos) into her site as a **one-time, re-runnable** sync. Each listing gets its own
detail page with a photo gallery. Data + photos are committed to the repo and served
statically for reliability (no third-party dependency at request time).

## Current state

- `lib/listings.ts` has four source tiers: Paragon API → IDX Broker → RAM scrape
  (`LISTINGS_SOURCE=ram`) → curated 16 listings (default). The existing RAM scraper only
  reads page 1's static HTML — no pagination, one photo per listing, no detail pages.
- `/listings` shows cards filtered into condo-complex / Homes / Land categories
  (`categoryFor` / `areaFor`), each card linking **out** to RAM. No on-site detail pages.

## Scrape recipe (validated via spike)

Everything is reachable over plain HTTP — **no headless browser, no captcha** on the read
endpoints. Identifiers for Dayna: `personnelId=320830`, `brokerId=817050`,
`mlsSystemId=422`.

- **Listings (pagination):** `POST https://www.ramaui.com/Shared/Webservices/Core.asmx/GetAgentListings`,
  `Content-Type: application/json`, body
  `{"personnelId":320830,"brokerId":817050,"websiteId":0,"pageSize":5,"pageNumber":N,"transactionType":"Active"}`
  for `N = 1..6`. Returns `{"d":"<html cards>"}`. Each card yields: property `uid`
  (32-hex hash), address (line1 + `City, HI ZIP`), beds, baths, price, primary photo.
  (`GetSoldListings` exists for sold listings — out of scope for now.)
- **Photos (per listing):** `GET https://mlsimages.salecore.com/i/feed_20/Property/<uid>/<i>`
  for `i = 0,1,2,…`. The server **clamps past the last photo** (returns a repeated identical
  image), so stop when an image's bytes equal the previous index's, and cap at `MAX_PHOTOS`.
  Example listing had ~26 photos.
- **Remarks / sqft / MLS# / coords:** finalize during implementation. Candidates, in order
  to try: the embedded property JSON on the `/Search/...?sid=422-<uid>` detail page;
  `GetPropertyMarketingDetails(brokerId, mlsSystemId, uid)` (returned empty on first guess —
  needs correct arg types/session); `SearchProperties` / `MapSearch`. **Fallback (non-blocking):**
  use card-level data (address, beds, baths, price, type) + all photos, and link to RAM for
  the full text description.

## Components

1. **Scraper** — `scripts/sync-listings.mjs` (Node, run manually with `node`, not part of the
   live site):
   - Fetch pages 1–6 via `GetAgentListings`; parse cards → list of `{uid, address, city, zip,
     beds, baths, price}`.
   - For each `uid`: enumerate + download photos to `public/images/listings/<uid>/NN.jpg`,
     resized (~1280px wide, quality ~72) and capped at `MAX_PHOTOS` (~20).
   - Optionally fetch remarks/specs (see above).
   - Derive `type` (Home/Condo/Land) and `area` (reuse `areaFor`), build slug.
   - Write `lib/listings.generated.json`.
   - **Resilient:** per-listing try/catch; print a summary (listings / photos / failures);
     write to a temp file and swap in only if ≥1 listing parsed — never clobber good data with
     an empty run.
2. **Data layer** — `lib/listings.ts`:
   - Extend `Listing` with `photos: string[]`, `mlsNumber?: string`, `remarks?: string`.
   - `getListings()` loads `listings.generated.json` as the **primary** source (Paragon/IDX
     still win if configured; curated stays as final fallback).
   - Reuse `areaFor` / `categoryFor` so synced listings drop into the existing tabs
     automatically.
3. **Detail pages** — `app/listings/[slug]/page.tsx`, statically generated via
   `generateStaticParams()`:
   - `ListingGallery` client component — carousel/lightbox of all photos.
   - Full specs, remarks, status, MLS#, map, contact CTA; per-listing `generateMetadata`.
4. **Cards** — `ListingCard` links to internal `/listings/<slug>`; keep the small "View on MLS"
   link pointing at the RAM source.

## Data flow

RAM web-service + image host → `scripts/sync-listings.mjs` (offline) → photos +
`listings.generated.json` committed → Next.js SSG → `/listings` grid (cards → detail pages)
+ galleries.

## Data model

- `id` = `uid` (stable). `slug` = address-derived (e.g. `50-kepuhi-pl-202-maunaloa`) + short
  uid suffix to guarantee uniqueness.
- `photos`: array of repo-relative paths (`/images/listings/<uid>/NN.jpg`); `image` stays the
  primary (photos[0]) for cards.

## Photo storage

Self-host (download) for reliability. Control repo size via resize (~1280px, quality ~72) +
per-listing cap (~20). Estimate: ~30 listings × ≤20 photos ≈ ≤120 MB. If too heavy, move to
Vercel Blob (deferred, not now).

## Error handling

- Scraper: per-listing isolation; atomic write (temp → swap) gated on ≥1 parsed listing.
- Site: missing/empty generated file → fall back to curated; unknown detail slug → 404.

## Verification

Run scraper → confirm ~30 listings + photos downloaded; `tsc --noEmit` + `next build`; load
`/listings` (categories intact, cards → detail pages); load a detail page (gallery + specs);
spot-check several listings against RAM.

## Out of scope (now)

Sold listings; automated scheduled re-sync (possible follow-up); any other agent's listings.
