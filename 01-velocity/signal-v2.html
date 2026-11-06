<!doctype html>
<!-- Signal V2: self-contained prototype (HTML + embedded CSS, no external files). Synthetic data only. -->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Signal V2 · Weekly metrics</title>
  <style>
    :root {
      --bg: #f5f6f8;
      --surface: #ffffff;
      --text: #111827;
      --muted: #6b7280;
      --border: #e5e7eb;
      --accent: #4338ca;
      --accent-soft: #eef0ff;

      /* Health colors: dark tone for text/marks, soft tone for backgrounds */
      --good: #15803d;
      --good-soft: #dcfce7;
      --caution: #b45309;
      --caution-soft: #fef3c7;
      --bad: #b91c1c;
      --bad-soft: #fee2e2;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font: 16px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      padding: 14px 16px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
    }
    .brand { display: flex; align-items: center; gap: 8px; font-weight: 700; }
    .logo { width: 14px; height: 14px; border-radius: 4px; background: var(--accent); }
    .week { color: var(--muted); font-size: 14px; }

    main { max-width: 880px; margin: 0 auto; padding: 32px 16px 16px; display: grid; gap: 28px; }

    .label {
      margin: 0;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--muted);
    }

    /* Health badges */
    .health {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.6;
      white-space: nowrap;
    }
    .health .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
    .health.good { color: var(--good); background: var(--good-soft); }
    .health.caution { color: var(--caution); background: var(--caution-soft); }
    .health.bad { color: var(--bad); background: var(--bad-soft); }

    /* Most important insight */
    .insight {
      background: var(--surface);
      border: 1px solid var(--border);
      border-top: 5px solid var(--bad);
      border-radius: 16px;
      padding: 28px;
      display: grid;
      gap: 20px;
    }
    .metric-name { margin: 0; font-size: 18px; font-weight: 600; }
    .value-row { display: flex; align-items: baseline; gap: 8px 16px; flex-wrap: wrap; }
    .value { margin: 0; font-size: 72px; font-weight: 700; line-height: 1.05; letter-spacing: -0.02em; }
    .change { margin: 0; font-size: 22px; font-weight: 700; }
    .change.bad { color: var(--bad); }
    .vs { font-size: 15px; font-weight: 400; color: var(--muted); }
    .value-row .health { align-self: center; }
    .takeaway { margin: 12px 0 0; font-size: 19px; line-height: 1.45; max-width: 52ch; }

    /* Churn trend chart */
    .trend { margin: 0; }
    .trend-title { font-size: 14px; font-weight: 600; color: var(--muted); margin-bottom: 6px; }
    .trend-chart { display: block; width: 100%; max-width: 480px; height: auto; overflow: visible; }
    .trend-chart text { font-family: inherit; font-size: 11px; fill: var(--muted); }
    .trend-chart .zone-good { fill: var(--good-soft); opacity: 0.6; }
    .trend-chart .zone-caution { fill: var(--caution-soft); opacity: 0.8; }
    .trend-chart .zone-bad { fill: var(--bad-soft); opacity: 0.6; }
    .trend-chart .zone-labels text { font-size: 10.5px; font-weight: 600; }
    .trend-chart .zone-labels .good { fill: var(--good); }
    .trend-chart .zone-labels .caution { fill: var(--caution); }
    .trend-chart .zone-labels .bad { fill: var(--bad); }
    .trend-chart .grid line { stroke: #ffffff; stroke-opacity: 0.7; stroke-width: 1; }
    .trend-chart .benchmark { stroke: #6b7280; stroke-width: 1.5; stroke-dasharray: 4 4; }
    .trend-chart .benchmark-label { font-size: 11px; font-weight: 600; }
    .trend-chart .trend-line { fill: none; stroke: #374151; stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
    .trend-chart .points circle { fill: #374151; stroke: var(--surface); stroke-width: 2; }
    .trend-chart .points .now { fill: var(--bad); }
    .trend-chart .now-label { font-size: 12px; font-weight: 700; fill: var(--text); }
    .trend-note { margin: 8px 0 0; font-size: 13px; color: var(--muted); max-width: 62ch; }

    /* Recommended action */
    .action { background: var(--accent-soft); border: 1px solid #c7d2fe; border-radius: 12px; padding: 18px 20px; }
    .action .label { color: var(--accent); }
    .action-text { margin: 6px 0 0; font-size: 20px; font-weight: 700; line-height: 1.35; }
    .plan { display: grid; grid-template-columns: max-content 1fr; gap: 6px 16px; margin: 14px 0 0; font-size: 15px; }
    .plan dt { font-weight: 700; color: var(--accent); }
    .plan dd { margin: 0; }
    .caveat { margin: 14px 0 0; padding-top: 12px; border-top: 1px solid #c7d2fe; font-size: 13px; color: var(--muted); font-style: italic; }

    /* Everything else */
    .tiles { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 12px; }
    .tile { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; }
    .tile p { margin: 0; }
    .tile-name { font-size: 14px; color: var(--muted); }
    .tile-head { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 8px; margin-top: 2px; }
    .tile-head .health { font-size: 12px; padding: 1px 8px; }
    .tile-value { font-size: 22px; font-weight: 700; }
    .tile-change { font-size: 13px; color: var(--muted); }
    .spark { display: block; width: 100%; height: 28px; margin-top: 10px; overflow: visible; }
    .spark polyline { fill: none; stroke: #9ca3af; stroke-width: 1.5; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
    .spark .spark-end { stroke: var(--muted); stroke-width: 5; stroke-linecap: round; vector-effect: non-scaling-stroke; }
    .spark .spark-threshold { stroke: var(--caution); stroke-width: 1.25; stroke-dasharray: 4 3; vector-effect: non-scaling-stroke; }
    .tile .tile-trend { font-size: 12px; color: var(--muted); margin-top: 4px; }

    /* Glossary and health ratings */
    .explainers { display: grid; gap: 12px; }
    .glossary { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; font-size: 14px; }
    .glossary summary { cursor: pointer; font-weight: 600; color: var(--muted); }
    .glossary dl { margin: 12px 0 0; display: grid; gap: 10px; }
    .glossary dt { font-weight: 700; }
    .glossary dd { margin: 2px 0 0; color: var(--muted); }
    .direction { font-weight: 400; color: var(--muted); }
    .legend { list-style: none; margin: 12px 0 0; padding: 0; display: grid; gap: 8px; }
    .legend .health { margin-right: 6px; }
    .ratings-note { margin: 12px 0 0; font-size: 13px; color: var(--muted); font-style: italic; }

    footer { text-align: center; color: var(--muted); font-size: 13px; padding: 16px 16px 28px; }

    @media (max-width: 700px) {
      .tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 480px) {
      main { padding-top: 20px; }
      .insight { padding: 20px; }
      .value { font-size: 56px; }
      .plan { grid-template-columns: 1fr; gap: 0; }
      .plan dd { margin-bottom: 8px; }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <span class="brand"><span class="logo" aria-hidden="true"></span>Signal</span>
    <span class="week">Week of Oct 26 – Nov 1, 2026</span>
  </header>

  <main>
    <section class="insight" aria-labelledby="insight-label">
      <p class="label" id="insight-label">Most important insight this week</p>

      <div class="headline">
        <p class="metric-name">Account churn rate</p>
        <div class="value-row">
          <p class="value">4.4%</p>
          <p class="change bad"><span aria-hidden="true">▲</span> +38% <span class="vs">vs typical week (3.2%)</span></p>
          <span class="health bad"><span class="dot" aria-hidden="true"></span>Needs attention</span>
        </div>
        <p class="takeaway">More accounts are cancelling than usual, and almost all of the increase is coming from Starter-plan customers.</p>
      </div>

      <figure class="trend">
        <figcaption class="trend-title">Weekly churn rate, last 5 weeks</figcaption>
        <svg class="trend-chart" viewBox="0 0 340 186" role="img" aria-labelledby="trend-svg-title trend-svg-desc">
          <title id="trend-svg-title">Weekly account churn rate, last 5 weeks, with health zones</title>
          <desc id="trend-svg-desc">Week of Sep 28: 3.1%. Oct 5: 3.3%. Oct 12: 3.2%. Oct 19: 3.2%. All four are in the Healthy zone, below 3.5%. Oct 26, this week: 4.4%, in the Needs attention zone, above 4.0%. Typical week: 3.2%.</desc>
          <g class="zones">
            <rect class="zone-bad" x="34" y="24" width="296" height="50.4"/>
            <rect class="zone-caution" x="34" y="74.4" width="296" height="25.2"/>
            <rect class="zone-good" x="34" y="99.6" width="296" height="50.4"/>
          </g>
          <g class="zone-labels">
            <text class="bad" x="38" y="35">Needs attention (above 4.0%)</text>
            <text class="caution" x="38" y="90.5">Caution (3.5–4.0%)</text>
            <text class="good" x="38" y="146">Healthy (below 3.5%)</text>
          </g>
          <g class="grid">
            <line x1="34" x2="330" y1="124.8" y2="124.8"/>
            <line x1="34" x2="330" y1="74.4" y2="74.4"/>
            <line x1="34" x2="330" y1="24" y2="24"/>
          </g>
          <g class="axis">
            <text x="28" y="128.8" text-anchor="end">3%</text>
            <text x="28" y="78.4" text-anchor="end">4%</text>
            <text x="28" y="28" text-anchor="end">5%</text>
            <text x="48" y="174" text-anchor="middle">Sep 28</text>
            <text x="112" y="174" text-anchor="middle">Oct 5</text>
            <text x="176" y="174" text-anchor="middle">Oct 12</text>
            <text x="240" y="174" text-anchor="middle">Oct 19</text>
            <text x="304" y="174" text-anchor="middle">Oct 26</text>
          </g>
          <line class="benchmark" x1="34" x2="330" y1="114.72" y2="114.72"/>
          <text class="benchmark-label" x="330" y="140" text-anchor="end">Typical week: 3.2%</text>
          <polyline class="trend-line" points="48,119.76 112,109.68 176,114.72 240,114.72 304,54.24"/>
          <g class="points">
            <circle cx="48" cy="119.76" r="4"><title>Week of Sep 28: 3.1% (Healthy)</title></circle>
            <circle cx="112" cy="109.68" r="4"><title>Week of Oct 5: 3.3% (Healthy)</title></circle>
            <circle cx="176" cy="114.72" r="4"><title>Week of Oct 12: 3.2% (Healthy)</title></circle>
            <circle cx="240" cy="114.72" r="4"><title>Week of Oct 19: 3.2% (Healthy)</title></circle>
            <circle class="now" cx="304" cy="54.24" r="6"><title>Week of Oct 26 (this week): 4.4% (Needs attention)</title></circle>
          </g>
          <text class="now-label" x="292" y="50" text-anchor="end">4.4% this week</text>
        </svg>
        <p class="trend-note">+38% is a relative change: (4.4% − 3.2%) ÷ 3.2% = 37.5%, rounded to the nearest whole percent. In absolute terms, churn is up 1.2 percentage points. "Typical week" is the average of the four weeks before this one.</p>
      </figure>

      <div class="action">
        <p class="label">Recommended next action</p>
        <p class="action-text">Reach out to at-risk Starter-plan accounts this week.</p>
        <dl class="plan">
          <dt>Who</dt><dd>Customer Success lead and account managers</dd>
          <dt>What</dt><dd>Identify Starter-plan accounts showing cancellation risk and prioritize outreach</dd>
          <dt>When</dt><dd>Begin outreach this week</dd>
          <dt>Why</dt><dd>The increase in churn is concentrated among Starter-plan customers</dd>
          <dt>Measure</dt><dd>Track accounts contacted, responses, and cancellations that follow</dd>
        </dl>
        <p class="caveat">Outreach hasn't been shown to reduce churn here. Treat this as a test and judge it by the measures above.</p>
      </div>
    </section>

    <section aria-labelledby="rest-label">
      <h2 class="label" id="rest-label">Everything else: no unusual changes</h2>
      <div class="tiles">
        <div class="tile">
          <p class="tile-name">Sign-ups</p>
          <div class="tile-head">
            <p class="tile-value">2,912</p>
            <span class="health good"><span class="dot" aria-hidden="true"></span>Healthy</span>
          </div>
          <p class="tile-change">−0.4% · normal range</p>
          <svg class="spark" viewBox="0 0 100 28" preserveAspectRatio="none" role="img">
            <title>Sign-ups, last 5 weeks: 2,880, 2,941, 2,905, 2,924, 2,912. Healthy. Caution below 2,800.</title>
            <line class="spark-threshold" x1="0" x2="100" y1="17.86" y2="17.86"/>
            <polyline points="2,15.11 26,13.02 50,14.25 74,13.60 98,14.01"/>
            <path class="spark-end" d="M98 14.01h0"/>
          </svg>
          <p class="tile-trend">Stable · dashed line: Caution below 2,800</p>
        </div>
        <div class="tile">
          <p class="tile-name">Activation rate</p>
          <div class="tile-head">
            <p class="tile-value">42.1%</p>
            <span class="health good"><span class="dot" aria-hidden="true"></span>Healthy</span>
          </div>
          <p class="tile-change">+0.3% · normal range</p>
          <svg class="spark" viewBox="0 0 100 28" preserveAspectRatio="none" role="img">
            <title>Activation rate, last 5 weeks: 41.8%, 42.2%, 41.9%, 42.0%, 42.1%. Healthy. Caution below 40.0%.</title>
            <line class="spark-threshold" x1="0" x2="100" y1="18.75" y2="18.75"/>
            <polyline points="2,14.46 26,13.51 50,14.22 74,14.06 98,13.75"/>
            <path class="spark-end" d="M98 13.75h0"/>
          </svg>
          <p class="tile-trend">Stable · dashed line: Caution below 40.0%</p>
        </div>
        <div class="tile">
          <p class="tile-name">Trial-to-paid</p>
          <div class="tile-head">
            <p class="tile-value">14.0%</p>
            <span class="health good"><span class="dot" aria-hidden="true"></span>Healthy</span>
          </div>
          <p class="tile-change">−0.6% · normal range</p>
          <svg class="spark" viewBox="0 0 100 28" preserveAspectRatio="none" role="img">
            <title>Trial-to-paid, last 5 weeks: 14.2%, 13.9%, 14.1%, 14.1%, 14.0%. Healthy. Caution below 13.0%.</title>
            <line class="spark-threshold" x1="0" x2="100" y1="21.52" y2="21.52"/>
            <polyline points="2,12.98 26,15.12 50,13.69 74,13.80 98,14.41"/>
            <path class="spark-end" d="M98 14.41h0"/>
          </svg>
          <p class="tile-trend">Stable · dashed line: Caution below 13.0%</p>
        </div>
        <div class="tile">
          <p class="tile-name">New bookings</p>
          <div class="tile-head">
            <p class="tile-value">$111,200</p>
            <span class="health good"><span class="dot" aria-hidden="true"></span>Healthy</span>
          </div>
          <p class="tile-change">+1.1% · normal range</p>
          <svg class="spark" viewBox="0 0 100 28" preserveAspectRatio="none" role="img">
            <title>New bookings, last 5 weeks: $108,900, $112,400, $109,700, $110,000, $111,200. Healthy. Caution below $100,000.</title>
            <line class="spark-threshold" x1="0" x2="100" y1="23.45" y2="23.45"/>
            <polyline points="2,15.39 26,12.23 50,14.67 74,14.40 98,13.31"/>
            <path class="spark-end" d="M98 13.31h0"/>
          </svg>
          <p class="tile-trend">Stable · dashed line: Caution below $100,000</p>
        </div>
      </div>
    </section>

    <div class="explainers">
      <details class="glossary">
        <summary>What do these metrics mean?</summary>
        <dl>
          <dt>Churn rate</dt><dd>The percentage of existing customer accounts that cancel during a given period.</dd>
          <dt>Activation rate</dt><dd>The percentage of new users or accounts that complete a defined first-value action.</dd>
          <dt>Trial-to-paid conversion</dt><dd>The percentage of trial accounts that become paying customers.</dd>
          <dt>New bookings</dt><dd>The value of newly contracted business during the period.</dd>
        </dl>
      </details>

      <details class="glossary ratings">
        <summary>How are health ratings decided?</summary>
        <ul class="legend">
          <li><span class="health good"><span class="dot" aria-hidden="true"></span>Healthy</span> Green: within the expected range.</li>
          <li><span class="health caution"><span class="dot" aria-hidden="true"></span>Caution</span> Amber: near or slightly outside the expected range. Worth monitoring.</li>
          <li><span class="health bad"><span class="dot" aria-hidden="true"></span>Needs attention</span> Red: well outside the expected range. Act on it.</li>
        </ul>
        <p class="ratings-note">Thresholds are illustrative, based on synthetic product assumptions, not verified industry benchmarks. Ratings use the value as shown on the dashboard.</p>
        <dl>
          <dt>Churn rate <span class="direction">(lower is better)</span></dt>
          <dd>Healthy: below 3.5% · Caution: 3.5% to 4.0%, including exactly 3.5% and exactly 4.0% · Needs attention: above 4.0%</dd>
          <dt>Sign-ups <span class="direction">(higher is better)</span></dt>
          <dd>Healthy: 2,800 or more · Caution: 2,600 to 2,799 · Needs attention: fewer than 2,600</dd>
          <dt>Activation rate <span class="direction">(higher is better)</span></dt>
          <dd>Healthy: 40.0% or higher · Caution: 37.0% or higher, but below 40.0% · Needs attention: below 37.0%</dd>
          <dt>Trial-to-paid conversion <span class="direction">(higher is better)</span></dt>
          <dd>Healthy: 13.0% or higher · Caution: 12.0% or higher, but below 13.0% · Needs attention: below 12.0%</dd>
          <dt>New bookings <span class="direction">(higher is better)</span></dt>
          <dd>Healthy: $100,000 or more · Caution: $90,000 or more, but below $100,000 · Needs attention: below $90,000</dd>
        </dl>
      </details>
    </div>
  </main>

  <footer>Signal V2 prototype. Demo with synthetic data. No real customer or company data is used.</footer>
</body>
</html>
