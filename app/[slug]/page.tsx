import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import ListingCard from "@/components/ListingCard";
import LandingLinks from "@/components/LandingLinks";
import { Reveal } from "@/components/motion";
import { getListings } from "@/lib/listings";
import { LANDING_PAGES, getLandingPage } from "@/lib/landing";
import { SITE } from "@/lib/site";

// Only the configured landing slugs render; any other top-level path 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return LANDING_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: `/${page.slug}` },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) notFound();

  const listings = (await getListings()).filter(page.match);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Listings", item: `${SITE.url}/listings` },
      { "@type": "ListItem", position: 3, name: page.h1, item: `${SITE.url}/${page.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Nav solid />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative h-[52vh] min-h-[380px] overflow-hidden">
          <Image
            src={page.hero}
            alt={page.heroAlt}
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
              <Eyebrow tone="light">{page.eyebrow}</Eyebrow>
              <h1 className="mt-5 font-display text-display-sm text-ivory">{page.h1}</h1>
              <p className="measure mt-5 text-lg text-ivory/85">{page.intro}</p>
            </Reveal>
          </div>
        </section>

        {/* Listings */}
        <section className="bg-ivory py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-display-sm font-display text-ink">
                {listings.length} {listings.length === 1 ? "property" : "properties"} for sale
              </h2>
              <Link
                href="/listings"
                className="group inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm tracking-wide-2 uppercase text-ink transition-colors hover:border-bronze hover:text-bronze-deep"
              >
                View all listings
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </Link>
            </div>

            {listings.length > 0 ? (
              <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-ink/10 bg-cream/60 px-6 py-16 text-center">
                <p className="text-lg text-cocoa">
                  No {page.eyebrow.toLowerCase()} are listed right now. New listings reach the
                  market often, so check back soon or reach out and we will watch for you.
                </p>
                <Link
                  href="/#contact"
                  className="mt-4 inline-block text-sm tracking-wide-2 uppercase text-bronze-deep underline"
                >
                  Contact Dayna
                </Link>
              </div>
            )}
          </div>
        </section>

        <LandingLinks exclude={page.slug} heading="Browse more Molokaʻi real estate" />
      </main>
      <Footer />
    </>
  );
}
