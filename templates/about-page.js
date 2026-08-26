// Renders the About page: /{city.slug}/about/
// Company story, how the dispatch model works, and the shared "How It
// Works" 3-step block. Never names a specific provider — only the brand's
// own name and number ever appear on the public site.

const { fill, icon, renderHeader, renderFooter } = require('./partials');

function renderBreadcrumbSchema(city, cityFull) {
  return `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://curbsideauto.com/" },
    { "@type": "ListItem", "position": 2, "name": "${cityFull}", "item": "https://curbsideauto.com/${city.slug}/" },
    { "@type": "ListItem", "position": 3, "name": "About", "item": "https://curbsideauto.com/${city.slug}/about/" }
  ]
}`;
}

function renderHowStep(step, i, city, site) {
  return `      <div class="how-step">
        <div class="step-num mono">0${i + 1}</div>
        <h3>${step.title}</h3>
        <p>${fill(step.text, city, site)}</p>
      </div>`;
}

function renderAboutPage(city, site, publiclyLiveCities) {
  const cityFull = `${city.cityName}, ${city.stateAbbr}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>About Us in ${cityFull} | ${site.brandName}</title>
<meta name="description" content="How ${site.brandName}'s dispatch model works in ${cityFull} — no membership, flat pricing, vetted independent local providers.">
<meta name="theme-color" content="#14171C">
<link rel="canonical" href="https://curbsideauto.com/${city.slug}/about/">
<link rel="stylesheet" href="/assets/styles.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<script type="application/ld+json">
${renderBreadcrumbSchema(city, cityFull)}
</script>
</head>
<body>

<div class="status-bar">
  <span class="dot"></span><span class="mono">DISPATCH LINE OPEN — ${cityFull.toUpperCase()}</span>
</div>

${renderHeader('about', city, site)}

<section class="hero">
  <div class="wrap">
    <div class="hero-eyebrow">${icon('shield')} ABOUT THE DISPATCH LINE</div>
    <h1>One call, <em>no guesswork.</em></h1>
    <p>How ${site.brandName} gets a vetted local pro to you in ${city.cityName} — without a membership, a shop drop-off, or a surprise bill.</p>
  </div>
</section>

<div class="stripe-rule"></div>

<section class="offers">
  <div class="wrap about-body">
    <h2>What we actually do</h2>
    <p>${site.brandName} isn't a repair shop, and we don't send our own trucks. We run the dispatch line — the single number you call in ${city.cityName} when something's wrong with your car, day or night. When you call, we route your request to a vetted, independently-owned local provider who handles the actual roadside call or windshield job, and we stay on your side of that call the whole time: one number, one flat price quoted upfront, one point of contact if anything needs to be sorted out.</p>
    <p>That's also why you won't see a provider's name anywhere on this site. You're calling ${site.brandName} — the dispatch line, the pricing, and the guarantee are ours. The technician who shows up is a vetted local professional, independently owned and operated, matched to your job and your location in ${city.cityName}.</p>
    <h2>Why call before you tow</h2>
    <p>A lot of roadside problems — a dead battery, a flat, a lockout, a chip in the windshield — don't need a tow at all. They need someone to show up where you already are. That's the whole model: no membership to sign up for, no annual fee sitting unused in your wallet, no drive to a shop for something that can be fixed at the curb. Call, tell us what's going on, and we dispatch the right kind of help to your exact location.</p>
  </div>
</section>

<div class="stripe-rule"></div>

<section class="how">
  <div class="wrap">
    <div class="section-head">
      <div class="eyebrow">How It Works</div>
      <h2>Three steps, no shop visit</h2>
    </div>
    <div class="how-grid">
${site.howItWorks.map((s, i) => renderHowStep(s, i, city, site)).join('\n')}
    </div>
  </div>
</section>

<section class="coverage">
  <div class="wrap">
    <div class="coverage-box">
      <div>
        <h3>Ready when you are</h3>
        <p>Call now or send a request online — dispatch will text you back with an ETA and price.</p>
      </div>
      <div class="coverage-tags">
        <a class="btn-primary" href="tel:${city.phoneTel}">${icon('phone')}Call ${city.phoneDisplay}</a>
      </div>
    </div>
  </div>
</section>

${renderFooter(city, site, publiclyLiveCities)}

<script src="/assets/main.js"></script>

</body>
</html>
`;
}

module.exports = { renderAboutPage };
