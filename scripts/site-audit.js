const urlFlagIndex = process.argv.indexOf("--url");
const inlineUrlFlag = process.argv.find((arg) => arg.startsWith("--url="));
const cliBaseUrl = inlineUrlFlag?.slice("--url=".length) || (urlFlagIndex >= 0 ? process.argv[urlFlagIndex + 1] : "");
const baseUrl = new URL(cliBaseUrl || "https://www.irmaacheck.com/");
const canonicalOrigin = new URL(process.env.CANONICAL_ORIGIN || "https://www.irmaacheck.com/");
const failures = [];
const checked = new Map();
const retryableStatuses = [502, 503, 504];

async function fetchDirect(url, label, expectedStatus = 200) {
  const key = `${expectedStatus} ${url.href}`;
  if (checked.has(key)) return checked.get(key);

  const request = (async () => {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const response = await fetch(url, {
          redirect: "manual",
          signal: AbortSignal.timeout(15000),
        });
        if (retryableStatuses.includes(response.status) && attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
          continue;
        }
        if (response.status !== expectedStatus) {
          const location = response.headers.get("location");
          failures.push(`${response.status} ${label}: ${url.href}${location ? ` -> ${location}` : ""}`);
          return null;
        }
        return {
          headers: response.headers,
          text: await response.text(),
        };
      } catch (error) {
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
          continue;
        }
        failures.push(`ERROR ${label}: ${url.href} (${error.message})`);
        return null;
      }
    }

    return null;
  })();

  checked.set(key, request);
  return request;
}

async function checkTextUrl(url, label) {
  const response = await fetchDirect(url, label);
  return response?.text || "";
}

function sameSiteUrl(value, pageUrl) {
  if (!value || value.startsWith("#") || value.startsWith("mailto:") || value.startsWith("tel:")) return null;

  try {
    const url = new URL(value, pageUrl);
    url.hash = "";
    return url.origin === baseUrl.origin ? url : null;
  } catch {
    return null;
  }
}

async function checkCanonicalRedirect(url, expectedUrl, label) {
  const response = await fetchDirect(url, label, 308);
  if (!response) return;

  const location = response.headers.get("location");
  const destination = location ? new URL(location, url).href : "";
  if (destination !== expectedUrl.href) {
    failures.push(`WRONG REDIRECT ${label}: ${url.href} -> ${location || "(missing location)"}, expected ${expectedUrl.href}`);
  }
}

const sitemapUrl = new URL("/sitemap.xml", baseUrl);
const sitemap = await checkTextUrl(sitemapUrl, "sitemap");
const sitemapEntries = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
  const canonicalUrl = new URL(match[1]);
  return {
    canonicalUrl,
    pageUrl: new URL(`${canonicalUrl.pathname}${canonicalUrl.search}`, baseUrl),
  };
});

await Promise.all(sitemapEntries.map(async ({ canonicalUrl, pageUrl }) => {
  if (canonicalUrl.origin !== canonicalOrigin.origin) {
    failures.push(`WRONG SITEMAP ORIGIN: ${canonicalUrl.href}`);
  }
  if (canonicalUrl.pathname !== "/" && !canonicalUrl.pathname.endsWith("/")) {
    failures.push(`NON-CANONICAL SITEMAP PATH: ${canonicalUrl.href}`);
  }

  const pageResponse = await fetchDirect(pageUrl, "sitemap page");
  const html = pageResponse?.text || "";
  if (!html) return;

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] || "";
  const metaRobots = html.match(/<meta name="robots" content="([^"]+)"/i)?.[1] || "";
  const xRobots = pageResponse.headers.get("x-robots-tag") || "";

  if (canonical !== canonicalUrl.href) {
    failures.push(`CANONICAL MISMATCH: ${pageUrl.href} declares ${canonical || "(missing)"}, expected ${canonicalUrl.href}`);
  }
  if (/noindex/i.test(`${metaRobots} ${xRobots}`)) {
    failures.push(`NOINDEX SITEMAP PAGE: ${pageUrl.href}`);
  }

  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  const images = [...html.matchAll(/img\s+[^>]*src="([^"]+)"/g)].map((match) => match[1]);

  await Promise.all(hrefs.map(async (href) => {
    const url = sameSiteUrl(href, pageUrl);
    if (url) await fetchDirect(url, "internal link");
  }));

  await Promise.all(images.map(async (image) => {
    const url = sameSiteUrl(image, pageUrl);
    if (url) await fetchDirect(url, "image");
  }));

  if (pageUrl.pathname === "/") {
    await checkCanonicalRedirect(new URL("/index.html", baseUrl), pageUrl, "duplicate index.html URL");
  } else {
    await Promise.all([
      checkCanonicalRedirect(new URL(`${pageUrl.pathname}index.html`, baseUrl), pageUrl, "duplicate index.html URL"),
      checkCanonicalRedirect(new URL(pageUrl.pathname.slice(0, -1), baseUrl), pageUrl, "missing trailing slash URL"),
    ]);
  }
}));

if (failures.length) {
  console.error(`Site audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Strict indexability audit passed: ${sitemapEntries.length} sitemap pages and ${checked.size} direct URL checks at ${baseUrl.origin}.`);
}
