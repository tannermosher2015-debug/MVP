import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/**
 * Next's built-in 404 is an unstyled system page with no nav and no footer, so a
 * mistyped or dead URL anywhere outside /listings/ dropped the visitor off the
 * site entirely - and took the brokerage disclosure in the footer with it.
 * /listings/[slug] keeps its own not-found because a withdrawn listing needs
 * wording this generic page cannot give it.
 */
export default function NotFound() {
  return (
    <>
      <Nav solid />
      <main id="main-content" className="pt-20">
        <section className="bg-ivory py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="text-sm tracking-wide-2 uppercase text-bronze-deep">Page not found</p>
            <h1 className="mt-4 font-display text-display-sm text-ink">This page is not here</h1>
            <p className="measure mt-5 text-lg leading-relaxed text-cocoa">
              The link may be out of date, or the address mistyped. Everything on Molokaʻi we have for
              sale, and everything we manage, is a click away below.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/listings" className="rounded-full bg-ink px-8 py-4 text-xs tracking-luxe uppercase text-ivory transition-colors duration-300 hover:bg-bronze">
                Browse current listings
              </Link>
              <Link href="/" className="rounded-full border border-ink/30 px-8 py-4 text-xs tracking-luxe uppercase text-ink transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory">
                Back to the home page
              </Link>
              <Link href="/#contact" className="rounded-full border border-ink/30 px-8 py-4 text-xs tracking-luxe uppercase text-ink transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory">
                Ask us what you are looking for
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
