// Screen 3 of 3: Recommended Actions, an executive decision-support page.
// Order: heading and subtitle, one illustrative-data notice, the Primary Strategic Recommendation,
// the Strategic Execution Plan (expandable steps) and Measuring Success.
// The old ticket list (ActionList.js) and Properties sidebar (ActionProperties.js) are no longer shown; their files are kept.
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
          '<p class="ra-subtitle">' + C.esc(D.strategy.subtitle) + '</p>' +
        '</div></div>' +
        '<p class="ra-notice"><span class="illustrative">Illustrative data</span> ' + C.esc(D.strategy.notice) + '</p>' +
        C.PrimaryRecommendation.render() +
        C.ExecutionPlan.render() +
        C.SuccessMeasures.render() +
      '</main>';
    },

    // True when id names a real action (used by the router to validate links such as #/actions/SIG-2).
    has: function (id) { return D.recommendedActions.some(function (a) { return a.id === id; }); },

    // A link to one action (#/actions/SIG-2) opens that step of the execution plan. Without an id, nothing is opened.
    show: function (id) { this.target = id ? C.ExecutionPlan.open(id) : null; },

    // Where focus goes when following a link to an action on this same screen.
    focusTarget: function () { return this.target || document.getElementById('ac-detail-title'); }
  };
})(Signal.components, Signal.data);
