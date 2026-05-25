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
- PocketBase service domain configured in Coolify as `http://pb.irmaacheck.com:8080`.
- Local Git repository initialized in this folder and committed at `c07e2fa`.
- GitHub repository `pokendo/irmaa-surcharge-warning-calculator` created and connected as `origin`.
- Coolify app resource `irmaacheck` created from the GitHub repo with Dockerfile build pack, domain `https://www.irmaacheck.com`, and exposed port `4173`.
- Mobile header adjustment so the header does not cover the calculator on narrow screens.
- Automated test coverage for calculator logic, content, metadata, deployment notes, source links, and server behavior.

## Next Tasks

- Resolve the first Coolify deployment, which is currently stuck at "Building docker image started" and still shows the app as exited.
- Add DNS records for `irmaacheck.com`, `www.irmaacheck.com`, and `pb.irmaacheck.com` pointing to `204.168.236.236`.
- Make PocketBase public URL reachable by confirming port `8080` is routed/open for `pb.irmaacheck.com`.
- Finish PocketBase admin setup at the project-specific `/_/` admin path after the public URL is reachable.
- Start Docker Desktop or use the server-side builder, then run a container build.
- Run `npm test` and `npm run smoke` against the local server before deployment.
- Deploy the app in Coolify as its own isolated application.
- Point the production domain to the Coolify app and verify SSL.
- Run post-deploy smoke checks against the production URL.
- Add analytics only after the production domain is confirmed.

## Open Deployment Details

- Coolify app name: irmaacheck.
- Coolify app resource URL: `http://204.168.236.236:8000/project/c6f8y5vgefsrxoutm7a3kpus/environment/uqcfqwqf85rasi8hifvybn6k/application/n2muhudfe48a2x48bc7edbou`
- Coolify project URL: `http://204.168.236.236:8000/project/c6f8y5vgefsrxoutm7a3kpus/environment/uqcfqwqf85rasi8hifvybn6k`
- GitHub repository: `https://github.com/pokendo/irmaa-surcharge-warning-calculator`
- PocketBase service: `irmaacheck-pocketbase`.
- PocketBase service URL in Coolify: `http://204.168.236.236:8000/project/c6f8y5vgefsrxoutm7a3kpus/environment/uqcfqwqf85rasi8hifvybn6k/service/pu9ifhjm8nj5qsoxs2jwxp1v`
- PocketBase configured public URL: `http://pb.irmaacheck.com:8080`
- Supabase is not being used now because the org is blocked by the free-project limit.
- Production domain: irmaacheck.com.
- Hetzner/Coolify dashboard: `http://204.168.236.236:8000/`
- Code source for deployment: local Git repository is connected to GitHub `origin/main`.
- Docker daemon: was not running during the last local build attempt.
