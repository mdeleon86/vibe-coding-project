// Recommended Actions: Measuring Success. A compact table that keeps this week's values apart from the desired outcomes.
// Values are calculated from the churn data (same rules as the Overview). Desired outcomes are directions, never targets,
// and nothing here claims the outreach will reduce churn.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L, D) {
  C.SuccessMeasures = {
    render: function () {
      var overall = L.overallThisWeek();
      var starter = L.planSummary(D.plans).starter, st = L.starterVsTypical(starter);
      var rows = [
        { name: 'Account churn rate', value: L.round1(overall.now) + '%', status: overall.status, outcome: 'Lower' },
        { name: 'Starter-plan churn', value: L.round1(starter.rateNow) + '%', status: st.status, outcome: 'Lower and stable' },
        { name: 'Retention outreach effectiveness', value: 'Not yet measured', status: null, outcome: 'Measured once outreach runs' }
      ];
      return '<section class="ra-section" aria-labelledby="ra-measures-title">' +
        '<h2 class="ra-section-title" id="ra-measures-title">Measuring Success</h2>' +
        '<div class="ra-measures-wrap"><table class="ra-measures">' +
          '<thead><tr><th scope="col">Measure</th><th scope="col">Current value</th><th scope="col">Desired outcome</th></tr></thead>' +
          '<tbody>' + rows.map(function (r) {
            return '<tr><th scope="row">' + r.name + '</th>' +
              '<td class="ra-current"><span class="ra-value' + (r.status ? '' : ' pending') + '">' + r.value + '</span>' + (r.status ? C.HealthBadge(r.status) : '') + '</td>' +
              '<td class="ra-outcome">' + r.outcome + '</td></tr>';
          }).join('') + '</tbody>' +
        '</table></div>' +
        '<p class="ra-section-sub">' + C.esc(D.strategy.measuresNote) + '</p>' +
      '</section>';
    }
  };
})(Signal.components, Signal.logic, Signal.data);
