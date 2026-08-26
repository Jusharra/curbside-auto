// Renders the Contact page: /{city.slug}/contact/
// The full detailed request form (relocated from the old single city page),
// plus click-to-call and email. Supports ?service={slug} prefill from a
// service card's "Request Online" link (see assets/main.js).

const { renderServiceAreaSchema, icon, renderServiceSelect, renderHeader, renderFooter } = require('./partials');

function renderBreadcrumbSchema(city, cityFull) {
  return `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://curbsideauto.com/" },
    { "@type": "ListItem", "position": 2, "name": "${cityFull}", "item": "https://curbsideauto.com/${city.slug}/" },
    { "@type": "ListItem", "position": 3, "name": "Contact", "item": "https://curbsideauto.com/${city.slug}/contact/" }
  ]
}`;
}

function renderContactPage(city, site, services, publiclyLiveCities) {
  const cityFull = `${city.cityName}, ${city.stateAbbr}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contact & Request Service in ${cityFull} | ${site.brandName}</title>
<meta name="description" content="Call, email, or send a request to ${site.brandName} in ${cityFull} — dispatch texts back with an ETA and price.">
<meta name="theme-color" content="#14171C">
<link rel="canonical" href="https://curbsideauto.com/${city.slug}/contact/">
<link rel="stylesheet" href="/assets/styles.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "${site.brandName}",
  "telephone": "${city.phoneTel}",
  "email": "${city.email}",
  "areaServed": "${cityFull}"${renderServiceAreaSchema(city)}
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

${renderHeader('contact', city, site)}

<section class="hero">
  <div class="wrap">
    <div class="hero-eyebrow">${icon('phone')} REACH DISPATCH DIRECTLY</div>
    <h1>Contact <em>Dispatch.</em></h1>
    <p>Call, email, or send a request below — tell us where you are in ${city.cityName} and what you need.</p>
    <div class="hero-ctas">
      <a class="btn-primary" href="tel:${city.phoneTel}">${icon('phone')}${city.phoneDisplay}</a>
      <a class="btn-ghost" href="mailto:${city.email}">${icon('tag')}${city.email}</a>
    </div>
  </div>
</section>

<div class="stripe-rule"></div>

<section class="request" id="request">
  <div class="wrap">
    <div class="request-box">
      <h2>Request Service</h2>
      <p>Tell us where you are in ${city.cityName} and what you need — dispatch will text you back with an ETA and price.</p>
      <form name="service-request-${city.slug}" method="POST" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="service-request-${city.slug}">
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
${renderServiceSelect(services, site)}
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

${renderFooter(city, site, publiclyLiveCities)}

<script src="/assets/main.js"></script>

</body>
</html>
`;
}

module.exports = { renderContactPage };
