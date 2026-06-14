import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Star, MapPin, Phone, Globe } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getPlaceInfo, placesEnabled, type PlaceInfo } from "@/lib/places";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Local Businesses",
  description:
    "The Molokaʻi hotels, restaurants, stores and activities we love — with Google ratings, addresses and contact info.",
  alternates: { canonical: "/community" },
};

type Biz = { name: string; place: string; note: string };

const categories: { name: string; items: Biz[] }[] = [
  {
    name: "Hotels & Stays",
    items: [
      { name: "Hotel Molokaʻi", place: "Kaunakakai", note: "The island's only hotel — oceanfront bungalows and Hula Shores restaurant." },
      { name: "Molokai Shores", place: "Kaunakakai", note: "Oceanfront condominium resort steps from town." },
      { name: "Wavecrest Resort", place: "East End", note: "Oceanfront garden condominiums on the lush east end." },
      { name: "Ke Nani Kai", place: "Maunaloa", note: "West-end resort condominiums near Kepuhi Beach." },
      { name: "Paniolo Hale", place: "Maunaloa", note: "Beautiful townhomes nestled in the trees on the west end." },
    ],
  },
  {
    name: "Restaurants",
    items: [
      { name: "Kanemitsu Bakery & Restaurant", place: "Kaunakakai", note: "Famous hot bread and local plates — a Molokaʻi institution." },
      { name: "Paddlers Restaurant & Bar", place: "Kaunakakai", note: "Live music and the island's favorite place to gather." },
      { name: "Molokaʻi Burger", place: "Kaunakakai", note: "Island-style burgers and plate lunches in the heart of town." },
      { name: "Maka's Kōrner", place: "Kaunakakai", note: "A local breakfast-and-lunch favorite right in town." },
      { name: "Molokaʻi Pizza Cafe", place: "Kaunakakai", note: "Family pizza and a longtime town favorite." },
      { name: "Friends and Coffee", place: "Kualapuʻu", note: "A friendly upcountry stop for local Molokaʻi coffee and espresso." },
      { name: "Kamoi Snack-N-Go", place: "Kaunakakai", note: "Shave ice, ice cream and snacks in town." },
    ],
  },
  {
    name: "Local Stores",
    items: [
      { name: "Friendly Market Center", place: "Kaunakakai", note: "The island's main grocery — a true Friendly Isle institution." },
      { name: "Misaki's Grocery & Dry Goods", place: "Kaunakakai", note: "A family-run general store and Kaunakakai mainstay for generations." },
      { name: "Molokaʻi Wines & Spirits", place: "Kaunakakai", note: "Local bottle shop and gourmet deli in town." },
      { name: "Molokaʻi Art from the Heart", place: "Kaunakakai", note: "A gallery of work by the island's own artists and makers." },
      { name: "Imports Gift Shop", place: "Kaunakakai", note: "Aloha wear, island gifts and souvenirs." },
      { name: "Take's Variety Store", place: "Kaunakakai", note: "Hardware, household and a little bit of everything." },
      { name: "Molokaʻi Drugs", place: "Kaunakakai", note: "The island's family pharmacy and sundries." },
    ],
  },
  {
    name: "Entertainment",
    items: [
      { name: "Molokaʻi Fish & Dive", place: "Kaunakakai", note: "Snorkel, scuba, sport fishing and whale watching — 40+ little-known dive sites." },
      { name: "Hālawa Valley Falls Cultural Hike", place: "East End", note: "A guided cultural hike to 250-ft Moʻoula Falls with the Solatorio family." },
      { name: "Purdy's Macadamia Nut Farm", place: "Hoʻolehua", note: "A warm, hands-on (and free) family macadamia farm tour." },
    ],
  },
];

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.48h-1.26c-1.24 0-1.63.78-1.63 1.57v1.87h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

