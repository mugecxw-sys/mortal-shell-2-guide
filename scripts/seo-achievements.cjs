/* SEO, structured data and internal-link pass for the achievement checklist. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const site = 'https://mortalshell2guide.xyz';
const route = '/achievements/';
const canonical = `${site}${route}`;
const updated = '2026-09-05';
const title = 'Mortal Shell 2 Achievements & Trophy Guide (All 53)';
const titleHtml = title.replaceAll('&', '&amp;');
const description = 'Complete all 53 Mortal Shell 2 achievements and PS5 trophies with a categorized checklist, three missable warnings, official icons and Platinum requirements.';
const imagePath = '/assets/icons/achievements/steam-53.jpg';
const image = `${site}${imagePath}`;

const guideLinks = new Map([
  ['You’re More Than a Weapon', '../collectibles/'],
  ['Deep Cuts', '../collectibles/weapons/axe-dagger/'],
  ['Old School', '../collectibles/sidearms/forgotten-crossbow/'],
  ['Cut You Down to Size', '../collectibles/weapons/veterans-battle-axe/'],
  ['Big Boi', '../collectibles/weapons/great-martyrs-blade/'],
  ['Chop Chop', '../collectibles/sidearms/salvaged-trebuchaxe/'],
  ['Dual Wielding', '../collectibles/weapons/axatana/'],
  ['Old Painless', '../collectibles/sidearms/triarch-repeater/'],
  ['Point Taken', '../collectibles/weapons/black-needle/'],
  ['Like Clockwork', '../collectibles/weapons/clockwork-scythe/'],
  ['Spiked', '../collectibles/sidearms/caged-hystrix/'],
  ['Stop – Hammer Time', '../collectibles/weapons/obsidian-hammer/'],
  ['Beautiful Baby', '../collectibles/sidearms/cursed-child/'],
  ['Speared', '../collectibles/sidearms/ballistazooka/'],
  ['Lord of War', '../collectibles/weapons/'],
  ['Heavy Metal', '../collectibles/sidearms/troubadours-lute/'],
  ['Guns. Lots of Guns', '../collectibles/sidearms/'],
  ['Forever Alone?', '../collectibles/shells/tiel/'],
  ['Arrival', '../collectibles/shells/proxima/'],
  ['Vengeance is Mine', '../collectibles/shells/eredrim/'],
  ['My Brether', '../collectibles/shells/smert/'],
  ['Heartless', '../collectibles/shells/gragu/'],
  ['The Alchemist', '../collectibles/shells/sariel/'],
  ['Sester', '../collectibles/shells/genessa/'],
  ['Down with the Thickness', '../collectibles/shells/lazlo/'],
  ['Shell Seeker', '../collectibles/shells/'],
  ['Over 9000', '../guides/upgrade-materials/'],
  ['Sat Nav', '../collectibles/map-fragments/'],
  ['Stoned', '../collectibles/tarstones/'],
]);

const categories = [
  ['missable', '03', 'Missables'],
  ['progress', '03', 'Story'],
  ['gear', '16', 'Weapons'],
  ['shells', '09', 'Shells'],
  ['bosses', '10', 'Bosses'],
  ['completion', '12', 'Completion'],
];

function replaceMeta(html, selector, value) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(`(<meta\\s+${escaped}\\s+content=")[^"]*(")`, 'i'), `$1${value}$2`);
}

function decodeHtml(value) {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[’']/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

const file = path.join(root, 'achievements', 'index.html');
let html = fs.readFileSync(file, 'utf8');
html = html.replace(/<title>[^<]*<\/title>/i, `<title>${titleHtml}</title>`);
html = replaceMeta(html, 'name="description"', description);
html = replaceMeta(html, 'property="og:title"', titleHtml);
html = replaceMeta(html, 'property="og:description"', description);
html = replaceMeta(html, 'name="twitter:card"', 'summary');
if (!html.includes('property="og:image"')) {
  const social = `<meta property="og:image" content="${image}"><meta property="og:image:alt" content="No Lifer completion achievement icon for Mortal Shell 2"><meta property="og:image:width" content="64"><meta property="og:image:height" content="64"><meta name="twitter:title" content="${titleHtml}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${image}"><meta name="twitter:image:alt" content="No Lifer completion achievement icon for Mortal Shell 2">`;
  html = html.replace('</title>', `</title>${social}`);
}
html = html.replace('<nav id="site-nav">', '<nav id="site-nav" aria-label="Main navigation">');
html = html.replace('<h1 class="page-title">Achievements<br><em>& Platinum</em></h1>', '<h1 class="page-title">Mortal Shell 2<br><em>Achievements &amp; Trophies</em></h1>');
html = html.replace(
  /<p class="lede">[\s\S]*?<\/p>/,
  '<p class="lede">Mortal Shell 2 has 53 Steam achievements and 53 PS5 trophies including Platinum. Use the six-part checklist below, and complete the three missable objectives during their one-time encounters.</p>',
);
html = html.replace('Tarforge maximum (+16).', 'Tarforge maximum.');

const quickNav = `<nav class="achievement-nav" aria-label="Achievement categories">${categories.map(([id, count, label]) => `<a href="#${id}"><span>${count}</span>${label}</a>`).join('')}</nav>`;
if (!html.includes('class="achievement-nav"')) {
  html = html.replace('<section class="completion-summary">', `${quickNav}<section class="completion-summary">`);
}

html = html.replace(/<article class="achievement-card([^"]*)"([^>]*)>([\s\S]*?)<\/article>/g, (block, extraClasses, attrs, inner) => {
  const name = decodeHtml(inner.match(/<h3>([\s\S]*?)<\/h3>/)?.[1] || '');
  const id = `achievement-${slugify(name)}`;
  let nextAttrs = attrs.replace(/\s+id="[^"]*"/g, '');
  nextAttrs += ` id="${id}"`;
  let nextInner = inner;
  const guide = guideLinks.get(name);
  if (guide && !nextInner.includes(`href="${guide}"`)) {
    nextInner = nextInner.replace(/(<p>[\s\S]*?<\/p>)/, `$1<a class="achievement-guide-link" href="${guide}">Open related guide →</a>`);
  }
  return `<article class="achievement-card${extraClasses}"${nextAttrs}>${nextInner}</article>`;
});

const achievements = [...html.matchAll(/<article class="achievement-card[^"]*"[^>]*id="([^"]+)"[^>]*>[\s\S]*?<h3>([\s\S]*?)<\/h3><p>([\s\S]*?)<\/p>/g)].map((match) => ({
  id: match[1],
  name: decodeHtml(match[2]),
  description: decodeHtml(match[3]),
}));
if (achievements.length !== 53) throw new Error(`Expected 53 achievements, found ${achievements.length}`);

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: title,
      description,
      url: canonical,
      dateModified: updated,
      inLanguage: 'en',
      about: { '@type': 'VideoGame', name: 'Mortal Shell II' },
      mainEntity: { '@id': `${canonical}#achievement-list` },
    },
    {
      '@type': 'ItemList',
      '@id': `${canonical}#achievement-list`,
      name: 'All 53 Mortal Shell 2 achievements and trophies',
      numberOfItems: achievements.length,
      itemListElement: achievements.map((achievement, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: achievement.name,
        description: achievement.description,
        url: `${canonical}#${achievement.id}`,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: 'Achievements and Trophies', item: canonical },
      ],
    },
  ],
};
const schemaTag = `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
if (html.includes('type="application/ld+json"')) {
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, schemaTag);
} else {
  html = html.replace('</head>', `${schemaTag}</head>`);
}
html = html.replace(/Last reviewed: [^<]+/, 'Last reviewed: 5 September 2026.');
fs.writeFileSync(file, html);

const cssFile = path.join(root, 'assets', 'achievements.css');
let css = fs.readFileSync(cssFile, 'utf8');
if (!css.includes('.achievement-nav{')) {
  css += '\n.achievement-nav{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:1px;margin:1.5rem 0 2rem;border:1px solid var(--line);background:var(--line)}.achievement-nav a{display:flex;flex-direction:column;gap:.2rem;padding:.8rem .55rem;background:#171b18;color:var(--ink);font-size:.7rem;font-weight:800;letter-spacing:.06em;text-align:center;text-decoration:none;text-transform:uppercase}.achievement-nav a:hover{background:#252a25;color:var(--acid)}.achievement-nav span{color:var(--acid);font:400 1.2rem/1 var(--serif)}.achievement-section,.achievement-card{scroll-margin-top:24px}.achievement-guide-link{display:inline-block;margin:-.2rem 0 .65rem;color:var(--acid);font-size:.68rem;font-weight:800;letter-spacing:.06em;text-decoration:none;text-transform:uppercase}.achievement-guide-link:hover{text-decoration:underline}@media(max-width:760px){.achievement-nav{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:440px){.achievement-nav{grid-template-columns:repeat(2,minmax(0,1fr))}}\n';
}
fs.writeFileSync(cssFile, css);

const sitemapFile = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapFile, 'utf8');
const escapedCanonical = canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
sitemap = sitemap.replace(
  new RegExp(`<url><loc>${escapedCanonical}<\\/loc>(?:<lastmod>[^<]+<\\/lastmod>)?<\\/url>`),
  `<url><loc>${canonical}</loc><lastmod>${updated}</lastmod></url>`,
);
fs.writeFileSync(sitemapFile, sitemap);
