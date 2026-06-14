import { Star } from "lucide-react";
import type { Review } from "@/lib/reviews";

export default function ReviewCard({
  review,
  tone = "light",
}: {
  review: Review;
  tone?: "light" | "dark";
}) {
  const card = tone === "dark" ? "border-ivory/10 bg-ivory/[0.03]" : "border-ink/10 bg-white";
  const quote = tone === "dark" ? "text-ivory/85" : "text-cocoa";
  const name = tone === "dark" ? "text-ivory" : "text-ink";
  const meta = tone === "dark" ? "text-ivory/55" : "text-taupe";
  const divider = tone === "dark" ? "border-ivory/10" : "border-ink/8";

  return (
    <article className={`flex h-full flex-col rounded-2xl border p-7 ${card}`}>
      <div className="flex gap-1" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-gold text-gold" aria-hidden />
        ))}
      </div>
      <blockquote className={`mt-4 flex-1 text-base leading-relaxed ${quote}`}>
        &ldquo;{review.quote}
        {review.excerpt ? " …" : ""}&rdquo;
      </blockquote>
      <div className={`mt-5 border-t pt-4 ${divider}`}>
        <p className={`font-display text-lg ${name}`}>{review.name}</p>
        <p className={`mt-0.5 text-xs tracking-wide-2 uppercase ${meta}`}>
          {[review.context, review.location, review.date].filter(Boolean).join(" · ")}
        </p>
      </div>
    </article>
  );
}
