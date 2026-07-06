import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const metadataTargets = [
  {
    path: "municipal-bond-interest-irmaa/index.html",
    title: "Does Municipal Bond Interest Count Toward IRMAA? Yes - Here's Why",
    description: "Tax-exempt muni bond interest is added back into your MAGI for IRMAA. See how it's counted, with examples and 2026 bracket thresholds.",
    h1: "Does Municipal Bond Interest Count Toward IRMAA?",
    quickAnswer: "Yes - tax-exempt municipal bond interest is added back into your modified adjusted gross income (MAGI) when Social Security calculates IRMAA.",
  },
  {
    path: "irmaa-two-year-lookback/index.html",
    title: "IRMAA 2-Year Lookback Explained: Which Tax Year Counts (2026)",
    description: "Your 2026 IRMAA is based on your 2024 tax return. How the two-year lookback works, what income counts, and when SSA-44 can help.",
    h1: "IRMAA Two-Year Lookback",
    quickAnswer: "Your 2026 IRMAA is generally based on your 2024 tax return, because Medicare usually uses a two-year lookback for premium surcharges.",
  },
  {
    path: "do-both-spouses-pay-irmaa/index.html",
    title: "Do Both Spouses Pay IRMAA? How Married Couples Are Charged",
    description: "Yes - IRMAA applies per person, so a married couple can pay it twice. See how joint MAGI sets the bracket and what separate filing changes.",
    h1: "Do Both Spouses Pay IRMAA?",
    quickAnswer: "Yes - if both spouses are enrolled in Medicare and the household is in an IRMAA bracket, each spouse can be charged the monthly surcharge.",
  },
  {
    path: "how-long-does-irmaa-last/index.html",
    title: "How Long Does IRMAA Last? (One Year - Then It Resets)",
    description: "IRMAA is recalculated every year from your tax return two years back. When it drops off, when it can return, and how to appeal a one-time spike.",
    h1: "How Long Does IRMAA Last?",
    quickAnswer: "IRMAA usually lasts for one premium year, then resets when Social Security uses newer tax information for the next Medicare premium year.",
  },
  {
    path: "does-social-security-count-toward-irmaa/index.html",
    title: "Does Social Security Count Toward IRMAA? Only the Taxable Part",
    description: "Only the taxable portion of Social Security counts in your MAGI for IRMAA. See what's included, what isn't, and how to estimate your bracket.",
    h1: "Does Social Security Count Toward IRMAA?",
    quickAnswer: "Only the taxable portion of Social Security counts toward IRMAA because taxable benefits are already included in federal AGI.",
  },
];

test("Search Console rescue pages use high-click-intent metadata", async () => {
  for (const target of metadataTargets) {
    const html = await readFile(join(root, target.path), "utf8");

    assert.equal(countMatches(html, /<title>/g), 1, `${target.path} title count`);
    assert.equal(extractTitle(html), target.title, target.path);
    assert.equal(extractMeta(html, "description"), target.description, target.path);
    assert.equal(extractProperty(html, "og:title"), target.title, target.path);
    assert.equal(extractProperty(html, "og:description"), target.description, target.path);
    assert.ok(target.description.length <= 155, `${target.path} meta description is ${target.description.length} chars`);
  }
});

test("Search Console rescue pages put a direct answer immediately after the H1", async () => {
  for (const target of metadataTargets) {
    const html = await readFile(join(root, target.path), "utf8");
    const expected = new RegExp(
      `<h1>${escapeRegExp(target.h1)}</h1>\\s*<p class="quick-answer"><strong>Quick answer:</strong> ${escapeRegExp(target.quickAnswer)}</p>`
    );

    assert.match(html, expected, target.path);
  }
});

test("quick answer snippets use a distinct left-border callout style", async () => {
  const css = await readFile(join(root, "styles.css"), "utf8");

  assert.match(css, /\.quick-answer\s*\{/);
  assert.match(css, /\.quick-answer\s*\{[\s\S]*border-left:\s*4px solid var\(--teal\)/);
  assert.match(css, /\.quick-answer\s*\{[\s\S]*background:\s*var\(--soft\)/);
  assert.match(css, /\.quick-answer\s*\{[\s\S]*padding:/);
});

function extractTitle(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
}

function extractMeta(html, name) {
  return html.match(new RegExp(`<meta name="${escapeRegExp(name)}" content="([^"]*)">`))?.[1];
}

function extractProperty(html, property) {
  return html.match(new RegExp(`<meta property="${escapeRegExp(property)}" content="([^"]*)">`))?.[1];
}

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
