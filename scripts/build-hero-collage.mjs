// Rebuild the /our-island HERO collage (public/images/our-island-collage.jpg).
//
// 4x2 mosaic of 8 distinct scenics (none reused from the photo gallery below):
//   reef aerial · whale · sea cliffs · Papōhaku        (row 1)
//   Twenty-Mile · sunset · golden beach · Kawela       (row 2)
// The reef/cliffs/sunset/beach tiles are sliced from the user's ORIGINAL collage
// (scripts/original-collage.jpg) — dropping its Halawa / lot / duplicate-sunset
// tiles and cropping the "island" tile to a uniform landscape cell. Papōhaku +
// Twenty-Mile are © MPauole and the whale is © JLR — watermarks kept as credits
// per the owner.
//
// Re-run: node scripts/build-hero-collage.mjs
import sharp from "sharp";

const HERO = "C:/Users/Tanne/MVP/scripts/hero-sources"; // all full-res tiles (committed, re-runnable)
const OLD = "C:/Users/Tanne/MVP/scripts/original-collage.jpg"; // preserved original (2000x667)
const OUT = "C:/Users/Tanne/MVP/public/images/our-island-collage.jpg";

const CW = 2400, CH = 1000, COLS = 4, ROWS = 2;
const cw = CW / COLS, ch = CH / ROWS; // 600 x 500 cells (1.2:1)

const sliceBuf = (left, top, width, height) =>
  sharp(OLD).extract({ left, top, width, height }).toBuffer();

// Kept tiles sliced from the old 2000x667 mosaic. Measured seams: cols x=1000/1499
// (top) & 499/1000 (bottom); row split y=332. Slices sit just inside each tile.
const reef = await sliceBuf(6, 6, 988, 320);      // top-left  aerial reef lagoon   [0,1000]
const cliffs = await sliceBuf(1503, 6, 490, 320); // top-right sea cliffs + islet   [1499,2000]
const sunset = await sliceBuf(6, 338, 487, 323);  // bottom-left golden sunset      [0,499]
const beach = await sliceBuf(503, 338, 490, 323); // bottom-2nd golden beach        [499,1000]

const fullHero = (file) => sharp(`${HERO}/${file}`).rotate().toBuffer();

const cell = async (input, position = "centre") =>
  sharp(input).resize(cw, ch, { fit: "cover", position }).jpeg().toBuffer();

// Grid order: row 0 then row 1, left→right. Two © MPauole aerial beaches
// (Papōhaku, Twenty-Mile) kept on opposite corners so they don't sit adjacent.
const cells = [
  await cell(reef),                                       // r0c0
  await cell(await fullHero("whale.JPG")),                // r0c1  breaching humpback (© JLR)
  await cell(cliffs, "south"),                            // r0c2  trim sky off the island shot
  await cell(await fullHero("papohaku.jpg")),             // r0c3  Papōhaku (© MPauole)
  await cell(await fullHero("20mile.jpeg")),              // r1c0  Twenty-Mile Beach (© MPauole)
  await cell(sunset),                                     // r1c1
  await cell(beach),                                      // r1c2
  await cell(await fullHero("kawela.jpg")),               // r1c3
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
