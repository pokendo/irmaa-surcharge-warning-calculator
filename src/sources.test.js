import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { IRMAA_DATA_SOURCES, IRMAA_DATA_LAST_REVIEWED } from "./irmaa.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

test("IRMAA data records official source URLs and review date", () => {
  assert.equal(IRMAA_DATA_LAST_REVIEWED, "2026-05-18");
  assert.equal(IRMAA_DATA_SOURCES.cms2026Premiums.url, "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles");
  assert.equal(IRMAA_DATA_SOURCES.medicareCosts.url, "https://www.medicare.gov/basics/costs/medicare-costs");
  assert.equal(IRMAA_DATA_SOURCES.ssaLowerIrmaa.url, "https://www.ssa.gov/medicare/lower-irmaa");
});

for (const route of ["index.html", join("irmaa-calculator", "index.html"), join("irmaa-brackets-2026", "index.html"), join("medicare-part-b-premium-2026", "index.html")]) {
  test(`${route} links users to official IRMAA sources`, async () => {
    const html = await readFile(join(root, route), "utf8");

    assert.match(html, /Official sources/i);
    assert.match(html, /Last reviewed: May 18, 2026/);
    assert.match(html, /href="https:\/\/www\.cms\.gov\/newsroom\/fact-sheets\/2026-medicare-parts-b-premiums-deductibles"/);
    assert.match(html, /href="https:\/\/www\.medicare\.gov\/basics\/costs\/medicare-costs"/);
    assert.match(html, /href="https:\/\/www\.ssa\.gov\/medicare\/lower-irmaa"/);
  });
}
