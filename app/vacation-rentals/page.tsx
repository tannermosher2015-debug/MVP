import type { Metadata } from "next";
import Image from "next/image";
import { AlertTriangle } from "lucide-react";
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
  // PLACEHOLDER GATE: this page still renders TBD chips for the unit's beds,
  // baths, rate and minimum stay. Keep it out of the index until lib/rental.ts
  // has real values. See PUBLISH_CHECKLIST in lib/rental.ts.
  robots: { index: false, follow: false },
};

/**
 * Renders a fact, or a visibly flagged chip when the owner hasn't supplied it.
 *
 * The chip is deliberately OPAQUE (solid gold, espresso text ≈ 9:1). A
 * translucent bronze tint read fine on the ivory grid but vanished where this
 * same chip sits over the hero photo — an opaque chip is legible on any
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

export default function VacationRentalsPage() {
  const hero = RENTAL.photos[0];
  const rest = RENTAL.photos.slice(1);

  return (
    <>
      <Nav solid />
      <main id="main-content" className="pt-20">
        {/* ── Draft banner ───────────────────────────────────────────────
            Delete this whole <aside> as part of PUBLISH_CHECKLIST step 3.
            It exists so nobody mistakes the TBD chips for finished copy. */}
        <aside className="bg-ink text-ivory">
          <div className="mx-auto flex max-w-7xl items-start gap-3 px-5 py-3 sm:px-8">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
            <p className="text-sm text-ivory/85">
              <span className="font-medium text-ivory">Draft — not published.</span>{" "}
              Beds, baths, sleeps, square feet, rate, minimum stay and cleaning fee
              are still placeholders, and there are no interior photos yet. This page
              is set to{" "}
              <code className="nums text-gold">noindex</code>, but it IS now linked
              from the main menu — so once this repo is pushed, anyone on the site can
              reach it. Fill in the real values before deploying.
            </p>
          </div>
        </aside>

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
              <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-4">
                {RENTAL.facts.map((f) => (
                  <div key={f.label} className="bg-ivory px-5 py-7 text-center">
                    <dt className="text-xs tracking-luxe uppercase text-taupe">
                      {f.label}
                    </dt>
                    <dd className="nums mt-2 font-display text-3xl text-ink">
                      <Value value={f.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.15}>
              <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-3">
                {RENTAL.rates.map((r) => (
                  <div key={r.label} className="bg-cream px-5 py-7 text-center">
                    <dt className="text-xs tracking-luxe uppercase text-taupe">
                      {r.label}
                    </dt>
                    <dd className="nums mt-2 font-display text-2xl text-ink">
                      <Value value={r.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Amenities — intentionally empty until the owner confirms them.
                Rendering the gap honestly beats inventing a plausible list. */}
            <Reveal delay={0.2}>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-dashed border-bronze/40 bg-cream/50 p-7">
                  <h3 className="font-display text-xl text-ink">In the unit</h3>
                  {RENTAL.amenities.length > 0 ? (
                    <ul className="mt-4 space-y-2 text-cocoa">
                      {RENTAL.amenities.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="measure mt-3 text-sm text-taupe">
                      Amenity list to come from the owner — kitchen, lanai, laundry,
                      A/C, Wi-Fi and what&apos;s stocked for guests.
                    </p>
                  )}
                </div>
                <div className="rounded-2xl border border-dashed border-bronze/40 bg-cream/50 p-7">
                  <h3 className="font-display text-xl text-ink">On the grounds</h3>
                  {RENTAL.resortAmenities.length > 0 ? (
                    <ul className="mt-4 space-y-2 text-cocoa">
                      {RENTAL.resortAmenities.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="measure mt-3 text-sm text-taupe">
                      The pool and barbecue below are on the resort grounds — needs
                      confirming which of them guests of this unit may actually use
                      before either is listed as an amenity.
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
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
                Molokaʻi&apos;s west end is open country — ranch land, red earth and a
                shoreline that stays empty most days. These are the grounds and the
                beach the unit sits above.
              </p>
            </Reveal>
            {/* ponytail: a plain grid, not the ListingGallery slideshow — these
                are six scene-setting exteriors that each deserve their own alt
                text, and a grid needs no client JS. Switch to ListingGallery
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
