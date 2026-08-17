// Renders the site-wide /locations/ page: a network map of every live city
// plus a coverage card per city. This is the page Google Maps / local-SEO
// signals are concentrated on — see README for the Google Maps API key setup.

function renderLocationSchema(site, city) {
  const cityFull = `${city.cityName}, ${city.stateAbbr}`;
  const hasGeo = typeof city.lat === 'number' && typeof city.lng === 'number';
  return `    {
      "@type": "ListItem",
      "position": ${city.position},
      "item": {
        "@type": "LocalBusiness",
        "name": "${site.brandName} — ${cityFull}",
        "telephone": "${city.phoneTel}",
        "url": "https://curbsideauto.com/${city.slug}/",
        "areaServed": "${cityFull}"${hasGeo ? `,
        "serviceArea": {
          "@type": "GeoCircle",
          "geoMidpoint": { "@type": "GeoCoordinates", "latitude": ${city.lat}, "longitude": ${city.lng} },
          "geoRadius": "${Math.round((city.serviceRadiusMiles || 25) * 1609.34)}"
        }` : ''}
      }
    }`;
}

function renderLocationCard(city) {
  const cityFull = `${city.cityName}, ${city.stateAbbr}`;
  const hasGeo = typeof city.lat === 'number' && typeof city.lng === 'number';
  return `      <div class="location-card">
        <h3>${cityFull}</h3>
        <p class="region">${city.region}</p>
        ${hasGeo ? `<span class="radius">~${city.serviceRadiusMiles || 25} mi coverage radius</span>` : ''}
        <p class="contact"><a href="tel:${city.phoneTel}">${city.phoneDisplay}</a> &nbsp;·&nbsp; <a href="mailto:${city.email}">${city.email}</a></p>
        <div class="location-links">
          <a class="ticket-cta request" href="/${city.slug}/">${city.cityName} Hub →</a>
          <a class="ticket-cta request" href="/${city.slug}/#offers">Browse Services →</a>
        </div>
      </div>`;
}

function renderLocationsPage(cities, site, config) {
  const liveCities = cities.filter(c => c.live).map((c, i) => Object.assign({}, c, { position: i + 1 }));
  const geoCities = liveCities.filter(c => typeof c.lat === 'number' && typeof c.lng === 'number');
  const apiKey = (config && config.googleMapsApiKey) || '';
  const cityScript = geoCities.map(c => `{ name: ${JSON.stringify(c.cityName + ', ' + c.stateAbbr)}, lat: ${c.lat}, lng: ${c.lng}, radiusMiles: ${c.serviceRadiusMiles || 25} }`).join(', ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Service Locations & Coverage Map | ${site.brandName}</title>
<meta name="description" content="See every city ${site.brandName} dispatches to on one map — roadside assistance, mobile mechanic, and mobile windshield repair, with coverage radius by city.">
<meta property="og:title" content="${site.brandName} Service Locations — Coverage Map">
<meta property="og:description" content="Every city ${site.brandName} dispatches to, mapped, with coverage radius and direct contact per location.">
<meta property="og:type" content="website">
<meta name="theme-color" content="#14171C">
<link rel="canonical" href="https://curbsideauto.com/locations/">
<link rel="stylesheet" href="/assets/styles.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://maps.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "${site.brandName} Service Locations",
  "itemListElement": [
${liveCities.map(c => renderLocationSchema(site, c)).join(',\n')}
  ]
}
</script>
</head>
<body>

<div class="status-bar">
  <span class="dot"></span><span class="mono">DISPATCH NETWORK — ${liveCities.length} CIT${liveCities.length === 1 ? 'Y' : 'IES'} LIVE</span>
</div>

<header>
  <div class="nav wrap">
    <a class="logo" href="/">${site.logoMain}<span>${site.logoAccent}</span></a>
    <nav class="nav-links">
      <a href="/">Home</a>
      <a href="#cities">All Cities</a>
    </nav>
    <a class="call-btn" href="#cities">Find Your City</a>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <div class="hero-eyebrow">// COVERAGE MAP — WHERE ${site.brandName} DISPATCHES</div>
    <h1>Find <em>${site.logoMain.trim()}</em> near you.</h1>
    <p>One dispatch network, mapped city by city. See exactly how far our coverage reaches before you call.</p>
    <div class="hero-ctas">
      <a class="btn-ghost" href="#cities">Jump to City List ↓</a>
    </div>
  </div>
</section>

<div class="stripe-rule"></div>

${geoCities.length ? `<section class="map-section">
  <div class="wrap">
    <div class="section-head">
      <div class="eyebrow">Network Map</div>
      <h2>Every city, one map</h2>
    </div>
    <div id="network-map" class="map-embed" style="height:480px;">
      <div class="map-fallback">Map loading — <a href="https://www.google.com/maps/search/?api=1&query=${geoCities[0].lat},${geoCities[0].lng}" target="_blank" rel="noopener">view on Google Maps</a></div>
    </div>
    <p class="map-note">Shaded circles show each city's approximate dispatch radius — exact coverage can vary by tech availability. Tap a marker or scroll down for direct contact per city.</p>
  </div>
</section>

<div class="stripe-rule"></div>
` : ''}
<section class="offers" id="cities">
  <div class="wrap">
    <div class="section-head">
      <div class="eyebrow">Now Serving</div>
      <h2>Every live location</h2>
    </div>
    <div class="location-grid">
${liveCities.map(renderLocationCard).join('\n')}
    </div>
    <p class="map-note" style="margin-top:24px;">Don't see your city yet? More cities are added regularly as our provider network grows — call any location above and dispatch can point you in the right direction.</p>
  </div>
</section>

<footer>
  <div class="wrap" style="width:100%;">
    <span>© <span id="year"></span> ${site.brandName}. Independent dispatch network — providers are independently owned and operated.</span>
  </div>
</footer>

<script src="/assets/main.js"></script>
${geoCities.length ? `<script>window.NETWORK_CITIES = [${cityScript}];</script>
<script src="/assets/maps.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initCurbsideMaps&loading=async" async defer></script>
` : ''}
</body>
</html>
`;
}

module.exports = { renderLocationsPage };
