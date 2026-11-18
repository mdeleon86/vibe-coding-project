// User-facing messages for the Churn Detail loading, empty and error states (wording from the Module 3 Behavior prompt).
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

Signal.data.messages = {
  loading: 'Loading churn breakdown by plan.',
  empty: 'No churn data is available for this period. Try selecting a different date range.',
  error: 'We couldn\'t load the churn data. Please try again. Your dashboard data has not been changed.',

  // Shown when the empty state's Get Started button is pressed.
  getStarted: {
    title: 'How plan data gets into Signal',
    steps: [
      'Churn Detail reads weekly cancellations and starting accounts per plan from the weekly_plan_counts table in Supabase.',
      'For this demo, an admin loads the synthetic weeks by running supabase/seed.sql in the Supabase SQL Editor.',
      'Reload Signal, or choose a different date range above.'
    ],
    guideLabel: 'Open the setup guide',
    // No verified address for the setup guide yet, so the link is hidden. Put a working URL here to show it again.
    guideHref: ''
  }
};
