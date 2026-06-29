/**
 * ============================================================================
 *  LISTINGS DATA LAYER  —  LIVE AUTO-PULL FROM RAM
 * ============================================================================
 *  Listings auto-update from Dayna Harris's public agent page on RAM
 *  (REALTORS Association of Maui, built on the SaleCORE platform):
 *      https://www.ramaui.com/Real-Estate-Agent/320830/Dayna-Harris
 *
 *  `getListings()` fetches that page server-side, parses the active listings
 *  (address, beds/baths, price, MLS photo) and revalidates hourly — so new
 *  listings appear on the site automatically. If the fetch ever fails, it
 *  falls back to the snapshot below so the site never shows an empty page.
 *
 *  ── Source priority (first one configured wins) ──────────────────────────
 *    1. Paragon RESO Web API   — direct MLS feed (set PARAGON_* env vars)
 *    2. IDX Broker WEBAPI       — set IDXBROKER_API_KEY
 *    3. RAM agent-page auto-pull — default, no credentials (current)
 *    4. Static snapshot          — last-resort fallback
 *
 *  ── Compliance note ──
 *  This displays MLS-sourced data, governed by IDX/MLS rules. The Paragon
 *  RESO Web API (Dayna's own Paragon API access) is the most direct, compliant
 *  option and takes priority once its env vars are set.
 * ============================================================================
 */

import generated from "./listings.generated.json";
import detailData from "./listings-detail.generated.json";

export type ListingType = "Home" | "Condo" | "Land" | "Commercial";
export type ListingStatus = "For Sale" | "Pending" | "Sold";

export interface Listing {
  id: string;
  slug: string;
  title: string;
  address: string;
  city: string;
  region: string;
  postal: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number; // 0 = not published on the feed
  type: ListingType;
  status: ListingStatus;
  image: string;
  imageAlt: string;
  description: string;
  photos?: string[];
  mlsNumber?: string;
  remarks?: string;
  ramUrl?: string;
  area: string; // Molokaʻi community / area label
  lat: number;
  lng: number;
}

const RAM_URL =
  "https://www.ramaui.com/Real-Estate-Agent/320830/Dayna-Harris";
const RAM_ORIGIN = "https://www.ramaui.com";

/* --- Molokaʻi areas: labels (match the Communities cards) + map coords --- */
export const AREA_COORDS: Record<string, [number, number]> = {
  Kaunakakai: [21.0889, -157.0203],
  "Molokai Shores": [21.0846, -156.9985],
  "Hotel Molokai": [21.0815, -156.9975],
  Kawela: [21.067, -156.957],
  Wavecrest: [21.0546, -156.8365],
  "Maunaloa · West End": [21.1373, -157.2186],
  "Ke Nani Kai": [21.1585, -157.2065],
  "Paniolo Hale": [21.1601, -157.2103],
  "Kepuhi Beach Resort": [21.1576, -157.2089],
  "Kepuhi Beach": [21.1576, -157.2089],
  Kualapuʻu: [21.1547, -157.0361],
};
const ISLAND_CENTER: [number, number] = [21.13, -157.02];

export function areaFor(address: string, city: string): string {
  const a = (address || "").toLowerCase();
  const c = (city || "").toLowerCase();
  if (/1000\s*kamehameha\s*v/.test(a)) return "Molokai Shores";
  if (/1300\s*kam|hotel\s*moloka/.test(a)) return "Hotel Molokai";
  if (/50\s*kepuhi/.test(a)) return "Ke Nani Kai";
  if (/paniolo/.test(a)) return "Paniolo Hale";
  if (/255\s*kepuhi|kepuhi\s*beach|kaluakoi/.test(a)) return "Kepuhi Beach Resort";
  if (/7142\s*kam|mapulehu|ualapue|wavecrest/.test(a)) return "Wavecrest";
  if (/noho\s*lio/.test(a)) return "Maunaloa · West End";
  if (/okana|1700|kualapu/.test(a) || /kualapu/.test(c)) return "Kualapuʻu";
  if (/maunaloa|kaana|kepuhi/.test(a) || /maunaloa/.test(c)) return "Maunaloa · West End";
  return "Kaunakakai";
}

