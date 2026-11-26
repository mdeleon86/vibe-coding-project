// Navigation between the three screens: #/overview, #/churn and #/actions/SIG-n.
// Each screen has its own address, so links, bookmarks and the browser's Back button all work.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C) {
  var SCREENS = {
    overview: { id: 'screen-overview', component: C.OverviewScreen },
    churn: { id: 'screen-churn', component: C.ChurnDetailScreen },
    actions: { id: 'screen-actions', component: C.RecommendedActionsScreen }
  };
  var currentScreen = null;

  function route() {
    var m = /^#\/(overview|churn|actions)(?:\/(SIG-\d+))?$/.exec(location.hash);
    var name = m ? m[1] : 'overview';
    var changedScreen = name !== currentScreen;
    Object.keys(SCREENS).forEach(function (k) { document.getElementById(SCREENS[k].id).hidden = k !== name; });
    C.Sidebar.setCurrent(name);
    if (changedScreen) {
      var shown = document.getElementById(SCREENS[name].id);
      shown.classList.remove('screen-enter');
      void shown.offsetWidth; // restarts the fade-in animation
      shown.classList.add('screen-enter');
    }
    if (name === 'actions') C.RecommendedActionsScreen.show(m && m[2] && C.RecommendedActionsScreen.has(m[2]) ? m[2] : null);
    if (name === 'churn') C.ChurnDetailScreen.show(changedScreen);
    var firstLoad = currentScreen === null;
    currentScreen = name;
    if (firstLoad && name === 'overview') return;
    // Move keyboard and screen-reader focus to the new screen's heading.
    if (changedScreen) {
      window.scrollTo(0, 0);
      document.getElementById(SCREENS[name].component.headingId).focus({ preventScroll: true });
    } else if (name === 'actions') {
      C.RecommendedActionsScreen.focusTarget().focus();
    }
  }

  Signal.router = {
    start: function () {
      window.addEventListener('hashchange', route);
      window.addEventListener('popstate', route);
      // Screen links use history.pushState instead of a plain #link, because some previews load the
      // page as a data: URL, where #link navigation is silently blocked.
      document.addEventListener('click', function (evt) {
        var link = evt.target.closest('a[href^="#/"]');
        if (!link || evt.defaultPrevented || evt.button !== 0 || evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey) return;
        evt.preventDefault();
        var target = link.getAttribute('href');
        if (target === location.hash) return;
        try { history.pushState(null, '', target); } catch (e) { location.hash = target; return; }
        route();
      });
      // Charts are drawn at their on-screen width, so redraw the open Churn Detail charts after a resize.
      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { if (currentScreen === 'churn') C.ChurnDetailScreen.resize(); }, 150);
      });
      route();
    }
  };
})(Signal.components);
