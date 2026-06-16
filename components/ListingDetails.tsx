import type { ListingDetail } from "@/lib/listings";

// Hide boolean-"No"/empty noise and a couple of exact duplicates, per the
// "scrap info if need to" direction. Everything else is shown verbatim.
const OMIT_VALUES = new Set(["no", "none", ""]);
const OMIT_LABELS = new Set(["lot size area"]); // identical to "Lot Size Acres"

const isUrl = (v: string) => /^https?:\/\//.test(v);
const spaced = (v: string) => v.replace(/,(?=\S)/g, ", ");

export default function ListingDetails({ detail }: { detail: ListingDetail }) {
  const groups = detail.groups
    .map((g) => ({
      title: g.title,
      fields: g.fields.filter(
        ([label, value]) =>
          !OMIT_VALUES.has(value.trim().toLowerCase()) &&
          !OMIT_LABELS.has(label.trim().toLowerCase())
      ),
    }))
    .filter((g) => g.fields.length > 0);

  if (!detail.description && groups.length === 0) return null;

  return (
    <div className="mt-12 border-t border-ink/10 pt-10">
      {/* Description + spec sections flow across two balanced columns on desktop,
          so the details rise up beside the description and neither side is blank. */}
      <div className="gap-x-14 lg:columns-2">
        {detail.description && (
          <div className="mb-9 break-inside-avoid">
            <h2 className="font-display text-2xl text-ink">About this property</h2>
            <p className="mt-4 text-base leading-relaxed text-cocoa">
              {detail.description}
            </p>
          </div>
        )}

        {groups.map((g) => (
          <section key={g.title} className="mb-9 break-inside-avoid">
            <h3 className="text-xs tracking-luxe uppercase text-bronze-deep">{g.title}</h3>
            <dl className="mt-3 divide-y divide-ink/8">
              {g.fields.map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-6 py-2 text-sm">
                  <dt className="shrink-0 text-taupe">{label}</dt>
                  <dd className="text-right text-cocoa">
                    {isUrl(value) ? (
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bronze-deep underline underline-offset-2 transition-colors hover:text-bronze"
                      >
                        View ↗
                      </a>
                    ) : (
                      spaced(value)
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
