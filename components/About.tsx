"use client";

import Image from "next/image";
import { ArrowRight, Award } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion";
import Eyebrow from "@/components/Eyebrow";
import { SITE } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

type BrokerCard = {
  photo: string;
  alt: string;
  name: string;
  credentials: string;
  phone: string;
  phoneHref: string;
  bio: string;
};

export default function About() {
  const reduce = useReducedMotion();
  const [dayna, john] = SITE.team;

  const brokers: BrokerCard[] = [
    {
      photo: "/images/dayna-portrait.jpg",
      alt: "Dayna E. Harris with her two sons on Molokaʻi",
      name: dayna.name,
      credentials: `${dayna.role} · ${dayna.license}`,
      phone: dayna.phone,
      phoneHref: dayna.phoneHref,
      bio: SITE.broker.bio,
    },
    {
      photo: "/images/john-portrait.jpg",
      alt: "John Warring with his family on Molokaʻi",
      name: john.name,
      credentials: "license" in john && john.license ? `${john.role} · ${john.license}` : john.role,
      phone: john.phone,
      phoneHref: john.phoneHref,
      bio: "bio" in john ? john.bio : "",
    },
  ];

  return (
    <section id="about" className="scroll-mt-24 bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Shared header */}
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Eyebrow index="05">Your island team</Eyebrow>
          </div>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-normal tracking-wide text-ink">
            Meet your brokers
          </h2>
          <blockquote className="mx-auto mt-6 max-w-2xl font-sans text-xl font-light italic leading-snug text-cocoa sm:text-2xl">
            “We don’t just sell homes — we educate you about Molokaʻi, so you
            fall in love with the island the right way.”
          </blockquote>
          {/* Firm-level accolade — earned by Molokai Vacation Properties as a
              whole (Dayna + John), so it sits above both brokers, not on one card. */}
          <div className="mt-7 flex justify-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-bronze/10 px-5 py-2 text-center text-xs tracking-wide-2 uppercase text-bronze-deep">
              <Award className="h-4 w-4 shrink-0 text-bronze" strokeWidth={1.6} aria-hidden />
              Molokai Vacation Properties · {SITE.accoladeShort}
            </p>
          </div>
        </Reveal>

        {/* Two equal broker cards */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-10 sm:mt-16 md:grid-cols-2 md:gap-12">
          {brokers.map((b, i) => (
            <m.figure
              key={b.name}
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : i * 0.1 }}
              className="flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_24px_60px_-30px_rgba(33,24,20,0.45)]">
                <Image
                  src={b.photo}
                  alt={b.alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="graded object-cover object-top"
                />
              </div>
              <figcaption className="mt-6 flex flex-col">
                <h3 className="font-display text-2xl text-ink">{b.name}</h3>
                <p className="mt-1.5 text-[11px] tracking-wide-2 uppercase text-bronze-deep">
                  {b.credentials}
                </p>
                <a
                  href={b.phoneHref}
                  className="nums mt-2 inline-block self-start text-sm text-cocoa transition-colors hover:text-bronze-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-deep"
                >
                  {b.phone}
                </a>
                <p className="mt-5 text-base leading-relaxed text-cocoa">{b.bio}</p>
              </figcaption>
            </m.figure>
          ))}
        </div>

        {/* Shared CTA */}
        <div className="mt-14 text-center">
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 rounded-full border border-ink/30 px-8 py-4 text-xs tracking-luxe uppercase text-ink transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-deep"
          >
            Start a conversation
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