export function coordsFor(area: string, id: string): [number, number] {
  const base = AREA_COORDS[area] ?? ISLAND_CENTER;
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const dLat = ((h % 9) - 4) * 0.0026;
  const dLng = (((h >> 3) % 9) - 4) * 0.0026;
  return [base[0] + dLat, base[1] + dLng];
}

/** Live MLS search page on RAM for a given address. */
function ramSearchUrl(address: string, city: string, postal: string): string {
  const q = `${address} ${city} HI ${postal}`.trim().replace(/\s+/g, "+");
  return `${RAM_ORIGIN}/Search/${encodeURIComponent(q).replace(/%2B/g, "+")}`;
}

/** Raw shape scraped from a RAM listing card. */
interface RawListing {
  addr: string; // "94 Noho Lio Rd 157|Maunaloa, HI 96770"
  beds: string | null;
  baths: string | null;
  price: string | null; // "$549,000"
  img: string | null;
  href: string | null;
}

/* ---- Curated current listings (mirrored from realestateonmolokai.net
 *      /all-listings; photos downloaded to /public/images/listing-<id>.jpg).
 *      This is the DEFAULT source. Live feeds (Paragon / IDX Broker / RAM)
 *      override it automatically when their env vars are set. ---- */
function curated(
  id: string, title: string, address: string, city: string, postal: string,
  price: number, beds: number, baths: number, sqft: number,
  type: ListingType, _detail: string, description?: string,
): Listing {
  const slug = `${title}-${id}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const area = areaFor(address, city);
  const [lat, lng] = coordsFor(area, id);
  return {
    id, slug, title, address, city, region: "HI", postal,
    price, beds, baths, sqft, type, status: "For Sale",
    image: `/images/listing-${id}.jpg`,
    imageAlt: `${title}, ${address}, ${city}, Molokaʻi`,
    description: description ?? blurb(type, city),
    ramUrl: ramSearchUrl(address, city, postal),
    area, lat, lng,
  };
}

const CURATED_LISTINGS: Listing[] = [
  curated("223", "Oceanfront Family Compound", "2160 Kamehameha V Hwy", "Kaunakakai", "96748", 1_850_000, 6, 3.5, 3606, "Home", "223-House-2160-Kamehameha-V-Hwy-Kaunakakai-Hawaii-96748-6-Bedrooms-3-5-Bathrooms-USD1-850-000/", "A rare oceanfront legacy estate on Molokaʻi's south shore — three homes, room for the whole family, and the Pacific at your doorstep."),
  curated("158", "2452 Kamehameha V Highway", "2452 Kamehameha V Hwy", "Kaunakakai", "96748", 925_000, 4, 2, 2040, "Home", "158-House-2452-Kamehameha-V-Highway-Kaunakakai-Hawaii-96748-4-Bedrooms-2-Bathrooms-USD925-000/"),
  curated("225", "West End Cottage", "94 Noho Lio", "Maunaloa", "96770", 549_000, 1, 1, 864, "Home", "225-House-94-Noho-Lio-Maunaloa-Hawaii-96770-1-Bedroom-1-Bathroom-USD549-000/"),
  curated("201", "Kualapuʻu Home", "Okana 1700 Street", "Kualapuu", "96757", 309_000, 3, 1, 816, "Home", "201-House-Okana-1700-Street-Kualapuu-Hawaii-96757-3-Bedrooms-1-Bathroom-USD309-000/"),
  curated("226", "Ke Nani Kai", "50 Kepuhi Pl", "Maunaloa", "96770", 299_000, 2, 2, 900, "Condo", "226-Condominium-50-Kepuhi-Pl-Maunaloa-Hawaii-96770-2-Bedrooms-2-Bathrooms-USD299-000/"),
  curated("217", "Molokai Shores", "1000 Kamehameha V Hwy", "Kaunakakai", "96748", 285_000, 1, 1, 562, "Condo", "217-Condominium-1000-Kamehameha-V-Hawaii-96748-1-Bedroom-1-Bathroom-USD285-000/"),
  curated("194", "Paniolo Hale", "255 Kepuhi Place", "Maunaloa", "96770", 285_000, 0, 1, 348, "Condo", "194-Condominium-255-Kepuhi-Place-Maunaloa-Hawaii-96770-1-Bathroom-USD285-000/"),
  curated("179", "Molokai Shores", "1000 Kamehameha V Hwy", "Kaunakakai", "96745", 249_500, 1, 1, 562, "Condo", "179-Condominium-1000-Kamehameha-V-Hwy-Kaunakakai-Hawaii-96745-1-Bedroom-1-Bathroom-USD249-500/"),
  curated("147", "Ke Nani Kai", "50 Kepuhi Place", "Maunaloa", "96770", 239_000, 2, 2, 900, "Condo", "147-Condominium-50-Kepuhi-Place-Maunaloa-Hawaii-96770-2-Bedrooms-2-Bathrooms-USD239-000/"),
  curated("176", "Molokai Shores", "1000 Kamehameha V Hwy", "Kaunakakai", "96748", 225_000, 1, 1, 564, "Condo", "176-Condominium-1000-Kamehameha-V-Hwy-Kaunakakai-Hawaii-96748-1-Bedroom-1-Bathroom-USD225-000/"),
  curated("216", "Paniolo Hale", "255 Kepuhi Place", "Maunaloa", "96770", 200_000, 0, 1, 348, "Condo", "216-Condominium-255-Kepuhi-Place-Maunaloa-Hawaii-96770-1-Bathroom-USD200-000/"),
  curated("177", "Ke Nani Kai", "50 Kepuhi Pl", "Maunaloa", "96770", 195_000, 1, 1, 681, "Condo", "177-Condominium-50-Kepuhi-Pl-Maunaloa-Hawaii-96770-1-Bedroom-1-Bathroom-USD195-000/"),
  curated("191", "1300 Kamehameha V", "1300 Kamehameha V", "Maunaloa", "96770", 140_000, 0, 1, 504, "Condo", "191-Condominium-1300-Kamehameha-V-Maunaloa-Hawaii-96770-1-Bathroom-USD140-000/"),
  curated("214", "Ke Nani Kai", "50 Kepuhi Pl", "Maunaloa", "96770", 130_000, 1, 1, 681, "Condo", "214-Condominium-50-Kepuhi-Pl-Maunaloa-Hawaii-96770-1-Bedroom-1-Bathroom-USD130-000/"),
  curated("218", "Molokai Shores", "1000 Kamehameha V", "Kaunakakai", "96748", 105_000, 1, 1, 562, "Condo", "218-Condominium-1000-Kamehameha-V-Kaunakakai-Hawaii-96748-1-Bedroom-1-Bathroom-USD105-000/"),
  curated("185", "Molokai Shores", "1000 Kamehameha V Hwy", "Kaunakakai", "96748", 99_000, 1, 1, 562, "Condo", "185-Condominium-1000-Kamehameha-V-Hwy-Kaunakakai-Hawaii-96748-1-Bedroom-1-Bathroom-USD99-000/"),
];

const CONDO_COMPLEXES =
  /(1000 Kamehameha V Hwy|Kepuhi|Ke Nani Kai|Wavecrest|Paniolo|Molokai Shores|7146 Kamehameha)/i;

function blurb(type: ListingType, city: string): string {
  switch (type) {
    case "Land":
      return `A rare parcel in ${city} — your own piece of Molokaʻi to build the island life you imagine.`;
    case "Condo":
      return `An island condominium in ${city} — turnkey Molokaʻi ownership, moments from the sea.`;
    default:
      return `A Molokaʻi home in ${city} — space, privacy, and the unhurried rhythm of island living.`;
  }
}

function makeListing(r: RawListing): Listing {
  const [line1Raw, line2 = ""] = r.addr.split("|");
  const line1 = line1Raw.trim();
  const m = line2.match(/^(.*),\s*([A-Za-z]{2})\s*(\d{5})/);
  const city = m ? m[1].trim() : "Molokaʻi";
  const region = m ? m[2].toUpperCase() : "HI";
  const postal = m ? m[3] : "";
  const beds = r.beds ? parseInt(r.beds, 10) : 0;
  const baths = r.baths ? parseFloat(r.baths) : 0;
  const price = parseInt((r.price || "0").replace(/[^\d]/g, ""), 10) || 0;
  const type: ListingType =
    beds === 0 && baths === 0
      ? "Land"
      : CONDO_COMPLEXES.test(line1)
        ? "Condo"
        : "Home";
  const slug = line1.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const id = r.img ? r.img.split("/").pop()! : slug;
  const area = areaFor(line1, city);
  const [lat, lng] = coordsFor(area, id);
  return {
    id,
    slug,
    title: line1,
    address: line1,
    city,
    region,
    postal,
    price,
    beds,
    baths,
    sqft: 0,
    type,
    status: "For Sale",
    image: r.img || "/images/molokai-bay.jpg",
    imageAlt: `${line1}, ${city}, Molokaʻi`,
    description: blurb(type, city),
    ramUrl: r.href ? RAM_ORIGIN + r.href : RAM_URL,
    area,
    lat,
    lng,
  };
}

export const STATIC_LISTINGS: Listing[] = CURATED_LISTINGS;

/* --------------------------------------------------------------------------
 * Listing filter categories — condo complexes shown individually; everything
 * else simplified to Homes / Land. Drives the Current Listings filter tabs.
 * ------------------------------------------------------------------------ */

/** Condo complexes that get their own category, in tab order. */
export const CONDO_COMPLEX_CATEGORIES = [
  "Ke Nani Kai",
  "Molokai Shores",
  "Wavecrest",
  "Paniolo Hale",
  "Kepuhi Beach Resort",
  "Hotel Molokai",
] as const;

/** All filter categories in tab order: the complexes, then the simplified buckets. */
export const LISTING_CATEGORIES: string[] = [...CONDO_COMPLEX_CATEGORIES, "Homes", "Vacant Land"];

/** Bucket a listing: its condo complex if it belongs to one, else Homes/Land by type. */
export function categoryFor(l: Listing): string {
  // Land parcels are never a condo complex, even when the nearest area is one.
  if (l.type === "Land") return "Vacant Land";
  const t = `${l.title} ${l.address}`.toLowerCase();
  // Hotel Molokai units are addressed at 1300 Kamehameha V Hwy.
  if (/hotel\s*moloka|1300\s*kam/.test(t)) return "Hotel Molokai";
  // Kepuhi Beach Resort condos are at 255 Kepuhi Place.
  if (/kepuhi\s*beach|kaluakoi|255\s*kepuhi/.test(t)) return "Kepuhi Beach Resort";
  if ((CONDO_COMPLEX_CATEGORIES as readonly string[]).includes(l.area)) return l.area;
  return "Homes";
}

/** Display label for a listing type ("Land" shows as "Vacant Land"). */
export function typeLabel(type: ListingType): string {
  return type === "Land" ? "Vacant Land" : type;
}

/* --------------------------------------------------------------------------
 * Public API — every component fetches listings through these functions.
 * ------------------------------------------------------------------------ */
export async function getListings(): Promise<Listing[]> {
  // 1) Direct MLS feed — Paragon RESO Web API (best/most compliant).
  if (
    process.env.PARAGON_ODATA_URL &&
    (process.env.PARAGON_SERVER_TOKEN || process.env.PARAGON_CLIENT_SECRET)
  ) {
    try {
      const p = await fetchParagonListings();
      if (p.length > 0) return p;
    } catch (err) {
      console.error("[listings] Paragon failed, trying next source:", err);
    }
  }
  // 2) Official IDX Broker feed — used when configured.
  if (process.env.IDXBROKER_API_KEY) {
    try {
      const idx = await fetchIdxBrokerListings();
      if (idx.length > 0) return idx;
    } catch (err) {
      console.error("[listings] IDX Broker failed, trying RAM:", err);
    }
  }
  // 3) Live auto-pull from Dayna's RAM agent page (opt-in: LISTINGS_SOURCE=ram).
  if (process.env.LISTINGS_SOURCE === "ram") {
    try {
      const live = await fetchRamListings();
      if (live.length > 0) return live;
    } catch (err) {
      console.error("[listings] RAM pull failed, using curated:", err);
    }
  }
  // 4) Synced snapshot from RAM, committed by scripts/sync-listings.mjs.
  const synced = generated as unknown as Listing[];
  if (Array.isArray(synced) && synced.length > 0) return synced;

  // 5) Last-resort curated listings.
  return STATIC_LISTINGS;
}

export async function getFeaturedListing(): Promise<Listing> {
  const all = await getListings();
  return [...all].sort((a, b) => b.price - a.price)[0];
}

export async function getListingBySlug(slug: string): Promise<Listing | undefined> {
  return (await getListings()).find((l) => l.slug === slug);
}

/* Full "More property info" scraped from RAM (scripts/scrape-listing-details.cjs). */
export type DetailField = [label: string, value: string];
export interface DetailGroup {
  title: string;
  fields: DetailField[];
}
export interface ListingDetail {
  mlsNumber: string;
  description: string;
  groups: DetailGroup[];
}

export function getListingDetail(id: string): ListingDetail | null {
  const map = detailData as unknown as Record<
    string,
    { slug: string } & ListingDetail
  >;
  const d = map[id];
  return d ? { mlsNumber: d.mlsNumber, description: d.description, groups: d.groups } : null;
}

/* --------------------------------------------------------------------------
 *  LIVE AUTO-PULL  — fetch + parse Dayna's RAM agent page (server-side).
 * ------------------------------------------------------------------------ */
async function fetchRamListings(): Promise<Listing[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(RAM_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
      // Revalidate hourly (ISR) so new listings appear automatically.
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`RAM responded ${res.status}`);
    const html = await res.text();
    return parseRamHtml(html);
  } finally {
    clearTimeout(timer);
  }
}

/** Parse the "Active/Pending Listings" section of a RAM/SaleCORE agent page. */
export function parseRamHtml(html: string): Listing[] {
  const start = html.indexOf('id="divMapActiveResults"');
  if (start === -1) return [];
  const end = html.indexOf("apSearchSoldListings", start);
  const section = html.slice(start, end > start ? end : start + 12000);

  const blocks = section.split("active-sold-listing-item").slice(1);
  const out: Listing[] = [];
  for (const it of blocks) {
    const img = it.match(/<img[^>]+src="([^"]+)"/);
    const addr = it.match(/<p>([\s\S]*?)<\/p>/);
    const bb = it.match(/(\d+)\s*Beds?,\s*([\d.]+)\s*Baths?/i);
    const price = it.match(/\$[\d,]+/);
    const href = it.match(/href\s*=\s*"([^"]+)"/);
    if (!addr && !img) continue;
    const addrText = addr
      ? addr[1].replace(/<br\s*\/?>/gi, "|").replace(/\s+/g, " ").trim()
      : "Molokaʻi Listing";
    out.push(
      makeListing({
        addr: addrText,
        beds: bb ? bb[1] : null,
        baths: bb ? bb[2] : null,
        price: price ? price[0] : null,
        img: img ? img[1] : null,
        href: href ? href[1] : null,
      }),
    );
  }
  return out;
}

/* --------------------------------------------------------------------------
 *  DIRECT MLS FEED — PARAGON RESO WEB API (OData)
 *
 *  The most compliant + direct option: Dayna's Paragon API access
 *  (RAM / Maui MLS). Set these env vars and getListings() uses it first:
 *
 *    PARAGON_ODATA_URL        Service root from the Paragon "Data Access" tab,
 *                             e.g. https://<mlsid>.paragonrels.com/OData/<mlsid>
 *    PARAGON_SERVER_TOKEN     The "Server Token" (simplest — used as Bearer)
 *      ── or, for auto-refreshing OAuth2 (client credentials): ──
 *    PARAGON_CLIENT_ID        Client ID
 *    PARAGON_CLIENT_SECRET    Client Secret
 *    PARAGON_TOKEN_URL        e.g. https://<mlsid>.paragonrels.com/OData/<mlsid>/identity/connect/token
 *
 *    PARAGON_AGENT_MLS_ID     (optional) show only Dayna's listings; omit to
 *                             show all active Molokaʻi listings.
 * ------------------------------------------------------------------------ */
const MOLOKAI_ZIPS = ["96748", "96770", "96757", "96729", "96742"];

let paragonToken: { token: string; exp: number } | null = null;

async function getParagonToken(): Promise<string> {
  const server = process.env.PARAGON_SERVER_TOKEN;
  if (server) return server;
  const id = process.env.PARAGON_CLIENT_ID;
  const secret = process.env.PARAGON_CLIENT_SECRET;
  const tokenUrl = process.env.PARAGON_TOKEN_URL;
  if (!id || !secret || !tokenUrl) throw new Error("Paragon credentials not set");
  const now = Date.now();
  if (paragonToken && paragonToken.exp > now + 30_000) return paragonToken.token;
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials", scope: "OData" }),
  });
  if (!res.ok) throw new Error(`Paragon token responded ${res.status}`);
  const j = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!j.access_token) throw new Error("Paragon token missing access_token");
  paragonToken = { token: j.access_token, exp: now + (j.expires_in ?? 3600) * 1000 };
  return paragonToken.token;
}

async function fetchParagonListings(): Promise<Listing[]> {
  const base = process.env.PARAGON_ODATA_URL;
  if (!base) throw new Error("PARAGON_ODATA_URL not set");
  const token = await getParagonToken();
  const agent = process.env.PARAGON_AGENT_MLS_ID;
  const area = agent
    ? `ListAgentMlsId eq '${agent}'`
    : "(" + MOLOKAI_ZIPS.map((z) => `PostalCode eq '${z}'`).join(" or ") + ")";
  const filter = `StandardStatus eq 'Active' and ${area}`;
  const url =
    `${base.replace(/\/$/, "")}/Property` +
    `?$filter=${encodeURIComponent(filter)}` +
    `&$orderby=ListPrice desc&$top=24&$expand=Media`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Paragon OData responded ${res.status}`);
  const data = (await res.json()) as { value?: Record<string, unknown>[] };
  return (data.value ?? []).map(fromReso).filter((l) => l.price > 0 || Boolean(l.title));
}

