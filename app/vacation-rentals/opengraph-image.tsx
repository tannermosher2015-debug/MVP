import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RENTAL } from "@/lib/rental";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${RENTAL.complex} vacation studio — Real Estate on Molokaʻi`;

// Inline the photo as a data URL so the card builds without a network
// round-trip (the file ships in the deployment's public/). Same approach as
// app/listings/[slug]/opengraph-image.tsx.
function photoDataUrl(imgPath: string): string | null {
  try {
    return `data:image/jpeg;base64,${readFileSync(join(process.cwd(), "public", imgPath)).toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image() {
  const photo = photoDataUrl(RENTAL.hero.src);
  const facts = [
    "Studio",
    `Sleeps ${RENTAL.maxGuests}`,
    RENTAL.floor,
  ].join("   ·   ");

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
            background: "linear-gradient(180deg, rgba(33,24,20,0.15) 30%, rgba(33,24,20,0.92) 100%)",
          }}
        />

        <div style={{ position: "absolute", top: 46, left: 56, display: "flex", fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#f8f4ed" }}>
          Real Estate on Molokaʻi
        </div>
        <div style={{ position: "absolute", top: 42, right: 56, display: "flex", padding: "10px 22px", borderRadius: 999, background: "#d9b87f", color: "#211814", fontSize: 22, letterSpacing: 2, textTransform: "uppercase" }}>
          Vacation rental
        </div>

        <div style={{ position: "absolute", left: 56, right: 56, bottom: 50, display: "flex", flexDirection: "column", color: "#f8f4ed" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <div style={{ display: "flex", fontSize: 78, fontWeight: 700, letterSpacing: -1 }}>
              ${RENTAL.rates.nightly}
            </div>
            <div style={{ display: "flex", fontSize: 34, color: "rgba(248,244,237,0.85)" }}>a night, plus tax</div>
          </div>
          <div style={{ display: "flex", marginTop: 6, fontSize: 40 }}>{RENTAL.headline}</div>
          <div style={{ display: "flex", marginTop: 8, fontSize: 28, color: "rgba(248,244,237,0.82)" }}>
            {RENTAL.complex}   ·   {facts}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
