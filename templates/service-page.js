// Renders one full HTML page for a single service, in a single city.
// URL shape: /{city.slug}/{service.slug}/ — e.g. /visalia-ca/flat-tire-change-repair/
// Tokens available in service copy: {cityName}, {cityNameUpper}, {cityFull}, {brandName}

const { fill, renderServiceAreaSchema, icon, renderServiceSelect, renderHeader, renderFooter } = require('./partials');

function renderServiceSchema(service, site, city) {
  const cityFull = `${city.cityName}, ${city.stateAbbr}`;
  return `{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "${fill(service.name, city, site)}",
  "name": "${fill(service.name, city, site)} in ${cityFull}",
  "description": "${fill(service.intro, city, site)}",
  "areaServed": "${cityFull}"${renderServiceAreaSchema(city)},
  "provider": {
    "@type": "LocalBusiness",
    "name": "${site.brandName}",
    "telephone": "${city.phoneTel}"
  }
}`;
}

function renderFaqSchema(service, city, site) {
  const items = service.faq.map(f => `    {
      "@type": "Question",
      "name": "${fill(f.q, city, site)}",
      "acceptedAnswer": { "@type": "Answer", "text": "${fill(f.a, city, site)}" }
    }`).join(',\n');
  return `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
${items}
  ]
}`;
}

function renderBreadcrumbSchema(service, city, site) {
  const cityFull = `${city.cityName}, ${city.stateAbbr}`;
  return `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://curbsideauto.com/" },
    { "@type": "ListItem", "position": 2, "name": "${cityFull}", "item": "https://curbsideauto.com/${city.slug}/" },
    { "@type": "ListItem", "position": 3, "name": "Services", "item": "https://curbsideauto.com/${city.slug}/services/" },
    { "@type": "ListItem", "position": 4, "name": "${fill(service.name, city, site)}", "item": "https://curbsideauto.com/${city.slug}/${service.slug}/" }
  ]
}`;
}

function renderFaqItem(f, city, site) {
  return `    <div class="faq-item">
      <h3>${fill(f.q, city, site)}</h3>
      <p>${fill(f.a, city, site)}</p>
    </div>`;
}

function renderRelatedTags(service, city, allServices) {
  const siblings = allServices.filter(s => s.category === service.category && s.slug !== service.slug);
  return siblings.map(s => `      <a class="tag" href="/${city.slug}/${s.slug}/">${s.name}</a>`).join('\n');
}

