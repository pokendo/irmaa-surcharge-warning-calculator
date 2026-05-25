export const FILING_STATUSES = {
  single: "Single",
  joint: "Married filing jointly",
  separate: "Married filing separately",
};

export const IRMAA_YEAR = 2026;
export const INCOME_YEAR = 2024;
export const STANDARD_PART_B_PREMIUM = 202.9;
export const IRMAA_DATA_LAST_REVIEWED = "2026-05-18";
export const IRMAA_DATA_SOURCES = {
  cms2026Premiums: {
    label: "CMS 2026 Medicare Parts A & B premiums and Part D IRMAA amounts",
    url: "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles",
  },
  medicareCosts: {
    label: "Medicare.gov Medicare costs",
    url: "https://www.medicare.gov/basics/costs/medicare-costs",
  },
  ssaLowerIrmaa: {
    label: "SSA request to lower IRMAA",
    url: "https://www.ssa.gov/medicare/lower-irmaa",
  },
};

const standardBracket = {
  name: "Standard premium",
  partBMonthly: 0,
  partDMonthly: 0,
};

export const IRMAA_BRACKETS_2026 = {
  single: [
    { ...standardBracket, min: 0, max: 109_000 },
    { name: "First IRMAA bracket", min: 109_000, max: 137_000, partBMonthly: 81.2, partDMonthly: 14.5 },
    { name: "Second IRMAA bracket", min: 137_000, max: 171_000, partBMonthly: 202.9, partDMonthly: 37.5 },
    { name: "Third IRMAA bracket", min: 171_000, max: 205_000, partBMonthly: 324.6, partDMonthly: 60.4 },
    { name: "Fourth IRMAA bracket", min: 205_000, max: 500_000, partBMonthly: 446.3, partDMonthly: 83.3 },
    { name: "Top IRMAA bracket", min: 500_000, max: Infinity, partBMonthly: 487, partDMonthly: 91 },
  ],
  joint: [
    { ...standardBracket, min: 0, max: 218_000 },
    { name: "First IRMAA bracket", min: 218_000, max: 274_000, partBMonthly: 81.2, partDMonthly: 14.5 },
    { name: "Second IRMAA bracket", min: 274_000, max: 342_000, partBMonthly: 202.9, partDMonthly: 37.5 },
    { name: "Third IRMAA bracket", min: 342_000, max: 410_000, partBMonthly: 324.6, partDMonthly: 60.4 },
    { name: "Fourth IRMAA bracket", min: 410_000, max: 750_000, partBMonthly: 446.3, partDMonthly: 83.3 },
    { name: "Top IRMAA bracket", min: 750_000, max: Infinity, partBMonthly: 487, partDMonthly: 91 },
  ],
  separate: [
    { ...standardBracket, min: 0, max: 109_000 },
    { name: "Fourth IRMAA bracket", min: 109_000, max: 391_000, partBMonthly: 446.3, partDMonthly: 83.3 },
    { name: "Top IRMAA bracket", min: 391_000, max: Infinity, partBMonthly: 487, partDMonthly: 91 },
  ],
};

export function sumIncomeEvents(events = []) {
  return events.reduce((total, event) => {
    if (!event.active) return total;
    return total + normalizeAmount(event.amount);
  }, 0);
}

export function getBracketForIncome(filingStatus, income) {
  const brackets = IRMAA_BRACKETS_2026[filingStatus] ?? IRMAA_BRACKETS_2026.single;
  const normalizedIncome = normalizeAmount(income);

  return brackets.find((bracket) => normalizedIncome > bracket.min && normalizedIncome <= bracket.max) ?? brackets[0];
}

export function calculateIrmaaImpact({ filingStatus = "single", baseMagi = 0, events = [] } = {}) {
  const baseIncome = normalizeAmount(baseMagi);
  const eventTotal = sumIncomeEvents(events);
  const totalMagi = baseIncome + eventTotal;
  const bracket = getBracketForIncome(filingStatus, totalMagi);
  const monthlySurcharge = roundMoney(bracket.partBMonthly + bracket.partDMonthly);
  const annualSurcharge = roundMoney(monthlySurcharge * 12);
  const nextThreshold = getNextThreshold(filingStatus, totalMagi);

  return {
    filingStatus,
    baseMagi: baseIncome,
    eventTotal,
    totalMagi,
    bracket,
    monthlySurcharge,
    annualSurcharge,
    nextThreshold,
    roomBeforeNextBracket: nextThreshold === null ? null : Math.max(0, roundMoney(nextThreshold - totalMagi)),
  };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function describeIrmaaResult(result) {
  const room = result.roomBeforeNextBracket === null
    ? "You are already in the top IRMAA bracket."
    : `You have about ${formatCurrency(result.roomBeforeNextBracket)} before ${result.monthlySurcharge > 0 ? "the next bracket" : "the first surcharge bracket"}.`;

  if (result.monthlySurcharge <= 0) {
    return `Your estimated Medicare MAGI is below the first ${IRMAA_YEAR} IRMAA threshold. ${room}`;
  }

  return `Your estimated Medicare MAGI is in the ${result.bracket.name}. This adds about ${formatMoney(result.monthlySurcharge)} per month, or ${formatCurrency(result.annualSurcharge)} per year, before any plan premium. ${room}`;
}

export function getNextThreshold(filingStatus, income) {
  const brackets = IRMAA_BRACKETS_2026[filingStatus] ?? IRMAA_BRACKETS_2026.single;
  const normalizedIncome = normalizeAmount(income);
  const next = brackets.find((bracket) => Number.isFinite(bracket.max) && normalizedIncome < bracket.max);
  return next?.max ?? null;
}

function normalizeAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
