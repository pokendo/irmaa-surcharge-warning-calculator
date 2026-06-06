# IRMAA Reddit Pain Point Research

Research date: May 31, 2026

This research used Reddit posts as audience discovery, not as source copy. The resulting site pages are original explanations and tools, cross-checked against official SSA, Medicare, IRS, and existing Ubersuggest keyword notes in `KEYWORD_RESEARCH.md`.

## Reddit Patterns Found

### 1. SSA-44 timing confusion

Representative threads:

- `r/medicare`: `IRMAA, SSA-44 appeal` - retirement, stock sale, spouse filing, notice timing.
- `r/medicare`: `IRMAA - SSA-44 (One More Time)` - whether to wait for the two-year lookback year or file after current-year work stoppage.
- `r/SocialSecurity`: `Form SSA-44 IRMAA Appeal` - how long appeals take and what documentation people used.

Pain points:

- People do not know whether to file SSA-44 before or after an IRMAA notice.
- Married filing jointly users do not know whether both spouses need separate forms.
- People confuse one-time income with a qualifying life-changing event.

Built response:

- `/ssa-44-irmaa-appeal-timing-checker/`
- Existing support page: `/irmaa-appeal-ssa-44-form/`

Ubersuggest cross-reference:

- `ssa 44`: 6,600 volume.
- `ssa 44 form`: 4,400 volume, SEO difficulty 28.
- `ssa form 44`: 1,000 volume, SEO difficulty 26.
- `irmaa appeal form`: 1,000 volume, SEO difficulty 33.

### 2. MAGI confusion for working past 65

Representative threads:

- `r/medicare`: `IRMAA Medicare premiums` - whether 401(k) contributions reduce Medicare MAGI.
- `r/medicare`: `Medicare Part B and IRMAA Questions` - taxable Social Security, SALT, charitable deductions, and MAGI.

Pain points:

- Users know MAGI matters but do not know which MAGI formula applies.
- Users ask whether pre-tax retirement contributions, itemized deductions, and taxable Social Security count.
- Users mix up Part A enrollment with Part B and Part D IRMAA exposure.

Built response:

- `/does-401k-contribution-reduce-irmaa-magi/`
- Existing support page: `/medicare-magi/`

Ubersuggest cross-reference:

- `medicare magi`: 880 volume, CPC $3.72, SEO difficulty 20.
- `medicare modified adjusted gross income`: 720 volume, SEO difficulty 7.
- `is irmaa based on agi or taxable income`: 70 volume.
- `what income counts for irmaa`: 20 volume, SEO difficulty 6.

### 3. Roth conversion edge cases

Representative threads:

- `r/medicare`: `One-time 401(k) -> Roth conversion and Medicare IRMAA -- any way to appeal?`
- `r/personalfinance`: `IRMAA - converting non-deductible IRA contributions to ROTH`
- `r/FinancialPlanning`: `Roth conversion calculator that accounts for RMDs, social security taxes, and IRMAA?`

Pain points:

- Users want to know whether one-time Roth conversions can be exempted from IRMAA.
- Users do not know whether backdoor Roth conversions affect IRMAA.
- Users want free planning tools that combine Roth conversions, RMDs, Social Security, and IRMAA.

Built response:

- `/backdoor-roth-irmaa/`
- Existing support pages: `/does-roth-conversion-affect-irmaa/`, `/roth-conversion-irmaa-calculator/`

Ubersuggest cross-reference:

- `roth conversion irmaa`: 30 volume, CPC $13.25, SEO difficulty 16.
- Several long-tail Roth + Medicare terms showed low reported volume but low difficulty and strong sponsor fit.

### 4. Planning anxiety around cliffs and annual recalculation

Representative threads:

- `r/medicare`: `Look back 2 years for IRMAA surcharge?`
- `r/retirement`: Roth conversion and IRMAA schedule discussions.
- `r/tax`: 2026 IRMAA MAGI limits for Medicare premiums.

Pain points:

- Users do not know which tax year Medicare will use.
- Users fear going slightly over a bracket.
- Users are unsure whether IRMAA lasts forever or recalculates annually.

Built response:

- `/irmaa-two-year-lookback/`
- `/irmaa-cliff/`
- Existing support page: `/irmaa-brackets-2026/`

Ubersuggest cross-reference:

- `irmaa brackets 2026`: 8,100 volume, SEO difficulty 18.
- `irmaa thresholds 2026`: 480 volume.
- `medicare irmaa brackets 2026`: 880 volume.

## Next Build Ideas

- Continue expanding practical planning tools from new audience questions and measured Search Console queries.

## Additional Built Responses

- `/widow-penalty-irmaa/` for surviving spouses inheriting combined retirement income into a single filing status.
- `/does-social-security-count-toward-irmaa/` focused on taxable Social Security versus gross Social Security.
- `/municipal-bond-interest-irmaa/` explaining why tax-exempt interest counts toward Medicare MAGI.
- A Roth conversion schedule worksheet inside `/roth-conversion-irmaa-calculator/` comparing a planned annual conversion with filling the next IRMAA bracket.
