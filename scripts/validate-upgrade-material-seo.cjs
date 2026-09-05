const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = function (relative) { return fs.readFileSync(path.join(root, relative), 'utf8'); };
const page = read('guides/upgrade-materials/index.html');
const canonical = 'https://mortalshell2guide.xyz/guides/upgrade-materials/';
const expectedTitle = 'Mortal Shell 2 Upgrade Materials Guide &amp; Tarforge Costs';
const failures = [];
const check = function (condition, message) { if (!condition) failures.push(message); };
const count = function (source, pattern) { return (source.match(pattern) || []).length; };

check(page.includes('<title>' + expectedTitle + '</title>'), 'Title is missing or changed');
const description = page.match(/<meta name="description" content="([^"]+)">/)?.[1] || '';
check(description.length >= 120 && description.length <= 165, 'Meta description must be 120-165 characters; found ' + description.length);
check(page.includes('<link rel="canonical" href="' + canonical + '">'), 'Canonical is missing');
check(count(page, /property="og:image"/g) === 1, 'Expected exactly one og:image');
check(count(page, /name="twitter:image"/g) === 1, 'Expected exactly one twitter:image');
check(page.includes('/assets/icons/materials/ossinite.webp'), 'Social image must use the Ossinite icon');

const schemaText = page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
let schema;
try { schema = JSON.parse(schemaText); } catch (error) { failures.push('JSON-LD does not parse: ' + error.message); }
if (schema) {
  const graph = schema['@graph'] || [];
  const types = graph.map(function (item) { return item['@type']; });
  check(types.includes('Article'), 'Article schema is missing');
  check(types.includes('BreadcrumbList'), 'BreadcrumbList schema is missing');
  check(types.includes('ItemList'), 'ItemList schema is missing');
  const itemList = graph.find(function (item) { return item['@type'] === 'ItemList'; });
  check(itemList && itemList.numberOfItems === 5, 'ItemList must report five materials');
  check(itemList && itemList.itemListElement.length === 5, 'ItemList must contain five entries');
  const breadcrumbs = graph.find(function (item) { return item['@type'] === 'BreadcrumbList'; });
  check(breadcrumbs && breadcrumbs.itemListElement.length === 2, 'BreadcrumbList must contain Home and the current guide');
}

for (const anchor of ['quick-answer', 'costs', 'acquisition', 'unlock', 'spending', 'sources']) {
  check(page.includes('href="#' + anchor + '"'), 'Jump navigation is missing #' + anchor);
  check(page.includes('id="' + anchor + '"'), 'Section is missing id="' + anchor + '"');
}
for (const material of ['ventrium', 'laterite', 'dorsalite', 'thoracium', 'ossinite']) {
  check(page.includes('id="' + material + '"'), 'Material anchor is missing: ' + material);
}
for (const unlock of ['muradean-actuator', 'obsidian-lathe', 'etching-needles', 'foundry-stone', 'endless-core']) {
  check(page.includes('id="' + unlock + '"'), 'Tarforge unlock route is missing: ' + unlock);
}
check(page.includes('31 of each material. 185,650 Coin.'), 'Quick-answer total is missing');
check(count(page, /<tr><th scope="row">\+\d+/g) === 25, 'Detailed table must contain 25 upgrade levels');

for (const relative of ['collectibles/weapons/index.html', 'collectibles/sidearms/index.html']) {
  const source = read(relative);
  check(count(source, /class="content-note upgrade-guide-link"/g) === 1, relative + ' must contain exactly one featured upgrade link');
}
check(read('collectibles/tarstones/index.html').includes('/guides/upgrade-materials/#unlock'), 'Tarstones page does not link to the Tarforge section');
check(read('achievements/index.html').includes('../guides/upgrade-materials/'), 'Over 9000 does not link to the upgrade guide');
check(read('index.html').includes('href="guides/upgrade-materials/"'), 'Homepage recommendation is missing');
check(count(page, /href="\/achievements\/#achievement-over-9000"/g) === 1, 'Related links must contain exactly one Over 9000 link');
const sitemap = read('sitemap.xml');
check(count(sitemap, /https:\/\/mortalshell2guide\.xyz\/guides\/upgrade-materials\//g) === 1, 'Sitemap must contain the canonical exactly once');
check(sitemap.includes(canonical + '</loc><lastmod>2026-09-05</lastmod>'), 'Sitemap lastmod is not current');

if (failures.length) {
  console.error(failures.map(function (failure) { return '- ' + failure; }).join('\n'));
  process.exit(1);
}
console.log('Upgrade-material SEO validation passed: metadata, schema, 25 costs, five materials, five unlocks and internal links.');
