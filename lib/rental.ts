/**
 * The single vacation-rental unit Molokai Vacation Properties owns and rents
 * out directly, at Kepuhi Beach Resort (255 Kepuhi Pl, Maunaloa).
 *
 * THIS PAGE IS LIVE (/vacation-rentals, in the nav and the sitemap).
 *
 * The rule that got it here: nothing on it is a guess. Every value below is
 * owner-confirmed, and anything unconfirmed is simply not shown rather than
 * approximated. Two things are deliberately absent and can be added any time:
 *
 *   - Bathrooms + square feet: not in `facts`. Add an entry and the grid grows.
 *   - In-unit amenities: `amenities` is empty, so the "In the unit" card does
 *     not render at all. Fill the array and the card appears.
 *
 * If you add a value you're unsure of, use the `TBD` sentinel instead of a
 * guess: it renders a loud gold chip, which is a bug you can see rather than a
 * lie a guest reads. A push to main deploys in ~20s, so don't ship a TBD.
 *
 * Verified (from lib/listings.generated.json, not assumed): 255 Kepuhi Pl is
 * Kepuhi Beach Resort in Maunaloa. 50 Kepuhi Pl is Ke Nani Kai, a different
 * complex on the same street. Don't conflate them.
 */

/** Sentinel for a fact the owner hasn't supplied yet. */
export const TBD = "TBD";

export const isTBD = (v: string) => v === TBD;

export const RENTAL = {
  complex: "Kepuhi Beach Resort",
  address: "255 Kepuhi Place, Maunaloa, Molokaʻi",
  unit: "1222",
  /** Confirmed by the owner. Ground floor = no stairs, which guests care about. */
  floor: "Ground floor",

  /** Rendered as the <h1>. */
  headline: "Our place at Kepuhi Beach",

  /** Intro copy. Written only from confirmed facts + what the photos show. */
  intro:
    "A ground-floor studio at Kepuhi Beach Resort, sleeping four. Low-rise cedar buildings set on open lawns above the shoreline, where the golden sand of Kepuhi Beach starts a short walk from the door.",

  /**
   * The facts grid. Order here is the order on the page.
   *
   * "Layout: Studio" rather than "Bedrooms: 0", because components/ListingCard.tsx
   * already renders 0-bed units as "Studio" sitewide, so this matches.
   */
  facts: [
    { label: "Layout", value: "Studio" },
    {
      label: "Sleeps",
      value: "4",
      // How a studio sleeps four is the first thing a guest asks. Owner-confirmed.
      note: "Murphy bed and pull-down couch",
    },
    // Bathrooms and square feet are NOT listed: the owner hasn't confirmed them,
    // and an empty cell beats a guessed one. Add them back here when known (the
    // grid sizes itself off this array, so a third/fourth entry just works).
  ] as { label: string; value: string; note?: string }[],

  /**
   * No published price, by the owner's decision: each stay is quoted directly.
   * The page says so plainly and routes to the inquiry form, which already
   * collects dates and guest count.
   *
   * Minimum stay and cleaning fee deliberately fold into that quote instead of
   * showing as their own placeholder chips. If either should be visible before
   * a guest inquires (a minimum stay is the sort of thing people filter on),
   * add it back to `facts` as a fifth entry.
   */
  rates: {
    headline: "Rates on request",
    body: "We rent this one ourselves and quote each stay directly, so the price reflects your dates and how many of you are coming.",
    cta: "Send your dates",
  },

  /**
   * In-unit amenities. Empty, so the "In the unit" card is not rendered at all
   * (an empty card promising a list is worse than no card). Nothing in the
   * supplied photos shows the interior, and guessing "full kitchen / lanai /
   * A-C" would be inventing facts about a real rental someone pays for.
   */
  amenities: [] as string[],

  /**
   * Resort-grounds features. Source: the Kepuhi Beach Resort paragraph in the
   * MLS description for unit 1182 (a studio in this same resort), which the
   * sync already pulled into lib/listings-detail.generated.json. Verbatim:
   *
   *   "Kepuhi Beach Resort is zoned Hotel and it's amenities include an
   *    oceanfront swimming pool, outdoor gas BBQs, ample parking, storage
   *    lockers, and beautifully maintained grounds."
   *
   * Owner-confirmed 2026-07-16 that these apply to guests of 1222.
   *
   * "Beautifully maintained grounds" is dropped on purpose: it's an adjective,
   * not an amenity, and the photos already show the lawns.
   */
  resortAmenities: [
    "Oceanfront swimming pool",
    "Outdoor gas BBQs",
    "Ample parking",
    "Storage lockers",
  ] as string[],

  /**
   * Photos. All six are exterior/grounds/beach. There are no interior shots
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
 * STILL WANTED (none of these block the live page, all of them improve it):
 *
 *  1. Interior photos of the studio. This is the real gap: six exteriors and
 *     not one shot of the room being rented. Drop them in `photos` and, once
 *     there are enough, swap the grid in app/vacation-rentals/page.tsx for the
 *     existing <ListingGallery> slideshow.
 *  2. Bathrooms + square feet -> `facts`.
 *  3. In-unit amenities -> `amenities` (kitchen, lanai, laundry, A/C, Wi-Fi).
 *  4. A higher-resolution hero. Every supplied photo is 1280px wide, which is
 *     soft full-bleed on a retina display.
 */
