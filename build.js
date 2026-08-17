// Zero-dependency static site builder.
// Reads data/cities.json + data/site.json, writes finished pages to dist/.
// Run with: node build.js

const fs = require('fs');
const path = require('path');
const { renderCityPage } = require('./templates/city-page');
const { renderHomePage } = require('./templates/home-page');
const { renderServicePage } = require('./templates/service-page');
const { renderLocationsPage } = require('./templates/locations-page');

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

function build() {
  const site = readJson('data/site.json');
  const cities = readJson('data/cities.json');
  const services = readJson('data/services.json');
  const config = readJson('data/config.json');

  // Clean dist/
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  // Copy static assets (CSS, JS) as-is
  copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));

  // Homepage / hub
  fs.writeFileSync(path.join(DIST, 'index.html'), renderHomePage(cities, site));

  // Site-wide Locations page: network map + a coverage card per live city
  const locationsDir = path.join(DIST, 'locations');
  fs.mkdirSync(locationsDir, { recursive: true });
  fs.writeFileSync(path.join(locationsDir, 'index.html'), renderLocationsPage(cities, site, config));

  // One page per live city, at /{slug}/index.html so URLs are clean (curbsideauto.com/visalia-ca/)
  // Plus one page per live service within that city, at /{city.slug}/{service.slug}/
  let builtCities = 0;
  let builtServices = 0;
  for (const city of cities) {
    if (!city.live) continue;
    const cityDir = path.join(DIST, city.slug);
    fs.mkdirSync(cityDir, { recursive: true });
    fs.writeFileSync(path.join(cityDir, 'index.html'), renderCityPage(city, site, cities, services, config));
    builtCities++;

    for (const service of services) {
      if (!service.live) continue;
      const serviceDir = path.join(cityDir, service.slug);
      fs.mkdirSync(serviceDir, { recursive: true });
      fs.writeFileSync(path.join(serviceDir, 'index.html'), renderServicePage(service, city, site, services, cities));
      builtServices++;
    }
  }

  console.log(`Built ${builtCities} live city page(s), ${builtServices} service page(s), + homepage + locations page into dist/`);
  if (config.googleMapsApiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    console.log('  ⚠ data/config.json still has the placeholder Google Maps API key — maps will not render until you add a real one.');
  }
  for (const city of cities) {
    console.log(`  ${city.live ? '\u2713' : '\u25CB'} ${city.cityName}, ${city.stateAbbr} \u2192 ${city.live ? `/${city.slug}/` : '(not live \u2014 set "live": true to publish)'}`);
  }
  for (const service of services) {
    console.log(`    ${service.live ? '\u2713' : '\u25CB'} ${service.name} \u2192 ${service.live ? `/{city}/${service.slug}/` : '(not live)'}`);
  }
}

build();
