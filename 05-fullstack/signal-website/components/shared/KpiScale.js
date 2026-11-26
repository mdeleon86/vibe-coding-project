// A green / yellow / red health scale with a marker at the current value (used by the Overview KPI cards).
// o: min and max of the scale, caution and bad thresholds, current value, fmt for numbers, a short label and screen-reader text.
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (C) {
  C.KpiScale = function (o) {
    function pos(v) { return Math.max(0, Math.min(100, (v - o.min) / (o.max - o.min) * 100)); }
    var c = pos(o.caution), b = pos(o.bad), v = pos(o.value);
    return '<div class="scale" role="img" aria-label="' + C.esc(o.aria) + '">' +
      '<div class="scale-bar"><span class="sc-good" style="width:' + c + '%"></span><span class="sc-caution" style="width:' + (b - c) + '%"></span>' +
      '<span class="sc-bad" style="width:' + (100 - b) + '%"></span><span class="scale-marker" style="left:' + v + '%"></span></div>' +
      '<div class="scale-ticks" aria-hidden="true"><span style="left:' + ((c + b) / 2) + '%">' + o.fmt(o.caution) + '–' + o.fmt(o.bad) + '</span></div></div>' +
      '<p class="scale-label" aria-hidden="true">' + o.label + '</p>';
  };
})(Signal.components);
