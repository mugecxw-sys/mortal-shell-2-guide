/* SEO, internal-navigation and performance pass for the map-fragment guide. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const site = 'https://mortalshell2guide.xyz';
const route = '/collectibles/map-fragments/';
const canonical = `${site}${route}`;
const updated = '2026-09-05';
const title = 'All 11 Map Fragment Locations (Sat Nav) | Mortal Shell 2';
const description = 'Find all 11 Map Fragment locations in Mortal Shell 2 with original annotated routes from named Beacons. Reveal Fainweald and Mammon and unlock Sat Nav.';
const image = `${site}/assets/images/map-fragments/route-02.webp`;
const fragments = [
  ['fainweald-1', 'Map of Fainweald [1]'],
  ['fainweald-2', 'Map of Fainweald [2]'],
  ['fainweald-3', 'Map of Fainweald [3]'],
  ['fainweald-4', 'Map of Fainweald [4]'],
  ['fainweald-5', 'Map of Fainweald [5]'],
  ['mammon-1', 'Map of Mammon [1]'],
  ['mammon-2', 'Map of Mammon [2]'],
  ['mammon-3', 'Map of Mammon [3]'],
  ['mammon-4', 'Map of Mammon [4]'],
  ['mammon-5', 'Map of Mammon [5]'],
  ['mammon-6', 'Map of Mammon [6]'],
];

function replaceMeta(html, selector, value) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(`(<meta\\s+${escaped}\\s+content=")[^"]*(")`, 'i'), `$1${value}$2`);
}

const file = path.join(root, 'collectibles', 'map-fragments', 'index.html');
let html = fs.readFileSync(file, 'utf8');
html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
html = replaceMeta(html, 'name="description"', description);
html = replaceMeta(html, 'property="og:title"', title);
html = replaceMeta(html, 'property="og:description"', description);
html = replaceMeta(html, 'name="twitter:title"', title);
html = replaceMeta(html, 'name="twitter:description"', description);
if (!html.includes('property="og:image:width"')) {
  html = html.replace(
    '<meta property="og:image:alt" content="Annotated route to a Map of Fainweald fragment">',
    '<meta property="og:image:alt" content="Annotated Mortal Shell 2 route to a Map of Fainweald fragment"><meta property="og:image:width" content="1268"><meta property="og:image:height" content="972">',
  );
}
if (!html.includes('name="twitter:image:alt"')) {
  html = html.replace(
    `<meta name="twitter:image" content="${image}">`,
    `<meta name="twitter:image" content="${image}"><meta name="twitter:image:alt" content="Annotated Mortal Shell 2 route to a Map of Fainweald fragment">`,
  );
}

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: title,
      description,
      image,
      datePublished: '2026-09-04',
      dateModified: updated,
      inLanguage: 'en',
      articleSection: 'Collectibles',
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      author: { '@type': 'Organization', name: 'Mortal Shell II Guide', url: `${site}/` },
      publisher: { '@type': 'Organization', name: 'Mortal Shell II Guide', url: `${site}/` },
      about: { '@type': 'VideoGame', name: 'Mortal Shell II' },
    },
    {
      '@type': 'ItemList',
      name: 'All 11 Mortal Shell 2 Map Fragment locations',
      numberOfItems: fragments.length,
      itemListElement: fragments.map(([id, name], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name,
        url: `${canonical}#${id}`,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: 'Collectibles', item: `${site}/collectibles/` },
        { '@type': 'ListItem', position: 3, name: 'Map Fragment Locations', item: canonical },
      ],
    },
  ],
};
html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
html = html.replace(
  /<p class="lede">[\s\S]*?<\/p>/,
  '<p class="lede">There are 11 Map Fragments in Mortal Shell 2: five <span class="item-name">Map of Fainweald</span> pieces and six <span class="item-name">Map of Mammon</span> pieces. Follow each original annotated route from a named Beacon to reveal the full map and unlock <span class="item-name">Sat Nav</span>.</p>',
);

const index = `<nav class="fragment-index" aria-label="Jump to a specific map fragment"><span class="fragment-index-title">Jump to a fragment</span>${fragments.map(([id, name]) => `<a href="#${id}">${name.replace('Map of ', '')}</a>`).join('')}</nav>`;
if (!html.includes('class="fragment-index"')) {
  html = html.replace('<section class="fragment-region" id="fainweald">', `${index}\n\n    <section class="fragment-region" id="fainweald">`);
}
html = html.replace(/Original gameplay capture and route annotations · Last updated: [^<]+/, 'Original gameplay capture and route annotations · Last updated: 5 September 2026');
fs.writeFileSync(file, html);

const cssFile = path.join(root, 'assets', 'map-fragments.css');
let css = fs.readFileSync(cssFile, 'utf8');
css = css.replace('margin:38px 0 58px;', 'margin:38px 0 18px;');
if (!css.includes('.fragment-index{')) {
  css = css.replace(
    '.fragment-nav span{',
    '.fragment-index{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:8px;margin:0 0 58px}.fragment-index-title{grid-column:1/-1;color:var(--muted);font-size:.66rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.fragment-index a{padding:10px 12px;border:1px solid var(--line);background:#151414;color:#d1cbc3;font-size:.72rem;font-weight:700;text-align:center;text-decoration:none}.fragment-index a:hover{border-color:#696662;color:var(--acid)}\n.fragment-nav span{',
  );
}
const mobileIndexRule = '.fragment-index{grid-template-columns:repeat(2,minmax(0,1fr))}';
css = css.replace(new RegExp(`(?:${mobileIndexRule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})+`, 'g'), mobileIndexRule);
if (!css.includes(`@media(max-width:760px){.fragment-nav{grid-template-columns:1fr}${mobileIndexRule}`)) {
  css = css.replace('@media(max-width:760px){.fragment-nav{grid-template-columns:1fr}', `@media(max-width:760px){.fragment-nav{grid-template-columns:1fr}${mobileIndexRule}`);
}
fs.writeFileSync(cssFile, css);

const homeFile = path.join(root, 'index.html');
let home = fs.readFileSync(homeFile, 'utf8');
home = home.replace(
  /<section class="notice" aria-label="Guide status">[\s\S]*?<\/section>/,
  '<section class="notice" aria-label="Latest guide"><span class="status-dot"></span><p><strong>New: complete Upgrade Materials &amp; Tarforge guide.</strong> See all five materials, every +1 to +25 cost, 185,650 Coin total, vendor stock and all five Tarforge unlock routes. <a href="guides/upgrade-materials/">Open the upgrade planner →</a></p></section>',
);
fs.writeFileSync(homeFile, home);

const sitemapFile = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapFile, 'utf8');
const escapedCanonical = canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
sitemap = sitemap.replace(
  new RegExp(`<url><loc>${escapedCanonical}<\\/loc>(?:<lastmod>[^<]+<\\/lastmod>)?<\\/url>`),
  `<url><loc>${canonical}</loc><lastmod>${updated}</lastmod></url>`,
);
fs.writeFileSync(sitemapFile, sitemap);
