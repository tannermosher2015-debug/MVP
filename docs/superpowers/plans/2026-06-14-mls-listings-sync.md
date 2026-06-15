# MLS Listings Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import all of Dayna Harris's active RAM/MLS listings (full data + all photos) into the site via a re-runnable Node script, served as static data with per-listing detail pages and photo galleries.

**Architecture:** An offline Node script (`scripts/sync-listings.mjs`) calls SaleCORE's `GetAgentListings` web-service for pages 1–6, enumerates each property's photos from the `mlsimages.salecore.com/.../Property/<uid>/<i>` path index, resizes/downloads them into `public/images/listings/<uid>/`, and writes `lib/listings.generated.json`. The Next.js app loads that JSON as its primary listings source, renders the existing grid (cards now link inward), and adds a statically-generated `/listings/[slug]` detail page with a gallery.

**Tech Stack:** Node 20 (built-in `fetch`), `sharp` (already present via Next) for image resize, Next.js 16 App Router (SSG), TypeScript, Tailwind v4.

---

## Validated scrape constants (from spike)

- Endpoint: `POST https://www.ramaui.com/Shared/Webservices/Core.asmx/GetAgentListings`, header `Content-Type: application/json; charset=utf-8`, body `{"personnelId":320830,"brokerId":817050,"websiteId":0,"pageSize":5,"pageNumber":N,"transactionType":"Active"}`, returns `{"d":"<html>"}`.
- Card HTML shape (one per `active-sold-listing-item`):
  `<a href="/Search/...?sid=422-<uid>"><img src="https://mlsimages.salecore.com/i/feed_20/Property/<uid>" alt="..."/><p>50 Kepuhi Pl 202<br />Maunaloa, HI 96770</p></a>` then `<div ...>2 Beds, 2 Baths</div>` and `<div ...>$239,000</div>`. `<uid>` = 32 hex chars.
- Photo URL: `https://mlsimages.salecore.com/i/feed_20/Property/<uid>/<i>` (i=0,1,2…). Server clamps past the last photo (repeats identical bytes) — stop when an image's md5 equals the previous index's. Cap `MAX_PHOTOS = 20`.

---

## File structure

- Create `scripts/sync-listings.mjs` — the scraper (run manually).
- Create `scripts/lib/ram.mjs` — pure parse/transform helpers (testable without network).
- Create `scripts/lib/ram.test.mjs` — node:test unit tests for the parser (uses saved fixture).
- Create `scripts/fixtures/agent-page-1.json` — a saved `GetAgentListings` response for tests.
- Create `lib/listings.generated.json` — scraper output (committed).
- Modify `lib/listings.ts` — extend `Listing`, load generated JSON, add `getListingBySlug`.
- Create `app/listings/[slug]/page.tsx` — detail page (SSG).
- Create `components/ListingGallery.tsx` — client gallery/lightbox.
- Modify `components/ListingCard.tsx` — link to internal detail page.
- Create `public/images/listings/<uid>/NN.jpg` — downloaded photos (scraper output).

---

## Task 1: Parser helpers + fixture (pure, testable)

**Files:**
- Create: `scripts/lib/ram.mjs`
- Create: `scripts/fixtures/agent-page-1.json`
- Test: `scripts/lib/ram.test.mjs`

- [ ] **Step 1: Capture a real fixture**

Run (saves page 1 response for tests):
```bash
cd /c/Users/Tanne/MVP
node -e 'const b={personnelId:320830,brokerId:817050,websiteId:0,pageSize:5,pageNumber:1,transactionType:"Active"};fetch("https://www.ramaui.com/Shared/Webservices/Core.asmx/GetAgentListings",{method:"POST",headers:{"Content-Type":"application/json; charset=utf-8","Referer":"https://www.ramaui.com/Real-Estate-Agent/320830/Dayna-Harris"},body:JSON.stringify(b)}).then(r=>r.text()).then(t=>require("fs").writeFileSync("scripts/fixtures/agent-page-1.json",t))'
```
Expected: `scripts/fixtures/agent-page-1.json` exists, contains `{"d":"...active-sold-listing-item..."}`.

- [ ] **Step 2: Write the failing parser test**

