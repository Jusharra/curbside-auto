// Zero-dependency static site builder.
// Reads data/*.json, writes finished pages to dist/.
// Run with: node build.js

const fs = require('fs');
const path = require('path');
const { renderCityPage } = require('./templates/city-page');
const { renderHomePage } = require('./templates/home-page');
const { renderServicePage } = require('./templates/service-page');
const { renderServicesPage } = require('./templates/services-page');
const { renderLocationsPage } = require('./templates/locations-page');
const { renderAboutPage } = require('./templates/about-page');
const { renderContactPage } = require('./templates/contact-page');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function writePage(dir, html) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// A city must not go publicly live with any service category lacking
// confirmed provider coverage. Required categories are derived from LIVE
// services only, so a draft category with zero live services can't block
// every city from publishing.
function requiredCategories(liveServices) {
  return [...new Set(liveServices.map(s => s.category))];
}

function passesGate(city, required) {
  if (!city.live) return false;
  const confirmed = city.categoriesConfirmed || {};
  return required.every(cat => confirmed[cat] === true);
}

function build() {
  const site = readJson('data/site.json');
  const cities = readJson('data/cities.json');
  const services = readJson('data/services.json');
  const config = readJson('data/config.json');

  const liveServices = services.filter(s => s.live);
  const required = requiredCategories(liveServices);

  const publiclyLiveCities = cities.filter(c => passesGate(c, required));

  const gatedOut = cities.filter(c => c.live && !passesGate(c, required));
  for (const city of gatedOut) {
    const confirmed = city.categoriesConfirmed || {};
    const missing = required.filter(cat => confirmed[cat] !== true);
    console.error(`  ⚠ ${city.cityName}, ${city.stateAbbr} is marked live but missing confirmed coverage for: ${missing.join(', ')} — excluded from build.`);
  }

  // Clean dist/
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  // Copy static assets (CSS, JS) as-is
  copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));

  // Global Cities directory
  fs.writeFileSync(path.join(DIST, 'index.html'), renderHomePage(publiclyLiveCities, site, config));

  // Five pages per city (Home/Services/Locations/About/Contact), plus one
  // deep SEO page per live service within that city. `publiclyLiveCities`
  // (never the raw `cities` array) is threaded through every render call so
  // a gated-out city can never leak into another page's cross-links.
  let builtCities = 0;
  let builtServices = 0;
  for (const city of publiclyLiveCities) {
    const cityDir = path.join(DIST, city.slug);

    writePage(cityDir, renderCityPage(city, site, publiclyLiveCities, liveServices, config));
    writePage(path.join(cityDir, 'services'), renderServicesPage(city, site, liveServices, publiclyLiveCities));
    writePage(path.join(cityDir, 'locations'), renderLocationsPage(city, site, publiclyLiveCities, config));
    writePage(path.join(cityDir, 'about'), renderAboutPage(city, site, publiclyLiveCities));
    writePage(path.join(cityDir, 'contact'), renderContactPage(city, site, liveServices, publiclyLiveCities));
    builtCities++;

    for (const service of liveServices) {
      writePage(path.join(cityDir, service.slug), renderServicePage(service, city, site, liveServices, publiclyLiveCities));
      builtServices++;
    }
  }

  if (builtCities === 0) {
    console.error('BUILD FAILED: no cities passed the live + categoriesConfirmed gate. Nothing published.');
    process.exit(1);
  }

  console.log(`Built ${builtCities} live city page(s) (Home/Services/Locations/About/Contact), ${builtServices} service page(s), + the global Cities directory into dist/`);
  if (config.googleMapsApiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    console.log('  ⚠ data/config.json still has the placeholder Google Maps API key — maps will not render until you add a real one.');
  }
  for (const city of cities) {
    const live = publiclyLiveCities.includes(city);
    console.log(`  ${live ? '✓' : '○'} ${city.cityName}, ${city.stateAbbr} → ${live ? `/${city.slug}/` : '(not live)'}`);
  }
  for (const service of services) {
    console.log(`    ${service.live ? '✓' : '○'} ${service.name} → ${service.live ? `/{city}/${service.slug}/` : '(not live)'}`);
  }
}

build();
