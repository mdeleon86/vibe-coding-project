# Engineering Handoff Note

> Module 4 · Production Specs. Open the black box, make the build legible to an engineer.

## What this is

_One paragraph an engineer can read in 60 seconds._

Signal is a clickable, insight-first analytics dashboard prototype with three screens: Overview, Churn Detail, and Recommended Actions. It tests whether a headline metric, plain-language explanation, and recommended action can reduce a 60% dashboard bounce rate. The prototype uses synthetic data; Churn Detail now retrieves plan churn data from Supabase, while the other screens use local data. The hypothesis has not yet been validated with users.

## Architecture (plain language)

- **Frontend:** Signal uses plain HTML, CSS, and JavaScript without a framework or build step. The frontend is in 04-production/signal/. index.html loads the scripts, components are organized by screen (Overview, Churn Detail, Recommended Actions), logic is separated from display, and router.js handles navigation. The interface supports responsive layouts, churn charts, loading/error states, and action details.
- **Backend / data:** Supabase provides the hosted PostgreSQL backend with nine tables, two calculated views, and row-level security. Churn Detail retrieves plan data from Supabase through logic/churn-data-service.js. The connection was tested successfully, and all 20 database verification checks passed. Data remains synthetic, and Overview and Recommended Actions still use local JavaScript data files. Authentication and storage are not integrated into the prototype.
- **Key flows:** 1. Overview: Displays the headline churn metric, explanation, trend chart, and recommended action.
2. Churn Detail: Retrieves plan-level data from Supabase and displays churn calculations, charts, and loading, empty, or error states.
3. Date range: Selecting 5, 12, or 26 weeks updates the trend chart and reloads the plan breakdown.
4. Recommended Actions: Selecting an action opens its details and updates the URL.
5. Navigation: URL-based routing supports direct links and browser Back navigation.

## What's solid vs. what's duct tape

| Area | State | Notes |
|---|---|---|
| Calculations and Supabase | solid | Weighted churn calculations reconcile: 87 cancellations / 2,000 accounts = 4.35% (displayed as 4.4%). Supabase connection works, and all 20 database verification checks passed. |
| Data integration and testing | rough | Only Churn Detail reads Supabase; other screens use local synthetic data. No automated frontend tests or usage tracking. User hypothesis remains unvalidated. |

## Risks & assumptions for the team

Product: The hypothesis that an insight-first dashboard reduces the 60% bounce rate has not been validated with users. Recommended actions are illustrative, not proven interventions.
Data: All records are synthetic. Health thresholds are illustrative, and plan-level ratings use different comparison methods across screens.
Engineering: Only Churn Detail uses Supabase. Other screens still use local data. HTML rendering requires sanitization before using real or untrusted data. Automated tests and usage tracking are not implemented.
Assumptions: Modern browser, English locale, and a single-team prototype without authentication or user roles.

## How to run it

```
1. Open a terminal in the repository.
2. Run:
   cd "04-production/signal"
   python -m http.server 8000
3. Open http://localhost:8000/#/overview in a browser.
4. Navigate to Churn Detail to test the Supabase-backed plan breakdown.
5. Configure the Supabase project URL and publishable key in config.js using config.example.js as the reference. The database must already contain the required schema and seed data.
No package installation or build step is required.
```
