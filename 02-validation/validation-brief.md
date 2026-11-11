# Validation Brief: Signal

**Scenario:** 04, The Dashboard Nobody Reads
**Module:** 2, Validation
**Prototype:** V3 hypothesis test (`02-validation/prototype-v3.md`, `02-validation/v3/index.html`)

## Riskiest assumption
We believe that showing the most important insight and a recommended action first will help users find actionable information faster and reduce dashboard abandonment.

## Hypothesis
| Field | |
|---|---|
| **We believe** | Replace the 12-chart landing view with a dashboard highlighting the most important metric, a plain-language explanation, and a recommended action. |
| **Will cause** | Users identify actionable insights faster and are less likely to abandon the dashboard. |
| **For** | B2B SaaS product managers and growth leads who use the dashboard to make decisions. |
| **We'll know we're right when** | Reduce the dashboard bounce rate from 60% to below 40% and have at least 70% of test users identify the key insight and recommended action within 30 seconds. |

## Risk type
Usability (can they use it?)

## Success criteria
1. Reduce the dashboard bounce rate from 60% to below 40%.
2. At least 70% of test users identify the key insight and recommended action within 30 seconds.

## Kill switch
If the dashboard bounce rate remains at or above 60% after introducing a guided headline and recommended action, investigate whether we're highlighting the wrong metric and pivot if necessary.

## Context
| Metric | Meaning |
|---|---|
| 60% | Bounce rate: sessions under 15s with no interaction. |
| 12 | Charts on the default landing view. |
| 6 clicks | To reach the most-requested metric. |

- “I open it, see twelve charts, and have no idea which one I'm supposed to act on. So I close it.” (Marketing manager)
- “The number I need is in there, but it takes six clicks and three filters to find it.” (Growth analyst)

## Results
_TBD: no participant sessions yet. See `prototype-v3.md` once real sessions are recorded._