```js
// scripts/lib/ram.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseCards } from "./ram.mjs";

test("parseCards extracts listings from a GetAgentListings response", () => {
  const raw = readFileSync(new URL("../fixtures/agent-page-1.json", import.meta.url), "utf8");
  const html = JSON.parse(raw).d;
  const cards = parseCards(html);
  assert.ok(cards.length >= 1, "should find at least one card");
  const c = cards[0];
  assert.match(c.uid, /^[a-f0-9]{32}$/);
  assert.ok(c.address.length > 3);
  assert.ok(c.city.length > 2);
  assert.match(c.region, /^[A-Z]{2}$/);
  assert.ok(Number.isInteger(c.beds));
  assert.ok(c.price > 0);
});
```

- [ ] **Step 3: Run test, verify it fails**

Run: `node --test scripts/lib/`
Expected: FAIL ("Cannot find module './ram.mjs'" or parseCards undefined).

- [ ] **Step 4: Implement the parser**

```js
// scripts/lib/ram.mjs
const HEX32 = /Property\/([a-f0-9]{32})/i;

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ");
}

/** Split a GetAgentListings HTML payload into structured cards. */
export function parseCards(html) {
  const blocks = html.split("active-sold-listing-item").slice(1);
  const out = [];
  for (const b of blocks) {
    const uidM = b.match(HEX32);
    if (!uidM) continue;
    const uid = uidM[1].toLowerCase();
    const pM = b.match(/<p>([\s\S]*?)<\/p>/);
    const addrRaw = pM ? decodeEntities(pM[1]).replace(/<br\s*\/?>/gi, "|").replace(/\s+/g, " ").trim() : "";
    const [line1 = "", line2 = ""] = addrRaw.split("|").map((s) => s.trim());
    const locM = line2.match(/^(.*),\s*([A-Za-z]{2})\s*(\d{5})/);
    const city = locM ? locM[1].trim() : "Molokaʻi";
    const region = locM ? locM[2].toUpperCase() : "HI";
    const postal = locM ? locM[3] : "";
    const bbM = b.match(/(\d+)\s*Beds?,\s*([\d.]+)\s*Baths?/i);
    const beds = bbM ? parseInt(bbM[1], 10) : 0;
    const baths = bbM ? parseFloat(bbM[2]) : 0;
    const priceM = b.match(/\$[\d,]+/);
    const price = priceM ? parseInt(priceM[0].replace(/[^\d]/g, ""), 10) : 0;
    out.push({ uid, address: line1, city, region, postal, beds, baths, price });
  }
  // de-dupe by uid (cards can repeat across active/sold blocks)
  const seen = new Set();
  return out.filter((c) => (seen.has(c.uid) ? false : (seen.add(c.uid), true)));
}
```

- [ ] **Step 5: Run test, verify it passes**

Run: `node --test scripts/lib/`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/ram.mjs scripts/lib/ram.test.mjs scripts/fixtures/agent-page-1.json
git commit -m "feat(sync): RAM card parser + fixture test"
```

---

## Task 2: Photo enumeration + download/resize helper

**Files:**
- Modify: `scripts/lib/ram.mjs` (add `photoUrl`, `isEndOfGallery`)
- Test: `scripts/lib/ram.test.mjs` (add cases)

- [ ] **Step 1: Add failing tests**

```js
// append to scripts/lib/ram.test.mjs
import { photoUrl } from "./ram.mjs";
test("photoUrl builds the indexed image URL", () => {
  assert.equal(
    photoUrl("017d78e6c5843669bbccc96e56d3da89", 3),
    "https://mlsimages.salecore.com/i/feed_20/Property/017d78e6c5843669bbccc96e56d3da89/3"
  );
});
```

- [ ] **Step 2: Run, verify fail** — Run: `node --test scripts/lib/` → FAIL (photoUrl undefined).

- [ ] **Step 3: Implement**

```js
// add to scripts/lib/ram.mjs
export function photoUrl(uid, i) {
  return `https://mlsimages.salecore.com/i/feed_20/Property/${uid}/${i}`;
}
```

- [ ] **Step 4: Run, verify pass** — Run: `node --test scripts/lib/` → PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/ram.mjs scripts/lib/ram.test.mjs
git commit -m "feat(sync): photoUrl helper"
```

---

## Task 3: Detail-data resolver (live investigation, with fallback)