function fromReso(r: Record<string, unknown>): Listing {
  const num = (v: unknown) => {
    if (typeof v === "number") return v;
    const n = parseInt(String(v ?? "").replace(/[^\d.]/g, ""), 10);
    return Number.isNaN(n) ? 0 : n;
  };
  const str = (v: unknown, d = "") => (typeof v === "string" ? v : v == null ? d : String(v));

  const beds = num(r.BedroomsTotal);
  const baths = num(r.BathroomsTotalInteger ?? r.BathroomsFull);
  const sqft = num(r.LivingArea ?? r.BuildingAreaTotal);
  const price = num(r.ListPrice);
  const city = str(r.City, "Molokaʻi");
  const address =
    str(r.UnparsedAddress) ||
    [r.StreetNumber, r.StreetName, r.UnitNumber].map((x) => str(x)).filter(Boolean).join(" ") ||
    "Molokaʻi Listing";

  let image = "/images/molokai-bay.jpg";
  const media = r.Media;
  if (Array.isArray(media)) {
    for (const m of media) {
      const url = (m as { MediaURL?: unknown })?.MediaURL;
      if (typeof url === "string") { image = url; break; }
    }
  }

  const subtype = str(r.PropertySubType ?? r.PropertyType);
  const type: ListingType =
    beds === 0 && /land|lot/i.test(subtype || str(r.PropertyType))
      ? "Land"
      : /condo|apart|townhouse/i.test(subtype)
        ? "Condo"
        : beds === 0
          ? "Land"
          : "Home";
  const slug =
    address.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "listing";
  const id = str(r.ListingKey ?? r.ListingId ?? slug, slug);
  const postal = str(r.PostalCode);
  const area = areaFor(address, city);
  const fallback = coordsFor(area, id);
  const plat = typeof r.Latitude === "number" ? r.Latitude : parseFloat(str(r.Latitude));
  const plng = typeof r.Longitude === "number" ? r.Longitude : parseFloat(str(r.Longitude));
  const lat = Number.isFinite(plat) && plat !== 0 ? plat : fallback[0];
  const lng = Number.isFinite(plng) && plng !== 0 ? plng : fallback[1];

  return {
    id,
    slug,
    title: address,
    address,
    city,
    region: str(r.StateOrProvince, "HI"),
    postal,
    price,
    beds,
    baths,
    sqft,
    type,
    status: "For Sale",
    image,
    imageAlt: `${address}, ${city}, Molokaʻi`,
    description: str(r.PublicRemarks).slice(0, 200) || blurb(type, city),
    ramUrl: ramSearchUrl(address, city, postal),
    area,
    lat,
    lng,
  };
}

