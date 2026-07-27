"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import ListingCard from "@/components/ListingCard";
import {
  categoryFor,
  categoryFromSlug,
  categorySlug,
  type Listing,
} from "@/lib/listings";

const ALL = "All Listings";

const SORTS = {
  featured: { label: "Featured", spoken: "featured order" },
  "price-asc": { label: "Price: low to high", spoken: "price low to high" },
  "price-desc": { label: "Price: high to low", spoken: "price high to low" },
} as const;

type Sort = keyof typeof SORTS;

const DEFAULT_SORT: Sort = "featured";

const asSort = (v: string | null): Sort =>
  v && Object.prototype.hasOwnProperty.call(SORTS, v) ? (v as Sort) : DEFAULT_SORT;

/** Price 0 means "price on request" in the feed, so those sort last either way. */
const byPrice = (sort: Sort) => (a: Listing, b: Listing) =>
  sort === "price-asc"
    ? (a.price || Infinity) - (b.price || Infinity)
    : b.price - a.price;

/**
 * The interactive listings grid: category tabs (optional) + price sort, with
 * both kept in the URL as ?area=&sort= so a filtered view is shareable,
 * bookmarkable and undoable with the Back button.
 *
 * URL state is adopted in an effect rather than during the first render,
 * because the first client render has to match the prerendered HTML. The
 * tradeoff is one frame of default order when opening a shared link; the
 * alternative (reading searchParams server-side, or useSearchParams + Suspense)
 * would cost this page its static HTML and hand crawlers an empty shell.
 */
export default function ListingsBrowser({
  listings,
  categories,
  emptyState,
}: {
  listings: Listing[];
  categories?: readonly string[];
  emptyState?: ReactNode;
}) {
  const hasTabs = Boolean(categories?.length);
  const [category, setCategory] = useState<string>(ALL);
  const [sort, setSort] = useState<Sort>(DEFAULT_SORT);
  const [status, setStatus] = useState("");

  const countIn = useCallback(
    (c: string) =>
      c === ALL ? listings.length : listings.filter((l) => categoryFor(l) === c).length,
    [listings],
  );

  /**
   * The one place state, the URL and the screen-reader announcement change
   * together. `history` is "push" for a deliberate tab click, "replace" for the
   * sort select (a closed native select fires change on every arrow key, which
   * would otherwise spam the history stack), and "none" when we are reacting to
   * the URL rather than driving it.
   */
  const select = useCallback(
    (c: string, s: Sort, history: "push" | "replace" | "none", announce = true) => {
      setCategory(c);
      setSort(s);

      if (history !== "none") {
        const q = new URLSearchParams(window.location.search);
        if (c === ALL) q.delete("area");
        else q.set("area", categorySlug(c));
        if (s === DEFAULT_SORT) q.delete("sort");
        else q.set("sort", s);
        const qs = q.toString();
        const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
        if (history === "push") window.history.pushState(null, "", url);
        else window.history.replaceState(null, "", url);
      }

      if (announce) {
        const n = countIn(c);
        setStatus(
          `${n} ${n === 1 ? "listing" : "listings"}${c === ALL ? "" : `, ${c}`}, ${SORTS[s].spoken}.`,
        );
      }
    },
    [countIn],
  );

  // Adopt the URL on arrival, and follow it on Back/Forward.
  useEffect(() => {
    const fromUrl = (announce: boolean) => {
      const q = new URLSearchParams(window.location.search);
      const area = hasTabs ? categoryFromSlug(q.get("area")) : null;
      select(area ?? ALL, asSort(q.get("sort")), "none", announce);
    };
    fromUrl(false);
    const onPop = () => fromUrl(true);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [hasTabs, select]);

  const filtered =
    category === ALL ? listings : listings.filter((l) => categoryFor(l) === category);
  // Array.sort is stable, so equal prices keep their feed order.
  const shown = sort === DEFAULT_SORT ? filtered : [...filtered].sort(byPrice(sort));

  return (
    <>
      {listings.length > 0 && (
        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {hasTabs &&
              [ALL, ...categories!].map((c) => {
                const active = c === category;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => select(c, sort, "push")}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-xs tracking-wide-2 uppercase transition-colors duration-300 ${
                      active
                        ? "border-bronze bg-bronze text-ivory"
                        : "border-ink/15 text-taupe hover:border-bronze/50 hover:text-ink"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}

            <div className={`flex items-center gap-2 ${hasTabs ? "ml-auto" : ""}`}>
              <label
                htmlFor="listings-sort"
                className="text-xs tracking-wide-2 uppercase text-taupe"
              >
                Sort
              </label>
              <select
                id="listings-sort"
                value={sort}
                onChange={(e) => select(category, asSort(e.target.value), "replace")}
                className="rounded-full border border-ink/15 bg-transparent px-4 py-2 text-xs tracking-wide-2 uppercase text-ink transition-colors duration-300 hover:border-bronze/50 focus-visible:border-bronze"
              >
                {Object.entries(SORTS).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Reveal>
      )}

      {/* Filtering and sorting are silent to a screen reader without this. */}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {status}
      </p>

      {shown.length > 0 ? (
        <Stagger
          key={category + sort}
          className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
        >
          {shown.map((listing) => (
            <StaggerItem key={listing.id}>
              <ListingCard listing={listing} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        emptyState ?? (
          <div className="mt-12 rounded-2xl border border-ink/10 bg-cream/60 px-6 py-16 text-center">
            <p className="text-lg text-cocoa">
              No current listings in <span className="text-ink">{category}</span>.
            </p>
            <button
              type="button"
              onClick={() => select(ALL, sort, "push")}
              className="mt-4 text-sm tracking-wide-2 uppercase text-bronze-deep underline"
            >
              View all listings
            </button>
          </div>
        )
      )}
    </>
  );
}
