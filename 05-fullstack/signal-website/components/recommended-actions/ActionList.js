// Recommended Actions: the action list across the top (ID, title, priority, owner).
// Shows PAGE_SIZE actions per page. The Previous / Next pager appears only when there are more actions than that.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, D) {
  var PAGE_SIZE = 10;
  var page = 0, currentId = null;

  // Priority icon: "!" for Urgent, otherwise 1 to 3 filled bars.
  C.PriorityIcon = function (p) {
    if (p === 'Urgent') return '<span class="prio-urgent" aria-hidden="true">!</span>';
    var on = p === 'High' ? 3 : p === 'Medium' ? 2 : 1;
    return '<span class="prio-icon" aria-hidden="true">' + [5, 8, 11].map(function (h, i) {
      return '<i class="' + (i < on ? 'on' : '') + '" style="height:' + h + 'px"></i>';
    }).join('') + '</span>';
  };

  function pageCount() { return Math.max(1, Math.ceil(D.recommendedActions.length / PAGE_SIZE)); }

  function rows() {
    return D.recommendedActions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(function (a) {
      return '<li><a class="issue-row" href="#/actions/' + a.id + '" data-id="' + a.id + '" title="' + C.esc(a.title) + '"' +
        (a.id === currentId ? ' aria-current="true"' : '') + '>' +
        '<span class="status-icon" aria-hidden="true"></span><span class="issue-id">' + a.id + '</span>' +
        '<span class="issue-title">' + C.esc(a.title) + '</span>' +
        '<span class="row-prio" title="' + a.priority + ' priority">' + C.PriorityIcon(a.priority) + '</span>' +
        '<span class="avatar" aria-hidden="true">' + a.initials + '</span>' +
        '<span class="visually-hidden" style="position:absolute;left:-9999px">' + a.status + ', ' + a.priority + ' priority, owner ' + C.esc(a.owner) + ' (example)</span></a></li>';
    }).join('');
  }

  function pager() {
    var total = D.recommendedActions.length;
    if (total <= PAGE_SIZE) return '';
    var first = page * PAGE_SIZE + 1, last = Math.min(total, (page + 1) * PAGE_SIZE);
    return '<button type="button" data-page="prev"' + (page === 0 ? ' disabled' : '') + '>‹ Previous</button>' +
      '<span>' + first + '–' + last + ' of ' + total + '</span>' +
      '<button type="button" data-page="next"' + (page >= pageCount() - 1 ? ' disabled' : '') + '>Next ›</button>';
  }

  function draw() {
    var list = document.getElementById('ac-list'), nav = document.getElementById('ac-pager');
    if (!list) return;
    list.innerHTML = rows();
    nav.innerHTML = pager();
    nav.hidden = !nav.innerHTML;
  }

  // Pager clicks (one listener for the whole page, so it survives redraws).
  document.addEventListener('click', function (evt) {
    var btn = evt.target.closest('#ac-pager button');
    if (!btn || btn.disabled) return;
    page = Math.min(pageCount() - 1, Math.max(0, page + (btn.dataset.page === 'next' ? 1 : -1)));
    draw();
    var same = document.querySelector('#ac-pager button[data-page="' + btn.dataset.page + '"]');
    (same && !same.disabled ? same : document.querySelector('#ac-pager button:not([disabled])') || document.querySelector('#ac-list .issue-row')).focus();
  });

  C.ActionList = {
    render: function () {
      var A = D.recommendedActions;
      return '<nav class="issue-list" aria-label="Actions">' +
        '<div class="issue-list-head"><span>Actions</span><span id="ac-count">' + A.length + '</span></div>' +
        '<ul id="ac-list">' + rows() + '</ul>' +
        '<div class="ac-pager" id="ac-pager" role="group" aria-label="Action pages"' + (pager() ? '' : ' hidden') + '>' + pager() + '</div>' +
      '</nav>';
    },
    // Highlights the selected action, turning to the page it is on.
    setCurrent: function (id) {
      currentId = id;
      var index = D.recommendedActions.map(function (a) { return a.id; }).indexOf(id);
      if (index >= 0) page = Math.floor(index / PAGE_SIZE);
      draw();
    }
  };
})(Signal.components, Signal.data);
