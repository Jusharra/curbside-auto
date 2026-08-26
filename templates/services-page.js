// Renders the atomic service-card grid: /{city.slug}/services/
// Grouped by category, one card per live service, each card links through
// to that service's full deep-dive SEO landing page.

const { fill, icon, renderHeader, renderFooter } = require('./partials');

function renderBreadcrumbSchema(city, cityFull) {
  return `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://curbsideauto.com/" },
    { "@type": "ListItem", "position": 2, "name": "${cityFull}", "item": "https://curbsideauto.com/${city.slug}/" },
    { "@type": "ListItem", "position": 3, "name": "Services", "item": "https://curbsideauto.com/${city.slug}/services/" }
  ]
}`;
}

function renderItemListSchema(services, city, site, cityFull) {
  const items = services.map((s, i) => `    {
      "@type": "ListItem",
      "position": ${i + 1},
      "item": {
        "@type": "Service",
        "name": "${fill(s.name, city, site)}",
        "url": "https://curbsideauto.com/${city.slug}/${s.slug}/",
        "areaServed": "${cityFull}"
      }
    }`).join(',\n');
  return `{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
${items}
  ]
}`;
}

function renderServiceCard(service, city, site) {
  return `      <div class="service-card">
        <div class="service-icon-badge">${icon(service.icon)}</div>
        <h4><a href="/${city.slug}/${service.slug}/">${service.name}</a></h4>
        <p>${fill(service.intro, city, site)}</p>
        <div class="service-card-ctas">
          <a class="call" href="tel:${city.phoneTel}">${icon('phone')}Call Now</a>
          <a class="request" href="/${city.slug}/contact/?service=${service.slug}">Request Online</a>
        </div>
      </div>`;
}

function renderCategorySection(offer, services, city, site) {
  const catServices = services.filter(s => s.category === offer.id);
  if (!catServices.length) return '';
  return `    <div class="service-category" id="${offer.id}">
      <h3>${offer.categoryName}</h3>
      <div class="service-card-grid">
${catServices.map(s => renderServiceCard(s, city, site)).join('\n')}
      </div>
    </div>`;
}

function renderServicesPage(city, site, services, allCities) {
  const cityFull = `${city.cityName}, ${city.stateAbbr}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>All Services in ${cityFull} | ${site.brandName}</title>
<meta name="description" content="Every roadside assistance, mobile mechanic, and mobile windshield repair service ${site.brandName} dispatches in ${cityFull} — pick what you need, call now.">
<meta property="og:title" content="Mobile Auto Services in ${cityFull} | ${site.brandName}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#14171C">
<link rel="canonical" href="https://curbsideauto.com/${city.slug}/services/">
<link rel="stylesheet" href="/assets/styles.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<script type="application/ld+json">
${renderItemListSchema(services, city, site, cityFull)}
</script>
<script type="application/ld+json">
${renderBreadcrumbSchema(city, cityFull)}
</script>
</head>
<body>

<div class="status-bar">
  <span class="dot"></span><span class="mono">DISPATCH LINE OPEN — ${cityFull.toUpperCase()}</span>
</div>

${renderHeader('services', city, site)}

<section class="hero">
  <div class="wrap" style="text-align:center; max-width:760px;">
    <div class="hero-eyebrow" style="justify-content:center;">${city.cityName.toUpperCase()} MOBILE SERVICES</div>
    <h1>Fast Help, Any Time, <em>Anywhere</em> in ${city.cityName}</h1>
    <p style="margin-left:auto; margin-right:auto;">Pick the service you need — we'll dispatch a local ${city.cityName} technician right now.</p>
    <div class="hero-ctas" style="justify-content:center; margin-top:30px;">
      <a class="btn-primary" href="tel:${city.phoneTel}">${icon('phone')}Call ${city.phoneDisplay}</a>
    </div>
  </div>
</section>

<div class="stripe-rule"></div>

<section class="offers">
  <div class="wrap">
${site.offers.map(o => renderCategorySection(o, services, city, site)).join('\n')}
  </div>
</section>

${renderFooter(city, site, allCities)}

<script src="/assets/main.js"></script>

</body>
</html>
`;
}

module.exports = { renderServicesPage };
