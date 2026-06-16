// Scrape RAM's full "More property info" for every active listing and store it
// in lib/listings-detail.generated.json (keyed by listing uid). RAM renders the
// fields client-side, so we render each page in a headless browser and parse the
// resulting text (see scripts/lib/parse-ram-detail.cjs).
//
// Run (Playwright lives in the promo-reel repo):
//   NODE_PATH=/c/Users/Tanne/mftw-promo-reel/node_modules \
//     node scripts/scrape-listing-details.cjs
const { chromium } = require("playwright");
const fs = require("fs");
const { parseRamDetail } = require("./lib/parse-ram-detail.cjs");

const LISTINGS = "C:/Users/Tanne/MVP/lib/listings.generated.json";
const OUT = "C:/Users/Tanne/MVP/lib/listings-detail.generated.json";

async function scrapeOne(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page
    .waitForFunction(
      () => /OTHER PROPERTY INFORMATION|PROPERTY DESCRIPTION|INTERIOR DETAILS|EXTERIOR DETAILS/.test(document.body.innerText),
      { timeout: 45000 }
    )
    .catch(() => null);
  await page.waitForTimeout(800);
  const text = await page.evaluate(() => document.body.innerText);
  return parseRamDetail(text);
}

(async () => {
  const raw = JSON.parse(fs.readFileSync(LISTINGS, "utf8"));
  const listings = Array.isArray(raw) ? raw : raw.listings || Object.values(raw);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);

  const out = {};
  let ok = 0;
  for (let i = 0; i < listings.length; i++) {
    const l = listings[i];
    if (!l.ramUrl) {
      console.log(`${i + 1}/${listings.length}  ${l.slug}  — no ramUrl, skip`);
      continue;
    }
    let detail = null;
    for (let attempt = 1; attempt <= 2 && !detail; attempt++) {
      try {
        const d = await scrapeOne(page, l.ramUrl);
        if (d.groups.length || d.description) detail = d;
        else throw new Error("empty");
      } catch (e) {
        if (attempt === 2) {
          console.log(`${i + 1}/${listings.length}  ${l.slug}  FAIL: ${e.message}`);
        } else {
          await page.waitForTimeout(1500);
        }
      }
    }
    if (detail) {
      out[l.id] = { slug: l.slug, ...detail };
      ok++;
      const nf = detail.groups.reduce((a, g) => a + g.fields.length, 0);
      console.log(
        `${i + 1}/${listings.length}  ${l.slug}  ✓  mls=${detail.mlsNumber || "?"}  ${detail.groups.length} groups / ${nf} fields  desc=${detail.description.length}c`
      );
    }
    await page.waitForTimeout(500); // polite
  }

  await browser.close();
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`\nscraped ${ok}/${listings.length} → ${OUT}`);
})();
