"use client";

import { useEffect } from "react";
import { LazyMotion, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * Loads only the `domAnimation` feature bundle (animation + exit + inView +
 * hover/tap/focus gestures) instead of the full framer-motion bundle. Every
 * animated component uses the lightweight `m.*` primitives, which look up these
 * features here. `strict` throws if a full `motion.*` component sneaks in, so a
 * missed conversion fails loudly instead of silently shipping the big bundle.
 *
 * Covers all current usage: whileInView (Reveal/Stagger), whileHover/whileTap,
 * AnimatePresence, and the scroll-parallax hooks (which are feature-independent).
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  // Signals the render-failsafe (in app/layout.tsx) that the app hydrated, so it
  // leaves the scroll-reveal animations to run normally in working browsers.
  useEffect(() => {
    document.documentElement.setAttribute("data-hydrated", "1");
  }, []);
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
