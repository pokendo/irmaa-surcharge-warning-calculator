import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const pages = [
  ["index.html", "Estimate your Medicare premium surcharge before a big income decision"],
  ["irmaa-calculator/index.html", "IRMAA Calculator"],
  ["irmaa-brackets-2026/index.html", "2026 IRMAA Brackets"],
  ["medicare-magi/index.html", "Medicare MAGI"],
  ["what-is-irmaa/index.html", "What Is IRMAA?"],
  ["how-to-avoid-irmaa/index.html", "How to Avoid IRMAA Surprises"],
  ["irmaa-appeal-ssa-44-form/index.html", "SSA-44 Form"],
  ["roth-conversion-irmaa-calculator/index.html", "Roth Conversion IRMAA Calculator"],
  ["rmd-irmaa-calculator/index.html", "RMD IRMAA Calculator"],
  ["home-sale-medicare-premium-calculator/index.html", "Home Sale Medicare Premium Calculator"],
  ["capital-gains-irmaa-calculator/index.html", "Capital Gains IRMAA Calculator"],
  ["ira-withdrawal-medicare-premium-calculator/index.html", "IRA Withdrawal Medicare Premium Calculator"],
  ["401k-withdrawal-medicare-premium-calculator/index.html", "401(k) Withdrawal Medicare Premium Calculator"],
  ["qcd-irmaa/index.html", "QCD IRMAA Guide"],
  ["advertise/index.html", "Reach people making Medicare premium and retirement income decisions"],
];

for (const [path, heading] of pages) {
  test(`${path} contains the planned SEO heading`, async () => {
    const html = await readFile(join(root, path), "utf8");
    assert.match(html, new RegExp(`<h1[^>]*>${escapeRegExp(heading)}`));
  });
}

test("calculator pages use the guided planner layout with sponsor placements", async () => {
  const html = await readFile(join(root, "index.html"), "utf8");

  assert.match(html, /class="[^"]*layout-guided-planner/);
  assert.match(html, /planner-progress/);
  assert.match(html, /ad-slot ad-slot-sponsor/);
  assert.match(html, /Education partner/);
  assert.match(html, /Advertisement/);
});

test("homepage and calculator expose revenue capture surfaces", async () => {
  for (const path of ["index.html", join("irmaa-calculator", "index.html")]) {
    const html = await readFile(join(root, path), "utf8");

    assert.match(html, /data-newsletter-form/);
    assert.match(html, /Get IRMAA bracket updates/i);
    assert.match(html, /Sponsor this placement/i);
    assert.match(html, /src\/profit\.js|\.\.\/src\/profit\.js/);
  }
});

test("sponsor placement links point directly to the inquiry form", async () => {
  const home = await readFile(join(root, "index.html"), "utf8");
  const calculator = await readFile(join(root, "irmaa-calculator", "index.html"), "utf8");

  assert.doesNotMatch(home, /href="\.\/advertise\/" data-track-event="sponsor_slot_click"/);
  assert.match(home, /href="\.\/advertise\/#sponsor-inquiry" data-track-event="sponsor_slot_click"/);
  assert.doesNotMatch(calculator, /href="\.\.\/advertise\/" data-track-event="sponsor_slot_click"/);
  assert.match(calculator, /href="\.\.\/advertise\/#sponsor-inquiry" data-track-event="sponsor_slot_click"/);
});

test("advertise page documents sponsor inventory", async () => {
  const html = await readFile(join(root, "advertise", "index.html"), "utf8");

  assert.match(html, /Calculator sponsor/i);
  assert.match(html, /Scenario page sponsor/i);
  assert.match(html, /Email update sponsor/i);
  assert.match(html, /data-track-event="sponsor_inquiry"/);
  assert.match(html, /data-sponsor-inquiry-form/);
  assert.match(html, /name="company"/);
  assert.match(html, /name="email"/);
  assert.match(html, /name="message"/);
  assert.match(html, /id="sponsor-inquiry"/);
  assert.match(html, /Ask about sponsor availability/i);
});

test("mobile layout keeps the header out of the calculator viewport", async () => {
  const css = await readFile(join(root, "styles.css"), "utf8");

  assert.match(css, /@media \(max-width: 980px\)[\s\S]*\.site-header \{ position: static; \}/);
});

test("bracket page uses the calm civic utility layout with quiet ad inventory", async () => {
  const html = await readFile(join(root, "irmaa-brackets-2026", "index.html"), "utf8");

  assert.match(html, /class="[^"]*layout-civic-utility/);
  assert.match(html, /ad-slot ad-slot-leaderboard/);
  assert.match(html, /ad-slot ad-slot-rail/);
});

test("educational article pages use the editorial guide layout with related guides and ads", async () => {
  const html = await readFile(join(root, "medicare-magi", "index.html"), "utf8");

  assert.match(html, /class="[^"]*layout-editorial-guide/);
  assert.match(html, /Related guides/);
  assert.match(html, /ad-slot ad-slot-rail/);
  assert.match(html, /ad-slot ad-slot-inline/);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}



test("QCD page uses the editorial guide layout instead of calculator layout", async () => {
  const html = await readFile(join(root, "qcd-irmaa", "index.html"), "utf8");

  assert.match(html, /class="[^"]*layout-editorial-guide/);
  assert.doesNotMatch(html, /data-calculator-form/);
  assert.match(html, /Related guides/);
  assert.match(html, /href="\.\.\/irmaa-calculator\/"/);
});

test("homepage exposes scenario calculators for internal discovery", async () => {
  const html = await readFile(join(root, "index.html"), "utf8");

  for (const route of [
    "roth-conversion-irmaa-calculator",
    "rmd-irmaa-calculator",
    "home-sale-medicare-premium-calculator",
    "capital-gains-irmaa-calculator",
    "ira-withdrawal-medicare-premium-calculator",
    "401k-withdrawal-medicare-premium-calculator",
    "qcd-irmaa",
  ]) {
    assert.match(html, new RegExp(`href="\\./${route}/"`), route);
  }
});

for (const route of ["index.html", join("irmaa-calculator", "index.html")]) {
  test(`${route} includes a plain-English result summary target`, async () => {
    const html = await readFile(join(root, route), "utf8");

    assert.match(html, /data-result="summary"/);
    assert.match(html, /What this means/i);
  });
}

for (const route of ["index.html", join("irmaa-calculator", "index.html")]) {
  test(`${route} includes a printable estimate details section`, async () => {
    const html = await readFile(join(root, route), "utf8");

    assert.match(html, /class="print-summary"/);
    assert.match(html, /data-print-details/);
    assert.match(html, /Estimate details/i);
  });
}

for (const route of ["index.html", join("irmaa-calculator", "index.html")]) {
  test(`${route} includes a shareable estimate link control`, async () => {
    const html = await readFile(join(root, route), "utf8");

    assert.match(html, /data-share-link/);
    assert.match(html, /Copy share link/i);
  });
}
test("calculator and bracket pages include high-intent FAQ copy", async () => {
  const calculator = await readFile(join(root, "irmaa-calculator", "index.html"), "utf8");
  const brackets = await readFile(join(root, "irmaa-brackets-2026", "index.html"), "utf8");

  assert.match(calculator, /Frequently asked questions/i);
  assert.match(calculator, /Can a Roth conversion trigger IRMAA\?/i);
  assert.match(calculator, /Does this calculator give an exact Medicare premium\?/i);
  assert.match(brackets, /Frequently asked questions/i);
  assert.match(brackets, /What income year is used for 2026 IRMAA\?/i);
  assert.match(brackets, /When do 2027 IRMAA brackets come out\?/i);
});
