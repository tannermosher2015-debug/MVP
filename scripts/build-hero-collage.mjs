// Rebuild the /our-island HERO collage (public/images/our-island-collage.jpg).
//
// Keeps the original collage's DISTINCT scenic tiles (reef aerial, sea cliffs,
// sunset, golden beach) — these are NOT in the photo gallery below, so no dupes —
// drops Halawa / the lot / the duplicate sunset, crops the "island" tile into a
// uniform landscape cell (fixes the ratio), and adds full-res Papōhaku (kept WITH
// its © MPauole credit per the owner) + Kawela.
//
// Slots reserved for the Whale + Twenty-Mile photos when they arrive: add them to
// SRC, extend NEW[], bump the grid (e.g. 4x2), and re-run.
//
// Re-run: node scripts/build-hero-collage.mjs   (slices from the preserved
// original collage; writes the live hero image).
import sharp from "sharp";

const SRC = "C:/Users/Tanne/OneDrive/Desktop/Website Design Styles/Molokai/Images";
const OLD = "C:/Users/Tanne/MVP/scripts/original-collage.jpg"; // preserved original (2000x667)
const OUT = "C:/Users/Tanne/MVP/public/images/our-island-collage.jpg";

const CW = 2400, CH = 1000, COLS = 3, ROWS = 2;
const cw = CW / COLS, ch = CH / ROWS; // 800 x 500 cells (1.6:1)

const sliceBuf = (left, top, width, height) =>
  sharp(OLD).extract({ left, top, width, height }).toBuffer();

// Kept tiles sliced from the old 2000x667 mosaic (small insets avoid seam slivers).
const reef = await sliceBuf(6, 6, 968, 321);     // top-left  aerial reef lagoon
const cliffs = await sliceBuf(1486, 6, 508, 321); // top-right sea cliffs + islet ("the island")
const sunset = await sliceBuf(6, 339, 478, 322);  // bottom-left golden sunset
const beach = await sliceBuf(496, 339, 498, 322); // bottom-2nd golden beach

const full = (file) => sharp(`${SRC}/${file}`).rotate().toBuffer();

const cell = async (input, position = "centre") =>
  sharp(input).resize(cw, ch, { fit: "cover", position }).jpeg().toBuffer();

// Grid order: row 0 then row 1, left→right.
const cells = [
  await cell(reef),                                       // r0c0
  await cell(cliffs, "south"),                            // r0c1  trim sky off the island shot
  await cell(await full("Papohauku Beach replace.jpeg")), // r0c2  NEW (credit kept)
  await cell(sunset),                                     // r1c0
  await cell(beach),                                      // r1c1
  await cell(await full("Kawela.jpeg")),                  // r1c2  "one more"
];

const composites = cells.map((buf, i) => ({
  input: buf,
  left: (i % COLS) * cw,
  top: Math.floor(i / COLS) * ch,
}));

const info = await sharp({
  create: { width: CW, height: CH, channels: 3, background: "#1c140f" },
})
  .composite(composites)
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(OUT);

console.log("our-island-collage.jpg", info.width + "x" + info.height, Math.round(info.size / 1024) + "KB");
