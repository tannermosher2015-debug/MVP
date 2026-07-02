import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ListingsGrid from "@/components/ListingsGrid";
import LandingLinks from "@/components/LandingLinks";
import { getListings } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Current Listings",
  description:
    "Homes, condominiums and land for sale on Molokaʻi — filter by area and view every listing on the MLS.",
  alternates: { canonical: "/listings" },
};

export default async function ListingsPage() {
  const all = await getListings();
  return (
    <>
      <Nav solid />
      <main id="main-content" className="pt-20">
        <ListingsGrid listings={all} />
        <LandingLinks heading="Browse by type and area" />
      </main>
      <Footer />
    </>
  );
}
