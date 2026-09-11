import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Real Estate on Molokai handles the information you send through its forms, the Google Analytics cookies it uses, and the choices you have.",
  alternates: { canonical: "/privacy" },
};

// Every service named below was checked against the code on 2026-09-10:
// Google Analytics (app/layout.tsx, public/ga-init.js, the generate_lead event in
// components/Contact.tsx), Web3Forms (components/Contact.tsx, RentalInquiry.tsx),
// the Google Maps embed (components/GoogleMapEmbed.tsx, home page only) and the
// server-side Places lookup (lib/places.ts, /community). Add a section here if the
// site ever loads another service.

const h2 = "font-display text-2xl leading-snug text-ink sm:text-3xl";
const p = "text-lg leading-relaxed text-cocoa";
const link = "text-bronze-deep underline underline-offset-4 transition-colors hover:text-bronze";

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-lg leading-relaxed text-cocoa">
          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  const host = SITE.url.replace(/^https?:\/\//, "");
  return (
    <>
      <Nav solid />
      <main id="main-content" className="pt-20">
        <section className="bg-espresso py-20 text-ivory sm:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <Eyebrow tone="light">Your privacy</Eyebrow>
            <h1 className="mt-5 text-display-sm font-display text-ivory">Privacy Policy</h1>
            <p className="nums mt-5 text-xs tracking-wide-2 uppercase text-ivory/70">
              Last updated <time dateTime="2026-09-10">September 10, 2026</time>
            </p>
          </div>
        </section>

        <section className="bg-ivory py-16 sm:py-24">
          <div className="mx-auto max-w-3xl space-y-7 px-5 sm:px-8">
            <p className="text-xl leading-relaxed text-ink">
              {SITE.name} ({host}) is operated by {SITE.legalName}, with {SITE.broker.name},{" "}
              {SITE.broker.title}. This page explains what the site collects when you visit,
              how it is used, and the choices you have.
            </p>
            <div className="rule-bronze my-10" />

            <h2 className={h2}>Information you give us</h2>
            <p className={p}>
              When you send a message through one of the site&apos;s two forms, we receive
              what you enter:
            </p>
            <List
              items={[
                "The inquiry form: your name, email address, phone number, what you are interested in, and your message.",
                "The vacation rental inquiry form: your name, email address, phone number, check-in and check-out dates, number of guests, and your message.",
              ]}
            />
            <p className={p}>
              Both forms are delivered to us by email through Web3Forms, a form delivery
              service. We use what you send only to reply to you.
            </p>

            <h2 className={`pt-4 ${h2}`}>Information collected automatically</h2>
            <p className={p}>
              The site uses Google Analytics to understand how it is used. Google Analytics
              sets cookies in your browser (named <code>_ga</code> and{" "}
              <code>_ga_1HKYPQTCQX</code>) and collects:
            </p>
            <List
              items={[
                "The pages you view and how far you scroll",
                "Your approximate location, worked out from your IP address",
                "Your device, operating system and browser",
                "The website that sent you here",
                "Clicks on links that lead to other websites",
                "When you start filling in a form, and when the inquiry form is sent",
              ]}
            />
            <p className={p}>
              Google Analytics does not receive your name, email address, phone number or
              message. The only form detail it records is the topic you pick on the inquiry
              form. Google Analytics data tied to these cookies is kept for 14 months.
            </p>
            <p className={p}>
              Like any website, the site&apos;s host, Vercel, receives your IP address and
              browser details when it delivers a page to you.
            </p>

            <h2 className={`pt-4 ${h2}`}>Google services</h2>
            <List
              items={[
                <>
                  <strong className="font-semibold text-ink">Google Analytics</strong>, as
                  described above.
                </>,
                <>
                  <strong className="font-semibold text-ink">Google Maps.</strong> The home
                  page shows an embedded Google Map of our office. The map loads from Google,
                  so Google receives your IP address and browser details and may set its own
                  cookies.
                </>,
                <>
                  <strong className="font-semibold text-ink">Google Places.</strong> The Local
                  Businesses page shows Google ratings, addresses and contact details for
                  Molokaʻi businesses. Our server requests that information from Google. The
                  request contains nothing about you, and your browser does not contact Google
                  for it.
                </>,
              ]}
            />
            <aside className="rounded-2xl border border-ink/10 bg-cream/60 p-7">
              <p className="text-lg leading-relaxed text-ink">
                To learn how Google collects and processes this data, read{" "}
                <a
                  href="https://www.google.com/policies/privacy/partners/"
                  className={`font-semibold ${link}`}
                >
                  How Google uses information from sites or apps that use our services
                </a>{" "}
                and{" "}
                <a href="https://policies.google.com/privacy" className={link}>
                  Google&apos;s Privacy Policy
                </a>
                .
              </p>
            </aside>

            <h2 className={`pt-4 ${h2}`}>Your choices</h2>
            <List
              items={[
                "You can block or delete cookies in your browser's settings. The site still works without them.",
                <>
                  You can stop Google Analytics from collecting data about your visits by
                  installing the{" "}
                  <a href="https://tools.google.com/dlpage/gaoptout" className={link}>
                    Google Analytics Opt-out Browser Add-on
                  </a>
                  .
                </>,
                "The forms are optional. You can always call or email us instead.",
              ]}
            />

            <h2 className={`pt-4 ${h2}`}>Sharing</h2>
            <p className={p}>
              We do not sell your personal information. We share it only with the services
              named on this page, as needed to run the site, or when the law requires it.
            </p>
            <p className={p}>
              The site links to other websites, such as the Realtors Association of Maui MLS
              search, Zillow and Facebook. Those sites have their own privacy policies.
            </p>

            <h2 className={`pt-4 ${h2}`}>Contact us</h2>
            <p className={p}>
              Questions about this policy or your information? Call{" "}
              <a href={SITE.phoneHref} className={`nums ${link}`}>
                {SITE.phone}
              </a>{" "}
              or email{" "}
              <a href={SITE.emailHref} className={link}>
                {SITE.email}
              </a>
              . If this policy changes, the date at the top of this page will change with it.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
