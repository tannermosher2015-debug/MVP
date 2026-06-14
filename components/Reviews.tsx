"use client";

import { Star, ArrowRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import Eyebrow from "@/components/Eyebrow";
import ReviewCard from "@/components/ReviewCard";
import { REVIEWS, REVIEW_SUMMARY } from "@/lib/reviews";

export default function Reviews() {
  const featured = REVIEWS.slice(0, 3);
  return (
    <section id="reviews" className="scroll-mt-24 bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow index="06">Client love</Eyebrow>
              <h2 className="mt-4 text-display-sm font-display text-ink">A perfect 5.0</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-gold text-gold" aria-hidden />
                ))}
              </span>
              <p className="nums text-sm tracking-wide-2 uppercase text-taupe">
                {REVIEW_SUMMARY.rating.toFixed(1)} · {REVIEW_SUMMARY.count} Zillow reviews
              </p>
            </div>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-3">
          {featured.map((r) => (
            <StaggerItem key={r.name}>
              <ReviewCard review={r} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-10 text-center">
            <a
              href="/reviews"
              className="group inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm tracking-wide-2 uppercase text-ink transition-colors hover:border-bronze hover:text-bronze-deep"
            >
              Read all {REVIEW_SUMMARY.count} reviews
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
