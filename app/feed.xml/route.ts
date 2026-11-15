import { POSTS } from "@/lib/blog";
import { SITE } from "@/lib/site";

// RSS 2.0 of every blog post, newest first (POSTS is already sorted). Google accepts RSS 2.0
// as a sitemap, and a feed lists only what is new or changed. Built once at build time.
// No build time in the file: lastBuildDate is the newest post, so an unchanged blog gives an
// unchanged feed. Added 2026-11-14.
export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// An ISO date has no time; noon in Hawaii keeps it on the same calendar day everywhere.
const rfc = (iso: string) => new Date(`${iso.slice(0, 10)}T12:00:00-10:00`).toUTCString();

export function GET() {
  const items = POSTS.map((p) => {
    const link = `${SITE.url}/blog/${p.slug}`;
    return (
      `<item><title>${esc(p.h1)}</title><link>${link}</link><guid>${link}</guid>` +
      `<pubDate>${rfc(p.published)}</pubDate><description>${esc(p.excerpt)}</description></item>`
    );
  }).join("\n");
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
    `<channel><title>${esc(SITE.name)} Blog</title><link>${SITE.url}/blog</link>` +
    `<atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml"/>` +
    `<description>Island guides and buyer explainers from Molokai real estate.</description>` +
    `<lastBuildDate>${POSTS.length ? rfc(POSTS[0].published) : ""}</lastBuildDate>\n${items}\n</channel></rss>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
