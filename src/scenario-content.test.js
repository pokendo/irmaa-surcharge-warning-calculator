import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const pages = [
  ["roth-conversion-irmaa-calculator/index.html", "Why Roth conversions can affect IRMAA", "Roth conversion FAQ", "roth"],
  ["rmd-irmaa-calculator/index.html", "Why RMDs can affect IRMAA", "RMD FAQ", "rmd"],
  ["home-sale-medicare-premium-calculator/index.html", "Why a home sale can affect Medicare premiums", "Home sale FAQ", "home"],
  ["capital-gains-irmaa-calculator/index.html", "Why capital gains can affect IRMAA", "Capital gains FAQ", "gains"],
  ["ira-withdrawal-medicare-premium-calculator/index.html", "Why IRA withdrawals can affect Medicare premiums", "IRA withdrawal FAQ", "ira"],
  ["401k-withdrawal-medicare-premium-calculator/index.html", "Why 401(k) withdrawals can affect Medicare premiums", "401(k) withdrawal FAQ", "401k"],
  ["qcd-irmaa/index.html", "How QCDs can affect IRMAA planning", "QCD FAQ", ""],
];

test("scenario calculator pages include educational sections and internal links", async () => {
  for (const [path, h2, faqLabel, defaultEvent] of pages) {
    const html = await readFile(join(root, path), "utf8");
    assert.match(html, new RegExp(`<h2>${escapeRegExp(h2)}</h2>`), path);
    assert.match(html, new RegExp(`<h3>${escapeRegExp(faqLabel)}</h3>`), path);
    assert.match(html, /href="\.\.\/medicare-magi\/"/);
    assert.match(html, /href="\.\.\/irmaa-brackets-2026\/"/);
    assert.match(html, /href="\.\.\/irmaa-calculator\/"/);
    if (defaultEvent) {
      assert.match(html, new RegExp(`data-default-event="${defaultEvent}"`), path);
    }
  }
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


