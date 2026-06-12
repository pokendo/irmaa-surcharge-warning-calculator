import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

test("server module exports response helpers", async () => {
  const text = await readFile(join(root, "server.js"), "utf8");

  assert.match(text, /async function serveRequest/);
  assert.match(text, /404\.html/);
});

test("server exposes a lightweight health check endpoint", async () => {
  const text = await readFile(join(root, "server.js"), "utf8");
  const dockerfile = await readFile(join(root, "Dockerfile"), "utf8");

  assert.match(text, /url\.pathname === "\/healthz"/);
  assert.match(text, /status: "ok"/);
  assert.match(dockerfile, /HEALTHCHECK/);
  assert.match(dockerfile, /\/healthz/);
});

test("server host can be configured for Coolify containers", async () => {
  const text = await readFile(join(root, "server.js"), "utf8");

  assert.match(text, /process\.env\.HOST \|\| "0\.0\.0\.0"/);
  assert.match(text, /listen\(port, host/);
});

test("server permanently redirects duplicate and missing-slash page URLs", async () => {
  const text = await readFile(join(root, "server.js"), "utf8");

  assert.match(text, /response\.writeHead\(308/);
  assert.match(text, /pathname\.endsWith\("\/index\.html"\)/);
  assert.match(text, /redirectToCanonicalPath/);
});

test("production server enforces the canonical HTTPS origin", async () => {
  const text = await readFile(join(root, "server.js"), "utf8");

  assert.match(text, /CANONICAL_ORIGIN/);
  assert.match(text, /ENFORCE_CANONICAL_ORIGIN/);
  assert.match(text, /x-forwarded-host/);
  assert.match(text, /x-forwarded-proto/);
});

test("project exposes a production smoke-test script", async () => {
  const packageJson = await readFile(join(root, "package.json"), "utf8");
  const smokeScript = await readFile(join(root, "scripts", "smoke-test.js"), "utf8");

  assert.match(packageJson, /"smoke": "node scripts\/smoke-test\.js"/);
  assert.match(smokeScript, /\/healthz/);
  assert.match(smokeScript, /\/does-not-exist-smoke-test/);
  assert.match(smokeScript, /IRMAA Warning Calculator/);
  assert.match(smokeScript, /process\.argv/);
  assert.match(smokeScript, /--url/);
  assert.match(smokeScript, /startsWith\("--url="\)/);
});

test("deployment is gated by tests and the strict site audit", async () => {
  const packageJson = await readFile(join(root, "package.json"), "utf8");
  const workflow = await readFile(join(root, ".github", "workflows", "deploy-coolify.yml"), "utf8");

  assert.match(packageJson, /"audit": "node scripts\/site-audit\.js"/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run audit/);
  assert.ok(workflow.indexOf("npm test") < workflow.indexOf("Trigger Coolify deploy"));
  assert.ok(workflow.indexOf("npm run audit") < workflow.indexOf("Trigger Coolify deploy"));
});
