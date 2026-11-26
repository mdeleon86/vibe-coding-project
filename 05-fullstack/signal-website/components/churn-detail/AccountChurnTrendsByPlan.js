// Churn Detail: "Account Churn Trends by Plan". Four lines (All plans, weighted, plus each plan) with health zones and a hover/tap readout.
// Drawn at its real on-screen width, so its text stays the same size on any screen; redrawn when the window resizes.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L, D) {
  var T = D.thresholds.churnRate;
  var DEFAULT_READOUT = 'Point at or tap a week to see each plan\'s churn.';
  var chartWeeks = [], chartStep = 0, plansShown = false;

  function cy(v) { return 210 - v * 24.25; } // 0% at the bottom, 8% at the top
  function cx(i) { return 56 + i * chartStep; }
  function pctText(v) { return v.toFixed(1) + '%'; }

  function weekText(w, i) {
    var text = 'Week of ' + w.label + (i === chartWeeks.length - 1 ? ' (this week)' : '') + ': All plans ' + L.round1(w.all) + '% (' + L.churnHealth(Number(L.round1(w.all))) + ')';
    if (w.plans) return text + ' · ' + D.plans.map(function (p, j) { return p.name + ' ' + L.round1(w.plans[j]) + '%'; }).join(' · ');
    return text + (plansShown ? ' · plan data not available for this week' : '');
  }

  // Same readout as weekText, with each series in its line color and the status in its health color.
  function weekHTML(w, i) {
    var status = L.churnHealth(Number(L.round1(w.all)));
    var sep = '<span class="ro-sep"> · </span>';
    var html = 'Week of ' + w.label + (i === chartWeeks.length - 1 ? ' (this week)' : '') + ': ' +
      '<span style="color:#FF525F">All plans ' + L.round1(w.all) + '%</span> <span class="ro-' + L.toneOf(status) + '">(' + status + ')</span>';
    if (w.plans) {
      return html + D.plans.map(function (p, j) { return sep + '<span style="color:' + p.color + '">' + p.name + ' ' + L.round1(w.plans[j]) + '%</span>'; }).join('');
    }
    return html + (plansShown ? sep + '<span class="ro-sep">plan data not available for this week</span>' : '');
  }

  C.AccountChurnTrendsByPlan = {
    render: function () {
      return '<section class="panel" aria-labelledby="cd-trend-title">' +
        '<div class="panel-head"><h2 id="cd-trend-title">Account Churn Trends by Plan</h2><span class="muted small">Weekly churn rate · Synthetic data</span></div>' +
        '<p class="cd-summary" id="cd-summary"></p>' +
        '<ul class="trend-legend" aria-label="Chart legend">' +
          '<li><span class="lg-line lg-all" aria-hidden="true"></span>All plans (weighted)</li>' +
          D.plans.map(function (p) { return '<li><span class="lg-line" style="background:' + p.color + '" aria-hidden="true"></span>' + p.name + '</li>'; }).join('') +
        '</ul>' +
        '<svg class="report-chart" id="cd-chart" viewBox="0 0 640 250" role="img" aria-labelledby="cd-chart-title cd-chart-desc"></svg>' +
        '<p class="readout" id="cd-readout"></p>' +
        '<p class="threshold-note" id="cd-data-note"></p>' +
      '</section>';
    },

    // Draws the last n weeks. showPlans is true once the plan breakdown has loaded; until then only All plans is drawn.
    draw: function (n, showPlans) {
      plansShown = showPlans;
      var chart = document.getElementById('cd-chart');
      var W = Math.max(320, Math.round(chart.getBoundingClientRect().width) || 640);
      chart.setAttribute('viewBox', '0 0 ' + W + ' 250');
      var R = W - 64, ZR = W - 20; // R: last week's x; the space to its right holds the latest-value label
      var total = D.overallWeeklyChurn.length;
      chartWeeks = [];
      for (var idx = total - n; idx < total; idx++) chartWeeks.push(L.weekPoint(idx, D.plans, showPlans));
      var last = chartWeeks.length - 1;
      chartStep = (R - 56) / last;
      var every = n <= 5 ? 1 : n <= 12 ? 3 : 5;
      var typical = L.round1(L.overallThisWeek().typical), typicalY = cy(Number(typical));
      var s = '<title id="cd-chart-title">Account churn trends by plan, last ' + n + ' weeks. Synthetic data.</title>' +
        '<desc id="cd-chart-desc">' + chartWeeks.map(weekText).join('. ') + '. Typical week, all plans: ' + typical + '%.</desc>' +
        '<rect class="zone-bad" x="40" y="' + cy(8) + '" width="' + (ZR - 40) + '" height="' + (cy(T.attentionAbove) - cy(8)) + '"/>' +
        '<rect class="zone-caution" x="40" y="' + cy(T.attentionAbove) + '" width="' + (ZR - 40) + '" height="' + (cy(T.cautionFrom) - cy(T.attentionAbove)) + '"/>' +
        '<rect class="zone-good" x="40" y="' + cy(T.cautionFrom) + '" width="' + (ZR - 40) + '" height="' + (cy(0) - cy(T.cautionFrom)) + '"/>' +
        '<g class="zone-labels"><text class="bad" x="46" y="' + (cy(8) + 13) + '">Needs attention (above ' + pctText(T.attentionAbove) + ')</text>' +
        '<text class="good" x="46" y="' + (cy(0) - 6) + '">Healthy (below ' + pctText(T.cautionFrom) + ')</text></g>' +
        '<g class="grid">' + [2, 4, 6, 8].map(function (t) { return '<line x1="40" x2="' + ZR + '" y1="' + cy(t) + '" y2="' + cy(t) + '"/>'; }).join('') + '</g>' +
        [0, 2, 4, 6, 8].map(function (t) { return '<text x="34" y="' + (cy(t) + 4) + '" text-anchor="end">' + t + '%</text>'; }).join('');
      for (var i = last; i >= 0; i -= every) {
        s += '<text x="' + cx(i) + '" y="232" text-anchor="middle">' + chartWeeks[i].label + '</text>';
      }
      s += '<line class="benchmark" x1="40" x2="' + ZR + '" y1="' + typicalY + '" y2="' + typicalY + '"/>' +
        '<text class="benchmark-label" x="' + ZR + '" y="' + (typicalY + 16) + '" text-anchor="end">Typical week: ' + typical + '%</text>';
      // Plan lines first, so All plans draws on top of them.
      D.plans.forEach(function (p, j) {
        var pts = [];
        chartWeeks.forEach(function (w, i) { if (w.plans) pts.push(cx(i) + ',' + cy(w.plans[j])); });
        if (pts.length) s += '<polyline class="pl-line" stroke="' + p.color + '" points="' + pts.join(' ') + '"/>';
      });
      s += '<polyline class="all-line" points="' + chartWeeks.map(function (w, i) { return cx(i) + ',' + cy(w.all); }).join(' ') + '"/>';
      s += '<text class="now-value" x="' + (cx(last) + 12) + '" y="' + (cy(chartWeeks[last].all) + 6) + '">' + L.round1(chartWeeks[last].all) + '%</text>' +
        '<line class="guide" x1="0" x2="0" y1="' + cy(8) + '" y2="' + cy(0) + '" visibility="hidden"/>' +
        '<rect class="hit" x="40" y="' + cy(8) + '" width="' + (ZR - 40) + '" height="' + (cy(0) - cy(8)) + '" fill="transparent"/>';
      chart.innerHTML = s;
      document.getElementById('cd-readout').textContent = DEFAULT_READOUT;

      var high = L.previousHigh(n), now = D.overallWeeklyChurn[total - 1];
      document.getElementById('cd-summary').textContent = 'All plans churn this week (' + pctText(now) + ') is the highest in the last ' + n + ' weeks. Previous high: ' +
        high.value.toFixed(1) + '%, week of ' + high.label + '.';
      var accounts = L.thousands(L.sum(D.plans.map(function (p) { return p.accounts; })));
      document.getElementById('cd-data-note').innerHTML = '<span class="illustrative">Illustrative thresholds</span> Zones: healthy below ' + pctText(T.cautionFrom) +
        ', caution ' + T.cautionFrom.toFixed(1) + '–' + pctText(T.attentionAbove) + ', needs attention above ' + pctText(T.attentionAbove) + '. ' +
        'All plans = total cancellations ÷ ' + accounts + ' starting accounts each week. ' +
        (!showPlans ? 'Plan lines appear once the plan data has loaded.'
          : n > D.plans[0].cancels.length ? 'Plan-level data in this synthetic dataset starts the week of ' + L.weekLabels()[L.planStartIndex()] + ', so plan lines cover only the last ' +
            D.plans[0].cancels.length + ' weeks; earlier All plans values are stored overall rates without account counts.'
          : '');
    },

    // Hover/tap readout. Wired once; it reads whatever weeks were drawn last.
    mount: function () {
      var chart = document.getElementById('cd-chart'), readout = document.getElementById('cd-readout');
      function showWeek(evt) {
        if (!chartWeeks.length) return;
        var pt = chart.createSVGPoint();
        pt.x = evt.clientX; pt.y = evt.clientY;
        var x = pt.matrixTransform(chart.getScreenCTM().inverse()).x;
        var i = Math.max(0, Math.min(chartWeeks.length - 1, Math.round((x - 56) / chartStep)));
        var guide = chart.querySelector('.guide');
        guide.setAttribute('x1', cx(i)); guide.setAttribute('x2', cx(i)); guide.setAttribute('visibility', 'visible');
        readout.innerHTML = weekHTML(chartWeeks[i], i);
      }
      chart.addEventListener('pointermove', showWeek);
      chart.addEventListener('pointerdown', showWeek);
      chart.addEventListener('pointerleave', function (evt) {
        if (evt.pointerType === 'touch') return;
        chart.querySelector('.guide').setAttribute('visibility', 'hidden');
        readout.textContent = DEFAULT_READOUT;
      });
    }
  };
})(Signal.components, Signal.logic, Signal.data);
