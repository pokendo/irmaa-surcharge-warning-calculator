import assert from "node:assert/strict";
import test from "node:test";

import { evaluateSsa44Timing } from "./ssa44-tool.js";

test("SSA-44 timing checker tells users to wait for an IRMAA notice first", () => {
  assert.deepEqual(
    evaluateSsa44Timing({ hasNotice: "no", lifeEvent: "work-stoppage", incomeLower: "yes", jointMedicare: "no" }),
    {
      status: "Wait for the notice",
      guidance: "SSA-44 is generally used after you receive an IRMAA notice. Keep your income estimate and life-changing event documentation ready.",
      spouseNote: "",
    },
  );
});

test("SSA-44 timing checker flags one-time income alone as a weak appeal reason", () => {
  assert.equal(
    evaluateSsa44Timing({ hasNotice: "yes", lifeEvent: "one-time-income", incomeLower: "yes", jointMedicare: "yes" }).status,
    "One-time income alone is usually not enough",
  );
});

test("SSA-44 timing checker points strong cases to the form and separate spouse filings", () => {
  const result = evaluateSsa44Timing({ hasNotice: "yes", lifeEvent: "work-reduction", incomeLower: "yes", jointMedicare: "yes" });

  assert.equal(result.status, "Review SSA-44 now");
  assert.match(result.guidance, /projected income/i);
  assert.match(result.spouseNote, /separate SSA-44/i);
});
