/**
 * Google Places API (New) — fetches real business info for the Community page.
 * Set GOOGLE_PLACES_API_KEY (Google Maps Platform key with the "Places API (New)"
 * enabled). Without it, getPlaceInfo() returns null and cards show name/note only.
 *
 * One Text Search call per business returns rating, review count, address, phone,
 * website and a Google Maps link. Wrapped in unstable_cache so each business is
 * fetched at most once per day (cost-friendly, Google ToS-friendly). A location
 * bias keeps matches on Molokaʻi.
 */
import { unstable_cache } from "next/cache";

export interface PlaceInfo {
  rating?: number;
  reviews?: number;
  address?: string;
  phone?: string;
  phoneHref?: string;
  website?: string;
  mapsUrl?: string;
}

export function placesEnabled(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY?.trim());
}

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.rating",
  "places.userRatingCount",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.googleMapsUri",
  "places.businessStatus",
].join(",");

const MOLOKAI_BIAS = {
  circle: { center: { latitude: 21.13, longitude: -157.02 }, radius: 35000 },
};

async function fetchPlaceInfo(query: string): Promise<PlaceInfo | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!key) return null;
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery: query,
        regionCode: "US",
        maxResultCount: 1,
        locationBias: MOLOKAI_BIAS,
      }),
    });
    if (!res.ok) {
      console.error(`[places] ${res.status} for "${query}": ${(await res.text()).slice(0, 160)}`);
      return null;
    }
    const data = (await res.json()) as { places?: Array<Record<string, unknown>> };
    const p = data.places?.[0];
    if (!p) return null;
    if (p.businessStatus && p.businessStatus !== "OPERATIONAL") return null;
    const phone = typeof p.nationalPhoneNumber === "string" ? p.nationalPhoneNumber : undefined;
    return {
      rating: typeof p.rating === "number" ? p.rating : undefined,
      reviews: typeof p.userRatingCount === "number" ? p.userRatingCount : undefined,
      address: typeof p.formattedAddress === "string" ? p.formattedAddress : undefined,
      phone,
      phoneHref: phone ? "tel:" + phone.replace(/[^\d+]/g, "") : undefined,
      website: typeof p.websiteUri === "string" ? p.websiteUri : undefined,
      mapsUrl: typeof p.googleMapsUri === "string" ? p.googleMapsUri : undefined,
    };
  } catch (err) {
    console.error(`[places] error for "${query}":`, err);
    return null;
  }
}

/** Cached: each business fetched at most once per day. */
export const getPlaceInfo = unstable_cache(fetchPlaceInfo, ["molokai-places-v1"], {
  revalidate: 86400,
});
