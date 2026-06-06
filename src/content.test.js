import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const pages = [
  ["index.html", "Avoid IRMAA surprises. Plan with confidence."],
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
  ["does-roth-conversion-affect-irmaa/index.html", "Does a Roth Conversion Affect IRMAA?"],
  ["do-capital-gains-affect-medicare-premiums/index.html", "Do Capital Gains Affect Medicare Premiums?"],
  ["do-rmds-affect-medicare-premiums/index.html", "Do RMDs Affect Medicare Premiums?"],
  ["do-ira-withdrawals-affect-medicare-premiums/index.html", "Do IRA Withdrawals Affect Medicare Premiums?"],
  ["does-selling-a-house-affect-medicare-premiums/index.html", "Does Selling a House Affect Medicare Premiums?"],
  ["medicare-part-b-premium-2026/index.html", "Medicare Part B Premium 2026"],
  ["irmaa-planning-checklist/index.html", "IRMAA Planning Checklist"],
  ["irmaa-two-year-lookback/index.html", "IRMAA Two-Year Lookback"],
  ["irmaa-cliff/index.html", "IRMAA Cliff"],
  ["ways-to-reduce-irmaa/index.html", "Ways to Reduce IRMAA"],
  ["medicare-magi-vs-aca-magi/index.html", "Medicare MAGI vs ACA MAGI"],
  ["what-counts-toward-irmaa-magi/index.html", "What Counts Toward IRMAA MAGI?"],
  ["do-both-spouses-pay-irmaa/index.html", "Do Both Spouses Pay IRMAA?"],
  ["guides/index.html", "IRMAA Guides and Planning Tools"],
  ["ssa-44-irmaa-appeal-timing-checker/index.html", "SSA-44 IRMAA Appeal Timing Checker"],
  ["does-401k-contribution-reduce-irmaa-magi/index.html", "Does a 401(k) Contribution Reduce IRMAA MAGI?"],
  ["does-social-security-count-toward-irmaa/index.html", "Does Social Security Count Toward IRMAA?"],
  ["one-time-income-spike-irmaa/index.html", "One-Time Income Spike and IRMAA"],
  ["how-long-does-irmaa-last/index.html", "How Long Does IRMAA Last?"],
  ["widow-penalty-irmaa/index.html", "Widow Penalty and IRMAA"],
  ["municipal-bond-interest-irmaa/index.html", "Municipal Bond Interest and IRMAA"],
  ["backdoor-roth-irmaa/index.html", "Backdoor Roth and IRMAA"],
  ["advertise/index.html", "Reach people making Medicare premium and retirement income decisions"],
  ["about/index.html", "About IRMAA Check"],
  ["privacy/index.html", "Privacy Policy"],
  ["contact/index.html", "Contact IRMAA Check"],
];

test("all public pages are covered by content and layout tests", async () => {
  const discoveredPages = await collectPublicPages(root);
  const expectedPages = pages.map(([path]) => normalizePath(path)).sort();

  assert.deepEqual(discoveredPages, expectedPages);
});

for (const [path, heading] of pages) {
  test(`${path} contains the planned SEO heading`, async () => {
    const html = await readFile(join(root, path), "utf8");
    assert.match(html, new RegExp(`<h1[^>]*>${escapeRegExp(heading)}`));
  });
}

test("homepage uses the image-led guided planner layout without an ad before the primary experience", async () => {
  const html = await readFile(join(root, "index.html"), "utf8");

  assert.match(html, /class="[^"]*layout-guided-planner/);
  assert.match(html, /class="hero-media"/);
  assert.match(html, /src="\.\/assets\/irmaa-planning-couple\.webp"/);
  assert.match(html, /class="calculator-workspace"/);
  assert.match(html, /class="lookback-timeline"/);
  assert.match(html, /2024 income[\s\S]*2026 premium/i);
  assert.ok(html.indexOf('id="calculator"') < html.indexOf("Advertisement"));
});

test("high-intent lookback and cliff guides include purpose-built explanatory visuals", async () => {
  const lookback = await readFile(join(root, "irmaa-two-year-lookback", "index.html"), "utf8");
  const cliff = await readFile(join(root, "irmaa-cliff", "index.html"), "utf8");

  assert.match(lookback, /class="decision-visual lookback-visual"/);
  assert.match(lookback, /Age 63[\s\S]*Age 65/i);
  assert.match(cliff, /class="decision-visual cliff-visual"/);
  assert.match(cliff, /Below threshold[\s\S]*One dollar over/i);
});

test("lookback cluster gives visitors a clear understand calculate act path", async () => {
  const homepage = await readFile(join(root, "index.html"), "utf8");
  const lookback = await readFile(join(root, "irmaa-two-year-lookback", "index.html"), "utf8");

  assert.match(homepage, /class="timeline-guide-link"[^>]+href="\.\/irmaa-two-year-lookback\/"/);
  assert.match(lookback, /class="planning-path"/);
  assert.match(lookback, /href="\.\.\/medicare-magi\/"[\s\S]*?Understand Medicare MAGI/);
  assert.match(lookback, /href="\.\.\/irmaa-calculator\/"[\s\S]*?Calculate the impact/);
  assert.match(lookback, /href="\.\.\/irmaa-planning-checklist\/"[\s\S]*?Act with a checklist/);
});

