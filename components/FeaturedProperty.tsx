"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import Eyebrow from "@/components/Eyebrow";
import CountUp from "@/components/CountUp";
import { type Listing, formatPrice, formatBaths } from "@/lib/listings";

const EASE = [0.22, 1, 0.36, 1] as const;

// `summary` is the opening of the agent's full remarks: listing.description is RAM's
// og:description, which stops mid-sentence ("offering space…").
export default function FeaturedProperty({ listing, summary }: { listing: Listing; summary: string }) {
  const href = `/listings/${listing.slug}`;
  const photoCount = listing.photos?.length ?? 0;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgYRaw = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const imgY = reduce ? "0%" : imgYRaw;

  const fromLeft = {
    hidden: { opacity: 0, x: reduce ? 0 : -40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
  };
  const fromRight = {
    hidden: { opacity: 0, x: reduce ? 0 : 40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE, delay: 0.1 } },
  };

  const stats = [
    { value: listing.beds > 0 ? String(listing.beds) : "—", label: "Bedrooms", count: listing.beds > 0 },
    { value: listing.baths > 0 ? formatBaths(listing.baths) : "—", label: "Bathrooms", count: false },
    { value: listing.type, label: "Property", count: false },
    { value: "For Sale", label: "Status", count: false },
  ];

  // The section clips on x because the details panel animates in from x:40, and
  // that 40px widened the whole document until it settled, letting the page drag
  // sideways at every width. `clip` contains it without making a scroll
  // container, so overflow-y stays visible.
  return (
    <section
      ref={ref}
      className="overflow-x-clip bg-cream py-24 sm:py-32"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        {/* Image */}
        <m.div
          variants={fromLeft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          className="group relative lg:col-span-7"
        >
          {/* The photo opens the listing too; the heading link below is the one keyboard and screen readers get. */}
          <Link href={href} tabIndex={-1} aria-hidden className="relative block aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_30px_80px_-30px_rgba(33,24,20,0.45)]">
            <m.div style={{ y: imgY }} className="absolute -inset-[8%]">
              <Image
                src={listing.image}
                alt={listing.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="graded object-cover transition-transform duration-[1.3s] ease-luxe group-hover:scale-[1.04]"
              />
            </m.div>
          </Link>
          {/* floating price */}
          <div className="absolute -bottom-6 left-6 rounded-2xl bg-espresso px-7 py-4 shadow-xl sm:left-10">
            <p className="text-[10px] tracking-luxe uppercase text-ivory/60">Offered at</p>
            <p className="nums font-display text-2xl text-ivory sm:text-3xl">
              {formatPrice(listing.price)}
            </p>
          </div>
        </m.div>

        {/* Details */}
        <m.div
          variants={fromRight}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          className="lg:col-span-5"
        >
          <Eyebrow index="02">Featured Property</Eyebrow>
          <h2
            id="featured-heading"
            className="mt-4 text-display-sm font-display text-ink"
          >
            <Link href={href} className="transition-colors hover:text-bronze-deep">
              {listing.title}
            </Link>
          </h2>
          <p className="mt-3 flex items-center gap-2 text-sm tracking-wide-2 uppercase text-taupe">
            <MapPin className="h-4 w-4 text-bronze" aria-hidden />
            {listing.address}, {listing.city}
          </p>
          <p className="measure mt-6 text-lg text-cocoa">{summary}</p>

          <dl className="mt-9 grid grid-cols-2 gap-x-2 gap-y-5 border-y border-ink/10 py-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dd>
                  {s.count ? (
                    <CountUp
                      value={s.value}
                      className="nums font-display text-2xl text-ink sm:text-3xl"
                    />
                  ) : (
                    <span className="nums font-display text-2xl text-ink sm:text-3xl">
                      {s.value}
                    </span>
                  )}
                </dd>
                <dt className="mt-1 text-[11px] tracking-wide-2 uppercase text-taupe">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-wrap items-center gap-4">
          <m.a
            href="#contact"
            whileHover={reduce ? undefined : { scale: 1.035 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-xs tracking-luxe uppercase text-ivory transition-colors duration-300 hover:bg-bronze"
          >
            Inquire about this property
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </m.a>
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full border border-ink/30 px-8 py-4 text-xs tracking-luxe uppercase text-ink transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory"
          >
            {photoCount > 1 ? `See all ${photoCount} photos` : "View the property"}
          </Link>
          </div>
        </m.div>
      </div>
    </section>
  );
}
