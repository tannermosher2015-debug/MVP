"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { SITE } from "@/lib/site";

function Wordmark({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  // Clicking the logo always returns "home". When already on the homepage,
  // smooth-scroll to the top (a same-route <Link> click wouldn't otherwise move);
  // from any other page the Link navigates to "/", which lands at the top.
  const handleClick = (e: React.MouseEvent) => {
    onNavigate?.();
    if (pathname === "/") {
      e.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }
  };
  // Clean full-colour logo on its own white card so it reads on any background.
  return (
    <Link href="/" onClick={handleClick} className="block" aria-label={`${SITE.name} — home`}>
      <span className="inline-flex rounded-lg bg-white px-3 py-1.5 shadow-sm">
        <Image
          src="/images/logo.png"
          alt={SITE.name}
          width={900}
          height={536}
          priority
          className="h-9 w-auto sm:h-11"
        />
      </span>
    </Link>
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

  // Desktop dropdown (e.g. Listings → MLS Search), opened on hover or keyboard focus.
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu]);

  const solid = scrolled || open || forceSolid;
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
          <Wordmark onNavigate={() => setOpen(false)} />

          {/* Desktop links */}
          <ul className="hidden items-center gap-2.5 lg:flex xl:gap-5">
            {SITE.nav.map((item) => {
              const children = "children" in item ? item.children : undefined;
              const dropdownOpen = children && openMenu === item.href;
              return (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={children ? () => setOpenMenu(item.href) : undefined}
                  onMouseLeave={children ? () => setOpenMenu(null) : undefined}
                  onFocus={children ? () => setOpenMenu(item.href) : undefined}
                  onBlur={
                    children
                      ? (e) => {
                          if (!e.currentTarget.contains(e.relatedTarget as Node))
                            setOpenMenu(null);
                        }
                      : undefined
                  }
                >
                  <Link
                    href={item.href}
                    aria-haspopup={children ? "menu" : undefined}
                    aria-expanded={children ? dropdownOpen : undefined}
                    className={`group/link relative inline-flex items-center gap-1 whitespace-nowrap text-[11px] tracking-wide-2 uppercase transition-colors xl:text-[13px] ${linkColor}`}
                  >
                    {item.label}
                    {children && (
                      <ChevronDown
                        className={`h-3.5 w-3.5 opacity-70 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    )}
                    <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-bronze transition-all duration-300 group-hover/link:w-full" />
                  </Link>
                  {children && (
                    <ul
                      className={`absolute left-0 top-full min-w-[190px] pt-3 transition-all duration-200 motion-reduce:transition-none ${
                        dropdownOpen
                          ? "visible translate-y-0 opacity-100"
                          : "invisible -translate-y-1 opacity-0"
                      }`}
                    >
                      <div className="rounded-xl border border-ink/10 bg-ivory/95 p-2 shadow-[0_20px_50px_-20px_rgba(33,24,20,0.35)] backdrop-blur-md">
                        {children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              onClick={() => setOpenMenu(null)}
                              className="block whitespace-nowrap rounded-lg px-4 py-2.5 text-[11px] tracking-wide-2 uppercase text-ink/80 transition-colors hover:bg-bronze/10 hover:text-bronze-deep focus-visible:bg-bronze/10 focus-visible:text-bronze-deep focus-visible:outline-none"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </div>
                    </ul>
                  )}
                </li>
              );
            })}
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
            <Link
              href="/#contact"
              className={`rounded-full border px-6 py-2.5 text-xs tracking-luxe uppercase transition-all duration-300 ${
                solid
                  ? "border-ink/30 text-ink hover:border-bronze hover:bg-bronze hover:text-ivory"
                  : "border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink"
              }`}
            >
              Inquire
            </Link>
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
              {SITE.nav.map((item) => {
                const children = "children" in item ? item.children : undefined;
                return (
                  <m.li
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      show: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-ivory/10 py-4 font-display text-3xl text-ivory"
                    >
                      {item.label}
                    </Link>
                    {children?.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="block border-b border-ivory/10 py-3 pl-5 font-display text-xl text-ivory/70"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </m.li>
                );
              })}
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
