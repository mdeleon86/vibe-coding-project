// Recommended Actions: the selected action's details. The primary action gets its own card with owner, timeline and
// success measure up front; other actions show a plain heading and a separate "How we'll measure it" section.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, D) {
  function heading(a) {
    return '<div class="issue-meta"><span>' + a.id + '</span>' + (a.primary ? '<span class="primary-tag">Primary recommended action</span>' : '') + '</div>' +
      '<h2 id="ac-detail-title" tabindex="-1">' + C.esc(a.title) + '</h2>' +
      '<p class="issue-desc">' + C.esc(a.desc) + '</p>';
  }

  C.PrimaryActionCard = {
    render: function (a) {
      return '<section class="primary-card" aria-labelledby="ac-detail-title">' + heading(a) +
        '<dl class="key-details">' +
          '<div class="key-detail"><dt>Owner</dt><dd><span class="avatar" aria-hidden="true">' + a.initials + '</span>' + C.esc(a.owner) + '</dd></div>' +
          '<div class="key-detail"><dt>Timeline</dt><dd>' + C.esc(a.timing) + '</dd></div>' +
          '<div class="key-detail measure"><dt>Success measure</dt><dd>' + C.esc(a.measure) + '</dd></div>' +
        '</dl>' +
        '<p class="key-note"><span class="illustrative">Illustrative</span> Owner and timeline are examples, not a real assignment or deadline.</p>' +
      '</section>';
    }
  };

  C.ActionDetail = {
    render: function (a) {
      return (a.primary ? C.PrimaryActionCard.render(a) : heading(a)) +
        '<div class="issue-section"><h3>Why</h3><p>' + C.esc(a.why) + ' <a class="detail-link" style="margin-top:0;font-size:14px" href="#/churn">See churn detail →</a></p></div>' +
        (a.primary ? '' : '<div class="issue-section"><h3>How we\'ll measure it</h3><p>' + C.esc(a.measure) + '</p></div>') +
        (a.caveat ? '<p class="issue-caveat">' + C.esc(D.outreachCaveat) + '</p>' : '') +
        '<div class="issue-section"><h3>Steps <span class="illustrative">Illustrative</span></h3><ul class="steps">' +
          a.steps.map(function (st) { return '<li><span class="status-icon" aria-hidden="true"></span>' + C.esc(st) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="issue-section"><h3>Activity <span class="illustrative">Illustrative</span></h3><ul class="activity">' +
          D.actionActivity.map(function (line) { return '<li>' + C.esc(line) + '</li>'; }).join('') + '</ul></div>';
    }
  };
})(Signal.components, Signal.data);
