# Prototype V2: Signal

**Scenario:** 04, The Dashboard Nobody Reads
**Launch path:** A, Copy & Customize
**Builder:** Claude Code (local); plain HTML/CSS and inline SVG in `01-velocity/v2/`
**Data:** synthetic, hand-written. No real customer or company data.
**Builds on:** Prototype V1 (`prototype-v1.md`)

## Why V2
After reviewing V1 myself, I found three weaknesses:
- It didn't explain why the churn rate mattered.
- It had no historical context.
- Its recommendation was too generic.

V2 improves the same single-page dashboard. It is not a rebuild: churn stays the top insight, and nothing unrelated was added.

## V2 improvements over V1
| Area | V1 | V2 |
|---|---|---|
| Churn headline | 4.4%, ▲ +36% vs typical week (3.2%) | 4.4%, ▲ **+38%** vs typical week (3.2%), plus a **Needs attention** badge. The +36% didn't match the numbers (see "Churn math" below) |
| Historical context | None | Inline-SVG line chart of 5 weeks of churn, with a dashed 3.2% benchmark and shaded health zones |
| Math transparency | None | Note under the chart explaining relative vs absolute change and how "typical week" is calculated |
| Recommended action | One sentence: "Ask Customer Success to contact at-risk Starter-plan accounts this week." | Headline action plus Who / What / When / Why / Measure, and a caveat that outreach is a test, not a proven fix |
| Supporting metrics | 4 cards: value, weekly change, "normal range" | Same values, plus a Healthy badge, a 5-week sparkline with a dashed Caution-threshold line, and a "Stable" label |
| Health system | None | Healthy (green) / Caution (amber) / Needs attention (red), always shown as dot plus word |
| Explanations | None | Two collapsed sections: a metrics glossary, and "How are health ratings decided?" with exact thresholds |

## Prompts and iterations
1. **Phase 2 improvement request.** Planned first and approved before building. The request arrived in two pastes because the first was cut off. In summary:
   - Add a plain-language glossary for churn rate, activation rate, trial-to-paid conversion and new bookings.
   - Add a 4–5 week churn line chart showing the current 4.4% and the 3.2% benchmark.
   - Make the recommendation specific: Who, What, When, Why, how to measure success, without implying outreach is proven.
   - Add sparklines to the four supporting cards, with data consistent with each card's stated change and a stable / improving / declining label.
   - Preserve the Lab 1 scope: improve rather than rebuild, keep churn on top, synthetic data only, lightweight HTML/CSS/SVG.
2. **Approval with adjustments:** "Reconcile the churn headline's +36% increase with the 3.2% baseline and 4.4% current rate. Use mathematically consistent figures and explain any rounding." Also: build the charts as inline SVG.
3. **Health indicator request.** Planned first and approved before building, again in two pastes. In summary:
   - Define green / yellow / red states labelled Healthy / Caution / Needs attention.
   - Apply them to all five metrics, accounting for direction (higher churn is worse; higher activation and conversion are better).
   - Add health zones to the churn chart and threshold markers to the sparklines, without distorting their scales.
   - Add a "Health ratings" explanation with the actual thresholds, noting they are illustrative.
4. **Approval with clarification:** "Make all threshold boundaries unambiguous, including exactly 4.0% churn."
5. **Fixes found during my own checks:**
   - The sparkline threshold lines were too faint; I made them stronger amber dashes.
   - The chart's zone labels were too small on a phone; I enlarged them.
6. **Labelled as V2:** the page title is "Signal V2 · Weekly metrics" and the footer says "Signal V2 prototype."

## Churn math
- The original headline said +36%, but 4.4% vs 3.2% is (4.4 − 3.2) ÷ 3.2 = **37.5%**, shown rounded as **+38%**.
- In absolute terms, churn is up **1.2 percentage points**.
- "Typical week" (3.2%) is the average of the four weeks before this one: (3.1 + 3.3 + 3.2 + 3.2) ÷ 4.

## Synthetic data
**Churn rate, by week:**

