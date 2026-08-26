import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import PostBody from "@/components/PostBody";
import LandingLinks from "@/components/LandingLinks";
import { Reveal } from "@/components/motion";
import { POSTS, getPost, readMinutes, formatDate } from "@/lib/blog";
import { SITE } from "@/lib/site";

// Only the configured post slugs render; any other /blog/* path 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.h1,
      description: post.excerpt,
      url: `${SITE.url}/blog/${post.slug}`,
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = POSTS.filter((p) => p.slug !== post.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.h1,
      description: post.metaDescription,
      image: `${SITE.url}${post.hero}`,
      datePublished: post.published,
      dateModified: post.updated ?? post.published,
      mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
      // Organization, not a Person: these guides are written by the brokerage,
      // so attributing them to an individual broker would be a false byline.
      author: { "@type": "Organization", name: SITE.legalName },
      publisher: { "@type": "Organization", name: SITE.legalName },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE.url}/blog` },
        {
          "@type": "ListItem",
          position: 3,
          name: post.h1,
          item: `${SITE.url}/blog/${post.slug}`,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav solid />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section className="relative h-[52vh] min-h-[380px] overflow-hidden">
          <Image
            src={post.hero}
            alt={post.heroAlt}
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
              <p className="text-xs tracking-luxe uppercase text-ivory">{post.eyebrow}</p>
              <h1 className="measure mt-5 font-display text-display-sm text-ivory">
                {post.h1}
              </h1>
              <p className="nums mt-5 text-xs tracking-wide-2 uppercase text-ivory/70">
                <time dateTime={post.published}>{formatDate(post.published)}</time>
                <span aria-hidden> · </span>
                {readMinutes(post)} min read
              </p>
            </Reveal>
          </div>
        </section>

        {/* Article */}
        <section className="bg-ivory py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <p className="text-xl leading-relaxed text-ink">{post.excerpt}</p>
            <div className="rule-bronze my-10" />
            <article>
              <PostBody blocks={post.body} />
            </article>

            {/* Talk to us */}
            <aside className="mt-14 rounded-2xl border border-ink/10 bg-cream/60 p-7">
              <Eyebrow>Ask someone who lives here</Eyebrow>
              <p className="mt-4 text-lg leading-relaxed text-cocoa">
                {SITE.broker.name}, {SITE.broker.title}, has been on Molokaʻi since 1990.
                If this raised a question about a specific property or a specific end of
                the island, call the office and ask her directly.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href={SITE.phoneHref}
                  className="nums text-sm tracking-wide-2 uppercase text-bronze-deep underline underline-offset-4"
                >
                  {SITE.phone}
                </a>
                <Link
                  href="/#contact"
                  className="text-sm tracking-wide-2 uppercase text-bronze-deep underline underline-offset-4"
                >
                  Send a message
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* More posts */}
        {others.length > 0 && (
          <section className="bg-ivory pb-20 sm:pb-28">
            <div className="mx-auto max-w-3xl px-5 sm:px-8">
              <Eyebrow>More from the journal</Eyebrow>
              <ul className="mt-6 space-y-3">
                {others.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white px-5 py-4 text-ink transition-colors hover:border-bronze focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-deep"
                    >
                      <span className="font-display text-lg">{p.h1}</span>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-bronze transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <LandingLinks heading="Browse Molokaʻi real estate" />
      </main>
      <Footer />
    </>
  );
}
