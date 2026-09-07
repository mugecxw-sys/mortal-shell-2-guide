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
  JSON.parse(match[1]);
}
assert(page.includes('<link rel="canonical" href="https://mortalshell2guide.xyz/collectibles/tarstones/locations/">'), 'Canonical is missing');
assert(page.includes('/maps/?filter=tarstones'), 'Filtered map entry is missing');
assert(page.includes('/collectibles/tarstones/'), 'Effects database backlink is missing');
assert(catalog.includes('/collectibles/tarstones/locations/'), 'Catalog forward link is missing');
assert(hub.includes('href="tarstones/locations/"'), 'Collectibles hub link is missing');
assert(achievements.includes('/collectibles/tarstones/locations/'), 'Achievement link is missing');
assert(missables.includes("Berserker's Stone") && missables.includes('Week 1 update fixed'), 'Legacy Berserker note is missing');
assert((sitemap.match(/https:\/\/mortalshell2guide\.xyz\/collectibles\/tarstones\/locations\//g) || []).length === 1, 'Sitemap URL is missing or duplicated');
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
