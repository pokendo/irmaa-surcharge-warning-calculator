const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:4173";

const checks = [
  {
    path: "/",
    status: 200,
    includes: "IRMAA Warning Calculator",
  },
  {
    path: "/irmaa-calculator/",
    status: 200,
    includes: "IRMAA Calculator",
  },
  {
    path: "/healthz",
    status: 200,
    includes: "\"status\":\"ok\"",
  },
  {
    path: "/does-not-exist-smoke-test",
    status: 404,
    includes: "Page not found",
  },
];

for (const check of checks) {
  const url = new URL(check.path, baseUrl);
  const response = await fetch(url);
  const body = await response.text();

  if (response.status !== check.status) {
    throw new Error(`${check.path} returned ${response.status}, expected ${check.status}`);
  }

  if (!body.includes(check.includes)) {
    throw new Error(`${check.path} did not include expected text: ${check.includes}`);
  }
}

console.log(`Smoke checks passed for ${baseUrl}`);
