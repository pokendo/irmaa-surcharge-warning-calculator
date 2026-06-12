import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = normalize(dirname(fileURLToPath(import.meta.url)));
const port = Number(process.env.PORT) || 4173;
const host = process.env.HOST || "0.0.0.0";
const canonicalOrigin = new URL(process.env.CANONICAL_ORIGIN || "https://www.irmaacheck.com");
const enforceCanonicalOrigin = process.env.ENFORCE_CANONICAL_ORIGIN === "true" || process.env.NODE_ENV === "production";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
};

function redirectToCanonicalPath(response, url, pathname) {
  response.writeHead(308, {
    "Cache-Control": "public, max-age=3600",
    Location: `${pathname}${url.search}`,
  });
  response.end();
}

async function serveRequest(request, response) {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (url.pathname === "/healthz") {
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ status: "ok", service: "irmaa-surcharge-warning-calculator" }));
    return;
  }

  const pathname = decodeURIComponent(url.pathname);

  if (enforceCanonicalOrigin) {
    const forwardedHost = String(request.headers["x-forwarded-host"] || request.headers.host || "").split(",")[0].trim();
    const forwardedProto = String(request.headers["x-forwarded-proto"] || "http").split(",")[0].trim();

    if (forwardedHost !== canonicalOrigin.host || forwardedProto !== canonicalOrigin.protocol.slice(0, -1)) {
      response.writeHead(308, {
        "Cache-Control": "public, max-age=3600",
        Location: new URL(`${url.pathname}${url.search}`, canonicalOrigin).href,
      });
      response.end();
      return;
    }
  }

  if (pathname.endsWith("/index.html")) {
    redirectToCanonicalPath(response, url, pathname.slice(0, -"index.html".length));
    return;
  }

  if (!pathname.endsWith("/") && !extname(pathname)) {
    try {
      await readFile(normalize(join(root, `${pathname}/index.html`)));
      redirectToCanonicalPath(response, url, `${url.pathname}/`);
      return;
    } catch {
      // Continue to the normal 404 response when no matching page directory exists.
    }
  }

  const requestedPath = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
  const filePath = normalize(join(root, requestedPath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, { "Content-Type": contentTypes[extname(filePath)] ?? "text/plain; charset=utf-8" });
    response.end(body);
  } catch {
    const body = await readFile(join(root, "404.html"));
    response.writeHead(404, {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex",
    });
    response.end(body);
  }
}

createServer(serveRequest).listen(port, host, () => {
  const displayHost = host === "0.0.0.0" ? "127.0.0.1" : host;
  console.log(`IRMAA calculator running at http://${displayHost}:${port}`);
});

export { serveRequest };
