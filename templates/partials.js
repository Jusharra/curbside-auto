// Shared helpers used across every page template: token replacement, the
// JSON-LD serviceArea fragment, the inline-SVG icon set, and the site-wide
// header/footer chrome. Centralized here once the site grew past 2 templates
// to avoid re-hardcoding the same nav/footer/icon-map in 6+ places.

function fill(str, city, site) {
  return str
    .replace(/\{cityNameUpper\}/g, city.cityName.toUpperCase())
    .replace(/\{cityFull\}/g, `${city.cityName}, ${city.stateAbbr}`)
    .replace(/\{cityName\}/g, city.cityName)
    .replace(/\{brandName\}/g, site ? site.brandName : '');
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

// ---------- icons ----------
// Small line-icon set, 24x24, currentColor strokes — no external library/CDN.
const ICON_PATHS = {
  phone: '<path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8Z"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L3 17.7 6.3 21l6.3-6.3a4 4 0 0 0 5.1-5.4l-2.8 2.8-2-2 2.8-2.8Z"/>',
  tire: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/><path d="M12 4v3.5M12 16.5V20M4 12h3.5M16.5 12H20M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M17.7 6.3l-2.5 2.5M8.8 15.2l-2.5 2.5"/>',
  battery: '<rect x="2" y="8" width="16" height="9" rx="1.5"/><path d="M18 11h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2"/><path d="M11 9.5 8 13.5h2.5L9 17.5l4-5h-2.5L12 9.5Z" fill="currentColor" stroke="none"/>',
  key: '<circle cx="8" cy="8" r="4"/><path d="M11 11 20 20M16.5 20 20 16.5M13.5 17 17 13.5"/>',
  fuel: '<path d="M5 21V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v15"/><path d="M5 11h9"/><path d="M14 7l3 3v6.5a1.5 1.5 0 0 0 3 0V10a1 1 0 0 0-.3-.7L17 6.5"/><path d="M3 21h13"/>',
  brake: '<circle cx="12" cy="12" r="7"/><rect x="9.5" y="3.5" width="5" height="6" rx="1"/>',
  car: '<path d="M4 16V11l1.8-4.5A2 2 0 0 1 7.7 5h8.6a2 2 0 0 1 1.9 1.5L20 11v5"/><path d="M3 16h18v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2Z"/><circle cx="7.5" cy="16" r="1.5" fill="currentColor" stroke="none"/><circle cx="16.5" cy="16" r="1.5" fill="currentColor" stroke="none"/>',
  siren: '<path d="M12 3a5 5 0 0 1 5 5v6H7V8a5 5 0 0 1 5-5Z"/><path d="M5 14h14v3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-3Z"/><path d="M12 1v1.2M7 3.5l.7 1M17 3.5l-.7 1"/><path d="M9 21h6"/>',
  'glass-chip': '<rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M9 4 6 17M9 4l4 5-2 3 3 5"/>',
  'glass-full': '<rect x="3" y="5" width="18" height="12" rx="1.5"/><path d="M3 9h18M9 5v12"/>',
  'glass-side': '<rect x="4" y="6" width="16" height="10" rx="1.5"/><path d="M4 11h16"/>',
  shield: '<path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3Z"/><path d="M9 12l2 2 4-4"/>',
  tag: '<path d="M3 11.5V5a1 1 0 0 1 1-1h6.5a1 1 0 0 1 .7.3l9 9a1 1 0 0 1 0 1.4l-6.5 6.5a1 1 0 0 1-1.4 0l-9-9a1 1 0 0 1-.3-.7Z"/><circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/>',
  beacon: '<circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="10"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>'
};

function icon(name, cls) {
  const inner = ICON_PATHS[name] || ICON_PATHS.tag;
  return `<svg class="${cls || 'icon'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

// ---------- request form <select> ----------
// Shared atomic-service dropdown used by the hero quick-form, the Contact
// page's full form, and each individual service page's own form.
function renderServiceSelect(services, site, selectedSlug) {
  const groups = site.offers.map(o => {
    const catServices = services.filter(s => s.category === o.id);
    if (!catServices.length) return '';
    const options = catServices.map(s =>
      `      <option value="${s.slug}"${s.slug === selectedSlug ? ' selected' : ''}>${s.name}</option>`
    ).join('\n');
    return `    <optgroup label="${o.categoryName}">\n${options}\n    </optgroup>`;
  }).filter(Boolean).join('\n');

  return `    <option value=""${selectedSlug ? '' : ' selected'}>Select a service</option>
${groups}
    <option value="not-sure">Not sure — help me figure it out</option>`;
}

// ---------- header ----------
function renderHeader(activePath, city, site) {
  const cityFull = `${city.cityName}, ${city.stateAbbr}`;
  const navItems = [
    { key: 'home', label: 'Home', href: `/${city.slug}/` },
    { key: 'services', label: 'Services', href: `/${city.slug}/services/` },
    { key: 'locations', label: 'Locations', href: `/${city.slug}/locations/` },
    { key: 'cities', label: 'Cities', href: '/' },
    { key: 'about', label: 'About', href: `/${city.slug}/about/` },
    { key: 'contact', label: 'Contact', href: `/${city.slug}/contact/` }
  ];
  const navHtml = navItems.map(n =>
    `      <a href="${n.href}"${n.key === activePath ? ' class="active"' : ''}>${n.label}</a>`
  ).join('\n');

  return `<header>
  <div class="nav wrap">
    <a class="logo" href="/${city.slug}/">
      <span class="logo-badge">${icon('phone')}</span>
      <span class="logo-text">
        <span class="logo-word">${site.logoMain}<span>${site.logoAccent}</span></span>
        <span class="logo-sub mono">${cityFull.toUpperCase()}</span>
      </span>
    </a>
    <nav class="nav-links">
${navHtml}
    </nav>
    <div class="nav-right">
      <a class="call-btn" href="tel:${city.phoneTel}">${icon('phone')}<span class="call-btn-label">Call Now</span></a>
      <button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false">${icon('menu')}</button>
    </div>
  </div>
</header>`;
}

// ---------- footer ----------
function renderFooter(city, site, publiclyLiveCities) {
  const otherCities = (publiclyLiveCities || []).filter(c => c.slug !== city.slug);
  const crossLinks = otherCities.length
    ? `<p class="footer-cross-links">Also serving: ${otherCities.map(c => `<a href="/${c.slug}/">${c.cityName}, ${c.stateAbbr}</a>`).join(', ')} — <a href="/">see all cities</a></p>`
    : `<p class="footer-cross-links"><a href="/">See every city we serve →</a></p>`;

  return `<footer>
  <div class="wrap footer-inner">
    <div>
      <span>© <span id="year"></span> ${site.brandName}. Independent dispatch network — providers are independently owned and operated.</span>
      ${crossLinks}
    </div>
    <span><a href="tel:${city.phoneTel}">${city.phoneDisplay}</a> &nbsp;·&nbsp; <a href="mailto:${city.email}">${city.email}</a></span>
  </div>
</footer>`;
}

module.exports = { fill, renderServiceAreaSchema, icon, renderServiceSelect, renderHeader, renderFooter };
