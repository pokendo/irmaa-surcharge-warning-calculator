import assert from "node:assert/strict";
import test from "node:test";

import * as app from "./app.js";

const {
  applyDefaultEvent,
  applyMagiHelperValues,
  applyQueryParams,
  buildCalculatorQuery,
  buildShareUrl,
  buildResultAction,
  calculateMagiHelperPlannedEvents,
  calculateMagiHelperTotal,
  copyShareUrl,
  getCoreShareValues,
  parseCalculatorQuery,
  renderPrintDetails,
  updateResultActionNodes,
  updateMagiHelperTotalNode,
  updateSummaryNode,
  buildPrintDetails,
  calculateCliffMeter,
  calculateMaxRothConversionBeforeNextBracket,
  calculateHouseholdImpact,
  getCoverageMultiplier,
  updateRothRoomNode,
} = app;

test("applyDefaultEvent checks only the matching scenario event", () => {
  const events = [
    { key: "roth", checked: false },
    { key: "rmd", checked: true },
    { key: "home", checked: true },
  ];

  applyDefaultEvent(events, "roth");

  assert.deepEqual(events, [
    { key: "roth", checked: true },
    { key: "rmd", checked: false },
    { key: "home", checked: false },
  ]);
});

test("applyDefaultEvent leaves events alone when no default is provided", () => {
  const events = [{ key: "roth", checked: false }];

  applyDefaultEvent(events, "");

  assert.deepEqual(events, [{ key: "roth", checked: false }]);
});

test("updateSummaryNode writes the plain-English calculator summary", () => {
  const node = { textContent: "" };

  updateSummaryNode(node, {
    bracket: { name: "First IRMAA bracket" },
    monthlySurcharge: 95.7,
    annualSurcharge: 1148.4,
    roomBeforeNextBracket: 24_000,
  });

  assert.equal(
    node.textContent,
    "Your estimated Medicare MAGI is in the First IRMAA bracket for 2026. This adds about $95.70 per month, or $1,148 per year, before any plan premium. You have about $24,000 before the next bracket.",
  );
});

test("buildResultAction prompts checklist capture when no surcharge is estimated", () => {
  assert.deepEqual(
    buildResultAction({ monthlySurcharge: 0, roomBeforeNextBracket: 4_000 }),
    {
      title: "Stay under the next bracket",
      copy: "You have about $4,000 before the first surcharge bracket. Save the planning checklist before a Roth conversion, RMD, capital gain, or home sale changes the estimate.",
    },
  );
});

test("buildResultAction prompts review when a surcharge is estimated", () => {
  assert.deepEqual(
    buildResultAction({ monthlySurcharge: 95.7, roomBeforeNextBracket: 24_000 }),
    {
      title: "Review before you lock this in",
      copy: "This estimate shows about $95.70 per month in IRMAA. Use the checklist before the tax-year decision becomes hard to unwind.",
    },
  );
});

test("updateResultActionNodes writes the result action copy", () => {
  const nodes = {
    title: { textContent: "" },
    copy: { textContent: "" },
  };

  updateResultActionNodes(nodes, {
    title: "Review before you lock this in",
    copy: "Use the checklist before the tax-year decision becomes hard to unwind.",
  });

  assert.equal(nodes.title.textContent, "Review before you lock this in");
  assert.equal(nodes.copy.textContent, "Use the checklist before the tax-year decision becomes hard to unwind.");
});

test("calculateMaxRothConversionBeforeNextBracket adds current Roth amount to remaining bracket room", () => {
  assert.equal(
    calculateMaxRothConversionBeforeNextBracket({ roomBeforeNextBracket: 24_000 }, 8_000),
    32_000,
  );
});

test("calculateMaxRothConversionBeforeNextBracket returns null in the top bracket", () => {
  assert.equal(
    calculateMaxRothConversionBeforeNextBracket({ roomBeforeNextBracket: null }, 8_000),
    null,
  );
});

