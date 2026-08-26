// Renders the intra-city coverage-areas page: /{city.slug}/locations/
// Lists the neighborhoods/corridors this city's dispatch covers, plus the
// single-city Google Maps coverage-radius embed (relocated here from Home).

const { icon, renderHeader, renderFooter } = require('./partials');

function renderBreadcrumbSchema(city, cityFull) {
  return `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://curbsideauto.com/" },
    { "@type": "ListItem", "position": 2, "name": "${cityFull}", "item": "https://curbsideauto.com/${city.slug}/" },
    { "@type": "ListItem", "position": 3, "name": "Locations", "item": "https://curbsideauto.com/${city.slug}/locations/" }
  ]
}`;
}

function renderAreaCard(area) {
  return `      <div class="location-card">
        <h3>${area.name}</h3>
        <p class="region">${area.description}</p>
        <span class="radius">${icon('pin', 'icon')} Covered</span>
      </div>`;
}

function renderLocationsPage(city, site, publiclyLiveCities, config) {
  const cityFull = `${city.cityName}, ${city.stateAbbr}`;
  const hasGeo = typeof city.lat === 'number' && typeof city.lng === 'number';
  const apiKey = (config && config.googleMapsApiKey) || '';
  const areas = city.areas || [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Areas We Cover in ${cityFull} | ${site.brandName}</title>
<meta name="description" content="See every neighborhood and corridor ${site.brandName} dispatches to in ${cityFull} — coverage map and area list.">
<meta name="theme-color" content="#14171C">
${hasGeo ? `<meta name="geo.region" content="${city.stateCode || ('US-' + city.stateAbbr)}">
<meta name="geo.placename" content="${cityFull}">
<meta name="geo.position" content="${city.lat};${city.lng}">
<meta name="ICBM" content="${city.lat}, ${city.lng}">
` : ''}<link rel="canonical" href="https://curbsideauto.com/${city.slug}/locations/">
<link rel="stylesheet" href="/assets/styles.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${hasGeo ? '<link rel="preconnect" href="https://maps.googleapis.com">\n' : ''}<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "${site.brandName}",
  "areaServed": "${cityFull}"
}
</script>
<script type="application/ld+json">
${renderBreadcrumbSchema(city, cityFull)}
</script>
</head>
<body>

<div class="status-bar">
  <span class="dot"></span><span class="mono">DISPATCH LINE OPEN — ${cityFull.toUpperCase()}</span>
</div>

${renderHeader('locations', city, site)}

<section class="hero">
  <div class="wrap">
    <div class="hero-eyebrow">${icon('pin')} COVERAGE AREAS — ${city.cityName.toUpperCase()}</div>
    <h1>Where We Cover <em>${city.cityName}</em></h1>
    <p>Neighborhoods, corridors, and growth areas we dispatch to across ${cityFull} — day or night.</p>
  </div>
</section>

<div class="stripe-rule"></div>

${hasGeo ? `<section class="map-section" style="padding-top:60px;">
  <div class="wrap">
    <div class="section-head">
      <div class="eyebrow">Coverage Map</div>
      <h2>~${city.serviceRadiusMiles || 25}-mile dispatch radius</h2>
    </div>
    <div id="city-map" class="map-embed" style="height:360px;" data-single-map data-lat="${city.lat}" data-lng="${city.lng}" data-radius-miles="${city.serviceRadiusMiles || 25}" data-city-label="${cityFull}">
      <div class="map-fallback">Map loading — <a href="https://www.google.com/maps/search/?api=1&query=${city.lat},${city.lng}" target="_blank" rel="noopener">view ${cityFull} on Google Maps</a></div>
    </div>
    <p class="map-note">Shaded area shows our approximate dispatch radius around ${city.cityName} — exact coverage can vary by tech availability.</p>
  </div>
</section>

<div class="stripe-rule"></div>
` : ''}
<section class="offers">
  <div class="wrap">
    <div class="section-head">
      <div class="eyebrow">Areas Served</div>
      <h2>Covered neighborhoods in ${city.cityName}</h2>
    </div>
    <div class="location-grid">
${areas.map(renderAreaCard).join('\n')}
    </div>
  </div>
</section>

${renderFooter(city, site, publiclyLiveCities)}

<script src="/assets/main.js"></script>
${hasGeo ? `<script src="/assets/maps.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initCurbsideMaps&loading=async" async defer></script>
` : ''}
</body>
</html>
`;
}

module.exports = { renderLocationsPage };
