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
- PocketBase collections `newsletter_signups`, `site_events`, and `sponsor_inquiries` created for project-owned lead capture and first-party analytics.
- Profitability surfaces added: newsletter signup, sponsor-slot tracking, and `/advertise/` sponsor inventory page.
- Sponsor inquiry form added to `/advertise/` and connected to the project-owned `sponsor_inquiries` PocketBase collection.
- Starter sponsor package and sponsor FAQ added to `/advertise/` so outreach traffic has a clearer conversion path.
- Sponsor media kit section added to `/advertise/` with audience context, reporting expectations, and asset checklist for sponsor pilots.
- Lead capture attribution improved so UTM-tagged sponsor outreach links can be reflected in site events, sponsor inquiries, and PocketBase reporting.
- PocketBase report script added at `scripts/pocketbase-report.js` for early event and signup review.
- PocketBase report upgraded to show lead capture funnel, top pages, sponsor-slot clicks by label, newsletter signups by page, and sponsor inquiry source breakdown.
- Keyword research workspace added at `KEYWORD_RESEARCH.md` with Google Search Console verification notes, Ubersuggest batches, and first article priorities.
- Ubersuggest keyword results captured for core IRMAA terms, Roth conversions, RMDs, capital gains/home sales, SSA-44 appeals, and Medicare MAGI.
- Content roadmap added at `CONTENT_ROADMAP.md` with the first traffic-building article sprint and sponsor placement rules.
- Medicare MAGI and SSA-44 pages expanded from the keyword roadmap.
- Longtail Roth conversion article added at `/does-roth-conversion-affect-irmaa/`.
- Longtail capital gains article added at `/do-capital-gains-affect-medicare-premiums/`.
- Longtail RMD article added at `/do-rmds-affect-medicare-premiums/`.
- Longtail home sale article added at `/does-selling-a-house-affect-medicare-premiums/`.
- Homepage article discovery links added for the first organic content cluster.
- Google Search Console domain verification and sitemap submission completed.
- `/irmaa-brackets-2026/` strengthened for high-intent 2026 bracket queries with a quick-answer block, jump links, married-filing-separately table, Part B/Part D sections, expanded FAQ schema, and sponsor placements.
- `/how-to-avoid-irmaa/` strengthened for prevention searches with a planning checklist, Roth conversion, RMD, capital gains, QCD, and tax-exempt interest sections, internal calculator/article links, sponsor CTA, newsletter capture, and FAQ schema.
- `/what-is-irmaa/` expanded for beginner IRMAA searches with Part B/Part D basics, two-year lookback explanation, Medicare MAGI and SSA-44 routing, sponsor CTA, newsletter capture, and FAQ schema.
- `/medicare-part-b-premium-2026/` added for 2026 Medicare premium searches with Part B premium/deductible answers, IRMAA routing, official sources, sponsor CTA, newsletter capture, homepage discovery link, and sitemap entry.
- First sponsor outreach list and email draft created in `SPONSOR_OUTREACH.md`.
- Sponsor outreach variants added for advisor software prospects, Medicare education prospects, contact forms, and follow-up messages.
- First sponsor outreach Gmail drafts created for Income Lab and RothAware; remaining prospects need contact-form outreach or confirmed emails.
- Sponsor outreach tracker created at `SPONSOR_TRACKER.csv` to track first outreach, follow-up dates, statuses, UTM landing URLs, and notes.
- Automatic deployment workflow added at `.github/workflows/deploy-coolify.yml` to trigger this project's Coolify deploy API on pushes to `main`.
- Coolify API access enabled and a deploy-only `COOLIFY_API_TOKEN` GitHub repository secret added for automatic deployments.
- Mobile header adjustment so the header does not cover the calculator on narrow screens.
- PocketBase report run on May 31, 2026 showed 13 page views, 1 sponsor-slot click, 0 newsletter signups, and 0 saved sponsor inquiry records.
- Automated test coverage for calculator logic, content, metadata, deployment notes, source links, and server behavior.

## Next Tasks

- Continue content expansion from `CONTENT_ROADMAP.md`, prioritizing the next high-intent article or calculator page that can route visitors into lead capture and sponsor inventory.
- Send or revise the two prepared Gmail sponsor drafts.
- Submit contact-form outreach for MaxiFi Planner, Savvy Medicare Planning, AdvisorEdgeOS, Rothology Partner Desk, and AdvisorCal.
- Send the first sponsor outreach batch and track replies.
- Review PocketBase `site_events` and `newsletter_signups` again after traffic starts; the May 31, 2026 report showed tracking is working but lead capture is still at 0 signups.

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
