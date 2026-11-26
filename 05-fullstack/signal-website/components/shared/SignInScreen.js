// The sign-in screen shown to signed-out visitors: email and password, with Log in and Sign up modes.
// Messages are set with textContent, so nothing typed or returned by the server is treated as HTML.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L) {
  var mode = 'login';

  function setMode(next) {
    mode = next;
    var signup = mode === 'signup';
    document.getElementById('si-tab-login').setAttribute('aria-pressed', String(!signup));
    document.getElementById('si-tab-signup').setAttribute('aria-pressed', String(signup));
    document.getElementById('si-title').textContent = signup ? 'Create your Signal account' : 'Log in to Signal';
    document.getElementById('si-password').setAttribute('autocomplete', signup ? 'new-password' : 'current-password');
    document.getElementById('si-password-hint').hidden = !signup;
    document.getElementById('si-submit').textContent = signup ? 'Sign up' : 'Log in';
    say('', '');
  }

  function say(text, tone) {
    var box = document.getElementById('si-message');
    box.textContent = text;
    box.className = 'si-message' + (tone ? ' ' + tone : '');
  }

  C.SignInScreen = {
    render: function () {
      return '<main class="sign-in" aria-labelledby="si-title">' +
        '<div class="si-card">' +
          '<p class="si-brand"><span class="si-logo" aria-hidden="true"></span>SIGNAL</p>' +
          '<h1 id="si-title" class="si-title">Log in to Signal</h1>' +
          '<p class="muted small">The weekly metrics dashboard is available to signed-in team members.</p>' +
          '<div class="si-tabs" role="group" aria-label="Choose">' +
            '<button type="button" id="si-tab-login" aria-pressed="true">Log in</button>' +
            '<button type="button" id="si-tab-signup" aria-pressed="false">Sign up</button>' +
          '</div>' +
          '<form id="si-form" novalidate>' +
            '<label for="si-email">Email</label>' +
            '<input id="si-email" type="email" autocomplete="email" required>' +
            '<label for="si-password">Password</label>' +
            '<input id="si-password" type="password" autocomplete="current-password" minlength="6" required aria-describedby="si-password-hint">' +
            '<p id="si-password-hint" class="muted small" hidden>At least 6 characters.</p>' +
            '<button class="btn si-submit" id="si-submit" type="submit">Log in</button>' +
            '<p id="si-message" class="si-message" role="status" aria-live="polite"></p>' +
          '</form>' +
          '<p class="muted small si-note"><span class="synthetic">Synthetic demo data</span> No real customer or company data is used.</p>' +
        '</div>' +
      '</main>';
    },

    // initialMessage: optional text to show straight away, such as an error from an email link.
    mount: function (initialMessage) {
      document.getElementById('si-tab-login').addEventListener('click', function () { setMode('login'); });
      document.getElementById('si-tab-signup').addEventListener('click', function () { setMode('signup'); });
      if (initialMessage) say(initialMessage, 'bad');

      document.getElementById('si-form').addEventListener('submit', function (evt) {
        evt.preventDefault();
        var email = document.getElementById('si-email').value.trim();
        var password = document.getElementById('si-password').value;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say('Enter a valid email address.', 'bad'); return; }
        if (password.length < 6) { say('Use a password of at least 6 characters.', 'bad'); return; }

        var button = document.getElementById('si-submit');
        button.disabled = true;
        button.textContent = 'Working…';
        say('', '');

        var request = mode === 'signup' ? L.auth.signUp(email, password) : L.auth.logIn(email, password).then(function (session) { return { session: session }; });
        request.then(function (result) {
          if (result.needsConfirmation) {
            setMode('login');
            say('Check your email for a confirmation link. After confirming, come back here and log in.', 'good');
          } else {
            say('Signed in. Loading your dashboard…', 'good');
            location.reload();   // starts the dashboard with the new session
          }
        }, function (err) {
          say(err.message, 'bad');
        }).then(function () {
          button.disabled = false;
          button.textContent = mode === 'signup' ? 'Sign up' : 'Log in';
        });
      });
      document.getElementById('si-email').focus();
    }
  };
})(Signal.components, Signal.logic);
