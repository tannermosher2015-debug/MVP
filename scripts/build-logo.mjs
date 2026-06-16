// Build web logos + John's portrait from the brand source files.
//  - logo.png       : transparent bg, original colours (brown text) — for LIGHT backgrounds
//  - logo-dark.png  : transparent bg, cream text + colour sun        — for DARK backgrounds
//  - john-portrait.jpg : pro family portrait cropped to the 4:5 broker card
// Re-run: node scripts/build-logo.mjs
import sharp from "sharp";

const DIR = "C:/Users/Tanne/OneDrive/Desktop/Website Design Styles/Molokai Vacation Properties";
const OUT = "C:/Users/Tanne/MVP/public/images";

// ---- Logo: white-key to transparent, then a cream-text variant for dark bg ----
const trimmed = sharp(`${DIR}/MVP Logo2.jpeg`).trim({ threshold: 12 }).ensureAlpha();
const { data, info } = await trimmed.raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

const color = Buffer.from(data); // white -> transparent, colours kept
for (let i = 0; i < color.length; i += 4) {
  if (color[i] >= 245 && color[i + 1] >= 245 && color[i + 2] >= 245) color[i + 3] = 0;
}

const dark = Buffer.from(color); // additionally recolour brown text/line -> cream
for (let i = 0; i < dark.length; i += 4) {
  if (dark[i + 3] === 0) continue;
  const r = dark[i], g = dark[i + 1], b = dark[i + 2];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const lum = 0.3 * r + 0.59 * g + 0.11 * b;
  const sat = max === 0 ? 0 : (max - min) / max;
  if (lum < 120 && sat < 0.5) { dark[i] = 243; dark[i + 1] = 235; dark[i + 2] = 221; } // cream
}

const raw = (buf) => sharp(buf, { raw: { width, height, channels: 4 } });
const cInfo = await raw(color).resize({ width: 800 }).png().toFile(`${OUT}/logo.png`);
await raw(dark).resize({ width: 800 }).png().toFile(`${OUT}/logo-dark.png`);
console.log(`logo.png / logo-dark.png  ${cInfo.width}x${cInfo.height}`);

// previews over light + dark swatches
await raw(color).resize({ width: 600 }).flatten({ background: "#fbf7f0" }).jpeg().toFile("C:/Users/Tanne/MVP/.logo-on-light.jpg");
await raw(dark).resize({ width: 600 }).flatten({ background: "#211814" }).jpeg().toFile("C:/Users/Tanne/MVP/.logo-on-dark.jpg");

// ---- John: crop the 1086x1448 portrait to 4:5 (keep faces; trim pavement) ----
const jInfo = await sharp(`${DIR}/JohnWarringPhoto.png`)
  .rotate()
  .extract({ left: 0, top: 0, width: 1086, height: 1358 }) // 1086x1358 ~= 4:5
  .resize({ width: 1200 })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(`${OUT}/john-portrait.jpg`);
console.log(`john-portrait.jpg  ${jInfo.width}x${jInfo.height}  ${Math.round(jInfo.size / 1024)}KB`);
await sharp(`${OUT}/john-portrait.jpg`).resize({ width: 480 }).jpeg().toFile("C:/Users/Tanne/MVP/.john-crop.jpg");
