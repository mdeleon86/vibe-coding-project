// Number formatting shared by every screen. No data and no page markup.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (L) {
  // One decimal place, rounding halves up (4.35 -> "4.4"), returned as text.
  L.round1 = function (x) { return (Math.round(x * 10 + 1e-9) / 10).toFixed(1); };

  // A signed number with a real minus sign, and no sign on zero: +1.2, −0.3, 0.0.
  L.signed = function (x, digits) {
    var s = Math.abs(x).toFixed(digits);
    return Number(s) === 0 ? s : (x < 0 ? '−' : '+') + s;
  };

  L.thousands = function (n) { return n.toLocaleString('en-US'); };

  // Formats a value by its unit: count 2,912 · percent 42.1% · currency $111,200.
  L.formatValue = function (v, unit) {
    if (unit === 'percent') return v.toFixed(1) + '%';
    if (unit === 'currency') return '$' + L.thousands(v);
    return L.thousands(v);
  };

  // Short week label, such as "Oct 26".
  L.weekLabel = function (date) { return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };
})(Signal.logic);
