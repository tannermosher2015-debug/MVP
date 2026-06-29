import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";
import { LANDING_PAGES } from "@/lib/landing";

/**
 * Internal-link block tying the SEO landing pages together. Dropped onto each
 * landing page plus /listings and /our-island so the pages link to each other
 * (and the hubs link in) — the signal that lets them rank.
 */
export default function LandingLinks({
  exclude,
  heading = "Browse Molokaʻi real estate",
}: {
  exclude?: string;
  heading?: string;
}) {
  const pages = LANDING_PAGES.filter((p) => p.slug !== exclude);
  return (
    <section className="bg-cream/60 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Eyebrow>{heading}</Eyebrow>
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/${p.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white px-5 py-4 text-ink transition-colors hover:border-bronze focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-deep"
              >
                <span className="font-display text-lg">{p.h1}</span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-bronze transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
