# Full-Stack: Data, Access Rules, Edge Cases, Deploy

> Module 5 · Full-Stack. Add data schemas, access rules, and edge cases; stress-test and deploy.

## Deployed link

_The working, shareable link that survives real users._

https://mdeleon86.github.io/vibe-coding-project/

## Data schema

| Entity | Key fields | Notes |
|---|---|---|
| Signal dashboard tables | plans; weekly_plan_counts; weekly_overall_churn; supporting_metrics; supporting_metric_values; health_thresholds; recommended_actions; action_steps; action_dependencies | Nine related Supabase tables store synthetic dashboard data. Two reporting views, weekly_churn and weekly_plan_churn, calculate churn metrics from stored data. Shared read access for authenticated users. |
| Nine related Supabase tables store synthetic dashboard data. Two reporting views, weekly_churn and weekly_plan_churn, calculate churn metrics from stored data. Shared read access for authenticated users. | user_id (UUID), email, created_at | Linked to Supabase Auth; automatically created at signup. Row-Level Security restricts each user to their own profile. |

## Access rules

_Who can see / do what? Where are the auth boundaries?_

Users must sign up or log in through Supabase Auth. Anonymous users cannot access dashboard data. Authenticated users can read the 9 shared dashboard tables and 2 reporting views, but cannot modify them. Row-Level Security (RLS) restricts profiles so each user can only read or update their own record using auth.uid() = user_id. New profiles are created automatically at signup. Dashboard data is shared across authenticated users, not isolated per account.

## Edge cases hardened

| Case | Before | After |
|---|---|---|
| Empty / first-run state | Empty data could leave the screen blank without guidance. | Shows a Get Started panel with setup steps when churn data is empty. |
| Bad / malicious input | Malformed or unexpected data could cause rendering errors without clear feedback. | Malformed data triggers an inline error with Retry. Authentication and RLS block unauthorized data access. |
| Failure / offline | Network failures could silently trigger fallback data without informing the user. | Network errors and timeouts display an inline error with Retry instead of silently showing fallback data. Simulated network failures and recovery were tested. |

## Stress test results

_What you threw at it, and what held / broke._

Kill Switch / Offline: PASS. With Chrome DevTools set to Offline, Signal displayed an inline error with Retry rather than freezing. Normal operation was restored afterward.

Network failure handling: Claude reported passing simulated tests for startup, authentication, data loading, timeouts, and retry behavior. These automated results were not independently verified.

Ghost User: BLOCKED. New-account signup returned 'Too many attempts. Wait a minute and try again,' including after waiting and refreshing. Existing-account login worked.

Decision: Proceed with the known signup rate-limit blocker documented. New-user onboarding remains unverified and requires follow-up.
