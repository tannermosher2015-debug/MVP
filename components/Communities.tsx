import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import Eyebrow from "@/components/Eyebrow";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";
import { SITE } from "@/lib/site";
import { getListings, categoryFor, categorySlug } from "@/lib/listings";

// Where each area can be shopped. Towns go to their landing page, and Kawela, whose note
// is its two-acre lots, to land. The rest have no page yet.
const AREA_LINKS: Record<string, string> = {
  Kaunakakai: "/kaunakakai-real-estate",
  "Maunaloa · West End": "/maunaloa-real-estate",
  Kawela: "/molokai-land-for-sale",
};
// Complexes go to their /listings filter while it has units, else to their site map.
const AREA_COMPLEX: Record<string, string> = {
  "Molokai Shores": "Molokai Shores",
  "Ke Nani Kai": "Ke Nani Kai",
  "Paniolo Hale": "Paniolo Hale",
  Wavecrest: "Wavecrest",
  "Kepuhi Beach": "Kepuhi Beach Resort",
};

export default async function Communities() {
  const listed = new Set((await getListings()).map(categoryFor));
  const hrefFor = (name: string) => {
    const complex = AREA_COMPLEX[name];
    if (!complex) return AREA_LINKS[name];
    return listed.has(complex) ? `/listings?area=${categorySlug(complex)}` : "/maps";
  };
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
              End - every corner with its own character. Here&apos;s where our owners
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

        {/* The section promised "every corner" and named two. SITE.areas already holds ten
            with a line each; every one with a page of its own links to it. */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal delay={0.1} className="hidden lg:col-span-5 lg:block">
            <div className="relative h-full min-h-[420px] overflow-hidden rounded-3xl border border-ink/10 shadow-[0_30px_80px_-40px_rgba(33,24,20,0.4)]">
              <Image
                src="/images/molokai-bay.jpg"
                alt="A sweeping Molokaʻi bay framed by green sea cliffs and a crescent beach"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="graded object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {SITE.areas.map((a) => {
                const href = hrefFor(a.name);
                const body = (
                  <>
                    <span className="flex items-center justify-between gap-3 font-display text-xl text-ink">
                      {a.name}
                      {href && (
                        <ArrowRight className="h-4 w-4 shrink-0 text-bronze transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                      )}
                    </span>
                    <span className="mt-1 block text-sm text-taupe">{a.note}</span>
                  </>
                );
                return (
                  <li key={a.name} className="border-b border-ink/10">
                    {href ? (
                      <Link href={href} className="group block py-4 transition-colors hover:text-bronze-deep">
                        {body}
                      </Link>
                    ) : (
                      <div className="py-4">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

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
