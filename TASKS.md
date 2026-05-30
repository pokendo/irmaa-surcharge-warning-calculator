# IRMAA Surcharge Warning Calculator Tasks

## Current Status

The static MVP is built and deployed from this project folder. The site includes the homepage calculator, `/irmaa-calculator/`, `/irmaa-brackets-2026/`, supporting educational pages, scenario calculator pages, source notes, SEO files, a static Node server, Docker deployment files, and automated tests. The production site is live at `https://www.irmaacheck.com`.

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
- PocketBase service domain configured and reachable at `https://pb.irmaacheck.com`.
- Local Git repository initialized in this folder and committed at `c07e2fa`.
- GitHub repository `pokendo/irmaa-surcharge-warning-calculator` created and connected as `origin`.
- Coolify app resource `irmaacheck` created from the GitHub repo with Dockerfile build pack, domain `https://www.irmaacheck.com`, and exposed port `4173`.
- Coolify deployment completed and the app is running healthy.
- DNS records for `irmaacheck.com`, `www.irmaacheck.com`, and `pb.irmaacheck.com` point to `204.168.236.236`.
- Production SSL is working for `https://www.irmaacheck.com`.
- Root domain redirects to `https://www.irmaacheck.com`.
- Production smoke checks passed against `https://www.irmaacheck.com`.
- PocketBase HTTPS health check passed at `https://pb.irmaacheck.com/api/health`.
- PocketBase admin screen loads at `https://pb.irmaacheck.com/_/`.
- PocketBase first superuser was created for this isolated project and login was verified.
- PocketBase collections `newsletter_signups` and `site_events` created for project-owned lead capture and first-party analytics.
- Profitability surfaces added: newsletter signup, sponsor-slot tracking, and `/advertise/` sponsor inventory page.
- PocketBase report script added at `scripts/pocketbase-report.js` for early event and signup review.
- First sponsor outreach list and email draft created in `SPONSOR_OUTREACH.md`.
- First sponsor outreach Gmail drafts created for Income Lab and RothAware; remaining prospects need contact-form outreach or confirmed emails.
- Automatic deployment workflow added at `.github/workflows/deploy-coolify.yml` to trigger this project's Coolify deploy API on pushes to `main`.
- Coolify API access enabled and a deploy-only `COOLIFY_API_TOKEN` GitHub repository secret added for automatic deployments.
- Mobile header adjustment so the header does not cover the calculator on narrow screens.
- Automated test coverage for calculator logic, content, metadata, deployment notes, source links, and server behavior.

## Next Tasks

- Send or revise the two prepared Gmail sponsor drafts.
- Submit contact-form outreach for MaxiFi Planner, Savvy Medicare Planning, AdvisorEdgeOS, Rothology Partner Desk, and AdvisorCal.
- Send the first sponsor outreach batch and track replies.
- Review PocketBase `site_events` and `newsletter_signups` again after traffic starts; the first report on May 30, 2026 showed 0 events and 0 signups.

## Open Deployment Details

- Coolify app name: irmaacheck.
- Coolify app resource URL: `http://204.168.236.236:8000/project/c6f8y5vgefsrxoutm7a3kpus/environment/uqcfqwqf85rasi8hifvybn6k/application/n2muhudfe48a2x48bc7edbou`
- Coolify project URL: `http://204.168.236.236:8000/project/c6f8y5vgefsrxoutm7a3kpus/environment/uqcfqwqf85rasi8hifvybn6k`
- GitHub repository: `https://github.com/pokendo/irmaa-surcharge-warning-calculator`
- PocketBase service: `irmaacheck-pocketbase`.
- PocketBase service URL in Coolify: `http://204.168.236.236:8000/project/c6f8y5vgefsrxoutm7a3kpus/environment/uqcfqwqf85rasi8hifvybn6k/service/pu9ifhjm8nj5qsoxs2jwxp1v`
- PocketBase configured public URL: `https://pb.irmaacheck.com`
- Supabase is not being used now because the org is blocked by the free-project limit.
- Production domain: `https://www.irmaacheck.com`.
- Hetzner/Coolify dashboard: `http://204.168.236.236:8000/`
- Code source for deployment: local Git repository is connected to GitHub `origin/main`.
- Local Docker daemon was not running during the last local build attempt; Coolify's server-side builder is working.
