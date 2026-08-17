// Renders one full HTML page for a single service, in a single city.
// URL shape: /{city.slug}/{service.slug}/ — e.g. /visalia-ca/flat-tire-change-repair/
// Tokens available in service copy: {cityName}, {cityNameUpper}, {cityFull}, {brandName}

const CATEGORY_LABEL = {
  roadside: 'Roadside Assistance & Mobile Mechanic',
  windshield: 'Mobile Windshield Repair'
};

function fill(str, ctx) {
  return str
    .replace(/\{cityNameUpper\}/g, ctx.cityName.toUpperCase())
    .replace(/\{cityFull\}/g, ctx.cityFull)
    .replace(/\{cityName\}/g, ctx.cityName)
    .replace(/\{brandName\}/g, ctx.brandName);
}

function renderServiceAreaSchema(city) {
  if (typeof city.lat !== 'number' || typeof city.lng !== 'number') return '';
  return `,
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": { "@type": "GeoCoordinates", "latitude": ${city.lat}, "longitude": ${city.lng} },
    "geoRadius": "${Math.round((city.serviceRadiusMiles || 25) * 1609.34)}"
  }`;
}

function renderServiceSchema(service, site, city, ctx) {
  return `{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "${fill(service.name, ctx)}",
  "name": "${fill(service.name, ctx)} in ${ctx.cityFull}",
  "description": "${fill(service.intro, ctx)}",
  "areaServed": "${ctx.cityFull}"${renderServiceAreaSchema(city)},
  "provider": {
    "@type": "LocalBusiness",
    "name": "${site.brandName}",
    "telephone": "${city.phoneTel}"
  }
}`;
}

function renderFaqSchema(service, ctx) {
  const items = service.faq.map(f => `    {
      "@type": "Question",
      "name": "${fill(f.q, ctx)}",
      "acceptedAnswer": { "@type": "Answer", "text": "${fill(f.a, ctx)}" }
    }`).join(',\n');
  return `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
${items}
  ]
}`;
}

function renderBreadcrumbSchema(service, city, ctx) {
  return `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://curbsideauto.com/" },
    { "@type": "ListItem", "position": 2, "name": "${ctx.cityFull}", "item": "https://curbsideauto.com/${city.slug}/" },
    { "@type": "ListItem", "position": 3, "name": "${fill(service.name, ctx)}", "item": "https://curbsideauto.com/${city.slug}/${service.slug}/" }
  ]
}`;
}

function renderFaqItem(f, ctx) {
  return `    <div class="faq-item">
      <h3>${fill(f.q, ctx)}</h3>
      <p>${fill(f.a, ctx)}</p>
    </div>`;
}

function renderRelatedTags(service, city, allServices) {
  const siblings = allServices.filter(s => s.live && s.category === service.category && s.slug !== service.slug);
  return siblings.map(s => `      <a class="tag" href="/${city.slug}/${s.slug}/">${s.name}</a>`).join('\n');
}

