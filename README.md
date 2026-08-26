# 24 Hour Roadside Assistance & Windshield Repair Service — Multi-City Site

This is a small, zero-dependency site generator. One set of templates, one data file per concept (cities, services, shared copy) — add a city or a service by editing data, not by touching HTML.

## How it's structured

```
data/
  site.json         ← brand name, logo, trust badges, how-it-works, offer copy, FAQ (shared across every city)
  cities.json       ← one entry per city — THIS is the file you edit to add a city
  services.json     ← one entry per service — edit this to add/change a service (SEO landing page + icon)
  config.json       ← Google Maps API key (see "Google Maps" below)
templates/
  partials.js        ← shared header/footer/nav, icon set, token-fill, request-form <select> — used by every page
  city-page.js        ← Home: /{city}/
  services-page.js    ← Services: /{city}/services/ (atomic card grid)
  locations-page.js   ← Locations: /{city}/locations/ (intra-city coverage areas + map)
  about-page.js        ← About: /{city}/about/
  contact-page.js      ← Contact: /{city}/contact/ (full request form)
  service-page.js       ← the deep SEO page for one service in one city: /{city}/{service}/
  home-page.js           ← the global Cities directory: /
assets/
  styles.css     ← shared design, used by every page
  main.js        ← shared behavior (form prefill, mobile nav toggle, footer year)
  maps.js        ← Google Maps rendering (dark-themed coverage circles + markers)
build.js         ← reads the data, writes finished pages into dist/
dist/            ← generated output (not committed — Netlify builds this automatically)
```

## Site map

```
/                          → Cities directory (global) — every publicly live city + network map
/{slug}/                   → Home — hero w/ embedded quick-request form, trust badges, category preview, FAQ
/{slug}/services/          → Services — atomic card grid, one card per service, grouped by category
/{slug}/locations/         → Locations — neighborhoods/corridors THIS city covers, + coverage-radius map
/{slug}/about/             → About — how the dispatch model works, How It Works steps
/{slug}/contact/           → Contact — full detailed request form, click-to-call, email
/{slug}/{service-slug}/    → deep SEO landing page for one individual service in this city
```

