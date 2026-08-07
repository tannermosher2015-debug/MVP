import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/**
 * Listings come and go with the MLS feed, so a sold or withdrawn property's URL
 * outlives the listing: old links, bookmarks and Google's index still point at it.
 * This keeps the real 404 status (Google's docs call that the right signal for
 * permanently removed content, and redirecting to /listings instead would read as
 * a soft 404) while giving the visitor somewhere to go.
 */
export default function ListingNotFound() {
  return (
    <>
      <Nav solid />
      <main id="main-content" className="pt-20">
        <section className="bg-ivory py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="text-sm tracking-wide-2 uppercase text-bronze-deep">No longer on the market</p>
            <h1 className="mt-4 font-display text-display-sm text-ink">This listing has been taken down</h1>
            <p className="measure mt-5 text-lg leading-relaxed text-cocoa">
              It has sold, gone into escrow or been withdrawn since you last saw it. Molokaʻi is a small
              market and good properties move quickly, so it is worth seeing what is available today.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/listings" className="rounded-full bg-ink px-8 py-4 text-xs tracking-luxe uppercase text-ivory transition-colors duration-300 hover:bg-bronze">
                Browse current listings
              </Link>
              <Link href="/sold" className="rounded-full border border-ink/30 px-8 py-4 text-xs tracking-luxe uppercase text-ink transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory">
                See what we have sold
              </Link>
              <Link href="/#contact" className="rounded-full border border-ink/30 px-8 py-4 text-xs tracking-luxe uppercase text-ink transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory">
                Tell us what you are looking for
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