test("updateRothRoomNode writes a high-intent Roth conversion result", () => {
  const node = { textContent: "" };

  updateRothRoomNode(node, { roomBeforeNextBracket: 24_000 }, 8_000);

  assert.equal(node.textContent, "$32,000");
});

test("getCoverageMultiplier doubles household impact only when both spouses are on Medicare", () => {
  assert.equal(getCoverageMultiplier("one"), 1);
  assert.equal(getCoverageMultiplier("two"), 2);
  assert.equal(getCoverageMultiplier("bad"), 1);
});

test("calculateHouseholdImpact returns household monthly and annual surcharge estimates", () => {
  assert.deepEqual(
    calculateHouseholdImpact({ monthlySurcharge: 95.7 }, "two"),
    { coverageMultiplier: 2, householdMonthlySurcharge: 191.4, householdAnnualSurcharge: 2296.8 },
  );
});

test("calculateScenarioComparison compares baseline, planned events, and fill-to-bracket scenarios", () => {
  assert.equal(typeof app.calculateScenarioComparison, "function");

  const comparison = app.calculateScenarioComparison({
    premiumYear: 2026,
    filingStatus: "single",
    baseMagi: 105_000,
    events: [{ label: "Roth conversion", amount: 8_000, active: true }],
  });

  assert.deepEqual(comparison.baseline, {
    label: "Baseline",
    magi: 105_000,
    monthlySurcharge: 0,
    annualSurcharge: 0,
  });
  assert.deepEqual(comparison.planned, {
    label: "Planned",
    magi: 113_000,
    monthlySurcharge: 95.7,
    annualSurcharge: 1148.4,
  });
  assert.deepEqual(comparison.fillToBracket, {
    label: "Fill to bracket",
    magi: 137_000,
    monthlySurcharge: 95.7,
    annualSurcharge: 1148.4,
  });
});

test("updateScenarioComparisonNodes writes comparison card values", () => {
  assert.equal(typeof app.updateScenarioComparisonNodes, "function");

  const nodes = {
    baselineMagi: { textContent: "" },
    baselineMonthly: { textContent: "" },
    plannedMagi: { textContent: "" },
    plannedMonthly: { textContent: "" },
    fillMagi: { textContent: "" },
    fillMonthly: { textContent: "" },
  };

  app.updateScenarioComparisonNodes(nodes, {
    baseline: { magi: 105_000, monthlySurcharge: 0 },
    planned: { magi: 113_000, monthlySurcharge: 95.7 },
    fillToBracket: { magi: 137_000, monthlySurcharge: 95.7 },
  });

  assert.equal(nodes.baselineMagi.textContent, "$105,000");
  assert.equal(nodes.baselineMonthly.textContent, "$0.00/mo");
  assert.equal(nodes.plannedMagi.textContent, "$113,000");
  assert.equal(nodes.plannedMonthly.textContent, "$95.70/mo");
  assert.equal(nodes.fillMagi.textContent, "$137,000");
  assert.equal(nodes.fillMonthly.textContent, "$95.70/mo");
});

test("calculateMagiHelperTotal builds base Medicare MAGI components", () => {
  assert.equal(
    calculateMagiHelperTotal({
      agi: 90_000,
      taxExemptInterest: 2_500,
      taxableSocialSecurity: 12_000,
      pensionOrConsulting: 7_500,
      roth: 30_000,
    }),
    112_000,
  );
});

test("calculateMagiHelperPlannedEvents normalizes event amounts", () => {
  assert.deepEqual(
    calculateMagiHelperPlannedEvents({ roth: "30000", rmd: "-10", gains: "12500" }),
    { roth: 30_000, rmd: 0, gains: 12_500 },
  );
});

test("updateMagiHelperTotalNode writes the helper total", () => {
  const totalNode = { textContent: "" };
  const helper = {
    querySelector(selector) {
      return selector === "[data-magi-helper-total]" ? totalNode : null;
    },
    querySelectorAll() {
      return [
        { dataset: { magiHelperInput: "agi" }, value: "90000" },
        { dataset: { magiHelperInput: "taxExemptInterest" }, value: "2500" },
      ];
    },
  };

  updateMagiHelperTotalNode(helper);

  assert.equal(totalNode.textContent, "$92,500");
});

