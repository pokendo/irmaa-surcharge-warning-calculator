# IRMAA Surcharge Warning Calculator Tasks

## Current Status

The static MVP is built in this project folder. The site includes the homepage calculator, `/irmaa-calculator/`, `/irmaa-brackets-2026/`, supporting educational pages, scenario calculator pages, source notes, SEO files, a static Node server, Docker deployment files, and automated tests. The production domain is `irmaacheck.com`.

## Completed

- Core IRMAA bracket engine and calculator UI.
- Printable estimate summary and shareable estimate links.
- Launch SEO pages and scenario entry pages.
- Official 2026 CMS source link and May 18, 2026 review date.
- Hetzner/Coolify runtime prep with `HOST=0.0.0.0`, `Dockerfile`, `.dockerignore`, `.env.example`, and `/healthz`.
- Production URL metadata updated for `https://www.irmaacheck.com/`.
- Dedicated resource names selected: Coolify app name: irmaacheck; PocketBase service name: irmaacheck-pocketbase; production domain: irmaacheck.com.
- Coolify project `irmaacheck` created in its own `production` environment.
- PocketBase service `irmaacheck-pocketbase` created in the `irmaacheck` Coolify project and deployed healthy with isolated PocketBase data/hooks volumes.
- Mobile header adjustment so the header does not cover the calculator on narrow screens.
- Automated test coverage for calculator logic, content, metadata, deployment notes, source links, and server behavior.

## Next Tasks

- Provide or create a separate Git repository or Docker image source for Coolify to deploy.
- Add the app resource inside the existing Coolify project `irmaacheck`.
- Make the PocketBase public URL reachable: open/route port `8080` or assign a cleaner backend subdomain such as `pb.irmaacheck.com` in Coolify and DNS.
- Finish PocketBase admin setup at the project-specific `/_/` admin path after the public URL is reachable.
- Start Docker Desktop or use the server-side builder, then run a container build.
- Run `npm test` and `npm run smoke` against the local server before deployment.
- Deploy the app in Coolify as its own isolated application.
- Point the production domain to the Coolify app and verify SSL.
- Run post-deploy smoke checks against the production URL.
- Add analytics only after the production domain is confirmed.

## Open Deployment Details

- Coolify app name: irmaacheck.
- Coolify project URL: `http://204.168.236.236:8000/project/c6f8y5vgefsrxoutm7a3kpus/environment/uqcfqwqf85rasi8hifvybn6k`
- PocketBase service: `irmaacheck-pocketbase`.
- PocketBase service URL in Coolify: `http://204.168.236.236:8000/project/c6f8y5vgefsrxoutm7a3kpus/environment/uqcfqwqf85rasi8hifvybn6k/service/pu9ifhjm8nj5qsoxs2jwxp1v`
- PocketBase temporary public URL: `http://pocketbase-pu9ifhjm8nj5qsoxs2jwxp1v.204.168.236.236.sslip.io:8080`
- Supabase is not being used now because the org is blocked by the free-project limit.
- Production domain: irmaacheck.com.
- Hetzner/Coolify dashboard: `http://204.168.236.236:8000/`
- Code source for deployment: not yet connected; this folder is not currently a git repository and `gh` is not installed locally.
- Docker daemon: was not running during the last local build attempt.