**"Locations" is intra-city** (neighborhoods within Visalia). **"Cities" is inter-city** (Visalia vs. Madera vs. wherever's next, at `/`). Don't confuse the two when editing — they're deliberately separate pages with separate data sources (`city.areas[]` vs. the top-level `cities.json` array).

## Adding your next city (e.g. Madera, once you're ready)

1. Open `data/cities.json`.
2. Copy the Visalia entry and change the values:

```json
{
  "slug": "madera-ca",
  "cityName": "Madera",
  "stateAbbr": "CA",
  "stateFull": "California",
  "region": "the Central Valley",
  "phoneDisplay": "(559) 555-0100",
  "phoneTel": "+15595550100",
  "email": "dispatch@curbsideauto.com",
  "live": true,
  "launchNote": "Now serving Madera, CA",
  "lat": 36.9613,
  "lng": -120.0607,
  "serviceRadiusMiles": 30,
  "stateCode": "US-CA",
  "categoriesConfirmed": { "roadside": true, "windshield": true },
  "areas": [
    { "name": "Downtown Madera", "description": "One-line description of this coverage area." }
  ]
}
```

- `lat`/`lng`/`serviceRadiusMiles` drive that city's coverage map(s) and `geo`/`ICBM` meta tags. Omit them and the city still builds, it just skips the map/geo tags.
- `areas[]` populates the `/​{slug}/locations/` page — list the real neighborhoods/corridors/growth areas you dispatch to.
- **`categoriesConfirmed` is a hard gate, not a suggestion.** A city only actually publishes once every category with at least one live service in `data/services.json` is confirmed `true` here. See "Live-gating" below — get this wrong and the build will loudly refuse to publish that city (or fail entirely if it's the only one).

3. `git add -A && git commit -m "Add Madera" && git push`.
4. Netlify rebuilds automatically. Madera gets all 5 pages plus one page per live service, cross-linked from every other live city's footer and from the global Cities directory.

**To hold a city back without deleting it** (e.g. you're recruiting providers there but not ready for customers yet), set `"live": false`, or leave `live: true` with an incomplete `categoriesConfirmed` — either way the build excludes it until it's genuinely ready.

## Live-gating: why a city can silently not appear

**A city must never go publicly live with a service category that isn't backed by confirmed provider coverage.** `build.js` enforces this at build time, not just as a warning:

- Required categories are derived from the distinct `category` values of **live** entries in `data/services.json` (currently `roadside` and `windshield`).
- A city only builds if `live: true` **and** every required category is `true` in its `categoriesConfirmed`.
- A `live: true` city that fails the gate prints a loud `⚠` warning naming the missing category and is **completely excluded** from the build — no pages, no cross-links from other cities, no listing on the Cities directory.
- If gating leaves **zero** cities, the build fails (non-zero exit) instead of silently shipping an empty site.

If a city you expect to see is missing from `dist/`, check the build output for that warning before assuming something else broke.

## Adding a new service

1. Open `data/services.json` and copy an existing entry in the right `category` (`"roadside"` or `"windshield"`).
2. Fill in: `slug`, `name`, `icon` (one of the names in `templates/partials.js`'s `ICON_PATHS` — add a new one there if you need a shape that doesn't exist yet), `primaryKeyword` / `secondaryKeywords`, `eyebrow`, `h1`, `metaTitle`, `metaDescription`, `intro`, `benefits`, `risk`, `callCta`, `requestValue`, and 3 `faq` items. Use `{cityName}`, `{cityNameUpper}`, `{cityFull}`, and `{brandName}` anywhere — the build swaps in the real values per city.
3. `node build.js` to preview, then commit and push. The service automatically gets a card on every city's `/services/` grid, an option in every request-form dropdown, and its own deep SEO page per live city — no template edits needed.
4. Set `"live": false` to hold a service back without deleting it (it also stops counting toward the live-gating requirement above until it's live again).

## Google Maps

Two places use the Maps JS API, both reading `data/config.json`:
- The global Cities directory (`/`) shows a **network map** — every live city as a marker + shaded coverage circle.
- Each city's `/​{slug}/locations/` page shows that **one city's** coverage-radius map, next to its area list.

### Setting up your Google Maps API key

1. In [Google Cloud Console](https://console.cloud.google.com/), enable the **Maps JavaScript API** and create an API key.
2. **Restrict the key** to your domain (HTTP referrers: `curbsideauto.com/*`, `*.netlify.app/*` if you preview on a Netlify subdomain first) — this is what makes it safe to have the key visible in your site's HTML.
3. Open `data/config.json` and replace the placeholder:

```json
{ "googleMapsApiKey": "YOUR_GOOGLE_MAPS_API_KEY" }
```

4. `node build.js` and reload — the maps render immediately, no other changes needed. Until you add a real key, the map sections show Google's own "didn't load correctly" placeholder instead of breaking the page.

## Editing shared copy (brand, offers, FAQ, trust badges, how-it-works)

Everything that's the same across every city lives in `data/site.json`:
- `brandName` / `logoMain` / `logoAccent` — the legal name (used in schema, footer, title tags) vs. the compact header wordmark (the full name is long, so the header shows a shorter lockup)
- `offers[]` — the two broad categories (Roadside/Mechanic, Windshield), each with a `categoryName` used for section headers on the Services page
- `trustBadges[]` — shown under the Home hero CTAs; keep these to claims you can actually stand behind (no "Licensed & Insured" or specific response-time promises unless they're verified facts)
- `howItWorks[]` — the shared 3-step block, shown on the About page and on every service page
- `faq[]` — shown on Home

Use `{cityName}` / `{brandName}` anywhere in this copy and the build swaps in the real values per page.

## Provider anonymity (business rule, not just a style choice)

This is a dispatch/middleman business — providers are never named anywhere on the public site, only this business's own name and number. Keep that in mind if you edit `about-page.js` or `contact-page.js` copy: no provider company names, ever.

## Before going live, still swap:

- Real phone number(s) and email in `data/cities.json` (currently placeholders per city).
- Domain in the `canonical`/schema URLs across `templates/*.js` (currently `curbsideauto.com` as a placeholder).
- Real Google Maps API key in `data/config.json` — maps won't render on any page until this is a real, domain-restricted key.
- Double-check `lat`/`lng`/`serviceRadiusMiles` and `areas[]` per city in `data/cities.json` reflect where you actually dispatch.
- Confirm `categoriesConfirmed` is genuinely true before flipping a city `live` — see "Live-gating" above.

## Local build (to preview before pushing)

Requires Node.js (no other dependencies — nothing to `npm install`):

```
node build.js
```

Then open `dist/index.html` or `dist/visalia-ca/index.html` in a browser to preview.

## Form submissions

There are two Netlify Forms per city: a **quick** hero form on Home (`quick-request-{slug}`) and the **full** form on Contact (`service-request-{slug}`), plus one per individual service page (`service-request-{slug}-{service-slug}`). All use `data-netlify="true"` — once deployed, submissions land in your Netlify dashboard under Site → Forms, tagged by which form/city they came from. Turn on **email notifications** in Netlify (Site settings → Forms → Form notifications) so a submission never gets missed.

Clicking "Request Online" on a service card carries the selected service through as a `?service={slug}` query param to the Contact page, which pre-selects it in the dropdown — see `prefillServiceFromQuery()` in `assets/main.js`.

## Deploying

**GitHub → Netlify (recommended):**
1. Create an empty repo on GitHub.
2. From this folder: `git remote add origin <your-repo-url>` then `git push -u origin main`.
3. In Netlify: **Add new site → Import from GitHub** → select the repo. Netlify reads `netlify.toml` automatically — build command and publish folder are already configured, nothing to set manually.
4. Every future `git push` rebuilds and redeploys automatically, including whenever you add a new city.

## SEO notes

- Every page gets its own `<title>`, meta description, and canonical URL — no duplicate content across cities or page types.
- `LocalBusiness` + `serviceArea` `GeoCircle` schema on Home/Locations/Contact, `Service` schema on individual service pages, `ItemList` schema on Services (and on the global Cities directory), `FAQPage` schema wherever FAQ content lives, `BreadcrumbList` on every subpage.
- Every city page carries `geo.region`/`geo.placename`/`geo.position`/`ICBM` meta tags — local-SEO signals tying the page to a real place and dispatch radius, matching how Google Business Profile treats a service-area business (no public storefront address).
- Cross-city internal linking lives in the shared footer (`renderFooter` in `templates/partials.js`), so every city page — all 5 page types plus every service page — links to at least one other live city and back to the global directory, automatically, with zero manual link-building.
