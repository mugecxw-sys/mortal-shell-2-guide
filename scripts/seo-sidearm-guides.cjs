/* SEO and performance pass for the sidearm acquisition cluster. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const site = 'https://mortalshell2guide.xyz';
const updated = '2026-08-30';
const sidearms = [
  {
    slug: 'naylshotte', name: 'Naylshotte', region: 'Prologue',
    title: 'How to Unlock Naylshotte | Mortal Shell 2',
    description: 'Unlock Naylshotte in Mortal Shell 2 by completing the Prologue. Learn when this starting sidearm is granted and why no world pickup is required.',
    image: '/assets/icons/sidearms/naylshotte.webp',
  },
  {
    slug: 'troubadours-lute', name: "Troubadour's Lute", region: 'Fainweald',
    title: "Troubadour's Lute Location Guide | Mortal Shell 2",
    description: "Find Troubadour's Lute in Mortal Shell 2 with an original annotated route from One-Legged Wolf Beacon to the Tavern stage pickup.",
  },
  {
    slug: 'forgotten-crossbow', name: 'Forgotten Crossbow', region: 'Fainweald',
    title: 'Forgotten Crossbow Location Guide | Mortal Shell 2',
    description: 'Find Forgotten Crossbow in Mortal Shell 2 with an original annotated route through Flooded Village, including the Damp Key and locked door.',
  },
  {
    slug: 'salvaged-trebuchaxe', name: 'Salvaged Trebuchaxe', region: 'Mammon',
    title: 'Salvaged Trebuchaxe Location Guide | Mortal Shell 2',
    description: 'Find Salvaged Trebuchaxe in Mortal Shell 2 with an original annotated route from Ravaged Hideout through the Bloodcursed Lithopod encounter.',
  },
  {
    slug: 'triarch-repeater', name: 'Triarch Repeater', region: 'Mammon',
    title: 'Triarch Repeater Location Guide | Mortal Shell 2',
    description: "Find Triarch Repeater in Mortal Shell 2 with an original annotated route from Castigator's Keep into Blackwell Cavern and the final pickup.",
  },
  {
    slug: 'cursed-child', name: 'Cursed Child', region: 'Mammon',
    description: "Find Cursed Child in Mortal Shell 2 with an original annotated route from Sester's Gate through Revered Beacon to the hidden pickup.",
  },
  {
    slug: 'ballistazooka', name: 'Ballistazooka', region: 'Mammon',
    description: "Find Ballistazooka in Mortal Shell 2 with an original annotated route from Gate of Mammon Beacon through Lonesome Spire and Sentry's Grave.",
  },
  {
    slug: 'caged-hystrix', name: 'Caged Hystrix', region: 'Mammon',
    description: 'Find Caged Hystrix in Mortal Shell 2 with an original annotated route from The Silent Steps to the Chamber of Becoming and Sariel sequence.',
  },
].map((sidearm) => ({
  ...sidearm,
  title: sidearm.title || `${sidearm.name} Location & Unlock Route | Mortal Shell 2`,
  image: sidearm.image || `/assets/images/sidearm-guides/${sidearm.slug}/route-01.webp`,
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

function htmlText(value) {
  return value.replaceAll('&', '&amp;');
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

for (let index = 0; index < sidearms.length; index += 1) {
  const sidearm = sidearms[index];
  const file = path.join(root, 'collectibles', 'sidearms', sidearm.slug, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const canonical = `${site}/collectibles/sidearms/${sidearm.slug}/`;
  const image = `${site}${sidearm.image}`;
  const title = htmlText(sidearm.title);

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
  html = replaceMeta(html, 'name="description"', sidearm.description);
  html = replaceMeta(html, 'property="og:title"', title);
  html = replaceMeta(html, 'property="og:description"', sidearm.description);
  if (!html.includes('property="og:image"')) {
    const social = `<meta property="og:image" content="${image}"><meta property="og:image:alt" content="${htmlText(sidearm.name)} unlock route in Mortal Shell 2"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${sidearm.description}"><meta name="twitter:image" content="${image}">`;
    html = html.replace('</title>', `</title>${social}`);
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: sidearm.title,
        description: sidearm.description,
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
          { '@type': 'ListItem', position: 2, name: 'Sidearm Locations', item: `${site}/collectibles/sidearms/` },
          { '@type': 'ListItem', position: 3, name: `${sidearm.name} Location`, item: canonical },
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
    const previous = sidearms[index - 1];
    const next = sidearms[index + 1];
    const links = [
      '<a href="../">All sidearm locations</a>',
      previous ? `<a href="../${previous.slug}/">Previous: ${htmlText(previous.name)}</a>` : '',
      next ? `<a href="../${next.slug}/">Next: ${htmlText(next.name)}</a>` : '',
    ].filter(Boolean).join('');
    html = html.replace('<footer class="article-footer">', `<nav class="article-related" aria-label="Sidearm guide navigation">${links}</nav><footer class="article-footer">`);
  }
  fs.writeFileSync(file, html);
}

const hubFile = path.join(root, 'collectibles', 'sidearms', 'index.html');
let hub = fs.readFileSync(hubFile, 'utf8');
const hubTitle = 'All Sidearm Locations & Unlock Routes | Mortal Shell 2';
const hubDescription = 'Find all eight sidearms in Mortal Shell 2 with original annotated routes, starting Beacons, unlock conditions, encounters and pickup details.';
const hubImage = `${site}/assets/images/sidearm-guides/ballistazooka/route-07.webp`;
hub = hub.replace(/<title>[^<]*<\/title>/i, `<title>${hubTitle}</title>`);
hub = replaceMeta(hub, 'name="description"', hubDescription);
hub = replaceMeta(hub, 'property="og:title"', hubTitle);
hub = replaceMeta(hub, 'property="og:description"', hubDescription);
hub = hub.replace('<h1>All sidearms</h1>', '<h1>All Sidearm Locations</h1>');
hub = hub.replace(/<p class="lede">[\s\S]*?<\/p>/, '<p class="lede">Find all eight sidearms: seven pages use original annotated acquisition routes, while Naylshotte has a separate automatic-unlock guide.</p>');
const hubAlert = '<p class="reference-alert"><strong>Complete sidearm set:</strong> use the starting Beacon and pickup notes below for each unlock. Building a full loadout? Pair them with our <a href="../weapons/">primary weapon location guides</a>.</p>';
if (hub.includes('class="reference-alert"')) {
  hub = hub.replace(/(?:<p class="reference-alert">[\s\S]*?<\/p>)+/, hubAlert);
} else {
  hub = hub.replace('<section class="catalog">', `${hubAlert}<section class="catalog">`);
}
hub = hub.replace(/<p class="source-line">[\s\S]*?<\/p>/, '<p class="source-line">Original acquisition routes and gameplay captures last reviewed 30 August 2026.</p>');
hub = hub.replace(/<nav id="site-nav">/, '<nav id="site-nav" aria-label="Main navigation">');
if (!hub.includes('property="og:image"')) {
  hub = hub.replace('</title>', `</title><meta property="og:image" content="${hubImage}"><meta property="og:image:alt" content="Ballistazooka pickup in Mortal Shell 2"><meta name="twitter:title" content="${hubTitle}"><meta name="twitter:description" content="${hubDescription}"><meta name="twitter:image" content="${hubImage}">`);
}
if (!hub.includes('"@type":"ItemList"')) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Mortal Shell 2 Sidearm Locations',
        description: hubDescription,
        url: `${site}/collectibles/sidearms/`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: sidearms.length,
          itemListElement: sidearms.map((sidearm, index) => ({
            '@type': 'ListItem', position: index + 1, name: `${sidearm.name} location and unlock guide`, url: `${site}/collectibles/sidearms/${sidearm.slug}/`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
          { '@type': 'ListItem', position: 2, name: 'Sidearm Locations', item: `${site}/collectibles/sidearms/` },
        ],
      },
    ],
  };
  hub = hub.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);
}
hub = addImageDimensions(hub, hubFile);
fs.writeFileSync(hubFile, hub);

const homeFile = path.join(root, 'index.html');
let home = fs.readFileSync(homeFile, 'utf8');
home = home.replace(/<section class="notice" aria-label="Guide status">[\s\S]*?<\/section>/, '<section class="notice" aria-label="Guide status"><span class="status-dot"></span><p><strong>All Shell, primary weapon and sidearm routes live:</strong> original gameplay captures now cover every selectable Shell and every non-automatic weapon. <a href="collectibles/sidearms/">Browse all sidearm locations.</a></p></section>');
fs.writeFileSync(homeFile, home);

const sitemapFile = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapFile, 'utf8');
const routes = ['/collectibles/sidearms/', ...sidearms.map((sidearm) => `/collectibles/sidearms/${sidearm.slug}/`)];
for (const route of routes) {
  const loc = `${site}${route}`;
  const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<url><loc>${escaped}<\\/loc>(?:<lastmod>[^<]+<\\/lastmod>)?<\\/url>`);
  const entry = `<url><loc>${loc}</loc><lastmod>${updated}</lastmod></url>`;
  if (pattern.test(sitemap)) sitemap = sitemap.replace(pattern, entry);
  else sitemap = sitemap.replace('</urlset>', `  ${entry}\n</urlset>`);
}
fs.writeFileSync(sitemapFile, sitemap);
