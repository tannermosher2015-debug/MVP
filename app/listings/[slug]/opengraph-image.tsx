import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getListings,
  getListingBySlug,
  formatPrice,
  formatBaths,
  typeLabel,
} from "@/lib/listings";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Listing on Molokaʻi — Real Estate on Molokaʻi";

export async function generateStaticParams() {
  return (await getListings()).map((l) => ({ slug: l.slug }));
}

// Inline the listing's lead photo as a data URL so the card builds without a
// network round-trip (the file lives in the deployment's public/).
function photoDataUrl(imgPath: string): string | null {
  try {
    const buf = readFileSync(join(process.cwd(), "public", imgPath));
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = await getListingBySlug(slug);
  const photo = l ? photoDataUrl(l.image) : null;

  const facts = l
    ? [
        l.beds > 0 ? `${l.beds} bd` : null,
        l.baths > 0 ? `${formatBaths(l.baths)} ba` : null,
        l.sqft > 0 ? `${l.sqft.toLocaleString()} sqft` : null,
      ]
        .filter(Boolean)
        .join("   ·   ")
    : "";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#211814" }}>
        {photo && (
          <img
            src={photo}
            width={1200}
            height={630}
            style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            background: "linear-gradient(180deg, rgba(33,24,20,0.12) 35%, rgba(33,24,20,0.9) 100%)",
          }}
        />

        <div style={{ position: "absolute", top: 46, left: 56, display: "flex", fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#f8f4ed" }}>
          Real Estate on Molokaʻi
        </div>
        {l && (
          <div style={{ position: "absolute", top: 42, right: 56, display: "flex", padding: "10px 22px", borderRadius: 999, background: "rgba(248,244,237,0.92)", color: "#211814", fontSize: 22, letterSpacing: 2, textTransform: "uppercase" }}>
            {typeLabel(l.type)}
          </div>
        )}

        <div style={{ position: "absolute", left: 56, right: 56, bottom: 50, display: "flex", flexDirection: "column", color: "#f8f4ed" }}>
          <div style={{ display: "flex", fontSize: 78, fontWeight: 700, letterSpacing: -1 }}>
            {l ? formatPrice(l.price) : "Real Estate on Molokaʻi"}
          </div>
          {l && <div style={{ display: "flex", marginTop: 8, fontSize: 40 }}>{l.title}</div>}
          {l && (
            <div style={{ display: "flex", marginTop: 8, fontSize: 28, color: "rgba(248,244,237,0.82)" }}>
              {l.city}, {l.region}
              {facts ? `   ·   ${facts}` : ""}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
