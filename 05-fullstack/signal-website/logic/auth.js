// Sign-in for Signal (Supabase Auth, email and password).
// Uses the official Supabase JS library loaded in index.html. It keeps the session in the browser and refreshes
// the login token on its own. Only the publishable (anon) key is used here; never the service_role key.
// Signal.logic.auth.available is false when config.js or the library is missing; the app then runs on local data.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (L) {
  var s = Signal.config && Signal.config.supabase;
  var client = window.supabase && s && s.url && s.anonKey ? window.supabase.createClient(s.url, s.anonKey) : null;

  // Turns Supabase's error messages into plain language for the sign-in screen.
  function friendly(err) {
    var m = (err && err.message) || '';
    if (err && err.timedOut) return m;
    if (/invalid login credentials/i.test(m)) return 'Wrong email or password.';
    if (/email not confirmed/i.test(m)) return 'Confirm your email first. Check your inbox for the link, then log in.';
    if (/already registered/i.test(m)) return 'An account with this email already exists. Log in instead.';
    if (/password should be at least/i.test(m)) return 'Use a password of at least 6 characters.';
    if (/rate limit|too many/i.test(m)) return 'Too many attempts. Wait a minute and try again.';
    if (/failed to fetch|network/i.test(m)) return 'Couldn\'t reach the sign-in service. Check your connection and try again.';
    return 'Something went wrong: ' + m;
  }

  // Every sign-in request gives up after this long, so a button or screen can never stay stuck on "Working…".
  var TIMEOUT_MS = 10000;
  var TIMED_OUT = 'The sign-in service didn\'t respond. Check your connection and try again.';
  function limit(promise) { return L.withTimeout(promise, TIMEOUT_MS, TIMED_OUT); }

  L.auth = {
    available: !!client,
    // config.js is filled in, but the Supabase library didn't load (for example, the CDN couldn't be reached).
    libraryMissing: !window.supabase && !!(s && s.url && s.anonKey),

    // The current session, or null when signed out. Rejects if the check fails or takes too long
    // (it can need the network to refresh an expired login), so the app can show an error with Retry.
    getSession: function () {
      return limit(client.auth.getSession()).then(function (r) {
        if (r.error) throw new Error(friendly(r.error));
        return r.data.session;
      });
    },

    // The token that proves who is signed in. Sent with data requests so the database's access rules apply.
    accessToken: function () {
      return client ? L.auth.getSession().then(function (sess) { return sess ? sess.access_token : null; }) : Promise.resolve(null);
    },

    // Resolves to { session } when signed in straight away, or { needsConfirmation: true } when Supabase emails a link first.
    signUp: function (email, password) {
      return limit(client.auth.signUp({ email: email, password: password, options: { emailRedirectTo: location.origin + location.pathname } }))
        .then(function (r) {
          if (r.error) throw new Error(friendly(r.error));
          return r.data.session ? { session: r.data.session } : { needsConfirmation: true };
        }, function (e) { throw new Error(friendly(e)); });
    },

    logIn: function (email, password) {
      return limit(client.auth.signInWithPassword({ email: email, password: password }))
        .then(function (r) {
          if (r.error) throw new Error(friendly(r.error));
          return r.data.session;
        }, function (e) { throw new Error(friendly(e)); });
    },

    logOut: function () {
      return limit(client.auth.signOut()).then(function (r) {
        if (r && r.error) throw new Error(friendly(r.error));
      });
    },

    // Calls back with 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED', etc.
    onChange: function (callback) { client.auth.onAuthStateChange(function (event) { callback(event); }); },

    // The signed-in user's own profile row. Row-level security returns only rows where user_id matches the session.
    myProfiles: function () {
      return client.from('profiles').select('user_id, email, created_at').then(function (r) {
        if (r.error) throw r.error;
        return r.data;
      });
    }
  };
})(Signal.logic);
