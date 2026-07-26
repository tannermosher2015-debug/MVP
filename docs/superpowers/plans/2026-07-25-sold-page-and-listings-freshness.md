# Recently-Sold page + listings freshness — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. A push to `main` auto-deploys to Vercel (push = publish): verify locally, do NOT push without Tanner's OK.

**Goal:** Two related aims from the SEO backlog. (A) Ship a real, indexable `/sold` page so the team's track record ranks for "Molokai recently sold / sold homes" searches instead of living only in a homepage strip and on Zillow. (B) Decide and (if approved) build listings *freshness* so the for-sale listings stay current on their own instead of a manual re-run.

**Scope split:** Part A (`/sold` page) is small, unblocked, and low-risk. Build it now. Part B (freshness) is a heavier, separate commitment with one real decision to make first. It is presented as a costed recommendation with a go/no-go gate, not auto-built.

**Architecture:** `/sold` is its own static route `app/sold/page.tsx` sourced from the existing static snapshot `lib/sold.ts` (`SOLD_LISTINGS`), reusing the visual pattern of the landing pages (`app/[slug]/page.tsx`: `Nav solid` + hero + grid + `LandingLinks`) and the sold-card styling already used by the homepage `RecentlySold` section. It does NOT go through `app/[slug]/page.tsx` (that route filters *live* for-sale listings by predicate; sold data is a different shape with sold price, date, and represented side). SEO: `BreadcrumbList` JSON-LD only. There is no honest schema.org type for a "sold" property, so none is invented (consistent with the existing `RecentlySold` decision and [[build-no-invented-facts]]).

**Tech Stack:** Next.js App Router, next/image, Tailwind v4, lucide-react. No new deps. No React test runner in repo, so verification is `eslint` + `tsc`/`next build` + a live-DOM Playwright pass. Sold photos already exist and are committed at `public/images/sold/*.jpg`.

---

## File structure

