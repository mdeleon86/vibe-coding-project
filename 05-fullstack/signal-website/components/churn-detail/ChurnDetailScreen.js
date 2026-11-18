// Screen 2 of 3: Churn Detail. Puts the Churn Detail pieces together, and runs the plan breakdown's
// loading / empty / error / ready states whenever the screen opens, the range changes, or the user presses Try again.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L, D) {
  var currentWeeks = 5, breakdownReady = false, requestId = 0;

  function kpi(label, value, sub, opts) {
    opts = opts || {};
    return '<div class="kpi"><p class="kpi-label">' + label + '</p><p class="kpi-value' + (opts.bad ? ' bad' : '') + '"' + (opts.valueId ? ' id="' + opts.valueId + '"' : '') + '>' +
      value + '</p><p class="kpi-sub"' + (opts.subId ? ' id="' + opts.subId + '"' : '') + '>' + sub + '</p></div>';
  }

  // The Cancellations KPI needs the plan counts, so it follows the breakdown's state.
  function setCancellationsKpi(state, s) {
    var value = document.getElementById('cd-cancels'), sub = document.getElementById('cd-cancels-sub');
    if (state === 'loading') {
      value.innerHTML = '<span class="sk sk-kpi" aria-hidden="true"></span><span class="visually-hidden">Loading</span>';
      sub.innerHTML = '<span class="sk sk-kpi-sub" aria-hidden="true"></span>';
    } else if (state === 'ready') {
      value.textContent = s.totalNow;
      sub.textContent = 'of ' + L.thousands(s.totalAccounts) + ' accounts · typical ' + Math.round(s.totalTypical);
    } else {
      value.textContent = '—';
      sub.textContent = '';
    }
  }

  function setBreakdownState(state, plans) {
    var screen = document.getElementById('screen-churn');
    document.getElementById('cd-break-panel').setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
    document.getElementById('cd-break-body').hidden = state !== 'ready';
    document.getElementById('cd-cta').hidden = state !== 'ready';
    document.getElementById('cd-calc').hidden = state !== 'ready';
    var wasReady = breakdownReady;
    breakdownReady = state === 'ready';
    if (wasReady !== breakdownReady && !screen.hidden) C.AccountChurnTrendsByPlan.draw(currentWeeks, breakdownReady);

    var stateBox = document.getElementById('cd-break-state');
    var s = state === 'ready' ? L.planSummary(plans) : null;
    setCancellationsKpi(state, s);
    if (state === 'loading') stateBox.innerHTML = C.PlanBreakdown.skeleton();
    else if (state === 'empty') {
      stateBox.innerHTML = C.PlanBreakdown.empty();
      var getStarted = document.getElementById('cd-get-started');
      getStarted.addEventListener('click', function () {
        var open = getStarted.getAttribute('aria-expanded') !== 'true';
        getStarted.setAttribute('aria-expanded', String(open));
        document.getElementById('cd-setup').hidden = !open;
      });
    } else if (state === 'error') {
      stateBox.innerHTML = C.PlanBreakdown.error();
      document.getElementById('cd-retry').addEventListener('click', function () { loadBreakdown(currentWeeks); });
    } else {
      stateBox.innerHTML = '';
      document.getElementById('cd-calc-body').innerHTML = C.ChurnCalculation.render(s);
      document.getElementById('cd-contrib').innerHTML = C.PlanContributionChart.render(s);
      C.PlanContributionChart.draw();
      document.getElementById('cd-contrib-legend').innerHTML = C.PlanContributionChart.legend(s);
      C.PlanBreakdown.fill(s);
      document.getElementById('cd-cta-text').innerHTML = '<strong>' + s.starter.plan.name + '-plan churn accounts for ' + s.starter.shareOfIncrease +
        '% of this week\'s increase</strong>, about ' + Math.round(s.extra) + ' more cancellations than a typical week. ' +
        numberWord(D.recommendedActions.length) + ' actions are recommended.';
    }
  }

  function numberWord(n) { return ['No', 'One', 'Two', 'Three', 'Four', 'Five'][n] || String(n); }

  // Fetches the breakdown for the selected period. Only the latest request is shown, so quick range changes can't show stale data.
  function loadBreakdown(weeks) {
    var id = ++requestId;
    setBreakdownState('loading');
    L.fetchPlanBreakdown(weeks).then(function (plans) {
      if (id !== requestId) return;
      setBreakdownState(plans.length ? 'ready' : 'empty', plans);
    }, function () {
      if (id !== requestId) return;
      setBreakdownState('error');
    });
  }

  C.ChurnDetailScreen = {
    headingId: 'cd-title',
    render: function () {
      var o = L.overallThisWeek(), t = D.thresholds.churnRate;
      var statusNote = o.status === 'Needs attention' ? 'above ' + t.attentionAbove.toFixed(1) + '%'
        : o.status === 'Caution' ? t.cautionFrom.toFixed(1) + '–' + t.attentionAbove.toFixed(1) + '%' : 'below ' + t.cautionFrom.toFixed(1) + '%';
      var rising = o.changePts > 0;
      return '<main class="wide" id="screen-churn" aria-labelledby="cd-title" hidden>' +
        '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/overview">Overview</a> <span aria-hidden="true">›</span> <span aria-current="page">Churn Detail</span></nav>' +
        '<div class="report-head"><div>' +
          '<h1 id="cd-title" class="page-title" tabindex="-1">Churn Detail</h1>' +
          '<p class="muted small">Account churn rate: share of active accounts that cancelled each week · Week of ' + D.report.weekLabel + ' <span class="synthetic">Synthetic data</span></p>' +
        '</div>' + C.HealthBadge(o.status) + '</div>' +
        '<div class="report-toolbar">' +
          '<div class="range" role="group" aria-label="Time range" id="cd-range">' +
            [5, 12, 26].map(function (n) { return '<button type="button" data-weeks="' + n + '" aria-pressed="' + (n === 5) + '">' + n + ' weeks</button>'; }).join('') +
          '</div>' +
          '<span class="toolbar-note">Compared with: typical week (average of the 4 weeks before this one)</span>' +
        '</div>' +
        '<div class="kpis">' +
          kpi('This week', L.round1(o.now) + '%', o.status + ' (' + statusNote + ')', { bad: o.status === 'Needs attention' }) +
          kpi('Typical week', L.round1(o.typical) + '%', 'Average of prior 4 weeks') +
          kpi('Change', L.signed(o.changePts, 1) + ' pts', L.signed(o.changeRelativeRounded, 0) + '% relative (' + o.changeRelative.toFixed(1) + '%, rounded)', { bad: rising }) +
          kpi('Cancellations', '', '', { valueId: 'cd-cancels', subId: 'cd-cancels-sub' }) +
        '</div>' +
        C.AccountChurnTrendsByPlan.render() +
        '<section class="panel calc-panel" id="cd-calc" aria-labelledby="cd-contrib-title" hidden>' +
          '<details class="calc"><summary>How is this calculated?</summary><div class="calc-body" id="cd-calc-body"></div></details>' +
          '<h2 class="contrib-title" id="cd-contrib-title">How each plan contributes to overall churn</h2>' +
          '<div class="contrib" id="cd-contrib"></div>' +
          '<p class="contrib-legend" id="cd-contrib-legend"></p>' +
        '</section>' +
        C.PlanBreakdown.render() +
        '<section class="cta" id="cd-cta" aria-label="Next step" hidden>' +
          '<p id="cd-cta-text"></p>' +
          '<a class="btn" href="#/actions/' + D.mostImportantInsight.action.primaryActionId + '">See recommended actions (' + D.recommendedActions.length + ') →</a>' +
        '</section>' +
      '</main>';
    },

    mount: function () {
      C.AccountChurnTrendsByPlan.mount();
      var range = document.getElementById('cd-range');
      range.addEventListener('click', function (evt) {
        var btn = evt.target.closest('button');
        if (!btn) return;
        range.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        currentWeeks = Number(btn.dataset.weeks);
        C.AccountChurnTrendsByPlan.draw(currentWeeks, breakdownReady);
        loadBreakdown(currentWeeks);
      });
      C.AccountChurnTrendsByPlan.draw(currentWeeks, breakdownReady);
    },

    // Called by the router each time this screen is shown. A fresh visit reloads the breakdown.
    show: function (isNewVisit) {
      C.AccountChurnTrendsByPlan.draw(currentWeeks, breakdownReady);
      if (isNewVisit) loadBreakdown(currentWeeks);
    },

    // Charts are drawn at their on-screen width, so they are redrawn after a resize.
    resize: function () {
      C.AccountChurnTrendsByPlan.draw(currentWeeks, breakdownReady);
      C.PlanContributionChart.draw();
    }
  };
})(Signal.components, Signal.logic, Signal.data);