test("homepage and calculator expose revenue capture surfaces", async () => {
  for (const path of ["index.html", join("irmaa-calculator", "index.html")]) {
    const html = await readFile(join(root, path), "utf8");

    assert.match(html, /data-newsletter-form/);
    assert.match(html, /Get the IRMAA planning checklist/i);
    assert.match(html, /href="\.\/irmaa-planning-checklist\/"|href="\.\.\/irmaa-planning-checklist\/"/);
    assert.match(html, /Sponsor this placement/i);
    assert.match(html, /src\/profit\.js|\.\.\/src\/profit\.js/);
  }
});

test("every public page exposes the guide library in navigation", async () => {
  for (const [path] of pages) {
    const html = await readFile(join(root, path), "utf8");
    const guidesHref = path === "index.html" ? "./guides/" : "../guides/";

    assert.match(html, new RegExp(`<nav class="nav"[\\s\\S]*?href="${escapeRegExp(guidesHref)}"[\\s\\S]*?</nav>`), path);
  }
});

test("every public page exposes trust and contact links in the footer", async () => {
  for (const [path] of pages) {
    const html = await readFile(join(root, path), "utf8");
    const prefix = path === "index.html" ? "./" : "../";

    assert.match(html, new RegExp(`<footer class="site-footer"[\\s\\S]*?href="${escapeRegExp(prefix)}about/"`), path);
    assert.match(html, new RegExp(`<footer class="site-footer"[\\s\\S]*?href="${escapeRegExp(prefix)}privacy/"`), path);
    assert.match(html, new RegExp(`<footer class="site-footer"[\\s\\S]*?href="${escapeRegExp(prefix)}contact/"`), path);
  }
});

test("homepage routes visitors to the guide library before the long article grid", async () => {
  const html = await readFile(join(root, "index.html"), "utf8");
  const guideLinkIndex = html.indexOf('href="./guides/"');
  const calculatorIndex = html.indexOf('id="calculator"');

  assert.match(html, /Browse IRMAA guides/i);
  assert.ok(guideLinkIndex > 0 && guideLinkIndex < calculatorIndex);
});

test("calculator result cards answer Roth conversion room before the next IRMAA bracket", async () => {
  for (const path of [
    "index.html",
    join("irmaa-calculator", "index.html"),
    join("roth-conversion-irmaa-calculator", "index.html"),
    join("rmd-irmaa-calculator", "index.html"),
    join("home-sale-medicare-premium-calculator", "index.html"),
    join("capital-gains-irmaa-calculator", "index.html"),
    join("ira-withdrawal-medicare-premium-calculator", "index.html"),
    join("401k-withdrawal-medicare-premium-calculator", "index.html"),
  ]) {
    const html = await readFile(join(root, path), "utf8");

    assert.match(html, /Max Roth conversion before next bracket/i, path);
    assert.match(html, /data-result="roth-room"/, path);
  }
});

test("Roth conversion calculator includes a schedule worksheet and lead capture", async () => {
  const html = await readFile(join(root, "roth-conversion-irmaa-calculator", "index.html"), "utf8");

  assert.match(html, /Roth conversion schedule worksheet/i);
  assert.match(html, /data-roth-schedule/);
  assert.match(html, /data-roth-target-balance/);
  assert.match(html, /data-roth-schedule-result="planned-years"/);
  assert.match(html, /data-roth-schedule-result="fill-years"/);
  assert.match(html, /data-newsletter-form/);
  assert.match(html, /data-source="roth-schedule-worksheet"/);
});

test("calculator pages include spouse household impact controls and result cards", async () => {
  for (const path of [
    "index.html",
    join("irmaa-calculator", "index.html"),
    join("roth-conversion-irmaa-calculator", "index.html"),
    join("rmd-irmaa-calculator", "index.html"),
    join("home-sale-medicare-premium-calculator", "index.html"),
    join("capital-gains-irmaa-calculator", "index.html"),
    join("ira-withdrawal-medicare-premium-calculator", "index.html"),
    join("401k-withdrawal-medicare-premium-calculator", "index.html"),
  ]) {
    const html = await readFile(join(root, path), "utf8");

    assert.match(html, /name="coverageMode"/, path);
    assert.match(html, /Both spouses on Medicare/i, path);
    assert.match(html, /data-result="household-monthly"/, path);
    assert.match(html, /data-result="household-annual"/, path);
  }
});

test("calculator pages include premium year controls and income-year result cards", async () => {
  for (const path of [
    "index.html",
    join("irmaa-calculator", "index.html"),
    join("roth-conversion-irmaa-calculator", "index.html"),
    join("rmd-irmaa-calculator", "index.html"),
    join("home-sale-medicare-premium-calculator", "index.html"),
    join("capital-gains-irmaa-calculator", "index.html"),
    join("ira-withdrawal-medicare-premium-calculator", "index.html"),
    join("401k-withdrawal-medicare-premium-calculator", "index.html"),
  ]) {
    const html = await readFile(join(root, path), "utf8");

    assert.match(html, /name="premiumYear"/, path);
    assert.match(html, /2026 premiums \(uses 2024 MAGI\)/, path);
    assert.match(html, /2025 premiums \(uses 2023 MAGI\)/, path);
    assert.match(html, /data-result="income-year"/, path);
  }
});

