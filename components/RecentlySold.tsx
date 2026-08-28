import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import Eyebrow from "@/components/Eyebrow";
import SoldCard from "@/components/SoldCard";
import { SOLD_LISTINGS, SOLD_PRICE_RANGE } from "@/lib/sold";
import { formatPrice } from "@/lib/listings";

const ZILLOW_PROFILE = "https://www.zillow.com/profile/Dayna%20Harris";

// Newest first, trimmed to a multiple of the 3-column grid so the homepage teaser
// never ends on a part-filled row. The full set lives on /sold.
const featured = [...SOLD_LISTINGS]
  .sort((a, b) => b.soldDate.localeCompare(a.soldDate))
  .slice(0, 12);

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
          {featured.map((listing, i) => (
            <Reveal key={listing.slug} delay={(i % 3) * 0.08}>
              <SoldCard listing={listing} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col items-center gap-4">
            <Link
              href="/sold"
              className="group inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm tracking-wide-2 uppercase text-ink transition-colors hover:border-bronze hover:text-bronze-deep focus-visible:outline-none focus-visible:text-bronze-deep"
            >
              See all recently sold
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
            <a
              href={ZILLOW_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-wide-2 uppercase text-taupe transition-colors hover:text-bronze-deep focus-visible:outline-none focus-visible:text-bronze-deep"
            >
              Or verify our sales on Zillow
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
