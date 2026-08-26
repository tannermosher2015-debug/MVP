import type { Block } from "@/lib/blog";

/**
 * Renders a post's block array as semantic HTML.
 *
 * Deliberately not a markdown renderer: the four block kinds in lib/blog.ts are
 * everything these posts use, and a parser would be a dependency plus an
 * injection surface for the sake of asterisks. Add a kind here if a post
 * genuinely needs one.
 */
export default function PostBody({ blocks }: { blocks: readonly Block[] }) {
  return (
    <div className="space-y-7">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "h2":
            return (
              <h2
                key={i}
                className="pt-4 font-display text-2xl leading-snug text-ink sm:text-3xl"
              >
                {block.text}
              </h2>
            );

          case "list":
            return (
              <ul key={i} className="space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3 text-lg leading-relaxed text-cocoa">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "pull":
            return (
              <blockquote
                key={i}
                className="border-l-2 border-bronze py-1 pl-6 font-display text-xl leading-snug text-bronze-deep sm:text-2xl"
              >
                {block.text}
              </blockquote>
            );

          default:
            return (
              <p key={i} className="text-lg leading-relaxed text-cocoa">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
