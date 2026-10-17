import type { Metadata } from "next";
import { SITE } from "@/lib/site";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * Per-page Open Graph block. Next REPLACES openGraph wholesale when a page sets any of it
 * (generate-metadata docs, "Merging"), so a page that wants its own og:url, title or
 * description must restate the rest, and the root opengraph-image file stops applying to it
 * (the blog posts show this: no og:image at all). `images` defaults to the root image route.
 * Pages with an opengraph-image file of their own pass `images: false` to keep that one.
 */
export function pageOpenGraph(
  path: string,
  title: string,
  description: string,
  { images = true }: { images?: boolean } = {},
): OpenGraph {
  return {
    type: "website",
    locale: "en_US",
    siteName: SITE.name,
    url: `${SITE.url}${path}`,
    title,
    description,
    ...(images
      ? {
          images: [
            {
              url: "/opengraph-image",
              width: 1200,
              height: 630,
              alt: "Real Estate on Molokai: luxury & island real estate on Molokaʻi, Hawaiʻi",
            },
          ],
        }
      : {}),
  };
}
