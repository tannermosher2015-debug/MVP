// Pure parse/transform helpers for the RAM (SaleCORE) agent-listings feed.
// No network here except fetchDetail (best-effort, never throws).

const HEX32 = /Property\/([a-f0-9]{32})/i;
const ORIGIN = "https://www.ramaui.com";

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ");
}

/** Pull the listing-cards HTML out of a GetAgentListings response body.
 *  Shape: { d: { Key: "Active", Value: { Key: "<cards html>", Value: "<pagination>" } } } */
export function extractCardsHtml(responseText) {
  const p = JSON.parse(responseText);
  return p?.d?.Value?.Key ?? "";
}

/** Split a GetAgentListings cards-HTML payload into structured cards. */
export function parseCards(html) {
  const blocks = html.split("active-sold-listing-item").slice(1);
  const out = [];
  for (const b of blocks) {
    const uidM = b.match(HEX32);
    if (!uidM) continue;
    const uid = uidM[1].toLowerCase();
    const hrefM = b.match(/\/property\/[^"']+\/\d+-[a-f0-9]{32}/i);
    const detailPath = hrefM ? hrefM[0] : "";
    const pM = b.match(/<p>([\s\S]*?)<\/p>/);
    const addrRaw = pM
      ? decodeEntities(pM[1]).replace(/<br\s*\/?>/gi, "|").replace(/\s+/g, " ").trim()
      : "";
    const [line1 = "", line2 = ""] = addrRaw.split("|").map((s) => s.trim());
    const locM = line2.match(/^(.*),\s*([A-Za-z]{2})\s*(\d{5})/);
    const city = locM ? locM[1].trim() : "Molokaʻi";
    const region = locM ? locM[2].toUpperCase() : "HI";
    const postal = locM ? locM[3] : "";
    const bbM = b.match(/(\d+)\s*Beds?,\s*([\d.]+)\s*Baths?/i);
    const beds = bbM ? parseInt(bbM[1], 10) : 0;
    const baths = bbM ? parseFloat(bbM[2]) : 0;
    const priceM = b.match(/\$[\d,]+/);
    const price = priceM ? parseInt(priceM[0].replace(/[^\d]/g, ""), 10) : 0;
    out.push({ uid, address: line1, city, region, postal, beds, baths, price, detailPath });
  }
  const seen = new Set();
  return out.filter((c) => (seen.has(c.uid) ? false : (seen.add(c.uid), true)));
}

/** Path-indexed photo URL (i = 0,1,2,…; server clamps past the last photo). */
export function photoUrl(uid, i) {
  return `https://mlsimages.salecore.com/i/feed_20/Property/${uid}/${i}`;
}

/** Best-effort detail fields from the /property page's og:description meta.
 *  The full remarks are JS-rendered (not in static HTML), so we take the reliable
 *  sqft + the description teaser. Never throws; returns {} on failure.
 *  Meta shape: "<addr> - $<price>. N bed, M bath, SQFT sq ft. <remarks teaser>…" */
export async function fetchDetail(detailPath) {
  if (!detailPath) return {};
  try {
    const res = await fetch(ORIGIN + detailPath, {
      headers: { "User-Agent": "Mozilla/5.0", Referer: ORIGIN + "/" },
    });
    const html = await res.text();
    const ogM =
      html.match(/property="og:description"\s+content="([^"]*)"/i) ||
      html.match(/name="description"\s+content="([^"]*)"/i);
    const meta = ogM ? decodeEntities(ogM[1]) : "";
    const sqftM = meta.match(/([\d,]+)\s*sq\s*ft/i);
    const sqft = sqftM ? parseInt(sqftM[1].replace(/,/g, ""), 10) : 0;
    const afterSq = meta.split(/sq\s*ft\.?\s*/i)[1];
    const teaser = (afterSq || "").trim();
    return { sqft, remarks: teaser.length > 12 ? teaser : undefined };
  } catch {
    return {};
  }
}
