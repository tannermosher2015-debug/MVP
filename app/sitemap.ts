import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getListings } from "@/lib/listings";
import { LANDING_PAGES } from "@/lib/landing";
import { POSTS } from "@/lib/blog";

// Public, indexable static routes. Keep in sync with app/ when pages are added.
// No changeFrequency/priority anywhere below: Google ignores both tags outright.
const ROUTES = [
  "",
  "/listings",
  "/sold",
  "/mls-search",
  "/our-island",
  "/vacation-rentals",
  "/property-management",
  "/community",
  "/reviews",
  "/maps",
  "/blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticPages = ROUTES.map((path) => ({ url: `${SITE.url}${path}`, lastModified }));
  // SEO landing pages by property type and town.
  const landingPages = LANDING_PAGES.map((p) => ({ url: `${SITE.url}/${p.slug}`, lastModified }));
  // Blog posts carry their own real date, not the build date: an article's
  // lastmod is a claim about the article, and stamping "now" on every crawl
  // makes all of them look edited every deploy.
  const postPages = POSTS.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`,
    lastModified: new Date(`${p.updated ?? p.published}T00:00:00Z`),
  }));
  // Per-listing detail pages so Google indexes every active listing.
  const listingPages = (await getListings()).map((l) => ({
    url: `${SITE.url}/listings/${l.slug}`,
    lastModified,
  }));
  return [...staticPages, ...landingPages, ...postPages, ...listingPages];
}