**Part A (build now):**
- Create: `app/sold/page.tsx` — the indexable Recently-Sold page.
- Create (if not already extractable): `components/SoldCard.tsx` — one sold-listing card, reused by both `/sold` and the homepage `RecentlySold` section. First check `components/RecentlySold.tsx`: if the card markup is inline there, extract it into `SoldCard` and use it in both places; if a card component already exists, reuse it as-is.
- Modify: `app/sitemap.ts` — add `/sold` to `ROUTES`.
- Modify: `components/RecentlySold.tsx` — point the section CTA at the new on-site `/sold` page ("See all recently sold"); keep the Zillow profile link as the secondary "verify on Zillow" CTA.
- Modify: `components/LandingLinks.tsx` — add a `/sold` entry so every landing page and `/listings` internally links to it (internal links are the ranking assist).
- Modify: `components/Footer.tsx` — add a "Recently Sold" footer link.
- Optional (Tanner's call): `components/Nav.tsx` — add "Sold" to the main nav. Nav space is precious; footer + section + LandingLinks may be enough.

**Part B (decision-gated, not built yet):**
- Create: `.github/workflows/sync-listings.yml` — scheduled RAM re-sync.
- Possibly modify: `scripts/sync-listings.mjs` + `lib/listings.ts` — switch listing photos to remote SaleCORE URLs (see Part B).

---

### Task 1: SoldCard component (reuse or extract)

**Files:**
- Read: `components/RecentlySold.tsx`
- Create (only if the card is inline today): `components/SoldCard.tsx`

- [ ] **Step 1:** Open `RecentlySold.tsx`. If it maps `SOLD_LISTINGS` to inline card JSX, lift one card into `components/SoldCard.tsx` taking `{ listing: SoldListing }`. Preserve the existing look (aspect-4/3 photo with the `.graded` warm grade, sold-price overlay, address, town, `formatSoldDate`, and the "Represented Buyer/Seller/Buyer & Seller" badge). Render beds/baths/sqft **only when > 0** and `type` only when present (the data uses 0 / omitted to mean "Zillow published nothing" — do not print "0 bd").
- [ ] **Step 2:** Re-point `RecentlySold.tsx` to render `<SoldCard>` so the homepage and `/sold` stay visually identical and cannot drift.
- [ ] **Verify:** homepage still renders the sold strip unchanged (`npm run dev`, eyeball + Playwright: 9 cards, images load).

---

### Task 2: The `/sold` page

**Files:**
- Create: `app/sold/page.tsx`

- [ ] **Step 1: Metadata.** `generateMetadata` returns:
  - `title: "Recently Sold on Molokaʻi"` (template appends the site name, giving "Recently Sold on Molokaʻi | Real Estate on Molokai").
  - `description`: real and specific, e.g. "Recently sold homes, condos and land on Molokaʻi, represented by the Molokai Vacation Properties team. See closed sales from $70,000 to $999,000 across Kaunakakai and the West End." (Derive the range from `SOLD_PRICE_RANGE`; do not hardcode if it can drift.)
  - `alternates: { canonical: "/sold" }`.
- [ ] **Step 2: Structure** (mirror `app/[slug]/page.tsx`): `BreadcrumbList` JSON-LD (Home -> Recently Sold), `<Nav solid />`, `<main id="main-content" className="pt-20">`, a hero section (eyebrow "Recently sold", H1 "Recently Sold on Molokaʻi", a real intro paragraph, a fitting existing `/public/images` hero), then a grid of `<SoldCard>` over `SOLD_LISTINGS` sorted by `soldDate` descending, then `<LandingLinks exclude="sold" heading="Browse Molokaʻi real estate" />`, then `<Footer />`.
- [ ] **Step 3: Honest copy.** Intro states only what the data supports: the number of recent closings, the price range (`SOLD_PRICE_RANGE`), the towns (Kaunakakai, Maunaloa/West End), and that the team represented buyers and sellers. **No invented stats** (no "average days on market", no "X% over asking").
- [ ] **Step 4: Conversion.** One primary CTA "Thinking of selling? Talk to Dayna" -> `/#contact`, and a secondary "See homes for sale" -> `/listings`. A price-range line ("Recent closings from $70,000 to $999,000") near the top.
- [ ] **Verify:** `/sold` returns 200, exactly one `<h1>`, JSON-LD present and valid, all sold images load, both CTAs and all LandingLinks resolve 200.

---

### Task 3: Sitemap + internal links

**Files:**
- Modify: `app/sitemap.ts`, `components/RecentlySold.tsx`, `components/LandingLinks.tsx`, `components/Footer.tsx`

- [ ] **Step 1:** Add `{ path: "/sold", changeFrequency: "monthly", priority: 0.7 }` to `ROUTES` in `app/sitemap.ts` (sold data changes slowly, so monthly).
- [ ] **Step 2:** In `RecentlySold.tsx`, add/point the section CTA to `/sold` ("See all recently sold"); keep the Zillow link as secondary proof.
- [ ] **Step 3:** Add a `/sold` item to `LandingLinks.tsx` so landing pages and `/listings` link inward to it.
- [ ] **Step 4:** Add "Recently Sold" to `Footer.tsx`.
- [ ] **Step 5 (optional, ask Tanner):** add "Sold" to `Nav.tsx`.
- [ ] **Verify:** `curl`/fetch `${SITE.url}/sitemap.xml` locally (built) contains `/sold`; every new internal link resolves.

---

### Task 4: Verification gate (before handback, no deploy)

**Files:** none (checks only)

- [ ] `npx eslint app components lib` clean (repo note: `next lint` is removed in Next 16, run eslint directly).
- [ ] `npx tsc --noEmit` clean, then `npm run build` succeeds.
- [ ] Live-DOM pass on `npm run dev` (`-p 3210` per `launch.json`): `/sold` 200, one h1, JSON-LD valid, 0 broken images, 0 console errors, CTAs + LandingLinks + footer link all 200, sitemap lists `/sold`.
- [ ] Report results to Tanner. **Do not push.** Push = publish and auto-deploys; Tanner reviews, then pushes (or approves a push). After it is live, request indexing for `/sold` in GSC and confirm it is in the submitted sitemap ([[gsc-request-indexing-and-vercel-redirect]]).

---

## Part B: Listings freshness (decision-gated, not built in this pass)

Today the for-sale listings are a **one-time snapshot**: `scripts/sync-listings.mjs` scrapes RAM into `lib/listings.generated.json` + downloads photos to `public/images/listings/<uid>/` (~104MB in git), re-run by hand. "Freshness" means it updates on its own.

**Options:**

- **B1 (recommended interim): GitHub Action cron.** A scheduled workflow (twice a week is plenty for a market this size, do not over-poll) checks out the repo, runs `node scripts/sync-listings.mjs`, and if `lib/listings.generated.json` changed, commits + pushes -> Vercel auto-deploys. **Hard guard:** if the scrape returns 0 listings, the action must FAIL and commit nothing (a zero-length generated file would wipe the live listings, the [[mirror-redeploy-404-sweep]] class of bug).
- **B1a (the enabler, pairs with B1): serve listing photos from the SaleCORE CDN instead of committing them.** `next.config.ts` **already allowlists** `mlsimages.salecore.com` and `media.salecore.com` in `images.remotePatterns`. If the sync writes the remote photo URL into the generated JSON (instead of downloading to `public/images/listings/`), the cron commits only a small JSON diff, not tens of MB of photos each run. This removes the git-bloat blocker that makes automation ugly. Trade-off: if SaleCORE rotates or expires a URL, that photo 404s (mitigate: keep `listing.image` local hero as a fallback). This is a real change to the sync script + the generated data shape.
- **B2 (best long-term, currently BLOCKED): Paragon RESO OData feed.** Adapters are already built and env-gated (`fetchParagonListings`). Blocked on Dayna finishing the "Data Access / Agreements" tabs in Paragon to approve the Maui dataset (her keys authenticate; Property data returns 401). When unblocked: set `PARAGON_ODATA_URL` + `PARAGON_SERVER_TOKEN` in Vercel and `getListings()` auto-prefers it, no scraping, no cron. See the merged Paragon notes in [[molokai-real-estate-site]].
- **B3 (do nothing): keep manual.** Fine if listings turnover is genuinely low; just document the one-command refresh.

**Sold-data freshness:** keep `lib/sold.ts` a **manual** periodic refresh (re-scrape the Zillow profile, update the array + `public/images/sold/`). Sold history changes slowly and auto-scraping Zillow is fragile and ToS-gray. Not worth automating.

**One decision needed before building Part B:** photo strategy + go/no-go.
1. Automate now (B1) or leave manual (B3)?
2. If automating: switch listing photos to remote SaleCORE URLs (B1a, recommended) or keep committing local photos (accept the git churn / periodic re-cap to ~12 per listing)?
3. Cadence (default: Tue + Fri, early HST).

**If approved, Part B tasks (outline):**
- [ ] (If B1a) Update `scripts/sync-listings.mjs` to store remote SaleCORE photo URLs in `lib/listings.generated.json`; keep a local hero fallback; verify next/image renders remote photos (remotePatterns already set).
- [ ] Add `.github/workflows/sync-listings.yml`: cron schedule, `npm ci`, run the sync, empty-result guard, commit-if-changed with a bot author, rely on Vercel Git auto-deploy.
- [ ] Dry-run the workflow on a branch (or `workflow_dispatch`) and confirm: a real listing change produces a small commit, an empty scrape fails safely, and the deploy serves fresh data.
- [ ] Document the Paragon activation switch (env vars) for when Dayna unblocks it, so B2 supersedes the cron with no code change.

---

## Risks & notes

- **No invented facts** anywhere on `/sold` (copy, schema). Breadcrumb JSON-LD only.
- **Push = publish.** Everything above is local until Tanner reviews and pushes. The Part B cron, once live, pushes on its own, which is exactly why the empty-result guard is mandatory.
- **Canonical repo is `C:\dev\MVP`** (clean, on `main`, up to date). `C:\Users\Tanne\MVP` does not exist on the laptop.
- **Data accuracy:** `lib/sold.ts` header comment says "10" but the array holds 9. Reconcile the comment (or add the 10th) while in the file; do not fabricate a 10th sale.
