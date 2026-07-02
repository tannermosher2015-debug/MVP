import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import FeaturedProperty from "@/components/FeaturedProperty";
import Services from "@/components/Services";
import LifestyleBand from "@/components/LifestyleBand";
import Communities from "@/components/Communities";
import About from "@/components/About";
import Reviews from "@/components/Reviews";
import RecentlySold from "@/components/RecentlySold";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import type { Metadata } from "next";
import { getFeaturedListing } from "@/lib/listings";
import { SITE } from "@/lib/site";
import { REVIEW_SUMMARY } from "@/lib/reviews";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const featured = await getFeaturedListing();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${SITE.url}/#realestateagent`,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    image: `${SITE.url}/images/hero-molokai.jpg`,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "$$$",
    areaServed: "Molokaʻi, Hawaiʻi",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.line1,
      addressLocality: SITE.address.city,
      addressRegion: "HI",
      postalCode: SITE.address.postal,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    employee: {
      "@type": "Person",
      name: SITE.broker.name,
      jobTitle: SITE.broker.title,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: REVIEW_SUMMARY.rating,
      reviewCount: REVIEW_SUMMARY.count,
      bestRating: 5,
    },
    sameAs: [SITE.social.facebook, SITE.ramAgentUrl],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <main id="main-content">
        <Hero />
        <Intro />
        <FeaturedProperty listing={featured} />
        <Services />
        <LifestyleBand />
        <Communities />
        <About />
        <Reviews />
        <RecentlySold />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
