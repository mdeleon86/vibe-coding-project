// Recommended Actions: the Primary Strategic Recommendation card.
// Order: label and priority, headline, description, business justification, owner, timeline, desired outcome,
// then a note that the intervention hasn't been validated. Wording: data/recommended-actions-data.js (strategy.primary).
// Starter's share of the churn increase is calculated from the churn data, the same way as on the Overview.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L, D) {
  C.PrimaryRecommendation = {
    render: function () {
      var P = D.strategy.primary;
      var share = L.planSummary(D.plans).starter.shareOfIncrease;
      var justification = 'Starter-plan customers account for ' + share + '% of the increase in churn.';
      function item(label, value, wide) {
        return '<div class="ra-fact' + (wide ? ' wide' : '') + '"><dt>' + label + '</dt><dd>' + value + '</dd></div>';
      }
      return '<section class="ra-primary" aria-labelledby="ac-detail-title">' +
        '<div class="ra-primary-top">' +
          '<p class="label ra-primary-label">' + C.esc(P.label) + '</p>' +
          '<span class="ra-priority">Priority: ' + C.esc(P.priority) + '</span>' +
        '</div>' +
        '<h2 id="ac-detail-title" tabindex="-1">' + C.esc(P.headline) + '</h2>' +
        '<p class="ra-desc">' + C.esc(P.description) + '</p>' +
        '<dl class="ra-facts">' +
          item('Business justification', C.esc(justification) + ' <a class="ra-link" href="#/churn">See churn detail →</a>', true) +
          item('Recommended owner', C.esc(P.owner)) +
          item('Recommended timeline', C.esc(P.timeline)) +
          item('Desired business outcome', C.esc(P.outcome), true) +
        '</dl>' +
        '<p class="ra-validation">' + C.esc(P.validation) + '</p>' +
      '</section>';
    }
  };
})(Signal.components, Signal.logic, Signal.data);
