/**
 * ============================================================================
 *  SEO LANDING PAGES  —  by property type and Molokaʻi town
 * ============================================================================
 *  Each entry becomes a real, server-rendered, indexable page at /<slug>
 *  (see app/[slug]/page.tsx). They target the searches the generic /listings
 *  page can't rank for (client-side filtering = one URL), e.g.
 *  "molokai condos for sale" or "kaunakakai real estate".
 *
 *  Copy is real island geography — no invented market stats. Listings are
 *  pulled live through getListings() and filtered by `match`.
 * ============================================================================
 */
import { type Listing } from "@/lib/listings";

export interface LandingPage {
  slug: string;
  /** <title> — the layout template appends the site name. */
  title: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  /** Real intro paragraph shown under the H1. */
  intro: string;
  /** Existing /public/images hero. */
  hero: string;
  heroAlt: string;
  /** Predicate over a live listing. */
  match: (l: Listing) => boolean;
}

export const LANDING_PAGES: LandingPage[] = [
  {
    slug: "molokai-homes-for-sale",
    title: "Molokai Homes for Sale",
    metaDescription:
      "Single-family homes for sale on the island of Molokaʻi, from in-town cottages to oceanfront estates, listed with broker Dayna E. Harris.",
    eyebrow: "Homes for sale",
    h1: "Molokaʻi Homes for Sale",
    intro:
      "From plantation-era cottages in town to oceanfront family compounds on the south shore, single-family homes on Molokaʻi are few and rarely listed. Here is every house currently for sale across the island, updated as new listings reach the market.",
    hero: "/images/hero-molokai.jpg",
    heroAlt:
      "Molokaʻi coastline with green mountains meeting the calm Pacific",
    match: (l) => l.type === "Home",
  },
  {
    slug: "molokai-condos-for-sale",
    title: "Molokai Condos for Sale",
    metaDescription:
      "Beachfront condominiums for sale on Molokaʻi at Molokai Shores, Ke Nani Kai, Paniolo Hale and Kepuhi Beach Resort. Browse every unit with Dayna Harris.",
    eyebrow: "Condos for sale",
    h1: "Molokaʻi Condos for Sale",
    intro:
      "Molokaʻi's condominiums cluster in a handful of beachfront resort communities: Molokai Shores and Hotel Molokai near Kaunakakai, and Ke Nani Kai, Paniolo Hale and Kepuhi Beach Resort on the West End. They are the island's most turnkey way to own a place by the water. Browse every Molokaʻi condo for sale below.",
    hero: "/images/molokai-shores.jpg",
    heroAlt:
      "Oceanfront condominium grounds on Molokaʻi with palms beside the shoreline",
    match: (l) => l.type === "Condo",
  },
  {
    slug: "molokai-land-for-sale",
    title: "Molokai Land for Sale",
    metaDescription:
      "Vacant land and ocean-view lots for sale on Molokaʻi, from ranch acreage to buildable parcels. See every lot currently listed with Dayna Harris.",
    eyebrow: "Vacant land",
    h1: "Molokaʻi Land for Sale",
    intro:
      "Owning land on Molokaʻi means buying into the most Hawaiian of the islands: ranch acreage, ocean-view lots, and parcels where you can still build the life you imagine. Vacant land here moves quietly and rarely lasts. Here is every lot currently for sale.",
    hero: "/images/molokai-cliffs.jpg",
    heroAlt:
      "Open Molokaʻi land with sea cliffs and ranch country above the Pacific",
    match: (l) => l.type === "Land",
  },
  {
    slug: "kaunakakai-real-estate",
    title: "Kaunakakai Real Estate",
    metaDescription:
      "Homes and condominiums for sale in Kaunakakai, Molokaʻi's harbor town and south-shore heart. Browse current Kaunakakai listings with Dayna Harris.",
    eyebrow: "Kaunakakai",
    h1: "Kaunakakai Real Estate",
    intro:
      "Kaunakakai is Molokaʻi's harbor town and friendly heart: the main street of shops, the long wharf, and the south-shore condominiums that line the calm waters inside the reef. Most of the island's real estate is here, from in-town homes to beachfront condos.",
    hero: "/images/molokai-bay.jpg",
    heroAlt:
      "Calm south-shore waters and reef off Kaunakakai on Molokaʻi",
    match: (l) => l.city.toLowerCase() === "kaunakakai",
  },
  {
    slug: "maunaloa-real-estate",
    title: "Maunaloa & West End Real Estate",
    metaDescription:
      "West End Molokaʻi real estate around Maunaloa: beach condos and getaway homes at Ke Nani Kai, Paniolo Hale and Kepuhi Beach. Current listings with Dayna Harris.",
    eyebrow: "Maunaloa · West End",
    h1: "Maunaloa & West End Real Estate",
    intro:
      "Past the old pineapple town of Maunaloa, Molokaʻi's West End opens to ranch country and the golden sands of Kepuhi and Pāpōhaku, the island's longest beaches. The resort communities of Ke Nani Kai, Paniolo Hale and Kepuhi Beach Resort make this the place for a beach condo or a quiet getaway home.",
    hero: "/images/molokai-beach.jpg",
    heroAlt:
      "Golden-sand West End beach on Molokaʻi at the foot of open ranch land",
    match: (l) => l.city.toLowerCase() === "maunaloa",
  },
];

export function getLandingPage(slug: string): LandingPage | undefined {
  return LANDING_PAGES.find((p) => p.slug === slug);
}