/* --------------------------------------------------------------------------
 *  OFFICIAL COMPLIANT FEED — IDX BROKER  (Maui MLS / RAMAUI)
 *  https://www.idxbroker.com/mls/maui-mls-ramaui
 *
 *  Once Dayna has an IDX Broker account connected to the Maui MLS, create an
 *  API key (IDX Control Panel → Account → API / Access Keys) and set it as
 *  the env var IDXBROKER_API_KEY. getListings() will then use this fully
 *  MLS-compliant WEBAPI feed instead of scraping the RAM page — the rest of
 *  the site (design, cards, featured) is unchanged.
 *
 *  Field names below follow IDX Broker's Data Output; if your account returns
 *  different keys, adjust the mapping in fromIdxBroker().
 * ------------------------------------------------------------------------ */
const IDX_API = "https://api.idxbroker.com";

type IdxRow = Record<string, unknown>;

async function fetchIdxBrokerListings(): Promise<Listing[]> {
  const key = process.env.IDXBROKER_API_KEY;
  if (!key) throw new Error("IDXBROKER_API_KEY not set");
  const res = await fetch(`${IDX_API}/clients/featured`, {
    headers: { accesskey: key, outputtype: "json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`IDX Broker responded ${res.status}`);
  const data: unknown = await res.json();
  const arr: unknown[] = Array.isArray(data)
    ? data
    : Object.values((data ?? {}) as Record<string, unknown>);
  return (arr as IdxRow[]).map(fromIdxBroker).filter((l) => l.price > 0 || Boolean(l.title));
}

function fromIdxBroker(row: IdxRow): Listing {
  const num = (v: unknown) => {
    if (typeof v === "number") return v;
    const n = parseInt(String(v ?? "").replace(/[^\d]/g, ""), 10);
    return Number.isNaN(n) ? 0 : n;
  };
  const str = (v: unknown, d = "") => (typeof v === "string" ? v : v == null ? d : String(v));

  const beds = num(row.bedrooms);
  const baths = num(row.totalBaths ?? row.baths);
  const sqft = num(row.sqFt ?? row.totalSqFt);
  const price = num(row.listingPrice ?? row.currentPrice ?? row.price);
  const city = str(row.cityName ?? row.city, "Molokaʻi");
  const address =
    str(row.address) ||
    [row.streetNumber, row.streetName, row.unitNumber]
      .map((x) => str(x))
      .filter(Boolean)
      .join(" ") ||
    "Molokaʻi Listing";

  // image can be a string, an array, or an object keyed "0","1",...
  let image = "/images/molokai-bay.jpg";
  const im = row.image;
  if (typeof im === "string") {
    image = im;
  } else if (im && typeof im === "object") {
    for (const v of Object.values(im as Record<string, unknown>)) {
      if (typeof v === "string") { image = v; break; }
      if (v && typeof v === "object" && typeof (v as { url?: unknown }).url === "string") {
        image = (v as { url: string }).url;
        break;
      }
    }
  }

  const type: ListingType =
    beds === 0
      ? "Land"
      : /condo|apt/i.test(str(row.idxPropType ?? row.propType))
        ? "Condo"
        : "Home";
  const slug =
    address.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "listing";
  const id = str(row.listingID ?? row.idxID ?? slug, slug);
  const area = areaFor(address, city);
  const [lat, lng] = coordsFor(area, id);

  return {
    id,
    slug,
    title: address,
    address,
    city,
    region: str(row.state, "HI"),
    postal: str(row.zipcode),
    price,
    beds,
    baths,
    sqft,
    type,
    status: "For Sale",
    image,
    imageAlt: `${address}, ${city}, Molokaʻi`,
    description: blurb(type, city),
    ramUrl: str(row.fullDetailsURL ?? row.url, RAM_URL),
    area,
    lat,
    lng,
  };
}

/* --------------------------------------------------------------------------
 * Formatting helpers
 * ------------------------------------------------------------------------ */
export function formatPrice(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatBaths(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
