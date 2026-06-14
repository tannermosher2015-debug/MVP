# Real Estate on Molokai

A luxury marketing website for **Molokai Vacation Properties, Inc.** (*Real Estate on Molokai*),
broker **Dayna E. Harris** — homes, oceanfront estates, condominiums and land on the island
of Molokaʻi, Hawaiʻi.

Built as a fast, elegant, fully responsive single-page experience with cinematic but
performance-friendly animations, designed to be extended into a live MLS/IDX-powered site.

---

## ✨ What's inside

- **Cinematic hero** with parallax + a one-time scale reveal
- **Featured property** showcase, **current-listings** grid, **communities map**, **services**,
  **broker / about**, and an accessible **contact form**
- **Warm Hawaiian-luxury** design system (Cinzel + Josefin Sans, espresso / ivory / bronze / ocean)
- **Scroll-reveal & stagger animations** that fully respect `prefers-reduced-motion`
- **IDX / MLS-ready** listings data layer — flip a single env var to go live
- **WCAG AA** color contrast, keyboard-navigable, screen-reader labelled, `next/image`-optimized
- **SEO**: metadata, Open Graph, and `RealEstateAgent` JSON-LD structured data

---

## 🧰 Tech stack

| | |
|---|---|
| Framework | **Next.js 16** (App Router, React 19, Server Components) |
| Language | TypeScript |
| Styling | **Tailwind CSS v4** (CSS-first `@theme` tokens) |
| Animation | **motion** (Framer Motion) |
| Icons | **lucide-react** + inline SVG |
| Fonts | `next/font` — Cinzel (display) & Josefin Sans (body), self-hosted |

---

## 👀 Just want to look at it? (no command line)

Double-click **`Open Real Estate on Molokai.bat`** on the Desktop (or `start-website.bat`
in this folder). It starts the site and opens it in your browser at
**http://localhost:3000**. A small black window stays open while you view — closing it
stops the site. To view again later, just double-click the icon again.

---

## 🚀 Getting started (developers)

> Requires **Node.js 18.18+** (Node 24 LTS recommended). Get it at <https://nodejs.org>.

```bash
# from this folder
npm install        # first time only
npm run dev        # start the dev server → http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
```

---

## 📁 Project structure

```
app/
  layout.tsx          # fonts, global metadata, <html>/<body>
  page.tsx            # composes all sections + JSON-LD
  globals.css         # design tokens (@theme), base styles, utilities, reduced-motion
components/
  Nav.tsx             # sticky scroll-aware navbar + mobile menu
  Hero.tsx            # parallax hero
  Intro.tsx           # editorial statement + stats
  FeaturedProperty.tsx# flagship listing showcase
  ListingsGrid.tsx    # current listings grid
  ListingCard.tsx     # individual property card
  Services.tsx        # services (dark section)
  Communities.tsx     # island map + community list
  About.tsx           # broker / about
  Contact.tsx         # contact form + details
  Footer.tsx          # footer + license info
  motion.tsx          # Reveal / Stagger animation primitives
lib/
  site.ts             # ← ALL company copy & contact info (edit here)
  listings.ts         # ← property data + IDX/MLS integration point
public/images/        # photography & map (swap with professional photos)
```

---

## ✏️ Editing the content

**Company info, phone, address, services, broker bio, nav, stats** all live in
[`lib/site.ts`](lib/site.ts). Change it there and it updates everywhere.

---

## 🏘️ Listings & going live with MLS/IDX

All property data flows through **[`lib/listings.ts`](lib/listings.ts)** — the single
integration point.

**Today** it serves the curated static listings (real Molokaʻi properties). The site renders
against a typed `Listing` shape, so a live feed only has to map the provider's fields into it.

**To go live with a real feed:**

1. Copy `.env.example` → `.env.local`
2. Set:
   ```env
   IDX_PROVIDER=reso
   IDX_API_URL=https://api.your-vendor.com/v2/Property
   IDX_API_TOKEN=your-bearer-token
   ```
