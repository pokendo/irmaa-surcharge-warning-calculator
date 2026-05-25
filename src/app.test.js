import assert from "node:assert/strict";
import test from "node:test";

import { applyDefaultEvent, applyQueryParams, buildCalculatorQuery, buildShareUrl, copyShareUrl, getCoreShareValues, parseCalculatorQuery, renderPrintDetails, updateSummaryNode, buildPrintDetails } from "./app.js";

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
    parseCalculatorQuery("?status=joint&magi=210000&roth=40000"),
    { filingStatus: "joint", baseMagi: "210000", rothAmount: "40000" },
  );
});

test("parseCalculatorQuery ignores unsafe calculator values", () => {
  assert.deepEqual(
    parseCalculatorQuery("?status=bad&magi=-1&roth=nope"),
    {},
  );
});

test("buildCalculatorQuery serializes the shareable core flow", () => {
  assert.equal(
    buildCalculatorQuery({ filingStatus: "single", baseMagi: 105000, rothAmount: 8000 }),
    "?status=single&magi=105000&roth=8000",
  );
});
test("buildShareUrl keeps only core calculator values", () => {
  assert.equal(
    buildShareUrl({ origin: "https://example.com", pathname: "/irmaa-calculator/" }, { filingStatus: "joint", baseMagi: "210000", rothAmount: "40000" }),
    "https://example.com/irmaa-calculator/?status=joint&magi=210000&roth=40000",
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
  const magi = { value: "0" };
  const form = {
    querySelector(selector) {
      return {
        "[name='filingStatus']": status,
        "[name='baseMagi']": magi,
        "[data-event-key='roth']": roth,
      }[selector];
    },
  };

  applyQueryParams(form, { filingStatus: "joint", baseMagi: "210000", rothAmount: "40000" });

  assert.equal(status.value, "joint");
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
        "[name='baseMagi']": { value: "105000" },
        "[data-event-key='roth']": roth,
      }[selector];
    },
  };

  assert.deepEqual(getCoreShareValues(form), { filingStatus: "single", baseMagi: "105000", rothAmount: "8000" });
});
