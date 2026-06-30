import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow full-quality optimization for hero imagery (default is [75]).
    qualities: [75, 100],
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
      { source: "/mls-searches", destination: "/mls-search", permanent: true },
      { source: "/about-us", destination: "/", permanent: true },
      { source: "/agents", destination: "/", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/author/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
