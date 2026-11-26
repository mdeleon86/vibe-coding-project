// ILLUSTRATIVE health thresholds, based on synthetic product assumptions, not verified industry benchmarks.
// Every health rating on every screen comes from this file (PRD requirement R10).
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

Signal.data.thresholds = {
  // Churn rate, lower is better. Healthy below 3.5%, Caution 3.5% to 4.0% (both ends included), Needs attention above 4.0%.
  // Cancellation counts use these same rates, converted to counts at the current number of starting accounts.
  churnRate: { cautionFrom: 3.5, attentionAbove: 4.0 },

  // A change in churn, in percentage points, rated by direction (any rise is worse).
  // Needs attention: a rise of more than 0.5 pts. Caution: a rise of 0.2 to 0.5 pts. Healthy: flat, falling or a smaller rise.
  churnChange: { cautionFrom: 0.2, attentionAbove: 0.5 },

  // Starter-plan churn uses two different rules today. Both are kept as they were in V4 (PRD open question 4):
  //   Overview KPI card   -> compared with Starter's own typical week, using churnChange.
  //   Churn Detail table  -> the shared churnRate thresholds, like every other plan.
  starterOverviewRule: 'churnChange',
  planBreakdownRule: 'churnRate',

  // Supporting metrics, higher is better: Healthy at or above healthyMin, Caution at or above cautionMin, otherwise Needs attention.
  supporting: {
    signups: { healthyMin: 2800, cautionMin: 2600 },
    activation: { healthyMin: 40.0, cautionMin: 37.0 },
    trialToPaid: { healthyMin: 13.0, cautionMin: 12.0 },
    bookings: { healthyMin: 100000, cautionMin: 90000 }
  },

  // Ranges drawn by the Overview KPI health scales (display ranges, not thresholds).
  scales: {
    churnRate: { min: 2.5, max: 5.0 },
    cancellations: { min: 50, max: 100 },
    starterVsTypical: { below: 1, above: 3 }   // from 1 pt below to 3 pts above Starter's typical week
  }
};
