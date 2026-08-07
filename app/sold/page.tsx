import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import SoldCard from "@/components/SoldCard";
import LandingLinks from "@/components/LandingLinks";
import { Reveal } from "@/components/motion";
import { SITE } from "@/lib/site";
import { SOLD_LISTINGS, SOLD_PRICE_RANGE } from "@/lib/sold";
import { formatPrice } from "@/lib/listings";

const priceRange = `${formatPrice(SOLD_PRICE_RANGE.min)} to ${formatPrice(SOLD_PRICE_RANGE.max)}`;

export const metadata: Metadata = {
  title: "Recently Sold on Molokaʻi",
  description: `Recently sold homes, condos and land on Molokaʻi. Closed sales from ${priceRange} across Kaunakakai and the West End.`,
  alternates: { canonical: "/sold" },
};

// Most recent first (soldDate is month-precision "YYYY-MM", so string sort works).
const sold = [...SOLD_LISTINGS].sort((a, b) => b.soldDate.localeCompare(a.soldDate));

export default function SoldPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Recently Sold", item: `${SITE.url}/sold` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Nav solid />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section className="relative h-[52vh] min-h-[380px] overflow-hidden">
          <Image
            src="/images/molokai-bay.jpg"
            alt="Calm south-shore waters and reef off Kaunakakai on Molokaʻi"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/30 to-transparent"
            aria-hidden
          />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-12 sm:px-8 sm:pb-16">
            <Reveal>
              <Eyebrow tone="light">Track record</Eyebrow>
              <h1 className="mt-5 font-display text-display-sm text-ivory">Recently Sold on Molokaʻi</h1>
              <p className="measure mt-5 text-lg text-ivory/85">
                Recent closings our team represented across Molokaʻi: homes, condos, and land,
                for both buyers and sellers. Every figure below is an actual sale price, not an estimate.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Sold listings */}
        <section className="bg-ivory py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-display-sm font-display text-ink">
                  {sold.length} recent {sold.length === 1 ? "closing" : "closings"}
                </h2>
                <p className="mt-3 text-sm tracking-wide-2 uppercase text-bronze-deep">
                  Sale prices from {priceRange}
                </p>
              </div>
              <Link
                href="/listings"
                className="group inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm tracking-wide-2 uppercase text-ink transition-colors hover:border-bronze hover:text-bronze-deep"
              >
                See homes for sale
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {sold.map((listing, i) => (
                <Reveal key={listing.slug} delay={(i % 3) * 0.08}>
                  <SoldCard listing={listing} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Sell CTA */}
        <section className="bg-cream/60 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <h2 className="font-display text-display-sm text-ink">Thinking of selling on Molokaʻi?</h2>
            <p className="measure mx-auto mt-4 text-lg text-cocoa">
              These closings were represented by our island team. If you are weighing a sale,
              talk to Dayna about what your property could bring today.
            </p>
            <Link
              href="/#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-espresso px-7 py-3.5 text-sm tracking-wide-2 uppercase text-ivory transition-colors hover:bg-espresso-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-deep"
            >
              Talk to Dayna
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <LandingLinks exclude="sold" heading="Browse Molokaʻi real estate" />
      </main>
      <Footer />
    </>
  );
}