function renderServicePage(service, city, site, allServices, allCities) {
  const cityFull = `${city.cityName}, ${city.stateAbbr}`;
  const categoryName = (site.offers.find(o => o.id === service.category) || {}).categoryName || 'Services';
  const otherCities = allCities.filter(c => c.slug !== city.slug);
  const otherCityLinks = otherCities.length
    ? `\n    <p style="margin-top:14px; font-size:13px; color:var(--ink-faint);">Also dispatching ${fill(service.name, city, site)} in: ${otherCities.map(c => `<a href="/${c.slug}/${service.slug}/" style="color:var(--ink-dim); text-decoration:underline;">${c.cityName}, ${c.stateAbbr}</a>`).join(', ')}</p>`
    : '';
  const relatedTags = renderRelatedTags(service, city, allServices);
  const keywords = [service.primaryKeyword, ...(service.secondaryKeywords || [])].join(', ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${fill(service.metaTitle, city, site)}</title>
<meta name="description" content="${fill(service.metaDescription, city, site)}">
<meta name="keywords" content="${keywords}">
<meta property="og:title" content="${fill(service.metaTitle, city, site)}">
<meta property="og:description" content="${fill(service.metaDescription, city, site)}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#14171C">
${typeof city.lat === 'number' ? `<meta name="geo.region" content="${city.stateCode || ('US-' + city.stateAbbr)}">
<meta name="geo.placename" content="${cityFull}">
<meta name="geo.position" content="${city.lat};${city.lng}">
<meta name="ICBM" content="${city.lat}, ${city.lng}">
` : ''}<link rel="canonical" href="https://curbsideauto.com/${city.slug}/${service.slug}/">
<link rel="stylesheet" href="/assets/styles.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<script type="application/ld+json">
${renderServiceSchema(service, site, city)}
</script>
<script type="application/ld+json">
${renderFaqSchema(service, city, site)}
</script>
<script type="application/ld+json">
${renderBreadcrumbSchema(service, city, site)}
</script>
</head>
<body>

<div class="status-bar">
  <span class="dot"></span><span class="mono">DISPATCH LINE OPEN — ${cityFull.toUpperCase()}</span>
</div>

${renderHeader('services', city, site)}

<section class="hero">
  <div class="wrap">
    <div class="hero-eyebrow">${icon(service.icon)} ${fill(service.eyebrow, city, site)}</div>
    <h1>${fill(service.h1, city, site)}</h1>
    <p>${fill(service.intro, city, site)}</p>
    <div class="hero-ctas">
      <a class="btn-primary" href="tel:${city.phoneTel}">${icon('phone')}${service.callCta}</a>
      <a class="btn-ghost" href="#request">Request Online ↓</a>
    </div>
    <div class="marker-strip">
      <div class="marker"><div class="num mono">CATEGORY</div><div class="label">${categoryName}</div></div>
      <div class="marker"><div class="num mono">COVERAGE</div><div class="label">${cityFull}</div></div>
    </div>${otherCityLinks}
  </div>
</section>

<div class="stripe-rule"></div>

<section class="offers" id="offers">
  <div class="wrap">
    <div class="section-head">
      <div class="eyebrow">The Details</div>
      <h2>What you get with this call</h2>
    </div>
    <div class="ticket-grid" style="grid-template-columns:1fr; max-width:640px;">
      <div class="ticket">
        <div class="ticket-num">DISPATCH / ${categoryName.toUpperCase()}</div>
        <h3>${fill(service.name, city, site)}</h3>
        <p class="promise">${fill(service.intro, city, site)}</p>
        <hr class="divider">
        <ul class="stack">
${service.benefits.map(b => `          <li>${b}</li>`).join('\n')}
        </ul>
        <div class="risk"><b>Risk reversal:</b> ${service.risk}</div>
        <div class="ticket-ctas">
          <a class="ticket-cta call" href="tel:${city.phoneTel}">${icon('phone')}${service.callCta}</a>
          <a class="ticket-cta request" href="#request" data-service="${service.slug}">Request Online →</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="how">
  <div class="wrap">
    <div class="section-head">
      <div class="eyebrow">How It Works</div>
      <h2>Three steps, no shop visit</h2>
    </div>
    <div class="how-grid">
${site.howItWorks.map((s, i) => `      <div class="how-step">
        <div class="step-num mono">0${i + 1}</div>
        <h3>${s.title}</h3>
        <p>${fill(s.text, city, site)}</p>
      </div>`).join('\n')}
    </div>
  </div>
</section>

${relatedTags ? `<div class="stripe-rule"></div>

<section class="coverage">
  <div class="wrap">
    <div class="coverage-box">
      <div>
        <h3>More ${categoryName} in ${city.cityName}</h3>
        <p>One dispatch line covers the whole category — here's everything else ${site.brandName} handles in ${city.cityName}.</p>
      </div>
      <div class="coverage-tags">
${relatedTags}
        <a class="tag" href="/${city.slug}/services/">All ${city.cityName} Services</a>
        <a class="tag" href="/${city.slug}/locations/">${icon('pin')} Coverage Map</a>
      </div>
    </div>
  </div>
</section>
` : ''}
<div class="stripe-rule"></div>

<section class="faq" id="faq">
  <div class="wrap" style="max-width:760px;">
    <div class="section-head">
      <div class="eyebrow">Common Questions</div>
      <h2>Before you call</h2>
    </div>
${service.faq.map(f => renderFaqItem(f, city, site)).join('\n')}
  </div>
</section>

<section class="request" id="request">
  <div class="wrap">
    <div class="request-box">
      <h2>Request ${fill(service.name, city, site)}</h2>
      <p>Tell us where you are in ${city.cityName} and what you need — dispatch will text you back with an ETA and price.</p>
      <form name="service-request-${city.slug}-${service.slug}" method="POST" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="service-request-${city.slug}-${service.slug}">
        <input type="hidden" name="city" value="${cityFull}">
        <p style="display:none">
          <label>Don't fill this out: <input name="bot-field"></label>
        </p>
        <div class="row2">
          <div>
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div>
            <label for="phone">Phone</label>
            <input type="tel" id="phone" name="phone" required>
          </div>
        </div>
        <div>
          <label for="service">What do you need</label>
          <select id="service" name="service" required>
${renderServiceSelect(allServices, site, service.slug)}
          </select>
        </div>
        <div>
          <label for="location">Your location in ${city.cityName}</label>
          <input type="text" id="location" name="location" placeholder="Address, cross streets, or freeway/mile marker" required>
        </div>
        <div>
          <label for="details">Anything dispatch should know</label>
          <textarea id="details" name="details" placeholder="Vehicle, what happened, best callback time"></textarea>
        </div>
        <button class="submit-btn" type="submit">${icon('phone')}Send Request</button>
      </form>
    </div>
  </div>
</section>

${renderFooter(city, site, allCities)}

<script src="/assets/main.js"></script>

</body>
</html>
`;
}

module.exports = { renderServicePage };
