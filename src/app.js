import { FILING_STATUSES, IRMAA_DATA_LAST_REVIEWED, calculateIrmaaImpact, describeIrmaaResult, formatCurrency, formatMoney } from "./irmaa.js";

if (typeof document !== "undefined") {
  const form = document.querySelector("[data-calculator-form]");

  if (form) {
    const resultBox = document.querySelector("[data-results]");
    const statusNode = document.querySelector("[data-result='status']");
    const incomeYearNode = document.querySelector("[data-result='income-year']");
    const magiNode = document.querySelector("[data-result='magi']");
    const monthlyNode = document.querySelector("[data-result='monthly']");
    const annualNode = document.querySelector("[data-result='annual']");
    const householdMonthlyNode = document.querySelector("[data-result='household-monthly']");
    const householdAnnualNode = document.querySelector("[data-result='household-annual']");
    const roomNode = document.querySelector("[data-result='room']");
    const rothRoomNode = document.querySelector("[data-result='roth-room']");
    const scenarioNodes = {
      baselineMagi: document.querySelector("[data-scenario-result='baseline-magi']"),
      baselineMonthly: document.querySelector("[data-scenario-result='baseline-monthly']"),
      plannedMagi: document.querySelector("[data-scenario-result='planned-magi']"),
      plannedMonthly: document.querySelector("[data-scenario-result='planned-monthly']"),
      fillMagi: document.querySelector("[data-scenario-result='fill-magi']"),
      fillMonthly: document.querySelector("[data-scenario-result='fill-monthly']"),
    };
    const cliffLabelNode = document.querySelector("[data-result='cliff-label']");
    const cliffDetailNode = document.querySelector("[data-result='cliff-detail']");
    const cliffFillNode = document.querySelector("[data-result='cliff-fill']");
    const summaryNode = document.querySelector("[data-result='summary']");
    const resultActionNodes = {
      title: document.querySelector("[data-result-action='title']"),
      copy: document.querySelector("[data-result-action='copy']"),
    };
    const printDetailsNode = document.querySelector("[data-print-details]");
    const shareLinkButton = document.querySelector("[data-share-link]");
    const magiHelper = form.querySelector("[data-magi-helper]");
    const rothSchedule = document.querySelector("[data-roth-schedule]");
    const rothScheduleTarget = rothSchedule?.querySelector("[data-roth-target-balance]");
    const rothScheduleNodes = {
      plannedAmount: rothSchedule?.querySelector("[data-roth-schedule-result='planned-amount']"),
      plannedYears: rothSchedule?.querySelector("[data-roth-schedule-result='planned-years']"),
      fillAmount: rothSchedule?.querySelector("[data-roth-schedule-result='fill-amount']"),
      fillYears: rothSchedule?.querySelector("[data-roth-schedule-result='fill-years']"),
    };

    applyQueryParams(form, parseCalculatorQuery(window.location.search));

    applyDefaultEvent(
      [...form.querySelectorAll("[data-event]")].map((row) => row.querySelector("input[type='checkbox']")),
      form.dataset.defaultEvent ?? "",
    );
    if (!form.parentElement?.querySelector(".result-signup")) {
      form.insertAdjacentHTML("afterend", buildResultSignupMarkup(form.dataset.defaultEvent || "general"));
    }

    form.addEventListener("input", updateResults);
    rothScheduleTarget?.addEventListener("input", updateResults);
    if (magiHelper) {
      updateMagiHelperTotalNode(magiHelper);
      magiHelper.addEventListener("input", () => updateMagiHelperTotalNode(magiHelper));
      magiHelper.querySelector("[data-apply-magi-helper]")?.addEventListener("click", () => {
        applyMagiHelperValues(form, magiHelper);
        updateResults();
        window.irmaaTrack?.("magi_helper_apply", getCoreShareValues(form));
      });
    }
    if (shareLinkButton) {
      shareLinkButton.addEventListener("click", async () => {
        const shareUrl = buildShareUrl(window.location, getCoreShareValues(form));
        const copied = await copyShareUrl(shareUrl, navigator.clipboard);
        shareLinkButton.textContent = copied ? "Link copied" : "Copy unavailable";
        if (copied) window.irmaaTrack?.("share_link", getCoreShareValues(form));
        window.setTimeout(() => {
          shareLinkButton.textContent = "Copy share link";
        }, 2500);
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      window.print();
    });

    updateResults();

    function updateResults() {
      const data = new FormData(form);
      const events = [...form.querySelectorAll("[data-event]")].map((row) => {
        const checkbox = row.querySelector("input[type='checkbox']");
        const amount = row.querySelector("input[type='number']");
        return {
          label: checkbox.value,
          active: checkbox.checked,
          amount: amount.value,
        };
      });
      const result = calculateIrmaaImpact({
        premiumYear: data.get("premiumYear"),
        filingStatus: data.get("filingStatus"),
        baseMagi: data.get("baseMagi"),
        events,
      });

      const hasSurcharge = result.monthlySurcharge > 0;
      resultBox.classList.toggle("warning", hasSurcharge);
      statusNode.textContent = result.bracket.name;
      if (incomeYearNode) incomeYearNode.textContent = String(result.incomeYear);
      magiNode.textContent = formatCurrency(result.totalMagi);
      monthlyNode.textContent = formatMoney(result.monthlySurcharge);
      annualNode.textContent = formatCurrency(result.annualSurcharge);
      const householdImpact = calculateHouseholdImpact(result, data.get("coverageMode"));
      updateHouseholdImpactNodes(householdMonthlyNode, householdAnnualNode, householdImpact);
      updateScenarioComparisonNodes(scenarioNodes, calculateScenarioComparison({
        premiumYear: data.get("premiumYear"),
        filingStatus: data.get("filingStatus"),
        baseMagi: data.get("baseMagi"),
        events,
      }));
      roomNode.textContent = result.roomBeforeNextBracket === null
        ? "Top bracket"
        : formatCurrency(result.roomBeforeNextBracket);
      const rothAmount = getActiveEventAmount(form, "roth");
      updateRothRoomNode(rothRoomNode, result, rothAmount);
      updateRothConversionScheduleNodes(rothScheduleNodes, calculateRothConversionSchedule({
        targetBalance: rothScheduleTarget?.value,
        plannedAnnualConversion: rothAmount,
        maxAnnualConversion: calculateMaxRothConversionBeforeNextBracket(result, rothAmount),
      }));
      updateCliffMeterNodes(cliffLabelNode, cliffDetailNode, cliffFillNode, calculateCliffMeter(result));
      updateSummaryNode(summaryNode, result);
      updateResultActionNodes(resultActionNodes, buildResultAction(result));
      renderPrintDetails(printDetailsNode, buildPrintDetails(result, { currentRothAmount: rothAmount }));
      window.irmaaCurrentEstimate = {
        filingStatus: result.filingStatus,
        premiumYear: result.premiumYear,
        incomeYear: result.incomeYear,
        baseMagi: result.baseMagi,
        eventTotal: result.eventTotal,
        totalMagi: result.totalMagi,
        monthlySurcharge: result.monthlySurcharge,
        annualSurcharge: result.annualSurcharge,
        coverageMultiplier: householdImpact.coverageMultiplier,
        householdMonthlySurcharge: householdImpact.householdMonthlySurcharge,
        householdAnnualSurcharge: householdImpact.householdAnnualSurcharge,
        bracketName: result.bracket.name,
        maxRothConversionBeforeNextBracket: calculateMaxRothConversionBeforeNextBracket(result, rothAmount),
      };
    }

    window.irmaaGetCalculatorContext = () => window.irmaaCurrentEstimate ?? getCoreShareValues(form);
  }
}

export function applyDefaultEvent(events, defaultEvent) {
  if (!defaultEvent) return;

  for (const event of events) {
    if (!event) continue;
    event.checked = event.dataset?.eventKey === defaultEvent || event.key === defaultEvent;
  }
}

export function updateSummaryNode(node, result) {
  if (!node) return;

  node.textContent = describeIrmaaResult(result);
}

export function buildResultAction(result) {
  if (result.monthlySurcharge > 0) {
    return {
      title: "Review before you lock this in",
      copy: `This estimate shows about ${formatMoney(result.monthlySurcharge)} per month in IRMAA. Use the checklist before the tax-year decision becomes hard to unwind.`,
    };
  }

  return {
    title: "Stay under the next bracket",
    copy: `You have about ${formatCurrency(result.roomBeforeNextBracket)} before the first surcharge bracket. Save the planning checklist before a Roth conversion, RMD, capital gain, or home sale changes the estimate.`,
  };
}

export function updateResultActionNodes(nodes = {}, action) {
  if (!action) return;

  if (nodes.title) nodes.title.textContent = action.title;
  if (nodes.copy) nodes.copy.textContent = action.copy;
}

export function buildResultSignupMarkup(context = "general") {
  return `
    <form class="result-signup" data-newsletter-form data-source="calculator-result-${context}">
      <label>
        Email the checklist and annual IRMAA updates
        <span class="result-signup-row">
          <input name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
          <button type="submit">Send checklist</button>
        </span>
      </label>
      <p class="form-status" data-newsletter-status aria-live="polite"></p>
    </form>
  `;
}

export function updateRothRoomNode(node, result, currentRothAmount) {
  if (!node) return;

  const maxRothConversion = calculateMaxRothConversionBeforeNextBracket(result, currentRothAmount);
  node.textContent = maxRothConversion === null ? "Top bracket" : formatCurrency(maxRothConversion);
}

export function calculateMaxRothConversionBeforeNextBracket(result, currentRothAmount = 0) {
  if (result.roomBeforeNextBracket === null) return null;

  return Number(currentRothAmount) + result.roomBeforeNextBracket;
}

export function calculateRothConversionSchedule({
  targetBalance = 0,
  plannedAnnualConversion = 0,
  maxAnnualConversion = 0,
} = {}) {
  const target = normalizeSafeAmount(targetBalance);
  const planned = normalizeSafeAmount(plannedAnnualConversion);
  const fill = normalizeSafeAmount(maxAnnualConversion);

  return {
    targetBalance: target,
    planned: {
      annualConversion: planned,
      years: target > 0 && planned > 0 ? Math.ceil(target / planned) : null,
    },
    fillToBracket: {
      annualConversion: fill,
      years: target > 0 && fill > 0 ? Math.ceil(target / fill) : null,
    },
  };
}

export function updateRothConversionScheduleNodes(nodes = {}, schedule) {
  if (!schedule) return;

  if (nodes.plannedAmount) nodes.plannedAmount.textContent = formatCurrency(schedule.planned.annualConversion);
  if (nodes.plannedYears) nodes.plannedYears.textContent = formatScheduleYears(schedule.planned.years);
  if (nodes.fillAmount) nodes.fillAmount.textContent = formatCurrency(schedule.fillToBracket.annualConversion);
  if (nodes.fillYears) nodes.fillYears.textContent = formatScheduleYears(schedule.fillToBracket.years);
}

function formatScheduleYears(years) {
  if (years === null) return "Enter an annual conversion";
  return `${years} ${years === 1 ? "year" : "years"}`;
}

export function getCoverageMultiplier(coverageMode) {
  return coverageMode === "two" ? 2 : 1;
}

export function calculateHouseholdImpact(result, coverageMode = "one") {
  const coverageMultiplier = getCoverageMultiplier(coverageMode);
  const householdMonthlySurcharge = roundMoney(result.monthlySurcharge * coverageMultiplier);
  const householdAnnualSurcharge = roundMoney(householdMonthlySurcharge * 12);

  return { coverageMultiplier, householdMonthlySurcharge, householdAnnualSurcharge };
}

export function calculateScenarioComparison({ premiumYear, filingStatus, baseMagi = 0, events = [] } = {}) {
  const baselineResult = calculateIrmaaImpact({ premiumYear, filingStatus, baseMagi, events: [] });
  const plannedResult = calculateIrmaaImpact({ premiumYear, filingStatus, baseMagi, events });
  const fillToBracketMagi = plannedResult.nextThreshold ?? plannedResult.totalMagi;
  const fillToBracketResult = calculateIrmaaImpact({
    premiumYear,
    filingStatus,
    baseMagi: fillToBracketMagi,
    events: [],
  });

  return {
    baseline: scenarioFromResult("Baseline", baselineResult),
    planned: scenarioFromResult("Planned", plannedResult),
    fillToBracket: scenarioFromResult("Fill to bracket", fillToBracketResult),
  };
}

export function updateScenarioComparisonNodes(nodes = {}, comparison) {
  if (!comparison) return;

  if (nodes.baselineMagi) nodes.baselineMagi.textContent = formatCurrency(comparison.baseline.magi);
  if (nodes.baselineMonthly) nodes.baselineMonthly.textContent = `${formatMoney(comparison.baseline.monthlySurcharge)}/mo`;
  if (nodes.plannedMagi) nodes.plannedMagi.textContent = formatCurrency(comparison.planned.magi);
  if (nodes.plannedMonthly) nodes.plannedMonthly.textContent = `${formatMoney(comparison.planned.monthlySurcharge)}/mo`;
  if (nodes.fillMagi) nodes.fillMagi.textContent = formatCurrency(comparison.fillToBracket.magi);
  if (nodes.fillMonthly) nodes.fillMonthly.textContent = `${formatMoney(comparison.fillToBracket.monthlySurcharge)}/mo`;
}

function scenarioFromResult(label, result) {
  return {
    label,
    magi: result.totalMagi,
    monthlySurcharge: result.monthlySurcharge,
    annualSurcharge: result.annualSurcharge,
  };
}

export function updateHouseholdImpactNodes(monthlyNode, annualNode, householdImpact) {
  if (monthlyNode) monthlyNode.textContent = formatMoney(householdImpact.householdMonthlySurcharge);
  if (annualNode) annualNode.textContent = formatCurrency(householdImpact.householdAnnualSurcharge);
}

export function calculateCliffMeter(result) {
  if (result.nextThreshold === null || result.roomBeforeNextBracket === null) {
    return {
      percent: 100,
      label: "Top IRMAA bracket",
      detail: "No higher IRMAA bracket remains.",
    };
  }

  const bracketFloor = result.bracket?.min ?? 0;
  const range = Math.max(1, result.nextThreshold - bracketFloor);
  const rawPercent = ((result.totalMagi - bracketFloor) / range) * 100;
  const percent = Math.max(0, Math.min(100, Math.round(rawPercent)));
  const target = result.monthlySurcharge > 0 ? "the next bracket" : "the first surcharge bracket";

  return {
    percent,
    label: `${percent}% of the way to ${target}`,
    detail: `${formatCurrency(result.roomBeforeNextBracket)} before ${target}`,
  };
}

export function updateCliffMeterNodes(labelNode, detailNode, fillNode, cliffMeter) {
  if (labelNode) labelNode.textContent = cliffMeter.label;
  if (detailNode) detailNode.textContent = cliffMeter.detail;
  if (fillNode) fillNode.style.width = `${cliffMeter.percent}%`;
}

export function calculateMagiHelperTotal(values = {}) {
  return roundMoney([
    values.agi,
    values.taxExemptInterest,
    values.taxableSocialSecurity,
    values.pensionOrConsulting,
  ].reduce((total, value) => total + normalizeSafeAmount(value), 0));
}

export function calculateMagiHelperPlannedEvents(values = {}) {
  return {
    roth: normalizeSafeAmount(values.roth),
    rmd: normalizeSafeAmount(values.rmd),
    gains: normalizeSafeAmount(values.gains),
  };
}

export function readMagiHelperValues(helper) {
  const values = {};

  for (const input of helper?.querySelectorAll("[data-magi-helper-input]") ?? []) {
    values[input.dataset.magiHelperInput] = input.value;
  }

  return values;
}

export function updateMagiHelperTotalNode(helper) {
  const totalNode = helper?.querySelector("[data-magi-helper-total]");
  if (!totalNode) return;

  const values = readMagiHelperValues(helper);
  totalNode.textContent = formatCurrency(calculateMagiHelperTotal(values));
}

export function applyMagiHelperValues(form, helper) {
  const values = readMagiHelperValues(helper);
  const baseMagi = form?.querySelector("[name='baseMagi']");
  const plannedEvents = calculateMagiHelperPlannedEvents(values);

  if (baseMagi) {
    baseMagi.value = String(calculateMagiHelperTotal(values));
  }

  applyHelperEventValue(form, "roth", plannedEvents.roth);
  applyHelperEventValue(form, "rmd", plannedEvents.rmd);
  applyHelperEventValue(form, "gains", plannedEvents.gains);
}

function applyHelperEventValue(form, eventKey, value) {
  const checkbox = form?.querySelector(`[data-event-key='${eventKey}']`);
  const amount = checkbox?.closest("[data-event]")?.querySelector("input[type='number']");
  if (!checkbox || !amount) return;

  checkbox.checked = value > 0;
  amount.value = String(value);
}

export function buildPrintDetails(result, options = {}) {
  const roomBeforeNextBracket = result.roomBeforeNextBracket === null
    ? "Top bracket"
    : formatCurrency(result.roomBeforeNextBracket);
  const maxRothConversion = calculateMaxRothConversionBeforeNextBracket(result, options.currentRothAmount ?? 0);
  const maxRothConversionLabel = maxRothConversion === null
    ? "Top bracket"
    : formatCurrency(maxRothConversion);

  return [
    ["Premium year", String(result.premiumYear ?? "")],
    ["Income year used", String(result.incomeYear ?? "")],
    ["Filing status", FILING_STATUSES[result.filingStatus] ?? result.filingStatus],
    ["Base Medicare MAGI", formatCurrency(result.baseMagi)],
    ["Added income events", formatCurrency(result.eventTotal)],
    ["Estimated Medicare MAGI", formatCurrency(result.totalMagi)],
    ["Estimated bracket", result.bracket.name],
    ["Estimated monthly surcharge", formatMoney(result.monthlySurcharge)],
    ["Estimated annual surcharge", formatCurrency(result.annualSurcharge)],
    ["Room before next bracket", roomBeforeNextBracket],
    ["Max Roth conversion before next bracket", maxRothConversionLabel],
    ["Source review date", formatReviewDate(IRMAA_DATA_LAST_REVIEWED)],
  ];
}

function formatReviewDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function renderPrintDetails(node, details) {
  if (!node) return;

  node.innerHTML = details
    .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
export function parseCalculatorQuery(search) {
  const params = new URLSearchParams(search);
  const parsed = {};
  const status = params.get("status");
  const year = params.get("year");
  const magi = params.get("magi");
  const roth = params.get("roth");
  const coverage = params.get("coverage");

  if (["single", "joint", "separate"].includes(status)) {
    parsed.filingStatus = status;
  }
  if (["2025", "2026"].includes(year)) {
    parsed.premiumYear = year;
  }
  if (isSafeAmount(magi)) {
    parsed.baseMagi = String(Number(magi));
  }
  if (isSafeAmount(roth)) {
    parsed.rothAmount = String(Number(roth));
  }
  if (["one", "two"].includes(coverage)) {
    parsed.coverageMode = coverage;
  }

  return parsed;
}

export function buildCalculatorQuery({ filingStatus, premiumYear, baseMagi, rothAmount, coverageMode }) {
  const params = new URLSearchParams();

  if (["single", "joint", "separate"].includes(filingStatus)) {
    params.set("status", filingStatus);
  }
  if (["2025", "2026"].includes(String(premiumYear))) {
    params.set("year", String(premiumYear));
  }
  if (isSafeAmount(baseMagi)) {
    params.set("magi", String(Number(baseMagi)));
  }
  if (isSafeAmount(rothAmount)) {
    params.set("roth", String(Number(rothAmount)));
  }
  if (["one", "two"].includes(coverageMode)) {
    params.set("coverage", coverageMode);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

function isSafeAmount(value) {
  if (value === null || value === undefined || value === "") return false;

  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0;
}

function normalizeSafeAmount(value) {
  if (value === null || value === undefined || value === "") return 0;

  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}
export function applyQueryParams(form, params) {
  if (!form || !params) return;

  const status = form.querySelector("[name='filingStatus']");
  const premiumYear = form.querySelector("[name='premiumYear']");
  const coverage = form.querySelector("[name='coverageMode']");
  const magi = form.querySelector("[name='baseMagi']");
  const roth = form.querySelector("[data-event-key='roth']");
  const rothAmount = roth?.closest("[data-event]")?.querySelector("input[type='number']");

  if (params.filingStatus && status) status.value = params.filingStatus;
  if (params.premiumYear && premiumYear) premiumYear.value = params.premiumYear;
  if (params.coverageMode && coverage) coverage.value = params.coverageMode;
  if (params.baseMagi && magi) magi.value = params.baseMagi;
  if (params.rothAmount && rothAmount) {
    roth.checked = true;
    rothAmount.value = params.rothAmount;
  }
}

export function getCoreShareValues(form) {
  const roth = form.querySelector("[data-event-key='roth']");
  const rothAmount = roth?.closest("[data-event]")?.querySelector("input[type='number']");

  return {
    filingStatus: form.querySelector("[name='filingStatus']")?.value,
    premiumYear: form.querySelector("[name='premiumYear']")?.value ?? "2026",
    coverageMode: form.querySelector("[name='coverageMode']")?.value ?? "one",
    baseMagi: form.querySelector("[name='baseMagi']")?.value,
    rothAmount: roth?.checked ? rothAmount?.value : 0,
  };
}

function getActiveEventAmount(form, eventKey) {
  const event = form.querySelector(`[data-event-key='${eventKey}']`);
  const amount = event?.closest("[data-event]")?.querySelector("input[type='number']");

  return event?.checked ? Number(amount?.value) || 0 : 0;
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function buildShareUrl(location, values) {
  return `${location.origin}${location.pathname}${buildCalculatorQuery(values)}`;
}

export async function copyShareUrl(url, clipboard) {
  if (!clipboard?.writeText) return false;
  try {
    await clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
