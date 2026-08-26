import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import { Reveal } from "@/components/motion";
import { SITE } from "@/lib/site";
import { MANAGEMENT } from "@/lib/management";
import { TBD, isTBD } from "@/lib/rental";

export const metadata: Metadata = {
  title: "Vacation Property Management",
  description:
    "Vacation rental management on Molokaʻi for a small number of owners, from Molokai Vacation Properties and broker Dayna E. Harris.",
  alternates: { canonical: "/property-management" },
};

/**
 * Renders a fact, or a visibly flagged chip when Dayna has not supplied it.
 * Same opaque-gold chip as the rental page, for the same reason: a placeholder
 * marker that cannot be seen on every background is worthless.
 */
function Value({ value }: { value: string }) {
  if (!isTBD(value)) return <>{value}</>;
  return (
    <span className="inline-flex items-center rounded-full bg-gold px-2.5 py-0.5 align-middle text-xs font-medium tracking-luxe uppercase text-espresso">
      {TBD}
    </span>
  );
}

export default function PropertyManagementPage() {
  const url = `${SITE.url}/property-management`;

  // Service, not Product: nothing here has a price yet, and inventing one to
  // satisfy a schema shape is exactly the failure this repo guards against.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Vacation property management on Molokaʻi",
    description: MANAGEMENT.intro,
    serviceType: "Vacation rental property management",
    areaServed: { "@type": "Place", name: "Molokaʻi, Hawaiʻi" },
    provider: {
      "@type": "RealEstateAgent",
      "@id": `${SITE.url}/#realestateagent`,
      name: SITE.legalName,
    },
    url,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Property Management", item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([jsonLd, breadcrumbLd]).replace(/</g, "\\u003c"),
        }}
      />
      <Nav solid />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section className="relative h-[52vh] min-h-[380px] overflow-hidden">
          {/* molokai-shores.jpg was the first choice as the most on-topic photo
              (a condo complex), but it is bright lawn and sky right where the
              text sits: measured 1.38:1 for the eyebrow against the 4.5 AA
              needs, and 2.82:1 for the h1 against 3.0. Passing on that image
              would have taken a ~64% flat scrim, which destroys the photo.
              This one measured darkest of ten candidates in the text band
              (mean luminance 0.134 vs 0.275) and is already the /sold hero. */}
          <Image
            src="/images/molokai-bay.jpg"
            alt="Calm south-shore water and reef off Kaunakakai on Molokaʻi"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Scrim is stronger at the TOP than any sibling page, on purpose.
              This h1 wraps to two lines where /sold and the landing pages use
              one, so the text block reaches ~60px higher into the bright
              horizon band. Measured: with the /vacation-rentals scrim
              (95/55/10) the eyebrow was 2.60:1 and h1 line 1 was 2.74:1, while
              h1 line 2 (6.34) and the intro (6.89) passed comfortably. Only
              the top of the block was failing, so the top stops were raised.
              Re-measure if this h1 ever changes length. */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/85 to-espresso/65"
            aria-hidden
          />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-12 sm:px-8 sm:pb-16">
            <Reveal>
              <Eyebrow tone="photo">For owners</Eyebrow>
              <h1 className="mt-5 font-display text-display-sm text-ivory">
                {MANAGEMENT.headline}
              </h1>
              <p className="measure mt-5 text-lg text-ivory/85">{MANAGEMENT.intro}</p>
            </Reveal>
          </div>
        </section>

        {/* Credentials */}
        <section className="bg-ivory py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow index="01">Why us</Eyebrow>
              <h2 className="mt-4 text-display-sm font-display text-ink">
                Islanders looking after island property
              </h2>
            </Reveal>
            <dl className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-3">
              {MANAGEMENT.credentials.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl border border-ink/10 bg-cream/50 p-7"
                >
                  <dt className="nums font-display text-4xl text-bronze-deep">{c.stat}</dt>
                  <dd className="mt-3 text-base leading-relaxed text-cocoa">{c.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* What is included */}
        <section className="bg-cream py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow index="02">The service</Eyebrow>
              <h2 className="mt-4 text-display-sm font-display text-ink">
                What we handle
              </h2>
            </Reveal>
            <ul className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2">
              {MANAGEMENT.included.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-ink/10 bg-ivory p-7"
                >
                  <h3 className="font-display text-xl text-ink">{item.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-cocoa">
                    <Value value={item.detail} />
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2">
              <p className="text-base text-cocoa">
                <span className="font-medium text-ink">Management fee:</span>{" "}
                <Value value={MANAGEMENT.fee} />
              </p>
              <p className="text-base text-cocoa">
                <span className="font-medium text-ink">Where we manage:</span>{" "}
                <Value value={MANAGEMENT.coverage} />
              </p>
            </div>
          </div>
        </section>

        {/* Long-term: the honest referral */}
        <section className="bg-espresso py-20 text-ivory sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow index="03" tone="light">Long-term rentals</Eyebrow>
              <h2 className="mt-4 text-display-sm font-display text-ivory">
                Not what we do, but we know who does
              </h2>
              <p className="measure mt-5 text-lg text-ivory/70">{MANAGEMENT.longTerm}</p>
            </Reveal>
          </div>
        </section>

        {/* CTA: reuses the homepage contact form, which already carries a
            "Vacation rental management" option in its interest dropdown. */}
        <section className="bg-ivory py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
            <Reveal>
              <h2 className="text-display-sm font-display text-ink">
                Talk to us about your property
              </h2>
              <p className="measure mx-auto mt-5 text-lg text-cocoa">
                Tell us where it is and what you are hoping for, and Dayna will come
                back to you personally.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
                <Link
                  href="/#contact"
                  className="group inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm tracking-wide-2 uppercase text-ink transition-colors hover:border-bronze hover:text-bronze-deep"
                >
                  Start a conversation
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </Link>
                <a
                  href={SITE.phoneHref}
                  className="text-sm tracking-wide-2 uppercase text-bronze-deep underline underline-offset-4"
                >
                  Or call {SITE.phone}
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
