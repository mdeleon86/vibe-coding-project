// Shared display helpers: safe text, and the health badge (a dot plus a word, so status never relies on color alone).
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C, L) {
  C.esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  };

  C.HealthBadge = function (status) {
    return '<span class="health ' + L.toneOf(status) + '"><span class="dot" aria-hidden="true"></span>' + status + '</span>';
  };
})(Signal.components, Signal.logic);
