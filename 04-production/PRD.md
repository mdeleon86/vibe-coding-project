# Living PRD

> Module 4 · Production Specs. Refactor for readability; extract a living PRD that stays true as the build evolves.

## Problem

_What user problem does this solve? Tie to the validated hypothesis._

The core analytics suite has a **60% bounce rate**: 60% of sessions last under 15 seconds with no interaction. The data is accurate, but users can't find what to act on.
- The default landing view shows **12 charts** with equal weight.
- The most-requested metric is **6 clicks** away.

> “I open it, see twelve charts, and have no idea which one I'm supposed to act on. So I close it.” (Marketing manager)
>
> “The number I need is in there, but it takes six clicks and three filters to find it.” (Growth analyst)

*The metrics and quotes come from the project brief. They were not collected or checked in this project.*

**Hypothesis** (from the Module 2 Validation Brief):

| Field | |
|---|---|
| We believe | Replace the 12-chart landing view with a dashboard highlighting the most important metric, a plain-language explanation, and a recommended action. |
| Will cause | Users identify actionable insights faster and are less likely to abandon the dashboard. |
| For | B2B SaaS product managers and growth leads who use the dashboard to make decisions. |
| We'll know we're right when | Reduce the dashboard bounce rate from 60% to below 40% and have at least 70% of test users identify the key insight and recommended action within 30 seconds. |

- **Riskiest assumption:** showing the most important insight and a recommended action first will help users find actionable information faster and reduce dashboard abandonment.
- **Risk type:** Usability (can they use it?)
- **Kill switch:** if the dashboard bounce rate remains at or above 60% after introducing a guided headline and recommended action, investigate whether we're highlighting the wrong metric and pivot if necessary.

> **Validation status: not yet validated.** The repo records no participant sessions. The V3 hypothesis-test prototype (`02-validation/v3/`) can measure the 30-second criterion and explicit abandonment in moderated tests, but its results table is still TBD. The bounce-rate criterion can only be measured with real traffic in production. This PRD treats the hypothesis as the bet being built toward, not a proven result.

---

## Users & jobs

- **Primary user:** a B2B SaaS
- **Job to be done:** When I open the weekly dashboard, I want to see right away which metric needs attention, why it moved, and what to do about it, so I can make a decision in the review instead of digging through charts.

## Scope

- **In:** "Customer Churn Intelligence" and a one-sentence subtitle.
- **Out (explicitly):** changing status, assigning owners, setting due dates, ticking off steps. V4 shows these read-only, as illustrative examples.

## Requirements

| # | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| 1 | Display the most important churn insight | Must | Overview displays churn rate, health status, plain-language explanation, and recommended action with owner, timing, and success measure. |
| 2 | Provide transparent churn calculations | Must | Show cancellations ÷ starting accounts × 100; plan contributions reconcile to overall churn (4.35%, displayed as 4.4% rounded). |
| 3 | The most important insight is selected by a defined rule from real metrics, not fixed in the code. | must | A written, testable ranking rule (for example, the largest move outside its healthy range, weighted by impact) picks the insight each week. Given the V4 sample data it picks account churn. V4 hard-codes churn, so this is not built. |
| 4 | KPI cards show value, status and a health scale for account churn rate, cancellations and Starter-plan churn. | must | Status comes from the thresholds in R10. The marker sits where the value falls within the scale's range. Boundary values are classified as defined (exactly 4.0% churn = Caution). Every status is shown as text, not only color. |
| 5 | The overall churn calculation is transparent. | must | "How is this calculated?" shows total cancellations ÷ total starting accounts × 100, with a row per plan, and the total reconciles to the headline after rounding (87 ÷ 2,000 = 4.35% → 4.4%). |
| 6 | Plan contributions add up to overall churn. | must | Each plan's contribution = its cancellations ÷ all starting accounts. Contributions add up to the overall rate (3.40 + 0.80 + 0.15 = 4.35 pts). The chart's segments are proportional. The page explains that a contribution is different from a plan's own churn rate. |
| 7 | Account Churn Trends by Plan, with a 5 / 12 / 26-week filter. | must | All Plans is weighted by account counts for every period shown, not an average of plan rates. Plan lines appear only for weeks with plan-level data, and any gap is labelled. Pointing at or tapping a week shows every series' value. |
| 8 | Real data: metrics come from a live source, not from the page. | must | Account, plan and cancellation data load from a backend on a schedule. The page shows the data's freshness. The calculations in R4–R6 give the same results on real data as on the sample. Not built in V4. |
| 9 | Measurement: the product records the events needed to judge the hypothesis. | must | The events in "Data & events" are recorded. A report can produce bounce rate (sessions under 15s with no interaction), time to first interaction, and the share of sessions that open Churn Detail or Recommended Actions. Not built in V4. |
| 10 | The plan breakdown shows each plan's rate, typical rate, change, status and share of the increase. | should | Rates and changes are colored by status and also labelled in text. Changes are rated by direction (a rise is worse). The conclusion names the plan contributing most. |

## Data & events

