import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ListingGallery from "@/components/ListingGallery";
import ListingDetails from "@/components/ListingDetails";
import { getListings, getListingBySlug, getListingDetail, formatPrice, formatBaths, typeLabel } from "@/lib/listings";
import { SITE } from "@/lib/site";

export async function generateStaticParams() {
  return (await getListings()).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = await getListingBySlug(slug);
  if (!l) return { title: "Listing" };
  const desc = getListingDetail(l.id)?.description || l.remarks || l.imageAlt;
  return {
    title: `${l.title} | ${formatPrice(l.price)}`,
    description: desc.slice(0, 160),
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
      availability: "https://schema.org/InStock",
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
      <main className="pt-20">
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
