const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const page = read('collectibles/tarstones/locations/index.html');
const tracker = read('assets/tarstone-locations.js');
const catalog = read('collectibles/tarstones/index.html');
const hub = read('collectibles/index.html');
const achievements = read('achievements/index.html');
const missables = read('guides/missable-trophies/index.html');
const sitemap = read('sitemap.xml');
const mapScript = read('assets/map.js');
const home = read('index.html');

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const cards = [...page.matchAll(/<article class="location-card" id="([^"]+)"/g)].map((m) => m[1]);
const boxes = [...page.matchAll(/data-stone="([^"]+)"/g)].map((m) => m[1]);
assert(cards.length === 75, `Expected 75 cards, found ${cards.length}`);
assert(boxes.length === 75, `Expected 75 checkboxes, found ${boxes.length}`);
assert(new Set(cards).size === 75, 'Location card IDs are not unique');
assert(cards.every((id, index) => id === boxes[index]), 'Card and checkbox IDs do not match');

for (const match of page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
  const parsed = JSON.parse(match[1]);
  const graph = parsed['@graph'] || [];
  const types = graph.map((entry) => entry['@type']);
  for (const type of ['Article', 'ItemList', 'FAQPage', 'BreadcrumbList']) assert(types.includes(type), `${type} schema is missing`);
  const list = graph.find((entry) => entry['@type'] === 'ItemList');
  assert(list?.numberOfItems === 75 && list?.itemListElement?.length === 75, 'ItemList must contain 75 routes');
}
assert(page.includes('<link rel="canonical" href="https://mortalshell2guide.xyz/collectibles/tarstones/locations/">'), 'Canonical is missing');
const title = (page.match(/<title>([^<]+)<\/title>/)?.[1] || '').replace(/&amp;/g, '&');
const description = page.match(/<meta name="description" content="([^"]+)"/)?.[1] || '';
assert(title.length >= 30 && title.length <= 60 && title.includes('All 75 Tarstone Locations') && title.includes('Mortal Shell 2'), `SEO title is invalid: ${title.length} chars`);
assert(description.length >= 120 && description.length <= 165, `Meta description is invalid: ${description.length} chars`);
assert((page.match(/<h1\b/g) || []).length === 1, 'Page must contain exactly one H1');
assert(page.includes('property="og:image:alt"') && page.includes('name="twitter:image"') && page.includes('name="twitter:description"'), 'Social card metadata is incomplete');
assert(page.includes('property="article:modified_time" content="2026-09-07"'), 'Article modified date is stale');
assert(page.includes('aria-label="Breadcrumb"') && page.includes('aria-current="page"'), 'Visible breadcrumb is missing');
assert(page.includes('/maps/?filter=tarstones'), 'Filtered map entry is missing');
assert(page.includes('/collectibles/tarstones/'), 'Effects database backlink is missing');
assert(catalog.includes('/collectibles/tarstones/locations/'), 'Catalog forward link is missing');
assert(hub.includes('href="tarstones/locations/"'), 'Collectibles hub link is missing');
assert(achievements.includes('/collectibles/tarstones/locations/'), 'Achievement link is missing');
assert(missables.includes("Berserker's Stone") && missables.includes('Week 1 update fixed'), 'Legacy Berserker note is missing');
assert(home.includes('href="collectibles/tarstones/locations/"'), 'Homepage Tarstone feature link is missing');
assert((sitemap.match(/https:\/\/mortalshell2guide\.xyz\/collectibles\/tarstones\/locations\//g) || []).length === 1, 'Sitemap URL is missing or duplicated');
assert(sitemap.includes('<loc>https://mortalshell2guide.xyz/collectibles/tarstones/locations/</loc><lastmod>2026-09-07</lastmod>'), 'Sitemap lastmod is stale');
assert(mapScript.includes('URLSearchParams') && mapScript.includes("get('filter')"), 'Map query filter support is missing');

for (const required of ['ms2-tarstone-locations-v1', 'localStorage', 'stoned-progress', 'missing-toggle', 'reset-progress', 'location-search']) {
  assert(tracker.includes(required), `Tracker behavior missing: ${required}`);
}

for (const match of page.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) {
  assert(fs.existsSync(path.join(root, match[1])), `Missing local asset: ${match[1]}`);
}

for (const match of page.matchAll(/href="#([^"]+)"/g)) {
  assert(page.includes(`id="${match[1]}"`), `Missing in-page target: #${match[1]}`);
}

assert(!page.includes('The Collector\'s five purchases'), 'Obsolete Collector copy remains');
console.log('Tarstone locations validation passed: 75 unique routes, structured data, assets, links, map filter, and tracker hooks.');
