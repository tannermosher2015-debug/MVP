# MVP (Real Estate on Molokai) - client needs

Running list of client asks that need an answer, plus what was noticed and left alone.
Round 2026-09-02: Dayna's email "New listing. Hotel Molokai is pending." plus Tanner's
"Make a pending page or spot on website".

## Waiting on Dayna

- [ ] "000 Kamehameha V Hwy 1B" ($159,000, 1.8 acre lot, MLS 406631) dropped off the RAM
  active feed the same day, and Dayna did not mention it. Its RAM page no longer loads a
  detail block. Dayna's Zillow profile, read 2026-09-02, does NOT list it as sold, so it
  is pending or withdrawn. Following the feed, it is OFF the site this round. Ask her: is
  it pending (then add its uid `de606207398f1b5b70617192dae96b48` to `PENDING` in
  `scripts/sync-listings.mjs` and re-run), or withdrawn (nothing to do)?
- [x] 2655 Kamehameha V Hwy, Kaunakakai: sold 2026-08-31 at $550,000, 3 bd / 2 ba / 875 sqft,
  buyer side (Redfin and Zillow). Added to `lib/sold.ts` on Tanner's yes, 2026-09-02, photo
  from the MLS 410095 lead shot.
- [x] 15 Kawela Way baths: Tanner chose to trust RAM on 2026-09-02. Both overrides removed,
  the site now says 2 baths and the remarks read "2-bedroom, 2-bath". The lot-size
  correction stays.
- [ ] Hotel Molokai 202 closes: remove its line from `PENDING` in `scripts/sync-listings.mjs`,
  re-run the sync, and add it to `lib/sold.ts` with the closing price once she gives it.

## Noticed, not changed

- The nav has no "Pending" link. The spot lives at `/listings#pending` and only renders when
  something is pending, so a nav link would point at nothing most of the year. Tanner's call.
- RAM's `GetAgentListings` ignores `transactionType` (measured 2026-09-02: "Pending" and
  "Active" return the same rows), so pending status can never come from the feed. It is
  hand-held in `PENDING`.

## Done this round

- 0 Makanui Rd 241 (MLS 410702, $205,000, 2 acre Kawela Plantation lot) added by feed sync (requested)
- 1300 Kamehameha V Hwy 202 (Hotel Molokai) kept with status Pending instead of vanishing (requested)
- "Pending Sales" section at the bottom of `/listings`, only shown when a pending listing exists (requested)
- Pending listings excluded from the for-sale grid, the featured property, the landing pages and the sitemap; detail page still builds and shows a Pending badge (requested)
- Detail page JSON-LD availability reads LimitedAvailability for a pending listing instead of InStock (defect: a pending sale marked in stock)
