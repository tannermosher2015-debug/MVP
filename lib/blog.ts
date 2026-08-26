/**
 * ============================================================================
 *  BLOG  -  island guides and buyer explainers
 * ============================================================================
 *  Each entry becomes a real, server-rendered, indexable page at /blog/<slug>
 *  (see app/blog/[slug]/page.tsx), listed on /blog.
 *
 *  WHY POSTS ARE DATA, NOT MARKDOWN: the repo has no MDX pipeline and no
 *  markdown parser, and adding one to publish three articles is not worth a
 *  dependency. The `body` block union below renders to semantic HTML through
 *  components/PostBody.tsx - same shape lib/landing.ts and lib/management.ts
 *  already use for page copy.
 *
 *  COPY RULE, same as everywhere else on this site: nothing invented. No market
 *  statistics, no median prices, no drive times, no tax or permit specifics, no
 *  superlatives that cannot be sourced. Every geographic and community claim
 *  below traces to SITE.areas in lib/site.ts or to copy already published on
 *  /our-island and the landing pages. See [[build-no-invented-facts]].
 *
 *  UNAPPROVED: these three posts were drafted in-house and publish under the
 *  brokerage's name. Dayna has not read them yet. Do not push until she has.
 * ============================================================================
 */

/** One rendered chunk of a post body. */
export type Block =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "list"; items: readonly string[] }
  | { kind: "pull"; text: string };

export interface Post {
  slug: string;
  /** <title> - the layout template appends the site name. */
  title: string;
  h1: string;
  metaDescription: string;
  eyebrow: string;
  /** Card copy on /blog, and the og:description on the post itself. */
  excerpt: string;
  /** ISO date. Rendered, and fed to BlogPosting datePublished. */
  published: string;
  /** Set only when a post is materially revised, not for typo fixes. */
  updated?: string;
  /** Existing /public/images photo. Alt text must describe the real photo. */
  hero: string;
  heroAlt: string;
  body: readonly Block[];
}

