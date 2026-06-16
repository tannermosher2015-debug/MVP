"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Palmtree, Award } from "lucide-react";
import { SITE } from "@/lib/site";

const signals = [
  { icon: Palmtree, title: "", body: "Curated Molokaʻi homes, lands, condos & estates" },
  { icon: Award, title: "#1 in Maui County", body: "Most properties sold in 2026 · Top 10 in 2025" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // Scroll-linked parallax on the background only — the foreground text paints
  // via CSS at first render (no hydration gate), keeping LCP fast.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const y = reduce ? "0%" : yRaw;

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden"
    >
      {/* Parallax background — image is server-rendered & preloaded (priority) */}
      <m.div style={{ y }} className="absolute inset-0 -z-10">
        <div className="anim-zoom relative h-[116%] w-full">
          <Image
            src="/images/hero-molokai.jpg"
            alt="Golden-hour sunset over the calm waters of Molokaʻi's south shore, Hawaiʻi"
            fill
            priority
            sizes="100vw"
            className="graded object-cover"
          />
        </div>
      </m.div>

      {/* Warm tint + legibility scrim */}
      <div className="tint-warm absolute inset-0 -z-10 opacity-80" aria-hidden />
      <div className="scrim-full absolute inset-0 -z-10" aria-hidden />

      {/* Headline block */}
      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-32 sm:px-8">
        <div className="max-w-3xl">
          <p className="anim-rise mb-6 text-xs tracking-luxe text-ivory/80 uppercase">
            <span className="text-gold">ʻ</span>&nbsp;Molokaʻi · Hawaiʻi
          </p>

          <h1 className="text-display font-display font-normal text-ivory">
            <span className="mask-line">
              <span style={{ animationDelay: "0.12s" }}>{SITE.heroHeadline[0]}</span>
            </span>
            <span className="mask-line">
              <span className="italic text-gold" style={{ animationDelay: "0.24s" }}>
                {SITE.heroHeadline[1]}
              </span>
            </span>
          </h1>

          <p
            className="anim-rise measure mt-7 text-lg text-ivory/85"
            style={{ animationDelay: "0.32s" }}
          >
            {SITE.heroSub}
          </p>

          <div
            className="anim-rise mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "0.46s" }}
          >
            <Link
              href="/listings"
              className="group inline-flex items-center gap-3 rounded-full bg-ivory px-8 py-4 text-xs tracking-luxe uppercase text-ink transition duration-300 hover:scale-[1.03] hover:bg-gold active:scale-95"
            >
              Explore Properties
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 rounded-full border border-ivory/45 px-8 py-4 text-xs tracking-luxe uppercase text-ivory transition duration-300 hover:scale-[1.03] hover:border-ivory hover:bg-ivory/10 active:scale-95"
            >
              Speak with Our Team
            </a>
          </div>
        </div>
      </div>

      {/* Bottom signal bar */}
      <div className="anim-fade border-t border-ivory/15 bg-espresso/30 backdrop-blur-sm" style={{ animationDelay: "0.62s" }}>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px px-5 sm:grid-cols-2 sm:px-8">
          {signals.map(({ icon: Icon, title, body }) => (
            <div key={body} className="flex items-center gap-4 py-5 sm:py-6">
              <Icon className="h-6 w-6 shrink-0 text-gold" strokeWidth={1.4} aria-hidden />
              <div>
                {title && (
                  <p className="text-xs tracking-wide-2 uppercase text-ivory">{title}</p>
                )}
                <p className={`text-sm ${title ? "text-ivory/65" : "text-ivory"}`}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