test("calculator pages include a Medicare MAGI helper", async () => {
  for (const path of [
    "index.html",
    join("irmaa-calculator", "index.html"),
    join("roth-conversion-irmaa-calculator", "index.html"),
    join("rmd-irmaa-calculator", "index.html"),
    join("home-sale-medicare-premium-calculator", "index.html"),
    join("capital-gains-irmaa-calculator", "index.html"),
    join("ira-withdrawal-medicare-premium-calculator", "index.html"),
    join("401k-withdrawal-medicare-premium-calculator", "index.html"),
  ]) {
    const html = await readFile(join(root, path), "utf8");

    assert.match(html, /data-magi-helper/, path);
    assert.match(html, /data-magi-helper-input="agi"/, path);
    assert.match(html, /data-magi-helper-input="taxExemptInterest"/, path);
    assert.match(html, /data-magi-helper-input="taxableSocialSecurity"/, path);
    assert.match(html, /data-magi-helper-input="pensionOrConsulting"/, path);
    assert.match(html, /data-magi-helper-input="roth"/, path);
    assert.match(html, /data-magi-helper-input="rmd"/, path);
    assert.match(html, /data-magi-helper-input="gains"/, path);
    assert.match(html, /data-apply-magi-helper/, path);
  }
});

test("calculator pages include scenario comparison cards", async () => {
  for (const path of [
    "index.html",
    join("irmaa-calculator", "index.html"),
    join("roth-conversion-irmaa-calculator", "index.html"),
    join("rmd-irmaa-calculator", "index.html"),
    join("home-sale-medicare-premium-calculator", "index.html"),
    join("capital-gains-irmaa-calculator", "index.html"),
    join("ira-withdrawal-medicare-premium-calculator", "index.html"),
    join("401k-withdrawal-medicare-premium-calculator", "index.html"),
  ]) {
    const html = await readFile(join(root, path), "utf8");

    assert.match(html, /class="scenario-comparison"/, path);
    assert.match(html, /No added events/i, path);
    assert.match(html, /Planned events/i, path);
    assert.match(html, /Fill to bracket/i, path);
    assert.match(html, /data-scenario-result="baseline-magi"/, path);
    assert.match(html, /data-scenario-result="planned-monthly"/, path);
    assert.match(html, /data-scenario-result="fill-magi"/, path);
  }
});

