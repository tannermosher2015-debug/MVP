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

/**
 * Sleeping capacity. Murphy bed takes two, the day bed takes one.
 *
 * Corrected from 4 on 2026-07-16: the earlier "Murphy bed and pull-down couch"
 * was a misreading, and it went live. There is no pull-down couch. Single
 * source of truth so the facts grid and the inquiry form's guest limit cannot
 * drift apart.
 */
const SLEEPS = 3;

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
    "A ground-floor studio at Kepuhi Beach Resort, sleeping three. Low-rise cedar buildings set on open lawns above the shoreline, where the golden sand of Kepuhi Beach starts a short walk from the door.",

  /**
   * The facts grid. Order here is the order on the page.
   *
   * "Layout: Studio" rather than "Bedrooms: 0", because components/ListingCard.tsx
   * already renders 0-bed units as "Studio" sitewide, so this matches.
   */
  facts: [
    { label: "Layout", value: "Studio" },
    // One bathroom: the photos show a single vanity, shower and toilet room,
    // and the owner confirmed. The comparable studio at 1182 is also 1 bath.
    { label: "Bathrooms", value: "1" },
    {
      label: "Sleeps",
      value: String(SLEEPS),
      // How a studio sleeps three is the first thing a guest asks. Owner-confirmed.
      note: "Murphy bed for two, plus a day bed",
    },
    // Square feet is still NOT listed: nobody has confirmed a number, and an
    // absent cell beats a guessed one. Add a fourth entry when known; the grid
    // re-flows to 4-up on its own.
  ] as { label: string; value: string; note?: string }[],

  /**
   * Owner-set, 2026-07-16, superseding the earlier "rates on request".
   *
   * Stated exactly as given: $100 a night PLUS TAX, and a $125 cleaning fee.
   * Do not quote a tax-inclusive figure or a total. Hawaii transient
   * accommodations tax plus GET applies, nobody has confirmed the combined
   * rate, and a wrong total on a booking page is a dispute waiting to happen.
   *
   * Minimum stay is still unknown, so nothing on the page claims one.
   */
  rates: {
    headline: "$100 a night",
    body: "Plus tax, and a one-time $125 cleaning fee.",
    cta: "Send your dates",
  },

  /** Guest limit on the inquiry form. Tied to capacity so they can't drift. */
  maxGuests: SLEEPS,

  /**
   * In-unit amenities. Every line here is something visibly in frame in
   * `interiorPhotos`, confirmed by the owner. Nothing is inferred from what a
   * studio "usually" has.
   *
   * Deliberately NOT listed, because no photo shows them and nobody confirmed
   * them: air conditioning, Wi-Fi, laundry, parking for this unit specifically.
   * Deliberately NOT called a "full kitchen" either: there's a cooktop and a
   * toaster oven, no wall oven, and guests booking a week would notice.
   */
  amenities: [
    "Kitchen with cooktop, microwave and toaster oven",
    "Full-size refrigerator",
    "Dining table and chairs",
    "Ceiling fan",
    "Television",
    "Walk-in tiled shower",
    "Lanai with outdoor seating",
  ] as string[],

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
   * Inside the studio. Order here is the display order, a walk-through: the
   * room as you find it, the Murphy bed down, living, the view out, kitchen,
   * lanai, bath. The numeric filename prefixes are arrival order, not display
   * order; this array is what the page follows.
   *
   * KNOWN INCONSISTENCY, published on the owner's explicit call (2026-07-16).
   * 08 and 09 show large grey floor tile; 01-07 show wood-look plank. Same rug,
   * same coffee table, same room, so one set predates a floor change. The owner
   * was shown the side-by-side and chose to publish all nine regardless. If a
   * guest ever queries the floor, this is why: re-shoot the ocean-view angle on
   * the current floor and drop 08/09.
   *
   * 08 is pre-cropped to 3:2 anchored right. The source is 16:9 and the gallery
   * frame is 3:2, so object-cover was trimming ~100px a side and taking the
   * ocean with it, which is the only reason that photo is worth having.
   */
  interiorPhotos: [
    {
      src: "/images/rental/interior/01-living-kitchen.jpg",
      alt: "The studio looking in: the Murphy bed cabinet closed on the left, kitchen along the back wall, and a wooden daybed with navy cushions beside a tiled coffee table",
    },
    {
      src: "/images/rental/interior/02-murphy-bed-down.jpg",
      alt: "The Murphy bed folded down and made up with white linen, beside sliding doors open onto the lanai and lawn",
    },
    {
      src: "/images/rental/interior/03-living-tv.jpg",
      alt: "The living area with the daybed, an armchair and footstool, a wall-mounted television and a wooden ceiling fan",
    },
    {
      src: "/images/rental/interior/08-living-ocean-view.jpg",
      alt: "The living area looking out through the sliding doors, past the lanai and lawn to open ocean on the horizon",
    },
    {
      src: "/images/rental/interior/04-kitchen-lanai-door.jpg",
      alt: "The kitchen's wooden cabinetry and full-size fridge, with a sliding door open to the lanai and greenery beyond",
    },
    {
      src: "/images/rental/interior/05-kitchen.jpg",
      alt: "The kitchen counter with a cooktop, microwave, toaster oven and sink, next to a dining table and rattan chairs",
    },
    {
      src: "/images/rental/interior/09-lanai.jpg",
      alt: "The unit's lanai outside the sliding doors, with cushioned wicker loungers, a rattan dining table and chairs, and a bamboo screen",
    },
    {
      src: "/images/rental/interior/06-bath-vanity.jpg",
      alt: "The bathroom vanity with a mirror and light, and a separate room beyond holding the toilet and towel rail",
    },
    {
      src: "/images/rental/interior/07-bath-shower.jpg",
      alt: "A tiled walk-in shower with a glass-block wall, pebbled floor and built-in shelf niches",
    },
  ],

  /**
   * The grounds and the beach. Captions describe only what is visibly in frame.
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
