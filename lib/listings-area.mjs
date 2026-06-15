// Shared area classifier — mirrors areaFor() in lib/listings.ts so the sync
// script (scripts/sync-listings.mjs) and the app agree on Molokaʻi area labels.
export function areaFor(address, city) {
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

const AREA_COORDS = {
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
const ISLAND_CENTER = [21.13, -157.02];

/** Deterministic per-area coordinate with a small id-derived jitter. */
export function coordsFor(area, id) {
  const base = AREA_COORDS[area] ?? ISLAND_CENTER;
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const dLat = ((h % 9) - 4) * 0.0026;
  const dLng = (((h >> 3) % 9) - 4) * 0.0026;
  return [base[0] + dLat, base[1] + dLng];
}
