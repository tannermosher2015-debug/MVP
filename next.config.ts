import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow full-quality optimization for hero imagery (default is [75]).
    // 90 must be listed: a quality={90} not in this allowlist is served at 100,
    // which silently made the /our-island hero a 317KB LCP image.
    qualities: [75, 90, 100],
    // MLS listing photos served from RAM / SaleCORE.
    remotePatterns: [
      { protocol: "https", hostname: "mlsimages.salecore.com" },
      { protocol: "https", hostname: "media.salecore.com" },
      // Paragon RESO Web API media (exact host confirmed at activation).
      { protocol: "https", hostname: "**.paragonrels.com" },
      { protocol: "https", hostname: "**.paragonapi.com" },
    ],
  },
  // Old WordPress (.net) URLs -> matching new pages. The .net -> .com domain
  // redirect preserves the path, so these catch the legacy paths once they land
  // on this app and 308 them to the right page (instead of dead-ending in 404s,
  // which would drop the old pages' search equity during the migration).
  async redirects() {
    return [
      { source: "/houses", destination: "/molokai-homes-for-sale", permanent: true },
      { source: "/condominiums", destination: "/molokai-condos-for-sale", permanent: true },
      { source: "/land", destination: "/molokai-land-for-sale", permanent: true },
      { source: "/commercial", destination: "/listings", permanent: true },
      { source: "/all-listings", destination: "/listings", permanent: true },
      { source: "/properties/:path*", destination: "/listings", permanent: true },
      // Old WordPress had a page per resort map: /maps-wavecrest/, /maps-kawela/,
      // /maps-kepuhi-beach-resort/ and siblings. Google still indexes several, and the
      // .net domain redirect preserves the path, so each one landed on a 404 here.
      // One pattern rather than seven, so slugs we never enumerated are covered too.
      { source: "/maps-:slug", destination: "/maps", permanent: true },
      { source: "/mls-searches", destination: "/mls-search", permanent: true },
      { source: "/about-us", destination: "/", permanent: true },
      { source: "/agents", destination: "/", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/author/:path*", destination: "/", permanent: true },
      // Guessed URLs, not old WordPress paths. GA4's page-path report for the 28 days
      // to 2026-08-05 shows six different spellings of "contact" being requested, which
      // is what URL GUESSING looks like rather than one stale backlink: an assistant or
      // directory inventing a plausible address. chatgpt.com/ai-assistant is already a
      // traffic source here. 10 of the 18 remaining 404 views were someone trying to
      // reach Dayna, which on a lead-gen site is the worst thing to drop on the floor.
      //
      // Not soft 404s: the content EXISTS and these land on it. Contrast the delisted
      // listings in app/listings/[slug]/not-found.tsx, which correctly keep their 404
      // because that content is genuinely gone.
      { source: "/contact-us", destination: "/#contact", permanent: true },
      { source: "/connect", destination: "/#contact", permanent: true },
      { source: "/get-in-touch", destination: "/#contact", permanent: true },
      { source: "/reach-out", destination: "/#contact", permanent: true },
      { source: "/reach-us", destination: "/#contact", permanent: true },
      { source: "/about-us/contact", destination: "/#contact", permanent: true },
      { source: "/about/contact", destination: "/#contact", permanent: true },
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/agent-profile", destination: "/#about", permanent: true },
      { source: "/molokai-information", destination: "/our-island", permanent: true },
      // The vacation property management page was removed 2026-08-28: Dayna is
      // only managing her own Kepuhi condo for now, so the site no longer offers
      // the service. The URL was indexed and ranking, so it redirects rather
      // than 404s.
      { source: "/property-management", destination: "/", permanent: true },
    ];
  },
  // Baseline security headers. HSTS is already set by Vercel; a full CSP is
  // deferred (it needs a tested allowlist for GTM/GA, Vercel, web3forms, leaflet
  // tiles, next/image + next/font, and inline scripts). X-Frame-Options covers
  // the clickjacking case in the meantime.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
