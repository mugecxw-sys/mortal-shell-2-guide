/* SEO and performance pass for the published Shell acquisition guides. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const site = 'https://mortalshell2guide.xyz';
const guides = [
  {
    slug: 'tiel', name: 'Tiel', region: 'Fainweald', updated: '2026-08-29',
    description: 'Find Tiel in Mortal Shell 2 with an original annotated route from Widow\'s Overlook Beacon to the Shell memory and unlock prompt.',
    image: '/assets/images/walkthrough/widows-overlook/route-01.webp',
  },
  {
    slug: 'proxima', name: 'Proxima', region: 'Fainweald', updated: '2026-08-28',
    description: 'Find Proxima in Mortal Shell 2 with an original annotated route from Widow\'s Overlook to the Shell memory at Blackridge Cliffs.',
    image: '/assets/images/shell-guides/proxima/route-01.webp',
  },
  {
    slug: 'gragu', name: 'Gragu', region: 'Fainweald', updated: '2026-08-28',
    description: 'Unlock Gragu in Mortal Shell 2 with an original annotated route to the One-Legged Wolf Tavern and the Heart of Vatra exchange.',
    image: '/assets/images/shell-guides/gragu/route-01.webp',
  },
  {
    slug: 'eredrim', name: 'Eredrim', region: 'Fainweald', updated: '2026-08-29',
    description: 'Find Eredrim in Mortal Shell 2 with an original annotated route from Citadel of Penance Beacon through the final Shell encounter.',
    image: '/assets/images/shell-guides/eredrim/route-01.webp',
  },
  {
    slug: 'smert', name: 'Smert', region: 'Fainweald', updated: '2026-08-29',
    description: 'Unlock Smert in Mortal Shell 2 with an original annotated route from Outskirts of Nochte Beacon to the three blood-pool ritual.',
    image: '/assets/images/shell-guides/smert/route-01.webp',
  },
  {
    slug: 'lazlo', name: 'Lazlo', region: 'Mammon', updated: '2026-08-29',
    description: 'Find Lazlo in Mortal Shell 2 with an original annotated route from High Lord\'s Courtyard Beacon through the Royal Crypt of Mammon.',
    image: '/assets/images/shell-guides/lazlo/route-01.webp',
  },
  {
    slug: 'sariel', name: 'Sariel', region: 'Mammon', updated: '2026-08-29',
    description: 'Unlock Sariel in Mortal Shell 2 with an original annotated route from The Silent Steps Beacon to the Chamber of Becoming encounter.',
    image: '/assets/images/shell-guides/sariel/route-01.webp',
  },
  {
    slug: 'genessa', name: 'Genessa', region: 'Mammon', updated: '2026-08-29',
    description: 'Unlock Genessa in Mortal Shell 2 with an original annotated route to Revenant Graves, Sester\'s Censer, and the Marrow Keep hand-in.',
    image: '/assets/images/shell-guides/genessa/route-01.webp',
  },
];

function webpSize(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') return null;
  const type = buffer.toString('ascii', 12, 16);
  if (type === 'VP8X') {
    return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
  }
  if (type === 'VP8 ') {
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  }
  if (type === 'VP8L') {
    const bits = buffer.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  return null;
}

function replaceMeta(html, selector, value) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(<meta\\s+${escaped}\\s+content=")[^"]*(")`, 'i');
  return html.replace(pattern, `$1${value}$2`);
}

for (let index = 0; index < guides.length; index += 1) {
  const guide = guides[index];
  const file = path.join(root, 'collectibles', 'shells', guide.slug, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const canonical = `${site}/collectibles/shells/${guide.slug}/`;
  const title = `${guide.name} Location & Unlock Route | Mortal Shell 2`;
  const image = `${site}${guide.image}`;

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
  html = replaceMeta(html, 'name="description"', guide.description);
  html = replaceMeta(html, 'property="og:title"', title);
  html = replaceMeta(html, 'property="og:description"', guide.description);

  if (!html.includes('property="og:image"')) {
    const social = `<meta property="og:image" content="${image}"><meta property="og:image:alt" content="Annotated route to unlock ${guide.name} in Mortal Shell 2"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${guide.description}"><meta name="twitter:image" content="${image}">`;
    html = html.replace('</title>', `</title>${social}`);
  }

  if (!html.includes('"@type":"Article"')) {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: `How to Get ${guide.name} in Mortal Shell 2`,
          description: guide.description,
          image,
          dateModified: guide.updated,
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
          author: { '@type': 'Organization', name: 'Mortal Shell II Guide', url: site },
          publisher: { '@type': 'Organization', name: 'Mortal Shell II Guide', url: site },
          about: { '@type': 'VideoGame', name: 'Mortal Shell II' },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
            { '@type': 'ListItem', position: 2, name: 'All Shell Locations', item: `${site}/collectibles/shells/` },
            { '@type': 'ListItem', position: 3, name: `${guide.name} Location`, item: canonical },
          ],
        },
      ],
    };
    html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);
  }

  html = html.replace(/<img\s+([^>]*src="([^"]+\.webp)"[^>]*)>/gi, (match, attrs, src) => {
    if (!src.includes('/shell-guides/') && !src.includes('/walkthrough/')) return match;
    const absolute = path.resolve(path.dirname(file), src.replaceAll('/', path.sep));
    const size = fs.existsSync(absolute) ? webpSize(absolute) : null;
    let next = attrs.replace(/\s+width="\d+"|\s+height="\d+"/g, '');
    if (size) next += ` width="${size.width}" height="${size.height}"`;
    if (!/\sdecoding=/.test(next)) next += ' decoding="async"';
    if (/loading="eager"/.test(next) && !/\sfetchpriority=/.test(next)) next += ' fetchpriority="high"';
    return `<img ${next}>`;
  });

  if (!html.includes('class="article-related"')) {
    const previous = guides[index - 1];
    const next = guides[index + 1];
    const links = [
      '<a href="../">All Shell locations</a>',
      previous ? `<a href="../${previous.slug}/">Previous: ${previous.name}</a>` : '',
      next ? `<a href="../${next.slug}/">Next: ${next.name}</a>` : '',
    ].filter(Boolean).join('');
    html = html.replace('<footer class="article-footer">', `<nav class="article-related" aria-label="Shell guide navigation">${links}</nav><footer class="article-footer">`);
  }

  fs.writeFileSync(file, html);
}

const hubFile = path.join(root, 'collectibles', 'shells', 'index.html');
let hub = fs.readFileSync(hubFile, 'utf8');
const hubTitle = 'All Shell Locations & Unlock Routes | Mortal Shell 2';
const hubDescription = 'Find every selectable Shell in Mortal Shell 2 with original annotated routes, starting Beacons, unlock steps, abilities, and missable status.';
hub = hub.replace(/<title>[^<]*<\/title>/i, `<title>${hubTitle}</title>`);
hub = replaceMeta(hub, 'name="description"', hubDescription);
hub = replaceMeta(hub, 'property="og:title"', hubTitle);
hub = replaceMeta(hub, 'property="og:description"', hubDescription);
hub = hub.replace('<h1>All Shells</h1>', '<h1>All Shell Locations</h1>');
hub = hub.replace(/<p class="lede">[\s\S]*?<\/p>/, '<p class="lede">Find all eight selectable Shells with original, annotated acquisition routes. Harros is also listed separately because he is the prologue-only starting Shell.</p>');
hub = hub.replace(/<p class="reference-alert">[\s\S]*?<\/p>/, '<p class="reference-alert"><strong>Route status:</strong> every selectable Shell now has a captured unlock route. Each guide names the starting Beacon, required encounter or item, and the final interaction.</p>');
hub = hub.replace('href="../../walkthrough/widows-overlook/#tiel-shell"', 'href="tiel/"');
hub = hub.replace(/<p class="source-line">[\s\S]*?<\/p>/, '<p class="source-line">Original acquisition routes and gameplay captures last reviewed 29 August 2026. Ability terminology was cross-checked against the <a href="https://probonk.com/mortal-shell-2/shells" rel="nofollow external">Probonk Shell catalogue</a> and <a href="https://probonk.com/mortal-shell-2/abilities" rel="nofollow external">ability list</a>.</p>');
hub = hub.replace(/<nav id="site-nav">/, '<nav id="site-nav" aria-label="Main navigation">');

const hubSocialImage = `${site}/assets/images/shell-guides/proxima/route-04.webp`;
if (!hub.includes('property="og:image"')) {
  const social = `<meta property="og:image" content="${hubSocialImage}"><meta property="og:image:alt" content="A Mortal Shell 2 Shell unlock memory"><meta name="twitter:title" content="${hubTitle}"><meta name="twitter:description" content="${hubDescription}"><meta name="twitter:image" content="${hubSocialImage}">`;
  hub = hub.replace('</title>', `</title>${social}`);
}

const shellIcons = ['Harros', 'Tiel', ...guides.slice(1).map((guide) => guide.name)];
hub = hub.replace(/<article class="catalog-row">[\s\S]*?<\/article>/g, (article) => {
  const shell = shellIcons.find((name) => article.includes(`<h2>${name}</h2>`));
  if (!shell) return article;
  const slug = shell.toLowerCase();
  const image = `<div class="item-image shell-icon"><img src="../../assets/images/shells/${slug}.webp" alt="${shell} Shell portrait" width="132" height="132" loading="lazy" decoding="async"></div>`;
  return article.replace(/<div class="item-image(?: shell-icon)?">[\s\S]*?<\/div>/, image);
});

if (!hub.includes('"@type":"ItemList"')) {
  const hubSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Mortal Shell 2 Shell Locations',
        description: hubDescription,
        url: `${site}/collectibles/shells/`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: guides.length,
          itemListElement: guides.map((guide, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: `${guide.name} location and unlock route`,
            url: `${site}/collectibles/shells/${guide.slug}/`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
          { '@type': 'ListItem', position: 2, name: 'All Shell Locations', item: `${site}/collectibles/shells/` },
        ],
      },
    ],
  };
  hub = hub.replace('</head>', `<script type="application/ld+json">${JSON.stringify(hubSchema)}</script></head>`);
}
fs.writeFileSync(hubFile, hub);

const homeFile = path.join(root, 'index.html');
let home = fs.readFileSync(homeFile, 'utf8');
home = home.replace(/<section class="notice" aria-label="Guide status">[\s\S]*?<\/section>/, '<section class="notice" aria-label="Guide status"><span class="status-dot"></span><p><strong>All Shell routes live:</strong> original gameplay captures now cover every selectable Shell, alongside five story walkthrough routes. <a href="collectibles/shells/">Browse all Shell locations.</a></p></section>');
fs.writeFileSync(homeFile, home);

const widowsFile = path.join(root, 'walkthrough', 'widows-overlook', 'index.html');
let widows = fs.readFileSync(widowsFile, 'utf8');
if (!widows.includes('Open the standalone Tiel location guide.')) {
  widows = widows.replace('then complete the memory to gain the <span class="item-name">Tiel Shell</span>.</figcaption>', 'then complete the memory to gain the <span class="item-name">Tiel Shell</span>. <a href="../../collectibles/shells/tiel/">Open the standalone Tiel location guide.</a></figcaption>');
}
fs.writeFileSync(widowsFile, widows);

const sitemapFile = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapFile, 'utf8');
for (const guide of guides) {
  const loc = `${site}/collectibles/shells/${guide.slug}/`;
  const pattern = new RegExp(`<url><loc>${loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/loc>(?:<lastmod>[^<]+<\\/lastmod>)?<\\/url>`);
  const entry = `<url><loc>${loc}</loc><lastmod>2026-08-29</lastmod></url>`;
  if (pattern.test(sitemap)) sitemap = sitemap.replace(pattern, entry);
  else sitemap = sitemap.replace('</urlset>', `  ${entry}\n</urlset>`);
}
sitemap = sitemap.replace(/<url><loc>https:\/\/mortalshell2guide\.xyz\/collectibles\/shells\/<\/loc>(?:<lastmod>[^<]+<\/lastmod>)?<\/url>/, '<url><loc>https://mortalshell2guide.xyz/collectibles/shells/</loc><lastmod>2026-08-29</lastmod></url>');
fs.writeFileSync(sitemapFile, sitemap);
