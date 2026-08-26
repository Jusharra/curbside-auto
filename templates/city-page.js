// Renders the Home page for a single city: /{city.slug}/
// Split hero (headline + embedded quick-request form), trust badges,
// a 2-card category preview linking to /services/, FAQ, and a contact teaser.

const { fill, renderServiceAreaSchema, icon, renderServiceSelect, renderHeader, renderFooter } = require('./partials');

function renderOfferSchema(site, city) {
  return site.offers.map(o => `    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "${fill(o.title, city, site)}",
        "description": "${fill(o.promise, city, site)}"
      }
    }`).join(',\n');
}

function renderFaqSchema(site, city) {
  return site.faq.map(f => `    {
      "@type": "Question",
      "name": "${f.q}",
      "acceptedAnswer": { "@type": "Answer", "text": "${fill(f.a, city, site)}" }
    }`).join(',\n');
}

function renderFaqItem(f, city, site) {
  return `    <div class="faq-item">
      <h3>${f.q}</h3>
      <p>${fill(f.a, city, site)}</p>
    </div>`;
}

const TRUST_ICONS = ['shield', 'tag', 'wrench'];

function renderTrustBadges(site) {
  return site.trustBadges.map((b, i) =>
    `      <div class="badge">${icon(TRUST_ICONS[i % TRUST_ICONS.length])}<span>${b}</span></div>`
  ).join('\n');
}

function renderCategoryPreview(site, city) {
  return site.offers.map(o => `      <div class="location-card">
        <h3>${o.categoryName}</h3>
        <p class="region">${fill(o.promise, city, site)}</p>
        <div class="location-links">
          <a class="ticket-cta request" href="/${city.slug}/services/#${o.id}">Explore ${o.categoryName} →</a>
        </div>
      </div>`).join('\n');
}

function heroIllustration() {
  return `<div class="hero-illustration" aria-hidden="true">
    <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="beaconGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#F5B301" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#F5B301" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="900" cy="220" r="260" fill="url(#beaconGlow)"/>
      <g stroke="#2A3038" stroke-width="2" fill="none" opacity="0.7">
        <circle cx="900" cy="220" r="60"/>
        <circle cx="900" cy="220" r="110"/>
        <circle cx="900" cy="220" r="165"/>
      </g>
      <g stroke="#2A3038" stroke-width="2" fill="none" opacity="0.6">
        <path d="M-100 700 L520 220 L1300 700"/>
        <path d="M-100 700 L520 320 L1300 700"/>
        <path d="M-100 700 L520 420 L1300 700"/>
      </g>
    </svg>
  </div>`;
}

function renderCityPage(city, site, allCities, services) {
  const cityFull = `${city.cityName}, ${city.stateAbbr}`;
  const hasGeo = typeof city.lat === 'number' && typeof city.lng === 'number';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Roadside & Windshield Repair in ${cityFull}</title>
<meta name="description" content="Need roadside assistance, a mobile mechanic, or mobile windshield repair near you in ${cityFull}? ${site.brandName} dispatches a vetted local pro to your exact location, 24/7.">
<meta property="og:title" content="${site.brandName} ${cityFull} — Roadside Assistance, Mobile Repair & Windshield, Dispatched to You">
<meta property="og:description" content="24/7 roadside assistance, mobile mechanic, and mobile windshield repair in ${cityFull} — one dispatch line.">
<meta property="og:type" content="website">
<meta name="theme-color" content="#14171C">
${hasGeo ? `<meta name="geo.region" content="${city.stateCode || ('US-' + city.stateAbbr)}">
<meta name="geo.placename" content="${cityFull}">
<meta name="geo.position" content="${city.lat};${city.lng}">
<meta name="ICBM" content="${city.lat}, ${city.lng}">
` : ''}<link rel="canonical" href="https://curbsideauto.com/${city.slug}/">
<link rel="stylesheet" href="/assets/styles.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "${site.brandName}",
  "description": "On-demand dispatch for 24/7 roadside assistance, mobile mechanic, and mobile windshield repair in ${cityFull}.",
  "areaServed": "${cityFull}"${renderServiceAreaSchema(city)},
  "makesOffer": [
${renderOfferSchema(site, city)}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
${renderFaqSchema(site, city)}
  ]
}
</script>
</head>
<body>

