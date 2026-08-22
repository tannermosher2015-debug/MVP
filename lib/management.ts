/**
 * ============================================================================
 *  VACATION PROPERTY MANAGEMENT  -  owner-facing service facts
 * ============================================================================
 *  Why this page exists: Search Console shows the site already ranking at
 *  position 4.7 for "molokai vacation rental management" (63 impressions in
 *  90 days) and 8.6 for "molokai house rentals", with no page to land on.
 *  The demand is arriving on the strength of the brand and the GBP alone.
 *
 *  SCOPE, confirmed by Tanner 2026-08-21: Dayna STILL offers vacation property
 *  management, but it is NOT her main focus - real estate sales is. Long-term
 *  rentals she does NOT manage; she refers those to a trusted island manager,
 *  which is exactly what the Long-Term Rentals card on the homepage says.
 *  Keep the copy here honest about that. Overselling this page is the one way
 *  it can do damage, because every lead it wins is a lead Dayna has to service.
 *
 *  EVERY value below is either confirmed or the TBD sentinel from lib/rental.ts,
 *  which renders as a visible chip. Nothing here is invented. See
 *  [[build-no-invented-facts]].
 * ============================================================================
 */
import { TBD } from "@/lib/rental";

export const MANAGEMENT = {
  /** <h1>. */
  headline: "Vacation property management on Molokaʻi",

  /**
   * Intro. Written only from confirmed facts: Dayna's tenure, the firm's
   * accolade, and the deliberate "selective" framing that keeps this honest
   * about it not being the main focus.
   */
  intro:
    "We look after a small number of vacation rentals on Molokaʻi for owners who want the island handled properly. Real estate sales is our main focus, so we take on managed properties selectively rather than in volume.",

  /** All confirmed. Sources: lib/site.ts broker bio, SITE.accolade, SITE.address. */
  credentials: [
    {
      stat: "20+ years",
      label: "Running Molokaʻi's largest property-management company",
    },
    {
      stat: "30+ years",
      label: "Dayna on-island, since 1990",
    },
    {
      stat: "#1",
      label: "Most properties sold in Maui County, 2026",
    },
  ],

  /**
   * What an owner actually gets. UNCONFIRMED - Dayna has to supply this before
   * the page can go live, because a management scope is a commitment, not
   * marketing copy. Replace each TBD with the real inclusion, or delete the
   * row entirely if it is not offered. An empty list renders no section at all.
   */
  included: [
    { title: "Bookings and guest communication", detail: TBD },
    { title: "Cleaning and turnover", detail: TBD },
    { title: "Maintenance and repairs", detail: TBD },
    { title: "Owner reporting and payouts", detail: TBD },
  ],

  /** UNCONFIRMED. A management fee is a price: never publish a guess. */
  fee: TBD,

  /** UNCONFIRMED. Which complexes or areas she will take on. */
  coverage: TBD,

  /**
   * Confirmed and deliberately kept: this is the honest answer to the
   * long-term rental queries the site also ranks for, and a referral is a
   * real service. Mirrors SITE.services[1].
   */
  longTerm:
    "Dayna no longer manages long-term rentals herself, but she will gladly connect you with a trusted Molokaʻi property manager.",
} as const;
