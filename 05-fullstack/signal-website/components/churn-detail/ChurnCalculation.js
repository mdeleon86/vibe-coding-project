// Churn Detail: "How is this calculated?". The overall churn equation and a row per plan, so the headline reconciles with the counts.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L) {
  C.ChurnCalculation = {
    // s: the plan summary from logic/churn-calculations.js
    render: function (s) {
      var exact = s.rateNow, accounts = L.thousands(s.totalAccounts);
      return '<div class="equation" role="img" aria-label="' + s.totalNow + ' cancelled accounts divided by ' + accounts +
        ' starting accounts times 100 equals ' + exact.toFixed(2) + '%, shown as ' + L.round1(exact) + '%">' +
        '<span class="eq-term"><span class="eq-num">' + s.totalNow + '</span><span class="eq-label">Total cancelled accounts</span></span>' +
        '<span class="eq-op" aria-hidden="true">÷</span>' +
        '<span class="eq-term"><span class="eq-num">' + accounts + '</span><span class="eq-label">Total starting accounts</span></span>' +
        '<span class="eq-op" aria-hidden="true">× 100 =</span>' +
        '<span class="eq-term eq-result"><span class="eq-num">' + exact.toFixed(2) + '%</span><span class="eq-label">Overall churn rate, shown as ' + L.round1(exact) + '%</span></span></div>' +
        '<div class="table-wrap"><table class="data-table calc-table"><thead><tr><th scope="col">Plan</th><th scope="col">Starting accounts</th>' +
        '<th scope="col">Cancelled accounts</th><th scope="col">Plan churn rate</th></tr></thead><tbody>' +
        s.stats.map(function (st) {
          return '<tr><th scope="row"><span class="swatch" style="background:' + st.plan.color + '"></span>' + st.plan.name + '</th><td>' +
            L.thousands(st.plan.accounts) + '</td><td>' + st.now + '</td><td>' + st.rateNow.toFixed(2) + '%</td></tr>';
        }).join('') +
        '</tbody><tfoot><tr><th scope="row">Total</th><td>' + accounts + '</td><td>' + s.totalNow + '</td><td>' +
        exact.toFixed(2) + '% → ' + L.round1(exact) + '%</td></tr></tfoot></table></div>' +
        '<p class="calc-note">Starting accounts are each plan\'s active accounts at the start of the week. This synthetic dataset has one count per plan (' +
        s.stats.map(function (st) { return st.plan.accounts; }).join(', ') + ') that applies to every week; it doesn\'t track week-by-week starting counts.</p>';
    }
  };
})(Signal.components, Signal.logic);
