# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: prospective **buyers** of Molokaʻi property (oceanfront estates, homes, condominiums, and land), largely out-of-market and neighbor-island buyers researching the island remotely, plus on-island move-up buyers. They are early in a high-consideration, emotional purchase and must trust the agent before they will inquire.

Co-primary: **sellers and owners** looking to list with the island's leading team.

Secondary: visitors and house-hunters who want a **vacation stay** (Dayna rents exactly one unit of her own, the Kepuhi Beach studio) and people needing a **long-term rental** (now a referral, no longer managed in-house).

The one conversion goal across every surface is a **personal inquiry to Dayna and the team** (call, contact form, or MLS lead), not a self-serve transaction.

> Inference to confirm: the buyer-led emphasis with sellers co-primary is read from the hero, the listings-first IA, and the services copy. Correct this if the business weights sellers or management higher.

## Product Purpose

A luxury marketing website for **Molokai Vacation Properties, Inc.** (dba *Real Estate on Molokai*), the brokerage led by principal broker **Dayna E. Harris**. It presents the firm's listings and the island itself so a remote buyer can fall for Molokaʻi and trust this team to represent them. Success means qualified buyer inquiries and listing leads, and eventually a live MLS/IDX search that keeps buyers on-site.

## Positioning

The island's **No. 1 team in Maui County** (most properties sold, 2026; top 10 in 2025), run by a broker with **30+ years on Molokaʻi** and 20+ years running the island's largest property-management company, and the island's No. 1 lead buyer on Zillow. The claim a competitor cannot truthfully copy: deep, multi-decade **local Molokaʻi authority** (every road, shoreline, and neighborhood) on the "last unspoiled corner of Hawaiʻi." Family-run and fully local.

## Operating Context

- Buyers research remotely over a long horizon; the site is the first trust surface before a call.
- Listings today are a curated, generated data layer (`lib/listings*.generated.json`); the build is **IDX/MLS-ready** (RAM, the REALTORS Association of Maui) and flips live via an env var.
- Contact routes to Dayna directly (Web3Forms email + `tel:` links), reinforcing a personal, concierge relationship.
- Office: 130 Kamehameha V Highway, Kaunakakai, Molokaʻi HI 96748.

## Capabilities and Constraints

- Next.js 16 (App Router, React Server Components), React 19, TypeScript, Tailwind CSS v4 (`@theme` tokens), `motion` (Framer Motion), `next/font` self-hosted (Cinzel + Josefin Sans), Leaflet maps, Web3Forms contact, Vercel hosting.
- Routes: home, listings + `[slug]` detail, MLS search (IDX-ready), maps/resorts, our-island + community, reviews, vacation-rentals, about, contact.
- Content source of truth: `lib/site.ts` (company, team, areas, services, stats).
- Constraint: listings data is seed/generated until IDX is enabled. Do not present it as a live, complete inventory.

## Brand Commitments

- Names: "Real Estate on Molokai" (public), "Molokai Vacation Properties, Inc." (legal). Office lic. RB-22987; Dayna E. Harris RB-20019.
- Tagline "Island living, found."; hero voice "Extraordinary by nature."
- Voice: warm, understated, place-rooted Hawaiian (`Molokaʻi` with the ʻokina, "Mahalo", "island life"); never loud or hype-y. Luxury by restraint.
- Team is real and named: Dayna E. Harris (Principal Broker), John Warring (Broker), Clare Mawae (REALTOR). Facebook presence "Joys of Island Life".
- House writing rule: no em or en dashes in site copy.

## Evidence on Hand

- Real broker bio, team, licenses, address, and phone (`lib/site.ts`); real reviews (`lib/reviews.ts`); real Molokaʻi area and community content.
- Accolades are the firm's own (Maui County sales rank, Zillow lead-buyer). Keep them attributed and current; do not inflate.
- Listings imagery and data are generated/seed pending IDX. Future work must not fabricate specific active listings, prices, or sale counts.

## Product Principles

1. **Trust before transaction.** Every surface earns the personal inquiry; there is no self-serve funnel.
2. **The island is the product too.** Place-selling (towns, shorelines, lifestyle) carries as much weight as the listings.
3. **Understated luxury.** Restraint, warmth, and craft over flash; it should feel commissioned, not templated.
4. **Local authority is the moat.** Lean on 30+ years and the No. 1 record, stated honestly.
5. **Ready to go live.** Keep the IDX/MLS path first-class; seed data is a placeholder, not the ceiling.

## Accessibility & Inclusion

Binding: WCAG 2.1 AA. Real `:focus-visible` bronze ring, full keyboard navigation (focus-trapped mobile menu), screen-reader labels, `prefers-reduced-motion` honored throughout, and AA-contrast tokens (for example `bronze-deep` for small text on light surfaces). Do not regress these.
