// Screen 1 of 3: Overview (command center). Puts the Overview pieces together in their layout.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L, D) {
  C.OverviewScreen = {
    headingId: 'ov-title',
    render: function () {
      return '<main class="wide" id="screen-overview" aria-labelledby="ov-title">' +
        '<header class="hero">' +
          '<p class="eyebrow">SIGNAL · Weekly churn review · Week of ' + D.report.weekLabel + ' <span class="synthetic">Synthetic demo data</span></p>' +
          '<h1 id="ov-title" tabindex="-1">Executive Overview</h1>' +
          '<p class="subtitle">A clear view of business health, emerging risks, and strategic priorities.</p>' +
        '</header>' +
        // The four headline metric cards used to sit here; the insight now leads, directly below the introduction.
        '<div class="ov-grid">' +
          '<div class="ov-main">' + C.MostImportantInsight.render() + C.NextStepCards.render() + '</div>' +
          // The Supporting metrics panel (sign-ups, activation, trial-to-paid, new bookings) used to sit here, on the right.
        '</div>' +
        C.MetricExplainers.render() +
      '</main>';
    },
    mount: function () { C.MostImportantInsight.mount(); }
  };
})(Signal.components, Signal.logic, Signal.data);
