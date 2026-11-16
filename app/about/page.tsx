import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import MobileBar from "@/components/MobileBar";
import Eyebrow from "@/components/Eyebrow";
import About from "@/components/About";
import { Reveal } from "@/components/motion";
import { SITE } from "@/lib/site";
import { pageOpenGraph } from "@/lib/og";

// A real About URL for the blog byline to point at: Google's helpful-content
// questions ask whether bylines link to an author page or the site's About page.
// Every fact here comes from lib/site.ts, nothing new is claimed.
const title = "About Molokai Vacation Properties";
const description =
  "Meet the brokers behind Real Estate on Molokai: Molokai Vacation Properties, Inc., with an office on Kamehameha V Highway in Kaunakakai.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: pageOpenGraph("/about", title, description),
};

export default function AboutPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      url: `${SITE.url}/about`,
      name: title,
      mainEntity: { "@id": `${SITE.url}/#realestateagent` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "About", item: `${SITE.url}/about` },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <main id="main-content">
        <section className="bg-espresso pt-36 pb-20 text-ivory sm:pt-44 sm:pb-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow index="01" tone="light">About</Eyebrow>
              <h1 className="mt-5 text-display font-display text-ivory">{title}</h1>
              <p className="measure mt-6 text-lg text-ivory/75">
                {SITE.legalName} is the brokerage behind {SITE.name}. The office is at{" "}
                {SITE.address.line1}, {SITE.address.city}, {SITE.address.landmark.charAt(0).toLowerCase() + SITE.address.landmark.slice(1)}.
              </p>
              <p className="nums mt-4 text-sm tracking-wide-2 uppercase text-ivory/70">
                Brokerage license {SITE.license}
                <span aria-hidden> · </span>
                <a href={SITE.phoneHref} className="underline underline-offset-4 hover:text-ivory">
                  {SITE.phone}
                </a>
              </p>
            </Reveal>
          </div>
        </section>
        <About />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