function BizCard({ biz, info }: { biz: Biz; info: PlaceInfo | null }) {
  const hasInfo =
    info && (info.rating != null || info.address || info.phone || info.website);
  return (
    <div className="flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-7 shadow-[0_1px_0_rgba(33,24,20,0.05)] transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgba(33,24,20,0.3)]">
      <p className="text-[11px] tracking-wide-2 uppercase text-bronze-deep">{biz.place}</p>
      <h3 className="mt-2 font-display text-xl text-ink">{biz.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-cocoa">{biz.note}</p>
      {hasInfo && (
        <div className="mt-5 space-y-2 border-t border-ink/8 pt-4 text-sm">
          {info!.rating != null && (
            <a
              href={info!.mapsUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-ink transition-colors hover:text-bronze-deep"
            >
              <Star className="h-4 w-4 fill-gold text-gold" aria-hidden />
              <span className="nums font-medium">{info!.rating.toFixed(1)}</span>
              {info!.reviews != null && (
                <span className="text-taupe">· {info!.reviews.toLocaleString()} Google reviews</span>
              )}
            </a>
          )}
          {info!.address && (
            <p className="flex items-start gap-2 text-taupe">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze" aria-hidden />
              <span>{info!.address}</span>
            </p>
          )}
          {info!.phone && (
            <a href={info!.phoneHref} className="flex items-center gap-2 text-taupe transition-colors hover:text-ink">
              <Phone className="h-4 w-4 shrink-0 text-bronze" aria-hidden />
              <span className="nums">{info!.phone}</span>
            </a>
          )}
          {info!.website && (
            <a
              href={info!.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-taupe transition-colors hover:text-ink"
            >
              <Globe className="h-4 w-4 shrink-0 text-bronze" aria-hidden />
              <span>Visit website</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default async function CommunityPage() {
  const key = placesEnabled();
  // Enrich each business with live Google info (only when the key is configured).
  const enriched = await Promise.all(
    categories.map(async (cat) => ({
      name: cat.name,
      items: await Promise.all(
        cat.items.map(async (b) => ({
          biz: b,
          info: key ? await getPlaceInfo(`${b.name} Molokaʻi Hawaii`) : null,
        })),
      ),
    })),
  );

  return (
    <>
      <Nav />
      <main>
        {/* Hero banner */}
        <section className="relative flex min-h-[58vh] flex-col justify-end overflow-hidden">
          <Image
            src="/images/intro-aerial.jpg"
            alt="Aerial view of Kaunakakai and the south shore of Molokaʻi at sunset"
            fill
            priority
            sizes="100vw"
            className="graded object-cover object-center"
          />
          <div className="scrim-full absolute inset-0" aria-hidden />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-32 sm:px-8">
            <p className="text-xs tracking-luxe uppercase text-gold">Meet Molokaʻi</p>
            <h1 className="mt-4 text-display-sm font-display text-ivory">
              Local businesses we love
            </h1>
            <p className="measure mt-5 text-lg text-ivory/85">
              Buy a home on Molokaʻi and you join a community that still lives by
              aloha. Here are the island&apos;s hotels, kitchens, stores and
              adventures — support them, and you&apos;ll feel at home fast.
            </p>
          </div>
        </section>

        {/* Directory */}
        <section className="relative overflow-hidden bg-ivory py-24 sm:py-32">
          <Image
            src="/images/community-bg.jpg"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="pointer-events-none object-cover opacity-[0.12]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ivory via-transparent to-ivory" aria-hidden />
          <div className="relative mx-auto max-w-7xl space-y-16 px-5 sm:px-8">
            {enriched.map((cat, ci) => (
              <div key={cat.name}>
                <Reveal>
                  <Eyebrow index={String(ci + 1).padStart(2, "0")}>{cat.name}</Eyebrow>
                </Reveal>
                <Stagger className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.items.map(({ biz, info }) => (
                    <StaggerItem key={biz.name}>
                      <BizCard biz={biz} info={info} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            ))}
            <p className="text-sm text-taupe">
              A curated guide to Molokaʻi&apos;s local businesses. Know a spot we
              missed, or one that&apos;s changed?{" "}
              <a
                href="/#contact"
                className="text-bronze-deep underline underline-offset-2 transition-colors hover:text-bronze"
              >
                Let us know
              </a>
              .{key ? " Addresses, contact and ratings via Google." : ""}
            </p>
          </div>
        </section>

        {/* Follow local */}
        <section className="bg-espresso py-24 text-ivory sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow index="05" tone="light">Follow local</Eyebrow>
              <h2 className="mt-4 text-display-sm font-display text-ivory">
                Stay connected to the island
              </h2>
              <p className="measure mt-5 text-lg text-ivory/70">
                A few Molokaʻi pages worth following to keep the island close, even
                before you arrive.
              </p>
            </Reveal>
            <Stagger className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-3">
              {SITE.localFollows.map((f) => (
                <StaggerItem key={f.name}>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full rounded-2xl border border-ivory/10 bg-ivory/[0.03] p-7 transition-colors duration-500 hover:border-gold/40 hover:bg-ivory/[0.06]"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-espresso">
                      <FacebookIcon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-display text-xl text-ivory">{f.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ivory/65">{f.note}</p>
                    <span className="mt-4 inline-block text-[11px] tracking-luxe uppercase text-gold">
                      Follow on Facebook &rarr;
                    </span>
                  </a>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-cream py-20 text-center sm:py-28">
          <div className="mx-auto max-w-2xl px-5">
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              Ready to find your place in it?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/listings"
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-xs tracking-luxe uppercase text-ivory transition-colors duration-300 hover:bg-bronze"
              >
                View listings
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="/#contact"
                className="inline-flex items-center rounded-full border border-ink/30 px-8 py-4 text-xs tracking-luxe uppercase text-ink transition-all duration-300 hover:border-bronze hover:bg-bronze hover:text-ivory"
              >
                Talk with Dayna
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
