import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Maximize, MapPin, Trees, ArrowUpRight } from "lucide-react";
import { type Listing, formatPrice, formatBaths, typeLabel } from "@/lib/listings";

export default function ListingCard({ listing }: { listing: Listing }) {
  const hasBeds = listing.type !== "Land" && listing.type !== "Commercial";
  const href = `/listings/${listing.slug}`;
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(33,24,20,0.06)] ring-1 ring-ink/5 transition-all duration-500 ease-luxe hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(33,24,20,0.35)]"
      aria-label={`${listing.title} — ${formatPrice(listing.price)}. View listing.`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.image}
          alt={listing.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="graded object-cover transition-transform duration-[1.1s] ease-luxe group-hover:scale-[1.06]"
        />
        {/* gentle bottom scrim */}
        <div className="scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 h-1/2" aria-hidden />

        <span className="absolute left-4 top-4 rounded-full bg-ivory/95 px-3 py-1 text-[10px] tracking-luxe uppercase text-ink">
          {typeLabel(listing.type)}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-bronze/90 px-3 py-1 text-[10px] tracking-luxe uppercase text-ivory">
          {listing.status}
        </span>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <p className="nums font-display text-2xl text-ivory drop-shadow">
            {formatPrice(listing.price)}
          </p>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory/95 text-ink transition-colors duration-300 group-hover:bg-gold">
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-display text-xl text-ink">{listing.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-taupe">
          <MapPin className="h-3.5 w-3.5 text-bronze" aria-hidden />
          {listing.city}, {listing.region}
        </p>

        <div className="mt-5 flex items-center gap-5 border-t border-ink/8 pt-4 text-sm text-cocoa">
          {hasBeds ? (
            <>
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 text-bronze" strokeWidth={1.5} aria-hidden />
                {listing.beds > 0 ? (
                  <>
                    <span className="nums">{listing.beds}</span>
                    <span className="text-taupe">bd</span>
                  </>
                ) : (
                  <span className="text-taupe">Studio</span>
                )}
              </span>
              <span className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-bronze" strokeWidth={1.5} aria-hidden />
                <span className="nums">{formatBaths(listing.baths)}</span>
                <span className="text-taupe">ba</span>
              </span>
            </>
          ) : (
            <span className="flex items-center gap-1.5">
              <Trees className="h-4 w-4 text-bronze" strokeWidth={1.5} aria-hidden />
              <span className="text-taupe">Vacant land</span>
            </span>
          )}
          {listing.sqft > 0 && (
            <span className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4 text-bronze" strokeWidth={1.5} aria-hidden />
              <span className="nums">{listing.sqft.toLocaleString()}</span>
              <span className="text-taupe">sq ft</span>
            </span>
          )}
        </div>

        <p className="mt-4 inline-flex items-center gap-1 text-[11px] tracking-wide-2 uppercase text-bronze-deep">
          View details
          <ArrowUpRight className="h-3 w-3" aria-hidden />
        </p>
      </div>
    </Link>
  );
}
