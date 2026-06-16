import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, ArrowUpRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import ReviewCard from "@/components/ReviewCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { REVIEWS, REVIEW_SUMMARY, GOOGLE_REVIEWS, GOOGLE_SUMMARY } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "5.0 stars from 28 verified Zillow reviews. Read what Dayna Harris's Molokaʻi buyers and sellers say.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Header */}
        <section className="bg-espresso pt-36 pb-20 text-ivory sm:pt-44 sm:pb-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow index="01" tone="light">Reviews</Eyebrow>
              <h1 className="mt-5 text-display font-display text-ivory">
                A perfect{" "}
                <span className="text-gold">{REVIEW_SUMMARY.rating.toFixed(1)}</span>
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="flex gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-gold text-gold" aria-hidden />
                  ))}
                </span>
                <p className="nums text-sm tracking-luxe uppercase text-ivory/70">
                  {REVIEW_SUMMARY.count} verified Zillow reviews
                </p>
              </div>
              <p className="measure mt-6 text-lg text-ivory/75">
                Buyers and sellers across Molokaʻi on what it&apos;s like to work with
                Dayna &amp; John.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Reviews grid */}
        <section className="relative overflow-hidden bg-ivory py-24 sm:py-32">
          <Image
            src="/images/reviews-bg.jpg"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="pointer-events-none object-cover opacity-[0.12]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ivory via-transparent to-ivory" aria-hidden />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Stagger className="grid grid-cols-1 gap-7 md:grid-cols-2">
              {REVIEWS.map((r) => (
                <StaggerItem key={r.name}>
                  <ReviewCard review={r} />
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.1}>
              <div className="mt-14 flex flex-col items-center gap-6 border-t border-ink/10 pt-12 text-center">
                <p className="text-taupe">
                  These are excerpts — read every review on Zillow.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href={REVIEW_SUMMARY.zillowUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 rounded-full border border-ink/30 px-8 py-4 text-xs tracking-luxe uppercase text-ink transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory"
                  >
                    All {REVIEW_SUMMARY.count} reviews on Zillow
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <Link
                    href="/#contact"
                    className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-xs tracking-luxe uppercase text-ivory transition-colors duration-300 hover:bg-bronze"
                  >
                    Work with Dayna
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Google reviews */}
        <section className="bg-cream py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow index="02">Also on Google</Eyebrow>
              <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-2">
                <h2 className="text-display-sm font-display text-ink">
                  <span className="text-bronze-deep">{GOOGLE_SUMMARY.rating.toFixed(1)}</span> on Google
                </h2>
                <p className="nums pb-1 text-sm tracking-luxe uppercase text-taupe">
                  {GOOGLE_SUMMARY.count} Google reviews
                </p>
              </div>
              <p className="measure mt-5 text-lg text-cocoa">
                A few words from vacation guests on the Molokai Vacation Properties
                Google Business Profile.
              </p>
            </Reveal>

            <Stagger className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-3">
              {GOOGLE_REVIEWS.map((r) => (
                <StaggerItem key={r.name}>
                  <ReviewCard review={r} />
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.1}>
              <div className="mt-12 text-center">
                <a
                  href={GOOGLE_SUMMARY.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full border border-ink/30 px-8 py-4 text-xs tracking-luxe uppercase text-ink transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory"
                >
                  Read all {GOOGLE_SUMMARY.count} reviews on Google
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
