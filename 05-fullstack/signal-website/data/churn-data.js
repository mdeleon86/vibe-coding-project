// SYNTHETIC churn data. Not real customer or company data.
// Data only: no calculations and no display code. The numbers are the same as Signal V4.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

Signal.data.report = {
  // The week being reviewed, and the 26-week window the charts can show.
  weekLabel: 'Oct 26 – Nov 1, 2026',
  firstWeekStart: new Date(2026, 4, 4),   // week of May 4, 2026
  weeksOfHistory: 26
};

// Weekly account churn (%) for all plans, oldest first: 26 weeks, May 4 to Oct 26, 2026 (same as Signal V2).
// These are stored overall rates. Only the last 5 weeks have plan-level counts behind them (see plans below).
Signal.data.overallWeeklyChurn = [
  3.0, 3.2, 2.9, 3.1, 3.3, 3.0, 3.2, 3.4, 3.1, 2.9, 3.0, 3.2, 3.1,
  3.3, 3.0, 3.2, 3.1, 2.9, 3.2, 3.0, 3.3, 3.1, 3.3, 3.2, 3.2, 4.4
];

// Cancellations per plan for the last 5 weeks (Sep 28 to Oct 26), oldest first.
// Weekly totals (62, 66, 64, 64, 87 of 2,000 accounts) match the overall line: 3.1%, 3.3%, 3.2%, 3.2%, 4.4%.
// Known simplification: one starting-account count per plan, reused for every week.
Signal.data.plans = [
  { name: 'Starter', accounts: 900, color: '#FFC247', cancels: [44, 47, 45, 45, 68] },
  { name: 'Pro', accounts: 700, color: '#FF8738', cancels: [15, 16, 16, 15, 16] },
  { name: 'Enterprise', accounts: 400, color: '#29A8FF', cancels: [3, 3, 3, 4, 3] }
];