**Files:**
- Modify: `scripts/lib/ram.mjs` (add `fetchDetail`)

> The detail fields (remarks, sqft, MLS#, lat/lng, status) come from the
> `/Search/...?sid=422-<uid>` page's embedded property JSON. Confirm its shape live,
> then parse it. If unavailable, return `{}` and the caller uses card data.

- [ ] **Step 1: Investigate the detail page JSON**

Run (inspect for an embedded property object containing the uid):
```bash
node -e 'const uid="017d78e6c5843669bbccc96e56d3da89";fetch(`https://www.ramaui.com/Search/x?sid=422-${uid}`,{headers:{"User-Agent":"Mozilla/5.0"}}).then(r=>r.text()).then(t=>{const i=t.indexOf("\"Uid\":\""+uid);console.log(t.slice(Math.max(0,i-600),i+1200))})'
```
Expected: a JSON-ish block with fields like `SystemId`, `Uid`, and ideally `Remarks`/`SqFt`/`MlsNumber`/`Latitude`/`Longitude`/`Status`. Note the exact key names.

- [ ] **Step 2: Implement `fetchDetail` using the keys found**

```js
// add to scripts/lib/ram.mjs
const SYS = 422;
/** Best-effort: pull remarks/sqft/mls#/coords from the detail page. Never throws. */
export async function fetchDetail(uid) {
  try {
    const res = await fetch(`https://www.ramaui.com/Search/x?sid=${SYS}-${uid}`, {
      headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.ramaui.com/" },
    });
    const html = await res.text();
    const pick = (re) => { const m = html.match(re); return m ? decodeEntities(m[1]).trim() : undefined; };
    return {
      remarks: pick(/"(?:Remarks|PublicRemarks|Description)"\s*:\s*"([^"]{10,})"/i),
      sqft: Number(pick(/"(?:SqFt|SquareFeet|LivingArea)"\s*:\s*"?(\d[\d,]*)"?/i)?.replace(/,/g, "")) || 0,
      mlsNumber: pick(/"(?:MlsNumber|ListingId|MLSNumber)"\s*:\s*"?([A-Za-z0-9-]+)"?/i),
      lat: Number(pick(/"Latitude"\s*:\s*"?(-?\d+\.\d+)"?/i)) || undefined,
      lng: Number(pick(/"Longitude"\s*:\s*"?(-?\d+\.\d+)"?/i)) || undefined,
      status: pick(/"(?:Status|StandardStatus)"\s*:\s*"([^"]+)"/i),
    };
  } catch { return {}; }
}
```
> If Step 1 shows different key names, update the regexes to match before continuing.

- [ ] **Step 3: Smoke test** — Run: `node -e 'import("./scripts/lib/ram.mjs").then(m=>m.fetchDetail("017d78e6c5843669bbccc96e56d3da89")).then(console.log)'`
Expected: an object; ideally `remarks` populated. Empty `{}` is acceptable (fallback path).

- [ ] **Step 4: Commit**

```bash
git add scripts/lib/ram.mjs
git commit -m "feat(sync): best-effort detail-page field extraction"
```

---

## Task 4: The sync script (fetch all pages, download photos, write JSON)

**Files:**
- Create: `scripts/sync-listings.mjs`

- [ ] **Step 1: Implement the orchestrator**

```js
// scripts/sync-listings.mjs
import { mkdir, writeFile, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { parseCards, photoUrl, fetchDetail } from "./lib/ram.mjs";
import { areaFor } from "../lib/listings-area.mjs"; // see Task 5

const PERSONNEL = 320830, BROKER = 817050, PAGES = 6, MAX_PHOTOS = 20;
const REF = "https://www.ramaui.com/Real-Estate-Agent/320830/Dayna-Harris";
const ENDPOINT = "https://www.ramaui.com/Shared/Webservices/Core.asmx/GetAgentListings";

async function getPage(n) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8", Referer: REF, "User-Agent": "Mozilla/5.0" },
    body: JSON.stringify({ personnelId: PERSONNEL, brokerId: BROKER, websiteId: 0, pageSize: 5, pageNumber: n, transactionType: "Active" }),
  });
  return JSON.parse(await res.text()).d || "";
}

