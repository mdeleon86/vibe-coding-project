// Churn Detail: "How each plan contributes to overall churn". A rounded-rectangle donut whose segments add up to the total.
// Drawn at its real on-screen width; redrawn when the window resizes.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L) {
  var current = null; // the plan summary last shown

  C.PlanContributionChart = {
    // Returns the donut, its centre label and the plan labels. Call draw() once it is on the page.
    render: function (s) {
      current = s;
      var exact = s.rateNow;
      return '<div class="donut-wrap"><svg class="donut" id="cd-donut" role="img" aria-label="Contribution to overall churn: ' +
        s.stats.map(function (st) { return st.plan.name + ' ' + st.contribution.toFixed(2) + ' percentage points'; }).join(', ') +
        ', total ' + exact.toFixed(2) + '%, about ' + L.round1(exact) + '% rounded"></svg>' +
        '<div class="donut-center" aria-hidden="true"><span class="donut-label">Total account churn</span>' +
        '<span class="donut-value">' + exact.toFixed(2) + '%</span><span class="donut-sub">≈ ' + L.round1(exact) + '% rounded</span></div></div>' +
        '<div class="contrib-labels">' + s.stats.map(function (st) {
          return '<span class="contrib-label"><span class="contrib-name"><span class="swatch" style="background:' + st.plan.color + '"></span>' +
            st.plan.name + ':</span> <strong>' + st.contribution.toFixed(2) + '% pts</strong></span>';
        }).join('') + '</div>';
    },

    // The explanation under the chart.
    legend: function (s) {
      return '<span class="calc-note" style="display:block">% pts = percentage points. Each plan\'s contribution adds up to the overall churn rate. ' +
        'A contribution is a plan\'s cancellations ÷ all ' + L.thousands(s.totalAccounts) + ' starting accounts, not the plan\'s own churn rate ' +
        '(Starter\'s own rate is ' + L.round1(s.starter.rateNow) + '% of its ' + s.starter.plan.accounts + ' accounts).</span>';
    },

    draw: function () {
      var svg = document.getElementById('cd-donut');
      if (!svg || !current) return;
      var W = Math.max(280, Math.round(svg.getBoundingClientRect().width) || 600), H = 120, sw = 14, r = 30;
      var x0 = sw / 2, y0 = sw / 2, x1 = W - sw / 2, y1 = H - sw / 2;
      // Clockwise from the top centre; pathLength 100 lets each segment's dash length be its share of the total.
      var d = 'M' + (W / 2) + ',' + y0 + ' H' + (x1 - r) + ' A' + r + ',' + r + ' 0 0 1 ' + x1 + ',' + (y0 + r) + ' V' + (y1 - r) +
        ' A' + r + ',' + r + ' 0 0 1 ' + (x1 - r) + ',' + y1 + ' H' + (x0 + r) + ' A' + r + ',' + r + ' 0 0 1 ' + x0 + ',' + (y1 - r) +
        ' V' + (y0 + r) + ' A' + r + ',' + r + ' 0 0 1 ' + (x0 + r) + ',' + y0 + ' Z';
      // Each segment runs a hair past its end, under the next segment, so neighbours meet with no visible seam.
      var overlap = 0.25, start = 0;
      var s = '<path class="donut-track" d="' + d + '" pathLength="100"/>';
      current.stats.forEach(function (st) {
        var share = st.contribution / current.rateNow * 100, len = share + overlap;
        s += '<path class="donut-seg" d="' + d + '" pathLength="100" stroke="' + st.plan.color + '" stroke-dasharray="' + len + ' ' + (100 - len) +
          '" stroke-dashoffset="' + (-start) + '"><title>' + st.plan.name + ': ' + st.contribution.toFixed(2) + '% pts of overall churn</title></path>';
        start += share;
      });
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.innerHTML = s;
    }
  };
})(Signal.components, Signal.logic);
