// ILLUSTRATIVE recommended actions: example owners, statuses, timing and activity, not real assignments or deadlines.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

Signal.data.recommendedActions = [
  { id: 'SIG-1', primary: true, title: 'Reach out to at-risk Starter-plan accounts', priority: 'Urgent', status: 'Proposed',
    owner: 'Customer Success lead', initials: 'CS', timing: 'Start in the week after the review', labels: ['Churn', 'Starter plan'],
    desc: 'Customer Success and account managers contact the Starter-plan accounts most likely to cancel, starting with the highest-risk accounts from SIG-2.',
    why: 'Starter-plan churn rose to 7.6% this week (typical 5.0%) and accounts for 99% of the overall increase.',
    measure: 'Track accounts contacted, responses, and cancellations that follow.',
    steps: ['Get the at-risk Starter account list (SIG-2)', 'Agree the outreach message', 'Contact accounts, highest risk first', 'Log responses and outcomes (SIG-3)'],
    caveat: true, dependsOn: 'SIG-2', blocks: 'SIG-3' },
  { id: 'SIG-2', title: 'Identify Starter-plan accounts showing cancellation risk', priority: 'High', status: 'Proposed',
    owner: 'CS Operations', initials: 'CO', timing: 'Before outreach starts', labels: ['Churn', 'Starter plan', 'Data'],
    desc: 'Build a ranked list of Starter-plan accounts showing signs they may cancel, so outreach starts with the accounts most at risk.',
    why: 'Outreach (SIG-1) needs a focused list. Contacting every Starter account would spread the team too thin.',
    measure: 'A ranked list is ready and shared with Customer Success before outreach begins.',
    steps: ['Agree which signals count as cancellation risk', 'Pull the Starter-plan account list', 'Rank accounts by risk', 'Share the list with Customer Success'],
    blocks: 'SIG-1' },
  { id: 'SIG-3', title: 'Track outreach results: contacts, responses, cancellations', priority: 'Medium', status: 'Proposed',
    owner: 'Growth PM', initials: 'GP', timing: 'Review about 2 weeks after outreach starts', labels: ['Churn', 'Measurement'],
    desc: 'Measure what happens after outreach and report back at the next metrics review.',
    why: 'Outreach hasn\'t been shown to reduce churn here, so the results decide whether to keep doing it.',
    measure: 'Starter-plan churn in the weeks after outreach, compared with the 5.0% typical week and with accounts not yet contacted.',
    steps: ['Set up a simple tracking sheet', 'Record contacts and responses each week', 'Compare cancellations with the typical week', 'Report at the next metrics review'],
    dependsOn: 'SIG-1' }
];

// The same illustrative activity log is shown for every action.
Signal.data.actionActivity = [
  'Suggested by Signal from the Starter-plan churn increase',
  'Linked to metric: Account churn rate',
  'Owner shown as an example role, not a real assignment'
];

// The caution shown with outreach actions until outreach is shown to work.
Signal.data.outreachCaveat = 'Outreach hasn\'t been shown to reduce churn here. Treat this as a test and judge it by the measures above.';

// Wording for the executive Recommended Actions page. Numbers (churn rates, Starter's share of the increase)
// are calculated from churn-data.js by the components; only the words live here.
Signal.data.strategy = {
  subtitle: 'Strategic recommendations to mitigate business risks, improve customer retention, and drive measurable outcomes.',
  notice: 'Every recommendation, owner, timeline and step on this page is a proposal that shows how the work would be organized. ' +
    'None of it is a real assignment, deadline or result yet. Metric values come from synthetic demo data.',
  primary: {
    label: 'Primary Strategic Recommendation',
    headline: 'Improve Starter-plan customer retention',
    description: 'Initiate targeted outreach to customers most at risk of cancellation.',
    priority: 'High',
    owner: 'Customer Success',
    timeline: 'This week',
    outcome: 'Reduce customer losses and stabilize Starter-plan retention.',
    validation: 'Not yet validated: this outreach hasn\'t been shown to reduce churn here. Treat it as a test and judge it by the success measures below.'
  },
  // The execution plan, in dependency order. actionId links each step to its detailed action above.
  plan: [
    { actionId: 'SIG-2', title: 'Identify at-risk customers', summary: 'Determine which Starter-plan accounts require immediate attention.' },
    { actionId: 'SIG-1', title: 'Execute targeted retention outreach', summary: 'Prioritize engagement with customers most likely to cancel.' },
    { actionId: 'SIG-3', title: 'Measure retention outcomes', summary: 'Track outreach effectiveness, customer responses, and subsequent cancellations.' }
  ],
  // Desired outcomes are directions, not targets: the prototype has no validated targets.
  measuresNote: 'Current values are this week\'s figures. Desired outcomes are directions, not targets, and no results from the outreach exist yet.'
};