const POSTS_RAW: Post[] = [
  {
    slug: "where-to-live-on-molokai",
    title: "Where to Live on Molokaʻi",
    h1: "Where to Live on Molokaʻi",
    metaDescription:
      "A guide to Molokaʻi's towns, coastlines and resort communities, from Kaunakakai and Kawela to the upcountry, the West End and the road out to Hālawa.",
    eyebrow: "Island guide",
    excerpt:
      "Molokaʻi is 38 miles long and 10 miles wide, and each end of it keeps its own weather, its own pace and its own kind of property. Here is how the island divides up.",
    published: "2026-08-25",
    hero: "/images/oceanfront-compound.jpg",
    heroAlt:
      "A red-roofed oceanfront home on a Molokaʻi beach, framed by tall palms, with the dry hillside and scattered houses rising behind it",
    body: [
      {
        kind: "p",
        text: "Molokaʻi is small enough to drive end to end in an afternoon and varied enough that the two ends barely feel like the same island. Roughly 8,000 people live here, the majority of Hawaiian ancestry, and there is not a single building taller than a coconut palm. Where you choose to live decides your weather, your view, your drive to the grocery store and, more than anything, your neighbors.",
      },
      { kind: "h2", text: "Kaunakakai and the south shore" },
      {
        kind: "p",
        text: "Kaunakakai is the island's main town and harbor, and the friendly heart of everything: the main street of shops, the long wharf, and the calm water inside the reef. Most of Molokaʻi's real estate sits along this stretch, from in-town homes on quiet streets to the oceanfront condominiums at Molokai Shores. If you want to walk to the store and be in the water five minutes later, this is your side of the island.",
      },
      { kind: "h2", text: "Kawela, on the hillside above the reef" },
      {
        kind: "p",
        text: "Just east of town, Kawela Plantation rises off the highway in two-acre lots, and every one of them looks out over the reef and across the channel. It is quiet, green and residential, close enough to Kaunakakai for daily life and far enough up the hill for the view to open all the way out. Dayna bought land here in 1990 and built her family's homes here in 1994, so this is a neighborhood we can talk about from the inside.",
      },
      { kind: "h2", text: "Kualapuʻu and Kalae, upcountry" },
      {
        kind: "p",
        text: "Head inland and up, and the air cools. Kualapuʻu and Kalae are pasture, coffee fields and macadamia farms, a genuinely different climate from the shoreline a few miles below. This is where people go who want land around them and do not mind the drive to town.",
      },
      { kind: "h2", text: "Maunaloa and the West End" },
      {
        kind: "p",
        text: "Past the old plantation town of Maunaloa, the island opens into ranch country and then falls away to the golden sands of Kepuhi and Pāpōhaku, the island's longest beaches. The resort communities are out here: Ke Nani Kai, Paniolo Hale and Kepuhi Beach Resort. The West End is dry, golden and quiet, and it is the part of Molokaʻi most people are picturing when they picture a getaway.",
      },
      { kind: "h2", text: "Manaʻe and the East End" },
      {
        kind: "p",
        text: "East of Kawela the highway narrows and the rain arrives. Manaʻe is the lush end of Molokaʻi: taro, fishponds along the shoreline, and a road that winds all the way out to Hālawa. Wavecrest sits along this stretch, oceanfront garden condominiums right on the water. Living out here means green, quiet and a real drive to town, which is exactly the trade some people are looking for.",
      },
      { kind: "h2", text: "How to actually choose" },
      {
        kind: "pull",
        text: "You choose by driving it. The weather here changes noticeably in twenty minutes of highway.",
      },
      {
        kind: "p",
        text: "A lot that reads perfectly on paper can feel wrong once you are standing on it, and the reverse happens just as often. If you are planning a trip to look, tell us where you think you want to be before you come. We will build the day around showing you why you are right, or why you are not.",
      },
    ],
  },

  {
    slug: "condo-home-or-land-on-molokai",
    title: "Condo, Home or Land: Choosing Your First Molokaʻi Property",
    h1: "Condo, Home or Land",
    metaDescription:
      "The three ways to own on Molokaʻi and what each one really asks of you: a turnkey beachfront condominium, a single-family home, or a lot to build on.",
    eyebrow: "Buying on Molokaʻi",
    excerpt:
      "There are really only three doors into owning on Molokaʻi. Each asks something different of you, and the right one usually becomes obvious once you say out loud how you plan to use the place.",
    published: "2026-08-25",
    hero: "/images/west-end-cottage.jpg",
    heroAlt:
      "The view from under a covered lanai on Molokaʻi, across kiawe trees and a fenced green pasture to the ocean on the horizon",
    body: [
      {
        kind: "p",
        text: "Almost every conversation we have with a first-time Molokaʻi buyer comes down to the same fork. Condo, house, or land. The listings look different, the timelines are wildly different, and the honest answer usually depends less on budget than on how much of your own time you want to spend on the place.",
      },
      { kind: "h2", text: "A condo, if you want it simple" },
      {
        kind: "p",
        text: "Molokaʻi's condominiums cluster into a handful of beachfront communities: Molokai Shores near Kaunakakai, Wavecrest out east, and Ke Nani Kai, Paniolo Hale and Kepuhi Beach Resort on the West End. They are the island's most turnkey way to own a place by the water. The grounds are looked after, the unit is generally ready to use, and you can lock the door and fly home. For people who will be here a few weeks a year, this is usually the right door.",
      },
      { kind: "h2", text: "A house, if you want to actually live here" },
      {
        kind: "p",
        text: "Single-family homes on Molokaʻi are few and rarely listed. They run from plantation-era cottages in town to oceanfront family compounds on the south shore. A house gives you the yard, the privacy and the room, and it hands you the maintenance in return. Island maintenance is its own subject: most building materials come from off-island, and the list of tradespeople you can call is short. Owning a house here works best if you are here often, or if you have someone local you trust.",
      },
      { kind: "h2", text: "Land, if you have time and a picture in your head" },
      {
        kind: "p",
        text: "Vacant land is the most Molokaʻi of the three: ranch acreage, ocean-view lots, and parcels where you can still build exactly the life you imagined. It also asks the most of you. Before you fall in love with a lot, the questions that matter are access, water, power, and what it will genuinely take to put a house on it. Those answers vary parcel by parcel here, so ask them early, and ask them about that specific lot rather than about the island in general.",
      },
      { kind: "h2", text: "Five questions we would ask you" },
      {
        kind: "list",
        items: [
          "How many weeks a year will you really be here?",
          "Do you want to walk to town, or is a drive fine?",
          "Is this a place to use, a place to retire to, or something to hold?",
          "Are you willing to manage a build, on an island timeline?",
          "Who looks after the property in the months you are away?",
        ],
      },
      {
        kind: "p",
        text: "Answer those five out loud and the door usually picks itself. If you would rather just talk it through, call the office and ask. That conversation is free, and it saves people a great deal of wasted looking.",
      },
    ],
  },

  {
    slug: "molokai-condo-communities",
    title: "Molokaʻi's Condo Communities, Explained",
    h1: "Molokaʻi's Condo Communities, Explained",
    metaDescription:
      "Molokai Shores, Wavecrest, Ke Nani Kai, Paniolo Hale and Kepuhi Beach Resort: where each Molokaʻi condominium community sits, and the buyer each one tends to suit.",
    eyebrow: "Condos",
    excerpt:
      "Five names come up again and again in Molokaʻi condo listings. Here is where each one sits, what the setting is like, and the kind of buyer each tends to suit.",
    published: "2026-08-25",
    hero: "/images/molokai-shores.jpg",
    heroAlt:
      "Oceanfront condominium grounds on Molokaʻi with palms beside the shoreline",
    body: [
      {
        kind: "p",
        text: "If you have been reading Molokaʻi condo listings for more than a week, the same five names keep appearing. They are not interchangeable. They sit at different ends of a 38-mile island with genuinely different weather, and that difference will shape your days here far more than the floor plans will.",
      },
      { kind: "h2", text: "Molokai Shores" },
      {
        kind: "p",
        text: "Oceanfront condominiums steps from Kaunakakai, on the calm south-shore water inside the reef. This is the one to look at if you want town within reach: the store, the wharf and the restaurants are all close. The setting is green and low-rise, with lawn running down toward the shoreline.",
      },
      { kind: "h2", text: "Wavecrest" },
      {
        kind: "p",
        text: "Out on the East End, Wavecrest is oceanfront garden condominiums directly on the water. This is the lush, rainy side of the island, where the highway winds through valleys on its way to Hālawa. It is quiet in a way the West End is not, and it is a real drive to town, which for the right buyer is the entire point.",
      },
      { kind: "h2", text: "Ke Nani Kai" },
      {
        kind: "p",
        text: "On the West End near Kepuhi Beach, Ke Nani Kai sits above the shoreline in open lawn and palms. The West End is the dry, golden end of Molokaʻi, and this is the resort-style side of island living: space, sunsets, and the beach a short walk down.",
      },
      { kind: "h2", text: "Paniolo Hale" },
      {
        kind: "p",
        text: "Also on the West End, Paniolo Hale is townhomes nestled in the trees, with a quieter and more tucked-away feel than its neighbors. People who like it tend to like it very specifically, and they usually know the property by name before they ever call us.",
      },
      { kind: "h2", text: "Kepuhi Beach Resort" },
      {
        kind: "p",
        text: "The West End's shoreline property, right at Kepuhi, where the wild west-end coast meets the greens. This is the closest thing on Molokaʻi to waking up in the surf.",
      },
      { kind: "h2", text: "Which one is right" },
      {
        kind: "pull",
        text: "The question that sorts all five is how you feel about a drive.",
      },
      {
        kind: "p",
        text: "East End means green, wet and remote. West End means dry, golden and a genuine trip to the grocery store. Kaunakakai means everything is close. Everything after that is detail, and the detail gets much easier to sort once you have stood in all three. If you tell us which of those three sentences sounds like your morning, we can narrow the search to a handful of units before you even book a flight.",
      },
    ],
  },
];

/** Newest first. Sorted once at module load, not per request. */
export const POSTS: readonly Post[] = [...POSTS_RAW].sort((a, b) =>
  b.published.localeCompare(a.published),
);

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/**
 * Reading time, computed rather than stored so it can never drift out of sync
 * with an edited body. 200 wpm, rounded up, floored at 1.
 */
export function readMinutes(post: Post): number {
  const words = post.body.reduce((n, block) => {
    const text = block.kind === "list" ? block.items.join(" ") : block.text;
    return n + text.trim().split(/\s+/).length;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}

/** "August 25, 2026" - parsed as UTC so the date never slips a day by timezone. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
