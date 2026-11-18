// Starts Signal.
//   * Signed in (or sign-in not set up, or a ?demo= link): draws the sidebar and the three screens, wires up their
//     controls, then hands over to the router.
//   * Signed out: shows the sign-in screen instead. The dashboard's data is readable only by signed-in users.
//   * The sign-in check fails or times out, or the Supabase library didn't load: shows an inline error with Retry.
//     The screen never stays on the loading skeleton, and never falls back to local data as if it were live.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L) {
  var DEMO = new URLSearchParams(location.search).has('demo');
  var started = false;

  function startDashboard(user) {
    if (started) return;
    started = true;
    document.getElementById('sidebar').outerHTML = C.Sidebar.render(user);
    document.getElementById('screens').outerHTML =
      C.OverviewScreen.render() + C.ChurnDetailScreen.render() + C.RecommendedActionsScreen.render();

    // Sign out. If the request fails or times out, the button says so and can be pressed again.
    var signOut = document.getElementById('side-signout');
    if (signOut) signOut.addEventListener('click', function () {
      signOut.disabled = true;
      signOut.textContent = 'Signing out…';
      L.auth.logOut().then(function () { location.reload(); }, function () {
        signOut.disabled = false;
        signOut.textContent = 'Sign out failed. Retry';
        signOut.setAttribute('aria-label', 'Sign out failed. Retry sign out');
      });
    });

    C.OverviewScreen.mount();
    C.ChurnDetailScreen.mount();
    Signal.router.start();
  }

  function showSignIn(message) {
    document.querySelector('.app').outerHTML = C.SignInScreen.render();
    C.SignInScreen.mount(message);
  }

  // While the sign-in is checked, show a skeleton in the dashboard's shape instead of a blank page.
  function showSkeleton() {
    document.getElementById('screens').innerHTML =
      '<div class="app-loading" aria-busy="true"><p class="visually-hidden" role="status">Loading Signal…</p>' +
      '<div aria-hidden="true"><span class="sk sk-title" style="display:block"></span></div>' +
      '<div aria-hidden="true"><span class="sk sk-line" style="display:block"></span></div>' +
      '<div class="sk-cards" aria-hidden="true"><span class="sk sk-card"></span><span class="sk sk-card"></span><span class="sk sk-card"></span><span class="sk sk-card"></span></div>' +
      '<span class="sk sk-panel" aria-hidden="true" style="display:block"></span></div>';
  }

  // Inline error in place of the skeleton. onRetry runs when Retry is pressed.
  function showStartupError(text, onRetry) {
    document.getElementById('screens').innerHTML =
      '<div class="app-loading"><div class="state-msg error" role="alert"><p>' + C.esc(text) + '</p>' +
      '<button type="button" class="btn secondary" id="app-retry">Retry</button></div></div>';
    var retry = document.getElementById('app-retry');
    retry.addEventListener('click', onRetry);
    retry.focus();
  }

  // Errors from an email confirmation link arrive in the address, e.g. #error=access_denied&error_description=...
  function linkError() {
    var params = new URLSearchParams(location.hash.slice(1));
    var desc = params.get('error_description');
    if (!desc) return null;
    history.replaceState(null, '', location.pathname + location.search);
    return 'That email link didn\'t work: ' + desc + '. Log in, or sign up again for a new link.';
  }

  if (DEMO) {
    startDashboard(null);   // demo links use the local synthetic data
    return;
  }
  if (L.auth.libraryMissing) {
    // config.js asks for Supabase, but its library didn't load. Don't show local numbers as if they were live.
    showStartupError('Signal couldn\'t load its sign-in service. Check your connection, then retry.', function () { location.reload(); });
    return;
  }
  if (!L.auth.available) {
    startDashboard(null);   // no config.js: a local setup that runs on the local synthetic data
    return;
  }

  var message = linkError();
  function checkSignIn() {
    showSkeleton();
    L.auth.getSession().then(function (session) {
      if (session) startDashboard(session.user);
      else showSignIn(message);
    }, function (err) {
      showStartupError('We couldn\'t check your sign-in. ' + err.message, checkSignIn);
    });
  }
  checkSignIn();

  // Signed out in another tab, or the session ended: go back to the sign-in screen.
  L.auth.onChange(function (event) {
    if (event === 'SIGNED_OUT' && started) location.reload();
  });
})(Signal.components, Signal.logic);
