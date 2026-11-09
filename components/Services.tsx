"use client";

import { Home, Users, Palmtree, ArrowRight, type LucideIcon } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import Eyebrow from "@/components/Eyebrow";
import { SITE } from "@/lib/site";

const ICONS: Record<string, LucideIcon> = { Home, Users, Palmtree };

export default function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-24 bg-espresso py-24 text-ivory sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow index="03" tone="light">How we serve you</Eyebrow>
            <h2 className="mt-4 text-display-sm font-display text-ivory">
              From first showing to keys in hand
            </h2>
            <p className="measure mt-5 text-lg text-ivory/70">
              Buying, selling, and helping you settle into island life - with
              trusted referrals whenever you need them.
            </p>
          </div>
        </Reveal>

        {/* Sales is the business, so it leads full width with a path for each kind of
            visitor; the two referral services sit below it, each with its one next step. */}
        <Stagger className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-2">
          {SITE.services.map((service, i) => {
            const Icon = ICONS[service.icon] ?? Home;
            const lead = i === 0;
            return (
              <StaggerItem key={service.title} className={lead ? "md:col-span-2" : ""}>
                <article
                  className={`group h-full rounded-2xl border p-8 transition-colors duration-500 hover:border-gold/40 ${
                    lead
                      ? "border-gold/25 bg-ivory/[0.06] sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-12"
                      : "border-ivory/10 bg-ivory/[0.03] hover:bg-ivory/[0.06]"
                  }`}
                >
                  <div className={lead ? "lg:max-w-xl" : ""}>
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-espresso">
                      <Icon className="h-6 w-6" strokeWidth={1.4} aria-hidden />
                    </span>
                    <h3 className={`mt-6 font-display text-ivory ${lead ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
                      {service.title}
                    </h3>
                    <p className={`mt-3 leading-relaxed ${lead ? "text-lg text-ivory/75" : "text-base text-ivory/65"}`}>
                      {service.body}
                    </p>
                  </div>
                  <ul className={lead ? "mt-8 grid max-w-sm shrink-0 gap-3 lg:mt-0 lg:w-72" : "mt-6 flex"}>
                    {service.links.map((l, j) => (
                      <li key={l.href + l.label}>
                        <a
                          href={l.href}
                          className={`inline-flex w-full items-center justify-between gap-3 rounded-full px-6 py-3 sm:whitespace-nowrap text-xs tracking-wide-2 uppercase transition-colors duration-300 ${
                            lead && j === 0
                              ? "bg-gold text-espresso hover:bg-ivory"
                              : "border border-ivory/30 text-ivory hover:border-gold hover:text-gold"
                          }`}
                        >
                          {l.label}
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