_What gets stored, what gets tracked._

**Mocked vs real in V4**

| Item | In V4 | Real? |
|---|---|---|
| Overall weekly churn, 26 weeks | Hand-written percentages in the page | **Mocked** |
| Plan-level cancellations, last 5 weeks | Hand-written counts (for example, Starter 44, 47, 45, 45, 68) | **Mocked** |
| Starting accounts per plan | One fixed count per plan (900 / 700 / 400), reused every week | **Mocked**, and simplified |
| Plan history before Sep 28 | Does not exist. The chart shows only the stored overall rates for those weeks | **Missing** |
| Supporting metrics (sign-ups, activation, trial-to-paid, bookings) | Hand-written values and 5-week series | **Mocked** |
| Health thresholds | Illustrative and written into the code: churn healthy below 3.5%, caution 3.5–4.0%, needs attention above 4.0%. Cancellations 70 / 80. Starter judged against its own typical week (+0.2 / +0.5 pts) | **Mocked**, not validated benchmarks |
| Recommended actions (owners, statuses, timing, activity) | Example roles and relative timing, labelled "Illustrative" | **Mocked** |
| Data fetch, loading, empty and error states | A timed simulation in the page (`?demo=slow / empty / error`) | **Mocked**, but the user-facing behavior is real |
| Calculations (weighted churn, contributions, typical week, status rules) | Real logic run on the mocked data | **Real logic**, mock inputs |
| Usage analytics | None | **Missing** |

**Data model needed for production**

| Entity | Key fields | Used for |
|---|---|---|
| Account | account_id, plan, start date, status | Starting accounts per plan per week |
| Cancellation | account_id, plan, cancelled_at, reason (optional) | Cancellations per plan per week |
| Weekly snapshot (derived) | week_start, plan, starting_accounts, cancellations | Churn rate per plan and overall (weighted), typical week (average of the prior 4 weeks), contributions |
| Supporting metrics (derived) | week_start, sign-ups, activations, trials, conversions, bookings | Supporting metric cards and sparklines |
| Threshold config | metric, healthy / caution / attention bounds, basis, owner | Status badges, scales, zones |
| Action | action_id, title, priority, status, owner, due date, linked metric, measure | Recommended Actions (once editing is in scope) |

**Formulas** (already implemented in V4):
- Churn = cancellations ÷ starting accounts × 100.
- All Plans = total cancellations ÷ total starting accounts, never an average of plan rates.
- Contribution = plan cancellations ÷ all starting accounts × 100.
- Typical week = the average of the 4 weeks before this one.

**Events to record** (proposed, none exist in V4):

| Event | Properties | Why |
|---|---|---|
| `dashboard_viewed` | session_id, user role, timestamp | Session start |
| `first_interaction` | ms since view, element | The bounce definition (no interaction within 15s) |
| `session_ended` | duration, interacted (yes/no) | Bounce rate against the 40% target and the 60% kill switch |
| `insight_viewed` | metric, status | Which insight was shown |
| `churn_detail_opened` | source (nav card, headline link, sidebar) | Whether people follow the insight |
| `range_changed` | 5 / 12 / 26 | Whether longer history is used |
| `calculation_expanded` | — | Whether the math explanation is needed |
| `recommended_actions_opened` | source | Path from insight to action |
| `action_viewed` | action_id | Interest in specific actions |

---

## Open questions

1. **Has the hypothesis been tested with real users?** The V3 and validation-brief results are still TBD. Run the moderated sessions (at least 5 per version) before treating the 30-second criterion as met.
2. **How is the most important insight chosen?** V4 always picks churn. The product needs a rule that works across metrics, and a fallback for weeks when nothing is unusual.
3. **What are the real thresholds, and who owns them?** All current ranges are illustrative. Plan-specific benchmarks are needed: Starter's normal churn is about 5.0%, which the shared overall thresholds already rate as "Needs attention".
4. **Inconsistent Starter rule:** the Overview rates Starter against its own typical week, while the Churn Detail table uses the shared overall thresholds. Pick one approach.
5. **Data source and freshness:** where do accounts and cancellations come from (billing system, CRM, data warehouse)? How often do they refresh? What does "this week" mean across time zones?
6. **Starting accounts:** V4 assumes a fixed count per plan. The product needs week-by-week counts, including accounts that change plans mid-week.
7. **Missing history:** plan-level data exists for only 5 weeks in the sample. How much history will the real source provide for the 12 and 26-week views?
8. **Does outreach reduce churn?** The recommended action is unproven. It needs a measured test, for example comparing contacted accounts with similar uncontacted ones, before it's presented as a proven fix.
9. **What counts as an at-risk account (SIG-2)?** Usage drop, support tickets, billing failures? Who builds the list?
10. **Should actions become real assignments?** If so: ownership, permissions, notifications and due dates are all out of scope today.
11. **How will production bounce be measured?** The definition (under 15s, no interaction) needs agreement on what counts as an interaction, for example whether scrolling counts.
12. **Privacy and access:** what account-level detail can each role see once real customer data is connected?
