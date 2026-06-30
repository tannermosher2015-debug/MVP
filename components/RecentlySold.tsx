import Image from "next/image";
import { BedDouble, Bath, Maximize, MapPin, Trees, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import Eyebrow from "@/components/Eyebrow";
import { SOLD_LISTINGS, SOLD_PRICE_RANGE, formatSoldDate, type SoldListing } from "@/lib/sold";
import { formatPrice, formatBaths } from "@/lib/listings";

const ZILLOW_PROFILE = "https://www.zillow.com/profile/Dayna%20Harris";

function SoldCard({ listing }: { listing: SoldListing }) {
  const hasBeds = listing.type === "Home" || listing.type === "Condo";
  const isLand = listing.type === "Land";
  const showMetrics = hasBeds || isLand || listing.sqft > 0;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(33,24,20,0.06)] ring-1 ring-ink/5 transition-all duration-500 ease-luxe hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(33,24,20,0.35)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.image}
          alt={listing.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="graded object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
        />
        <div className="scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/2" aria-hidden />
        {/* SOLD stamp */}
        <span className="absolute left-4 top-4 z-[1] rounded-full bg-ink/85 px-3 py-1 text-[10px] font-medium tracking-luxe uppercase text-ivory backdrop-blur-sm">
          Sold
        </span>
        {listing.type && (
          <span className="absolute right-4 top-4 z-[1] rounded-full bg-ivory/95 px-3 py-1 text-[10px] tracking-luxe uppercase text-ink">
            {listing.type}
          </span>
        )}
        <div className="absolute bottom-4 left-4 right-4 z-[1] flex items-end justify-between">
          <p className="nums font-display text-2xl text-ivory drop-shadow">{formatPrice(listing.price)}</p>
          <span className="text-[11px] tracking-wide-2 uppercase text-ivory/90">
            {formatSoldDate(listing.soldDate)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl text-ink">{listing.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-taupe">
          <MapPin className="h-3.5 w-3.5 text-bronze" aria-hidden />
          {listing.city}, {listing.region}
        </p>

        {showMetrics && (
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/8 pt-4 text-sm text-cocoa">
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
              {listing.baths > 0 && (
                <span className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4 text-bronze" strokeWidth={1.5} aria-hidden />
                  <span className="nums">{formatBaths(listing.baths)}</span>
                  <span className="text-taupe">ba</span>
                </span>
              )}
            </>
          ) : isLand ? (
            <span className="flex items-center gap-1.5">
              <Trees className="h-4 w-4 text-bronze" strokeWidth={1.5} aria-hidden />
              <span className="text-taupe">Land</span>
            </span>
          ) : null}
          {listing.sqft > 0 && (
            <span className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4 text-bronze" strokeWidth={1.5} aria-hidden />
              <span className="nums">{listing.sqft.toLocaleString()}</span>
              <span className="text-taupe">sq ft</span>
            </span>
          )}
        </div>
        )}

        <p className="mt-auto pt-4 text-[11px] tracking-wide-2 uppercase text-bronze-deep">
          Represented {listing.represented}
        </p>
      </div>
    </article>
  );
}

export default function RecentlySold() {
  return (
    <section id="recently-sold" className="scroll-mt-24 bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow index="07">Track record</Eyebrow>
            <h2 className="mt-4 text-display-sm font-display text-ink">Recently sold on Molokaʻi</h2>
            <p className="measure mt-5 text-lg text-cocoa">
              A look at some of our most recent closings across Molokaʻi: homes, condos,
              and land moved for buyers and sellers around the island.
            </p>
            <p className="mt-6 text-sm tracking-wide-2 uppercase text-bronze-deep">
              Recent sale prices from {formatPrice(SOLD_PRICE_RANGE.min)} to{" "}
              {formatPrice(SOLD_PRICE_RANGE.max)}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SOLD_LISTINGS.map((listing, i) => (
            <Reveal key={listing.slug} delay={(i % 3) * 0.08}>
              <SoldCard listing={listing} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 text-center">
            <a
              href={ZILLOW_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm tracking-wide-2 uppercase text-ink transition-colors hover:border-bronze hover:text-bronze-deep focus-visible:outline-none focus-visible:text-bronze-deep"
            >
              View all of our sales on Zillow
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
