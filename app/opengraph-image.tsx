import { ImageResponse } from "next/og";

export const alt = "Real Estate on Molokai — luxury & island real estate on Molokaʻi, Hawaiʻi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background:
            "linear-gradient(135deg, #211814 0%, #2b221c 55%, #19110d 100%)",
          color: "#f8f4ed",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#d9b87f",
            display: "flex",
          }}
        >
          ʻ&nbsp;&nbsp;Molokaʻi · Hawaiʻi
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 104,
            lineHeight: 1.02,
            letterSpacing: -1,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          Real Estate on Molokaʻi
        </div>

        <div
          style={{
            marginTop: 40,
            width: 160,
            height: 3,
            background: "#a07d4b",
            display: "flex",
          }}
        />

        <div
          style={{
            marginTop: 30,
            fontSize: 30,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#d9b87f",
            display: "flex",
          }}
        >
          Most homes sold in Maui County · 2026
        </div>

        <div
          style={{
            marginTop: 16,
            fontSize: 32,
            color: "rgba(248,244,237,0.72)",
            display: "flex",
          }}
        >
          Homes · Oceanfront estates · Condominiums · Land
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(248,244,237,0.5)",
            display: "flex",
          }}
        >
          Broker Dayna E. Harris · 808.553.8335
        </div>
      </div>
    ),
    { ...size },
  );
}
