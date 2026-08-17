// Renders one full HTML page for a single city.
// Every {cityName} token in the shared copy gets swapped for the real city name.

function fill(str, city) {
  return str.replace(/\{cityName\}/g, city.cityName);
}

function renderOfferSchema(site, city) {
  return site.offers.map(o => `    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "${fill(o.title, city)}",
        "description": "${fill(o.promise, city)}"
      }
    }`).join(',\n');
}

function renderFaqSchema(site, city) {
  return site.faq.map(f => `    {
      "@type": "Question",
      "name": "${f.q}",
      "acceptedAnswer": { "@type": "Answer", "text": "${fill(f.a, city)}" }
    }`).join(',\n');
}

function renderServiceLinks(o, city, services) {
  const matches = (services || []).filter(s => s.live && s.category === o.id);
  if (!matches.length) return '';
  const links = matches.map(s => `          <a href="/${city.slug}/${s.slug}/">${s.name}</a>`).join('\n');
  return `
        <div class="service-links">
${links}
        </div>`;
}

function renderTicket(o, city, services) {
  const stackHtml = o.stack.map(s => `          <li>${s}</li>`).join('\n');
  return `      <div class="ticket" id="${o.id}">
        <div class="ticket-num">TICKET NO. ${o.ticketNo} / ${o.label}</div>
        <h3>${fill(o.title, city)}</h3>
        <p class="promise">${fill(o.promise, city)}</p>
        <hr class="divider">
        <ul class="stack">
${stackHtml}
        </ul>
        <div class="risk"><b>Risk reversal:</b> ${o.risk}</div>
        <div class="ticket-ctas">
          <a class="ticket-cta call" href="tel:${city.phoneTel}">\u{1F4DE} ${o.callCta}</a>
          <a class="ticket-cta request" href="#request" data-service="${o.requestValue}">Request Online \u2192</a>
        </div>${renderServiceLinks(o, city, services)}
      </div>`;
}

function renderFaqItem(f, city) {
  return `    <div class="faq-item">
      <h3>${f.q}</h3>
      <p>${fill(f.a, city)}</p>
    </div>`;
}

function renderNavLinks(site) {
  return site.offers.map(o => `      <a href="#${o.id}">${o.label === 'RESCUE + REPAIR' ? 'Roadside & Repair' : 'Windshield'}</a>`).join('\n');
}

function renderCityPage(city, site, allCities, services) {
  const cityFull = `${city.cityName}, ${city.stateAbbr}`;
  const otherCities = allCities.filter(c => c.slug !== city.slug && c.live);
  const otherCityLinks = otherCities.length
    ? `\n    <p style="margin-top:14px; font-size:13px; color:var(--ink-faint);">Also serving: ${otherCities.map(c => `<a href="/${c.slug}/" style="color:var(--ink-dim); text-decoration:underline;">${c.cityName}, ${c.stateAbbr}</a>`).join(', ')}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Roadside Assistance, Mobile Mechanic & Windshield Repair in ${cityFull} | ${site.brandName}</title>
<meta name="description" content="Need roadside assistance, a mobile mechanic, or mobile windshield repair near you in ${cityFull}? ${site.brandName} dispatches a vetted local pro to your exact location, 24/7.">
<meta property="og:title" content="${site.brandName} ${cityFull} \u2014 Roadside Assistance, Mobile Repair & Windshield, Dispatched to You">
<meta property="og:description" content="24/7 roadside assistance, mobile mechanic, and mobile windshield repair in ${cityFull} \u2014 one dispatch line.">
<meta property="og:type" content="website">
<meta name="theme-color" content="#14171C">
<link rel="canonical" href="https://curbsideauto.com/${city.slug}/">
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
  "areaServed": "${cityFull}",
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
  <span class="dot"></span><span class="mono">DISPATCH LINE OPEN \u2014 ${cityFull.toUpperCase()}</span>
</div>

<header>
  <div class="nav wrap">
    <div class="logo">${site.brandName.slice(0, -4)}<span>${site.brandName.slice(-4)}</span></div>
    <nav class="nav-links">
${renderNavLinks(site)}
      <a href="#faq">FAQ</a>
      <a href="#request">Request Help</a>
    </nav>
    <a class="call-btn" href="tel:${city.phoneTel}">Call Now</a>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <div class="hero-eyebrow">// ROADSIDE ASSISTANCE NEAR ME \u2014 DISPATCHED 24/7 IN ${city.cityName.toUpperCase()}</div>
    <h1>Stranded doesn't<br>mean <em>stuck.</em></h1>
    <p>Search no further than one call: a vetted local mobile mechanic or windshield repair pro headed your way, anywhere in ${cityFull}.</p>
    <div class="hero-ctas">
      <a class="btn-primary" href="tel:${city.phoneTel}">\u{1F4DE} Call Now \u2014 Free If We're Late</a>
      <a class="btn-ghost" href="#request">See Both Offers \u2193</a>
    </div>
    <div class="marker-strip">
      <div class="marker"><div class="num">MM 01</div><div class="label">Roadside Rescue &amp; Mobile Repair</div></div>
      <div class="marker"><div class="num">MM 02</div><div class="label">Mobile Windshield Repair</div></div>
    </div>${otherCityLinks}
  </div>
</section>

<div class="stripe-rule"></div>

<section class="offers" id="offers">
  <div class="wrap">
    <div class="section-head">
      <div class="eyebrow">The Offers</div>
      <h2>Two ways we get to you in ${city.cityName}</h2>
    </div>

    <div class="ticket-grid">
${site.offers.map(o => renderTicket(o, city, services)).join('\n\n')}
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
        <p>Call, text, or fill out the form below with your location and what's going on.</p>
      </div>
      <div class="how-step">
        <div class="step-num mono">02</div>
        <h3>We dispatch a local pro</h3>
        <p>You get matched with a vetted independent tech already near you in ${city.cityName} \u2014 not a call center queue.</p>
      </div>
      <div class="how-step">
        <div class="step-num mono">03</div>
        <h3>Help shows up</h3>
        <p>Flat, upfront pricing. No shop drop-off, no waiting room, no surprise fees.</p>
      </div>
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
${site.faq.map(f => renderFaqItem(f, city)).join('\n')}
  </div>
</section>

<section class="request" id="request">
  <div class="wrap">
    <div class="request-box">
      <h2>Request Service</h2>
      <p>Tell us where you are in ${city.cityName} and what you need \u2014 dispatch will text you back with an ETA and price.</p>
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
            <option value="">Select a service</option>
${site.offers.map(o => `            <option>${o.requestValue}</option>`).join('\n')}
            <option>Not sure \u2014 help me figure it out</option>
          </select>
        </div>
        <div>
          <label for="location">Your location in ${city.cityName}</label>
          <input type="text" id="location" name="location" placeholder="Address, cross streets, or freeway/mile marker" required>
        </div>
        <div>
          <label for="details">Anything dispatch should know</label>
          <input type="text" id="details" name="details" placeholder="Vehicle, what happened, best callback time">
        </div>
        <button class="submit-btn" type="submit">Send Request \u2192</button>
      </form>
    </div>
  </div>
</section>

<footer>
  <div class="wrap" style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; width:100%;">
    <span>\u00A9 <span id="year"></span> ${site.brandName}. Independent dispatch network \u2014 providers are independently owned and operated.</span>
    <span><a href="tel:${city.phoneTel}">${city.phoneDisplay}</a> &nbsp;\u00B7&nbsp; <a href="mailto:${city.email}">${city.email}</a></span>
  </div>
</footer>

<script src="/assets/main.js"></script>

</body>
</html>
`;
}

module.exports = { renderCityPage };
