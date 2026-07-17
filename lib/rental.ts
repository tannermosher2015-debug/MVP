/**
 * The single vacation-rental unit Molokai Vacation Properties owns and rents
 * out directly, at Kepuhi Beach Resort (255 Kepuhi Pl, Maunaloa).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PLACEHOLDER STATE — this page is NOT publishable yet.
 *
 * Every `TBD` below is a fact only the owner can supply. While any TBD
 * remains, the page renders visible "TBD" chips, is `noindex`, and is absent
 * from app/sitemap.ts.
 *
 * ⚠ It IS linked from SITE.nav ("Vacation Rental") as of the nav reshuffle that
 * moved Local Businesses under Our Island. So the page is reachable by anyone
 * the moment this repo is pushed — noindex only keeps it out of Google, it does
 * not hide it from visitors. Replace the TBDs BEFORE any deploy.
 *
 * Verified (from lib/listings.generated.json, not assumed): 255 Kepuhi Pl is
 * Kepuhi Beach Resort in Maunaloa. 50 Kepuhi Pl is Ke Nani Kai — a different
 * complex on the same street. Don't conflate them.
 * ─────────────────────────────────────────────────────────────────────────
 */

/** Sentinel for a fact the owner hasn't supplied yet. */
export const TBD = "TBD";

export const isTBD = (v: string) => v === TBD;

export const RENTAL = {
  complex: "Kepuhi Beach Resort",
  address: "255 Kepuhi Place, Maunaloa, Molokaʻi",
  unit: TBD,

  /** Rendered as the <h1>. */
  headline: "Our place at Kepuhi Beach",

  /** Intro copy. Written only from what the photos actually show. */
  intro:
    "A west-end condominium at Kepuhi Beach Resort — low-rise cedar buildings set on open lawns above the shoreline, where the golden sand of Kepuhi Beach starts a short walk from the door.",

  /** The facts grid. Order here is the order on the page. */
  facts: [
    { label: "Bedrooms", value: TBD },
    { label: "Bathrooms", value: TBD },
    { label: "Sleeps", value: TBD },
    { label: "Square feet", value: TBD },
  ],

  rates: [
    { label: "Nightly rate", value: TBD },
    { label: "Minimum stay", value: TBD },
    { label: "Cleaning fee", value: TBD },
  ],

  /**
   * Unit amenities. Deliberately empty: nothing in the supplied photos shows
   * the interior, and guessing "full kitchen / lanai / A-C" would be inventing
   * facts about a real rental. Owner fills this in.
   */
  amenities: [] as string[],

  /**
   * Resort-grounds features. ALSO deliberately empty pending confirmation —
   * the pool and BBQ are visible in the photos, but whether THIS unit's guests
   * may use them is a resort-access question, not something a photo answers.
   */
  resortAmenities: [] as string[],

  /**
   * Photos. All six are exterior/grounds/beach — there are no interior shots
   * yet. Captions describe only what is visibly in frame; none of them claims
   * guest access to anything.
   */
  photos: [
    {
      src: "/images/rental/pool.jpg",
      alt: "A curving swimming pool ringed by tall coconut palms on red-tinted decking, with the Pacific and a rocky headland beyond",
    },
    {
      src: "/images/rental/kepuhi-beach.jpg",
      alt: "Golden sand and turquoise surf at Kepuhi Beach, with pale rock outcrops and palms along the bluff",
    },
    {
      src: "/images/rental/grounds-bbq.jpg",
      alt: "A stone barbecue pavilion and tropical planting on the resort's open lawn, with cedar-shingled two-storey condominium buildings and palms behind",
    },
    {
      src: "/images/rental/resort-aerial.jpg",
      alt: "Aerial view of the low-rise resort buildings set among lawns and palms directly above the Kepuhi shoreline",
    },
    {
      src: "/images/rental/kepuhi-beach-rocks.jpg",
      alt: "Kepuhi Beach looking along the shore, with weathered rock formations, footprints in the sand and open ocean",
    },
    {
      src: "/images/rental/resort-pano.jpg",
      alt: "Wide panorama across the resort's lawns and scattered cedar buildings toward the dry west-end hills",
    },
  ],
} as const;

/**
 * PUBLISH_CHECKLIST — the nav entry is already in place, so the page is only a
 * `git push` away from being reachable. Do these before that push:
 *
 *  1. Replace every TBD above; confirm the rate/min-stay with the owner.
 *  2. Add interior photos + fill `amenities` and `resortAmenities`.
 *  3. Delete the draft <aside> banner + the `robots: { index: false }` block in
 *     app/vacation-rentals/page.tsx.
 *  4. Add "/vacation-rentals" to ROUTES in app/sitemap.ts so Google indexes it.
 *
 * (Nav entry: done — SITE.nav "Vacation Rental" → /vacation-rentals.)
 */
export const PUBLISH_CHECKLIST = true;
