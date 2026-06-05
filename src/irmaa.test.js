import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateIrmaaImpact,
  describeIrmaaResult,
  formatCurrency,
  getBracketForIncome,
  sumIncomeEvents,
} from "./irmaa.js";

test("adds only active one-time income events", () => {
  const total = sumIncomeEvents([
    { label: "Roth conversion", amount: 45_000, active: true },
    { label: "Home sale gain", amount: 120_000, active: false },
    { label: "Capital gains", amount: 12_500, active: true },
  ]);

  assert.equal(total, 57_500);
});

test("finds the 2026 single bracket for Medicare MAGI", () => {
  const bracket = getBracketForIncome("single", 112_000);

  assert.equal(bracket.name, "First IRMAA bracket");
  assert.equal(bracket.partBMonthly, 81.2);
  assert.equal(bracket.partDMonthly, 14.5);
});

test("finds the 2025 single bracket for Medicare MAGI", () => {
  const bracket = getBracketForIncome("single", 112_000, 2025);

  assert.equal(bracket.name, "First IRMAA bracket");
  assert.equal(bracket.partBMonthly, 74);
  assert.equal(bracket.partDMonthly, 13.7);
});

test("shows room before the next bracket when income is below the next threshold", () => {
  const result = calculateIrmaaImpact({
    filingStatus: "single",
    baseMagi: 105_000,
    events: [{ label: "Roth conversion", amount: 8_000, active: true }],
  });

  assert.equal(result.totalMagi, 113_000);
  assert.equal(result.roomBeforeNextBracket, 24_000);
  assert.equal(result.nextThreshold, 137_000);
});

test("calculates monthly and annual surcharge impact against the standard bracket", () => {
  const result = calculateIrmaaImpact({
    filingStatus: "joint",
    baseMagi: 210_000,
    events: [{ label: "Capital gains", amount: 40_000, active: true }],
  });

  assert.equal(result.bracket.name, "First IRMAA bracket");
  assert.equal(result.monthlySurcharge, 95.7);
  assert.equal(result.annualSurcharge, 1148.4);
});

test("formats currency for senior-friendly result labels", () => {
  assert.equal(formatCurrency(1148.4), "\$1,148");
  assert.equal(formatCurrency(24_000), "\$24,000");
});

test("calculates 2025 monthly and annual surcharge impact", () => {
  const result = calculateIrmaaImpact({
    premiumYear: 2025,
    filingStatus: "joint",
    baseMagi: 210_000,
    events: [{ label: "Capital gains", amount: 40_000, active: true }],
  });

  assert.equal(result.premiumYear, 2025);
  assert.equal(result.incomeYear, 2023);
  assert.equal(result.bracket.name, "First IRMAA bracket");
  assert.equal(result.monthlySurcharge, 87.7);
  assert.equal(result.annualSurcharge, 1052.4);
});

test("describes a surcharge result in plain English", () => {
  const result = calculateIrmaaImpact({
    filingStatus: "single",
    baseMagi: 105_000,
    events: [{ label: "Roth conversion", amount: 8_000, active: true }],
  });

  assert.equal(
    describeIrmaaResult(result),
    "Your estimated Medicare MAGI is in the First IRMAA bracket for 2026. This adds about $95.70 per month, or $1,148 per year, before any plan premium. You have about $24,000 before the next bracket.",
  );
});

test("describes a standard premium result without creating alarm", () => {
  const result = calculateIrmaaImpact({
    filingStatus: "single",
    baseMagi: 95_000,
    events: [],
  });

  assert.equal(
    describeIrmaaResult(result),
    "Your estimated Medicare MAGI is below the first 2026 IRMAA threshold. You have about $14,000 before the first surcharge bracket.",
  );
});
