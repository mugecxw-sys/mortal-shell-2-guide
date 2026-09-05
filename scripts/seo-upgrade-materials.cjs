/* SEO, source-verification and internal-link pass for the upgrade materials guide. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const site = 'https://mortalshell2guide.xyz';
const route = '/guides/upgrade-materials/';
const canonical = site + route;
const updated = '2026-09-05';
const title = 'Mortal Shell 2 Upgrade Materials Guide & Tarforge Costs';
const titleHtml = title.replace('&', '&amp;');
const description = 'All five Mortal Shell 2 upgrade materials, +1 to +25 Tarforge costs, 185,650 Coin total, vendor stock and every Tarforge unlock location.';
const socialImage = site + '/assets/icons/materials/ossinite.webp';
const materials = [
  { name: 'Ventrium', slug: 'ventrium', levels: '+1 to +5', quantity: 31, coin: 3150, stock: 'Merchant ×15 at 250 Coin each' },
  { name: 'Laterite', slug: 'laterite', levels: '+6 to +10', quantity: 31, coin: 17500, stock: 'Merchant ×10; Brigand ×3 at 650 Coin each' },
  { name: 'Dorsalite', slug: 'dorsalite', levels: '+11 to +15', quantity: 31, coin: 36250, stock: 'Merchant ×5; Brigand ×1 at 1,200 Coin each' },
  { name: 'Thoracium', slug: 'thoracium', levels: '+16 to +20', quantity: 31, coin: 55000, stock: 'Merchant ×3; The Collector ×2 at 2,500 Coin each' },
  { name: 'Ossinite', slug: 'ossinite', levels: '+21 to +25', quantity: 31, coin: 73750, stock: 'No vendor stock verified' },
];

const pageFile = path.join(root, 'guides', 'upgrade-materials', 'index.html');
let html = fs.readFileSync(pageFile, 'utf8');

function replaceMeta(source, selector, value) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return source.replace(new RegExp('(<meta\\s+' + escaped + '\\s+content=")[^"]*(")', 'i'), '$1' + value + '$2');
}

html = html.replace(/<title>[^<]*<\/title>/i, '<title>' + titleHtml + '</title>');
html = replaceMeta(html, 'name="description"', description);
html = replaceMeta(html, 'property="og:title"', titleHtml);
html = replaceMeta(html, 'property="og:description"', description);
html = replaceMeta(html, 'name="twitter:card"', 'summary');

const socialMeta = [
  '<meta property="og:site_name" content="Mortal Shell II Guide">',
  '<meta property="og:image" content="' + socialImage + '">',
  '<meta property="og:image:alt" content="Ossinite upgrade material icon from Mortal Shell II">',
  '<meta property="og:image:width" content="512">',
  '<meta property="og:image:height" content="512">',
  '<meta property="article:published_time" content="2026-09-05">',
  '<meta property="article:modified_time" content="' + updated + '">',
  '<meta name="twitter:title" content="' + titleHtml + '">',
  '<meta name="twitter:description" content="' + description + '">',
  '<meta name="twitter:image" content="' + socialImage + '">',
  '<meta name="twitter:image:alt" content="Ossinite upgrade material icon from Mortal Shell II">',
].join('');
html = html.replace(/<meta property="og:site_name"[\s\S]*?<meta name="twitter:image:alt"[^>]*>/, '');
html = html.replace('<link rel="icon"', socialMeta + '<link rel="icon"');

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': canonical + '#article',
      headline: title,
      description,
      url: canonical,
      mainEntityOfPage: canonical,
      image: { '@type': 'ImageObject', url: socialImage, width: 512, height: 512 },
      datePublished: '2026-09-05',
      dateModified: updated,
      inLanguage: 'en',
      author: { '@type': 'Organization', name: 'Mortal Shell II Guide', url: site + '/' },
      publisher: { '@type': 'Organization', name: 'Mortal Shell II Guide', url: site + '/' },
      about: { '@type': 'VideoGame', name: 'Mortal Shell II' },
      mainEntity: { '@id': canonical + '#material-list' },
    },
    {
      '@type': 'ItemList',
      '@id': canonical + '#material-list',
      name: 'Mortal Shell 2 upgrade materials',
      numberOfItems: materials.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: materials.map(function (material, index) {
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: material.name,
          description: material.levels + ': 31 total material and ' + material.coin.toLocaleString('en-US') + ' Coin in Tarforge fees.',
          url: canonical + '#' + material.slug,
        };
      }),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site + '/' },
        { '@type': 'ListItem', position: 2, name: 'Upgrade Materials and Tarforge Costs', item: canonical },
      ],
    },
  ],
};
const schemaTag = '<script type="application/ld+json">' + JSON.stringify(schema) + '</script>';
if (html.includes('type="application/ld+json"')) {
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, schemaTag);
} else {
  html = html.replace('</head>', schemaTag + '</head>');
}

html = html.replace(
  /<nav class="upgrade-jumps"[\s\S]*?<\/nav>/,
  '<nav class="upgrade-jumps" aria-label="On this page"><a href="#quick-answer">Quick answer</a><a href="#costs">+1 to +25 costs</a><a href="#acquisition">Where to get materials</a><a href="#unlock">All 5 Tarforge upgrades</a><a href="#spending">Spending order</a><a href="#sources">Sources</a></nav>',
);
html = html.replace('<aside class="upgrade-answer">', '<aside class="upgrade-answer" id="quick-answer">');

html = html.replace(/<tr><th scope="row"><a class="material-label" href="https:\/\/mortalshelldb\.com\/items\/([a-z]+)">/g, '<tr id="$1"><th scope="row"><a class="material-label" href="https://mortalshelldb.com/items/$1">');

const acquisitionRows = materials.map(function (material) {
  const records = { Ventrium: 105, Laterite: 111, Dorsalite: 68, Thoracium: 9, Ossinite: 4 }[material.name];
  return '<tr><th scope="row"><a href="https://mortalshelldb.com/items/' + material.slug + '">' + material.name + '</a></th><td>' + records + '</td><td>' + material.stock + '</td></tr>';
}).join('');
const acquisition = '<section id="acquisition"><h2>Where to get upgrade materials</h2><p>Use fixed pickups and finite vendor stock to finish a tier. The Merchant material shelf opens once you hold at least 16 Ova; shop availability still depends on your route and current game state.</p><div class="upgrade-table" role="region" aria-label="Material map records and finite stock" tabindex="0"><table><thead><tr><th scope="col">Material</th><th scope="col">Fixed map records¹</th><th scope="col">Verified vendor stock²</th></tr></thead><tbody>' + acquisitionRows + '</tbody></table></div><p class="upgrade-source">¹ Fixed record counts from <a href="https://probonk.com/mortal-shell-2/map/fallgrim">Probonk’s Mortal Shell 2 map</a>, checked 5 September 2026. These are records in that map dataset, not a guaranteed per-playthrough limit.</p><p class="upgrade-source">² Vendor prices and stock were checked against the individual <a href="https://mortalshelldb.com/items/ventrium">Ventrium</a>, <a href="https://mortalshelldb.com/items/laterite">Laterite</a>, <a href="https://mortalshelldb.com/items/dorsalite">Dorsalite</a>, <a href="https://mortalshelldb.com/items/thoracium">Thoracium</a> and <a href="https://mortalshelldb.com/items/ossinite">Ossinite</a> database entries. Brigand stock is labelled “Steal Items”; do not treat it as an ordinary shop purchase.</p><p>Ventrium and Dorsalite can also appear in specific Surprise Eggs. Patch changes and one-off rewards mean the map-record count alone cannot prove the total supply. No reliable Ossinite vendor stock is listed in the checked references.</p><a class="upgrade-button" href="/maps/?filter=materials">View material locations on our map →</a><p class="upgrade-source">Our Upgrade Materials map layer is still being expanded.</p></section>';
html = html.replace(/<section id="acquisition">[\s\S]*?<\/section>/, acquisition);

const unlock = '<section id="unlock"><h2>All 5 Tarforge upgrades and locations</h2><p>The Tarforge is in Marrow Keep. Give the first four tools to Franz; install the Endless Core through the Tarforge menu. The route summaries below were cross-checked against two independent location guides and the item database.</p><div class="upgrade-unlocks"><article id="muradean-actuator"><p class="eyebrow">Primary weapons · Prologue</p><h3>Muradean Actuator</h3><p>Inside the Village Outskirts Beacon cleanse dungeon in Disciple’s Path. Open the chest before the elevator section, then bring the Actuator to Franz to enable primary-weapon enhancement. If you skip the Prologue, the item database says you begin with one.</p><a href="https://mortalshelldb.com/items/muradean-actuator">Item reference →</a></article><article id="obsidian-lathe"><p class="eyebrow">Sidearms · Fainweald</p><h3>Obsidian Lathe</h3><p>From Widow’s Overlook, travel southeast to Martyr’s Tomb. Clear the dungeon to its final room and open the priest-guarded chest beside the sarcophagus. Bring the Lathe to Franz to enable sidearm enhancement.</p><a href="https://mortalshelldb.com/items/obsidian-lathe">Item reference →</a></article><article id="etching-needles"><p class="eyebrow">Tarstones · Glutted Mire</p><h3>Etching Needles</h3><p>From Sunken Village, continue through the Glutted Mire beyond the Tarblighted Shepherd. Cross the wooden route toward Ruk; the chest below him, before the Magdalena encounter, contains the Needles. Give them to Franz to unlock Tarstone tempering.</p><a href="https://mortalshelldb.com/items/etching-needles">Item reference →</a></article><article id="foundry-stone"><p class="eyebrow">Smelting · Mammon</p><h3>Foundry Stone</h3><p>Start at Outskirts of Mammon Beacon and head south down the battlefield toward the castle-wall fortifications. Open the chest near the enemies by the wall, then return the Stone to Franz to unlock equipment smelting.</p><a href="https://mortalshelldb.com/items/foundry-stone">Item reference →</a></article><article id="endless-core"><p class="eyebrow">Level cap · The Unfound Path</p><h3>Endless Core</h3><p>Enter the Hidden Nave Beacon cleanse dungeon. Reach the second bonfire, double back for the torch at the first bonfire, then carry it into the fog and follow the revealed route to the chest at the bottom. Install the Core at the Tarforge to remove the weapon and sidearm level cap.</p><a href="https://mortalshelldb.com/items/endless-core">Item reference →</a></article></div><p class="upgrade-source">The five routes were cross-checked on 5 September 2026 against <a href="https://allthings.how/mortal-shell-2-every-tarforge-upgrade-location/">AllThings.How</a> and <a href="https://gamerpillar.com/all-5-tarforge-upgrade-locations-mortal-shell-2/">Gamerpillar</a>. Exact route wording here is original and condensed for navigation.</p></section>';
html = html.replace(/<section id="unlock">[\s\S]*?<\/section>/, unlock);

const sources = '<section id="sources" class="upgrade-sources"><h2>Sources and version notes</h2><p>Upgrade costs, tier boundaries, item functions and vendor snapshots are patch-sensitive. This guide was checked on 5 September 2026 against the in-game-text database entries linked above, independent Tarforge location guides and the mapped pickup dataset. If a later patch changes a cost, trust the current Tarforge menu and send us the changed level.</p><ul><li><a href="https://mortalshelldb.com/items/ventrium">Mortal Shell II Database: material tier and cost records</a></li><li><a href="https://allthings.how/mortal-shell-2-every-tarforge-upgrade-location/">AllThings.How: all five Tarforge upgrade locations</a></li><li><a href="https://gamerpillar.com/all-5-tarforge-upgrade-locations-mortal-shell-2/">Gamerpillar: independent route cross-check</a></li></ul></section>';
if (!html.includes('id="sources"')) html = html.replace('<section class="upgrade-related">', sources + '<section class="upgrade-related">');
html = html.replace('<section class="upgrade-related"><h2>Choose your equipment</h2>', '<section class="upgrade-related"><h2>Continue building your loadout</h2>');
if (!html.includes('href="/achievements/#achievement-over-9000"')) {
  html = html.replace('</section>\n</main>', '<a href="/achievements/#achievement-over-9000">Over 9000 achievement requirement →</a></section>\n</main>');
}

fs.writeFileSync(pageFile, html);

const hubLink = '<p class="content-note upgrade-guide-link"><a href="/guides/upgrade-materials/">Upgrade Materials &amp; Tarforge Costs</a> — Check every +1 to +25 fee, vendor stock and all five Tarforge unlock locations.</p>';
for (const relative of ['collectibles/weapons/index.html', 'collectibles/sidearms/index.html']) {
  const file = path.join(root, relative);
  let source = fs.readFileSync(file, 'utf8');
  source = source.replace(/<p class="content-note upgrade-guide-link">[\s\S]*?<\/p>/g, '');
  source = source.replace('</main>', hubLink + '</main>');
  fs.writeFileSync(file, source);
}

const tarstoneFile = path.join(root, 'collectibles', 'tarstones', 'index.html');
let tarstones = fs.readFileSync(tarstoneFile, 'utf8');
if (!tarstones.includes('/guides/upgrade-materials/')) {
  tarstones = tarstones.replace('<a href="/achievements/">Achievement checklist</a>', '<a href="/achievements/">Achievement checklist</a> · <a href="/guides/upgrade-materials/#unlock">Tarforge unlocks &amp; material costs</a>');
}
fs.writeFileSync(tarstoneFile, tarstones);

const achievementsFile = path.join(root, 'achievements', 'index.html');
let achievements = fs.readFileSync(achievementsFile, 'utf8');
achievements = achievements.replace(/(<article class="achievement-card" id="achievement-over-9000">[\s\S]*?<p>)([\s\S]*?)(<\/p>)(?:<a class="achievement-guide-link"[\s\S]*?<\/a>)?/, '$1Upgrade any primary weapon to the Tarforge maximum.$3<a class="achievement-guide-link" href="../guides/upgrade-materials/">Plan the full material and Coin cost →</a>');
fs.writeFileSync(achievementsFile, achievements);

const homeFile = path.join(root, 'index.html');
let home = fs.readFileSync(homeFile, 'utf8');
home = home.replace(/<section class="notice" aria-label="Guide status">[\s\S]*?<\/section>/, '<section class="notice" aria-label="Latest guide"><span class="status-dot"></span><p><strong>New: complete Upgrade Materials &amp; Tarforge guide.</strong> See all five materials, every +1 to +25 cost, 185,650 Coin total, vendor stock and all five Tarforge unlock routes. <a href="guides/upgrade-materials/">Open the upgrade planner →</a></p></section>');
fs.writeFileSync(homeFile, home);

const sitemapFile = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapFile, 'utf8');
const escapedCanonical = canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
sitemap = sitemap.replace(new RegExp('<url><loc>' + escapedCanonical + '<\\/loc>(?:<lastmod>[^<]+<\\/lastmod>)?<\\/url>'), '<url><loc>' + canonical + '</loc><lastmod>' + updated + '</lastmod></url>');
fs.writeFileSync(sitemapFile, sitemap);

console.log('Optimized upgrade materials SEO: schema, five unlock routes, social metadata and internal links.');
