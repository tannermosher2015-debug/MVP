import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getListings } from "@/lib/listings";
import { LANDING_PAGES } from "@/lib/landing";

// Public, indexable static routes. Keep in sync with app/ when pages are added.
// No changeFrequency/priority anywhere below: Google ignores both tags outright.
const ROUTES = [
  "",
  "/listings",
  "/sold",
  "/mls-search",
  "/our-island",
  "/vacation-rentals",
  "/community",
  "/reviews",
  "/maps",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticPages = ROUTES.map((path) => ({ url: `${SITE.url}${path}`, lastModified }));
  // SEO landing pages by property type and town.
  const landingPages = LANDING_PAGES.map((p) => ({ url: `${SITE.url}/${p.slug}`, lastModified }));
  // Per-listing detail pages so Google indexes every active listing.
  const listingPages = (await getListings()).map((l) => ({
    url: `${SITE.url}/listings/${l.slug}`,
    lastModified,
  }));
  return [...staticPages, ...landingPages, ...listingPages];
}
