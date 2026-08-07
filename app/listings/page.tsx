import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import ListingsBrowser from "@/components/ListingsBrowser";
import LandingLinks from "@/components/LandingLinks";
import { Reveal } from "@/components/motion";
import { getListings, LISTING_CATEGORIES } from "@/lib/listings";
import { SITE } from "@/lib/site";

// The canonical stays bare so the ?area=/?sort= views a visitor can share
// never compete with /listings in search results.
export const metadata: Metadata = {
  title: "Current Listings",
  description:
    "Homes, condominiums and land for sale on Molokaʻi. Filter by area, sort by price and view every listing on the MLS.",
  alternates: { canonical: "/listings" },
};

export default async function ListingsPage() {
  const all = await getListings();
  return (
    <>
      <Nav solid />
      <main id="main-content" className="pt-20">
        <section id="listings" className="scroll-mt-24 bg-ivory py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <Eyebrow index="03">For sale on Molokaʻi</Eyebrow>
                  <h1 className="mt-4 text-display-sm font-display text-ink">
                    Current Listings on Molokaʻi
                  </h1>
                </div>
                <a
                  href={SITE.ramAgentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm tracking-wide-2 uppercase text-ink transition-colors hover:border-bronze hover:text-bronze-deep"
                >
                  View all on MLS
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </Reveal>

            <ListingsBrowser listings={all} categories={LISTING_CATEGORIES} />
          </div>
        </section>

        <LandingLinks heading="Browse by type and area" />
      </main>
      <Footer />
    </>
  );
}
