import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import { Reveal } from "@/components/motion";
import Gallery from "@/components/Gallery";

export const metadata: Metadata = {
  title: "Our Island",
  description:
    "Molokaʻi's towns, coastlines and resort communities — where our owners live.",
  alternates: { canonical: "/our-island" },
};

export default function OurIslandPage() {
  return (
    <>
      <Nav solid />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative h-[66vh] min-h-[460px] overflow-hidden">
          <Image
            src="/images/reef-aerial.jpg"
            alt="Aerial view of Molokaʻi's lush green mountains rising above a vast turquoise coral reef and calm Pacific shallows"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/30 to-transparent"
            aria-hidden
          />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-12 sm:px-8 sm:pb-16">
            <Reveal>
              <Eyebrow tone="light">Where to live</Eyebrow>
              <h1 className="mt-5 font-display text-display-sm text-ivory">
                Our island
              </h1>
              <p className="measure mt-5 text-lg text-ivory/80">
                From the harbor town of Kaunakakai to the golden beaches of the
                West End — the towns, coastlines and resort communities that make
                up Molokaʻi, and where our owners call home.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Island story */}
        <section className="bg-ivory py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="text-lg leading-relaxed text-cocoa">
                Just 38 miles long and 10 miles wide, Molokaʻi is the most
                Hawaiian of the islands — roughly 8,000 residents, the majority of
                Hawaiian ancestry, and not a single building taller than a coconut
                palm. Each end of the island keeps its own character.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-base leading-relaxed text-taupe">
                The south shore around Kaunakakai is the friendly heart — the
                harbor, the shops, the oceanfront condominiums. West, past
                Maunaloa, the land opens to ranch country and the golden sands of
                Kepuhi and Pāpōhaku. East, the highway winds through rain-greened
                valleys to Hālawa. Wherever you picture yourself, we know the road
                to it.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Photo gallery */}
        <section className="bg-ivory py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow index="02">The island, up close</Eyebrow>
              <h2 className="mt-4 text-display-sm font-display text-ink">
                A few favorite views
              </h2>
              <p className="measure mt-5 text-lg text-cocoa">
                From golden-hour south-shore sunsets to the wild coastline and
                quiet beaches — a glimpse of life on Molokaʻi. Tap any photo to
                explore.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10">
                <Gallery />
              </div>
            </Reveal>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
