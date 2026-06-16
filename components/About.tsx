"use client";

import Image from "next/image";
import { ArrowRight, Award } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion";
import Eyebrow from "@/components/Eyebrow";
import { SITE } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function About() {
  const reduce = useReducedMotion();
  const [dayna, john] = SITE.team;
  return (
    <section id="about" className="scroll-mt-24 bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Broker cards — side by side */}
          <m.div
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="lg:col-span-6"
          >
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {/* Dayna */}
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_24px_60px_-30px_rgba(33,24,20,0.45)]">
                  <Image
                    src="/images/dayna-portrait.jpg"
                    alt="Dayna E. Harris with her two sons on Molokaʻi"
                    fill
                    sizes="(max-width: 1024px) 45vw, 24vw"
                    className="graded object-cover object-top"
                  />
                </div>
                <figcaption className="mt-4">
                  <p className="font-display text-lg text-ink">{dayna.name}</p>
                  <p className="mt-1 text-[11px] tracking-wide-2 uppercase text-bronze-deep">
                    {dayna.role} · {dayna.license}
                  </p>
                  <a
                    href={dayna.phoneHref}
                    className="nums mt-1.5 inline-block text-sm text-cocoa transition-colors hover:text-bronze-deep"
                  >
                    {dayna.phone}
                  </a>
                </figcaption>
              </figure>

              {/* John */}
              <figure>
                <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-espresso to-ink shadow-[0_24px_60px_-30px_rgba(33,24,20,0.45)]">
                  <span className="font-display text-6xl text-gold/85">JW</span>
                  <span className="absolute bottom-4 text-[9px] tracking-luxe uppercase text-ivory/40">
                    Photo coming soon
                  </span>
                </div>
                <figcaption className="mt-4">
                  <p className="font-display text-lg text-ink">{john.name}</p>
                  <p className="mt-1 text-[11px] tracking-wide-2 uppercase text-bronze-deep">
                    {john.role}
                  </p>
                  <a
                    href={john.phoneHref}
                    className="nums mt-1.5 inline-block text-sm text-cocoa transition-colors hover:text-bronze-deep"
                  >
                    {john.phone}
                  </a>
                </figcaption>
              </figure>
            </div>

            {"bio" in john && john.bio && (
              <div className="mt-8 border-t border-ink/10 pt-6">
                <p className="text-xs tracking-wide-2 uppercase text-bronze-deep">
                  {john.name} · {john.role}
                </p>
                <p className="measure mt-3 text-base leading-relaxed text-cocoa">
                  {john.bio}
                </p>
              </div>
            )}
          </m.div>

          {/* Bio */}
          <Reveal className="lg:col-span-6" delay={0.1}>
            <Eyebrow index="05">Your island team</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-normal tracking-wide text-ink">
              {SITE.broker.name}
            </h2>
            <p className="mt-2 text-sm tracking-wide-2 uppercase text-taupe">
              {SITE.broker.title} · {SITE.legalName}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-bronze/10 px-4 py-1.5 text-xs tracking-wide-2 uppercase text-bronze-deep">
              <Award className="h-4 w-4 shrink-0 text-bronze" strokeWidth={1.6} aria-hidden />
              {SITE.accolade}
            </p>

            <blockquote className="mt-8 border-l-2 border-bronze pl-6 font-sans text-2xl font-light italic leading-snug text-cocoa sm:text-3xl">
              “We don't just sell homes — we educate you about Molokaʻi, so you
              fall in love with the island the right way.”
            </blockquote>

            <p className="measure mt-7 text-lg leading-relaxed text-cocoa">
              {SITE.broker.bio}
            </p>

            <a
              href="#contact"
              className="group mt-9 inline-flex items-center gap-3 rounded-full border border-ink/30 px-8 py-4 text-xs tracking-luxe uppercase text-ink transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory"
            >
              Start a conversation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
