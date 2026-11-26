// Overview: the four KPI cards (account churn rate, cancellations, Starter-plan churn, supporting metrics), each with a status.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L, D) {
  var T = D.thresholds;
  function pctFmt(x) { return x.toFixed(1) + '%'; }

  function card(o) {
    return '<div class="ov-kpi' + (o.status === 'Needs attention' ? ' risk' : '') + '">' +
      '<p class="kpi-label">' + o.label + '</p>' +
      '<p class="ov-kpi-value">' + o.value + '</p>' +
      '<p class="kpi-sub">' + C.HealthBadge(o.status) + '</p>' +
      '<p class="kpi-sub">' + o.sub + '</p>' +
      (o.scale ? '<div class="kpi-scale">' + C.KpiScale(o.scale) + '</div>' : '') +
      '</div>';
  }

  C.OverviewKpiCards = {
    render: function (s) {
      var overall = L.overallThisWeek();

      // Account churn rate: the overall churn thresholds.
      var churnNow = Number(L.round1(s.rateNow)), churnStatus = L.churnHealth(churnNow), ct = T.churnRate;
      var churnCard = card({
        label: 'Account churn rate', value: L.round1(overall.now) + '%', status: overall.status,
        sub: (overall.changePts >= 0 ? '▲ +' : '▼ −') + Math.abs(overall.changeRelativeRounded) + '% vs typical week (' + L.round1(overall.typical) + '%)',
        scale: {
          min: T.scales.churnRate.min, max: T.scales.churnRate.max, caution: ct.cautionFrom, bad: ct.attentionAbove, value: churnNow, fmt: pctFmt,
          label: churnNow + '% is ' + (churnStatus === 'Healthy' ? 'below ' + pctFmt(ct.cautionFrom) : churnStatus === 'Caution' ? 'within ' + ct.cautionFrom.toFixed(1) + '–' + pctFmt(ct.attentionAbove) : 'above ' + pctFmt(ct.attentionAbove)),
          aria: 'Health scale for account churn rate: healthy below ' + pctFmt(ct.cautionFrom) + ', caution ' + ct.cautionFrom.toFixed(1) + ' to ' + pctFmt(ct.attentionAbove) +
            ', needs attention above ' + pctFmt(ct.attentionAbove) + '. Current ' + churnNow + '%: ' + churnStatus + '.'
        }
      });

      // Cancellations this week: the churn thresholds converted to counts.
      var c = L.cancellationThresholds(s.totalAccounts), n = s.totalNow;
      var cancelStatus = L.cancellationHealth(n, s.totalAccounts);
      var typicalCancels = Math.round(s.totalTypical), more = n - typicalCancels;
      var cancelsCard = card({
        label: 'Cancellations this week', value: n, status: cancelStatus,
        sub: 'Typical week: ' + typicalCancels + ' cancellations<br>' +
          (more >= 0 ? more + ' more than typical · ≈' : Math.abs(more) + ' fewer than typical · ≈') +
          Math.round(Math.abs(more) / typicalCancels * 100) + '% ' + (more >= 0 ? 'above' : 'below') + ' typical',
        scale: {
          min: T.scales.cancellations.min, max: T.scales.cancellations.max, caution: c.caution, bad: c.bad, value: n, fmt: function (x) { return String(x); },
          label: n + ' is ' + (cancelStatus === 'Healthy' ? 'below ' + c.caution : cancelStatus === 'Caution' ? 'within ' + c.caution + '–' + c.bad : 'above ' + c.bad),
          aria: 'Health scale for cancellations this week: healthy below ' + c.caution + ', caution ' + c.caution + ' to ' + c.bad + ', needs attention above ' +
            c.bad + '. Current ' + n + ': ' + cancelStatus + '.'
        }
      });

      // Starter-plan churn: compared with Starter's own typical week (see thresholds.js, starterOverviewRule).
      var st = L.starterVsTypical(s.starter);
      var starterCard = card({
        label: 'Starter-plan churn', value: L.round1(s.starter.rateNow) + '%', status: st.status,
        sub: 'Typical ' + L.round1(s.starter.rateTypical) + '% · drives ' + s.starter.shareOfIncrease + '% of the increase',
        scale: {
          min: st.typical - T.scales.starterVsTypical.below, max: st.typical + T.scales.starterVsTypical.above, caution: st.caution, bad: st.bad, value: st.now, fmt: pctFmt,
          label: L.signed(st.rise, 1) + ' pts vs typical ' + st.typical.toFixed(1) + '%',
          aria: 'Health scale for Starter-plan churn compared with its typical ' + st.typical.toFixed(1) + '%: healthy below ' + st.caution.toFixed(1) +
            '%, caution ' + st.caution.toFixed(1) + ' to ' + st.bad.toFixed(1) + '%, needs attention above ' + st.bad.toFixed(1) + '%. Current ' + st.now + '%: ' + st.status + '.'
        }
      });

      // Supporting metrics: how many are healthy.
      var metrics = D.supportingMetrics;
      var healthy = metrics.filter(function (m) { return L.supportingHealth(m) === 'Healthy'; }).length;
      var supportingCard = card({
        label: 'Supporting metrics', value: healthy + ' of ' + metrics.length, status: healthy === metrics.length ? 'Healthy' : 'Caution',
        sub: metrics.map(function (m) { return m.shortName; }).join(', ').replace(/^./, function (ch) { return ch.toUpperCase(); })
      });

      return '<section class="ov-kpis" aria-label="Key churn indicators">' + churnCard + cancelsCard + starterCard + supportingCard + '</section>';
    }
  };
})(Signal.components, Signal.logic, Signal.data);
