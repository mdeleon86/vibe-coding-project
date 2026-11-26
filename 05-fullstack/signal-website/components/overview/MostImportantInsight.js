// Overview: the "Most important insight this week" card. Headline metric, takeaway, a 5 / 12 / 26-week trend, and the recommended next action.
// The wording comes from data/most-important-insight.js; every number is calculated from the churn data.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L, D) {
  var T = D.thresholds.churnRate;
  var DEFAULT_READOUT = 'Point at or tap a week to see its value.';
  var data = [], step = 0, shownWeeks = 5, drawnWidth = 0;

  // Chart width. The chart is drawn 340 units wide and used to be shown at most 400px wide, so 1 unit = 400/340 px.
  // Wider than that, the drawing gets more units across instead of being scaled up: the plot fills the space
  // while the height and text size stay what they were at 400px.
  var BASE_W = 340, BASE_PX = 400;
  function chartWidth(svg) {
    var px = svg.getBoundingClientRect().width;
    return px > BASE_PX ? Math.round(px * BASE_W / BASE_PX) : BASE_W;
  }

  // Chart scale: 2.5% at the bottom (y 150) to 5% at the top (y 24).
  function y(v) { return 150 - (v - 2.5) * 50.4; }
  function x(i) { return 48 + i * step; }
  function fmt(v) { return v.toFixed(1) + '%'; }

  function weeks() {
    var labels = L.weekLabels();
    return D.overallWeeklyChurn.map(function (v, i) { return { label: labels[i], v: v }; });
  }

  // Draws the trend chart for the last n weeks.
  function draw(n) {
    var svg = document.querySelector('#churn-detail .trend-chart');
    var overall = L.overallThisWeek(), typical = L.round1(overall.typical);
    shownWeeks = n;
    var W = chartWidth(svg);
    drawnWidth = Math.round(svg.getBoundingClientRect().width);
    svg.setAttribute('viewBox', '0 0 ' + W + ' 186');
    var ZR = W - 10, R = W - 36, ZW = ZR - 34;   // ZR: right edge of the zones; R: this week's x; ZW: zone width
    data = weeks().slice(-n);
    var last = data.length - 1;
    step = (R - 48) / last;
    var every = n <= 5 ? 1 : n <= 12 ? 3 : 5;
    var top = y(5), yBad = y(T.attentionAbove), yCaution = y(T.cautionFrom), bottom = y(2.5);
    function h(a, b) { return Math.round((b - a) * 100) / 100; } // zone height, without floating-point noise
    var s = '<title id="trend-svg-title">Weekly account churn rate, last ' + n + ' weeks, with health zones. Synthetic data.</title>' +
      '<desc id="trend-svg-desc">' + data.map(function (w, i) {
        return 'Week of ' + w.label + (i === last ? ', this week' : '') + ': ' + fmt(w.v) + ', ' + L.churnHealth(w.v);
      }).join('. ') + '. Typical week: ' + typical + '%.</desc>' +
      '<g class="zones"><rect class="zone-bad" x="34" y="' + top + '" width="' + ZW + '" height="' + h(top, yBad) + '"/>' +
      '<rect class="zone-caution" x="34" y="' + yBad + '" width="' + ZW + '" height="' + h(yBad, yCaution) + '"/>' +
      '<rect class="zone-good" x="34" y="' + yCaution + '" width="' + ZW + '" height="' + h(yCaution, bottom) + '"/></g>' +
      '<g class="zone-labels"><text class="bad" x="38" y="35">Needs attention (above ' + fmt(T.attentionAbove) + ')</text>' +
      '<text class="caution" x="38" y="90.5">Caution (' + T.cautionFrom.toFixed(1) + '–' + fmt(T.attentionAbove) + ')</text>' +
      '<text class="good" x="38" y="146">Healthy (below ' + fmt(T.cautionFrom) + ')</text></g>' +
      '<g class="grid">' + [3, 4, 5].map(function (t) { return '<line x1="34" x2="' + ZR + '" y1="' + y(t) + '" y2="' + y(t) + '"/>'; }).join('') + '</g>' +
      '<g class="axis">' + [3, 4, 5].map(function (t) { return '<text x="28" y="' + (y(t) + 4) + '" text-anchor="end">' + t + '%</text>'; }).join('');
    for (var i = last; i >= 0; i -= every) {
      s += '<text x="' + x(i) + '" y="174" text-anchor="middle">' + data[i].label + '</text>';
    }
    s += '</g><line class="benchmark" x1="34" x2="' + ZR + '" y1="' + y(Number(typical)) + '" y2="' + y(Number(typical)) + '"/>' +
      '<text class="benchmark-label" x="' + ZR + '" y="140" text-anchor="end">Typical week: ' + typical + '%</text>' +
      '<line class="guide" x1="0" x2="0" y1="24" y2="150" visibility="hidden"/>' +
      '<polyline class="trend-line" points="' + data.map(function (w, i) { return x(i) + ',' + y(w.v); }).join(' ') + '"/>' +
      '<g class="points' + (n > 12 ? ' dense' : '') + '">';
    data.forEach(function (w, i) {
      s += i === last
        ? '<circle class="now" cx="' + x(i) + '" cy="' + y(w.v) + '" r="6"/>'
        : '<circle cx="' + x(i) + '" cy="' + y(w.v) + '" r="' + (n > 12 ? 2.5 : 4) + '"/>';
    });
    s += '</g><circle class="focus" r="7" visibility="hidden"/>' +
      '<text class="now-label" x="' + (R - 12) + '" y="50" text-anchor="end">' + fmt(data[last].v) + ' this week</text>' +
      '<rect class="hit" x="34" y="24" width="' + ZW + '" height="150"/>';
    svg.innerHTML = s;

    var high = L.previousHigh(n);
    document.getElementById('trend-title').innerHTML = 'Weekly churn rate, last ' + n + ' weeks <span class="synthetic">Synthetic data</span>';
    document.getElementById('trend-summary').textContent = 'This week (' + fmt(data[last].v) + ') is the highest in the last ' + n + ' weeks. Previous high: ' +
      fmt(high.value) + ', week of ' + high.label + '.';
    document.getElementById('trend-readout').textContent = DEFAULT_READOUT;
  }

  C.MostImportantInsight = {
    render: function () {
      var I = D.mostImportantInsight, o = L.overallThisWeek();
      var now = L.round1(o.now) + '%', typical = L.round1(o.typical) + '%';
      return '<section class="insight" aria-labelledby="insight-label insight-headline">' +
        '<p class="label" id="insight-label">Most important insight this week</p>' +
        '<h2 class="insight-headline" id="insight-headline">' + C.esc(I.headline) + '</h2>' +
        '<div class="headline">' +
          '<button type="button" class="headline-btn" id="churn-toggle" aria-expanded="true" aria-controls="churn-detail">' +
            '<span class="metric-name">' + I.metricName + '</span>' +
            '<span class="value-row">' +
              '<span class="value">' + now + '</span>' +
              '<span class="change bad"><span aria-hidden="true">' + (o.changePts >= 0 ? '▲' : '▼') + '</span> ' + L.signed(o.changeRelativeRounded, 0) + '% ' +
              '<span class="vs">vs typical week (' + typical + ')</span></span>' +
              C.HealthBadge(o.status) +
            '</span>' +
            '<span class="drill-hint" id="churn-hint">Hide trend ▴</span>' +
          '</button>' +
          '<p class="takeaway">' + C.esc(I.takeaway) + '</p> ' + // the space keeps the link's gap from the inline takeaway
          '<a class="detail-link" href="#/churn">Open churn detail →</a>' +
        '</div>' +
        '<figure class="trend" id="churn-detail">' +
          '<div class="trend-head">' +
            '<figcaption class="trend-title" id="trend-title"></figcaption>' +
            '<div class="range" role="group" aria-label="Time range">' +
              [5, 12, 26].map(function (n) { return '<button type="button" data-weeks="' + n + '" aria-pressed="' + (n === 5) + '">' + n + ' weeks</button>'; }).join('') +
            '</div>' +
          '</div>' +
          '<p class="trend-summary" id="trend-summary"></p>' +
          '<svg class="trend-chart" viewBox="0 0 340 186" role="img" aria-labelledby="trend-svg-title trend-svg-desc"></svg>' +
          '<p class="readout" id="trend-readout" aria-live="polite"></p>' +
          '<p class="trend-note">' + L.signed(o.changeRelativeRounded, 0) + '% is a relative change: (' + now + ' − ' + typical + ') ÷ ' + typical + ' = ' +
            o.changeRelative.toFixed(1) + '%, rounded to the nearest whole percent. In absolute terms, churn is ' + (o.changePts >= 0 ? 'up ' : 'down ') +
            Math.abs(o.changePts).toFixed(1) + ' percentage points. "Typical week" is the average of the four weeks before this one.</p>' +
        '</figure>' +
        C.SupportingMetrics.renderCompact() +
        '<div class="action">' +
          '<p class="label">Recommended next action</p>' +
          '<p class="action-text">' + C.esc(I.action.text) + '</p>' +
          '<dl class="plan">' + I.action.plan.map(function (row) { return '<dt>' + row[0] + '</dt><dd>' + C.esc(row[1]) + '</dd>'; }).join('') + '</dl>' +
          '<p class="caveat">' + C.esc(D.outreachCaveat) + '</p>' +
        '</div>' +
      '</section>';
    },

    // Wires up the range buttons, the hover/tap readout and the show/hide toggle, then draws the 5-week chart.
    mount: function () {
      var svg = document.querySelector('#churn-detail .trend-chart');
      var readout = document.getElementById('trend-readout');
      var range = document.querySelector('#churn-detail .range');
      var toggle = document.getElementById('churn-toggle'), hint = document.getElementById('churn-hint'), detail = document.getElementById('churn-detail');

      function showWeek(evt) {
        var pt = svg.createSVGPoint();
        pt.x = evt.clientX; pt.y = evt.clientY;
        var px = pt.matrixTransform(svg.getScreenCTM().inverse()).x;
        var i = Math.max(0, Math.min(data.length - 1, Math.round((px - 48) / step)));
        var w = data[i], guide = svg.querySelector('.guide'), focus = svg.querySelector('.focus');
        guide.setAttribute('x1', x(i)); guide.setAttribute('x2', x(i)); guide.setAttribute('visibility', 'visible');
        focus.setAttribute('cx', x(i)); focus.setAttribute('cy', y(w.v)); focus.setAttribute('visibility', 'visible');
        readout.textContent = 'Week of ' + w.label + (i === data.length - 1 ? ' (this week)' : '') + ': ' + fmt(w.v) + ' · ' + L.churnHealth(w.v);
      }
      svg.addEventListener('pointermove', showWeek);
      svg.addEventListener('pointerdown', showWeek);
      svg.addEventListener('pointerleave', function (evt) {
        if (evt.pointerType === 'touch') return;
        svg.querySelector('.guide').setAttribute('visibility', 'hidden');
        svg.querySelector('.focus').setAttribute('visibility', 'hidden');
        readout.textContent = DEFAULT_READOUT;
      });

      range.addEventListener('click', function (evt) {
        var btn = evt.target.closest('button');
        if (!btn) return;
        range.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        draw(Number(btn.dataset.weeks));
      });

      toggle.addEventListener('click', function () {
        var open = detail.hidden;
        detail.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        hint.textContent = open ? 'Hide trend ▴' : 'View trend ▾';
      });

      draw(5);

      // Redraw when the chart's width changes (window resized, or the trend shown again after being hidden),
      // so the plot keeps filling the card. Height changes alone are ignored.
      if (window.ResizeObserver) new ResizeObserver(function () {
        var px = Math.round(svg.getBoundingClientRect().width);
        if (px && px !== drawnWidth) draw(shownWeeks);
      }).observe(svg);
    }
  };
})(Signal.components, Signal.logic, Signal.data);
