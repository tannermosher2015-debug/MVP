import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import { Reveal } from "@/components/motion";
import RentalInquiry from "@/components/RentalInquiry";
import { RENTAL, TBD, isTBD } from "@/lib/rental";

export const metadata: Metadata = {
  title: "Vacation Stay at Kepuhi Beach",
  description:
    "A west-end condominium at Kepuhi Beach Resort on Molokaʻi, available to rent directly from Molokai Vacation Properties.",
  alternates: { canonical: "/vacation-rentals" },
};

/**
 * Renders a fact, or a visibly flagged chip when the owner hasn't supplied it.
 *
 * The chip is deliberately OPAQUE (solid gold, espresso text ≈ 9:1). A
 * translucent bronze tint read fine on the ivory grid but vanished where this
 * same chip sits over the hero photo. An opaque chip is legible on any
 * background, and a placeholder marker that can't be seen is worthless.
 */
function Value({ value }: { value: string }) {
  if (!isTBD(value)) return <>{value}</>;
  return (
    <span className="inline-flex items-center rounded-full bg-gold px-2.5 py-0.5 align-middle text-xs font-medium tracking-luxe uppercase text-espresso">
      {TBD}
    </span>
  );
}

/** An amenity list. Only rendered for a list that actually has entries. */
function AmenityCard({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-cream/50 p-7">
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-cocoa marker:text-bronze">
        {items.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </div>
  );
}

export default function VacationRentalsPage() {
  const hero = RENTAL.photos[0];
  const rest = RENTAL.photos.slice(1);
  const amenityCards = [
    { title: "In the unit", items: RENTAL.amenities },
    { title: "On the grounds", items: RENTAL.resortAmenities },
  ].filter((c) => c.items.length > 0);

  return (
    <>
      <Nav solid />
      <main id="main-content" className="pt-20">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative h-[66vh] min-h-[460px] overflow-hidden">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Stronger than the /our-island scrim on purpose: that hero is a dark
              aerial, this one is bright sand + sky, so the same gradient left the
              headline sitting on near-white pixels. */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/55 to-espresso/10"
            aria-hidden
          />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-12 sm:px-8 sm:pb-16">
            <Reveal>
              <Eyebrow tone="light">Vacation stay</Eyebrow>
              <h1 className="mt-5 font-display text-display-sm text-ivory">
                {RENTAL.headline}
              </h1>
              <p className="measure mt-5 text-lg text-ivory/80">{RENTAL.intro}</p>
              <p className="mt-4 text-sm tracking-wide-2 uppercase text-ivory/60">
                {RENTAL.complex} · Unit <Value value={RENTAL.unit} /> · {RENTAL.floor} ·{" "}
                {RENTAL.address}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── The unit: facts & rates ──────────────────────────────────── */}
        <section className="bg-ivory py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow index="01">The unit</Eyebrow>
              <h2 className="mt-4 text-display-sm font-display text-ink">
                What you&apos;re booking
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              {/* Two confirmed facts today, so two columns. Adding bathrooms or
                  square feet back flips it to the 4-up layout, and mobile stays
                  2-up either way. */}
              <dl
                className={`mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 ${
                  RENTAL.facts.length > 2 ? "sm:grid-cols-4" : ""
                }`}
              >
                {RENTAL.facts.map((f) => (
                  <div key={f.label} className="bg-ivory px-5 py-7 text-center">
                    <dt className="text-xs tracking-luxe uppercase text-taupe">
                      {f.label}
                    </dt>
                    <dd className="nums mt-2 font-display text-3xl text-ink">
                      <Value value={f.value} />
                      {/* Note lives inside the <dd>: a <dl> row may only hold
                          dt/dd, so a sibling <p> here would be invalid. */}
                      {f.note && (
                        <span className="mt-2 block font-sans text-xs leading-snug text-taupe">
                          {f.note}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* No published price: the owner quotes each stay. Same-page anchor,
                so a plain <a> is correct here (next/link is for routes). */}
            <Reveal delay={0.15}>
              <div className="mt-6 flex flex-col gap-6 rounded-2xl bg-espresso px-7 py-8 text-ivory sm:flex-row sm:items-center sm:justify-between sm:px-9">
                <div>
                  <h3 className="font-display text-2xl text-ivory">
                    {RENTAL.rates.headline}
                  </h3>
                  <p className="measure mt-2 text-ivory/70">{RENTAL.rates.body}</p>
                </div>
                <a
                  href="#inquire"
                  className="shrink-0 self-start rounded-full bg-gold px-7 py-3.5 text-center text-xs tracking-luxe uppercase text-espresso transition-colors duration-300 hover:bg-ivory sm:self-auto"
                >
                  {RENTAL.rates.cta}
                </a>
              </div>
            </Reveal>

            {/* Only lists the owner has actually confirmed get a card, so an
                unfilled one is absent rather than promising a list that
                isn't there. */}
            {amenityCards.length > 0 && (
              <Reveal delay={0.2}>
                <div
                  className={`mt-6 grid gap-6 ${amenityCards.length > 1 ? "sm:grid-cols-2" : ""}`}
                >
                  {amenityCards.map((c) => (
                    <AmenityCard key={c.title} title={c.title} items={c.items} />
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* ── The setting ──────────────────────────────────────────────── */}
        <section className="bg-cream py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow index="02">The setting</Eyebrow>
              <h2 className="mt-4 text-display-sm font-display text-ink">
                Kepuhi Beach &amp; the west end
              </h2>
              <p className="measure mt-5 text-lg text-cocoa">
                Molokaʻi&apos;s west end is open country: ranch land, red earth and a
                shoreline that stays empty most days. These are the grounds and the
                beach the unit sits above.
              </p>
            </Reveal>
            {/* ponytail: a plain grid, not the ListingGallery slideshow, because
                these are six scene-setting exteriors that each deserve their own
                alt text, and a grid needs no client JS. Switch to ListingGallery
                once there are interior photos of the actual unit to page. */}
            <Reveal delay={0.1}>
              <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <li key={p.src} className="overflow-hidden rounded-2xl bg-ink/5">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      width={1280}
                      height={853}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="graded h-full w-full object-cover"
                      style={{ aspectRatio: "3 / 2", height: "auto" }}
                    />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ── Inquiry ──────────────────────────────────────────────────── */}
        <section id="inquire" className="scroll-mt-24 bg-espresso py-24 text-ivory sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Eyebrow index="03" tone="light">
                Check availability
              </Eyebrow>
              <h2 className="mt-4 text-display-sm font-display text-ivory">
                Tell us your dates
              </h2>
              <p className="measure mt-6 text-lg text-ivory/70">
                We rent this one ourselves, so you&apos;re talking to the owner, not a
                booking desk. Send your dates and we&apos;ll come straight back to you
                on availability.
              </p>
            </Reveal>
            <Reveal className="lg:col-span-7" delay={0.1}>
              <RentalInquiry />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
