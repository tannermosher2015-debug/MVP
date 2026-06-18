import { MapPin, ArrowUpRight } from "lucide-react";

/**
 * Google Maps embed — the universally-recognized single-location map, centered
 * on the Molokai Vacation Properties Google Business Profile (branded pin).
 *
 * Free, no billing. Uses the official Maps Embed API when a public embed key is
 * provided (NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY — a key restricted to the "Maps
 * Embed API" + your domain), targeting the business by its Google Place ID for a
 * guaranteed branded marker. Without a key it falls back to the keyless embed,
 * matching the Business Profile by name + address. We deliberately do NOT reuse
 * the server-side Places key here, since an embed key is exposed in the HTML.
 *
 * GRACEFUL FALLBACK: a branded "Open in Google Maps" card sits *beneath* the
 * iframe (z-0). When the map renders it fully covers the card; but if a visitor's
 * ad-blocker / privacy browser (uBlock, Brave, Firefox-strict, Ghostery) blanks
 * or strips the embed, the card shows through so they still get the address and a
 * working link to the business on Google Maps — no empty grey box.
 */
const EMBED_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY?.trim();

export default function GoogleMapEmbed({
  query = "Molokai Vacation Properties, 130 Kamehameha V Hwy, Kaunakakai, HI 96748",
  placeId = "ChIJKYuWxPm3qn4RwzJohHT1OGI",
  zoom = 15,
  title = "Molokai Vacation Properties on Google Maps — Kaunakakai, Molokaʻi",
  name = "Molokai Vacation Properties",
  address = "130 Kamehameha V Hwy, Kaunakakai, Molokaʻi, HI 96748",
  className = "h-[460px] sm:h-[560px]",
}: {
  query?: string;
  placeId?: string;
  zoom?: number;
  title?: string;
  name?: string;
  address?: string;
  className?: string;
}) {
  const src = EMBED_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${EMBED_KEY}&q=${
        placeId ? `place_id:${placeId}` : encodeURIComponent(query)
      }&zoom=${zoom}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;

  // "Open in Google Maps" link (resolves to the business by Place ID when known).
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}${placeId ? `&query_place_id=${placeId}` : ""}`;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-ink/10 shadow-[0_30px_80px_-40px_rgba(33,24,20,0.4)] ${className}`}
    >
      {/* Fallback layer — beneath the iframe; visible only if the embed is blocked. */}
      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-3 bg-cream px-6 text-center"
      >
        <MapPin className="h-9 w-9 text-bronze-deep" aria-hidden />
        <span className="font-display text-xl text-ink sm:text-2xl">{name}</span>
        <span className="max-w-xs text-sm text-taupe">{address}</span>
        <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-3 text-xs tracking-luxe uppercase text-ivory">
          Open in Google Maps
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </a>

      <iframe
        title={title}
        src={src}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="relative z-10 h-full w-full"
        style={{ border: 0 }}
      />
    </div>
  );
}
