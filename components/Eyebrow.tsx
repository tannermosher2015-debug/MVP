/** Editorial section label: index number + bronze rule + text. */
export default function Eyebrow({
  index,
  children,
  tone = "dark",
}: {
  index?: string;
  children: React.ReactNode;
  tone?: "dark" | "light" | "photo";
}) {
  // "photo" is for a label sitting on photography rather than a solid panel.
  // Gold cannot reach the 4.5:1 AA bar over an image at any scrim strength: measured
  // 1.02:1 to 3.13:1 on 10 routes, and even a 80% espresso scrim over a blown-out sky
  // only lifts it to 2.5:1. Ivory clears the same ground at 8.5:1. So gold stays where
  // DESIGN.md puts it, on solid espresso, and photography gets ivory.
  const text =
    tone === "photo" ? "text-ivory" : tone === "light" ? "text-gold" : "text-bronze-deep";
  const num =
    tone === "photo" ? "text-ivory/75" : tone === "light" ? "text-gold/70" : "text-bronze-deep";
  const rule =
    tone === "photo" ? "bg-ivory/45" : tone === "light" ? "bg-gold/40" : "bg-bronze/50";
  return (
    <p className={`flex items-center gap-3 text-xs tracking-luxe uppercase ${text}`}>
      {index && (
        <>
          <span className={`nums ${num}`}>{index}</span>
          <span className={`h-px w-6 ${rule}`} aria-hidden />
        </>
      )}
      <span>{children}</span>
    </p>
  );
}
