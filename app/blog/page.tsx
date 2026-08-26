import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import LandingLinks from "@/components/LandingLinks";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { POSTS, readMinutes, formatDate } from "@/lib/blog";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Molokaʻi Real Estate Blog",
  description:
    "Island guides and buyer explainers from the Molokaʻi brokerage that sells here: where to live, what to buy, and how the island's communities differ.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE.url}/blog` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Nav solid />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section className="relative h-[46vh] min-h-[340px] overflow-hidden">
          <Image
            src="/images/molokai-cliffs.jpg"
            alt="Steep green sea cliffs on Molokaʻi dropping straight into deep blue ocean, with a rock islet offshore"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="graded object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/80 via-60% to-transparent"
            aria-hidden
          />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-12 sm:px-8 sm:pb-16">
            <Reveal>
              <p className="text-xs tracking-luxe uppercase text-ivory">Guides &amp; island notes</p>
              <h1 className="mt-5 font-display text-display-sm text-ivory">Island Journal</h1>
              <p className="measure mt-5 text-lg text-ivory/85">
                What we find ourselves explaining to buyers again and again: where the towns
                are, how the communities differ, and what owning here actually asks of you.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Posts */}
        <section className="bg-ivory py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {POSTS.map((post) => (
                <StaggerItem key={post.slug}>
                  <article className="group h-full">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-colors hover:border-bronze focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-deep"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={post.hero}
                          alt={post.heroAlt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="graded object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <Eyebrow>{post.eyebrow}</Eyebrow>
                        <h2 className="mt-3 font-display text-xl leading-snug text-ink">
                          {post.h1}
                        </h2>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-taupe">
                          {post.excerpt}
                        </p>
                        <p className="nums mt-5 text-xs tracking-wide-2 uppercase text-taupe">
                          <time dateTime={post.published}>{formatDate(post.published)}</time>
                          <span aria-hidden> · </span>
                          {readMinutes(post)} min read
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm tracking-wide-2 uppercase text-bronze-deep">
                          Read
                          <ArrowUpRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden
                          />
                        </span>
                      </div>
                    </Link>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <LandingLinks heading="Browse Molokaʻi real estate" />
      </main>
      <Footer />
    </>
  );
}
