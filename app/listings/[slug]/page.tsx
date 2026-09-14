import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ListingGallery from "@/components/ListingGallery";
import ListingDetails from "@/components/ListingDetails";
import { getAllListings, getListingBySlug, getListingDetail, formatPrice, formatBaths, typeLabel } from "@/lib/listings";
import { SITE } from "@/lib/site";

export async function generateStaticParams() {
  return (await getAllListings()).map((l) => ({ slug: l.slug }));
}

// Google truncates a title link around 62 visible characters. That is OUR working
// limit, measured, and never a documented Google rule. app/layout.tsx appends
// `%s | Real Estate on Molokai` to every page title, so the part this file supplies
// gets whatever is left after that suffix. Derived, not typed as a literal: the
// suffix is SITE.name and moves if the brand name ever does.
const TITLE_MAX = 62;
const TITLE_BUDGET = TITLE_MAX - ` | ${SITE.name}`.length;
const DESC_MAX = 160;

// Cut at the last word boundary at or before `max` so a snippet never ends
// mid-word. Falls back to a hard cut for a single token longer than the budget.
// `ellipsis` marks a cut that landed mid-sentence, because a description Google
// shows verbatim should not stop dead on an orphan word ("...sits on the"); the
// marker is inside the budget, not added to it.
function trimToWord(s: string, max: number, ellipsis = false): string {
  const t = s.trim();
  if (t.length <= max) return t;
  const room = ellipsis ? max - 1 : max;
  const cut = t.slice(0, room + 1);
  const sp = cut.lastIndexOf(" ");
  const out = (sp > 0 ? cut.slice(0, sp) : t.slice(0, room)).replace(/[\s,.;:-]+$/, "");
  return ellipsis ? `${out}…` : out;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = await getListingBySlug(slug);
  // No listing at this slug means it has left the feed; not-found.tsx renders, so
  // title the tab for what the visitor is actually looking at.
  if (!l) return { title: "Listing no longer available" };

  // Address first, because it is the one field guaranteed unique per listing (the
  // slug is built from it). The price is the nice-to-have and is dropped when the
  // pair would overflow, rather than letting Google cut the address in half. It is
  // still on the page, in the description below and in the Product JSON-LD offer.
  // Measured 2026-09-14: 1 of 25 titles ran over and 4 more sat at exactly 62, so a
  // hand-trim would not have survived the next MLS sync or a price change.
  const withPrice = `${l.title} | ${formatPrice(l.price)}`;
  const title = withPrice.length <= TITLE_BUDGET ? withPrice : trimToWord(l.title, TITLE_BUDGET);

  // The agent writes one opening sentence and reuses it across their own listings.
  // Measured 2026-09-14: four Kawela lots all start "Kawela is known for its
  // expansive ocean views with 2 acres of prime Ag land", so a plain slice of the
  // first 160 characters gave two of them byte-identical meta descriptions. Leading
  // with address, area, type and price makes every snippet unique on facts we
  // already hold, and the agent's own copy fills whatever room is left. Their text
  // is never edited, only appended to.
  const remarks = getListingDetail(l.id)?.description || l.remarks || l.imageAlt || "";
  const lead = `${l.address}, ${l.area}. ${typeLabel(l.type)} at ${formatPrice(l.price)}.`;
  const description = trimToWord(`${lead} ${remarks}`, DESC_MAX, true);

  return {
    title,
    description,
    alternates: { canonical: `/listings/${slug}` },
  };
}

export default async function ListingDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = await getListingBySlug(slug);
  if (!l) notFound();
  const photos = l.photos && l.photos.length > 0 ? l.photos : [l.image];
  const detail = getListingDetail(l.id);
  const mlsNumber = detail?.mlsNumber || l.mlsNumber;

  const desc = detail?.description || l.remarks || l.imageAlt || l.title;
  const url = `${SITE.url}/listings/${slug}`;
  const images = photos.map((p) => (p.startsWith("http") ? p : `${SITE.url}${p}`));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: l.title,
    description: desc.slice(0, 500),
    image: images,
    url,
    category: "Real estate",
    brand: { "@type": "Brand", name: SITE.legalName },
    ...(mlsNumber ? { sku: String(mlsNumber) } : {}),
    additionalProperty: [
      l.beds > 0 ? { "@type": "PropertyValue", name: "Bedrooms", value: l.beds } : null,
      l.baths > 0 ? { "@type": "PropertyValue", name: "Bathrooms", value: l.baths } : null,
      l.sqft > 0 ? { "@type": "PropertyValue", name: "Living area", unitText: "SqFt", value: l.sqft } : null,
    ].filter(Boolean),
    offers: {
      "@type": "Offer",
      price: l.price,
      priceCurrency: "USD",
      availability: l.status === "Pending" ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
      url,
      seller: { "@type": "RealEstateAgent", "@id": `${SITE.url}/#realestateagent`, name: SITE.legalName },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Listings", item: `${SITE.url}/listings` },
      { "@type": "ListItem", position: 3, name: l.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbLd]).replace(/</g, "\\u003c") }}
      />
      <Nav solid />
      <main id="main-content" className="pt-20">
        <section className="bg-ivory py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Link href="/listings" className="text-sm tracking-wide-2 uppercase text-bronze-deep transition-colors hover:text-bronze">
              &larr; All listings
            </Link>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-display-sm text-ink">{l.title}</h1>
                <p className="mt-1 text-taupe">{l.city}, {l.region} {l.postal}</p>
              </div>
              <p className="nums font-display text-3xl text-bronze-deep sm:text-4xl">{formatPrice(l.price)}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-y border-ink/10 py-4 text-sm text-cocoa">
              {l.beds > 0 && <span><span className="nums font-medium">{l.beds}</span> bd</span>}
              {l.baths > 0 && <span><span className="nums font-medium">{formatBaths(l.baths)}</span> ba</span>}
              {l.sqft > 0 && <span><span className="nums font-medium">{l.sqft.toLocaleString()}</span> sq ft</span>}
              <span className="text-bronze-deep">{typeLabel(l.type)}</span>
              {l.status === "Pending" && (
                <span className="rounded-full bg-bronze-deep px-3 py-0.5 text-[10px] tracking-luxe uppercase text-ivory">Pending</span>
              )}
              {mlsNumber && <span className="nums text-taupe">MLS #{mlsNumber}</span>}
            </div>

            <div className="mt-8">
              <ListingGallery photos={photos} alt={l.imageAlt} />
            </div>

            {detail ? (
              <ListingDetails detail={detail} />
            ) : (
              l.remarks && (
                <p className="measure mt-10 text-lg leading-relaxed text-cocoa">{l.remarks}</p>
              )
            )}

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/#contact" className="rounded-full bg-ink px-8 py-4 text-xs tracking-luxe uppercase text-ivory transition-colors duration-300 hover:bg-bronze">
                Ask about this listing
              </Link>
              {l.ramUrl && (
                <a href={l.ramUrl} target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-ink/30 px-8 py-4 text-xs tracking-luxe uppercase text-ink transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory">
                  View full listing on MLS
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
