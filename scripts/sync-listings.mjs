// One-time, re-runnable import of Dayna Harris's active RAM/MLS listings.
// Usage:  node scripts/sync-listings.mjs
import { mkdir, writeFile, rm, rename } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { parseCards, extractCardsHtml, photoUrl, fetchDetail } from "./lib/ram.mjs";
import { areaFor, coordsFor } from "../lib/listings-area.mjs";

const PERSONNEL = 320830, BROKER = 817050, PAGES = 6, MAX_PHOTOS = 20;
const ORIGIN = "https://www.ramaui.com";
const REF = `${ORIGIN}/Real-Estate-Agent/320830/Dayna-Harris`;
const ENDPOINT = `${ORIGIN}/Shared/Webservices/Core.asmx/GetAgentListings`;
const UA = "Mozilla/5.0";

async function getPage(n) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8", Referer: REF, "User-Agent": UA },
    body: JSON.stringify({ personnelId: PERSONNEL, brokerId: BROKER, websiteId: 0, pageSize: 5, pageNumber: n, transactionType: "Active" }),
  });
  return extractCardsHtml(await res.text());
}

async function downloadPhotos(uid) {
  const dir = `public/images/listings/${uid}`;
  await mkdir(dir, { recursive: true });
  const paths = [];
  let prevHash = "";
  for (let i = 0; i < MAX_PHOTOS; i++) {
    let buf;
    try {
      const r = await fetch(photoUrl(uid, i), { headers: { "User-Agent": UA } });
      if (!r.ok) break;
      buf = Buffer.from(await r.arrayBuffer());
    } catch { break; }
    const hash = createHash("md5").update(buf).digest("hex");
    if (hash === prevHash) break; // clamp = end of gallery
    prevHash = hash;
    const name = String(i).padStart(2, "0") + ".jpg";
    try {
      await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).jpeg({ quality: 72 }).toFile(`${dir}/${name}`);
      paths.push(`/images/listings/${uid}/${name}`);
    } catch { /* skip an undecodable image */ }
  }
  return paths;
}

function slugify(address, city, uid) {
  const base = `${address} ${city}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${base}-${uid.slice(0, 6)}`;
}

const COMPLEX_AREAS = new Set(["Molokai Shores", "Ke Nani Kai", "Paniolo Hale", "Wavecrest"]);
function typeFor(card, area) {
  if (card.beds === 0 && card.baths === 0) return "Land";
  if (COMPLEX_AREAS.has(area) || /\bunit\b|kepuhi|kaluakoi|hotel moloka/i.test(card.address)) return "Condo";
  return "Home";
}

async function main() {
  const cards = [];
  for (let n = 1; n <= PAGES; n++) {
    try {
      const got = parseCards(await getPage(n));
      cards.push(...got);
      console.log(`page ${n}: +${got.length}`);
    } catch (e) {
      console.error(`page ${n} failed:`, e.message);
    }
  }
  const seen = new Set();
  const unique = cards.filter((c) => (seen.has(c.uid) ? false : (seen.add(c.uid), true)));
  console.log(`\nParsed ${unique.length} unique active listings\n`);

  const listings = [];
  let photoTotal = 0;
  for (const c of unique) {
    try {
      const photos = await downloadPhotos(c.uid);
      const d = await fetchDetail(c.detailPath);
      const area = areaFor(c.address, c.city);
      const type = typeFor(c, area);
      const [lat, lng] = coordsFor(area, c.uid);
      photoTotal += photos.length;
      listings.push({
        id: c.uid,
        slug: slugify(c.address, c.city, c.uid),
        title: c.address,
        address: c.address, city: c.city, region: c.region, postal: c.postal,
        price: c.price, beds: c.beds, baths: c.baths, sqft: d.sqft || 0,
        type, status: "For Sale",
        image: photos[0] || "/images/molokai-bay.jpg",
        photos,
        imageAlt: `${c.address}, ${c.city}, Molokaʻi`,
        description: d.remarks || "",
        remarks: d.remarks,
        ramUrl: ORIGIN + c.detailPath,
        area, lat, lng,
      });
      console.log(`  ✓ ${c.address} — ${photos.length} photos${d.sqft ? `, ${d.sqft} sqft` : ""}`);
    } catch (e) {
      console.error(`  ✗ skip ${c.uid}:`, e.message);
    }
  }

  if (listings.length === 0) {
    console.error("\nNo listings parsed — refusing to overwrite generated data.");
    process.exit(1);
  }
  const tmp = "lib/listings.generated.json.tmp";
  await writeFile(tmp, JSON.stringify(listings, null, 2));
  await rm("lib/listings.generated.json", { force: true });
  await rename(tmp, "lib/listings.generated.json");
  console.log(`\nDone: ${listings.length} listings, ${photoTotal} photos.`);
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
