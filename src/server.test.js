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
