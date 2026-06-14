"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import Eyebrow from "@/components/Eyebrow";
import ListingCard from "@/components/ListingCard";
import { SITE } from "@/lib/site";
import type { Listing } from "@/lib/listings";

const ALL = "All Listings";

export default function ListingsGrid({ listings }: { listings: Listing[] }) {
  const [area, setArea] = useState<string>(ALL);

  // Area tabs, ordered by how many listings each has.
  const areas = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of listings) counts.set(l.area, (counts.get(l.area) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([a]) => a);
  }, [listings]);

  // Listen for clicks from the Communities area cards.
  useEffect(() => {
    const onSet = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setArea(detail || ALL);
    };
    window.addEventListener("molokai:set-area", onSet);
    return () => window.removeEventListener("molokai:set-area", onSet);
  }, []);

  const shown = area === ALL ? listings : listings.filter((l) => l.area === area);

  return (
    <section id="listings" className="scroll-mt-24 bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow index="03">For sale on Molokaʻi</Eyebrow>
              <h2 className="mt-4 text-display-sm font-display text-ink">Current Listings</h2>
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

        {/* Area filter tabs */}
        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap gap-2">
            {[ALL, ...areas].map((a) => {
              const active = a === area;
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setArea(a)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-2 text-xs tracking-wide-2 uppercase transition-colors duration-300 ${
                    active
                      ? "border-bronze bg-bronze text-ivory"
                      : "border-ink/15 text-taupe hover:border-bronze/50 hover:text-ink"
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </Reveal>

        {shown.length > 0 ? (
          <Stagger
            key={area}
            className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
          >
            {shown.map((listing) => (
              <StaggerItem key={listing.id}>
                <ListingCard listing={listing} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="mt-12 rounded-2xl border border-ink/10 bg-cream/60 px-6 py-16 text-center">
            <p className="text-lg text-cocoa">
              No current listings in <span className="text-ink">{area}</span>.
            </p>
            <button
              type="button"
              onClick={() => setArea(ALL)}
              className="mt-4 text-sm tracking-wide-2 uppercase text-bronze-deep underline"
            >
              View all listings
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
