import { FILING_STATUSES, IRMAA_DATA_LAST_REVIEWED, calculateIrmaaImpact, describeIrmaaResult, formatCurrency, formatMoney } from "./irmaa.js";

if (typeof document !== "undefined") {
  const form = document.querySelector("[data-calculator-form]");

  if (form) {
    const resultBox = document.querySelector("[data-results]");
    const statusNode = document.querySelector("[data-result='status']");
    const magiNode = document.querySelector("[data-result='magi']");
    const monthlyNode = document.querySelector("[data-result='monthly']");
    const annualNode = document.querySelector("[data-result='annual']");
    const roomNode = document.querySelector("[data-result='room']");
    const rothRoomNode = document.querySelector("[data-result='roth-room']");
    const summaryNode = document.querySelector("[data-result='summary']");
    const printDetailsNode = document.querySelector("[data-print-details]");
    const shareLinkButton = document.querySelector("[data-share-link]");

    applyQueryParams(form, parseCalculatorQuery(window.location.search));

    applyDefaultEvent(
      [...form.querySelectorAll("[data-event]")].map((row) => row.querySelector("input[type='checkbox']")),
      form.dataset.defaultEvent ?? "",
    );

    form.addEventListener("input", updateResults);
    if (shareLinkButton) {
      shareLinkButton.addEventListener("click", async () => {
        const shareUrl = buildShareUrl(window.location, getCoreShareValues(form));
        await copyShareUrl(shareUrl, navigator.clipboard);
        shareLinkButton.textContent = "Link copied";
        window.irmaaTrack?.("share_link", getCoreShareValues(form));
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
        filingStatus: data.get("filingStatus"),
        baseMagi: data.get("baseMagi"),
        events,
      });

      const hasSurcharge = result.monthlySurcharge > 0;
      resultBox.classList.toggle("warning", hasSurcharge);
      statusNode.textContent = result.bracket.name;
      magiNode.textContent = formatCurrency(result.totalMagi);
      monthlyNode.textContent = formatMoney(result.monthlySurcharge);
      annualNode.textContent = formatCurrency(result.annualSurcharge);
      roomNode.textContent = result.roomBeforeNextBracket === null
        ? "Top bracket"
        : formatCurrency(result.roomBeforeNextBracket);
      const rothAmount = getActiveEventAmount(form, "roth");
      updateRothRoomNode(rothRoomNode, result, rothAmount);
      updateSummaryNode(summaryNode, result);
      renderPrintDetails(printDetailsNode, buildPrintDetails(result));
      window.irmaaCurrentEstimate = {
        filingStatus: result.filingStatus,
        baseMagi: result.baseMagi,
        eventTotal: result.eventTotal,
        totalMagi: result.totalMagi,
        monthlySurcharge: result.monthlySurcharge,
        annualSurcharge: result.annualSurcharge,
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

export function updateRothRoomNode(node, result, currentRothAmount) {
  if (!node) return;

  const maxRothConversion = calculateMaxRothConversionBeforeNextBracket(result, currentRothAmount);
  node.textContent = maxRothConversion === null ? "Top bracket" : formatCurrency(maxRothConversion);
}

export function calculateMaxRothConversionBeforeNextBracket(result, currentRothAmount = 0) {
  if (result.roomBeforeNextBracket === null) return null;

  return Number(currentRothAmount) + result.roomBeforeNextBracket;
}


export function buildPrintDetails(result) {
  return [
    ["Filing status", FILING_STATUSES[result.filingStatus] ?? result.filingStatus],
    ["Base Medicare MAGI", formatCurrency(result.baseMagi)],
    ["Added income events", formatCurrency(result.eventTotal)],
    ["Estimated Medicare MAGI", formatCurrency(result.totalMagi)],
    ["Estimated bracket", result.bracket.name],
    ["Estimated monthly surcharge", formatMoney(result.monthlySurcharge)],
    ["Estimated annual surcharge", formatCurrency(result.annualSurcharge)],
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
  const magi = params.get("magi");
  const roth = params.get("roth");

  if (["single", "joint", "separate"].includes(status)) {
    parsed.filingStatus = status;
  }
  if (isSafeAmount(magi)) {
    parsed.baseMagi = String(Number(magi));
  }
  if (isSafeAmount(roth)) {
    parsed.rothAmount = String(Number(roth));
  }

  return parsed;
}

export function buildCalculatorQuery({ filingStatus, baseMagi, rothAmount }) {
  const params = new URLSearchParams();

  if (["single", "joint", "separate"].includes(filingStatus)) {
    params.set("status", filingStatus);
  }
  if (isSafeAmount(baseMagi)) {
    params.set("magi", String(Number(baseMagi)));
  }
  if (isSafeAmount(rothAmount)) {
    params.set("roth", String(Number(rothAmount)));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

function isSafeAmount(value) {
  if (value === null || value === undefined || value === "") return false;

  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0;
}
export function applyQueryParams(form, params) {
  if (!form || !params) return;

  const status = form.querySelector("[name='filingStatus']");
  const magi = form.querySelector("[name='baseMagi']");
  const roth = form.querySelector("[data-event-key='roth']");
  const rothAmount = roth?.closest("[data-event]")?.querySelector("input[type='number']");

  if (params.filingStatus && status) status.value = params.filingStatus;
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
    baseMagi: form.querySelector("[name='baseMagi']")?.value,
    rothAmount: roth?.checked ? rothAmount?.value : 0,
  };
}

function getActiveEventAmount(form, eventKey) {
  const event = form.querySelector(`[data-event-key='${eventKey}']`);
  const amount = event?.closest("[data-event]")?.querySelector("input[type='number']");

  return event?.checked ? Number(amount?.value) || 0 : 0;
}

export function buildShareUrl(location, values) {
  return `${location.origin}${location.pathname}${buildCalculatorQuery(values)}`;
}

export async function copyShareUrl(url, clipboard) {
  if (clipboard?.writeText) {
    await clipboard.writeText(url);
  }
  return url;
}
