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
};

export default nextConfig;
