// Churn Detail: "Breakdown by plan". Conclusion, this-week-vs-typical bars and the plan table, plus its loading, empty and error states.
// Plan colors and statuses use the shared churn-rate thresholds for every plan (see thresholds.js, planBreakdownRule).
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L, D) {
  var T = D.thresholds;
  var HEADERS = ['Plan', 'Accounts', 'Cancellations', 'Typical', 'Churn', 'Typical', 'Change', 'Status', 'Share of increase'];

  function rateStatus(rate) { return L.churnHealth(Number(L.round1(rate))); }
  function rateCell(rate) {
    var status = rateStatus(rate);
    return '<td class="st-' + L.toneOf(status) + '">' + L.round1(rate) + '%<span class="visually-hidden"> (' + status + ')</span></td>';
  }
  function changeCell(pts) {
    var status = L.changeHealth(pts), arrow = pts > 0 ? ' ▲' : pts < 0 ? ' ▼' : ' –';
    return '<td class="st-' + L.toneOf(status) + '">' + L.signed(pts, 1) + ' pts<span aria-hidden="true">' + arrow + '</span>' +
      '<span class="visually-hidden"> (' + (pts > 0 ? 'rising, ' : pts < 0 ? 'falling, ' : 'flat, ') + status + ')</span></td>';
  }

  function thresholdNote() {
    var c = T.churnRate, ch = T.churnChange;
    return '<p class="threshold-note"><span class="illustrative">Illustrative thresholds</span> Colors use the overall churn thresholds for every plan: healthy below ' +
      c.cautionFrom.toFixed(1) + '%, caution ' + c.cautionFrom.toFixed(1) + '–' + c.attentionAbove.toFixed(1) + '%, needs attention above ' + c.attentionAbove.toFixed(1) + '%. ' +
      'They are not validated plan-specific benchmarks. Changes are rated by direction: a rise of more than ' + ch.attentionAbove + ' pts needs attention, a rise of ' +
      ch.cautionFrom + '–' + ch.attentionAbove + ' pts is caution, and flat or falling is healthy.</p>';
  }

  C.PlanBreakdown = {
    render: function () {
      return '<section class="panel" id="cd-break-panel" aria-labelledby="cd-break-title">' +
        '<div class="panel-head"><h2 id="cd-break-title">Breakdown by plan</h2><span class="muted small">This week vs typical week</span></div>' +
        '<div id="cd-break-state"></div>' +
        '<div id="cd-break-body" hidden>' +
          '<p class="break-conclusion" id="cd-break-conclusion"></p>' +
          thresholdNote() +
          '<div><p class="chart-caption">Churn rate this week vs typical week <span class="muted">(white tick = typical)</span></p><div class="bars" id="cd-bars"></div></div>' +
          '<div class="table-wrap"><table class="data-table" id="cd-table"></table></div>' +
        '</div>' +
      '</section>';
    },

    // Fills in the loaded breakdown. s: the plan summary from logic/churn-calculations.js
    fill: function (s) {
      document.getElementById('cd-bars').innerHTML = s.stats.slice().sort(function (a, b) { return b.rateNow - a.rateNow; }).map(function (st) {
        var p = st.plan, status = rateStatus(st.rateNow);
        return '<div class="bar-row"><span class="bar-name"><span class="swatch" style="background:' + p.color + '"></span>' + p.name + '</span>' +
          '<div class="bar-track" role="img" aria-label="' + p.name + ': ' + L.round1(st.rateNow) + '% this week, typical ' + L.round1(st.rateTypical) + '%, ' + status + '">' +
          '<span class="bar-fill" style="width:' + (st.rateNow / 8 * 100) + '%;background:' + p.color + '"></span>' +
          '<span class="bar-typical" style="left:' + (st.rateTypical / 8 * 100) + '%"></span></div>' + C.HealthBadge(status) +
          '<span class="bar-value">' + L.round1(st.rateNow) + '% this week · typical ' + L.round1(st.rateTypical) + '% · ' +
          L.signed(L.changePts(st.rateNow, st.rateTypical), 1) + ' pts</span></div>';
      }).join('');

      // Plain-language conclusion: the plan contributing the most to overall churn.
      var worst = s.biggestContributor;
      var others = s.stats.filter(function (st) { return st !== worst; });
      var othersSteady = others.every(function (st) { return L.changeHealth(L.changePts(st.rateNow, st.rateTypical)) === 'Healthy'; });
      document.getElementById('cd-break-conclusion').innerHTML = '<strong>' + worst.plan.name + ' contributes the most to overall churn:</strong> ' +
        worst.contribution.toFixed(2) + ' of the ' + s.rateNow.toFixed(2) + ' points (' + worst.now + ' of ' + s.totalNow + ' cancellations). ' +
        'Its own churn rate is ' + L.round1(worst.rateNow) + '% vs a typical ' + L.round1(worst.rateTypical) + '% (' +
        L.signed(L.changePts(worst.rateNow, worst.rateTypical), 1) + ' pts), and it accounts for ' + worst.shareOfIncrease + '% of this week\'s increase. ' +
        others.map(function (st) { return st.plan.name; }).join(' and ') + (othersSteady ? ' are close to their typical weeks.' : ' also changed; see the table below.');

      document.getElementById('cd-table').innerHTML =
        '<caption class="muted small" style="text-align:left;caption-side:top;padding-bottom:6px">Synthetic data. Typical = average of the 4 weeks before this one. Colors and status use the illustrative thresholds above.</caption>' +
        '<thead><tr>' + HEADERS.map(function (h) { return '<th scope="col">' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
        s.stats.map(function (st) {
          return '<tr' + (st === worst ? ' class="highlight"' : '') + '><th scope="row"><span class="swatch" style="background:' + st.plan.color + '"></span>' + st.plan.name + '</th>' +
            '<td>' + L.thousands(st.plan.accounts) + '</td><td>' + st.now + '</td><td>' + Math.round(st.typical) + '</td>' +
            rateCell(st.rateNow) + rateCell(st.rateTypical) + changeCell(L.changePts(st.rateNow, st.rateTypical)) +
            '<td>' + C.HealthBadge(rateStatus(st.rateNow)) + '</td>' +
            '<td>' + L.signed(st.shareOfIncrease, 0).replace('+', '') + '%</td></tr>';
        }).join('') +
        '</tbody><tfoot><tr><th scope="row">All plans</th><td>' + L.thousands(s.totalAccounts) + '</td><td>' + s.totalNow + '</td><td>' + Math.round(s.totalTypical) + '</td>' +
        rateCell(s.rateNow) + rateCell(s.rateTypical) + changeCell(L.changePts(s.rateNow, s.rateTypical)) +
        '<td>' + C.HealthBadge(rateStatus(s.rateNow)) + '</td><td>100%</td></tr></tfoot>';
    },

    // Loading: skeleton screens in the same layout as the loaded breakdown.
    skeleton: function () {
      var cell = '<td><span class="sk sk-cell"></span></td>', names = D.plans.map(function (p) { return p.name; });
      return '<p class="visually-hidden">' + D.messages.loading + '</p>' +
        '<div aria-hidden="true"><div class="bars" style="margin-top:6px">' +
        names.map(function () {
          return '<div class="bar-row"><span class="sk sk-text" style="width:70px"></span><span class="sk sk-bar"></span><span class="sk sk-text" style="width:90px"></span>' +
            '<span class="sk sk-text" style="grid-column:2;width:60%"></span></div>';
        }).join('') + '</div>' +
        '<div class="table-wrap"><table class="data-table"><thead><tr>' +
        HEADERS.map(function (h) { return '<th scope="col">' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
        names.map(function (name) {
          return '<tr><th scope="row">' + name + '</th>' + new Array(HEADERS.length).join(cell) + '</tr>';
        }).join('') + '</tbody></table></div></div>';
    },

    // Empty: the message, plus a Get Started button that opens the setup steps underneath it.
    empty: function () {
      var g = D.messages.getStarted;
      return '<div class="state-msg" role="status"><p>' + C.esc(D.messages.empty) + '</p>' +
        '<button type="button" class="btn" id="cd-get-started" aria-expanded="false" aria-controls="cd-setup">Get Started</button>' +
        '<div class="setup-steps" id="cd-setup" hidden>' +
          '<h3 class="setup-title">' + C.esc(g.title) + '</h3>' +
          '<ol>' + g.steps.map(function (s) { return '<li>' + C.esc(s) + '</li>'; }).join('') + '</ol>' +
          (g.guideHref ? '<a href="' + g.guideHref + '" target="_blank" rel="noopener">' + C.esc(g.guideLabel) + '</a>' : '') +
        '</div></div>';
    },

    error: function () {
      return '<div class="state-msg error" role="alert"><p>' + C.esc(D.messages.error) + '</p>' +
        '<button type="button" class="btn secondary" id="cd-retry">Retry</button></div>';
    }
  };
})(Signal.components, Signal.logic, Signal.data);
