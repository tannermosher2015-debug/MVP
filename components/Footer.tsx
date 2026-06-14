import { Phone, Mail, MapPin } from "lucide-react";
import { SITE } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-espresso-deep text-ivory/70">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex flex-col leading-none">
              <span className="font-display text-2xl tracking-wide-2 text-ivory">
                MOLOKAI
              </span>
              <span className="mt-1 text-[10px] tracking-luxe text-ivory/50">
                VACATION&nbsp;PROPERTIES
              </span>
            </div>
            <p className="measure mt-5 text-sm leading-relaxed text-ivory/55">
              {SITE.legalName} — island-based, family-run real estate sales and
              property management on Molokaʻi, Hawaiʻi.
            </p>
          </div>

          {/* Explore */}
          <nav className="md:col-span-3" aria-label="Footer">
            <h3 className="text-xs tracking-luxe uppercase text-ivory/50">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SITE.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-ivory/70 transition-colors hover:text-gold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="text-xs tracking-luxe uppercase text-ivory/50">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={SITE.phoneHref} className="flex items-center gap-3 transition-colors hover:text-gold">
                  <Phone className="h-4 w-4 text-bronze" aria-hidden />
                  <span className="nums">{SITE.phone}</span>
                </a>
              </li>
              <li>
                <a href={SITE.emailHref} className="flex items-center gap-3 transition-colors hover:text-gold">
                  <Mail className="h-4 w-4 text-bronze" aria-hidden />
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze" aria-hidden />
                <span>
                  {SITE.address.line1}, {SITE.address.city},{" "}
                  {SITE.address.region} {SITE.address.postal}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="rule-bronze mt-12 opacity-40" />

        <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs text-ivory/45 sm:flex-row sm:items-center">
          <p>
            © {year} {SITE.legalName}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Brokerage Lic. {SITE.license}</span>
            <span>Broker Lic. {SITE.broker.license}</span>
            <span>Equal Housing Opportunity</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