function renderServicePage(service, city, site, allServices, allCities) {
  const ctx = {
    cityName: city.cityName,
    cityFull: `${city.cityName}, ${city.stateAbbr}`,
    brandName: site.brandName
  };
  const categoryLabel = CATEGORY_LABEL[service.category] || 'Services';
  const otherCities = allCities.filter(c => c.slug !== city.slug && c.live);
  const otherCityLinks = otherCities.length
    ? `\n    <p style="margin-top:14px; font-size:13px; color:var(--ink-faint);">Also dispatching ${fill(service.name, ctx)} in: ${otherCities.map(c => `<a href="/${c.slug}/${service.slug}/" style="color:var(--ink-dim); text-decoration:underline;">${c.cityName}, ${c.stateAbbr}</a>`).join(', ')}</p>`
    : '';
  const relatedTags = renderRelatedTags(service, city, allServices);
  const keywords = [service.primaryKeyword, ...(service.secondaryKeywords || [])].join(', ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${fill(service.metaTitle, ctx)}</title>
<meta name="description" content="${fill(service.metaDescription, ctx)}">
<meta name="keywords" content="${keywords}">
<meta property="og:title" content="${fill(service.metaTitle, ctx)}">
<meta property="og:description" content="${fill(service.metaDescription, ctx)}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#14171C">
${typeof city.lat === 'number' ? `<meta name="geo.region" content="${city.stateCode || ('US-' + city.stateAbbr)}">
<meta name="geo.placename" content="${ctx.cityFull}">
<meta name="geo.position" content="${city.lat};${city.lng}">
<meta name="ICBM" content="${city.lat}, ${city.lng}">
` : ''}<link rel="canonical" href="https://curbsideauto.com/${city.slug}/${service.slug}/">
<link rel="stylesheet" href="/assets/styles.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<script type="application/ld+json">
${renderServiceSchema(service, site, city, ctx)}
</script>
<script type="application/ld+json">
${renderFaqSchema(service, ctx)}
</script>
<script type="application/ld+json">
${renderBreadcrumbSchema(service, city, ctx)}
</script>
</head>
<body>

<div class="status-bar">
  <span class="dot"></span><span class="mono">DISPATCH LINE OPEN — ${ctx.cityFull.toUpperCase()}</span>
</div>

<header>
  <div class="nav wrap">
    <a class="logo" href="/">${site.logoMain}<span>${site.logoAccent}</span></a>
    <nav class="nav-links">
      <a href="/${city.slug}/">${ctx.cityFull} Hub</a>
      <a href="/locations/">Locations</a>
      <a href="#faq">FAQ</a>
      <a href="#request">Request Help</a>
    </nav>
    <a class="call-btn" href="tel:${city.phoneTel}">Call Now</a>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <div class="hero-eyebrow">// ${fill(service.eyebrow, ctx)}</div>
    <h1>${fill(service.h1, ctx)}</h1>
    <p>${fill(service.intro, ctx)}</p>
    <div class="hero-ctas">
      <a class="btn-primary" href="tel:${city.phoneTel}">\u{1F4DE} ${service.callCta}</a>
      <a class="btn-ghost" href="#request">Request Online ↓</a>
    </div>
    <div class="marker-strip">
      <div class="marker"><div class="num mono">CATEGORY</div><div class="label">${categoryLabel}</div></div>
      <div class="marker"><div class="num mono">COVERAGE</div><div class="label">${ctx.cityFull}</div></div>
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
        <div class="ticket-num">DISPATCH / ${categoryLabel.toUpperCase()}</div>
        <h3>${fill(service.name, ctx)}</h3>
        <p class="promise">${fill(service.intro, ctx)}</p>
        <hr class="divider">
        <ul class="stack">
${service.benefits.map(b => `          <li>${b}</li>`).join('\n')}
        </ul>
        <div class="risk"><b>Risk reversal:</b> ${service.risk}</div>
        <div class="ticket-ctas">
          <a class="ticket-cta call" href="tel:${city.phoneTel}">\u{1F4DE} ${service.callCta}</a>
          <a class="ticket-cta request" href="#request" data-service="${service.requestValue}">Request Online →</a>
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
      <div class="how-step">
        <div class="step-num mono">01</div>
        <h3>Tell us what's wrong</h3>
        <p>Call, text, or fill out the form below with your location in ${ctx.cityName} and what's going on.</p>
      </div>
      <div class="how-step">
        <div class="step-num mono">02</div>
        <h3>We dispatch a local pro</h3>
        <p>You get matched with a vetted independent tech already near you in ${ctx.cityName} — not a call center queue.</p>
      </div>
      <div class="how-step">
        <div class="step-num mono">03</div>
        <h3>Help shows up</h3>
        <p>Flat, upfront pricing for ${fill(service.name, ctx).toLowerCase()}. No shop drop-off, no waiting room, no surprise fees.</p>
      </div>
    </div>
  </div>
</section>

${relatedTags ? `<div class="stripe-rule"></div>

<section class="coverage">
  <div class="wrap">
    <div class="coverage-box">
      <div>
        <h3>More ${categoryLabel} in ${ctx.cityName}</h3>
        <p>One dispatch line covers the whole category — here's everything else ${site.brandName} handles in ${ctx.cityName}.</p>
      </div>
      <div class="coverage-tags">
${relatedTags}
        <a class="tag" href="/${city.slug}/">All ${ctx.cityName} Services</a>
        <a class="tag" href="/locations/">\u{1F4CD} Coverage Map</a>
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
${service.faq.map(f => renderFaqItem(f, ctx)).join('\n')}
  </div>
</section>

<section class="request" id="request">
  <div class="wrap">
    <div class="request-box">
      <h2>Request ${fill(service.name, ctx)}</h2>
      <p>Tell us where you are in ${ctx.cityName} and what you need — dispatch will text you back with an ETA and price.</p>
      <form name="service-request-${city.slug}-${service.slug}" method="POST" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="service-request-${city.slug}-${service.slug}">
        <input type="hidden" name="city" value="${ctx.cityFull}">
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
            <option>${service.requestValue}</option>
${site.offers.map(o => `            <option>${o.requestValue}</option>`).join('\n')}
            <option>Not sure — help me figure it out</option>
          </select>
        </div>
        <div>
          <label for="location">Your location in ${ctx.cityName}</label>
          <input type="text" id="location" name="location" placeholder="Address, cross streets, or freeway/mile marker" required>
        </div>
        <div>
          <label for="details">Anything dispatch should know</label>
          <input type="text" id="details" name="details" placeholder="Vehicle, what happened, best callback time">
        </div>
        <button class="submit-btn" type="submit">Send Request →</button>
      </form>
    </div>
  </div>
</section>

<footer>
  <div class="wrap" style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; width:100%;">
    <span>© <span id="year"></span> ${site.brandName}. Independent dispatch network — providers are independently owned and operated.</span>
    <span><a href="tel:${city.phoneTel}">${city.phoneDisplay}</a> &nbsp;·&nbsp; <a href="mailto:${city.email}">${city.email}</a></span>
  </div>
</footer>

<script src="/assets/main.js"></script>

</body>
</html>
`;
}

module.exports = { renderServicePage };
