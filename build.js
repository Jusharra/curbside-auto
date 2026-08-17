// Zero-dependency static site builder.
// Reads data/cities.json + data/site.json, writes finished pages to dist/.
// Run with: node build.js

const fs = require('fs');
const path = require('path');
const { renderCityPage } = require('./templates/city-page');
const { renderHomePage } = require('./templates/home-page');

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

  // Clean dist/
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  // Copy static assets (CSS, JS) as-is
  copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));

  // Homepage / hub
  fs.writeFileSync(path.join(DIST, 'index.html'), renderHomePage(cities, site));

  // One page per live city, at /{slug}/index.html so URLs are clean (curbsideauto.com/visalia-ca/)
  let built = 0;
  for (const city of cities) {
    if (!city.live) continue;
    const cityDir = path.join(DIST, city.slug);
    fs.mkdirSync(cityDir, { recursive: true });
    fs.writeFileSync(path.join(cityDir, 'index.html'), renderCityPage(city, site, cities));
    built++;
  }

  console.log(`Built ${built} live city page(s) + homepage into dist/`);
  for (const city of cities) {
    console.log(`  ${city.live ? '\u2713' : '\u25CB'} ${city.cityName}, ${city.stateAbbr} \u2192 ${city.live ? `/${city.slug}/` : '(not live \u2014 set "live": true to publish)'}`);
  }
}

build();
