import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Maximize2 } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import { Reveal } from "@/components/motion";

export const metadata: Metadata = {
  title: "Resort & Community Maps",
  description:
    "Site maps, aerial views and floor plans for Molokaʻi's resorts and subdivisions — Molokai Shores, Ke Nani Kai, Paniolo Hale, Kepuhi Beach Resort, Wavecrest, Pāpōhaku Ranchlands and Kawela.",
  alternates: { canonical: "/maps" },
};

type MapImg = { src: string; w: number; h: number };
type Complex = {
  name: string;
  area: string;
  note: string;
  map: MapImg;
  aerial?: MapImg;
  aerialLabel?: string;
  floorplan?: MapImg;
};

const complexes: Complex[] = [
  {
    name: "Molokai Shores",
    area: "Kaunakakai · South Shore",
    note: "Oceanfront condominium resort steps from town.",
    map: { src: "/images/maps/molokai-shores-map.png", w: 506, h: 767 },
    aerial: { src: "/images/maps/molokai-shores-aerial.jpeg", w: 1280, h: 688 },
    floorplan: { src: "/images/maps/molokai-shores-floorplan.png", w: 418, h: 325 },
  },
  {
    name: "Wavecrest",
    area: "East End",
    note: "Oceanfront garden condominiums on the lush east end.",
    map: { src: "/images/maps/wavecrest-map.png", w: 656, h: 548 },
    aerial: { src: "/images/maps/wavecrest-aerial.jpg", w: 3992, h: 1729 },
    floorplan: { src: "/images/maps/wavecrest-floorplan.png", w: 319, h: 373 },
  },
  {
    name: "Ke Nani Kai",
    area: "Maunaloa · West End",
    note: "Resort condominiums by Kepuhi Beach and the west-end golf links.",
    map: { src: "/images/maps/ke-nani-kai-map.png", w: 500, h: 674 },
    aerial: { src: "/images/maps/ke-nani-kai-aerial.jpg", w: 3991, h: 1623 },
    floorplan: { src: "/images/maps/ke-nani-kai-floorplan.png", w: 345, h: 571 },
  },
  {
    name: "Paniolo Hale",
    area: "Maunaloa · West End",
    note: "Beautiful townhomes nestled in the trees.",
    map: { src: "/images/maps/paniolo-hale-map.png", w: 618, h: 370 },
    aerial: { src: "/images/maps/paniolo-hale-aerial.jpeg", w: 1280, h: 719 },
    floorplan: { src: "/images/maps/paniolo-hale-floorplan.png", w: 588, h: 496 },
  },
  {
    name: "Kepuhi Beach Resort",
    area: "Maunaloa · West End",
    note: "West Molokaʻi resort condominiums beside Kepuhi Beach.",
    map: { src: "/images/maps/kepuhi-map.png", w: 731, h: 599 },
    aerial: { src: "/images/maps/kepuhi-aerial.jpg", w: 5859, h: 2141 },
    floorplan: { src: "/images/maps/kepuhi-floorplan.png", w: 408, h: 555 },
  },
  {
    name: "Pāpōhaku Ranchlands",
    area: "Maunaloa · West End",
    note: "Large residential lots above Molokaʻi's longest white-sand beach.",
    map: { src: "/images/maps/papohaku-map.png", w: 2000, h: 818 },
    aerial: { src: "/images/maps/papohaku-aerial.jpg", w: 1500, h: 2000 },
  },
  {
    name: "Kawela",
    area: "Kaunakakai · South Shore",
    note: "Two-acre hillside lots, all with sweeping ocean views.",
    map: { src: "/images/maps/kawela-map.jpg", w: 1600, h: 1007 },
    aerial: { src: "/images/maps/kawela-view.jpg", w: 1080, h: 608 },
    aerialLabel: "Ocean view from the lots · tap to enlarge",
  },
];

function MapFigure({ img, label }: { img: MapImg; label: string }) {
  return (
    <figure>
      <a
        href={img.src}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-2xl border border-ink/10 bg-white p-4 shadow-[0_1px_0_rgba(33,24,20,0.05)] transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgba(33,24,20,0.3)]"
      >
        <Image
          src={img.src}
          alt={label}
          width={img.w}
          height={img.h}
          sizes="(max-width: 1024px) 100vw, 560px"
          className="mx-auto h-auto w-full"
        />
        <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-[10px] tracking-luxe uppercase text-ivory opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Maximize2 className="h-3 w-3" aria-hidden /> Enlarge
        </span>
      </a>
      <figcaption className="mt-3 text-center text-xs tracking-wide-2 uppercase text-taupe">
        {label}
      </figcaption>
    </figure>
  );
}

export default function MapsPage() {
  return (
    <>
      <Nav solid />
      <main className="pt-20">
        {/* Header */}
        <section className="bg-espresso py-20 text-ivory sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow tone="light">For buyers</Eyebrow>
              <h1 className="mt-5 text-display-sm font-display text-ivory">
                Resort &amp; community maps
              </h1>
              <p className="measure mt-5 text-lg text-ivory/75">
                Find your way around Molokaʻi&apos;s resorts and subdivisions — site
                maps, aerial views and floor plans so you can picture a unit, and
                exactly where it sits, before you ever set foot on island. Tap any
                image to enlarge.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Maps */}
        <section className="bg-ivory py-24 sm:py-32">
          <div className="mx-auto max-w-7xl space-y-20 px-5 sm:px-8">
            {complexes.map((c, i) => (
              <Reveal key={c.name}>
                <div className="border-t border-ink/10 pt-12 first:border-0 first:pt-0">
                  <Eyebrow index={String(i + 1).padStart(2, "0")}>{c.area}</Eyebrow>
                  <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                    <h2 className="text-display-sm font-display text-ink">{c.name}</h2>
                    <p className="text-base text-taupe">{c.note}</p>
                  </div>
                  <div
                    className={`mt-8 grid gap-7 ${c.aerial || c.floorplan ? "lg:grid-cols-2" : "max-w-4xl"}`}
                  >
                    <MapFigure img={c.map} label="Site map · tap to enlarge" />
                    {(c.aerial || c.floorplan) && (
                      <div className="space-y-7">
                        {c.aerial && (
                          <MapFigure
                            img={c.aerial}
                            label={c.aerialLabel ?? "Aerial view · tap to enlarge"}
                          />
                        )}
                        {c.floorplan && (
                          <MapFigure img={c.floorplan} label="Floor plans · tap to enlarge" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-cream py-20 text-center sm:py-28">
          <div className="mx-auto max-w-2xl px-5">
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              See something you love?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/listings"
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-xs tracking-luxe uppercase text-ivory transition-colors duration-300 hover:bg-bronze"
              >
                View listings
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="/#contact"
                className="inline-flex items-center rounded-full border border-ink/30 px-8 py-4 text-xs tracking-luxe uppercase text-ink transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory"
              >
                Ask Dayna
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
