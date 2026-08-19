// Scrape RAM's full "More property info" for every active listing and store it
// in lib/listings-detail.generated.json (keyed by listing uid). RAM renders the
// fields client-side, so we render each page in a headless browser and parse the
// resulting text (see scripts/lib/parse-ram-detail.cjs).
//
// Run (Playwright is not a dep of this repo, so borrow the globally installed
// @playwright/cli's copy). Resolve both paths rather than hardcoding them: the
// npm prefix differs per machine and the chromium revision changes on update.
// Bash:
//   NODE_PATH="$(npm root -g)/@playwright/cli/node_modules" \
//   PW_CHROMIUM="$(ls -d "$LOCALAPPDATA"/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-win64/chrome-headless-shell.exe | tail -1)" \
//   node scripts/scrape-listing-details.cjs
//
// PW_CHROMIUM is needed because the borrowed Playwright's pinned browser
// revision is often not the one downloaded here; see the launch call below.
//
// Verified 2026-08-19 by requiring playwright and launching chromium through
// exactly the two commands above. The previous version of this comment pointed
// NODE_PATH at /c/dev/waena-inn/node_modules, which has no Playwright installed,
// and as of that date no repo on this laptop does.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { parseRamDetail } = require("./lib/parse-ram-detail.cjs");

const lib = (f) => path.join(__dirname, "..", "lib", f);
const LISTINGS = lib("listings.generated.json");
const OUT = lib("listings-detail.generated.json");

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
  // The borrowed Playwright's pinned browser revision may not be the one that is
  // downloaded here; PW_CHROMIUM points it at whichever build does exist.
  const browser = await chromium.launch({ headless: true, executablePath: process.env.PW_CHROMIUM || undefined });
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