test("applyMagiHelperValues fills base MAGI and planned event rows", () => {
  const baseMagi = { value: "0" };
  const eventRows = {
    roth: { checkbox: { checked: false }, amount: { value: "0" } },
    rmd: { checkbox: { checked: true }, amount: { value: "100" } },
    gains: { checkbox: { checked: false }, amount: { value: "0" } },
  };
  const form = {
    querySelector(selector) {
      if (selector === "[name='baseMagi']") return baseMagi;
      const eventKey = selector.match(/data-event-key='([^']+)'/)?.[1];
      const event = eventRows[eventKey];
      if (!event) return null;
      event.checkbox.closest = () => ({ querySelector: () => event.amount });
      return event.checkbox;
    },
  };
  const helper = {
    querySelectorAll() {
      return [
        { dataset: { magiHelperInput: "agi" }, value: "90000" },
        { dataset: { magiHelperInput: "taxExemptInterest" }, value: "2500" },
        { dataset: { magiHelperInput: "roth" }, value: "30000" },
        { dataset: { magiHelperInput: "rmd" }, value: "0" },
        { dataset: { magiHelperInput: "gains" }, value: "12500" },
      ];
    },
  };

  applyMagiHelperValues(form, helper);

  assert.equal(baseMagi.value, "92500");
  assert.equal(eventRows.roth.checkbox.checked, true);
  assert.equal(eventRows.roth.amount.value, "30000");
  assert.equal(eventRows.rmd.checkbox.checked, false);
  assert.equal(eventRows.gains.checkbox.checked, true);
  assert.equal(eventRows.gains.amount.value, "12500");
});

test("calculateCliffMeter shows progress toward the first surcharge bracket", () => {
  assert.deepEqual(
    calculateCliffMeter({
      totalMagi: 105_000,
      monthlySurcharge: 0,
      bracket: { min: 0 },
      nextThreshold: 109_000,
      roomBeforeNextBracket: 4_000,
    }),
    {
      percent: 96,
      label: "96% of the way to the first surcharge bracket",
      detail: "$4,000 before the first surcharge bracket",
    },
  );
});

test("calculateCliffMeter shows top bracket status", () => {
  assert.deepEqual(
    calculateCliffMeter({
      totalMagi: 800_000,
      monthlySurcharge: 578,
      bracket: { min: 750_000 },
      nextThreshold: null,
      roomBeforeNextBracket: null,
    }),
    {
      percent: 100,
      label: "Top IRMAA bracket",
      detail: "No higher IRMAA bracket remains.",
    },
  );
});

test("buildPrintDetails creates a concise decision record", () => {
  const details = buildPrintDetails({
    premiumYear: 2026,
    incomeYear: 2024,
    filingStatus: "single",
    baseMagi: 105_000,
    eventTotal: 8_000,
    totalMagi: 113_000,
    bracket: { name: "First IRMAA bracket" },
    monthlySurcharge: 95.7,
    annualSurcharge: 1148.4,
  });

  assert.deepEqual(details, [
    ["Premium year", "2026"],
    ["Income year used", "2024"],
    ["Filing status", "Single"],
    ["Base Medicare MAGI", "$105,000"],
    ["Added income events", "$8,000"],
    ["Estimated Medicare MAGI", "$113,000"],
    ["Estimated bracket", "First IRMAA bracket"],
    ["Estimated monthly surcharge", "$95.70"],
    ["Estimated annual surcharge", "$1,148"],
    ["Source review date", "May 18, 2026"],
  ]);
});


