"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import Eyebrow from "@/components/Eyebrow";
import CountUp from "@/components/CountUp";
import { type Listing, formatPrice, formatBaths } from "@/lib/listings";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function FeaturedProperty({ listing }: { listing: Listing }) {
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

  return (
    <section
      ref={ref}
      className="bg-cream py-24 sm:py-32"
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
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_30px_80px_-30px_rgba(33,24,20,0.45)]">
            <m.div style={{ y: imgY }} className="absolute -inset-[8%]">
              <Image
                src={listing.image}
                alt={listing.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="graded object-cover transition-transform duration-[1.3s] ease-luxe group-hover:scale-[1.04]"
              />
            </m.div>
          </div>
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
            {listing.title}
          </h2>
          <p className="mt-3 flex items-center gap-2 text-sm tracking-wide-2 uppercase text-taupe">
            <MapPin className="h-4 w-4 text-bronze" aria-hidden />
            {listing.address}, {listing.city}
          </p>
          <p className="measure mt-6 text-lg text-cocoa">{listing.description}</p>

          <dl className="mt-9 grid grid-cols-4 gap-2 border-y border-ink/10 py-6">
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

          <m.a
            href="#contact"
            whileHover={reduce ? undefined : { scale: 1.035 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-xs tracking-luxe uppercase text-ivory transition-colors duration-300 hover:bg-bronze"
          >
            Inquire about this property
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </m.a>
        </m.div>
      </div>
    </section>
  );
}
