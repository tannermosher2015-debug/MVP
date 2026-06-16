"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "motion/react";
import { Menu, X, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

function Wordmark({ tone }: { tone: "light" | "dark" }) {
  // Over the hero (dark) the white-on-dark logo reads; on the solid white nav
  // its white text would vanish, so fall back to the text wordmark there.
  if (tone === "light") {
    return (
      <a href="/" className="block" aria-label={`${SITE.name} — home`}>
        <Image
          src="/images/logo-mark.png"
          alt={SITE.name}
          width={600}
          height={122}
          priority
          className="h-9 w-auto sm:h-11"
        />
      </a>
    );
  }
  return (
    <a
      href="/"
      className="group flex flex-col leading-none"
      aria-label={`${SITE.name} — home`}
    >
      <span className="font-display text-xl tracking-wide-2 text-ink transition-colors sm:text-2xl">
        MOLOKAI
      </span>
      <span className="mt-1 text-[10px] tracking-luxe text-taupe transition-colors">
        VACATION&nbsp;PROPERTIES
      </span>
    </a>
  );
}

export default function Nav({ solid: forceSolid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open || forceSolid;
  const tone: "light" | "dark" = solid ? "dark" : "light";
  const linkColor = solid ? "text-ink/80 hover:text-ink" : "text-ivory/85 hover:text-ivory";

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] transition-all duration-500"
      style={{ ["--ease" as string]: "var(--ease-luxe)" }}
    >
      <div
        className={`transition-all duration-500 ${
          solid
            ? "border-b border-ink/10 bg-ivory/90 backdrop-blur-md shadow-[0_8px_30px_rgba(33,24,20,0.06)]"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Wordmark tone={tone} />

          {/* Desktop links */}
          <ul className="hidden items-center gap-2.5 lg:flex xl:gap-5">
            {SITE.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`group relative whitespace-nowrap text-[11px] tracking-wide-2 uppercase transition-colors xl:text-[13px] ${linkColor}`}
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-bronze transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={SITE.phoneHref}
              className={`hidden items-center gap-2 text-sm tracking-wide-2 transition-colors xl:flex ${linkColor}`}
            >
              <Phone className="h-4 w-4 text-bronze" aria-hidden />
              <span className="nums">{SITE.phone}</span>
            </a>
            <a
              href="#contact"
              className={`rounded-full border px-6 py-2.5 text-xs tracking-luxe uppercase transition-all duration-300 ${
                solid
                  ? "border-ink/30 text-ink hover:border-bronze hover:bg-bronze hover:text-ivory"
                  : "border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink"
              }`}
            >
              Inquire
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden ${
              solid ? "text-ink hover:bg-ink/5" : "text-ivory hover:bg-ivory/10"
            }`}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-20 z-[90] bg-espresso lg:hidden"
          >
            <m.ul
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
              }}
              className="flex flex-col gap-2 px-7 pt-10"
            >
              {SITE.nav.map((item) => (
                <m.li
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-ivory/10 py-4 font-display text-3xl text-ivory"
                  >
                    {item.label}
                  </a>
                </m.li>
              ))}
            </m.ul>
            <div className="mt-10 px-7">
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-3 text-ivory/80"
              >
                <Phone className="h-5 w-5 text-bronze" aria-hidden />
                <span className="nums text-lg tracking-wide-2">{SITE.phone}</span>
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
