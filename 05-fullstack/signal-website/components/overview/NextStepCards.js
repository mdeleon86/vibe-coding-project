// Overview: "Where to go next" cards linking to Churn Detail and Recommended Actions.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, D) {
  C.NextStepCards = {
    render: function () {
      var n = D.recommendedActions.length, first = D.mostImportantInsight.action.primaryActionId;
      return '<nav class="nav-cards" aria-label="Where to go next">' +
        '<p class="label">Where to go next</p>' +
        '<a class="nav-card" href="#/churn">' +
          '<span class="nav-card-icon" aria-hidden="true">' + C.icons.churn.replace(' aria-hidden="true"', '') + '</span>' +
          '<span class="nav-card-title">Churn detail</span>' +
          '<span class="nav-card-text">See churn over time and which subscription plans are driving the increase.</span>' +
          '<span class="nav-card-go">Open churn detail →</span>' +
        '</a>' +
        '<a class="nav-card primary" href="#/actions/' + first + '">' +
          '<span class="nav-card-icon" aria-hidden="true">' + C.icons.actions.replace(' aria-hidden="true"', '') + '</span>' +
          '<span class="nav-card-title">Recommended actions</span>' +
          '<span class="nav-card-text">' + n + ' actions, starting with outreach to at-risk Starter-plan accounts.</span>' +
          '<span class="nav-card-go">View recommended actions →</span>' +
        '</a>' +
      '</nav>';
    }
  };
})(Signal.components, Signal.data);
