import assert from "node:assert/strict";
import test from "node:test";

import { applyDefaultEvent, applyQueryParams, buildCalculatorQuery, buildShareUrl, copyShareUrl, getCoreShareValues, parseCalculatorQuery, renderPrintDetails, updateSummaryNode, buildPrintDetails, calculateCliffMeter, calculateMaxRothConversionBeforeNextBracket, calculateHouseholdImpact, getCoverageMultiplier, updateRothRoomNode } from "./app.js";

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
    "Your estimated Medicare MAGI is in the First IRMAA bracket. This adds about $95.70 per month, or $1,148 per year, before any plan premium. You have about $24,000 before the next bracket.",
  );
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
    filingStatus: "single",
    baseMagi: 105_000,
    eventTotal: 8_000,
    totalMagi: 113_000,
    bracket: { name: "First IRMAA bracket" },
    monthlySurcharge: 95.7,
    annualSurcharge: 1148.4,
  });

  assert.deepEqual(details, [
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
    parseCalculatorQuery("?status=joint&magi=210000&roth=40000&coverage=two"),
    { filingStatus: "joint", baseMagi: "210000", rothAmount: "40000", coverageMode: "two" },
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
    buildCalculatorQuery({ filingStatus: "single", baseMagi: 105000, rothAmount: 8000, coverageMode: "two" }),
    "?status=single&magi=105000&roth=8000&coverage=two",
  );
});
test("buildShareUrl keeps only core calculator values", () => {
  assert.equal(
    buildShareUrl({ origin: "https://example.com", pathname: "/irmaa-calculator/" }, { filingStatus: "joint", baseMagi: "210000", rothAmount: "40000", coverageMode: "two" }),
    "https://example.com/irmaa-calculator/?status=joint&magi=210000&roth=40000&coverage=two",
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
  const coverage = { value: "one" };
  const magi = { value: "0" };
  const form = {
    querySelector(selector) {
      return {
        "[name='filingStatus']": status,
        "[name='coverageMode']": coverage,
        "[name='baseMagi']": magi,
        "[data-event-key='roth']": roth,
      }[selector];
    },
  };

  applyQueryParams(form, { filingStatus: "joint", coverageMode: "two", baseMagi: "210000", rothAmount: "40000" });

  assert.equal(status.value, "joint");
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
        "[name='coverageMode']": { value: "two" },
        "[name='baseMagi']": { value: "105000" },
        "[data-event-key='roth']": roth,
      }[selector];
    },
  };

  assert.deepEqual(getCoreShareValues(form), { filingStatus: "single", coverageMode: "two", baseMagi: "105000", rothAmount: "8000" });
});
