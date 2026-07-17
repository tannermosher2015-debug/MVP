"use client";

import { useEffect, useState } from "react";
import { Phone, ArrowRight } from "lucide-react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { SITE } from "@/lib/site";

/**
 * Mobile-only sticky action bar (Call / Inquire) — a real-estate conversion
 * pattern designed for phones, not a shrunk desktop element.
 * Appears after the hero and hides once the target section is in view.
 *
 * Defaults target the homepage's #contact. The rental page passes its own
 * #inquire section and a booking-flavoured label.
 */
export default function MobileBar({
  targetId = "contact",
  label = "Inquire",
}: {
  targetId?: string;
  label?: string;
}) {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > 520;
      const target = document.getElementById(targetId);
      const inTarget = target
        ? target.getBoundingClientRect().top < window.innerHeight * 0.85
        : false;
      setShow(pastHero && !inTarget);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [targetId]);

  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={reduce ? { opacity: 0 } : { y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="pb-safe fixed inset-x-0 bottom-0 z-[80] flex gap-3 border-t border-ink/10 bg-ivory/95 px-4 pt-3 shadow-[0_-8px_30px_rgba(33,24,20,0.10)] backdrop-blur-md lg:hidden"
        >
          <a
            href={SITE.phoneHref}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/25 py-3.5 text-xs tracking-luxe uppercase text-ink"
          >
            <Phone className="h-4 w-4 text-bronze" aria-hidden />
            Call
          </a>
          <a
            href={`#${targetId}`}
            className="group flex flex-[1.5] items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-xs tracking-luxe uppercase text-ivory"
          >
            {label}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </a>
        </m.div>
      )}
    </AnimatePresence>
  );
}
