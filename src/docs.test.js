import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

test("README documents the single-site template strategy", async () => {
  const readme = await readFile(join(root, "README.md"), "utf8");

  assert.match(readme, /One site, three page templates/);
  assert.match(readme, /Guided Financial Planner/);
  assert.match(readme, /Calm Civic Utility/);
  assert.match(readme, /Editorial Medicare Guide/);
});

test("SEO plan records ad placements by page template", async () => {
  const seoPlan = await readFile(join(root, "seo-plan.md"), "utf8");

  assert.match(seoPlan, /Ad Placement Strategy/);
  assert.match(seoPlan, /calculator and homepage/i);
  assert.match(seoPlan, /bracket and official-reference/i);
  assert.match(seoPlan, /blog and SEO explainer/i);
});

test("research brief captures the chosen design methodology", async () => {
  const brief = await readFile(join(root, "research-brief.md"), "utf8");

  assert.match(brief, /Chosen Design Direction/);
  assert.match(brief, /not three separate site versions/i);
});

test("AGENTS notes preserve the unified page-template decision", async () => {
  const agents = await readFile(join(root, "AGENTS.md"), "utf8");

  assert.match(agents, /Unified design strategy/);
  assert.match(agents, /one site with page-type templates/i);
});
