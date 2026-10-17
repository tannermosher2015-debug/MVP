import Link from "next/link";
import { formatPrice, getListingDetail, type Listing } from "@/lib/listings";
import { SOLD_LISTINGS } from "@/lib/sold";
import type { LandingSnapshot } from "@/lib/landing";

const span = (lo: number, hi: number, fmt: (n: number) => string) =>
  lo === hi ? fmt(lo) : `${fmt(lo)} to ${fmt(hi)}`;

/** The feed spells the town without its okina; the rest of the site does not. */
const townLabel = (city: string) => (city === "Kualapuu" ? "Kualapuʻu" : city);

function acres(l: Listing): number | null {
  for (const g of getListingDetail(l.id)?.groups ?? [])
    for (const [label, value] of g.fields)
      if (label === "Lot Size Acres" && Number.isFinite(parseFloat(value))) return parseFloat(value);
  return null;
}

/**
 * Plain-text summary computed from the same listings the grid shows, so it can
 * never say something the grid does not. Nothing here is typed in by hand.
 */
export default function MarketSnapshot({
  heading,
  snapshot,
  listings,
}: {
  heading: string;
  snapshot: LandingSnapshot;
  listings: Listing[];
}) {
  if (listings.length < 2) return null;

  const prices = listings.map((l) => l.price);
  const towns = Object.entries(
    listings.reduce<Record<string, number>>((acc, l) => {
      const t = townLabel(l.city);
      acc[t] = (acc[t] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const sizes = snapshot.sold === "Land" ? listings.map(acres).filter((n): n is number => n !== null) : [];
  const beds = snapshot.sold === "Home" ? listings.map((l) => l.beds).filter((n) => n > 0) : [];
  const sold = SOLD_LISTINGS.filter((s) => s.type === snapshot.sold);

  return (
    <section className="border-t border-ink/10 bg-ivory py-14 sm:py-16" aria-labelledby="snapshot-heading">
      <div className="mx-auto max-w-3xl space-y-4 px-5 text-lg leading-relaxed text-cocoa sm:px-8">
        <h2 id="snapshot-heading" className="font-display text-display-sm text-ink">
          {heading}
        </h2>
        <p>
          {listings.length} {snapshot.noun} are listed with Dayna&apos;s team today. Asking prices:{" "}
          {span(Math.min(...prices), Math.max(...prices), formatPrice)}.{" "}
          {towns.length > 1
            ? `By town: ${towns.map(([t, n]) => `${t} ${n}`).join(", ")}.`
            : `All are in ${towns[0][0]}.`}
          {sizes.length > 1 &&
            ` Lot sizes: ${span(Math.min(...sizes), Math.max(...sizes), (n) => n.toFixed(2))} acres.`}
          {beds.length > 1 &&
            ` Bedrooms: ${span(Math.min(...beds), Math.max(...beds), String)}.`}
        </p>
        {sold.length > 1 && (
          <p>
            Our team&apos;s recent closings include {sold.length} {snapshot.noun} sold at{" "}
            {span(
              Math.min(...sold.map((s) => s.price)),
              Math.max(...sold.map((s) => s.price)),
              formatPrice,
            )}
            . <Link href="/sold" className="text-bronze-deep underline decoration-bronze underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-deep">See the recent sales</Link>.
          </p>
        )}
        <p>
          Before you make an offer, read{" "}
          <Link
            href={`/blog/${snapshot.guide.slug}`}
            className="text-bronze-deep underline decoration-bronze underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-deep"
          >
            {snapshot.guide.label}
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
