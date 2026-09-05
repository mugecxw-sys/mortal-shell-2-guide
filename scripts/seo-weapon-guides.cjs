/* SEO and performance pass for the primary-weapon acquisition cluster. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const site = 'https://mortalshell2guide.xyz';
const updated = '2026-08-29';
const weapons = [
  {
    slug: 'the-iconoclast', name: 'The Iconoclast', region: 'Prologue',
    title: 'How to Unlock The Iconoclast | Mortal Shell 2',
    description: 'Unlock The Iconoclast in Mortal Shell 2 by completing the Prologue. See its automatic unlock condition, verified base damage and upgrade cap.',
    image: '/assets/icons/weapons/the-iconoclast.webp',
  },
  {
    slug: 'axe-dagger', name: 'Axe & Dagger', region: 'Fainweald',
    description: 'Find Axe & Dagger in Mortal Shell 2 with an original annotated route from Mushroom Village Beacon to the weapon pickup and unlock.',
  },
  {
    slug: 'veterans-battle-axe', name: "Veteran's Battle Axe", region: 'Fainweald',
    title: "Veteran's Battle Axe Location Guide | Mortal Shell 2",
    description: "Find Veteran's Battle Axe in Mortal Shell 2 with an original annotated route from Blackridge Pass Beacon to the weapon pickup.",
  },
  {
    slug: 'great-martyrs-blade', name: "Great Martyr's Blade", region: 'Fainweald',
    title: "Great Martyr's Blade Location Guide | Mortal Shell 2",
    description: "Find Great Martyr's Blade in Mortal Shell 2 with an original annotated route from Gloomshade Grove Beacon through Martyr's Prison.",
  },
  {
    slug: 'obsidian-hammer', name: 'Obsidian Hammer', region: 'Mammon',
    description: 'Find Obsidian Hammer in Mortal Shell 2 with an original annotated route from Outskirts of Mammon Beacon to the weapon pickup.',
  },
  {
    slug: 'axatana', name: 'Axatana', region: 'Mammon',
    description: "Find Axatana in Mortal Shell 2 with an original annotated route from Sester's Gate Beacon to the weapon pickup and unlock.",
  },
  {
    slug: 'black-needle', name: 'Black Needle', region: 'Mammon',
    description: "Find Black Needle in Mortal Shell 2 with an original annotated route from Sester's Gate Beacon to the weapon pickup and unlock.",
  },
  {
    slug: 'clockwork-scythe', name: 'Clockwork Scythe', region: 'Mammon',
    description: 'Find Clockwork Scythe in Mortal Shell 2 with an original annotated route from The Silent Steps Beacon to the weapon pickup.',
  },
].map((weapon) => ({
  ...weapon,
  title: weapon.title || `${weapon.name} Location & Unlock Route | Mortal Shell 2`,
  image: weapon.image || `/assets/images/weapon-guides/${weapon.slug}/route-01.webp`,
}));

function webpSize(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') return null;
  const type = buffer.toString('ascii', 12, 16);
  if (type === 'VP8X') return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
  if (type === 'VP8 ') return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  if (type === 'VP8L') {
    const bits = buffer.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  return null;
}

function replaceMeta(html, selector, value) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(`(<meta\\s+${escaped}\\s+content=")[^"]*(")`, 'i'), `$1${value}$2`);
}

function addImageDimensions(html, file) {
  return html.replace(/<img\s+([^>]*src="([^"]+\.webp)"[^>]*)>/gi, (match, attrs, src) => {
    if (/^https?:/i.test(src)) return match;
    const absolute = path.resolve(path.dirname(file), src.replaceAll('/', path.sep));
    const size = fs.existsSync(absolute) ? webpSize(absolute) : null;
    let next = attrs.replace(/\s+width="\d+"|\s+height="\d+"/g, '');
    if (size) next += ` width="${size.width}" height="${size.height}"`;
    if (!/\sdecoding=/.test(next)) next += ' decoding="async"';
    if (/loading="eager"/.test(next) && !/\sfetchpriority=/.test(next)) next += ' fetchpriority="high"';
    return `<img ${next}>`;
  });
}

for (let index = 0; index < weapons.length; index += 1) {
  const weapon = weapons[index];
  const file = path.join(root, 'collectibles', 'weapons', weapon.slug, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const canonical = `${site}/collectibles/weapons/${weapon.slug}/`;
  const image = `${site}${weapon.image}`;

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${weapon.title.replace('&', '&amp;')}</title>`);
  html = replaceMeta(html, 'name="description"', weapon.description);
  html = replaceMeta(html, 'property="og:title"', weapon.title.replace('&', '&amp;'));
  html = replaceMeta(html, 'property="og:description"', weapon.description);
  if (!html.includes('property="og:image"')) {
    const social = `<meta property="og:image" content="${image}"><meta property="og:image:alt" content="${weapon.name} unlock route in Mortal Shell 2"><meta name="twitter:title" content="${weapon.title.replace('&', '&amp;')}"><meta name="twitter:description" content="${weapon.description}"><meta name="twitter:image" content="${image}">`;
    html = html.replace('</title>', `</title>${social}`);
  }

  const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: weapon.title,
          description: weapon.description,
          image,
          dateModified: updated,
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
          author: { '@type': 'Organization', name: 'Mortal Shell II Guide', url: `${site}/` },
          publisher: { '@type': 'Organization', name: 'Mortal Shell II Guide', url: `${site}/` },
          about: { '@type': 'VideoGame', name: 'Mortal Shell II' },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
            { '@type': 'ListItem', position: 2, name: 'Primary Weapon Locations', item: `${site}/collectibles/weapons/` },
            { '@type': 'ListItem', position: 3, name: `${weapon.name} Location`, item: canonical },
          ],
        },
      ],
    };
  const schemaTag = `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  if (html.includes('"@type":"Article"')) {
    html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (tag, json) => json.includes('"@type":"Article"') ? schemaTag : tag);
  } else {
    html = html.replace('</head>', `${schemaTag}</head>`);
  }

  html = addImageDimensions(html, file);
  if (!html.includes('class="article-related"')) {
    const previous = weapons[index - 1];
    const next = weapons[index + 1];
    const links = [
      '<a href="../">All weapon locations</a>',
      previous ? `<a href="../${previous.slug}/">Previous: ${previous.name}</a>` : '',
      next ? `<a href="../${next.slug}/">Next: ${next.name}</a>` : '',
    ].filter(Boolean).join('');
    html = html.replace('<footer class="article-footer">', `<nav class="article-related" aria-label="Weapon guide navigation">${links}</nav><footer class="article-footer">`);
  }

  if (weapon.slug === 'great-martyrs-blade' && !html.includes('best-early-weapons/')) {
    html = html.replace('<aside class="route-guide-note">', '<aside class="route-guide-note"><p><strong>Early-game recommendation:</strong> See why this is <a href="../best-early-weapons/">our best early weapon pick</a>, including its tradeoffs and automatic-unlock alternative.</p></aside><aside class="route-guide-note">');
  }
  fs.writeFileSync(file, html);
}

const hubFile = path.join(root, 'collectibles', 'weapons', 'index.html');
let hub = fs.readFileSync(hubFile, 'utf8');
const hubTitle = 'All Weapon Locations & Unlock Routes | Mortal Shell 2';
const hubDescription = 'Find all eight primary weapons in Mortal Shell 2 with original annotated routes, starting Beacons, unlock steps, base damage and upgrade data.';
hub = hub.replace(/<title>[^<]*<\/title>/i, `<title>${hubTitle}</title>`);
hub = replaceMeta(hub, 'name="description"', hubDescription);
hub = replaceMeta(hub, 'property="og:title"', hubTitle);
hub = replaceMeta(hub, 'property="og:description"', hubDescription);
hub = hub.replace('<h1>Primary weapons</h1>', '<h1>All Primary Weapon Locations</h1>');
hub = hub.replace(/<p class="lede">[\s\S]*?<\/p>/, '<p class="lede">Find all eight Tarforge-upgradeable primary weapons. Seven pages use original annotated acquisition routes; The Iconoclast has a separate automatic-unlock guide.</p>');
hub = hub.replace(/<p class="reference-alert">[\s\S]*?<\/p>/, '<p class="reference-alert"><strong>All unlock guides live:</strong> every primary weapon now has a dedicated location or unlock page. Want one practical first target? Read why <a href="best-early-weapons/">Great Martyr\'s Blade is our early-game pick</a>.</p>');
hub = hub.replace('Get the <a href="the-iconoclast/">annotated The Iconoclast route</a>.', 'Read the <a href="the-iconoclast/">The Iconoclast automatic-unlock guide</a>.');
hub = hub.replace(/<p class="source-line">[\s\S]*?<\/p>/, '<p class="source-line">Original acquisition routes and gameplay captures last reviewed 29 August 2026. Base damage, item text and attack-kit structure use the supplied game data. Recorded upgrade-level values are a data snapshot, not a statement of the final enhancement cap.</p>');
hub = hub.replace(/<nav id="site-nav">/, '<nav id="site-nav" aria-label="Main navigation">');
const hubImage = `${site}/assets/images/weapon-guides/great-martyrs-blade/route-11.webp`;
if (!hub.includes('property="og:image"')) {
  hub = hub.replace('</title>', `</title><meta property="og:image" content="${hubImage}"><meta property="og:image:alt" content="Primary weapon pickup in Mortal Shell 2"><meta name="twitter:title" content="${hubTitle}"><meta name="twitter:description" content="${hubDescription}"><meta name="twitter:image" content="${hubImage}">`);
}
if (!hub.includes('"@type":"ItemList"')) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Mortal Shell 2 Primary Weapon Locations',
        description: hubDescription,
        url: `${site}/collectibles/weapons/`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: weapons.length,
          itemListElement: weapons.map((weapon, index) => ({
            '@type': 'ListItem', position: index + 1, name: `${weapon.name} location and unlock guide`, url: `${site}/collectibles/weapons/${weapon.slug}/`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
          { '@type': 'ListItem', position: 2, name: 'Primary Weapon Locations', item: `${site}/collectibles/weapons/` },
        ],
      },
    ],
  };
  hub = hub.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);
}
hub = addImageDimensions(hub, hubFile);
fs.writeFileSync(hubFile, hub);

const bestFile = path.join(root, 'collectibles', 'weapons', 'best-early-weapons', 'index.html');
let best = fs.readFileSync(bestFile, 'utf8');
best = addImageDimensions(best, bestFile);
fs.writeFileSync(bestFile, best);

const homeFile = path.join(root, 'index.html');
let home = fs.readFileSync(homeFile, 'utf8');
home = home.replace(/<section class="notice" aria-label="Guide status">[\s\S]*?<\/section>/, '<section class="notice" aria-label="Guide status"><span class="status-dot"></span><p><strong>All Shell and primary weapon routes live:</strong> original gameplay captures now cover every selectable Shell and every non-automatic primary weapon. <a href="collectibles/weapons/">Browse all weapon locations.</a></p></section>');
fs.writeFileSync(homeFile, home);

const sitemapFile = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapFile, 'utf8');
const routes = ['/collectibles/weapons/', ...weapons.map((weapon) => `/collectibles/weapons/${weapon.slug}/`), '/collectibles/weapons/best-early-weapons/'];
for (const route of routes) {
  const loc = `${site}${route}`;
  const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<url><loc>${escaped}<\\/loc>(?:<lastmod>[^<]+<\\/lastmod>)?<\\/url>`);
  const entry = `<url><loc>${loc}</loc><lastmod>${updated}</lastmod></url>`;
  if (pattern.test(sitemap)) sitemap = sitemap.replace(pattern, entry);
  else sitemap = sitemap.replace('</urlset>', `  ${entry}\n</urlset>`);
}
fs.writeFileSync(sitemapFile, sitemap);
