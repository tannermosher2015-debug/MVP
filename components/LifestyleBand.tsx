"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LifestyleBand() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const y = reduce ? "0%" : yRaw;

  return (
    <section
      ref={ref}
      className="relative flex min-h-[78vh] items-center overflow-hidden"
    >
      <m.div style={{ y }} className="absolute -inset-[10%] -z-10">
        <Image
          src="/images/lifestyle-band.jpg"
          alt="An oceanfront pool deck on Molokaʻi looking across the Pacific to the neighbor islands"
          fill
          sizes="100vw"
          className="graded object-cover"
        />
      </m.div>
      <div className="absolute inset-0 -z-10 bg-espresso/45" aria-hidden />
      <div className="scrim-full absolute inset-0 -z-10" aria-hidden />

      <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
        <m.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="max-w-3xl"
        >
          <p className="text-xs tracking-luxe uppercase text-gold">The island life</p>
          <blockquote className="mt-6 font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
            Wake to the sound of the reef, open the doors, and let the
            <span className="italic text-gold"> Pacific </span>
            be your front yard.
          </blockquote>
          <p className="measure mt-6 text-lg text-ivory/75">
            Indoor-outdoor living, framed by the sea — the quiet luxury that only
            Molokaʻi still offers.
          </p>
        </m.div>
      </div>
    </section>
  );
}
