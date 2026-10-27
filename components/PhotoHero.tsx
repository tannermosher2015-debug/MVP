import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Page hero: the photo runs clean with no tint or scrim over it, and the
 * eyebrow, title and copy sit on a solid espresso band directly beneath.
 * A gradient over the photo darkened it and a lighter one failed AA on bright
 * photos (6 of 10 blog posts, measured 2026-10-27), so the text gets its own ground.
 */
export default function PhotoHero({
  src,
  alt,
  heightClass = "h-[44vh] min-h-[300px]",
  sizes = "100vw",
  quality = 90,
  graded = false,
  children,
}: {
  src: string;
  alt: string;
  heightClass?: string;
  sizes?: string;
  quality?: 75 | 90 | 100;
  graded?: boolean;
  children: ReactNode;
}) {
  return (
    <section>
      <div className={`relative overflow-hidden ${heightClass}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority
          quality={quality}
          sizes={sizes}
          className={`${graded ? "graded " : ""}object-cover object-center`}
        />
      </div>
      <div className="bg-espresso px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-7xl">{children}</div>
      </div>
    </section>
  );
}
