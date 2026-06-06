const POCKETBASE_URL = "https://pb.irmaacheck.com";

function postPocketBase(collection, payload) {
  if (!window.fetch) return;

  fetch(`${POCKETBASE_URL}/api/collections/${collection}/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

function getAttribution() {
  const params = new URLSearchParams(window.location.search);
  const utm = {
    source: params.get("utm_source") || "",
    medium: params.get("utm_medium") || "",
    campaign: params.get("utm_campaign") || "",
    content: params.get("utm_content") || "",
  };
  const referrer = getReferrerHost();
  const source = [utm.source, utm.medium, utm.campaign].filter(Boolean).join(" / ") || referrer || "direct";

  return { source, referrer, utm };
}

function getReferrerHost() {
  if (!document.referrer) return "";

  try {
    return new URL(document.referrer).hostname;
  } catch {
    return "";
  }
}

function track(eventName, metadata = {}) {
  const attribution = getAttribution();

  postPocketBase("site_events", {
    event_name: eventName,
    page_path: window.location.pathname,
    source: attribution.source,
    metadata: { ...metadata, attribution },
  });
}

window.irmaaTrack = track;

track("page_view", {
  title: document.title,
  width: window.innerWidth,
  path: window.location.pathname,
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-track-event]");
  if (!target) return;

  track(target.dataset.trackEvent, {
    label: target.dataset.trackLabel || target.textContent.trim().slice(0, 80),
    href: target.getAttribute("href") || "",
  });
});

document.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-newsletter-form]");
  if (!form) return;

  event.preventDefault();
  const email = form.querySelector("[name='email']")?.value?.trim();
  const status = form.querySelector("[data-newsletter-status]");
  if (!email) return;

  const attribution = getAttribution();
  const calculatorContext = window.irmaaGetCalculatorContext ? window.irmaaGetCalculatorContext() : {};
  const payload = {
    email,
    source: form.dataset.source || "newsletter",
    page_path: window.location.pathname,
    consent_text: "Requested IRMAA bracket updates and planning reminders from irmaacheck.com.",
    calculator_context: {
      ...calculatorContext,
      attribution,
    },
  };

  try {
    const response = await fetch(`${POCKETBASE_URL}/api/collections/newsletter_signups/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Signup failed");
    form.reset();
    if (status) {
      status.innerHTML = `Signup saved. <a href="/irmaa-planning-checklist/" data-track-event="checklist_open_after_signup">Open the IRMAA planning checklist now</a>. Practical IRMAA updates will follow.`;
    }
    track("newsletter_signup", { source: payload.source });
  } catch {
    if (status) status.textContent = "We could not save that signup. Please try again in a moment.";
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-sponsor-inquiry-form]");
  if (!form) return;

  event.preventDefault();
  const status = form.querySelector("[data-sponsor-inquiry-status]");
  const formData = new FormData(form);
  const attribution = getAttribution();
  const payload = {
    company: String(formData.get("company") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    placement: String(formData.get("placement") || "unsure").trim(),
    message: String(formData.get("message") || "").trim(),
    page_path: window.location.pathname,
    source: attribution.source,
  };

  if (!payload.company || !payload.email) return;

  try {
    const response = await fetch(`${POCKETBASE_URL}/api/collections/sponsor_inquiries/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Sponsor inquiry failed");
    form.reset();
    if (status) status.textContent = "Thanks. We received your sponsor inquiry and will follow up soon.";
    track("sponsor_inquiry_form", { placement: payload.placement });
  } catch {
    if (status) status.textContent = "We could not save that inquiry. Please email sponsors@irmaacheck.com.";
  }
});
