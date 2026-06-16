import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import Eyebrow from "@/components/Eyebrow";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";

export default function Communities() {
  return (
    <section id="communities" className="scroll-mt-24 bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow index="04">Where to live</Eyebrow>
            <h2 className="mt-4 text-display-sm font-display text-ink">
              Communities &amp; coastlines
            </h2>
            <p className="measure mt-5 text-lg text-cocoa">
              Formed by three volcanoes and just 26 miles from Oʻahu, Molokaʻi runs
              from the harbor town of Kaunakakai to the golden beaches of the West
              End — every corner with its own character. Here&apos;s where our owners
              call home.
            </p>
            <Link
              href="/our-island"
              className="group mt-6 inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm tracking-wide-2 uppercase text-ink transition-colors hover:border-bronze hover:text-bronze-deep"
            >
              Explore our island
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-3xl border border-ink/10 shadow-[0_30px_80px_-40px_rgba(33,24,20,0.4)] sm:aspect-[2/1]">
            <Image
              src="/images/molokai-bay.jpg"
              alt="A sweeping Molokaʻi bay framed by green sea cliffs and a crescent beach"
              fill
              sizes="(max-width: 1024px) 100vw, 1152px"
              className="graded object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16">
            <p className="mb-6 text-xs tracking-luxe uppercase text-bronze-deep">
              Find us in Kaunakakai
            </p>
            <GoogleMapEmbed />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
