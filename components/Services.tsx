"use client";

import { Home, Users, Palmtree, type LucideIcon } from "lucide-react";
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
              Buying, selling, and helping you settle into island life — with
              trusted referrals whenever you need them.
            </p>
          </div>
        </Reveal>

        <Stagger className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-3">
          {SITE.services.map((service) => {
            const Icon = ICONS[service.icon] ?? Home;
            return (
              <StaggerItem key={service.title}>
                <article className="group h-full rounded-2xl border border-ivory/10 bg-ivory/[0.03] p-8 transition-colors duration-500 hover:border-gold/40 hover:bg-ivory/[0.06]">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-espresso">
                    <Icon className="h-6 w-6" strokeWidth={1.4} aria-hidden />
                  </span>
                  <h3 className="mt-6 font-display text-2xl text-ivory">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-ivory/65">
                    {service.body}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
