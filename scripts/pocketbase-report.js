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
const bySponsorPlacement = countBy(sponsorInquiries.items, "placement");
const bySponsorSource = countBy(sponsorInquiries.items, "source");

console.log("# IRMAA Check PocketBase Report");
console.log(`Generated: ${new Date().toISOString()}`);
console.log("");
console.log(`Site events: ${events.totalItems}`);
printCounts("Events by name", byEvent);
printCounts("Events by page", byPage);
console.log("");
console.log(`Newsletter signups: ${signups.totalItems}`);
printCounts("Signups by source", bySignupSource);
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
  const records = await request(`/api/collections/${collection}/records?perPage=200`, { headers });
  records.items.sort((a, b) => String(b.created || "").localeCompare(String(a.created || "")));
  return records;
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
    const value = item[key] || "unknown";
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
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
