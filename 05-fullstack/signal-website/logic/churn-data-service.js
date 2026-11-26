// Data fetch for the Churn Detail plan breakdown (PRD R13).
//
// Where the data comes from:
//   * Supabase, when config.js has a project URL and anon key. It reads the plans table and each plan's
//     weekly_plan_counts through Supabase's built-in web API (read-only, see supabase/README.md).
//   * The local synthetic data in data/churn-data.js, only when config.js is missing or blank, or in ?demo= links.
// When Supabase fails (offline, slower than 8 seconds, refused, or unexpected data), the promise is rejected so the
// screen shows its error state with Retry. It never shows local numbers as if they were live.
// When Supabase has no plan data at all, it resolves to [] so the screen shows its empty state.
//   Signal.logic.lastDataSource says what the latest load used: 'supabase', 'local' or 'failed'.
//
// Demo the screen states by adding one of these to the page address, before the #. Demos use the local data:
//   ?demo=slow   the loading skeleton stays up for 5 seconds
//   ?demo=empty  the 5-week period returns no data; 12 and 26 weeks load normally
//   ?demo=error  the first fetch fails; Retry then succeeds
var Signal = window.Signal = window.Signal || { data: {}, logic: {}, components: {} };

(function (L, D) {
  var DEMO = new URLSearchParams(location.search).get('demo');
  var TIMEOUT_MS = 8000;
  var fetchCount = 0;
  L.lastDataSource = null;

  function supabaseSettings() {
    var s = Signal.config && Signal.config.supabase;
    return s && s.url && s.anonKey ? { url: s.url.replace(/\/+$/, ''), anonKey: s.anonKey } : null;
  }

  // The simulated fetch: local synthetic data after a short delay.
  function simulated(weeks, attempt) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (DEMO === 'error' && attempt === 1) reject(new Error('Simulated fetch failure'));
        else if (DEMO === 'empty' && weeks === 5) resolve([]);
        else resolve(D.plans);
      }, DEMO === 'slow' ? 5000 : 600);
    });
  }

  // One request: every plan, with its weekly counts embedded, oldest week first.
  // Sends the signed-in user's token, because the database lets only signed-in users read this data.
  function fromSupabase(s) {
    var query = '/rest/v1/plans?select=name,color,sort_order,weekly_plan_counts(week_start,starting_accounts,cancellations)' +
      '&order=sort_order.asc&weekly_plan_counts.order=week_start.asc';
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);
    var token = L.auth ? L.auth.accessToken() : Promise.resolve(null);
    return token.then(function (accessToken) {
      return fetch(s.url + query, {
        headers: { apikey: s.anonKey, Authorization: 'Bearer ' + (accessToken || s.anonKey) },
        signal: controller.signal
      });
    }).then(function (res) {
      if (!res.ok) throw new Error('Supabase returned HTTP ' + res.status);
      return res.json();
    }).then(toPlans).finally(function () { clearTimeout(timer); });
  }

  // Reshape database rows into the format the screens use: { name, accounts, color, cancels: [oldest … newest] }.
  // The rest of the app expects every plan to cover the same weeks as the local data, so anything else is rejected.
  function toPlans(rows) {
    var weeksExpected = D.plans[0].cancels.length;
    var noData = rows.every(function (r) { return !(r.weekly_plan_counts || []).length; });
    if (noData) return [];   // no plans, or plans with no weekly counts yet: the empty state
    var plans = rows.map(function (r) {
      var counts = r.weekly_plan_counts || [];
      if (counts.length !== weeksExpected) throw new Error('Plan ' + r.name + ' has ' + counts.length + ' weeks of counts; expected ' + weeksExpected);
      return {
        name: r.name,
        color: r.color,
        accounts: counts[counts.length - 1].starting_accounts,   // starting accounts in the latest week
        cancels: counts.map(function (c) { return c.cancellations; })
      };
    });
    return plans;
  }

  L.fetchPlanBreakdown = function (weeks) {
    fetchCount += 1;
    var attempt = fetchCount;
    var s = supabaseSettings();
    if (DEMO || !s) {
      L.lastDataSource = 'local';
      return simulated(weeks, attempt);
    }
    // The overall limit also covers getting the login token first, which can need the network.
    var whole = L.withTimeout(fromSupabase(s), TIMEOUT_MS + 500, 'Loading churn data took too long.');
    return whole.then(function (plans) {
      L.lastDataSource = 'supabase';
      return plans;
    }, function (err) {
      console.warn('Signal: could not load plans from Supabase.', err);
      L.lastDataSource = 'failed';
      throw err;
    });
  };
})(Signal.logic, Signal.data);
