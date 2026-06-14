/**
 * Photo gallery for /our-island — island scenery & lifestyle.
 *
 * STARTER SET: reuses existing scenic photos so the gallery is live now.
 * Replace / expand with curated shots dropped into
 *   OneDrive/Desktop/Websites/MomsWebsite/island-gallery   (12–20 is ideal)
 * — they get optimized into public/images/gallery/ and listed here.
 */
export type GalleryPhoto = { src: string; alt: string };

export const GALLERY: GalleryPhoto[] = [
  { src: "/images/hero-molokai.jpg", alt: "Golden-hour sunset over the calm waters of Molokaʻi's south shore" },
  { src: "/images/molokai-cliffs.jpg", alt: "Towering green sea cliffs along Molokaʻi's wild coastline" },
  { src: "/images/molokai-beach.jpg", alt: "A quiet golden-sand beach fringed by palms on Molokaʻi" },
  { src: "/images/molokai-bay.jpg", alt: "A sweeping Molokaʻi bay framed by sea cliffs and a crescent beach" },
  { src: "/images/intro-aerial.jpg", alt: "Aerial view of Kaunakakai town and the south shore at dusk" },
  { src: "/images/lifestyle-band.jpg", alt: "An oceanfront pool deck looking across the Pacific to the neighbor islands" },
  { src: "/images/molokai-pool.jpg", alt: "Poolside indoor-outdoor island living on Molokaʻi" },
];
