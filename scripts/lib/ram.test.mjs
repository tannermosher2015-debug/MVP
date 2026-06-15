import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseCards, extractCardsHtml, photoUrl } from "./ram.mjs";

test("parseCards extracts listings from a GetAgentListings response", () => {
  const raw = readFileSync(new URL("../fixtures/agent-page-1.json", import.meta.url), "utf8");
  const html = extractCardsHtml(raw);
  const cards = parseCards(html);
  assert.ok(cards.length >= 1, "should find at least one card");
  const c = cards[0];
  assert.match(c.uid, /^[a-f0-9]{32}$/);
  assert.ok(c.address.length > 3, "address: " + c.address);
  assert.match(c.region, /^[A-Z]{2}$/);
  assert.ok(Number.isInteger(c.beds));
  assert.ok(c.price > 0, "price: " + c.price);
  assert.match(c.detailPath, /^\/property\/.+\/\d+-[a-f0-9]{32}$/);
});

test("photoUrl builds the indexed image URL", () => {
  assert.equal(
    photoUrl("017d78e6c5843669bbccc96e56d3da89", 3),
    "https://mlsimages.salecore.com/i/feed_20/Property/017d78e6c5843669bbccc96e56d3da89/3",
  );
});
