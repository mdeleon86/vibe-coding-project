// Network safety net shared by every request Signal makes (sign-in, sign-out, data).
// A request that never answers must not freeze the screen: after `ms` the promise is rejected with `message`,
// so the screen can show its error state with Retry.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (L) {
  L.withTimeout = function (promise, ms, message) {
    var timer;
    var timeout = new Promise(function (resolve, reject) {
      timer = setTimeout(function () {
        var err = new Error(message);
        err.timedOut = true;
        reject(err);
      }, ms);
    });
    return Promise.race([promise, timeout]).then(
      function (value) { clearTimeout(timer); return value; },
      function (err) { clearTimeout(timer); throw err; }
    );
  };
})(Signal.logic);
