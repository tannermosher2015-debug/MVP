/**
 * Photo gallery for /our-island — island scenery & lifestyle.
 *
 * Curated from Dayna's own Molokaʻi photos. Sources live in
 *   OneDrive/Desktop/Website Design Styles/Molokai Vacation Properties/Images
 * (copied to scripts/_gsrc for a reliable build), optimized into
 * public/images/gallery/ by `node scripts/build-gallery.mjs`. Edit that script's
 * SET to add/reorder, then paste its output here. Excluded: the sunset
 * ("Bighero.jpg") is the page hero; IMG_0780 (© Clare Mawae) is watermarked;
 * "Papohauku Beach replace.jpeg" is an exact duplicate of 20mile.jpeg.
 */
export type GalleryPhoto = { src: string; alt: string };

export const GALLERY: GalleryPhoto[] = [
  { src: "/images/gallery/01-golden-beach.jpg", alt: "An empty golden-sand beach with clear shallows, looking across the channel to a neighbor island" },
  { src: "/images/gallery/03-sup-yoga-dawn.jpg", alt: "A paddler holding a headstand on a stand-up paddleboard over glassy dawn water, a neighbor island on the horizon" },
  { src: "/images/gallery/04-turquoise-cove.jpg", alt: "A turquoise cove rimmed by dark lava rock and golden sand on Molokaʻi's coast" },
  { src: "/images/gallery/05-valley-to-sea.jpg", alt: "A deep green sea-cliff valley opening to the ocean on Molokaʻi's wild north shore" },
  { src: "/images/gallery/06-dawn-kayak.jpg", alt: "A single stand-up paddle board resting on the sand at first light beside calm, mirror-still water" },
  { src: "/images/gallery/07-moon-clouds.jpg", alt: "A full moon glowing through a blanket of moonlit clouds above silhouetted palms" },
  { src: "/images/gallery/08-ocean-rainbow.jpg", alt: "A full rainbow over the ocean seen from a dry kiawe hillside on Molokaʻi" },
  { src: "/images/gallery/09-reef-break.jpg", alt: "Clean surf peeling over a reef point along a rocky Molokaʻi shoreline" },
  { src: "/images/gallery/10-green-valley.jpg", alt: "A sweeping overlook of a green valley folding down to the blue Pacific" },
  { src: "/images/gallery/11-hibiscus.jpg", alt: "A vivid yellow-and-pink hibiscus blossom among glossy green leaves" },
  { src: "/images/gallery/12-paddleboards-aerial.jpg", alt: "An aerial view of two stand-up paddleboards crossing clear teal water" },
  { src: "/images/gallery/13-plumeria-heart.jpg", alt: "Plumeria blossoms arranged in the shape of a heart on green grass" },
  { src: "/images/gallery/14-monk-seal.jpg", alt: "A Hawaiian monk seal swimming at the surface of calm coastal water" },
  { src: "/images/gallery/15-beach-cove.jpg", alt: "A secluded sandy cove with footprints in the sand and gentle turquoise surf" },
  { src: "/images/gallery/16-twenty-mile.jpg", alt: "Pāpōhaku Beach — Molokaʻi's legendary white-sand beach, nearly three miles long on the West End" },
  { src: "/images/gallery/17-halawa.jpg", alt: "An aerial view of Hālawa Valley's green sea cliffs meeting the ocean on Molokaʻi's east end" },
  { src: "/images/gallery/18-kawela.jpg", alt: "Turquoise shallows over the reef at Kawela on Molokaʻi's south shore" },
  { src: "/images/gallery/19-whale.jpg", alt: "A humpback whale breaching in the channel off Molokaʻi" },
  { src: "/images/gallery/20-fern-trail.jpg", alt: "A trail winding through lush green ferns in Molokaʻi's uplands" },
  { src: "/images/gallery/22-coast-aerial.jpg", alt: "Green sea-slopes meeting the turquoise shallows along Molokaʻi's shore, seen from above" },
  { src: "/images/gallery/23-aloha-sign.jpg", alt: "A hand-painted roadside sign reading “Aloha — Slow Down, Molokaʻi”" },
  { src: "/images/gallery/24-twilight.jpg", alt: "A dramatic pink-and-blue twilight sky over the ocean on Molokaʻi" },
  { src: "/images/gallery/25-palm-sunset.jpg", alt: "Palm trees silhouetted against a golden sunset over the Molokaʻi shoreline" },
  { src: "/images/gallery/26-south-shore.jpg", alt: "An aerial view of Molokaʻi's south-shore coastline and turquoise reef" },
];