| Week of | Sep 28 | Oct 5 | Oct 12 | Oct 19 | Oct 26 (this week) |
|---|---|---|---|---|---|
| Churn rate | 3.1% | 3.3% | 3.2% | 3.2% | **4.4%** |

**Supporting metrics, 5 weeks (oldest → this week):**

| Metric | Values | Stated weekly change |
|---|---|---|
| Sign-ups | 2,880 · 2,941 · 2,905 · 2,924 · **2,912** | −0.4% |
| Activation rate | 41.8% · 42.2% · 41.9% · 42.0% · **42.1%** | +0.3% |
| Trial-to-paid | 14.2% · 13.9% · 14.1% · 14.1% · **14.0%** | −0.6% |
| New bookings | $108,900 · $112,400 · $109,700 · $110,000 · **$111,200** | +1.1% |

- The previous week's values for activation (41.97%) and trial-to-paid (14.085%) were chosen so that the stated changes match. They display rounded to one decimal.
- Each sparkline's vertical scale is fixed at ±12% of that metric's own 5-week average, the same for all four cards. That keeps normal week-to-week noise from looking exaggerated while keeping each Caution threshold in view.

## Health thresholds
These are illustrative, based on synthetic product assumptions, not verified industry benchmarks. Ratings use the value as shown on the dashboard.

| Metric | Better when | Healthy | Caution | Needs attention | This week |
|---|---|---|---|---|---|
| Churn rate | Lower | below 3.5% | 3.5% to 4.0%, including exactly 3.5% and 4.0% | above 4.0% | 4.4% → Needs attention |
| Sign-ups | Higher | 2,800 or more | 2,600 to 2,799 | fewer than 2,600 | 2,912 → Healthy |
| Activation rate | Higher | 40.0% or higher | 37.0% or higher, below 40.0% | below 37.0% | 42.1% → Healthy |
| Trial-to-paid | Higher | 13.0% or higher | 12.0% or higher, below 13.0% | below 12.0% | 14.0% → Healthy |
| New bookings | Higher | $100,000 or more | $90,000 or more, below $100,000 | below $90,000 | $111,200 → Healthy |

## Tests performed
All checks used a local preview in Claude Code's built-in browser.
- **Desktop (1024px):**
  - Chart labels, zone labels, benchmark and "4.4% this week" don't overlap.
  - All five badges show the correct state.
  - Sparkline threshold lines are visible.
  - Both collapsed sections open and show their full content.
- **Phone (375px):**
  - No horizontal scrolling (page width = 375px).
  - Chart text is readable and the action plan stacks into one column.
  - Metric cards show in 2 columns, with badges wrapping below the values.
- **Console:** no errors.
- **V2 copy:** `v2/index.html` and `v2/styles.css` are copies of the tested files. The only changes are the V2 label in the page title and footer. The page loads its stylesheet with `href="styles.css"`, so both files must stay in the same folder.

## Known limitations
- All data is synthetic and hand-written, and the thresholds are illustrative. Synthetic prototype data is not real usage evidence.
- It's a static snapshot of one week. There are no live data, filters or date controls.
- Not tested in other browsers, on real devices, with screen readers, or with a color-blindness simulation.
- Hover tooltips on the churn chart points rely on the browser's built-in tooltip. They were not separately tested and don't work on touch screens.
- No one other than the builder has used V2 yet, so it is unknown whether it helps people decide faster or better.

## Live URL
- **Published URL:** _TBD: not published yet_
- **Verified in a private/incognito window:** ☐ not yet

## Show & Swap
_Partner explores silently for 3 minutes with no verbal setup. Record only what actually happened._
- **Partner:** _TBD_
- **What they understood:** _TBD_
- **What confused them:** _TBD_
- **What assumption they thought was being tested:** _TBD_

## Remaining Lab 1 activities
- [ ] Publish V2 to a shareable URL (Netlify Drop: drag the `v2` folder).
- [ ] Open the URL in a private/incognito window to confirm it loads for someone who isn't signed in.
- [ ] Record the real URL and verification above.
- [ ] Run Show & Swap with a partner and record only their actual feedback.
- [ ] Save these files to the GitHub repository.
