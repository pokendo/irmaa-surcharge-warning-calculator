# IRMAA Surcharge Warning Calculator

A static web app that helps older US users estimate whether income changes could trigger Medicare IRMAA surcharges.

## Core User Problem

"If I do this Roth conversion, sell my house, take a large capital gain, or withdraw from retirement accounts, will my Medicare premiums jump?"

## Product Positioning

This is a decision-protection tool, not a generic Medicare explainer. The site should help people check their numbers before a large income event accidentally raises Medicare premiums.

## One site, three page templates

We are not building three separate site versions. The project uses one shared brand and design system with three page-type templates:

- **Guided Financial Planner**: used for the homepage and `/irmaa-calculator/`. This is the primary product experience, with a step-by-step calculator, calm result summary, and quiet sponsor placements.
- **Calm Civic Utility**: used for bracket tables and official-reference pages such as `/irmaa-brackets-2026/`. These pages should feel clear, table-forward, and source-oriented.
- **Editorial Medicare Guide**: used for blog and SEO explainers such as `/medicare-magi/`, `/what-is-irmaa/`, `/how-to-avoid-irmaa/`, and `/irmaa-appeal-ssa-44-form/`. These pages can use related guides, right-rail ads, and in-content ad separators.

## MVP

- Enter filing status.
- Enter modified adjusted gross income estimate.
- Add one-time income events:
  - Roth conversion
  - RMD
  - Capital gains
  - Home sale gain
  - Pension / part-time work
- Show estimated IRMAA bracket impact.
- Show estimated monthly and annual Medicare premium difference.
- Show "danger zone" amount before the next bracket.
- Generate a printable summary.
- Explain that final rules should be checked against official Medicare/SSA guidance.

## SEO Launch Pages

- `/irmaa-calculator/`
- `/irmaa-brackets-2026/`
- `/medicare-magi/`
- `/what-is-irmaa/`
- `/how-to-avoid-irmaa/`
- `/irmaa-appeal-ssa-44-form/`

## Second-Wave Scenario Pages

- `/roth-conversion-irmaa-calculator/`
- `/rmd-irmaa-calculator/`
- `/home-sale-medicare-premium-calculator/`
- `/capital-gains-irmaa-calculator/`
- `/ira-withdrawal-medicare-premium-calculator/`
- `/401k-withdrawal-medicare-premium-calculator/`
- `/qcd-irmaa/`

## Revenue

Start with display ads once traffic exists. Higher-value paths are Medicare education partners, financial advisor leads, retirement tax planning leads, and email capture for annual threshold updates.

Ad placements should be labeled clearly as `Advertisement`, remain visually quiet, and never push the calculator below the first viewport.

## Development

Run tests:

```powershell
npm.cmd test
```

Run the local static server:

```powershell
npm.cmd start
```

Then open `http://127.0.0.1:4173/`.

## Launch Scope Note

Scenario pages are UX entry flows, not primary SEO pages at launch. The primary SEO bets remain the bracket, calculator, MAGI, IRMAA definition, avoidance, and SSA-44 pages. Scenario pages exist so visitors from those hubs can enter the calculator with a specific income event in mind.
