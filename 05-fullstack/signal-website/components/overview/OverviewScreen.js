// Screen 1 of 3: Overview (command center). Puts the Overview pieces together in their layout.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L, D) {
  C.OverviewScreen = {
    headingId: 'ov-title',
    render: function () {
      var summary = L.planSummary(D.plans);
      return '<main class="wide" id="screen-overview" aria-labelledby="ov-title">' +
        '<header class="hero">' +
          '<p class="eyebrow">SIGNAL · Weekly churn review · Week of ' + D.report.weekLabel + ' <span class="synthetic">Synthetic demo data</span></p>' +
          '<h1 id="ov-title" tabindex="-1">Customer Churn Intelligence</h1>' +
          '<p class="subtitle">Identify which customers are leaving, understand what\'s driving churn, and prioritize actions to improve retention.</p>' +
        '</header>' +
        C.OverviewKpiCards.render(summary) +
        '<div class="ov-grid">' +
          '<div class="ov-main">' + C.MostImportantInsight.render() + C.NextStepCards.render() + '</div>' +
          C.SupportingMetrics.render() +
        '</div>' +
        C.MetricExplainers.render() +
      '</main>';
    },
    mount: function () { C.MostImportantInsight.mount(); }
  };
})(Signal.components, Signal.logic, Signal.data);
