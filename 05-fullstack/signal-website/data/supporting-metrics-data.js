// SYNTHETIC supporting metrics. Not real data.
// values: last 5 weeks, oldest first; the last value is this week.
// changeVsLastWeek and trend are stored as written in V4 (they are not recalculated here).
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

Signal.data.supportingMetrics = [
  { key: 'signups', name: 'Sign-ups', longName: 'Sign-ups', shortName: 'sign-ups', unit: 'count', values: [2880, 2941, 2905, 2924, 2912], changeVsLastWeek: '−0.4%', trend: 'Stable' },
  { key: 'activation', name: 'Activation rate', longName: 'Activation rate', shortName: 'activation', unit: 'percent', values: [41.8, 42.2, 41.9, 42.0, 42.1], changeVsLastWeek: '+0.3%', trend: 'Stable' },
  { key: 'trialToPaid', name: 'Trial-to-paid', longName: 'Trial-to-paid conversion', shortName: 'trial-to-paid', unit: 'percent', values: [14.2, 13.9, 14.1, 14.1, 14.0], changeVsLastWeek: '−0.6%', trend: 'Stable' },
  { key: 'bookings', name: 'New bookings', longName: 'New bookings', shortName: 'bookings', unit: 'currency', values: [108900, 112400, 109700, 110000, 111200], changeVsLastWeek: '+1.1%', trend: 'Stable' }
];

// Plain-language definitions for the "What do these metrics mean?" glossary.
Signal.data.glossary = [
  { term: 'Churn rate', definition: 'The percentage of existing customer accounts that cancel during a given period.' },
  { term: 'Activation rate', definition: 'The percentage of new users or accounts that complete a defined first-value action.' },
  { term: 'Trial-to-paid conversion', definition: 'The percentage of trial accounts that become paying customers.' },
  { term: 'New bookings', definition: 'The value of newly contracted business during the period.' }
];
