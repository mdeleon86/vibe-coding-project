// Overview: the Supporting metrics panel. One tile per metric, with a health badge and a 5-week sparkline.
// Sparklines use a fixed scale (±12% of each metric's 5-week average), so normal week-to-week noise doesn't look like a crisis.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L, D) {
  function sparkline(m, cautionMin) {
    var avg = L.sum(m.values) / m.values.length, min = avg * 0.88, max = avg * 1.12;
    function sy(v) { return (2 + (1 - (v - min) / (max - min)) * 24).toFixed(2); }
    var pts = m.values.map(function (v, i) { return (2 + i * 24) + ',' + sy(v); });
    var lastY = sy(m.values[m.values.length - 1]);
    return '<svg class="spark" viewBox="0 0 100 28" preserveAspectRatio="none" role="img">' +
      '<title>' + m.name + ', last ' + m.values.length + ' weeks: ' + m.values.map(function (v) { return L.formatValue(v, m.unit); }).join(', ') + '. ' +
      L.supportingHealth(m) + '. Caution below ' + L.formatValue(cautionMin, m.unit) + '.</title>' +
      '<line class="spark-threshold" x1="0" x2="100" y1="' + sy(cautionMin) + '" y2="' + sy(cautionMin) + '"/>' +
      '<polyline points="' + pts.join(' ') + '"/>' +
      '<path class="spark-end" d="M98 ' + lastY + 'h0"/>' +
      '</svg>';
  }

  function tile(m) {
    var status = L.supportingHealth(m), t = D.thresholds.supporting[m.key];
    return '<div class="tile">' +
      '<p class="tile-name">' + m.name + '</p>' +
      '<div class="tile-head"><p class="tile-value">' + L.formatValue(m.values[m.values.length - 1], m.unit) + '</p>' + C.HealthBadge(status) + '</div>' +
      '<p class="tile-change">' + m.changeVsLastWeek + ' · ' + (status === 'Healthy' ? 'normal range' : 'outside normal range') + '</p>' +
      sparkline(m, t.healthyMin) +
      '<p class="tile-trend">' + m.trend + ' · dashed line: Caution below ' + L.formatValue(t.healthyMin, m.unit) + '</p>' +
      '</div>';
  }

  C.SupportingMetrics = {
    render: function () {
      var metrics = D.supportingMetrics;
      var healthy = metrics.filter(function (m) { return L.supportingHealth(m) === 'Healthy'; }).length;
      var sub = healthy === metrics.length
        ? 'No unusual changes this week. All ' + metrics.length + ' are ' + C.HealthBadge('Healthy')
        : healthy + ' of ' + metrics.length + ' are ' + C.HealthBadge('Healthy');
      return '<section class="supporting ov-side" aria-labelledby="rest-label">' +
        '<div class="supporting-head"><h2 class="supporting-title" id="rest-label">Supporting metrics</h2><p class="supporting-sub">' + sub + '</p></div>' +
        '<div class="tiles">' + metrics.map(tile).join('') + '</div>' +
      '</section>';
    }
  };
})(Signal.components, Signal.logic, Signal.data);
