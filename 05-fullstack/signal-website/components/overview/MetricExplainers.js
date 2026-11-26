// Overview: the two fold-out explainers. "What do these metrics mean?" and "How are health ratings decided?".
// The rating rules are written out from data/thresholds.js, so the explanation always matches the ratings.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L, D) {
  var T = D.thresholds;

  function higherIsBetter(m) {
    var t = T.supporting[m.key], f = function (v) { return L.formatValue(v, m.unit); };
    if (m.unit === 'count') {
      return 'Healthy: ' + f(t.healthyMin) + ' or more · Caution: ' + f(t.cautionMin) + ' to ' + f(t.healthyMin - 1) + ' · Needs attention: fewer than ' + f(t.cautionMin);
    }
    var more = m.unit === 'percent' ? ' or higher' : ' or more';
    return 'Healthy: ' + f(t.healthyMin) + more + ' · Caution: ' + f(t.cautionMin) + more + ', but below ' + f(t.healthyMin) + ' · Needs attention: below ' + f(t.cautionMin);
  }

  C.MetricExplainers = {
    render: function () {
      var c = T.churnRate, lo = c.cautionFrom.toFixed(1) + '%', hi = c.attentionAbove.toFixed(1) + '%';
      return '<div class="explainers">' +
        '<details class="glossary"><summary>What do these metrics mean?</summary><dl>' +
          D.glossary.map(function (g) { return '<dt>' + g.term + '</dt><dd>' + C.esc(g.definition) + '</dd>'; }).join('') +
        '</dl></details>' +
        '<details class="glossary ratings"><summary>How are health ratings decided?</summary>' +
          '<ul class="legend">' +
            '<li>' + C.HealthBadge('Healthy') + ' Green: within the expected range.</li>' +
            '<li>' + C.HealthBadge('Caution') + ' Amber: near or slightly outside the expected range. Worth monitoring.</li>' +
            '<li>' + C.HealthBadge('Needs attention') + ' Red: well outside the expected range. Act on it.</li>' +
          '</ul>' +
          '<p class="ratings-note">Thresholds are illustrative, based on synthetic product assumptions, not verified industry benchmarks. Ratings use the value as shown on the dashboard.</p>' +
          '<dl>' +
            '<dt>Churn rate <span class="direction">(lower is better)</span></dt>' +
            '<dd>Healthy: below ' + lo + ' · Caution: ' + lo + ' to ' + hi + ', including exactly ' + lo + ' and exactly ' + hi + ' · Needs attention: above ' + hi + '</dd>' +
            D.supportingMetrics.map(function (m) {
              return '<dt>' + m.longName + ' <span class="direction">(higher is better)</span></dt><dd>' + higherIsBetter(m) + '</dd>';
            }).join('') +
          '</dl>' +
        '</details>' +
      '</div>';
    }
  };
})(Signal.components, Signal.logic, Signal.data);
