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
 */
const EMBED_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY?.trim();

export default function GoogleMapEmbed({
  query = "Molokai Vacation Properties, 130 Kamehameha V Hwy, Kaunakakai, HI 96748",
  placeId = "ChIJKYuWxPm3qn4RwzJohHT1OGI",
  zoom = 15,
  title = "Molokai Vacation Properties on Google Maps — Kaunakakai, Molokaʻi",
  className = "h-[460px] sm:h-[560px]",
}: {
  query?: string;
  placeId?: string;
  zoom?: number;
  title?: string;
  className?: string;
}) {
  const src = EMBED_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${EMBED_KEY}&q=${
        placeId ? `place_id:${placeId}` : encodeURIComponent(query)
      }&zoom=${zoom}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;

  return (
    <div
      className={`w-full overflow-hidden rounded-3xl border border-ink/10 shadow-[0_30px_80px_-40px_rgba(33,24,20,0.4)] ${className}`}
    >
      <iframe
        title={title}
        src={src}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full"
        style={{ border: 0 }}
      />
    </div>
  );
}
