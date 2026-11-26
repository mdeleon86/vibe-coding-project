// Churn math and health ratings. Turns the data files into answers; never touches the page.
// Formulas (PRD "Data & events"):
//   churn rate    = cancellations ÷ starting accounts × 100
//   All plans     = total cancellations ÷ total starting accounts (weighted, never an average of plan rates)
//   contribution  = a plan's cancellations ÷ ALL starting accounts × 100 (contributions add up to overall churn)
//   typical week  = the average of the 4 weeks before this one
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (L, D) {
  var T = D.thresholds;

  L.sum = function (a) { return a.reduce(function (s, x) { return s + x; }, 0); };
  L.pct = function (count, accounts) { return count / accounts * 100; };
  function average(a) { return L.sum(a) / a.length; }

  // ---------- Health ratings ----------
  // Churn rate (lower is better). Ratings use the value as shown, so round to one decimal first where it is displayed.
  L.churnHealth = function (v) {
    return v < T.churnRate.cautionFrom ? 'Healthy' : v <= T.churnRate.attentionAbove ? 'Caution' : 'Needs attention';
  };
  // A change in percentage points, rated by direction (any rise is worse).
  L.changeHealth = function (pts) {
    return pts > T.churnChange.attentionAbove ? 'Needs attention' : pts >= T.churnChange.cautionFrom ? 'Caution' : 'Healthy';
  };
  // Change between two rates as displayed (each rounded to one decimal first).
  L.changePts = function (now, typical) { return Number(L.round1(now)) - Number(L.round1(typical)); };
  // Supporting metrics (higher is better).
  L.supportingHealth = function (metric) {
    var t = T.supporting[metric.key], v = metric.values[metric.values.length - 1];
    return v >= t.healthyMin ? 'Healthy' : v >= t.cautionMin ? 'Caution' : 'Needs attention';
  };
  L.toneOf = function (status) { return status === 'Healthy' ? 'good' : status === 'Caution' ? 'caution' : 'bad'; };

  // ---------- Weeks ----------
  L.weekLabels = function () {
    var start = D.report.firstWeekStart;
    return D.overallWeeklyChurn.map(function (v, i) {
      return L.weekLabel(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i * 7));
    });
  };
  // Index of the first week that has plan-level counts (the plan data covers the most recent weeks only).
  L.planStartIndex = function () { return D.overallWeeklyChurn.length - D.plans[0].cancels.length; };

  // ---------- All plans, from the stored overall rates (used where no counts are needed) ----------
  L.overallThisWeek = function () {
    var w = D.overallWeeklyChurn, now = w[w.length - 1], typical = average(w.slice(-5, -1));
    var pts = Number(L.round1(now)) - Number(L.round1(typical));
    var relative = pts / Number(L.round1(typical)) * 100;
    return { now: now, typical: typical, changePts: pts, changeRelative: relative, changeRelativeRounded: Math.round(relative + 1e-9),
      status: L.churnHealth(Number(L.round1(now))) };
  };
  // Highest week before this one, within the last n weeks.
  L.previousHigh = function (n) {
    var vals = D.overallWeeklyChurn.slice(-n), prev = vals.slice(0, -1), high = Math.max.apply(null, prev);
    return { value: high, label: L.weekLabels().slice(-n)[prev.lastIndexOf(high)] };
  };

  // ---------- Plans, from the cancellation counts ----------
  // Everything the KPI cards, calculation, contribution chart and breakdown table need for this week.
  L.planSummary = function (plans) {
    var last = plans[0].cancels.length - 1;
    var totalAccounts = L.sum(plans.map(function (p) { return p.accounts; }));
    var stats = plans.map(function (p) {
      var now = p.cancels[last], typical = average(p.cancels.slice(last - 4, last));
      return { plan: p, now: now, typical: typical, rateNow: L.pct(now, p.accounts), rateTypical: L.pct(typical, p.accounts),
        contribution: L.pct(now, totalAccounts) };
    });
    var totalNow = L.sum(stats.map(function (s) { return s.now; }));
    var totalTypical = L.sum(stats.map(function (s) { return s.typical; }));
    var extra = totalNow - totalTypical;
    // Each plan's share of this week's increase in cancellations.
    stats.forEach(function (s) { s.shareOfIncrease = Math.round((s.now - s.typical) / extra * 100); });
    return {
      stats: stats,
      totalAccounts: totalAccounts,
      totalNow: totalNow,
      totalTypical: totalTypical,
      extra: extra,
      rateNow: L.pct(totalNow, totalAccounts),
      rateTypical: L.pct(totalTypical, totalAccounts),
      // The plan contributing the most to overall churn.
      biggestContributor: stats.slice().sort(function (a, b) { return b.contribution - a.contribution; })[0],
      starter: stats.filter(function (s) { return s.plan.name === 'Starter'; })[0]
    };
  };

  // Cancellation thresholds: the churn-rate thresholds converted to counts at the current number of starting accounts.
  L.cancellationThresholds = function (totalAccounts) {
    return { caution: Math.round(T.churnRate.cautionFrom / 100 * totalAccounts), bad: Math.round(T.churnRate.attentionAbove / 100 * totalAccounts) };
  };
  L.cancellationHealth = function (count, totalAccounts) {
    var c = L.cancellationThresholds(totalAccounts);
    return count < c.caution ? 'Healthy' : count <= c.bad ? 'Caution' : 'Needs attention';
  };

  // Starter-plan churn compared with Starter's own typical week (the Overview rule; see thresholds.js).
  L.starterVsTypical = function (starter) {
    var now = Number(L.round1(starter.rateNow)), typical = Number(L.round1(starter.rateTypical));
    var rise = Math.round((now - typical) * 10) / 10;
    return { now: now, typical: typical, rise: rise, status: L.changeHealth(rise),
      caution: typical + T.churnChange.cautionFrom, bad: typical + T.churnChange.attentionAbove };
  };

  // All plans (and each plan, where counts exist) for one week of the 26-week history.
  // includePlans is false until the plan breakdown has loaded.
  L.weekPoint = function (idx, plans, includePlans) {
    var labels = L.weekLabels(), k = idx - L.planStartIndex();
    if (k >= 0 && includePlans) {
      var totalAccounts = L.sum(plans.map(function (p) { return p.accounts; }));
      var cancels = L.sum(plans.map(function (p) { return p.cancels[k]; }));
      return { label: labels[idx], all: L.pct(cancels, totalAccounts), fromCounts: true,
        plans: plans.map(function (p) { return L.pct(p.cancels[k], p.accounts); }) };
    }
    return { label: labels[idx], all: D.overallWeeklyChurn[idx], fromCounts: false, plans: null };
  };
})(Signal.logic, Signal.data);