async function downloadPhotos(uid) {
  const dir = `public/images/listings/${uid}`;
  await mkdir(dir, { recursive: true });
  const paths = [];
  let prevHash = "";
  for (let i = 0; i < MAX_PHOTOS; i++) {
    const r = await fetch(photoUrl(uid, i), { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) break;
    const buf = Buffer.from(await r.arrayBuffer());
    const hash = createHash("md5").update(buf).digest("hex");
    if (hash === prevHash) break; // clamp = end of gallery
    prevHash = hash;
    const name = String(i).padStart(2, "0") + ".jpg";
    await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).jpeg({ quality: 72 }).toFile(`${dir}/${name}`);
    paths.push(`/images/listings/${uid}/${name}`);
  }
  return paths;
}

function slugify(address, city, uid) {
  const base = `${address} ${city}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${base}-${uid.slice(0, 6)}`;
}

function typeFor(card, photos) {
  if (card.beds === 0 && card.baths === 0) return "Land";
  if (/kepuhi|ke nani|wavecrest|paniolo|molokai shores|1000 kamehameha|1300 kam/i.test(`${card.address} ${card.city}`)) return "Condo";
  return "Home";
}

async function main() {
  const cards = [];
  for (let n = 1; n <= PAGES; n++) {
    try { cards.push(...parseCards(await getPage(n))); }
    catch (e) { console.error(`page ${n} failed:`, e.message); }
  }
  const seen = new Set();
  const unique = cards.filter((c) => (seen.has(c.uid) ? false : (seen.add(c.uid), true)));
  console.log(`Parsed ${unique.length} unique listings`);

  const listings = [];
  let photoTotal = 0;
  for (const c of unique) {
    try {
      const photos = await downloadPhotos(c.uid);
      const d = await fetchDetail(c.uid);
      const type = typeFor(c, photos);
      const area = areaFor(c.address, c.city);
      photoTotal += photos.length;
      listings.push({
        id: c.uid,
        slug: slugify(c.address, c.city, c.uid),
        title: c.address,
        address: c.address, city: c.city, region: c.region, postal: c.postal,
        price: c.price, beds: c.beds, baths: c.baths, sqft: d.sqft || 0,
        type, status: d.status === "Pending" ? "Pending" : "For Sale",
        image: photos[0] || "/images/molokai-bay.jpg",
        photos,
        imageAlt: `${c.address}, ${c.city}, Molokaʻi`,
        description: d.remarks || "",
        remarks: d.remarks, mlsNumber: d.mlsNumber,
        ramUrl: `https://www.ramaui.com/Search/${encodeURIComponent(`${c.address} ${c.city} HI ${c.postal}`).replace(/%20/g, "+")}?sid=422-${c.uid}`,
        area, lat: d.lat ?? 21.13, lng: d.lng ?? -157.02,
      });
      console.log(`  ${c.address} — ${photos.length} photos`);
    } catch (e) { console.error(`  skip ${c.uid}:`, e.message); }
  }

  if (listings.length === 0) { console.error("No listings parsed — refusing to overwrite generated data."); process.exit(1); }
  const tmp = "lib/listings.generated.json.tmp";
  await writeFile(tmp, JSON.stringify(listings, null, 2));
  await rm("lib/listings.generated.json", { force: true });
  await (await import("node:fs/promises")).rename(tmp, "lib/listings.generated.json");
  console.log(`\nDone: ${listings.length} listings, ${photoTotal} photos.`);
}
main();
```

- [ ] **Step 2: Run the sync**

Run: `node scripts/sync-listings.mjs`
Expected: logs ~30 listings each with a photo count; ends "Done: N listings, M photos." `lib/listings.generated.json` written; `public/images/listings/<uid>/` populated.

- [ ] **Step 3: Sanity-check output**

Run: `node -e 'const a=require("./lib/listings.generated.json");console.log(a.length,"listings; photos:",a.map(x=>x.photos.length).join(","))'`
Run: `du -sh public/images/listings`
Expected: ~30 listings; total image dir is a sane size (< ~150 MB). If larger, lower `MAX_PHOTOS` and re-run.

- [ ] **Step 4: Commit**

```bash
git add scripts/sync-listings.mjs lib/listings.generated.json public/images/listings
git commit -m "feat(sync): sync script + first import of live listings"
```

---

## Task 5: Data layer — types, area helper, source wiring, slug lookup

**Files:**
- Create: `lib/listings-area.mjs` (shared `areaFor` for the script — mirror of the TS one)
- Modify: `lib/listings.ts`

- [ ] **Step 1: Extract `areaFor` for the script**

Create `lib/listings-area.mjs` with the SAME logic as `areaFor` in `lib/listings.ts` (copy the function body verbatim, `export function areaFor(address, city) {...}`). This lets the `.mjs` script and the TS app agree on area labels.

- [ ] **Step 2: Extend the `Listing` type**

In `lib/listings.ts`, add to the `Listing` interface:
```ts
  photos: string[];
  mlsNumber?: string;
  remarks?: string;
