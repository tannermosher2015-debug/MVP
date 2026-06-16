// Build web logo + broker portraits from the brand source files.
//  - logo.png       : clean logo, white background kept (NOT transparent), trimmed —
//                     shown on a white card in the nav + footer so it reads on any bg
//  - john-portrait.jpg / dayna-portrait.jpg : pro family portraits cropped to the 4:5 card
// Re-run: node scripts/build-logo.mjs
import sharp from "sharp";

const DIR = "C:/Users/Tanne/OneDrive/Desktop/Website Design Styles/Molokai Vacation Properties";
const OUT = "C:/Users/Tanne/MVP/public/images";

// ---- Logo: trim the white border, keep it CLEAN/opaque (no transparency, no recolour) ----
const cInfo = await sharp(`${DIR}/MVP Logo2.jpeg`)
  .trim({ threshold: 12 })
  .flatten({ background: "#ffffff" })
  .resize({ width: 900 })
  .png()
  .toFile(`${OUT}/logo.png`);
console.log(`logo.png (clean)  ${cInfo.width}x${cInfo.height}`);

// ---- John: crop the 1086x1448 portrait to 4:5 (keep faces; trim pavement) ----
const jInfo = await sharp(`${DIR}/JohnWarringPhoto.png`)
  .rotate()
  .extract({ left: 0, top: 0, width: 1086, height: 1358 }) // 1086x1358 ~= 4:5
  .resize({ width: 1200 })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(`${OUT}/john-portrait.jpg`);
console.log(`john-portrait.jpg  ${jInfo.width}x${jInfo.height}  ${Math.round(jInfo.size / 1024)}KB`);

// ---- Dayna: 4:5 from the full-length group shot. Keeps all three + every head
// (headroom) + feet; only excess sky/lawn trimmed (per "don't cut anyone out,
// keep heads, cut from feet if needed"). People span x≈1080-2950, heads y≈2030,
// feet y≈5080 in the 4193x5449 original. ----
const dInfo = await sharp(`${DIR}/8H8A0269.JPG`)
  .rotate()
  .extract({ left: 683, top: 1850, width: 2664, height: 3330 }) // 4:5
  .resize({ width: 1200 })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(`${OUT}/dayna-portrait.jpg`);
console.log(`dayna-portrait.jpg  ${dInfo.width}x${dInfo.height}  ${Math.round(dInfo.size / 1024)}KB`);
