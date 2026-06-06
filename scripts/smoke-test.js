const urlFlagIndex = process.argv.indexOf("--url");
const inlineUrlFlag = process.argv.find((arg) => arg.startsWith("--url="));
const cliBaseUrl = inlineUrlFlag?.slice("--url=".length) || (urlFlagIndex >= 0 ? process.argv[urlFlagIndex + 1] : "");
const baseUrl = cliBaseUrl || process.env.SMOKE_BASE_URL || "http://127.0.0.1:4173";

if (urlFlagIndex >= 0 && !cliBaseUrl) {
  throw new Error("--url requires a base URL");
}

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