<div class="status-bar">
  <span class="dot"></span><span class="mono">DISPATCH LINE OPEN — ${cityFull.toUpperCase()}</span>
</div>

${renderHeader('home', city, site)}

<section class="hero">
  ${heroIllustration()}
  <div class="wrap">
    <div class="hero-split">
      <div>
        <div class="hero-eyebrow">${icon('beacon')} 24/7 EMERGENCY DISPATCH • ${city.cityName.toUpperCase()}, ${city.stateAbbr}</div>
        <h1>Stranded doesn't<br>mean <em>stuck.</em></h1>
        <p>Search no further than one call: a vetted local mobile mechanic or windshield repair pro headed your way, anywhere in ${cityFull}.</p>
        <div class="hero-ctas">
          <a class="btn-primary" href="tel:${city.phoneTel}">${icon('phone')}Call Now — Free If We're Late</a>
          <a class="btn-ghost" href="/${city.slug}/services/">See All Services</a>
        </div>
        <div class="trust-badges">
${renderTrustBadges(site)}
        </div>
      </div>
      <div class="hero-form-card">
        <div class="hero-eyebrow">${icon('beacon')} EMERGENCY DISPATCH</div>
        <h2>Get Roadside Help Now</h2>
        <p class="avg-response">Tell us where you are in ${city.cityName} — dispatch responds fast.</p>
        <form name="quick-request-${city.slug}" method="POST" data-netlify="true" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="quick-request-${city.slug}">
          <input type="hidden" name="city" value="${cityFull}">
          <p style="display:none">
            <label>Don't fill this out: <input name="bot-field"></label>
          </p>
          <div class="row2">
            <div>
              <label for="hero-name">Name</label>
              <input type="text" id="hero-name" name="name" placeholder="Name" required>
            </div>
            <div>
              <label for="hero-phone">Phone</label>
              <input type="tel" id="hero-phone" name="phone" placeholder="Phone Number" required>
            </div>
          </div>
          <div>
            <label for="hero-location">Location</label>
            <input type="text" id="hero-location" name="location" placeholder="Your Location" required>
          </div>
          <div>
            <label for="service">Service Needed</label>
            <select id="service" name="service" required>
${renderServiceSelect(services, site)}
            </select>
          </div>
          <div>
            <label for="hero-details">Description</label>
            <textarea id="hero-details" name="details" placeholder="Describe the issue (optional)"></textarea>
          </div>
          <button class="submit-btn" type="submit">${icon('phone')}Request Help</button>
        </form>
      </div>
    </div>
  </div>
</section>

<div class="stripe-rule"></div>

<section class="offers" id="offers">
  <div class="wrap">
    <div class="section-head">
      <div class="eyebrow">What We Handle</div>
      <h2>Two ways we get to you in ${city.cityName}</h2>
    </div>
    <div class="location-grid">
${renderCategoryPreview(site, city)}
    </div>
  </div>
</section>

<div class="stripe-rule"></div>

<section class="faq" id="faq">
  <div class="wrap" style="max-width:760px;">
    <div class="section-head">
      <div class="eyebrow">Common Questions</div>
      <h2>Before you call</h2>
    </div>
${site.faq.map(f => renderFaqItem(f, city, site)).join('\n')}
  </div>
</section>

<section class="coverage">
  <div class="wrap">
    <div class="coverage-box">
      <div>
        <h3>Need something more specific?</h3>
        <p>Full request form, click-to-call, and email — the fastest way to reach dispatch directly.</p>
      </div>
      <div class="coverage-tags">
        <a class="btn-primary" href="/${city.slug}/contact/">${icon('phone')}Go to Contact</a>
      </div>
    </div>
  </div>
</section>

${renderFooter(city, site, allCities)}

<script src="/assets/main.js"></script>

</body>
</html>
`;
}

module.exports = { renderCityPage };
