# Search Console Coverage Review - June 12, 2026

## Report Received

The Search Console coverage export reported:

- 3 pages with redirects.
- 1 not-found (404) page.
- 21 discovered but currently not indexed pages.
- 1 crawled but currently not indexed page.

The export contains counts but does not include example URLs, so individual Google-reported URLs cannot be matched from this file alone.

## Root Cause Found

The existing production audit followed redirects and treated the final successful response as a pass. It checked whether canonical sitemap pages and internal links eventually loaded, but it did not test:

- Missing-trailing-slash variants.
- Duplicate `/index.html` variants.
- Direct response status before redirects.
- Canonical-link agreement with sitemap URLs.
- Accidental `noindex` directives.
- Whether deployment was blocked when tests or audits failed.

The strict production audit found 79 URL normalization problems:

- All 40 `/index.html` variants returned duplicate `200` pages.
- All 39 non-home pages returned `404` without a trailing slash.

These variants can waste crawl attention, create duplicate URLs, and account for unexplained 404 coverage reports.

## Repair

- The server now permanently redirects missing-trailing-slash and `/index.html` variants to the canonical page URL with status `308`.
- Production requests that reach the app on a non-canonical host or protocol permanently redirect to `https://www.irmaacheck.com`.
- Real 404 responses include `X-Robots-Tag: noindex`.
- The site audit now checks direct responses without silently following redirects, canonical agreement, indexability, internal links, images, and every canonical URL variant.
- Deployment now runs the full test suite and strict local indexability audit before triggering Coolify.
- A scheduled GitHub Actions workflow runs the strict audit and smoke checks against production every day.

## Google-Controlled Statuses

`Discovered - currently not indexed` and `Crawled - currently not indexed` are Google indexing decisions, not HTTP failures. The site can make pages technically indexable and improve their uniqueness, usefulness, and internal discovery, but it cannot guarantee Google will index every submitted page.

After deployment, request Search Console validation for the 404 issue and review the indexing report after Google recrawls the affected URLs.
