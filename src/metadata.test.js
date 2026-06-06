import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const productionOrigin = "https://www.irmaacheck.com";

const routes = [
  ["index.html", `${productionOrigin}/`],
  ["irmaa-calculator/index.html", `${productionOrigin}/irmaa-calculator/`],
  ["irmaa-brackets-2026/index.html", `${productionOrigin}/irmaa-brackets-2026/`],
  ["medicare-magi/index.html", `${productionOrigin}/medicare-magi/`],
  ["what-is-irmaa/index.html", `${productionOrigin}/what-is-irmaa/`],
  ["how-to-avoid-irmaa/index.html", `${productionOrigin}/how-to-avoid-irmaa/`],
  ["irmaa-appeal-ssa-44-form/index.html", `${productionOrigin}/irmaa-appeal-ssa-44-form/`],
  ["roth-conversion-irmaa-calculator/index.html", `${productionOrigin}/roth-conversion-irmaa-calculator/`],
  ["rmd-irmaa-calculator/index.html", `${productionOrigin}/rmd-irmaa-calculator/`],
  ["home-sale-medicare-premium-calculator/index.html", `${productionOrigin}/home-sale-medicare-premium-calculator/`],
  ["capital-gains-irmaa-calculator/index.html", `${productionOrigin}/capital-gains-irmaa-calculator/`],
  ["ira-withdrawal-medicare-premium-calculator/index.html", `${productionOrigin}/ira-withdrawal-medicare-premium-calculator/`],
  ["401k-withdrawal-medicare-premium-calculator/index.html", `${productionOrigin}/401k-withdrawal-medicare-premium-calculator/`],
  ["qcd-irmaa/index.html", `${productionOrigin}/qcd-irmaa/`],
  ["does-roth-conversion-affect-irmaa/index.html", `${productionOrigin}/does-roth-conversion-affect-irmaa/`],
  ["do-capital-gains-affect-medicare-premiums/index.html", `${productionOrigin}/do-capital-gains-affect-medicare-premiums/`],
  ["do-rmds-affect-medicare-premiums/index.html", `${productionOrigin}/do-rmds-affect-medicare-premiums/`],
  ["do-ira-withdrawals-affect-medicare-premiums/index.html", `${productionOrigin}/do-ira-withdrawals-affect-medicare-premiums/`],
  ["does-selling-a-house-affect-medicare-premiums/index.html", `${productionOrigin}/does-selling-a-house-affect-medicare-premiums/`],
  ["medicare-part-b-premium-2026/index.html", `${productionOrigin}/medicare-part-b-premium-2026/`],
  ["irmaa-planning-checklist/index.html", `${productionOrigin}/irmaa-planning-checklist/`],
  ["irmaa-two-year-lookback/index.html", `${productionOrigin}/irmaa-two-year-lookback/`],
  ["irmaa-cliff/index.html", `${productionOrigin}/irmaa-cliff/`],
  ["ways-to-reduce-irmaa/index.html", `${productionOrigin}/ways-to-reduce-irmaa/`],
  ["medicare-magi-vs-aca-magi/index.html", `${productionOrigin}/medicare-magi-vs-aca-magi/`],
  ["what-counts-toward-irmaa-magi/index.html", `${productionOrigin}/what-counts-toward-irmaa-magi/`],
  ["do-both-spouses-pay-irmaa/index.html", `${productionOrigin}/do-both-spouses-pay-irmaa/`],
  ["guides/index.html", `${productionOrigin}/guides/`],
  ["how-long-does-irmaa-last/index.html", `${productionOrigin}/how-long-does-irmaa-last/`],
  ["widow-penalty-irmaa/index.html", `${productionOrigin}/widow-penalty-irmaa/`],
  ["municipal-bond-interest-irmaa/index.html", `${productionOrigin}/municipal-bond-interest-irmaa/`],
  ["ssa-44-irmaa-appeal-timing-checker/index.html", `${productionOrigin}/ssa-44-irmaa-appeal-timing-checker/`],
  ["does-401k-contribution-reduce-irmaa-magi/index.html", `${productionOrigin}/does-401k-contribution-reduce-irmaa-magi/`],
  ["backdoor-roth-irmaa/index.html", `${productionOrigin}/backdoor-roth-irmaa/`],
  ["advertise/index.html", `${productionOrigin}/advertise/`],
];

test("all public pages include canonical links", async () => {
  for (const [path, canonical] of routes) {
    const html = await readFile(join(root, path), "utf8");
    assert.match(html, new RegExp(`<link rel="canonical" href="${escapeRegExp(canonical)}">`), path);
  }
});

test("all public pages include valid JSON-LD", async () => {
  for (const [path] of routes) {
    const html = await readFile(join(root, path), "utf8");
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(match, `${path} missing JSON-LD`);
    const parsed = JSON.parse(match[1]);
    assert.equal(parsed["@context"], "https://schema.org");
  }
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


test("calculator and bracket pages include FAQPage schema", async () => {
  for (const path of ["irmaa-calculator/index.html", "irmaa-brackets-2026/index.html"]) {
    const html = await readFile(join(root, path), "utf8");
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    const faq = scripts.find((item) => item["@type"] === "FAQPage");

    assert.ok(faq, `${path} missing FAQPage schema`);
    assert.equal(faq["@context"], "https://schema.org");
    assert.ok(faq.mainEntity.length >= 3, `${path} should include at least 3 FAQs`);
  }
});
test("all public pages include social preview metadata", async () => {
  for (const [path, canonical] of routes) {
    const html = await readFile(join(root, path), "utf8");

    assert.match(html, /<meta property="og:title" content="[^"]+">/, `${path} missing og:title`);
    assert.match(html, /<meta property="og:description" content="[^"]+">/, `${path} missing og:description`);
    assert.match(html, new RegExp(`<meta property="og:url" content="${escapeRegExp(canonical)}">`), `${path} missing og:url`);
    assert.match(html, /<meta property="og:type" content="website">/, `${path} missing og:type`);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image">/, `${path} missing twitter card`);
    assert.match(html, /<meta property="og:image" content="https:\/\/www\.irmaacheck\.com\/assets\/irmaa-social-card\.svg">/, `${path} missing og:image`);
    assert.match(html, /<meta name="twitter:image" content="https:\/\/www\.irmaacheck\.com\/assets\/irmaa-social-card\.svg">/, `${path} missing twitter:image`);
  }
});
test("social card asset exists", async () => {
  const svg = await readFile(join(root, "assets", "irmaa-social-card.svg"), "utf8");

  assert.match(svg, /<svg[^>]+viewBox="0 0 1200 630"/);
  assert.match(svg, /IRMAA Warning Calculator/);
});
test("non-home pages include BreadcrumbList schema", async () => {
  for (const [path, canonical] of routes.filter(([path]) => path !== "index.html")) {
    const html = await readFile(join(root, path), "utf8");
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    const breadcrumb = scripts.find((item) => item["@type"] === "BreadcrumbList");

    assert.ok(breadcrumb, `${path} missing BreadcrumbList schema`);
    assert.equal(breadcrumb["@context"], "https://schema.org");
    assert.equal(breadcrumb.itemListElement[0].item, `${productionOrigin}/`);
    assert.equal(breadcrumb.itemListElement[1].item, canonical);
  }
});
