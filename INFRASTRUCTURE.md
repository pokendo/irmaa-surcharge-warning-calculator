# Infrastructure Context for Codex
## IRMAA Surcharge Warning Calculator

This document describes the hosting and deployment environment for this project. Read it before making infrastructure changes, adding environment variables, touching deployment config, or creating new services.

## Stack Overview

| Layer | Technology | Purpose |
| --- | --- | --- |
| Hosting provider | Hetzner Cloud | VPS / dedicated compute |
| Deployment platform | Coolify | Self-hosted PaaS running on Hetzner |
| Backend datastore | PocketBase | Self-hosted data, auth, and API service |
| Frontend | Static site | Served via Coolify |

## Project Identity

This project must stay separate from other ongoing projects.

- Production domain: `irmaacheck.com`
- Canonical HTTPS origin: `https://www.irmaacheck.com`
- Coolify app name: `irmaacheck`
- Coolify app UUID: `n2muhudfe48a2x48bc7edbou`
- GitHub repository: `https://github.com/pokendo/irmaa-surcharge-warning-calculator`
- PocketBase service name: `irmaacheck-pocketbase`
- PocketBase Coolify UUID: `pu9ifhjm8nj5qsoxs2jwxp1v`
- PocketBase configured URL: `https://pb.irmaacheck.com`
- Coolify resource boundary: create a new app/resource for `irmaacheck`; do not attach it to another site's stack.
- Local Git repository: initialized in this folder with commit `c07e2fa`.

## Runtime

The app runs with Node's built-in HTTP server. Coolify should set `PORT` normally; the app listens on `HOST=0.0.0.0` by default so the container can receive traffic. For local-only development, set `HOST=127.0.0.1` if needed.

```text
npm start
```

Coolify or an external uptime monitor can probe:

```text
/healthz
```

## Coolify Rules

Coolify deploys this app as its own isolated application or stack. Do not modify other Coolify applications, server-level settings, SSL certs, firewall rules, or containers belonging to other projects. Confirm the exact app name and domain before any deployment action.

Coolify setup target:

```text
App name: irmaacheck
Domains: https://www.irmaacheck.com, https://irmaacheck.com
Redirect direction: root/non-www to www
Git source: https://github.com/pokendo/irmaa-surcharge-warning-calculator
Build pack: Dockerfile
Health check path: /healthz
Start command: npm start
Internal port: 4173
```

Production verification:

```text
https://www.irmaacheck.com/healthz -> 200
https://www.irmaacheck.com/ -> 200
https://irmaacheck.com/ -> redirects to https://www.irmaacheck.com/
npm run smoke with SMOKE_BASE_URL=https://www.irmaacheck.com -> passed
```

## PocketBase Rules

PocketBase is the selected free backend until the site produces enough revenue to justify a paid hosted database. The current calculator still runs entirely in the browser, so do not add PocketBase dependencies until a planned feature needs them, such as email capture, saved scenarios, admin-managed bracket overrides, or lightweight event logging.

Do not reuse PocketBase services, data volumes, admin credentials, API rules, or backups from any other app. The `irmaacheck-pocketbase` resource and its `pocketbase-data` and `pocketbase-hooks` volumes belong only to this project.

PocketBase is running in the `irmaacheck` Coolify project, `production` environment. The service is healthy in Coolify and reachable at `https://pb.irmaacheck.com`. DNS for `pb.irmaacheck.com` points to `204.168.236.236`, HTTP redirects to HTTPS, and `/api/health` returns healthy.

PocketBase routing note: the Coolify service template originally generated proxy labels for an `sslip.io` hostname and expected public port `8080`. The saved compose file was backed up at `/data/coolify/services/pu9ifhjm8nj5qsoxs2jwxp1v/docker-compose.yml.bak-irmaacheck`, then the service labels were updated so Traefik routes `pb.irmaacheck.com` on normal HTTPS to the internal PocketBase port `8080`. Be careful when saving this service in Coolify; if Coolify regenerates labels, recheck `https://pb.irmaacheck.com/api/health`.

Admin setup should be completed only through this project's PocketBase admin path:

```text
https://pb.irmaacheck.com/_/
```

## Environment Variables

Document placeholders in `.env.example` if a feature needs them:

```text
HOST=0.0.0.0
PORT=4173
POCKETBASE_RESOURCE_NAME=irmaacheck-pocketbase
VITE_POCKETBASE_URL=https://pb.irmaacheck.com
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Never commit real secrets.

## Current Project Structure

This project is currently a static HTML/CSS/JS site with Node's built-in test runner:

```text
/
├── index.html
├── */index.html
├── src/
│   ├── app.js
│   ├── irmaa.js
│   └── *.test.js
├── styles.css
├── sitemap.xml
├── robots.txt
├── server.js
└── package.json
```

A future migration to Vite/Astro/React is allowed, but not required for the current static MVP.

## IRMAA Bracket Data — Annual Update Requirement

The IRMAA Bracket Data in `src/irmaa.js` must be updated every year when CMS announces new Medicare premium and IRMAA amounts, typically in October or November.

Annual update checklist:

1. Update thresholds and premium surcharge amounts in `src/irmaa.js`.
2. Update all year-specific titles, H1s, meta descriptions, page copy, sitemap URLs, and canonical URLs.
3. Add the new year page, such as `/irmaa-brackets-2027/`, while keeping the prior year live as historical content.
4. Add a date note to threshold-dependent pages.
5. Run the full test suite before deployment.
6. Publish within 48 hours of the CMS announcement when possible.

## Deployment Checklist

- [x] All tests pass locally with `npm.cmd test`.
- [x] No secrets are committed.
- [x] IRMAA bracket data matches current CMS published rates.
- [x] Calculator output says estimated or educational, never exact or guaranteed.
- [x] SSA-44 page clearly states that Roth conversions, capital gains, and home sales generally do not qualify as SSA life-changing events.
- [x] Ad placements are labeled Advertisement and do not push the calculator below the first viewport.
- [x] Mobile layout is checked at narrow widths before production deployment.
- [x] Production smoke checks pass against `https://www.irmaacheck.com`.

## Content Compliance Rules

- Always say estimated or educational; never exact or guaranteed.
- Never imply tax, legal, investment, or Medicare enrollment advice.
- Define IRMAA and MAGI on educational pages where the terms first appear.
- Use calm, plain-English language for adults 55+.
- Link to official Medicare, SSA, CMS, or IRS sources when citing rules and thresholds.
- The SSA-44 appeal page must make the non-qualifying one-time income warning prominent.
