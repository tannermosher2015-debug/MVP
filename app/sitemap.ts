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
  "/community",
  "/reviews",
  "/maps",
  "/blog",
];

// The reasoning the blog block below already stated, now applied to the rest of the
// file. Everything except the posts used to carry `new Date()`, which stamps the
// BUILD date: measured 2026-09-05, 40 of the 44 URLs read 2026-09-04 and told Google
// that 40 pages had changed when one had. Google's sitemap docs say it stops trusting
// a lastmod that reads as unreliable, so an always-today column is worth less than no
// column at all, and its guidance where the real date is unknown is to omit the value.
// We cannot know it here: no source we can reach publishes a listing date (see
// newestFirst in lib/listings.ts), and the static and landing pages have no date field.
// So these three groups ship with no lastmod, and only the posts, which do carry a real
// date, keep theirs. If a real date ever becomes available, add it back per group.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ROUTES.map((path) => ({ url: `${SITE.url}${path}` }));
  // SEO landing pages by property type and town.
  const landingPages = LANDING_PAGES.map((p) => ({ url: `${SITE.url}/${p.slug}` }));
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
  }));
  return [...staticPages, ...landingPages, ...postPages, ...listingPages];
}
