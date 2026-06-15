import type { Metadata } from "next";
import { Cinzel, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import MotionProvider from "@/components/MotionProvider";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Luxury & Island Real Estate on Molokaʻi, Hawaiʻi`,
    template: `%s — ${SITE.name}`,
  },
  description:
    "Homes, condominiums, land and oceanfront estates on the island of Molokaʻi. Sales, long-term and vacation property management with broker Dayna E. Harris.",
  keywords: [
    "Molokai real estate",
    "Molokai homes for sale",
    "Hawaii oceanfront property",
    "Kaunakakai real estate",
    "Molokai property management",
  ],
  verification: { google: "5oOVmebU4Izi097ZMwFvjbmyVvwD9_ONN2XvAY5PALY" },
  openGraph: {
    // Shown in link previews (iMessage, Facebook, etc.). Kept distinct from the
    // keyword-rich <title> used for Google/browser tabs.
    title: `Find True Aloha: ${SITE.name}`,
    description:
      "Discover homes, condos, land and oceanfront estates on the island of Molokaʻi, Hawaiʻi.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${josefin.variable} antialiased`}
    >
      <body className="min-h-dvh bg-ivory text-ink">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
