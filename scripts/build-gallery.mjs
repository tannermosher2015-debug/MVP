// Build the /our-island photo gallery from curated source photos.
// - Decodes HEIC via heic-convert (sharp's bundled libheif can't decode pixels here).
// - Applies EXIF orientation, resizes to a web-friendly long edge, strips metadata.
// Re-runnable: edit SET, run `node scripts/build-gallery.mjs`, paste the printed
// list into lib/gallery.ts.
//
// Excluded from SET on purpose: IMG_0777 / IMG_0780 / IMG_3679 carry third-party
// photographer watermarks (Kanemitsu / Mawae / Pauole) — don't publish without
// rights. "unnamed (1).jpg" is an exact duplicate of "unnamed.jpg".
import sharp from "sharp";
import convert from "heic-convert";
import { readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = "C:/Users/Tanne/OneDrive/Desktop/Website Design Styles/Molokai/Images";
const OUT = "C:/Users/Tanne/MVP/public/images/gallery";
const MAX = 2000; // long-edge px
mkdirSync(OUT, { recursive: true });

// Ordered for the mosaic: portraits land on the "tall" tiles (indices 0,4,6 …).
const SET = [
  { src: "IMG_8690.JPG",   out: "01-golden-beach.jpg",       alt: "An empty golden-sand beach with clear shallows, looking across the channel to a neighbor island" },
  { src: "IMG_0458.JPG",   out: "02-rainbow-road.jpg",       alt: "A full rainbow arching over a quiet country road lined with palms on Molokaʻi" },
  { src: "image000000.JPG",out: "03-sup-yoga-dawn.jpg",      alt: "A paddler holding a headstand on a stand-up paddleboard over glassy dawn water, a neighbor island on the horizon" },
  { src: "IMG_1332.JPG",   out: "04-turquoise-cove.jpg",     alt: "A turquoise cove rimmed by dark lava rock and golden sand on Molokaʻi's coast" },
  { src: "IMG_0965.heic",  out: "05-valley-to-sea.jpg",      alt: "A deep green sea-cliff valley opening to the ocean on Molokaʻi's wild north shore" },
  { src: "IMG_9748.JPG",   out: "06-dawn-kayak.jpg",         alt: "A single kayak resting on the sand at first light beside calm, mirror-still water" },
  { src: "IMG_4555.HEIC",  out: "07-moon-clouds.jpg",        alt: "A full moon glowing through a blanket of moonlit clouds above silhouetted palms" },
  { src: "IMG_3465 2.jpg", out: "08-ocean-rainbow.jpg",      alt: "A full rainbow over the ocean seen from a dry kiawe hillside on Molokaʻi" },
  { src: "IMG_4979.HEIC",  out: "09-reef-break.jpg",         alt: "Clean surf peeling over a reef point along a rocky Molokaʻi shoreline" },
  { src: "IMG_0964.heic",  out: "10-green-valley.jpg",       alt: "A sweeping overlook of a green valley folding down to the blue Pacific" },
  { src: "IMG_2723.JPG",   out: "11-hibiscus.jpg",           alt: "A vivid yellow-and-pink hibiscus blossom among glossy green leaves" },
  { src: "IMG_0838.JPG",   out: "12-paddleboards-aerial.jpg",alt: "An aerial view of two stand-up paddleboards crossing clear teal water" },
  { src: "IMG_6389.heic",  out: "13-plumeria-heart.jpg",     alt: "Plumeria blossoms arranged in the shape of a heart on green grass" },
  { src: "IMG_4929.JPG",   out: "14-monk-seal.jpg",          alt: "A Hawaiian monk seal swimming at the surface of calm coastal water" },
  { src: "unnamed.jpg",    out: "15-beach-cove.jpg",         alt: "A secluded sandy cove with footprints in the sand and gentle turquoise surf" },
];

async function load(file) {
  if (/\.heic$/i.test(file)) {
    const jpg = await convert({ buffer: readFileSync(join(SRC, file)), format: "JPEG", quality: 0.95 });
    return sharp(jpg);
  }
  return sharp(join(SRC, file));
}

for (const p of SET) {
  const img = (await load(p.src)).rotate();
  const info = await img
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(join(OUT, p.out));
  console.log(`${p.out.padEnd(26)} ${String(info.width).padStart(4)}x${String(info.height).padEnd(4)} ${String(Math.round(info.size / 1024)).padStart(4)}KB`);
}

console.log("\n--- paste into lib/gallery.ts ---");
for (const p of SET) {
  console.log(`  { src: "/images/gallery/${p.out}", alt: ${JSON.stringify(p.alt)} },`);
}
