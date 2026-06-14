/** Editorial section label: index number + bronze rule + text. */
export default function Eyebrow({
  index,
  children,
  tone = "dark",
}: {
  index?: string;
  children: React.ReactNode;
  tone?: "dark" | "light";
}) {
  const text = tone === "light" ? "text-gold" : "text-bronze-deep";
  const num = tone === "light" ? "text-gold/70" : "text-bronze";
  const rule = tone === "light" ? "bg-gold/40" : "bg-bronze/50";
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
