// Renders the global Cities directory: / — lists every publicly live city.
// The old global /locations/ URL is retired — "Locations" is now per-city
// intra-city areas (with its own keyless map embed); this page is "Cities",
// the inter-city index.

const { icon } = require('./partials');

function renderCityListSchema(cities, site) {
  const items = cities.map((c, i) => {
    const cityFull = `${c.cityName}, ${c.stateAbbr}`;
    const hasGeo = typeof c.lat === 'number' && typeof c.lng === 'number';
    return `    {
      "@type": "ListItem",
      "position": ${i + 1},
      "item": {
        "@type": "LocalBusiness",
        "name": "${site.brandName} — ${cityFull}",
        "telephone": "${c.phoneTel}",
        "url": "https://curbsideauto.com/${c.slug}/",
        "areaServed": "${cityFull}"${hasGeo ? `,
        "serviceArea": {
          "@type": "GeoCircle",
          "geoMidpoint": { "@type": "GeoCoordinates", "latitude": ${c.lat}, "longitude": ${c.lng} },
          "geoRadius": "${Math.round((c.serviceRadiusMiles || 25) * 1609.34)}"
        }` : ''}
      }
    }`;
  }).join(',\n');
  return `{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "${site.brandName} Service Locations",
  "itemListElement": [
${items}
  ]
}`;
}

function renderCityCard(c) {
  const cityFull = `${c.cityName}, ${c.stateAbbr}`;
  const hasGeo = typeof c.lat === 'number';
  const mapQuery = encodeURIComponent(cityFull);
  return `      <div class="location-card">
        <div class="map-embed" style="height:160px;">
          <iframe src="https://www.google.com/maps?q=${mapQuery}&output=embed" title="Map of ${cityFull}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <h3>${cityFull}</h3>
        <p class="region">${c.region}</p>
        ${hasGeo ? `<span class="radius">~${c.serviceRadiusMiles || 25} mi coverage radius</span>` : ''}
        <p class="contact"><a href="tel:${c.phoneTel}">${c.phoneDisplay}</a> &nbsp;·&nbsp; <a href="mailto:${c.email}">${c.email}</a></p>
        <div class="location-links">
          <a class="ticket-cta request" href="/${c.slug}/">${c.cityName} Hub →</a>
          <a class="ticket-cta request" href="/${c.slug}/services/">Browse Services →</a>
        </div>
      </div>`;
}

function renderHomePage(cities, site) {
  const liveCities = cities;

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
<script type="application/ld+json">
${renderCityListSchema(liveCities, site)}
</script>
</head>
<body>

<div class="status-bar">
  <span class="dot"></span><span class="mono">DISPATCH NETWORK — ${liveCities.length} CIT${liveCities.length === 1 ? 'Y' : 'IES'} LIVE</span>
</div>

<header>
  <div class="nav wrap">
    <a class="logo" href="/">
      <span class="logo-badge">${icon('phone')}</span>
      <span class="logo-word">${site.logoMain}<span>${site.logoAccent}</span></span>
    </a>
    <a class="call-btn" href="#cities">Find Your City</a>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <div class="hero-eyebrow">${icon('beacon')} NATIONWIDE DISPATCH NETWORK</div>
    <h1>Find <em>${site.logoMain.trim()}</em> near you.</h1>
    <p>${site.brandName} dispatches vetted local pros for roadside assistance, mobile mechanic service, and mobile windshield repair. Choose your city below.</p>
    <div class="hero-ctas">
      <a class="btn-primary" href="#cities">See All Cities ↓</a>
    </div>
  </div>
</section>

<div class="stripe-rule"></div>

<section class="offers" id="cities">
  <div class="wrap">
    <div class="section-head">
      <div class="eyebrow">Now Serving</div>
      <h2>Where we dispatch</h2>
    </div>
    <div class="location-grid">
${liveCities.map(renderCityCard).join('\n')}
    </div>
    <p class="map-note" style="margin-top:24px;">More cities added regularly as our provider network grows.</p>
  </div>
</section>

<footer>
  <div class="wrap footer-inner">
    <span>© <span id="year"></span> ${site.brandName}. Independent dispatch network — providers are independently owned and operated.</span>
  </div>
</footer>

<script src="/assets/main.js"></script>

</body>
</html>
`;
}

module.exports = { renderHomePage };
