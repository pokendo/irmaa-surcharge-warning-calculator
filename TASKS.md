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
- Founding sponsor pilot terms added to `/advertise/` with 3 founding sponsor slots, no auto-renewal language, and a 30-day performance snapshot.
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
- Longtail IRA withdrawal article added at `/do-ira-withdrawals-affect-medicare-premiums/`.
- Longtail home sale article added at `/does-selling-a-house-affect-medicare-premiums/`.
- Homepage article discovery links added for the first organic content cluster.
- Google Search Console domain verification and sitemap submission completed.
- `/irmaa-brackets-2026/` strengthened for high-intent 2026 bracket queries with a quick-answer block, jump links, married-filing-separately table, Part B/Part D sections, expanded FAQ schema, and sponsor placements.
- `/how-to-avoid-irmaa/` strengthened for prevention searches with a planning checklist, Roth conversion, RMD, capital gains, QCD, and tax-exempt interest sections, internal calculator/article links, sponsor CTA, newsletter capture, and FAQ schema.
- `/what-is-irmaa/` expanded for beginner IRMAA searches with Part B/Part D basics, two-year lookback explanation, Medicare MAGI and SSA-44 routing, sponsor CTA, newsletter capture, and FAQ schema.
- `/medicare-part-b-premium-2026/` added for 2026 Medicare premium searches with Part B premium/deductible answers, IRMAA routing, official sources, sponsor CTA, newsletter capture, homepage discovery link, and sitemap entry.
- `/irmaa-planning-checklist/` added as a lead magnet with decision checklists for Roth conversions, RMDs, capital gains, home sales, and SSA-44 assumptions, plus newsletter capture and sponsor CTA.
- YouTube transcript research turned into original easy-read education pages for the IRMAA two-year lookback, IRMAA cliff planning, ways to reduce IRMAA surprises, and Medicare MAGI vs ACA MAGI.
- Reddit pain point research added at `REDDIT_PAIN_POINTS.md` and turned into `/ssa-44-irmaa-appeal-timing-checker/`, `/does-401k-contribution-reduce-irmaa-magi/`, and `/backdoor-roth-irmaa/`.
- Homepage and calculator newsletter CTAs changed from generic bracket updates to the IRMAA planning checklist offer.
- Newsletter signup confirmation now reinforces that subscribers will receive the IRMAA planning checklist plus practical updates.
- High-intent education pages now route readers to the IRMAA planning checklist from their related-guide blocks.
- First sponsor outreach list and email draft created in `SPONSOR_OUTREACH.md`.
- Sponsor outreach variants added for advisor software prospects, Medicare education prospects, contact forms, and follow-up messages.
- First sponsor outreach Gmail drafts created for Income Lab and RothAware; remaining prospects need contact-form outreach or confirmed emails.
- Contact-form outreach queue prepared at `CONTACT_FORM_OUTREACH_QUEUE.md` for MaxiFi, Savvy Medicare Planning, AdvisorEdgeOS, RothAware, AdvisorCal, and Income Lab follow-up; messages are not submitted.
- Sponsor outreach tracker created at `SPONSOR_TRACKER.csv` to track first outreach, follow-up dates, statuses, UTM landing URLs, and notes.
- Sponsor outreach landing URLs updated to route prospects to intent-matched article and checklist pages instead of only `/advertise/`.
- Automatic deployment workflow added at `.github/workflows/deploy-coolify.yml` to trigger this project's Coolify deploy API on pushes to `main`.
- Coolify API access enabled and a deploy-only `COOLIFY_API_TOKEN` GitHub repository secret added for automatic deployments.
- Mobile header adjustment so the header does not cover the calculator on narrow screens.
- PocketBase report run on May 31, 2026 showed 13 page views, 1 sponsor-slot click, 0 newsletter signups, and 0 saved sponsor inquiry records.
- Automated test coverage for calculator logic, content, metadata, deployment notes, source links, and server behavior.
- Competitor analysis captured in `COMPETITOR_ANALYSIS.md` with design, content, calculator, and monetization gaps.
- "Max Roth conversion before next IRMAA bracket" result card added across calculator pages.
- Spouse household impact selector added across calculator pages so users can compare one Medicare enrollee vs both spouses on Medicare.
- Household monthly and annual IRMAA impact result cards added while preserving per-person surcharge amounts.
- Visual IRMAA cliff meter added across calculator pages to show distance to the first or next surcharge bracket.
- Premium-year selector added across calculator pages for 2025 and 2026, with income-year lookback shown in results and share links preserving the selected year.
- Medicare MAGI helper added across calculator pages so users can build base MAGI from AGI, tax-exempt interest, additional taxable Social Security, pension or consulting income, and planned Roth/RMD/capital-gain events.
- Social Security and IRMAA article added at `/does-social-security-count-toward-irmaa/`, with homepage discovery, sitemap entry, sponsor placements, related guides, and source links.
- Scenario comparison cards added across calculator pages so users can compare no added events, planned events, and fill-to-bracket outcomes.
- One-time income spike article added at `/one-time-income-spike-irmaa/`, with calculator routing, SSA-44 guidance, sponsor placements, homepage discovery, and sitemap entry.
- Result-level conversion actions added across calculator pages so high-intent users are routed to the IRMAA planning checklist and sponsor inquiry immediately after seeing an estimate.
- Printable estimate details now include room before the next bracket and max Roth conversion before the next bracket so users can save the planning decision, not just the surcharge amount.
- SSA-44 appeal timing checker strengthened with outcome-specific next steps for strong appeal cases, weak one-time-income cases, waiting for a notice, and separate-spouse filing reminders.
- IRMAA MAGI checklist page added at `/what-counts-toward-irmaa-magi/` with income-count guidance, newsletter capture, calculator routing, sponsor placement, homepage discovery, and sitemap entry.
- Married-couple IRMAA page added at `/do-both-spouses-pay-irmaa/` explaining per-enrollee surcharges, one spouse vs both spouses on Medicare, separate SSA-44 handling, newsletter capture, sponsor placement, homepage discovery, and sitemap entry.
- Article discovery improved with a dedicated `/guides/` library, a site-wide Guides navigation link, and an early homepage Browse all IRMAA guides action.
- IRMAA duration, annual recalculation, correction, and refund guide added at `/how-long-does-irmaa-last/`, with official SSA sources, appeal routing, newsletter capture, sponsor placement, homepage discovery, and guide-library discovery.
- Widow penalty and IRMAA guide added at `/widow-penalty-irmaa/`, with filing-status timeline, surviving-spouse income checklist, SSA-44 routing, newsletter capture, sponsor placement, and discovery links.
- Municipal bond interest and IRMAA guide added at `/municipal-bond-interest-irmaa/`, explaining why tax-exempt interest counts toward Medicare MAGI with calculator routing, lead capture, sponsor placement, and discovery links.
- Direct checklist email capture added inside calculator result actions so visitors can save the next step immediately after receiving an estimate.
- First sponsor outreach emails sent to Income Lab and RothAware on June 6, 2026 with intent-matched, UTM-tagged landing pages; follow-ups scheduled in the tracker for June 13.
- Rothology Partner Desk sponsor outreach sent and AdvisorCal sponsor contact form submitted on June 6, 2026; MaxiFi is prepared but blocked by CAPTCHA, Savvy Medicare timed out, and AdvisorEdgeOS has a broken contact path.
- Roth conversion schedule worksheet added to the Roth calculator, comparing the planned annual conversion with the fill-to-next-bracket amount and routing high-intent users into checklist signup.
- Successful newsletter signups now receive an immediate tracked link to the IRMAA planning checklist instead of waiting for an email delivery service.
- Guide library now places interactive IRMAA planning tools before the article collection so visitors can quickly enter a high-intent calculator flow.
- About, privacy, and contact pages added for sponsor trust and future display-ad review, with site-wide footer links and sitemap coverage.
- Homepage redesign started with a relevant retirement-planning hero image, ad-free first impression, concise confidence-led copy, a visible two-year lookback timeline, and a side-by-side calculator input/result workspace.
- June 6 Search Console baseline captured in `SEARCH_CONSOLE_BASELINE_2026-06-06.md`; the two-year lookback guide has the strongest early ranking signal.
- Purpose-built explanatory visuals added to the two-year-lookback and IRMAA-cliff guides so readers can understand the timing and threshold risks without reading a wall of text.

## Next Tasks

### Current Priority: Quality, Design, and Traffic

- Pause new sponsor outreach and sponsor follow-ups until the site is visually credible, major issues are resolved, and traffic demonstrates sponsor value.
- Complete a full production quality audit: real production smoke tests, broken internal links, browser console errors, mobile overflow, layout consistency, form behavior, and calculator correctness.
- Continue the homepage and shared page redesign so the site feels trustworthy, visually distinctive, and easier to scan without weakening calculator usability.
- Add purposeful visual assets such as clear IRMAA timeline, bracket-cliff, MAGI, and income-event graphics; avoid decorative stock imagery that does not help explain the decision.
- Continue traffic work after quality improvements: strengthen the two-year-lookback and calculator clusters, review Search Console queries, improve internal linking, and publish content based on measured demand.
- Review PocketBase analytics after meaningful organic traffic arrives, then define minimum traffic and conversion benchmarks before resuming sponsor outreach or applying for display ads.

### Deferred Until Traffic and Quality Benchmarks

- Complete additional sponsor contact forms or send sponsor follow-ups.
- Apply for display ad networks or promise paid sponsor inventory.

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
