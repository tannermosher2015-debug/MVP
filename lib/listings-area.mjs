// Shared area classifier — mirrors areaFor() in lib/listings.ts so the sync
// script (scripts/sync-listings.mjs) and the app agree on Molokaʻi area labels.
export function areaFor(address, city) {
  const a = (address || "").toLowerCase();
  const c = (city || "").toLowerCase();
  if (/1000\s*kamehameha\s*v/.test(a)) return "Molokai Shores";
  if (/50\s*kepuhi/.test(a)) return "Ke Nani Kai";
  if (/255\s*kepuhi/.test(a)) return "Paniolo Hale";
  if (/1300\s*kam/.test(a) || /mapulehu|ualapue|wavecrest/.test(a)) return "Wavecrest";
  if (/noho\s*lio/.test(a)) return "Maunaloa · West End";
  if (/okana|1700|kualapu/.test(a) || /kualapu/.test(c)) return "Kualapuʻu";
  if (/maunaloa|kaana|kepuhi/.test(a) || /maunaloa/.test(c)) return "Maunaloa · West End";
  return "Kaunakakai";
}
