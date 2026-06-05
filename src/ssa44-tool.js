const QUALIFYING_EVENTS = new Set([
  "work-stoppage",
  "work-reduction",
  "marriage",
  "divorce",
  "death-spouse",
  "loss-pension",
  "loss-income-property",
  "employer-settlement",
]);

export function evaluateSsa44Timing({ hasNotice, lifeEvent, incomeLower, jointMedicare }) {
  if (hasNotice !== "yes") {
    return {
      status: "Wait for the notice",
      guidance: "SSA-44 is generally used after you receive an IRMAA notice. Keep your income estimate and life-changing event documentation ready.",
      spouseNote: "",
      nextSteps: [
        "Keep the IRMAA notice envelope and date when it arrives.",
        "Estimate the income year Medicare is using before submitting anything.",
        "Save proof of the life-changing event and projected lower income.",
      ],
    };
  }

  if (lifeEvent === "one-time-income") {
    return {
      status: "One-time income alone is usually not enough",
      guidance: "A Roth conversion, capital gain, IRA withdrawal, stock sale, or home sale gain may explain the spike, but SSA-44 usually needs a qualifying life-changing event and lower income.",
      spouseNote: jointMedicare === "yes" ? "If both spouses are on Medicare and both are assessed IRMAA, each spouse may need a separate SSA-44." : "",
      nextSteps: [
        "Check whether you also had a listed life-changing event.",
        "Use the calculator to estimate whether the surcharge is temporary.",
        "Read the SSA-44 guide before filing a weak appeal.",
      ],
    };
  }

  if (!QUALIFYING_EVENTS.has(lifeEvent)) {
    return {
      status: "Check the official event list",
      guidance: "SSA-44 is for listed life-changing events. Compare your situation with the official SSA form before relying on an appeal.",
      spouseNote: jointMedicare === "yes" ? "Joint tax filing does not make the SSA-44 a joint form. Medicare decisions are tied to each person." : "",
      nextSteps: [
        "Compare your event with the official SSA-44 life-changing event list.",
        "Estimate whether the surcharge may fall away when the spike year drops out.",
        "Use the calculator and checklist before assuming an appeal will work.",
      ],
    };
  }

  if (incomeLower !== "yes") {
    return {
      status: "Event may not be enough",
      guidance: "A qualifying event helps only if it reduced household income. If projected income is still in an IRMAA bracket, the surcharge may remain.",
      spouseNote: jointMedicare === "yes" ? "Both spouses should review whether each received an IRMAA notice." : "",
      nextSteps: [
        "Estimate the lower income year against the IRMAA brackets.",
        "Gather documentation that shows the event and income change.",
        "Review the SSA-44 guide before submitting the form.",
      ],
    };
  }

  return {
    status: "Review SSA-44 now",
    guidance: "You appear to have the core pieces to review SSA-44: an IRMAA notice, a qualifying life-changing event, and lower projected income. Use a good-faith income estimate and keep event documentation.",
    spouseNote: jointMedicare === "yes" ? "If both spouses are on Medicare and both received IRMAA notices, each spouse may need a separate SSA-44." : "",
    nextSteps: [
      "Open the official SSA-44 form and match your event to the form language.",
      "Prepare a good-faith estimate of the lower income year.",
      jointMedicare === "yes"
        ? "If both spouses received notices, prepare separate filings for each person."
        : "Keep a copy of the notice, estimate, and event proof with your records.",
    ],
  };
}

if (typeof document !== "undefined") {
  const form = document.querySelector("[data-ssa44-tool]");

  if (form) {
    const status = document.querySelector("[data-ssa44-status]");
    const guidance = document.querySelector("[data-ssa44-guidance]");
    const spouseNote = document.querySelector("[data-ssa44-spouse-note]");
    const nextSteps = document.querySelector("[data-ssa44-next-steps]");

    form.addEventListener("input", update);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      update();
      window.irmaaTrack?.("ssa44_timing_check", Object.fromEntries(new FormData(form)));
    });
    update();

    function update() {
      const result = evaluateSsa44Timing(Object.fromEntries(new FormData(form)));
      status.textContent = result.status;
      guidance.textContent = result.guidance;
      spouseNote.textContent = result.spouseNote;
      if (nextSteps) {
        nextSteps.innerHTML = result.nextSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
      }
    }
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
