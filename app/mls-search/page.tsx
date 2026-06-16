import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Home, Building2, Trees, Store, Compass } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import { Reveal } from "@/components/motion";

export const metadata: Metadata = {
  title: "MLS Search",
  description:
    "Search the full Molokaʻi MLS through the Realtors Association of Maui — homes, condominiums, vacant land and commercial listings, updated live.",
  alternates: { canonical: "/mls-search" },
};

type Search = {
  title: string;
  blurb: string;
  href: string;
  Icon: typeof Home;
};

// Live Realtors Association of Maui (RAMaui.com) searches, scoped to Molokaʻi.
// URLs are kept verbatim (their q parameter is double-encoded) — do not re-encode.
const ALL: Search = {
  title: "All Molokaʻi listings",
  blurb: "Every active property on the island — homes, condos, land and commercial — in one search.",
  href: "https://www.ramaui.com/search/molokai?q=%257B%2522SavedSearchId%2522%3A0%2C%2522SearchTypes%2522%3A%255B0%2C1%2C3%255D%2C%2522PropertyTypes%2522%3A%255B0%2C101%2C102%2C3%2C104%2C30%2C40%2C50%2C41%2C52%2C9%2C60%255D%2C%2522TransactionTypes%2522%3A%255B0%255D%2C%2522Location%2522%3A%2522molokai%2522%2C%2522Pricing%2522%3A%257B%257D%2C%2522Offset%2522%3A0%2C%2522SortingPreset%2522%3A3%257D",
  Icon: Compass,
};

const CATEGORIES: Search[] = [
  {
    title: "Residential",
    blurb: "Single-family homes across Molokaʻi, from town to the east and west ends.",
    href: "https://www.ramaui.com/search/molokai?q=%257B%2522SavedSearchId%2522%3A0%2C%2522SearchTypes%2522%3A%255B0%2C1%2C3%255D%2C%2522PropertyTypes%2522%3A%255B0%2C30%255D%2C%2522TransactionTypes%2522%3A%255B0%255D%2C%2522Location%2522%3A%2522molokai%2522%2C%2522Pricing%2522%3A%257B%257D%2C%2522Offset%2522%3A0%2C%2522SortingPreset%2522%3A0%257D",
    Icon: Home,
  },
  {
    title: "Condominiums",
    blurb: "Resort and oceanfront condos — Molokai Shores, Ke Nani Kai, Wavecrest, Kepuhi and more.",
    href: "https://www.ramaui.com/search/molokai?q=%257B%2522SavedSearchId%2522%3A0%2C%2522SearchTypes%2522%3A%255B0%2C1%2C3%255D%2C%2522PropertyTypes%2522%3A%255B3%255D%2C%2522TransactionTypes%2522%3A%255B0%255D%2C%2522Location%2522%3A%2522molokai%2522%2C%2522Pricing%2522%3A%257B%257D%2C%2522Offset%2522%3A0%2C%2522SortingPreset%2522%3A3%257D",
    Icon: Building2,
  },
  {
    title: "Vacant Land",
    blurb: "Buildable lots and acreage — your own piece of the most Hawaiian island.",
    href: "https://www.ramaui.com/search/Molokai?q=%257B%2522SavedSearchId%2522%3A0%2C%2522SearchTypes%2522%3A%255B0%2C1%2C3%255D%2C%2522PropertyTypes%2522%3A%255B40%255D%2C%2522TransactionTypes%2522%3A%255B0%255D%2C%2522Location%2522%3A%2522Molokai%2522%2C%2522Pricing%2522%3A%257B%257D%2C%2522Offset%2522%3A0%2C%2522SortingPreset%2522%3A3%257D",
    Icon: Trees,
  },
  {
    title: "Commercial",
    blurb: "Commercial buildings, storefronts and investment properties on Molokaʻi.",
    href: "https://www.ramaui.com/search/molokai?q=%257B%2522SavedSearchId%2522%3A0%2C%2522SearchTypes%2522%3A%255B0%2C1%2C3%255D%2C%2522PropertyTypes%2522%3A%255B50%255D%2C%2522TransactionTypes%2522%3A%255B0%255D%2C%2522Location%2522%3A%2522molokai%2522%2C%2522Pricing%2522%3A%257B%257D%2C%2522Offset%2522%3A0%2C%2522SortingPreset%2522%3A3%257D",
    Icon: Store,
  },
];

function SearchLink({ s, feature = false }: { s: Search; feature?: boolean }) {
  const { Icon } = s;
  return (
    <a
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Search ${s.title} on the Realtors Association of Maui (opens in a new tab)`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white p-7 shadow-[0_1px_0_rgba(33,24,20,0.05)] transition-all duration-500 hover:-translate-y-0.5 hover:border-bronze/40 hover:shadow-[0_24px_60px_-30px_rgba(33,24,20,0.3)] ${
        feature ? "sm:p-9" : ""
      }`}
    >
      <span className="flex items-center justify-between">
        <Icon
          className={`text-bronze ${feature ? "h-9 w-9" : "h-7 w-7"}`}
          strokeWidth={1.4}
          aria-hidden
        />
        <ArrowUpRight className="h-5 w-5 text-taupe transition-colors duration-300 group-hover:text-bronze-deep" aria-hidden />
      </span>
      <h3 className={`mt-5 font-display text-ink ${feature ? "text-2xl sm:text-3xl" : "text-xl"}`}>
        {s.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-taupe">{s.blurb}</p>
      <span className="mt-5 text-xs tracking-luxe uppercase text-bronze-deep">
        Search on RAMaui
      </span>
    </a>
  );
}

export default function MlsSearchPage() {
  return (
    <>
      <Nav solid />
      <main className="pt-20">
        {/* Header */}
        <section className="bg-espresso py-20 text-ivory sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow tone="light">For buyers</Eyebrow>
              <h1 className="mt-5 text-display-sm font-display text-ivory">
                Search the Molokaʻi MLS
              </h1>
              <p className="measure mt-5 text-lg text-ivory/75">
                Browse every active listing on Molokaʻi through the Realtors
                Association of Maui&apos;s live MLS. Pick a category below — each
                opens an up-to-the-minute search in a new tab. Found something you
                love? Dayna can show it to you.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Searches */}
        <section className="bg-ivory py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <SearchLink s={ALL} feature />
            </Reveal>
            <div className="mt-6 grid gap-6 sm:mt-7 sm:grid-cols-2">
              {CATEGORIES.map((s, i) => (
                <Reveal key={s.title} delay={0.05 * (i + 1)}>
                  <SearchLink s={s} />
                </Reveal>
              ))}
            </div>
            <p className="mt-8 text-center text-xs tracking-wide-2 uppercase text-taupe">
              Live searches open RAMaui.com — the Realtors Association of Maui — in a new tab
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-cream py-20 text-center sm:py-28">
          <div className="mx-auto max-w-2xl px-5">
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              Rather have a guide?
            </h2>
            <p className="measure mx-auto mt-4 text-base text-cocoa">
              See the listings Dayna represents, or reach out and she&apos;ll line
              up showings for anything that catches your eye.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/listings"
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-xs tracking-luxe uppercase text-ivory transition-colors duration-300 hover:bg-bronze"
              >
                Dayna&apos;s listings
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center rounded-full border border-ink/30 px-8 py-4 text-xs tracking-luxe uppercase text-ink transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory"
              >
                Ask Dayna
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
