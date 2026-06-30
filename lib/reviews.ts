/**
 * Client reviews — sourced from Dayna Harris's Zillow agent profile.
 * Zillow blocks automated access, so these are entered manually.
 * Reviews marked `excerpt: true` are truncated on Zillow ("Show more") and
 * are shown here as excerpts (ending with …) — never fabricated past the cut.
 */
export type Review = {
  name: string;
  date: string;
  location?: string;
  context?: string;
  quote: string;
  excerpt?: boolean;
};

export const REVIEW_SUMMARY = {
  rating: 5.0,
  count: 29,
  zillowUrl: "https://www.zillow.com/profile/Dayna%20Harris",
};

/**
 * Google Business Profile reviews (Molokai Vacation Properties, 4.5★ / 11).
 * Verbatim excerpts of real 5-star reviews pulled from the Google Places API;
 * the "Read all on Google" link points to the full profile (place_id
 * ChIJKYuWxPm3qn4RwzJohHT1OGI) so every review — good and critical — is one tap
 * away. Lower-rated reviews are not reproduced here, the same as the curated
 * Zillow set above.
 */
export const GOOGLE_SUMMARY = {
  rating: 4.5,
  count: 11,
  url: "https://www.google.com/maps?cid=7077676695199167171",
};

export const GOOGLE_REVIEWS: Review[] = [
  {
    name: "Jillyn Dillon",
    date: "Google review",
    quote:
      "Dayna is incredibly helpful and easy to work with. I could have saved myself hours of research if I had just called her right away! If you're looking to book a Molokai getaway, start here.",
    excerpt: true,
  },
  {
    name: "John Poppy",
    date: "Google review",
    quote:
      "Our experience with Molokai Vacation Properties was entirely happy. We told Wai, our agent at the company, that we would be visiting Molokai for the first time as a birthday present for one of us, and she helped us to make it a good one.",
    excerpt: true,
  },
  {
    name: "Peggy Potter",
    date: "Google review",
    quote:
      "We just returned from a great month on Molokai. We rented a unit at Molokai Shores and had a balcony overlooking the ocean and the island of Lanai in the distance. We were generally pleased with the service we got from Dayna and Tanner. They were diligent in attending to our needs and were really pleasant to work with. We're going back next year.",
  },
];

export const REVIEWS: Review[] = [
  {
    name: "Jamie Ronzello",
    date: "Zillow review",
    location: "Maunaloa",
    context: "Sold a home",
    quote:
      "Working with Dayna was an absolute pleasure from start to finish. Selling a home can be incredibly stressful, but she made the entire process feel seamless and easy. She was knowledgeable, responsive, organized, and always took the time to answer my questions and keep me informed every step of the way. Her professionalism, attention to detail, and commitment to achieving the best outcome gave me complete confidence throughout the process. Thanks to her expertise, my home sold quickly, and everything, from listing to closing, went more smoothly than I ever expected.",
  },
  {
    name: "Zerin Parker",
    date: "Feb 2026",
    location: "Kaunakakai",
    context: "Bought a single-family home",
    quote:
      "Dayna & John are true Molokaʻi real estate professionals, and they made our home-buying process a breeze. Communication was always timely and concise, making our home-buying process an efficient yet informed one.",
    excerpt: true,
  },
  {
    name: "Drew Smith",
    date: "Jul 2025",
    location: "Kaunakakai",
    context: "Bought a single-family home",
    quote:
      "Dayna and John did a fantastic job with our home purchase. They were great to work with and super responsive. They worked with us to find the perfect home on Molokaʻi. I would definitely use them again in the future, whether buying or selling!",
  },
  {
    name: "Ciara Welch",
    date: "Dec 2025",
    context: "First-time home buyer",
    quote:
      "John and Dayna are a great duo. As first-time home buyers, their immense knowledge and expertise gave us the confidence to tackle such a huge milestone. John was our go-to agent; his quick, open and honest communication provided peace of mind throughout the entire process.",
    excerpt: true,
  },
  {
    name: "Koa Cale",
    date: "Jul 2025",
    location: "Kaunakakai",
    context: "Bought a single-family home",
    quote:
      "We had a fantastic experience working with Dayna and John. From start to finish, they were completely hands-on, always available, and consistently willing to show me new properties — whether it was homes or land — without hesitation.",
    excerpt: true,
  },
];
