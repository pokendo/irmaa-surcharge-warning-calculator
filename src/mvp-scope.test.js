import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

for (const route of ["index.html", join("irmaa-calculator", "index.html")]) {
  test(`${route} keeps the launch calculator focused on the core Roth flow`, async () => {
    const html = await readFile(join(root, route), "utf8");

    assert.match(html, /Core launch flow/i);
    assert.match(html, /Optional advanced income events/i);
    assert.match(html, /<details class="advanced-events">/);
    assert.match(html, /<summary>Optional advanced income events<\/summary>/);
  });
}
