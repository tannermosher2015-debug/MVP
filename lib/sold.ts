/**
 * ============================================================================
 *  RECENTLY SOLD  —  manual snapshot
 * ============================================================================
 *  The most-recent Molokaʻi Vacation Properties team sales, captured from
 *  Dayna Harris's public Zillow agent page:
 *      https://www.zillow.com/profile/Dayna%20Harris   (#listings-and-sales)
 *
 *  This is a STATIC snapshot, not a live feed — unlike the active for-sale
 *  listings in `lib/listings.ts` (which auto-pull from RAM). Refresh it by
 *  re-scraping the Zillow profile and editing the array below + the photos in
 *  `public/images/sold/`.
 *
 *  Notes on the data:
 *   - `soldDate` is approximate (Zillow shows relative labels like "2 months
 *     ago", not exact dates) — rendered as month + year only.
 *   - `represented` reflects which side of the deal the team was on (Buyer,
 *     Seller, or both), per Zillow's badge.
 *   - `beds`/`baths`/`sqft` of 0 mean Zillow did not publish that figure.
 * ============================================================================
 */

export type SoldType = "Home" | "Condo" | "Land";
export type SoldSide = "Buyer" | "Seller" | "Buyer & Seller";

export interface SoldListing {
  slug: string;
  title: string; // street address
  city: string;
  region: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type?: SoldType; // omitted when Zillow published no property-type signal
  represented: SoldSide;
  soldDate: string; // ISO YYYY-MM (approx)
  image: string;
  imageAlt: string;
}

