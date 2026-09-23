// Renders the global Cities directory: / — lists every publicly live city.
// The old global /locations/ URL is retired — "Locations" is now per-city
// intra-city areas (with its own keyless map embed); this page is "Cities",
// the inter-city index.

const { icon, renderServiceSelect } = require('./partials');

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
        "url": "${site.siteUrl}/${c.slug}/",
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

// Large, thumb-friendly category buttons so a mobile visitor can reach
// "what do we actually do" without first picking a city. With exactly one
// live city, each button can link straight to that city's filtered
// Services section; once multiple cities are live there's no single city
// to guess, so the buttons fall back to scrolling to the city picker.
function renderCategoryTapRow(offers, liveCities) {
  const singleCity = liveCities.length === 1 ? liveCities[0] : null;
  return offers.map(o => {
    const href = singleCity ? `/${singleCity.slug}/services/#${o.id}` : '#cities';
    return `      <a class="category-tap-btn" href="${href}">${icon(o.icon || 'wrench')}<span>${o.categoryName}</span></a>`;
  }).join('\n');
}

function renderCitySelect(liveCities) {
  const options = liveCities.map(c =>
    `      <option value="${c.slug}">${c.cityName}, ${c.stateAbbr}</option>`
  ).join('\n');
  return `    <option value="" selected>Select a city</option>\n${options}`;
}

function renderHomePage(cities, site, services) {
  const liveCities = cities;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>24 Hour Roadside Assistance & Windshield Repair Service</title>
<meta name="description" content="${site.brandName} connects you with vetted local pros for 24/7 roadside assistance, mobile mechanic service, and mobile windshield repair. Pick your city to get started.">
<meta name="theme-color" content="#14171C">
<link rel="canonical" href="${site.siteUrl}/">
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
  <span class="dot"></span><span class="mono">SERVICE NETWORK — ${liveCities.length} CIT${liveCities.length === 1 ? 'Y' : 'IES'} LIVE</span>
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
    <div class="hero-split">
      <div>
        <div class="hero-eyebrow">${icon('beacon')} NATIONWIDE SERVICE NETWORK</div>
        <h1>Find <em>${site.logoMain.trim()}</em> near you.</h1>
        <p>${site.brandName} connects you with vetted local pros for roadside assistance, mobile mechanic service, and mobile windshield repair. Tell us what you need below, or pick your city.</p>
        <div class="hero-ctas">
          <a class="btn-primary" href="#cities">See All Cities ↓</a>
        </div>
        <div class="category-tap-row">
${renderCategoryTapRow(site.offers, liveCities)}
        </div>
      </div>
      <div class="hero-form-card">
        <div class="hero-eyebrow">${icon('beacon')} GET A QUOTE</div>
        <h2>Request Service</h2>
        <p class="avg-response">Tell us what's going on — we'll route you to the right local team.</p>
        <form name="quote-request" method="POST" data-netlify="true" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="quote-request">
          <p style="display:none">
            <label>Don't fill this out: <input name="bot-field"></label>
          </p>
          <div class="row2">
            <div>
              <label for="home-name">Name</label>
              <input type="text" id="home-name" name="name" placeholder="Name" required>
            </div>
            <div>
              <label for="home-phone">Phone</label>
              <input type="tel" id="home-phone" name="phone" placeholder="Phone Number" required>
            </div>
          </div>
          <div>
            <label for="home-city">City</label>
            <select id="home-city" name="city" required>
${renderCitySelect(liveCities)}
            </select>
          </div>
          <div>
            <label for="service">Service Needed</label>
            <select id="service" name="service" required>
${renderServiceSelect(services, site)}
            </select>
          </div>
          <div>
            <label for="home-details">Description</label>
            <textarea id="home-details" name="details" placeholder="Describe the issue (optional)"></textarea>
          </div>
          <button class="submit-btn" type="submit">${icon('phone')}Request Help</button>
        </form>
      </div>
    </div>
  </div>
</section>

<div class="stripe-rule"></div>

<section class="offers" id="cities">
  <div class="wrap">
    <div class="section-head">
      <div class="eyebrow">Now Serving</div>
      <h2>Where we serve</h2>
    </div>
    <div class="location-grid">
${liveCities.map(renderCityCard).join('\n')}
    </div>
    <p class="map-note" style="margin-top:24px;">More cities added regularly as our provider network grows.</p>
  </div>
</section>

<footer>
  <div class="wrap footer-inner">
    <span>© <span id="year"></span> ${site.brandName}. We work with independently owned and operated local service providers.</span>
  </div>
</footer>

<script src="/assets/main.js"></script>

</body>
</html>
`;
}

module.exports = { renderHomePage };
