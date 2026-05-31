import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const productionOrigin = "https://www.irmaacheck.com";

const requiredRoutes = [
  "/",
  "/irmaa-calculator/",
  "/irmaa-brackets-2026/",
  "/medicare-magi/",
  "/what-is-irmaa/",
  "/how-to-avoid-irmaa/",
  "/irmaa-appeal-ssa-44-form/",
  "/roth-conversion-irmaa-calculator/",
  "/rmd-irmaa-calculator/",
  "/home-sale-medicare-premium-calculator/",
  "/capital-gains-irmaa-calculator/",
  "/ira-withdrawal-medicare-premium-calculator/",
  "/401k-withdrawal-medicare-premium-calculator/",
  "/qcd-irmaa/",
  "/does-roth-conversion-affect-irmaa/",
  "/do-capital-gains-affect-medicare-premiums/",
  "/do-rmds-affect-medicare-premiums/",
  "/does-selling-a-house-affect-medicare-premiums/",
  "/advertise/",
];

test("sitemap includes the launch SEO routes", async () => {
  const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");

  for (const route of requiredRoutes) {
    assert.match(sitemap, new RegExp(`<loc>${escapeRegExp(productionOrigin)}${route}</loc>`));
  }
});

test("robots file points crawlers to the sitemap", async () => {
  const robots = await readFile(join(root, "robots.txt"), "utf8");

  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/www\.irmaacheck\.com\/sitemap\.xml/);
});



test("sitemap includes lastmod dates for every public URL", async () => {
  const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
  const urlBlocks = [...sitemap.matchAll(/<url>[\s\S]*?<\/url>/g)].map((match) => match[0]);

  assert.equal(urlBlocks.length, requiredRoutes.length);
  for (const block of urlBlocks) {
    assert.match(block, /<lastmod>2026-05-(14|29|31)<\/lastmod>/);
  }
});
test("custom 404 page points users back to useful IRMAA pages", async () => {
  const html = await readFile(join(root, "404.html"), "utf8");

  assert.match(html, /Page not found/i);
  assert.match(html, /href="\.\/irmaa-calculator\/"/);
  assert.match(html, /href="\.\/irmaa-brackets-2026\/"/);
  assert.match(html, /href="\.\/medicare-magi\/"/);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
