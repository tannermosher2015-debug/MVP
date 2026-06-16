/**
 * Photo gallery for /our-island — island scenery & lifestyle.
 *
 * Curated from Dayna's own Molokaʻi photos (not reused from other pages, so the
 * gallery has its own distinct images). Sources live in
 *   OneDrive/Desktop/Website Design Styles/Molokai/Images
 * and are optimized into public/images/gallery/ by `node scripts/build-gallery.mjs`.
 * Edit that script's SET to add/reorder, then paste its output here.
 */
export type GalleryPhoto = { src: string; alt: string };

export const GALLERY: GalleryPhoto[] = [
  { src: "/images/gallery/01-golden-beach.jpg", alt: "An empty golden-sand beach with clear shallows, looking across the channel to a neighbor island" },
  { src: "/images/gallery/02-rainbow-road.jpg", alt: "A full rainbow arching over a quiet country road lined with palms on Molokaʻi" },
  { src: "/images/gallery/03-sup-yoga-dawn.jpg", alt: "A paddler holding a headstand on a stand-up paddleboard over glassy dawn water, a neighbor island on the horizon" },
  { src: "/images/gallery/04-turquoise-cove.jpg", alt: "A turquoise cove rimmed by dark lava rock and golden sand on Molokaʻi's coast" },
  { src: "/images/gallery/05-valley-to-sea.jpg", alt: "A deep green sea-cliff valley opening to the ocean on Molokaʻi's wild north shore" },
  { src: "/images/gallery/06-dawn-kayak.jpg", alt: "A single kayak resting on the sand at first light beside calm, mirror-still water" },
  { src: "/images/gallery/07-moon-clouds.jpg", alt: "A full moon glowing through a blanket of moonlit clouds above silhouetted palms" },
  { src: "/images/gallery/08-ocean-rainbow.jpg", alt: "A full rainbow over the ocean seen from a dry kiawe hillside on Molokaʻi" },
  { src: "/images/gallery/09-reef-break.jpg", alt: "Clean surf peeling over a reef point along a rocky Molokaʻi shoreline" },
  { src: "/images/gallery/10-green-valley.jpg", alt: "A sweeping overlook of a green valley folding down to the blue Pacific" },
  { src: "/images/gallery/11-hibiscus.jpg", alt: "A vivid yellow-and-pink hibiscus blossom among glossy green leaves" },
  { src: "/images/gallery/12-paddleboards-aerial.jpg", alt: "An aerial view of two stand-up paddleboards crossing clear teal water" },
  { src: "/images/gallery/13-plumeria-heart.jpg", alt: "Plumeria blossoms arranged in the shape of a heart on green grass" },
  { src: "/images/gallery/14-monk-seal.jpg", alt: "A Hawaiian monk seal swimming at the surface of calm coastal water" },
  { src: "/images/gallery/15-beach-cove.jpg", alt: "A secluded sandy cove with footprints in the sand and gentle turquoise surf" },
];
