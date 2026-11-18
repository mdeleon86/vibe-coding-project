// Screen 3 of 3: Recommended Actions. Puts the action list, the selected action's details and its properties together.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, D) {
  C.RecommendedActionsScreen = {
    headingId: 'ac-title',
    render: function () {
      return '<main class="wide" id="screen-actions" aria-labelledby="ac-title" hidden>' +
        '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/overview">Overview</a> <span aria-hidden="true">›</span> <a href="#/churn">Churn Detail</a> ' +
          '<span aria-hidden="true">›</span> <span aria-current="page">Recommended Actions</span></nav>' +
        '<div class="report-head"><div>' +
          '<h1 id="ac-title" class="page-title" tabindex="-1">Recommended Actions</h1>' +
          '<p class="muted small">Responding to this week\'s churn increase · ' + D.recommendedActions.length + ' actions</p>' +
        '</div></div>' +
        '<p class="illustrative-note"><span class="illustrative">Illustrative data</span> Owners, statuses, timing and activity on this screen are examples that show how the workflow would look. They are not real assignments or deadlines.</p>' +
        '<div class="issues">' +
          C.ActionList.render() +
          '<article class="issue" id="ac-detail" aria-live="polite"></article>' +
          '<aside class="props" id="ac-props" aria-label="Action properties"></aside>' +
        '</div>' +
      '</main>';
    },

    // True when id names a real action (used by the router to validate links such as #/actions/SIG-2).
    has: function (id) { return D.recommendedActions.some(function (a) { return a.id === id; }); },

    // Shows one action (the first one if the id is missing or unknown).
    show: function (id) {
      var a = D.recommendedActions.filter(function (x) { return x.id === id; })[0] || D.recommendedActions[0];
      C.ActionList.setCurrent(a.id);
      document.getElementById('ac-detail').innerHTML = C.ActionDetail.render(a);
      document.getElementById('ac-props').innerHTML = C.ActionProperties.render(a);
      return a;
    }
  };
})(Signal.components, Signal.data);
