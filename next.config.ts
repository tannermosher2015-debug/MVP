import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
