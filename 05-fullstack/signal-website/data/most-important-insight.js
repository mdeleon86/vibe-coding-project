// The Overview's "most important insight" and its recommended next action.
// HARD-CODED: the prototype always features account churn. Choosing the insight by a rule is PRD requirement R2 (not built).
// The numbers in the headline (4.4%, +38%, 3.2%) are calculated from churn-data.js; only the wording lives here.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

Signal.data.mostImportantInsight = {
  metricName: 'Account churn rate',
  takeaway: 'More accounts are cancelling than usual, and almost all of the increase is coming from Starter-plan customers.',
  action: {
    text: 'Reach out to at-risk Starter-plan accounts this week.',
    plan: [
      ['Who', 'Customer Success lead and account managers'],
      ['What', 'Identify Starter-plan accounts showing cancellation risk and prioritize outreach'],
      ['When', 'Begin outreach this week'],
      ['Why', 'The increase in churn is concentrated among Starter-plan customers'],
      ['Measure', 'Track accounts contacted, responses, and cancellations that follow']
    ],
    primaryActionId: 'SIG-1'
  }
};
