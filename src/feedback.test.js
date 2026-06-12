import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

test("INFRASTRUCTURE documents hosting, PocketBase, and annual update rules", async () => {
  const text = await readFile(join(root, "INFRASTRUCTURE.md"), "utf8");

  assert.match(text, /Hetzner Cloud/);
  assert.match(text, /Coolify/);
  assert.match(text, /PocketBase/);
  assert.match(text, /IRMAA Bracket Data/);
  assert.match(text, /Annual Update Requirement/);
  assert.match(text, /\/healthz/);
});

test("environment example documents deploy-time placeholders without secrets", async () => {
  const text = await readFile(join(root, ".env.example"), "utf8");

  assert.match(text, /HOST=0\.0\.0\.0/);
  assert.match(text, /PORT=4173/);
  assert.match(text, /VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX/);
  assert.doesNotMatch(text, /sk-[A-Za-z0-9]/);
});

test("launch tasks document captures current handoff and remaining deployment work", async () => {
  const text = await readFile(join(root, "TASKS.md"), "utf8");

  assert.match(text, /Current status/i);
  assert.match(text, /Completed/i);
  assert.match(text, /Next tasks/i);
  assert.match(text, /Coolify app name: irmaacheck/i);
  assert.match(text, /production domain: irmaacheck\.com/i);
  assert.match(text, /Docker daemon/i);
});

test("infrastructure documents isolated PocketBase and Coolify resources", async () => {
  const text = await readFile(join(root, "INFRASTRUCTURE.md"), "utf8");
  const env = await readFile(join(root, ".env.example"), "utf8");

  assert.match(text, /Production domain: `irmaacheck\.com`/);
  assert.match(text, /Coolify app name: `irmaacheck`/);
  assert.match(text, /PocketBase service name: `irmaacheck-pocketbase`/);
  assert.match(text, /Do not reuse PocketBase services/i);
  assert.match(env, /POCKETBASE_RESOURCE_NAME=irmaacheck-pocketbase/);
  assert.match(env, /VITE_POCKETBASE_URL=https:\/\/pb\.irmaacheck\.com/);
});

test("profitability operations include sponsor outreach and PocketBase reporting", async () => {
  const outreach = await readFile(join(root, "SPONSOR_OUTREACH.md"), "utf8");
  const tracker = await readFile(join(root, "SPONSOR_TRACKER.csv"), "utf8");
  const contactQueue = await readFile(join(root, "CONTACT_FORM_OUTREACH_QUEUE.md"), "utf8");
  const keywords = await readFile(join(root, "KEYWORD_RESEARCH.md"), "utf8");
  const redditResearch = await readFile(join(root, "REDDIT_PAIN_POINTS.md"), "utf8");
  const roadmap = await readFile(join(root, "CONTENT_ROADMAP.md"), "utf8");
  const infra = await readFile(join(root, "INFRASTRUCTURE.md"), "utf8");
  const report = await readFile(join(root, "scripts", "pocketbase-report.js"), "utf8");
  const workflow = await readFile(join(root, ".github", "workflows", "deploy-coolify.yml"), "utf8");

  assert.match(outreach, /First Outreach List/i);
  assert.match(outreach, /IRMAA Check helps adults estimate/i);
  assert.match(outreach, /AdvisorEdgeOS/i);
  assert.match(outreach, /Savvy Medicare Planning/i);
  assert.match(outreach, /Advisor software version/i);
  assert.match(outreach, /Medicare education version/i);
  assert.match(outreach, /Contact form version/i);
  assert.match(outreach, /Follow-up template/i);
  assert.match(tracker, /Prospect,Category,Contact Path/);
  assert.match(tracker, /Sponsor Landing URL/);
  assert.match(tracker, /utm_campaign=sponsor_outreach/);
  assert.match(tracker, /irmaa-planning-checklist\/\?utm_source=savvy_medicare/);
  assert.match(tracker, /does-roth-conversion-affect-irmaa\/\?utm_source=rothaware/);
  assert.match(tracker, /medicare-part-b-premium-2026\/\?utm_source=savvy_medicare/);
  assert.match(tracker, /Income Lab/);
  assert.match(tracker, /First outreach sent/);
  assert.match(tracker, /Contact form submitted/);
  assert.match(contactQueue, /Prepared contact-form outreach queue/i);
  assert.match(contactQueue, /MaxiFi/);
  assert.match(contactQueue, /Savvy Medicare Planning/);
  assert.match(contactQueue, /AdvisorEdgeOS/);
  assert.match(contactQueue, /RothAware/);
  assert.match(contactQueue, /AdvisorCal/);
  assert.match(contactQueue, /owner approved sponsor outreach/i);
  assert.match(keywords, /Google Search Console Setup/);
  assert.match(keywords, /Ubersuggest Batch 1/);
  assert.match(keywords, /Ubersuggest Batch 6/);
  assert.match(keywords, /does roth conversion affect irmaa/);
  assert.match(keywords, /do capital gains affect medicare premiums/);
  assert.match(redditResearch, /SSA-44 timing confusion/);
  assert.match(redditResearch, /401\(k\) contributions reduce Medicare MAGI/);
  assert.match(redditResearch, /backdoor Roth conversions affect IRMAA/);
  assert.match(redditResearch, /Ubersuggest cross-reference/);
  assert.match(roadmap, /First Content Sprint/);
  assert.match(roadmap, /medicare modified adjusted gross income/);
  assert.match(roadmap, /does-roth-conversion-affect-irmaa/);
  assert.match(infra, /scripts\/pocketbase-report\.js/);
  assert.match(report, /newsletter_signups/);
  assert.match(report, /site_events/);
  assert.match(report, /sponsor_inquiries/);
  assert.match(report, /Lead capture funnel/);
  assert.match(report, /Sponsor slot clicks by label/);
  assert.match(report, /Newsletter signups by page/);
  assert.match(report, /topPages/);
  assert.match(report, /Sponsor inquiries by source/);
  assert.match(report, /for \(let page = 1; page <= totalPages; page \+= 1\)/);
  assert.match(report, /page=\$\{page\}&perPage=200/);
  assert.doesNotMatch(report, /F3jJYgf0aA9mEbKcQnUMl7sOPCpv/);
  assert.match(workflow, /Deploy to Coolify/);
  assert.match(workflow, /api\/v1\/deploy\?uuid=n2muhudfe48a2x48bc7edbou/);
  assert.match(workflow, /secrets\.COOLIFY_API_TOKEN/);
});

