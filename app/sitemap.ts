import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getListings } from "@/lib/listings";
import { LANDING_PAGES } from "@/lib/landing";

// Public, indexable static routes. Keep in sync with app/ when pages are added.
const ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/listings", changeFrequency: "weekly", priority: 0.9 },
  { path: "/mls-search", changeFrequency: "monthly", priority: 0.6 },
  { path: "/our-island", changeFrequency: "monthly", priority: 0.7 },
  { path: "/community", changeFrequency: "monthly", priority: 0.7 },
  { path: "/reviews", changeFrequency: "monthly", priority: 0.7 },
  { path: "/maps", changeFrequency: "monthly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticPages = ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
  // SEO landing pages by property type and town.
  const landingPages = LANDING_PAGES.map((p) => ({
    url: `${SITE.url}/${p.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));
  // Per-listing detail pages so Google indexes every active listing.
  const listingPages = (await getListings()).map((l) => ({
    url: `${SITE.url}/listings/${l.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [...staticPages, ...landingPages, ...listingPages];
}
