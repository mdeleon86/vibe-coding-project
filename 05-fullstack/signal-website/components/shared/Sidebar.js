// The persistent sidebar: brand, links to the three screens, and the data label. Becomes a top bar on phones (see 5-theme-dark.css).
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, D) {
  var ICONS = {
    overview: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5"/><rect x="9" y="9" width="5.5" height="5.5" rx="1.5"/></svg>',
    churn: '<svg viewBox="0 0 16 16" aria-hidden="true"><polyline points="1.5,12 5.5,8 8.5,10 14.5,3.5"/><line x1="1.5" y1="14.5" x2="14.5" y2="14.5"/></svg>',
    actions: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><polyline points="5,8.2 7.2,10.3 11,6"/></svg>'
  };
  C.icons = ICONS;

  C.Sidebar = {
    // user: the signed-in user ({ email }), or null in demo mode / without sign-in.
    render: function (user) {
      var n = D.recommendedActions.length;
      return '<aside class="sidebar">' +
        '<a class="brand" href="#/overview" aria-label="Signal home"><span class="logo" aria-hidden="true"></span><span>SIGNAL</span></a>' +
        '<nav class="side-nav" aria-label="Main"><ul>' +
        '<li><a class="nav-link" href="#/overview" data-screen="overview" aria-label="Overview">' + ICONS.overview +
        '<span class="nav-label">Overview</span></a></li>' +
        '<li><a class="nav-link" href="#/churn" data-screen="churn" aria-label="Churn Detail">' + ICONS.churn +
        '<span class="nav-label"><span class="nav-full">Churn Detail</span><span class="nav-short">Churn</span></span></a></li>' +
        '<li><a class="nav-link" href="#/actions" data-screen="actions" aria-label="Recommended Actions, ' + n + ' actions">' + ICONS.actions +
        '<span class="nav-label"><span class="nav-full">Recommended Actions</span><span class="nav-short">Actions</span></span>' +
        '<span class="nav-count" aria-hidden="true">' + n + '</span></a></li>' +
        '</ul></nav>' +
        '<p class="side-note"><span class="synthetic">Synthetic demo data</span><br>Week of ' + D.report.weekLabel + '</p>' +
        (user ? '<div class="side-account"><span class="side-label">Signed in as</span><span class="side-email" title="' + C.esc(user.email) + '">' +
          C.esc(user.email) + '</span><button type="button" class="side-signout" id="side-signout">Sign out</button></div>' : '') +
        '</aside>';
    },
    // Marks the link for the screen being shown.
    setCurrent: function (screen) {
      document.querySelectorAll('.nav-link').forEach(function (l) {
        if (l.dataset.screen === screen) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
      });
    }
  };
})(Signal.components, Signal.data);
