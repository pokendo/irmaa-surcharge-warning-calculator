const urlFlagIndex = process.argv.indexOf("--url");
const inlineUrlFlag = process.argv.find((arg) => arg.startsWith("--url="));
const cliBaseUrl = inlineUrlFlag?.slice("--url=".length) || (urlFlagIndex >= 0 ? process.argv[urlFlagIndex + 1] : "");
const baseUrl = new URL(cliBaseUrl || "https://www.irmaacheck.com/");
const failures = [];
const checked = new Set();
const retryableStatuses = [502, 503, 504];

async function checkUrl(url, label) {
  const key = url.href;
  if (checked.has(key)) return "";
  checked.add(key);

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (retryableStatuses.includes(response.status) && attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
        continue;
      }
      if (!response.ok) {
        failures.push(`${response.status} ${label}: ${url.href}`);
        return "";
      }
      return await response.text();
    } catch (error) {
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
        continue;
      }
      failures.push(`ERROR ${label}: ${url.href} (${error.message})`);
      return "";
    }
  }

  return "";
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

const sitemapUrl = new URL("/sitemap.xml", baseUrl);
const sitemap = await checkUrl(sitemapUrl, "sitemap");
const pageUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
  const listedUrl = new URL(match[1], baseUrl);
  return new URL(listedUrl.pathname, baseUrl);
});

for (const pageUrl of pageUrls) {
  const html = await checkUrl(pageUrl, "page");
  if (!html) continue;

  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  const images = [...html.matchAll(/img\s+[^>]*src="([^"]+)"/g)].map((match) => match[1]);

  for (const href of hrefs) {
    const url = sameSiteUrl(href, pageUrl);
    if (url) await checkUrl(url, "internal link");
  }

  for (const image of images) {
    const url = sameSiteUrl(image, pageUrl);
    if (url) await checkUrl(url, "image");
  }
}

if (failures.length) {
  console.error(`Site audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Site audit passed: ${pageUrls.length} sitemap pages and ${checked.size} unique URLs checked at ${baseUrl.origin}.`);
}
