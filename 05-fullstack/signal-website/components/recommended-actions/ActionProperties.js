// Recommended Actions: the properties panel on the right (status, priority, owner, timing, labels, linked metric, dependencies).
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, D) {
  function findAction(id) { return D.recommendedActions.filter(function (a) { return a.id === id; })[0]; }
  function actionLink(id) {
    var a = findAction(id);
    return '<a href="#/actions/' + id + '" title="' + C.esc(a.title) + '">' + id + '</a><span class="muted prop-trunc">' + C.esc(a.title) + '</span>';
  }
  function prop(label, value, extraClass) {
    return '<div class="prop"><span class="prop-label">' + label + '</span><span class="prop-value' + (extraClass ? ' ' + extraClass : '') + '">' + value + '</span></div>';
  }

  C.ActionProperties = {
    render: function (a) {
      return '<h3>Properties <span class="illustrative">Illustrative</span></h3>' +
        prop('Status', '<span class="status-icon" aria-hidden="true"></span>' + a.status) +
        prop('Priority', C.PriorityIcon(a.priority) + a.priority, 'prio') +
        prop('Owner', '<span class="avatar" aria-hidden="true">' + a.initials + '</span>' + C.esc(a.owner) + ' <span class="muted">(example)</span>') +
        prop('Timing', C.esc(a.timing)) +
        prop('Labels', a.labels.map(function (l) { return '<span class="label-chip">' + C.esc(l) + '</span>'; }).join('')) +
        prop('Linked metric', '<a href="#/churn">Account churn rate</a>') +
        (a.dependsOn ? prop('Depends on', actionLink(a.dependsOn), 'nowrap') : '') +
        (a.blocks ? prop('Leads to', actionLink(a.blocks), 'nowrap') : '');
    }
  };
})(Signal.components, Signal.data);