test("docs frame scenario pages as UX flows instead of primary SEO pages", async () => {
  const readme = await readFile(join(root, "README.md"), "utf8");
  const seoPlan = await readFile(join(root, "seo-plan.md"), "utf8");

  assert.match(readme, /Scenario pages are UX entry flows/);
  assert.match(seoPlan, /not primary SEO bets/i);
});

test("newsletter signup confirmation reinforces the checklist lead magnet", async () => {
  const profitScript = await readFile(join(root, "src", "profit.js"), "utf8");

  assert.match(profitScript, /Open the IRMAA planning checklist now/i);
  assert.match(profitScript, /href="\/irmaa-planning-checklist\/"/i);
  assert.match(profitScript, /data-track-event="checklist_open_after_signup"/i);
  assert.match(profitScript, /practical IRMAA updates/i);
});

test("lead forms show an in-progress state and prevent repeat submissions", async () => {
  const profitScript = await readFile(join(root, "src", "profit.js"), "utf8");

  assert.match(profitScript, /function setFormPending/);
  assert.match(profitScript, /form\.dataset\.submitting === "true"/);
  assert.match(profitScript, /button\.disabled = pending/);
  assert.match(profitScript, /setAttribute\("aria-busy", String\(pending\)\)/);
  assert.match(profitScript, /setFormPending\(form, status, "Saving signup\.\.\.", true\)/);
  assert.match(profitScript, /setFormPending\(form, status, "Sending inquiry\.\.\.", true\)/);
});

test("project includes a strict live-site indexability link and image audit", async () => {
  const auditScript = await readFile(join(root, "scripts", "site-audit.js"), "utf8");

  assert.match(auditScript, /sitemap\.xml/);
  assert.match(auditScript, /href=/);
  assert.match(auditScript, /img\\s\+\[\^>\]\*src=/);
  assert.match(auditScript, /Strict indexability audit passed/);
  assert.match(auditScript, /redirect: "manual"/);
  assert.match(auditScript, /CANONICAL MISMATCH/);
  assert.match(auditScript, /NOINDEX SITEMAP PAGE/);
  assert.match(auditScript, /missing trailing slash URL/);
  assert.match(auditScript, /duplicate index\.html URL/);
  assert.match(auditScript, /\[502, 503, 504\]/);
  assert.match(auditScript, /attempt < 3/);
  assert.match(auditScript, /process\.exitCode = 1/);
});

test("SSA-44 page prominently warns that common one-time income events usually do not qualify", async () => {
  const html = await readFile(join(root, "irmaa-appeal-ssa-44-form", "index.html"), "utf8");

  assert.match(html, /Roth conversions, capital gains, and home sales generally do not qualify/i);
  assert.match(html, /not a general fix for one-time income/i);
});