test("calculator pages include result conversion actions", async () => {
  for (const path of [
    "index.html",
    join("irmaa-calculator", "index.html"),
    join("roth-conversion-irmaa-calculator", "index.html"),
    join("rmd-irmaa-calculator", "index.html"),
    join("home-sale-medicare-premium-calculator", "index.html"),
    join("capital-gains-irmaa-calculator", "index.html"),
    join("ira-withdrawal-medicare-premium-calculator", "index.html"),
    join("401k-withdrawal-medicare-premium-calculator", "index.html"),
  ]) {
    const html = await readFile(join(root, path), "utf8");

    assert.match(html, /class="result-action"/, path);
    assert.match(html, /data-result-action="title"/, path);
    assert.match(html, /data-result-action="copy"/, path);
    assert.match(html, /IRMAA planning checklist/i, path);
    assert.match(html, /data-track-event="result_checklist_click"/, path);
    assert.match(html, /data-track-event="result_sponsor_click"/, path);
    assert.match(html, /#sponsor-inquiry/, path);
  }
});

test("calculator pages include a visual IRMAA cliff meter", async () => {
  for (const path of [
    "index.html",
    join("irmaa-calculator", "index.html"),
    join("roth-conversion-irmaa-calculator", "index.html"),
    join("rmd-irmaa-calculator", "index.html"),
    join("home-sale-medicare-premium-calculator", "index.html"),
    join("capital-gains-irmaa-calculator", "index.html"),
    join("ira-withdrawal-medicare-premium-calculator", "index.html"),
    join("401k-withdrawal-medicare-premium-calculator", "index.html"),
  ]) {
    const html = await readFile(join(root, path), "utf8");

    assert.match(html, /class="cliff-meter"/, path);
    assert.match(html, /data-result="cliff-label"/, path);
    assert.match(html, /data-result="cliff-fill"/, path);
  }
});

test("profit tracking preserves UTM source context for outreach links", async () => {
  const js = await readFile(join(root, "src", "profit.js"), "utf8");

  assert.match(js, /getAttribution/);
  assert.match(js, /utm_source/);
  assert.match(js, /utm_campaign/);
  assert.match(js, /utm_medium/);
  assert.match(js, /calculator_context: \{\s*\.\.\.calculatorContext,\s*attribution,/);
  assert.match(js, /source: attribution\.source/);
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

test("advertise page gives sponsors a clear starter package and FAQ", async () => {
  const html = await readFile(join(root, "advertise", "index.html"), "utf8");

  assert.match(html, /Starter sponsor package/i);
  assert.match(html, /30-day pilot/i);
  assert.match(html, /Founding sponsor pilot/i);
  assert.match(html, /3 founding sponsor slots/i);
  assert.match(html, /No auto-renewal/i);
  assert.match(html, /30-day performance snapshot/i);
  assert.match(html, /Sponsor media kit/i);
  assert.match(html, /Audience context/i);
  assert.match(html, /Reporting available/i);
  assert.match(html, /Sponsor asset checklist/i);
  assert.match(html, /What sponsors provide/i);
  assert.match(html, /Sponsor FAQ/i);
  assert.match(html, /Do you publish medical or financial advice\?/i);
  assert.match(html, /href="#sponsor-inquiry"/);
});

test("mobile layout keeps the header out of the calculator viewport", async () => {
  const css = await readFile(join(root, "styles.css"), "utf8");

  assert.match(css, /@media \(max-width: 980px\)[\s\S]*\.site-header \{ position: static; \}/);
});

test("mobile navigation shows a compact unclipped route set", async () => {
  const css = await readFile(join(root, "styles.css"), "utf8");

  assert.match(css, /@media \(max-width: 680px\)[\s\S]*\.nav a:nth-child\(3\)[\s\S]*display: none/);
  assert.match(css, /@media \(max-width: 680px\)[\s\S]*\.nav \{[^}]*overflow-x: visible/);
});

test("editorial and civic heroes stay centered on desktop", async () => {
  const css = await readFile(join(root, "styles.css"), "utf8");

  assert.match(css, /\.editorial-hero \{[^}]*margin: 0 auto;/);
  assert.match(css, /\.civic-hero \{[^}]*margin: 0 auto;/);
});

test("all shared page containers stay centered", async () => {
  const css = await readFile(join(root, "styles.css"), "utf8");

  assert.ok(selectorHasDeclaration(css, ".header-inner, .section, .hero, .footer-inner, .ad-slot-sponsor, .ad-slot-leaderboard", "margin: 0 auto"));
  assert.ok(selectorHasDeclaration(css, ".civic-hero", "margin: 0 auto"));
  assert.ok(selectorHasDeclaration(css, ".civic-shell", "margin: 0 auto 56px"));
  assert.ok(selectorHasDeclaration(css, ".editorial-hero", "margin: 0 auto"));
  assert.ok(selectorHasDeclaration(css, ".editorial-shell", "margin: 0 auto 60px"));
  assert.ok(selectorHasDeclaration(css, ".article", "margin: 0 auto"));
});

test("every public page uses a known centered page layout", async () => {
  for (const [path] of pages) {
    const html = await readFile(join(root, path), "utf8");

    assert.match(
      html,
      /class="[^"]*(?:layout-guided-planner|layout-civic-utility|layout-editorial-guide)[^"]*"/,
      path,
    );
    assert.match(
      html,
      /class="[^"]*(?:hero|section|civic-hero|editorial-hero|editorial-shell|civic-shell|article)[^"]*"/,
      path,
    );
  }
});

test("bracket page uses the calm civic utility layout with quiet ad inventory", async () => {
  const html = await readFile(join(root, "irmaa-brackets-2026", "index.html"), "utf8");

  assert.match(html, /class="[^"]*layout-civic-utility/);
  assert.match(html, /ad-slot ad-slot-leaderboard/);
  assert.match(html, /ad-slot ad-slot-rail/);
});

test("bracket page targets 2026 bracket search intent with answer block and jump links", async () => {
  const html = await readFile(join(root, "irmaa-brackets-2026", "index.html"), "utf8");

  assert.match(html, /id="quick-answer"/);
  assert.match(html, /2026 IRMAA uses 2024 Medicare MAGI/i);
  assert.match(html, /href="#single-brackets"/);
  assert.match(html, /href="#joint-brackets"/);
  assert.match(html, /href="#separate-brackets"/);
  assert.match(html, /href="#part-b-irmaa-2026"/);
  assert.match(html, /href="#part-d-irmaa-2026"/);
  assert.match(html, /Married filing separately/i);
  assert.match(html, /Part B IRMAA 2026/i);
  assert.match(html, /Part D IRMAA 2026/i);
  assert.match(html, /Medicare IRMAA brackets 2026/i);
  assert.match(html, /IRMAA thresholds 2026/i);
  assert.match(html, /data-track-label="brackets inline sponsor"/);
  assert.match(html, /data-track-label="brackets table sponsor"/);
});

test("educational article pages use the editorial guide layout with related guides and ads", async () => {
  const html = await readFile(join(root, "medicare-magi", "index.html"), "utf8");

  assert.match(html, /class="[^"]*layout-editorial-guide/);
  assert.match(html, /Related guides/);
  assert.match(html, /ad-slot ad-slot-rail/);
  assert.match(html, /ad-slot ad-slot-inline/);
});

test("high-intent education pages route readers to the planning checklist lead magnet", async () => {
  const articleRoutes = [
    "medicare-magi",
    "what-is-irmaa",
    "how-to-avoid-irmaa",
    "irmaa-appeal-ssa-44-form",
    "does-roth-conversion-affect-irmaa",
    "do-capital-gains-affect-medicare-premiums",
    "do-rmds-affect-medicare-premiums",
    "do-ira-withdrawals-affect-medicare-premiums",
    "does-selling-a-house-affect-medicare-premiums",
    "medicare-part-b-premium-2026",
  ];

  for (const route of articleRoutes) {
    const html = await readFile(join(root, route, "index.html"), "utf8");

    assert.match(html, /href="\.\.\/irmaa-planning-checklist\/"/, route);
    assert.match(html, /IRMAA planning checklist/i, route);
  }
});

test("Medicare MAGI page targets modified adjusted gross income and income-count questions", async () => {
  const html = await readFile(join(root, "medicare-magi", "index.html"), "utf8");

  assert.match(html, /Medicare modified adjusted gross income/i);
  assert.match(html, /AGI \+ tax-exempt interest/i);
  assert.match(html, /Does Social Security count toward IRMAA\?/i);
  assert.match(html, /Do capital gains count for IRMAA\?/i);
  assert.match(html, /Do qualified Roth IRA withdrawals count for IRMAA\?/i);
  assert.match(html, /Tax-exempt interest/i);
  assert.match(html, /Estimate your surcharge/i);
});

test("SSA-44 appeal page targets appeal form terms without weakening one-time income warnings", async () => {
  const html = await readFile(join(root, "irmaa-appeal-ssa-44-form", "index.html"), "utf8");

  assert.match(html, /SSA Form 44/i);
  assert.match(html, /IRMAA appeal form/i);
  assert.match(html, /When SSA-44 may apply/i);
  assert.match(html, /When SSA-44 usually will not fix IRMAA/i);
  assert.match(html, /Work stoppage or work reduction/i);
  assert.match(html, /death of a spouse/i);
  assert.match(html, /one-time income spike/i);
  assert.match(html, /Roth conversions, capital gains, and home sales generally do not qualify/i);
});

test("Roth conversion article targets longtail query and routes readers to calculator", async () => {
  const html = await readFile(join(root, "does-roth-conversion-affect-irmaa", "index.html"), "utf8");

  assert.match(html, /A taxable Roth conversion can raise Medicare MAGI/i);
  assert.match(html, /How much can you convert before IRMAA\?/i);
  assert.match(html, /Can you appeal IRMAA after a Roth conversion\?/i);
  assert.match(html, /Roth conversion IRMAA FAQ/i);
  assert.match(html, /href="\.\.\/roth-conversion-irmaa-calculator\/"/);
  assert.match(html, /ad-slot ad-slot-inline/);
  assert.match(html, /src\/profit\.js|\.\.\/src\/profit\.js/);
});

test("capital gains article targets premium-impact query and routes readers to calculator", async () => {
  const html = await readFile(join(root, "do-capital-gains-affect-medicare-premiums", "index.html"), "utf8");

  assert.match(html, /Taxable capital gains can raise Medicare MAGI/i);
  assert.match(html, /Why capital gains can trigger IRMAA/i);
  assert.match(html, /Can selling stock affect Medicare premiums\?/i);
  assert.match(html, /Capital gains and IRMAA FAQ/i);
  assert.match(html, /href="\.\.\/capital-gains-irmaa-calculator\/"/);
  assert.match(html, /ad-slot ad-slot-inline/);
  assert.match(html, /src\/profit\.js|\.\.\/src\/profit\.js/);
});

test("RMD article targets premium-impact query and routes readers to calculator", async () => {
  const html = await readFile(join(root, "do-rmds-affect-medicare-premiums", "index.html"), "utf8");

  assert.match(html, /RMDs can affect Medicare premiums/i);
  assert.match(html, /Why RMDs can trigger IRMAA/i);
  assert.match(html, /required minimum distribution/i);
  assert.match(html, /RMD and IRMAA FAQ/i);
  assert.match(html, /href="\.\.\/rmd-irmaa-calculator\/"/);
  assert.match(html, /ad-slot ad-slot-inline/);
  assert.match(html, /src\/profit\.js|\.\.\/src\/profit\.js/);
});

test("IRA withdrawal article targets premium-impact query and routes readers to calculator", async () => {
  const html = await readFile(join(root, "do-ira-withdrawals-affect-medicare-premiums", "index.html"), "utf8");

  assert.match(html, /IRA withdrawals can affect Medicare premiums/i);
  assert.match(html, /taxable IRA withdrawal/i);
  assert.match(html, /traditional IRA distribution/i);
  assert.match(html, /IRA withdrawal and IRMAA FAQ/i);
  assert.match(html, /href="\.\.\/ira-withdrawal-medicare-premium-calculator\/"/);
  assert.match(html, /href="\.\.\/irmaa-planning-checklist\/"/);
  assert.match(html, /ad-slot ad-slot-inline/);
  assert.match(html, /src\/profit\.js|\.\.\/src\/profit\.js/);
});

test("home sale article targets premium-impact query and routes readers to calculator", async () => {
  const html = await readFile(join(root, "does-selling-a-house-affect-medicare-premiums", "index.html"), "utf8");

  assert.match(html, /Selling a house can affect Medicare premiums/i);
  assert.match(html, /taxable gain, not the sale price/i);
  assert.match(html, /Can you appeal IRMAA after selling a house\?/i);
  assert.match(html, /Home sale and IRMAA FAQ/i);
  assert.match(html, /href="\.\.\/home-sale-medicare-premium-calculator\/"/);
  assert.match(html, /ad-slot ad-slot-inline/);
  assert.match(html, /src\/profit\.js|\.\.\/src\/profit\.js/);
});

test("avoid IRMAA page targets prevention queries with planning sections and sponsor placement", async () => {
  const html = await readFile(join(root, "how-to-avoid-irmaa", "index.html"), "utf8");

  assert.match(html, /How to avoid IRMAA surprises/i);
  assert.match(html, /id="planning-checklist"/);
  assert.match(html, /Roth conversions/i);
  assert.match(html, /Required minimum distributions/i);
  assert.match(html, /Capital gains/i);
  assert.match(html, /Qualified charitable distributions/i);
  assert.match(html, /Tax-exempt interest/i);
  assert.match(html, /href="\.\.\/does-roth-conversion-affect-irmaa\/"/);
  assert.match(html, /href="\.\.\/do-rmds-affect-medicare-premiums\/"/);
  assert.match(html, /href="\.\.\/do-capital-gains-affect-medicare-premiums\/"/);
  assert.match(html, /href="\.\.\/qcd-irmaa\/"/);
  assert.match(html, /data-track-label="avoid planning sponsor"/);
  assert.match(html, /data-newsletter-form/);
  assert.match(html, /src\/profit\.js|\.\.\/src\/profit\.js/);
});

test("what is IRMAA page explains the basics and routes readers into monetized flows", async () => {
  const html = await readFile(join(root, "what-is-irmaa", "index.html"), "utf8");

  assert.match(html, /Income-Related Monthly Adjustment Amount/i);
  assert.match(html, /Medicare Part B/i);
  assert.match(html, /Medicare Part D/i);
  assert.match(html, /two-year lookback/i);
  assert.match(html, /2026 IRMAA brackets/i);
  assert.match(html, /Medicare MAGI/i);
  assert.match(html, /SSA-44/i);
  assert.match(html, /href="\.\.\/irmaa-calculator\/"/);
  assert.match(html, /href="\.\.\/irmaa-brackets-2026\/"/);
  assert.match(html, /href="\.\.\/medicare-magi\/"/);
  assert.match(html, /href="\.\.\/irmaa-appeal-ssa-44-form\/"/);
  assert.match(html, /data-track-label="what is irmaa sponsor"/);
  assert.match(html, /data-newsletter-form/);
  assert.match(html, /src\/profit\.js|\.\.\/src\/profit\.js/);
});

test("Part B premium page targets 2026 premium search and routes to IRMAA conversion surfaces", async () => {
  const html = await readFile(join(root, "medicare-part-b-premium-2026", "index.html"), "utf8");

  assert.match(html, /standard Medicare Part B premium is \$202\.90/i);
  assert.match(html, /Part B deductible is \$283/i);
  assert.match(html, /higher depending on your income/i);
  assert.match(html, /IRMAA/i);
  assert.match(html, /Medicare MAGI/i);
  assert.match(html, /2026 IRMAA brackets/i);
  assert.match(html, /href="\.\.\/irmaa-calculator\/"/);
  assert.match(html, /href="\.\.\/irmaa-brackets-2026\/"/);
  assert.match(html, /href="\.\.\/medicare-magi\/"/);
  assert.match(html, /data-track-label="part b premium sponsor"/);
  assert.match(html, /data-newsletter-form/);
  assert.match(html, /Official sources/i);
  assert.match(html, /src\/profit\.js|\.\.\/src\/profit\.js/);
});

test("planning checklist page creates a lead magnet for newsletter and sponsor conversion", async () => {
  const html = await readFile(join(root, "irmaa-planning-checklist", "index.html"), "utf8");

  assert.match(html, /IRMAA Planning Checklist/i);
  assert.match(html, /Before a Roth conversion/i);
  assert.match(html, /Before an RMD/i);
  assert.match(html, /Before a capital gain/i);
  assert.match(html, /Before selling a home/i);
  assert.match(html, /Before relying on SSA-44/i);
  assert.match(html, /data-newsletter-form/);
  assert.match(html, /Get the checklist updates/i);
  assert.match(html, /data-track-label="checklist sponsor"/);
  assert.match(html, /href="\.\.\/irmaa-calculator\/"/);
  assert.match(html, /href="\.\.\/how-to-avoid-irmaa\/"/);
  assert.match(html, /src\/profit\.js|\.\.\/src\/profit\.js/);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("every public page includes a relevant content image with alt text", async () => {
  for (const [path] of pages) {
    const html = await readFile(join(root, path), "utf8");

    assert.match(html, /<img[^>]+class="[^"]*page-visual-image[^"]*"[^>]+alt="[^"]+"/, path);
    assert.match(html, /<img[^>]+class="[^"]*page-visual-image[^"]*"[^>]+src="[^"]+\.webp"/, path);
    if (path === "index.html") {
      assert.match(html, /<img[^>]+class="[^"]*page-visual-image[^"]*"[^>]+fetchpriority="high"/, path);
    } else {
      assert.match(html, /<img[^>]+class="[^"]*page-visual-image[^"]*"[^>]+loading="lazy"/, path);
    }
  }
});

async function collectPublicPages(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    if (entry.name === "_initial-vite-scaffold-backup") continue;

    const entryPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      pages.push(...(await collectPublicPages(entryPath, base)));
      continue;
    }

    if (entry.name === "index.html") {
      pages.push(normalizePath(entryPath.slice(base.length + 1)));
    }
  }

  return pages.sort();
}

function normalizePath(path) {
  return path.replaceAll("\\", "/");
}

function selectorHasDeclaration(css, selector, declaration) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedDeclaration = declaration.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return new RegExp(`${escapedSelector}\\s*\\{[^}]*${escapedDeclaration}`).test(css);
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

test("homepage exposes article links for organic discovery", async () => {
  const html = await readFile(join(root, "index.html"), "utf8");

  for (const route of [
    "does-roth-conversion-affect-irmaa",
    "do-capital-gains-affect-medicare-premiums",
    "do-rmds-affect-medicare-premiums",
    "do-ira-withdrawals-affect-medicare-premiums",
    "does-selling-a-house-affect-medicare-premiums",
    "medicare-part-b-premium-2026",
    "irmaa-planning-checklist",
    "irmaa-two-year-lookback",
    "irmaa-cliff",
    "ways-to-reduce-irmaa",
    "medicare-magi-vs-aca-magi",
    "what-counts-toward-irmaa-magi",
    "do-both-spouses-pay-irmaa",
    "ssa-44-irmaa-appeal-timing-checker",
    "does-401k-contribution-reduce-irmaa-magi",
    "does-social-security-count-toward-irmaa",
    "one-time-income-spike-irmaa",
    "how-long-does-irmaa-last",
    "widow-penalty-irmaa",
    "municipal-bond-interest-irmaa",
    "backdoor-roth-irmaa",
  ]) {
    assert.match(html, new RegExp(`href="\\./${route}/"`), route);
  }
});

test("IRMAA MAGI checklist tool answers income-count questions and routes to conversion surfaces", async () => {
  const html = await readFile(join(root, "what-counts-toward-irmaa-magi", "index.html"), "utf8");

  assert.match(html, /What Counts Toward IRMAA MAGI\?/i);
  assert.match(html, /AGI \+ tax-exempt interest/i);
  assert.match(html, /Roth conversions/i);
  assert.match(html, /RMDs/i);
  assert.match(html, /qualified Roth IRA withdrawals/i);
  assert.match(html, /municipal bond interest/i);
  assert.match(html, /data-newsletter-form/);
  assert.match(html, /IRMAA planning checklist/i);
  assert.match(html, /href="\.\.\/irmaa-calculator\/"/);
  assert.match(html, /href="\.\.\/advertise\/#sponsor-inquiry"/);
  assert.match(html, /Advertisement/i);
});

test("married-couple IRMAA page explains per-person surcharge and spouse planning", async () => {
  const html = await readFile(join(root, "do-both-spouses-pay-irmaa", "index.html"), "utf8");

  assert.match(html, /Do Both Spouses Pay IRMAA\?/i);
  assert.match(html, /per Medicare enrollee/i);
  assert.match(html, /joint tax return/i);
  assert.match(html, /one spouse is not on Medicare/i);
  assert.match(html, /Both spouses on Medicare/i);
  assert.match(html, /separate SSA-44/i);
  assert.match(html, /data-newsletter-form/);
  assert.match(html, /href="\.\.\/irmaa-calculator\/"/);
  assert.match(html, /href="\.\.\/advertise\/#sponsor-inquiry"/);
});

test("guide library makes the article collection easy to browse", async () => {
  const html = await readFile(join(root, "guides", "index.html"), "utf8");

  assert.match(html, /Start here/i);
  assert.match(html, /Income decisions/i);
  assert.match(html, /Appeals and special situations/i);
  assert.match(html, /What counts toward IRMAA MAGI\?/i);
  assert.match(html, /Do both spouses pay IRMAA\?/i);
  assert.match(html, /Does a Roth conversion affect IRMAA\?/i);
  assert.match(html, /SSA-44 appeal timing checker/i);
  assert.match(html, /data-newsletter-form/);
  assert.match(html, /href="\.\.\/irmaa-calculator\/"/);
});

test("guide library prominently routes visitors into interactive planning tools", async () => {
  const html = await readFile(join(root, "guides", "index.html"), "utf8");
  const toolsIndex = html.indexOf("Interactive IRMAA planning tools");
  const startHereIndex = html.indexOf("Start here");

  assert.ok(toolsIndex > 0 && toolsIndex < startHereIndex);
  assert.match(html, /href="\.\.\/irmaa-calculator\/"/);
  assert.match(html, /href="\.\.\/roth-conversion-irmaa-calculator\/"/);
  assert.match(html, /href="\.\.\/rmd-irmaa-calculator\/"/);
  assert.match(html, /href="\.\.\/capital-gains-irmaa-calculator\/"/);
  assert.match(html, /href="\.\.\/home-sale-medicare-premium-calculator\/"/);
  assert.match(html, /href="\.\.\/ssa-44-irmaa-appeal-timing-checker\/"/);
});

test("Reddit pain point pages answer SSA-44 timing, 401k MAGI, and backdoor Roth questions", async () => {
  const ssa44 = await readFile(join(root, "ssa-44-irmaa-appeal-timing-checker", "index.html"), "utf8");
  const k401 = await readFile(join(root, "does-401k-contribution-reduce-irmaa-magi", "index.html"), "utf8");
  const backdoor = await readFile(join(root, "backdoor-roth-irmaa", "index.html"), "utf8");

  assert.match(ssa44, /received an IRMAA notice/i);
  assert.match(ssa44, /both spouses/i);
  assert.match(ssa44, /data-ssa44-tool/);
  assert.match(ssa44, /data-ssa44-next-steps/);
  assert.match(ssa44, /Next steps/i);
  assert.match(ssa44, /official SSA-44 form/i);
  assert.match(ssa44, /src\/ssa44-tool\.js|\.\.\/src\/ssa44-tool\.js/);
  assert.match(k401, /pre-tax 401\(k\) contribution/i);
  assert.match(k401, /Medicare Part B and Part D/i);
  assert.match(k401, /AGI \+ tax-exempt interest/i);
  assert.match(backdoor, /properly executed backdoor Roth/i);
  assert.match(backdoor, /pro-rata rule/i);
  assert.match(backdoor, /taxable amount/i);
});

test("Social Security IRMAA page explains taxable benefits without double-counting gross benefits", async () => {
  const html = await readFile(join(root, "does-social-security-count-toward-irmaa", "index.html"), "utf8");

  assert.match(html, /Social Security can matter for IRMAA when part of the benefit is taxable/i);
  assert.match(html, /IRMAA Medicare MAGI = AGI \+ tax-exempt interest/i);
  assert.match(html, /nontaxable portion/i);
  assert.match(html, /Adding all gross Social Security benefits on top of AGI/i);
  assert.match(html, /href="\.\.\/irmaa-calculator\/"/);
  assert.match(html, /href="\.\.\/medicare-magi\/"/);
  assert.match(html, /data-track|src\/profit\.js|\.\.\/src\/profit\.js/);
});

test("one-time income spike page routes users to calculator and SSA-44 guidance", async () => {
  const html = await readFile(join(root, "one-time-income-spike-irmaa", "index.html"), "utf8");

  assert.match(html, /One-Time Income Spike and IRMAA/i);
  assert.match(html, /Roth conversion/i);
  assert.match(html, /home sale/i);
  assert.match(html, /capital gain/i);
  assert.match(html, /SSA-44/i);
  assert.match(html, /life-changing event/i);
  assert.match(html, /href="\.\.\/irmaa-calculator\/"/);
  assert.match(html, /href="\.\.\/irmaa-appeal-ssa-44-form\/"/);
  assert.match(html, /ad-slot ad-slot-inline/);
  assert.match(html, /src\/profit\.js|\.\.\/src\/profit\.js/);
});

test("IRMAA duration guide explains annual recalculation, corrections, and refunds", async () => {
  const html = await readFile(join(root, "how-long-does-irmaa-last", "index.html"), "utf8");

  assert.match(html, /How Long Does IRMAA Last\?/i);
  assert.match(html, /not automatically permanent/i);
  assert.match(html, /effective year/i);
  assert.match(html, /determined again/i);
  assert.match(html, /retroactive adjustment/i);
  assert.match(html, /amended tax return/i);
  assert.match(html, /new initial determination/i);
  assert.match(html, /href="\.\.\/ssa-44-irmaa-appeal-timing-checker\/"/);
  assert.match(html, /href="\.\.\/irmaa-planning-checklist\/"/);
  assert.match(html, /data-newsletter-form/);
  assert.match(html, /href="\.\.\/advertise\/#sponsor-inquiry"/);
});

test("widow penalty guide explains filing-status changes and appeal routing", async () => {
  const html = await readFile(join(root, "widow-penalty-irmaa", "index.html"), "utf8");

  assert.match(html, /Widow Penalty and IRMAA/i);
  assert.match(html, /single-filer IRMAA thresholds/i);
  assert.match(html, /death of a spouse/i);
  assert.match(html, /life-changing event/i);
  assert.match(html, /year of death/i);
  assert.match(html, /qualifying surviving spouse/i);
  assert.match(html, /inherited retirement income/i);
  assert.match(html, /href="\.\.\/ssa-44-irmaa-appeal-timing-checker\/"/);
  assert.match(html, /href="\.\.\/irmaa-calculator\/"/);
  assert.match(html, /data-newsletter-form/);
  assert.match(html, /href="\.\.\/advertise\/#sponsor-inquiry"/);
});

test("municipal bond guide explains why tax-exempt interest counts for IRMAA", async () => {
  const html = await readFile(join(root, "municipal-bond-interest-irmaa", "index.html"), "utf8");

  assert.match(html, /Municipal Bond Interest and IRMAA/i);
  assert.match(html, /tax-exempt interest/i);
  assert.match(html, /AGI \+ tax-exempt interest/i);
  assert.match(html, /tax-free does not mean IRMAA-free/i);
  assert.match(html, /Form 1040/i);
  assert.match(html, /href="\.\.\/what-counts-toward-irmaa-magi\/"/);
  assert.match(html, /href="\.\.\/irmaa-calculator\/"/);
  assert.match(html, /data-newsletter-form/);
  assert.match(html, /href="\.\.\/advertise\/#sponsor-inquiry"/);
});

test("transcript-inspired education pages are original easy-read IRMAA explainers", async () => {
  const expectations = [
    ["irmaa-two-year-lookback", /income you report this year can affect Medicare premiums two years later/i, /age 63/i],
    ["irmaa-cliff", /one dollar over an IRMAA threshold can move the whole month into the next surcharge tier/i, /Do not stop just over a bracket/i],
    ["ways-to-reduce-irmaa", /ways to reduce IRMAA surprises/i, /qualified charitable distribution/i],
    ["medicare-magi-vs-aca-magi", /Medicare MAGI and ACA MAGI are not always the same planning number/i, /health insurance marketplace/i],
  ];

  for (const [route, firstPattern, secondPattern] of expectations) {
    const html = await readFile(join(root, route, "index.html"), "utf8");

    assert.match(html, firstPattern, route);
    assert.match(html, secondPattern, route);
    assert.match(html, /href="\.\.\/irmaa-calculator\/"/, route);
    assert.match(html, /href="\.\.\/irmaa-planning-checklist\/"/, route);
    assert.match(html, /ad-slot ad-slot-inline/, route);
    assert.match(html, /src\/profit\.js|\.\.\/src\/profit\.js/, route);
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
