// Recommended Actions: the Strategic Execution Plan. Three numbered steps in dependency order (strategy.plan).
// Each step is a native <details> element: collapsed, it shows only the number, title and one-line summary;
// expanded, it shows the existing action's why, measure, checklist, dependencies, example owner/timing,
// task ID and activity log. The primary step's owner and timeline are on the recommendation card, so they aren't repeated.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, D) {
  function action(id) { return D.recommendedActions.filter(function (a) { return a.id === id; })[0]; }
  function stepNumber(id) { return D.strategy.plan.map(function (s) { return s.actionId; }).indexOf(id) + 1; }
  function stepRef(id) {
    var n = stepNumber(id);
    return n ? 'Step ' + n + ': ' + C.esc(D.strategy.plan[n - 1].title) : C.esc(id);
  }
  function block(title, html) { return '<div class="ra-block"><h4>' + title + '</h4>' + html + '</div>'; }

  function step(s, i) {
    var a = action(s.actionId);
    var deps = (a.dependsOn ? '<li>Depends on ' + stepRef(a.dependsOn) + '</li>' : '') + (a.blocks ? '<li>Leads to ' + stepRef(a.blocks) + '</li>' : '');
    return '<li class="ra-step-item">' +
      '<details class="ra-step" id="ac-step-' + a.id + '">' +
        '<summary>' +
          '<span class="ra-num" aria-hidden="true">' + (i + 1) + '</span>' +
          '<span class="ra-step-text"><span class="ra-step-title">' + C.esc(s.title) + '</span>' +
            '<span class="ra-step-summary">' + C.esc(s.summary) + '</span></span>' +
          '<span class="ra-toggle" aria-hidden="true"></span>' +
        '</summary>' +
        '<div class="ra-step-body">' +
          '<p class="ra-step-desc">' + C.esc(a.desc) + '</p>' +
          '<div class="ra-blocks">' +
            block('Why it matters', '<p>' + C.esc(a.why) + '</p>') +
            block('How it\'s measured', '<p>' + C.esc(a.measure) + '</p>') +
          '</div>' +
          block('Checklist', '<ul class="steps">' + a.steps.map(function (st) {
            return '<li><span class="status-icon" aria-hidden="true"></span>' + C.esc(st) + '</li>';
          }).join('') + '</ul>') +
          '<div class="ra-blocks">' +
            (deps ? block('Dependencies', '<ul class="ra-deps">' + deps + '</ul>') : '') +
            (a.primary ? '' : block('Example responsibility', '<p>' + C.esc(a.owner) + ' · ' + C.esc(a.timing) + '</p>')) +
          '</div>' +
          '<details class="ra-activity"><summary>Activity log</summary><ul class="activity">' +
            D.actionActivity.map(function (line) { return '<li>' + C.esc(line) + '</li>'; }).join('') + '</ul></details>' +
          '<p class="ra-task-id">Task ID: ' + a.id + '</p>' +
        '</div>' +
      '</details>' +
    '</li>';
  }

  C.ExecutionPlan = {
    render: function () {
      return '<section class="ra-section" aria-labelledby="ra-plan-title">' +
        '<h2 class="ra-section-title" id="ra-plan-title">Strategic Execution Plan</h2>' +
        '<p class="ra-section-sub">Three steps, in the order each depends on the last. Open a step for its checklist and details.</p>' +
        '<ol class="ra-plan">' + D.strategy.plan.map(step).join('') + '</ol>' +
      '</section>';
    },
    // Opens one step (used by links such as #/actions/SIG-2). Returns its summary, so the caller can move focus there.
    open: function (id) {
      var el = document.getElementById('ac-step-' + id);
      if (!el) return null;
      el.open = true;
      return el.querySelector('summary');
    }
  };
})(Signal.components, Signal.data);
