# CURBSIDE — Multi-City Site

This is a small, zero-dependency site generator. One template, one data file per city — add a city by editing data, not by touching HTML.

## How it's structured

```
data/
  site.json      ← brand name, offer copy, FAQ (shared across every city)
  cities.json    ← one entry per city — THIS is the file you edit to add a city
templates/
  city-page.js   ← the template every city page is built from
  home-page.js   ← the hub page listing all live cities
assets/
  styles.css     ← shared design, used by every page
  main.js        ← shared behavior (form prefill, footer year)
build.js         ← reads the data, writes finished pages into dist/
dist/            ← generated output (not committed — Netlify builds this automatically)
```

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
  "launchNote": "Now serving Madera, CA"
}
```

3. `git add -A && git commit -m "Add Madera" && git push`.
4. Netlify rebuilds automatically. Madera now has its own page at `curbsideauto.com/madera-ca/`, its own SEO title/meta/schema, and shows up as a link on the homepage and on every other live city's page.

**To hold a city back without deleting it** (e.g. you're recruiting providers there but not ready for customers yet), set `"live": false` — the build script skips it, but the entry stays in the file for whenever you flip it on.

**Different phone number per city?** Just give that city's entry a different `phoneDisplay`/`phoneTel` — the template already reads it per-city, nothing else to change.

## Editing shared copy (offers, FAQ, brand name)

Everything that's the same across every city lives in `data/site.json` — the two offer tickets (Roadside/Mechanic and Windshield), their bold promise / value stack / risk reversal, and the FAQ. Edit it once, every city page picks it up on the next build. Use `{cityName}` anywhere in that copy and the build will swap in the real city name automatically (see how the existing entries do it).

## Before going live, still swap:

- Real phone number(s) in `data/cities.json` (currently a placeholder per city).
- Real email in `data/cities.json`.
- Domain in the `canonical` links inside `templates/city-page.js` and `templates/home-page.js` (currently `curbsideauto.com` as a placeholder).

## Local build (to preview before pushing)

Requires Node.js (no other dependencies — nothing to `npm install`):

```
node build.js
```

Then open `dist/index.html` or `dist/visalia-ca/index.html` in a browser to preview.

## Form submissions

The request form on every city page uses **Netlify Forms** (`data-netlify="true"`) — once deployed, submissions land in your Netlify dashboard under Site → Forms, tagged with which city they came from. No backend needed.

## Deploying

**GitHub → Netlify (recommended):**
1. Create an empty repo on GitHub.
2. From this folder: `git remote add origin <your-repo-url>` then `git push -u origin main`.
3. In Netlify: **Add new site → Import from GitHub** → select the repo. Netlify reads `netlify.toml` automatically — build command and publish folder are already configured, nothing to set manually.
4. Every future `git push` rebuilds and redeploys automatically, including whenever you add a new city.

## SEO notes

- Each city page gets its own `<title>`, meta description, canonical URL, and JSON-LD `LocalBusiness` + `FAQPage` schema — Google indexes each city separately, matching the "one page per city" structure from your programmatic SEO notes.
- Live cities automatically cross-link to each other (footer note on the hero of each city page: "Also serving: ...") — this is the internal linking your SEO doc calls for, and it updates itself as you add cities, no manual link-building required.
- The homepage lists every live city and links out to each one.