export const SOLD_LISTINGS: SoldListing[] = [
  {
    // MLS 410095, listed by Hawaii Life at $600,000; closed 2026-08-31 with the
    // team on the buyer side (Redfin and Zillow, read 2026-09-02).
    slug: "2655-kamehameha-v-hwy",
    title: "2655 Kamehameha V Hwy",
    city: "Kaunakakai",
    region: "HI",
    price: 550000,
    beds: 3,
    baths: 2,
    sqft: 875,
    type: "Home",
    represented: "Buyer",
    soldDate: "2026-08",
    image: "/images/sold/2655-kamehameha-v-hwy.jpg",
    imageAlt: "Sold oceanfront cottage at 2655 Kamehameha V Hwy, Kaunakakai, Molokaʻi",
  },
  {
    slug: "1633-farrington-ave",
    title: "1633 Farrington Ave",
    city: "Kualapuu",
    region: "HI",
    price: 550000,
    beds: 2,
    baths: 2,
    sqft: 1120,
    type: "Home",
    represented: "Buyer & Seller",
    soldDate: "2026-08",
    image: "/images/sold/1633-farrington-ave.jpg",
    imageAlt: "Sold home at 1633 Farrington Ave, Kualapuu, Molokaʻi",
  },
  {
    slug: "1000-kam-v-hwy-223b",
    title: "1000 Kamehameha V Hwy #223B",
    city: "Kaunakakai",
    region: "HI",
    price: 160000,
    beds: 1,
    baths: 1,
    sqft: 562,
    type: "Condo",
    represented: "Buyer & Seller",
    soldDate: "2026-08",
    image: "/images/sold/1000-kam-v-hwy-223b.jpg",
    imageAlt: "Sold condo at 1000 Kamehameha V Hwy #223B, Kaunakakai, Molokaʻi",
  },
  {
    slug: "50-kepuhi-pl-206",
    title: "50 Kepuhi Pl #206",
    city: "Maunaloa",
    region: "HI",
    price: 240000,
    beds: 2,
    baths: 2,
    sqft: 990,
    type: "Condo",
    represented: "Buyer",
    soldDate: "2026-07",
    image: "/images/sold/50-kepuhi-pl-206.jpg",
    imageAlt: "Sold condo at 50 Kepuhi Pl #206, Maunaloa, Molokaʻi",
  },
  {
    slug: "1000-kam-v-hwy-126b",
    title: "1000 Kamehameha V Hwy #126B",
    city: "Kaunakakai",
    region: "HI",
    price: 210000,
    beds: 1,
    baths: 1,
    sqft: 562,
    type: "Condo",
    represented: "Buyer & Seller",
    soldDate: "2026-06",
    image: "/images/sold/1000-kam-v-hwy-126b.jpg",
    imageAlt: "Sold condo at 1000 Kamehameha V Hwy #126B, Kaunakakai, Molokaʻi",
  },
  {
    slug: "50-kamiloloa-pl",
    title: "50 Kamiloloa Pl",
    city: "Kaunakakai",
    region: "HI",
    price: 70000,
    beds: 0,
    baths: 0,
    sqft: 0,
    represented: "Buyer",
    soldDate: "2026-06",
    image: "/images/sold/50-kamiloloa-pl.jpg",
    imageAlt: "Sold property at 50 Kamiloloa Pl, Kaunakakai, Molokaʻi",
  },
  {
    slug: "50-kepuhi-pl-122",
    title: "50 Kepuhi Pl #122",
    city: "Maunaloa",
    region: "HI",
    price: 150000,
    beds: 1,
    baths: 1,
    sqft: 681,
    type: "Condo",
    represented: "Seller",
    soldDate: "2026-06",
    image: "/images/sold/50-kepuhi-pl-122.jpg",
    imageAlt: "Sold condo at 50 Kepuhi Pl #122, Maunaloa, Molokaʻi",
  },
  {
    slug: "115-ulua-rd",
    title: "115 Ulua Rd",
    city: "Kaunakakai",
    region: "HI",
    price: 999000,
    beds: 3,
    baths: 2,
    sqft: 2204,
    type: "Home",
    represented: "Buyer",
    soldDate: "2026-06",
    image: "/images/sold/115-ulua-rd.jpg",
    imageAlt: "Sold home at 115 Ulua Rd, Kaunakakai, Molokaʻi",
  },
  {
    slug: "79-kaana-st",
    title: "79 Kaana St",
    city: "Maunaloa",
    region: "HI",
    price: 520000,
    beds: 3,
    baths: 2,
    sqft: 1451,
    type: "Home",
    represented: "Seller",
    soldDate: "2026-06",
    image: "/images/sold/79-kaana-st.jpg",
    imageAlt: "Sold home at 79 Kaana St, Maunaloa, Molokaʻi",
  },
  {
    slug: "255-kepuhi-pl-4a",
    title: "255 Kepuhi Pl #4A",
    city: "Maunaloa",
    region: "HI",
    price: 195000,
    beds: 0,
    baths: 1,
    sqft: 378,
    type: "Condo",
    represented: "Buyer & Seller",
    soldDate: "2026-05",
    image: "/images/sold/255-kepuhi-pl-4a.jpg",
    imageAlt: "Sold studio condo at 255 Kepuhi Pl #4A, Maunaloa, Molokaʻi",
  },
  {
    slug: "7146-kam-v-hwy-c104",
    title: "7146 Kamehameha V Hwy #C104",
    city: "Kaunakakai",
    region: "HI",
    price: 195000,
    beds: 1,
    baths: 1,
    sqft: 604,
    type: "Condo",
    represented: "Buyer",
    soldDate: "2026-04",
    image: "/images/sold/7146-kam-v-hwy-c104.jpg",
    imageAlt: "Sold condo at 7146 Kamehameha V Hwy #C104, Kaunakakai, Molokaʻi",
  },
  {
    slug: "kam-v-hwy-312a",
    title: "Kamehameha V Hwy #312A",
    city: "Kaunakakai",
    region: "HI",
    price: 235000,
    beds: 1,
    baths: 1,
    sqft: 562,
    type: "Condo",
    represented: "Buyer",
    soldDate: "2026-04",
    image: "/images/sold/kam-v-hwy-312a.jpg",
    imageAlt: "Sold condo at Kamehameha V Hwy #312A, Kaunakakai, Molokaʻi",
  },
  {
    slug: "kam-v-hwy-600",
    title: "Kamehameha V Hwy",
    city: "Kaunakakai",
    region: "HI",
    price: 600000,
    beds: 0,
    baths: 0,
    sqft: 0,
    represented: "Buyer & Seller",
    soldDate: "2026-04",
    image: "/images/sold/kam-v-hwy-600.jpg",
    imageAlt: "Sold property on Kamehameha V Hwy, Kaunakakai, Molokaʻi",
  },
  {
    slug: "22-kawela-way",
    title: "22 Kawela Way",
    city: "Kaunakakai",
    region: "HI",
    price: 425000,
    beds: 2,
    baths: 1,
    sqft: 1296,
    type: "Home",
    represented: "Buyer & Seller",
    soldDate: "2026-04",
    image: "/images/sold/22-kawela-way.jpg",
    imageAlt: "Sold home at 22 Kawela Way, Kaunakakai, Molokaʻi",
  },
];

/** Lowest and highest sold price in the snapshot, for the section's range line. */
export const SOLD_PRICE_RANGE = {
  min: Math.min(...SOLD_LISTINGS.map((l) => l.price)),
  max: Math.max(...SOLD_LISTINGS.map((l) => l.price)),
};

/** "2026-06" -> "Jun 2026" (sold dates are month-precision approximations). */
export function formatSoldDate(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  const month = new Date(2000, m - 1, 1).toLocaleDateString("en-US", { month: "short" });
  return `${month} ${y}`;
}