3. Adjust the field mapping in `fetchLiveListings()` to match your provider
   (the included example targets a **RESO Web API / OData** feed — works with Hawaii
   Information Service / MLS, MLS Grid, IDX Broker, Spark API, etc.)

The same `getListings()` call is used throughout the site, so **no component changes are
needed**. If the feed errors, the site automatically falls back to the static listings so it
never shows an empty page. Listings are revalidated every 15 minutes (tune in `fetchLiveListings`).

> Credentials are read server-side only and are never exposed to the browser.

---

## 🖼️ Swapping the photography

Images live in `public/images/`. **Brand / lifestyle** imagery is AI-generated
(art-directed, golden-hour Hawaiian luxury); **listing** imagery is the real
properties pulled from the existing site (so no actual listing is misrepresented).

| File | Type | Used for |
|---|---|---|
| `hero-ai.png` | AI / lifestyle | Hero background |
| `coastline-ai.png` | AI / lifestyle | About section |
| `interior-ai.png` | AI / lifestyle | Lifestyle band |
| `exterior-ai.png` | AI / lifestyle | Spare alternate (not currently used) |
| `oceanfront-compound.jpg` | Real listing | Featured property card |
| `kamehameha-2452.jpg`, `west-end-cottage.jpg`, `molokai-shores.jpg`, `ke-nani-kai.jpg` | Real listings | Listing cards |
| `molokai-map.png` | Real | Communities map |

`next/image` handles resizing, WebP conversion and lazy-loading automatically.
Swap any file (keep the name) to replace it with professional photography.

**Regenerate the AI imagery:** set `GEMINI_API_KEY` (see `.env.example`) and run
`python scripts/gen_images.py` — edit the prompts in that file to taste. Listing
photos should always be the genuine property images, not generated.

---

## 📨 Contact form

The form in [`components/Contact.tsx`](components/Contact.tsx) POSTs to the
[`app/api/contact/route.ts`](app/api/contact/route.ts) route handler, which emails the
lead to Dayna via [Resend](https://resend.com). `reply-to` is set to the sender, so a
reply goes straight back to the prospect. A hidden honeypot field blocks bots, and all
fields are validated again server-side.

**To activate (one env var):**

1. Create a free [Resend](https://resend.com) account and an **API key**.
2. Set it on Vercel (Project → Settings → Environment Variables) and in `.env.local`
   for local testing:
   ```env
   RESEND_API_KEY=re_xxxxxxxx
   # optional overrides:
   CONTACT_TO_EMAIL=dayna.harris@icloud.com     # where leads are delivered
   CONTACT_FROM_EMAIL="Real Estate on Molokai <hello@realestateonmolokai.com>"
   ```
3. For best deliverability, **verify a sending domain** in Resend and point
   `CONTACT_FROM_EMAIL` at an address on it. Until then it falls back to Resend's
   shared `onboarding@resend.dev` sender (works for testing; may land in spam).

Without `RESEND_API_KEY`, the endpoint returns a clear error and the form shows a
"call/email us instead" fallback — it never silently drops a lead.

---

## 🎨 Design tokens

Defined in [`app/globals.css`](app/globals.css) under `@theme` and usable as Tailwind classes
(`bg-espresso`, `text-bronze-deep`, `border-sand`, …):

| Token | Hex | Role |
|---|---|---|
| `ink` | `#2b221c` | Primary text |
| `espresso` | `#211814` | Dark sections |
| `ivory` / `cream` | `#f8f4ed` / `#efe8dc` | Backgrounds |
| `bronze` / `bronze-deep` / `gold` | `#a07d4b` / `#6f5125` / `#d9b87f` | Accents |
| `ocean` | `#2c5a57` | Sense-of-place accent |
| `taupe` | `#6b5e52` | Muted text |

---

## ☁️ Deployment

Optimized for **[Vercel](https://vercel.com)** (push the repo and import — zero config).
Any Node host works via `npm run build && npm run start`. Add your `IDX_*` environment
variables in the host's dashboard if using a live feed.

---

© Molokai Vacation Properties, Inc. · Brokerage Lic. RB-22987 · Broker Lic. RB-20019 · Equal Housing Opportunity
