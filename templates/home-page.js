function renderHomePage(cities, site) {
  const liveCities = cities.filter(c => c.live);
  const cityCards = liveCities.map(c => `      <a class="ticket-cta request" style="display:block; margin-bottom:14px;" href="/${c.slug}/">
        ${c.cityName}, ${c.stateAbbr} \u2192
      </a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>24 Hour Roadside Assistance & Windshield Repair Service</title>
<meta name="description" content="${site.brandName} dispatches vetted local pros for 24/7 roadside assistance, mobile mechanic service, and mobile windshield repair. Pick your city to get started.">
<meta name="theme-color" content="#14171C">
<link rel="canonical" href="https://curbsideauto.com/">
<link rel="stylesheet" href="/assets/styles.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
</head>
<body>

<div class="status-bar">
  <span class="dot"></span><span class="mono">DISPATCH LINE OPEN \u2014 EXPANDING CITY BY CITY</span>
</div>

<header>
  <div class="nav wrap">
    <a class="logo" href="/">${site.logoMain}<span>${site.logoAccent}</span></a>
    <nav class="nav-links">
      <a href="/locations/">Locations</a>
    </nav>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <div class="hero-eyebrow">// PICK YOUR CITY</div>
    <h1>Stranded doesn't<br>mean <em>stuck.</em></h1>
    <p>${site.brandName} dispatches vetted local pros for roadside assistance, mobile mechanic service, and mobile windshield repair. Choose your city below.</p>
  </div>
</section>

<div class="stripe-rule"></div>

<section class="offers">
  <div class="wrap" style="max-width:520px;">
    <div class="section-head">
      <div class="eyebrow">Now Serving</div>
      <h2>Where we dispatch</h2>
    </div>
${cityCards}
    <p style="margin-top:24px; font-size:13px; color:var(--ink-faint);">More cities added regularly as our provider network grows.</p>
  </div>
</section>

<footer>
  <div class="wrap" style="width:100%;">
    <span>\u00A9 <span id="year"></span> ${site.brandName}. Independent dispatch network \u2014 providers are independently owned and operated.</span>
  </div>
</footer>

<script src="/assets/main.js"></script>

</body>
</html>
`;
}

module.exports = { renderHomePage };
