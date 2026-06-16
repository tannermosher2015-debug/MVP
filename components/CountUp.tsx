"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Counts up the numeric portion of a label (e.g. "40+", "100%", "3,606")
 * when it scrolls into view. Falls back to the final value with reduced motion.
 */
export default function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseInt(match[2].replace(/,/g, ""), 10) : NaN;
  const suffix = match?.[3] ?? "";

  const [n, setN] = useState(0);

  useEffect(() => {
    // Only animate once the element scrolls into view (and motion is allowed).
    // setState lives inside the rAF callback, never synchronously in the effect.
    if (Number.isNaN(target) || reduce || !inView) return;
    let raf = 0;
    const duration = 1400;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target]);

  if (Number.isNaN(target)) return <span className={className}>{value}</span>;

  // Reduced motion shows the final value immediately; otherwise count up from 0.
  const display = reduce ? target : n;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
