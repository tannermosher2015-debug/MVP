/**
 * Central source of truth for company information.
 * Pulled from realestateonmolokai.net — edit here to update site-wide.
 */
export const SITE = {
  name: "Real Estate on Molokai",
  legalName: "Molokai Vacation Properties, Inc.",
  // Canonical production URL (no trailing slash). Used for metadataBase,
  // canonical tags, sitemap/robots and JSON-LD. Custom domain is the canonical;
  // NEXT_PUBLIC_SITE_URL on Vercel overrides this default if ever needed.
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://www.realestateonmolokai.com",
  license: "RB-22987",
  tagline: "Island living, found.",
  accolade: "Most properties sold in Maui County — 2026 · Top 10 in 2025",
  accoladeShort: "#1 in Maui County",
  heroHeadline: ["Extraordinary", "by nature."],
  heroSub:
    "Homes, oceanfront estates, condominiums and land on the island of Molokaʻi — the last unspoiled corner of Hawaiʻi.",

  broker: {
    name: "Dayna E. Harris",
    title: "Principal Broker",
    license: "RB-20019",
    bio: "Dayna arrived in Hawaiʻi in 1989 and, with her deep love of the ocean, made Molokaʻi home — buying land at Kawela Plantation in 1990, building her family's homes in 1994, and raising two sons on the island ever since. With 30+ years on-island — and 20+ years running Molokaʻi's largest property-management company — she knows every road, shoreline and neighborhood, and is the island's No. 1 lead buyer on Zillow.",
  },

  phone: "808.553.8335",
  phoneHref: "tel:+18085538335",
  fax: "808.553.8332",
  email: "dayna.harris@icloud.com",
  emailHref: "mailto:dayna.harris@icloud.com",

  address: {
    line1: "130 Kamehameha V Highway",
    city: "Kaunakakai",
    region: "Molokaʻi, Hawaiʻi",
    postal: "96748",
    landmark: "On the main highway between Paddlers Restaurant & Napa Auto Parts",
  },

  // Approximate office location in Kaunakakai (town-level) for LocalBusiness geo.
  geo: { lat: 21.0889, lng: -157.0203 },

  social: {
    facebook: "https://www.facebook.com/joysofislandlife",
  },

  // Dayna's live MLS listings on RAM (REALTORS Association of Maui)
  ramAgentUrl: "https://www.ramaui.com/Real-Estate-Agent/320830/Dayna-Harris",

  // Real team from realestateonmolokai.net/contact
  team: [
    {
      name: "Dayna E. Harris",
      role: "Principal Broker",
      license: "RB-20019",
      phone: "808.658.1717",
      phoneHref: "tel:+18086581717",
    },
    {
      name: "John Warring",
      role: "Broker",
      license: "RB-23397",
      phone: "808.658.5082",
      phoneHref: "tel:+18086585082",
      bio: "John's passion for real estate started early in life, and he later owned and operated his own brokerage before making Molokaʻi his full-time home. Today he proudly partners with Dayna Harris at Molokai Vacation Properties. John enjoys fishing, hunting, and spending time with his wife and their two daughters, embracing the unique lifestyle that makes Molokaʻi such a special place to call home.",
    },
    {
      name: "Clare Mawae",
      role: "REALTOR®",
      phone: "808.336.0946",
      phoneHref: "tel:+18083360946",
    },
  ],

  nav: [
    {
      label: "Listings",
      href: "/listings",
      children: [{ label: "MLS Search", href: "/mls-search" }],
    },
    { label: "Our Island", href: "/our-island" },
    { label: "Resorts", href: "/maps" },
    { label: "Local Businesses", href: "/community" },
    { label: "Reviews", href: "/reviews" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],

  // Molokaʻi towns, coastlines & resort communities (shown on the homepage
  // teaser and the dedicated Our Island page).
  areas: [
    { name: "Kaunakakai", note: "The island's friendly main town & harbor." },
    { name: "Kualapuʻu · Kalae", note: "Cool upcountry town — pastures, coffee fields & macadamia farms." },
    { name: "Maunaloa · West End", note: "Sunsets, golden beaches & open ranch land." },
    { name: "Kawela", note: "Two-acre hillside lots, all with sweeping ocean views." },
    { name: "Manaʻe · East End", note: "The lush, rainy east end — taro, fishponds & the road to Hālawa." },
    { name: "Molokai Shores", note: "Oceanfront condominiums steps from town." },
    { name: "Ke Nani Kai", note: "Resort condos near Kepuhi Beach." },
    { name: "Paniolo Hale", note: "Beautiful townhomes nestled in the trees." },
    { name: "Wavecrest", note: "East-end oceanfront garden condominiums." },
    { name: "Kepuhi Beach", note: "The wild west-end shoreline & greens." },
  ],

  // Local Molokaʻi pages worth following (shown on the Community page)
  localFollows: [
    { name: "Visit Molokaʻi", url: "https://www.facebook.com/VisitMolokai", note: "Island happenings, events & aloha." },
    { name: "Friendly Market", url: "https://www.facebook.com/friendlymkt", note: "Your Kaunakakai grocery." },
    { name: "Joys of Island Life", url: "https://www.facebook.com/joysofislandlife", note: "Dayna's Molokaʻi life & new listings." },
  ],

  services: [
    {
      title: "Real Estate Sales",
      body: "Buying or selling on Molokaʻi — full MLS access from beachfront estates to building sites and commercial property, led by the island's No. 1 agent.",
      icon: "Home",
    },
    {
      title: "Long-Term Rentals",
      body: "Dayna no longer manages long-term rentals herself, but she'll gladly connect you with a trusted Molokaʻi property manager.",
      icon: "Users",
    },
    {
      title: "Vacation Stays",
      body: "Dayna keeps a few of her own Molokaʻi condos available to rent — a comfortable home base while you visit or house-hunt.",
      icon: "Palmtree",
    },
  ],

  stats: [
    { value: "#1", label: "Maui County home sales · 2026" },
    { value: "30+", label: "Years on Molokaʻi" },
    { value: "100%", label: "Local, family-run" },
  ],
} as const;

export type SiteData = typeof SITE;
