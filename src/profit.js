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

function track(eventName, metadata = {}) {
  postPocketBase("site_events", {
    event_name: eventName,
    page_path: window.location.pathname,
    source: document.referrer ? new URL(document.referrer).hostname : "direct",
    metadata,
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

  const payload = {
    email,
    source: form.dataset.source || "newsletter",
    page_path: window.location.pathname,
    consent_text: "Requested IRMAA bracket updates and planning reminders from irmaacheck.com.",
    calculator_context: window.irmaaGetCalculatorContext ? window.irmaaGetCalculatorContext() : {},
  };

  try {
    const response = await fetch(`${POCKETBASE_URL}/api/collections/newsletter_signups/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Signup failed");
    form.reset();
    if (status) status.textContent = "You're on the list. We'll send practical IRMAA updates, not noise.";
    track("newsletter_signup", { source: payload.source });
  } catch {
    if (status) status.textContent = "We could not save that signup. Please try again in a moment.";
  }
});
