# Iteration: Analytics, Sprint, Final Recommendation

> Module 6 · Evals & Iteration. Read the analytics, run an iteration sprint, present with evidence.

## What the evidence says

_What real usage showed: numbers if your tool has analytics, counted behaviour if it does not. Put the signal that matters on screen._

- **Primary signal:** Two testers successfully created three accounts and accessed the dashboard.
- **What moved:** Both testers reached the dashboard successfully without reported navigation difficulties.
- **What didn't:** Engagement, return visits, and completion of the dashboard's core task remain unmeasured. A signup rate-limit error was also observed.

_Observed behaviour: reach 1; core action 1; stall point recommendations; explained away The dashboard was too busy and needs to be simpler; own first run 1._

## Iteration sprint

| Change | Hypothesis | Result |
|---|---|---|
| Simplify the Executive Overview and Recommended Actions pages to emphasize the key churn insight and strategic recommendations. | Simplifying the dashboard will help users identify the most important churn insight and recommended action more quickly, with less confusion. | The redesigned dashboard was implemented, committed to GitHub, and successfully redeployed. All three pages passed functional checks. Improvements in engagement and time to insight have not yet been measured. |

## Peer feedback

Simplify the dashboard to make key information easier to understand and act on.

## The recommendation

**Decision:** ☐ Go  ☑ Iterate  ☐ Kill

_The evidence that justifies the call:_

Both testers accessed the dashboard successfully, but feedback identified excessive complexity. The redesign addressed this feedback and was successfully deployed. Further user testing is needed to determine whether the changes improve engagement, task completion, and time to insight.

## Final showcase

- **Demo link:** https://mdeleon86.github.io/vibe-coding-project/
- **The one-sentence story:** Signal transforms a complex customer churn dashboard into a focused executive decision-support tool through evidence-driven iteration.
- **Where it landed on the Confidence Line (M2 → now):** Progressed from hypothesis validation to a functional, database-connected product and an evidence-driven redesign. Deployment and functionality are confirmed, while improvements in user engagement and decision-making remain unvalidated.