```

- [ ] **Step 3: Load the generated data as primary source**

At the top of `lib/listings.ts`:
```ts
import generated from "./listings.generated.json";
```
In `getListings()`, immediately before the final `return STATIC_LISTINGS;`:
```ts
  const gen = generated as unknown as Listing[];
  if (Array.isArray(gen) && gen.length > 0) return gen;
```
Ensure `tsconfig.json` has `"resolveJsonModule": true` (Next defaults to true; verify).

- [ ] **Step 4: Add slug lookup**

Append to `lib/listings.ts`:
```ts
export async function getListingBySlug(slug: string): Promise<Listing | undefined> {
  return (await getListings()).find((l) => l.slug === slug);
}
```

- [ ] **Step 5: Backfill `photos` on curated fallback** — give each `CURATED_LISTINGS` item `photos: []` is unnecessary; instead make `photos` optional-safe in consumers, OR map in `curated()`: add `photos: [\`/images/listing-${id}.jpg\`]` to the returned object. Do the latter (one line in the `curated()` return).

- [ ] **Step 6: Verify types** — Run: `npx tsc --noEmit` → exit 0.

- [ ] **Step 7: Commit**

```bash
git add lib/listings.ts lib/listings-area.mjs
git commit -m "feat(listings): load synced data as primary source + slug lookup"
```

---

## Task 6: ListingGallery component

**Files:**
- Create: `components/ListingGallery.tsx`

- [ ] **Step 1: Implement**

```tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ListingGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [open, setOpen] = useState<number | null>(null);
  if (photos.length === 0) return null;
  const go = (d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length));
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((src, i) => (
          <button key={src} type="button" onClick={() => setOpen(i)}
            className={`relative overflow-hidden rounded-xl ${i === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-[4/3]"}`}>
            <Image src={src} alt={`${alt} — photo ${i + 1}`} fill sizes="(max-width:640px) 50vw, 33vw"
              className="graded object-cover transition-transform duration-500 hover:scale-105" />
          </button>
        ))}
      </div>
      {open !== null && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-espresso-deep/95 p-4" onClick={() => setOpen(null)}>
          <button type="button" className="absolute right-5 top-5 text-ivory/80 hover:text-ivory" aria-label="Close"><X /></button>
          <button type="button" className="absolute left-4 text-ivory/80 hover:text-ivory" aria-label="Previous"
            onClick={(e) => { e.stopPropagation(); go(-1); }}><ChevronLeft className="h-8 w-8" /></button>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={photos[open]} alt={`${alt} — photo ${open + 1}`} fill sizes="100vw" className="object-contain" />
          </div>
          <button type="button" className="absolute right-4 text-ivory/80 hover:text-ivory" aria-label="Next"
            onClick={(e) => { e.stopPropagation(); go(1); }}><ChevronRight className="h-8 w-8" /></button>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify types** — Run: `npx tsc --noEmit` → exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/ListingGallery.tsx
git commit -m "feat(listings): photo gallery + lightbox component"
```

---

## Task 7: Detail route `/listings/[slug]`

**Files:**
- Create: `app/listings/[slug]/page.tsx`

- [ ] **Step 1: Implement**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ListingGallery from "@/components/ListingGallery";
import { getListings, getListingBySlug, formatPrice, formatBaths } from "@/lib/listings";

export async function generateStaticParams() {
  return (await getListings()).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = await getListingBySlug(slug);
  if (!l) return { title: "Listing" };
  return { title: `${l.title} — ${formatPrice(l.price)}`, description: l.remarks?.slice(0, 160) ?? l.imageAlt, alternates: { canonical: `/listings/${slug}` } };
}

export default async function ListingDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = await getListingBySlug(slug);
  if (!l) notFound();
  return (
    <>
      <Nav solid />
      <main className="pt-20">
        <section className="bg-ivory py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <a href="/listings" className="text-sm tracking-wide-2 uppercase text-bronze-deep hover:underline">&larr; All listings</a>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-display-sm text-ink">{l.title}</h1>
                <p className="mt-1 text-taupe">{l.city}, {l.region} {l.postal}</p>
              </div>
              <p className="nums font-display text-3xl text-bronze-deep">{formatPrice(l.price)}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-5 text-sm text-cocoa">
              {l.beds > 0 && <span className="nums">{l.beds} bd</span>}
              {l.baths > 0 && <span className="nums">{formatBaths(l.baths)} ba</span>}
              {l.sqft > 0 && <span className="nums">{l.sqft.toLocaleString()} sq ft</span>}
              <span>{l.type}</span>{l.mlsNumber && <span className="nums">MLS #{l.mlsNumber}</span>}
            </div>
            <div className="mt-8"><ListingGallery photos={l.photos} alt={l.imageAlt} /></div>
            {l.remarks && <p className="measure mt-10 text-lg leading-relaxed text-cocoa">{l.remarks}</p>}
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/#contact" className="rounded-full bg-ink px-8 py-4 text-xs tracking-luxe uppercase text-ivory hover:bg-bronze">Ask about this listing</a>
              {l.ramUrl && <a href={l.ramUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink/30 px-8 py-4 text-xs tracking-luxe uppercase text-ink hover:border-bronze">View on MLS</a>}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify build of the route** — Run: `npx tsc --noEmit` → exit 0.

- [ ] **Step 3: Commit**

```bash
git add app/listings/[slug]/page.tsx
git commit -m "feat(listings): per-listing detail page with gallery"
```

---

## Task 8: Point cards at the internal detail page

**Files:**
- Modify: `components/ListingCard.tsx`

- [ ] **Step 1: Change the card link**

In `components/ListingCard.tsx`, replace:
```tsx
  const href = listing.ramUrl ?? "#contact";
  const external = Boolean(listing.ramUrl);
```
with:
```tsx
  const href = `/listings/${listing.slug}`;
  const external = false;
```
Keep the existing "View MLS" `<p>` (it stays as a label; the whole card now routes to the internal page). The detail page itself provides the "View on MLS" outbound link.

- [ ] **Step 2: Verify** — Run: `npx tsc --noEmit` → exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/ListingCard.tsx
git commit -m "feat(listings): cards link to on-site detail pages"
```

---

## Task 9: Full build + preview verification

- [ ] **Step 1: Production build** — Run: `npx next build`
Expected: succeeds; output shows `/listings/[slug]` generated as static for ~30 slugs.

- [ ] **Step 2: Preview check** — Start `molokai-dev` preview; load `/listings`:
  - All ~30 listings show; category tabs (Ke Nani Kai / Molokai Shores / … / Homes / Land) still filter correctly.
  - A card click opens an on-site `/listings/<slug>` page with the photo gallery + specs; lightbox opens/navigates; "View on MLS" works.
  - No console/server errors.

- [ ] **Step 3: Spot-check accuracy** — Compare 3 listings (price, beds/baths, photo count) against their RAM pages.

- [ ] **Step 4: Commit any fixes, then push** — After user OK to deploy:
```bash
git push origin main
```
Then confirm the new listings + a detail page are live.

---

## Self-review notes

- **Spec coverage:** scrape recipe → Tasks 1–4; data model (`photos`/`mlsNumber`/`remarks`) → Task 5; detail pages + gallery → Tasks 6–7; cards → Task 8; storage cap/resize → Task 4; verification → Task 9. Remarks "finalize during implementation" → Task 3 (with fallback). All covered.
- **Repo size risk:** Task 4 Step 3 measures it and says to lower `MAX_PHOTOS` if needed; Vercel Blob remains the escape hatch (out of scope unless triggered).
- **Type consistency:** `Listing` gains `photos`/`mlsNumber`/`remarks` (Task 5) used by Tasks 6–8; `getListingBySlug` (Task 5) used by Task 7; `parseCards`/`photoUrl`/`fetchDetail` (Tasks 1–3) used by Task 4.
