import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Molokaʻi RE",
    description:
      "Homes, condominiums, land and oceanfront estates on the island of Molokaʻi, Hawaiʻi.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7ef",
    theme_color: "#211814",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