test("renderPrintDetails writes definition-list rows", () => {
  const node = { innerHTML: "" };

  renderPrintDetails(node, [
    ["Filing status", "Single"],
    ["Estimated Medicare MAGI", "$113,000"],
  ]);

  assert.equal(
    node.innerHTML,
    "<div><dt>Filing status</dt><dd>Single</dd></div><div><dt>Estimated Medicare MAGI</dt><dd>$113,000</dd></div>",
  );
});

test("parseCalculatorQuery reads safe shareable calculator values", () => {
  assert.deepEqual(
    parseCalculatorQuery("?status=joint&year=2025&magi=210000&roth=40000&coverage=two"),
    { filingStatus: "joint", premiumYear: "2025", baseMagi: "210000", rothAmount: "40000", coverageMode: "two" },
  );
});

test("parseCalculatorQuery ignores unsafe calculator values", () => {
  assert.deepEqual(
    parseCalculatorQuery("?status=bad&magi=-1&roth=nope"),
    {},
  );
});

test("parseCalculatorQuery ignores missing calculator values instead of turning them into zero", () => {
  assert.deepEqual(parseCalculatorQuery(""), {});
  assert.deepEqual(parseCalculatorQuery("?utm_source=test"), {});
});

test("buildCalculatorQuery serializes the shareable core flow", () => {
  assert.equal(
    buildCalculatorQuery({ filingStatus: "single", premiumYear: 2025, baseMagi: 105000, rothAmount: 8000, coverageMode: "two" }),
    "?status=single&year=2025&magi=105000&roth=8000&coverage=two",
  );
});
test("buildShareUrl keeps only core calculator values", () => {
  assert.equal(
    buildShareUrl({ origin: "https://example.com", pathname: "/irmaa-calculator/" }, { filingStatus: "joint", premiumYear: "2025", baseMagi: "210000", rothAmount: "40000", coverageMode: "two" }),
    "https://example.com/irmaa-calculator/?status=joint&year=2025&magi=210000&roth=40000&coverage=two",
  );
});

test("copyShareUrl returns the URL after writing to clipboard", async () => {
  const writes = [];
  const url = await copyShareUrl("https://example.com/?status=single", { writeText: async (value) => writes.push(value) });

  assert.equal(url, "https://example.com/?status=single");
  assert.deepEqual(writes, ["https://example.com/?status=single"]);
});

test("applyQueryParams fills core form controls", () => {
  const rothAmount = { value: "0" };
  const roth = { checked: false, closest: () => ({ querySelector: () => rothAmount }) };
  const status = { value: "single" };
  const premiumYear = { value: "2026" };
  const coverage = { value: "one" };
  const magi = { value: "0" };
  const form = {
    querySelector(selector) {
      return {
        "[name='filingStatus']": status,
        "[name='premiumYear']": premiumYear,
        "[name='coverageMode']": coverage,
        "[name='baseMagi']": magi,
        "[data-event-key='roth']": roth,
      }[selector];
    },
  };

  applyQueryParams(form, { filingStatus: "joint", premiumYear: "2025", coverageMode: "two", baseMagi: "210000", rothAmount: "40000" });

  assert.equal(status.value, "joint");
  assert.equal(premiumYear.value, "2025");
  assert.equal(coverage.value, "two");
  assert.equal(magi.value, "210000");
  assert.equal(roth.checked, true);
  assert.equal(rothAmount.value, "40000");
});

test("getCoreShareValues reads core form controls", () => {
  const rothAmount = { value: "8000" };
  const roth = { checked: true, closest: () => ({ querySelector: () => rothAmount }) };
  const form = {
    querySelector(selector) {
      return {
        "[name='filingStatus']": { value: "single" },
        "[name='premiumYear']": { value: "2025" },
        "[name='coverageMode']": { value: "two" },
        "[name='baseMagi']": { value: "105000" },
        "[data-event-key='roth']": roth,
      }[selector];
    },
  };

  assert.deepEqual(getCoreShareValues(form), { filingStatus: "single", premiumYear: "2025", coverageMode: "two", baseMagi: "105000", rothAmount: "8000" });
});
