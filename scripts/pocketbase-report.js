const baseUrl = process.env.POCKETBASE_URL || "https://pb.irmaacheck.com";
const email = process.env.POCKETBASE_ADMIN_EMAIL;
const password = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD before running this report.");
  process.exit(1);
}

const auth = await request("/api/collections/_superusers/auth-with-password", {
  method: "POST",
  body: { identity: email, password },
});

const headers = { Authorization: `Bearer ${auth.token}` };
const [events, signups, sponsorInquiries] = await Promise.all([
  listRecords("site_events"),
  listRecords("newsletter_signups"),
  listRecords("sponsor_inquiries"),
]);

const byEvent = countBy(events.items, "event_name");
const byPage = countBy(events.items, "page_path");
const bySignupSource = countBy(signups.items, "source");
const bySignupPage = countBy(signups.items, "page_path");
const bySponsorPlacement = countBy(sponsorInquiries.items, "placement");
const bySponsorSource = countBy(sponsorInquiries.items, "source");
const sponsorClicksByLabel = countBy(
  events.items.filter((event) => event.event_name === "sponsor_slot_click"),
  (event) => event.metadata?.label || "unknown"
);
const topPages = topCounts(byPage, 10);

console.log("# IRMAA Check PocketBase Report");
console.log(`Generated: ${new Date().toISOString()}`);
console.log("");
console.log(`Site events: ${events.totalItems}`);
printCounts("Events by name", byEvent);
printCounts("Events by page", byPage);
printCounts("Top pages", topPages);
console.log("");
console.log("Lead capture funnel");
console.log(`- Page views: ${byEvent.page_view || 0}`);
console.log(`- Sponsor slot clicks: ${byEvent.sponsor_slot_click || 0}`);
console.log(`- Newsletter signups: ${signups.totalItems}`);
console.log(`- Sponsor inquiries: ${sponsorInquiries.totalItems}`);
printCounts("Sponsor slot clicks by label", sponsorClicksByLabel);
console.log("");
console.log(`Newsletter signups: ${signups.totalItems}`);
printCounts("Signups by source", bySignupSource);
printCounts("Newsletter signups by page", bySignupPage);
console.log("");
console.log("Recent newsletter signups:");
for (const item of signups.items.slice(0, 10)) {
  console.log(`- ${item.created} | ${item.email} | ${item.source || "unknown"} | ${item.page_path || "/"}`);
}
console.log("");
console.log(`Sponsor inquiries: ${sponsorInquiries.totalItems}`);
printCounts("Sponsor inquiries by placement", bySponsorPlacement);
printCounts("Sponsor inquiries by source", bySponsorSource);
console.log("");
console.log("Recent sponsor inquiries:");
for (const item of sponsorInquiries.items.slice(0, 10)) {
  console.log(`- ${item.created} | ${item.company} | ${item.email} | ${item.placement || "unknown"} | ${item.source || "unknown"}`);
}

async function listRecords(collection) {
  const firstPage = await request(`/api/collections/${collection}/records?page=1&perPage=200`, { headers });
  const items = [...firstPage.items];
  const totalPages = firstPage.totalPages;

  for (let page = 1; page <= totalPages; page += 1) {
    if (page === 1) continue;
    const records = await request(`/api/collections/${collection}/records?page=${page}&perPage=200`, { headers });
    items.push(...records.items);
  }

  items.sort((a, b) => String(b.created || "").localeCompare(String(a.created || "")));
  return { ...firstPage, items };
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
  }

  return response.json();
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = typeof key === "function" ? key(item) : item[key] || "unknown";
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function topCounts(counts, limit) {
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit));
}

function printCounts(title, counts) {
  console.log("");
  console.log(title);
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!rows.length) {
    console.log("- none yet");
    return;
  }

  for (const [label, count] of rows) {
    console.log(`- ${label}: ${count}`);
  }
}
