"use client";

import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import Eyebrow from "@/components/Eyebrow";
import CountUp from "@/components/CountUp";
import { SITE } from "@/lib/site";

export default function Intro() {
  return (
    <section className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Aerial banner — the phrase sits over the island at dusk */}
        <Reveal>
          <div className="relative h-[440px] overflow-hidden rounded-3xl border border-ink/10 shadow-[0_40px_90px_-50px_rgba(33,24,20,0.6)] sm:h-[520px]">
            <Image
              src="/images/intro-aerial.jpg"
              alt="Aerial view of Kaunakakai and the south shore of Molokaʻi at sunset"
              fill
              sizes="(max-width: 1280px) 100vw, 1152px"
              className="object-cover"
              priority
            />
            {/* legibility scrim — darkest at the foot where the text sits */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/35 to-espresso/15"
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-12">
              <Eyebrow index="01" tone="light">
                The last unspoiled island
              </Eyebrow>
              <h2 className="mt-5 max-w-3xl font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-5xl">
                No traffic lights. No high-rises.
                <span className="text-ivory/70"> Only </span>
                <span className="italic text-gold">the Hawaiʻi that was.</span>
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Supporting copy */}
        <div className="mt-12 grid gap-10 sm:mt-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-lg leading-relaxed text-cocoa">
              Molokaʻi keeps its own time — long golden beaches, the tallest sea
              cliffs in the world, and a community that still lives by the land
              and the tide. Just 38 miles long and home to roughly 8,000 people,
              the majority of Hawaiian ancestry, it&apos;s the island where no
              building stands taller than a coconut palm.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-base leading-relaxed text-taupe">
              As an island-based, family-run brokerage, we guide you through every
              acre and every wave — from your first visit to the keys in your hand.
              If Molokaʻi is where you long to be, now is always the time to come home.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-3">
          {SITE.stats.map((s) => (
            <StaggerItem key={s.label} className="bg-ivory">
              <div className="px-8 py-10 text-center">
                <CountUp
                  value={s.value}
                  className="nums block font-display text-4xl text-bronze-deep sm:text-5xl"
                />
                <p className="mt-3 text-xs tracking-luxe uppercase text-taupe">
                  {s.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
