export const FILING_STATUSES = {
  single: "Single",
  joint: "Married filing jointly",
  separate: "Married filing separately",
};

export const DEFAULT_IRMAA_YEAR = 2026;
export const IRMAA_YEAR = DEFAULT_IRMAA_YEAR;
export const INCOME_YEAR = 2024;
export const STANDARD_PART_B_PREMIUM = 202.9;
export const IRMAA_DATA_LAST_REVIEWED = "2026-05-18";
export const IRMAA_DATA_SOURCES = {
  cms2025Premiums: {
    label: "CMS 2025 Medicare Parts A & B premiums and Part D IRMAA amounts",
    url: "https://www.cms.gov/newsroom/fact-sheets/2025-medicare-parts-b-premiums-and-deductibles",
  },
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

export const IRMAA_BRACKETS_2025 = {
  single: [
    { ...standardBracket, min: 0, max: 106_000 },
    { name: "First IRMAA bracket", min: 106_000, max: 133_000, partBMonthly: 74, partDMonthly: 13.7 },
    { name: "Second IRMAA bracket", min: 133_000, max: 167_000, partBMonthly: 185, partDMonthly: 35.3 },
    { name: "Third IRMAA bracket", min: 167_000, max: 200_000, partBMonthly: 295.9, partDMonthly: 57 },
    { name: "Fourth IRMAA bracket", min: 200_000, max: 500_000, partBMonthly: 406.9, partDMonthly: 78.6 },
    { name: "Top IRMAA bracket", min: 500_000, max: Infinity, partBMonthly: 443.9, partDMonthly: 85.8 },
  ],
  joint: [
    { ...standardBracket, min: 0, max: 212_000 },
    { name: "First IRMAA bracket", min: 212_000, max: 266_000, partBMonthly: 74, partDMonthly: 13.7 },
    { name: "Second IRMAA bracket", min: 266_000, max: 334_000, partBMonthly: 185, partDMonthly: 35.3 },
    { name: "Third IRMAA bracket", min: 334_000, max: 400_000, partBMonthly: 295.9, partDMonthly: 57 },
    { name: "Fourth IRMAA bracket", min: 400_000, max: 750_000, partBMonthly: 406.9, partDMonthly: 78.6 },
    { name: "Top IRMAA bracket", min: 750_000, max: Infinity, partBMonthly: 443.9, partDMonthly: 85.8 },
  ],
  separate: [
    { ...standardBracket, min: 0, max: 106_000 },
    { name: "Fourth IRMAA bracket", min: 106_000, max: 394_000, partBMonthly: 406.9, partDMonthly: 78.6 },
    { name: "Top IRMAA bracket", min: 394_000, max: Infinity, partBMonthly: 443.9, partDMonthly: 85.8 },
  ],
};

export const IRMAA_DATA_BY_YEAR = {
  2025: {
    premiumYear: 2025,
    incomeYear: 2023,
    standardPartBPremium: 185,
    brackets: IRMAA_BRACKETS_2025,
  },
  2026: {
    premiumYear: 2026,
    incomeYear: 2024,
    standardPartBPremium: 202.9,
    brackets: IRMAA_BRACKETS_2026,
  },
};

export function normalizePremiumYear(premiumYear = DEFAULT_IRMAA_YEAR) {
  const year = Number(premiumYear);
  return Object.hasOwn(IRMAA_DATA_BY_YEAR, year) ? year : DEFAULT_IRMAA_YEAR;
}

export function getIrmaaDataForYear(premiumYear = DEFAULT_IRMAA_YEAR) {
  return IRMAA_DATA_BY_YEAR[normalizePremiumYear(premiumYear)];
}

export function sumIncomeEvents(events = []) {
  return events.reduce((total, event) => {
    if (!event.active) return total;
    return total + normalizeAmount(event.amount);
  }, 0);
}

export function getBracketForIncome(filingStatus, income, premiumYear = DEFAULT_IRMAA_YEAR) {
  const yearData = getIrmaaDataForYear(premiumYear);
  const brackets = yearData.brackets[filingStatus] ?? yearData.brackets.single;
  const normalizedIncome = normalizeAmount(income);

  return brackets.find((bracket) => normalizedIncome > bracket.min && normalizedIncome <= bracket.max) ?? brackets[0];
}

export function calculateIrmaaImpact({ premiumYear = DEFAULT_IRMAA_YEAR, filingStatus = "single", baseMagi = 0, events = [] } = {}) {
  const yearData = getIrmaaDataForYear(premiumYear);
  const baseIncome = normalizeAmount(baseMagi);
  const eventTotal = sumIncomeEvents(events);
  const totalMagi = baseIncome + eventTotal;
  const bracket = getBracketForIncome(filingStatus, totalMagi, yearData.premiumYear);
  const monthlySurcharge = roundMoney(bracket.partBMonthly + bracket.partDMonthly);
  const annualSurcharge = roundMoney(monthlySurcharge * 12);
  const nextThreshold = getNextThreshold(filingStatus, totalMagi, yearData.premiumYear);

  return {
    premiumYear: yearData.premiumYear,
    incomeYear: yearData.incomeYear,
    standardPartBPremium: yearData.standardPartBPremium,
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
  const premiumYear = result.premiumYear ?? IRMAA_YEAR;
  const room = result.roomBeforeNextBracket === null
    ? "You are already in the top IRMAA bracket."
    : `You have about ${formatCurrency(result.roomBeforeNextBracket)} before ${result.monthlySurcharge > 0 ? "the next bracket" : "the first surcharge bracket"}.`;

  if (result.monthlySurcharge <= 0) {
    return `Your estimated Medicare MAGI is below the first ${premiumYear} IRMAA threshold. ${room}`;
  }

  return `Your estimated Medicare MAGI is in the ${result.bracket.name} for ${premiumYear}. This adds about ${formatMoney(result.monthlySurcharge)} per month, or ${formatCurrency(result.annualSurcharge)} per year, before any plan premium. ${room}`;
}

export function getNextThreshold(filingStatus, income, premiumYear = DEFAULT_IRMAA_YEAR) {
  const yearData = getIrmaaDataForYear(premiumYear);
  const brackets = yearData.brackets[filingStatus] ?? yearData.brackets.single;
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
