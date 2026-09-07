/* SEO, structured data and internal-link pass for the four missable trophies guide. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const site = 'https://mortalshell2guide.xyz';
const canonical = `${site}/guides/missable-trophies/`;
const updated = '2026-09-06';
const title = 'Mortal Shell 2 Missable Trophies Guide (All 4)';
const description = 'All 4 Mortal Shell 2 missable trophies: exact steps, lockout warnings, retries, NG+ recovery and new-save requirements. Verified September 6, 2026.';
const image = `${site}/assets/icons/achievements/steam-51.jpg`;

function upsertMeta(html, attribute, value, content) {
  const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\s+${escapedAttribute}="${escapedValue}"\\s+content="[^"]*">`, 'i');
  const tag = `<meta ${attribute}="${value}" content="${content}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</title>', `</title>${tag}`);
}

const file = path.join(root, 'guides', 'missable-trophies', 'index.html');
let html = fs.readFileSync(file, 'utf8');
html = upsertMeta(html, 'property', 'og:image', image);
html = upsertMeta(html, 'property', 'og:image:alt', 'Peter’s Perfect Parry achievement icon in Mortal Shell 2');
html = upsertMeta(html, 'property', 'og:image:width', '64');
html = upsertMeta(html, 'property', 'og:image:height', '64');
html = upsertMeta(html, 'name', 'twitter:card', 'summary');
html = upsertMeta(html, 'name', 'twitter:title', title);
html = upsertMeta(html, 'name', 'twitter:description', description);
html = upsertMeta(html, 'name', 'twitter:image', image);
html = upsertMeta(html, 'name', 'twitter:image:alt', 'Peter’s Perfect Parry achievement icon in Mortal Shell 2');
html = upsertMeta(html, 'property', 'article:published_time', updated);
html = upsertMeta(html, 'property', 'article:modified_time', updated);

const faq = [
  ['Are there three or four missable trophies?', 'Four in the roadmap reviewed on September 6, 2026. Include Bag Holder in your checklist.'],
  ['Should I delete my main save?', 'No. Use a separate slot for opening cleanup and retain your established campaign.'],
  ['Does every headspin need to be guarded?', 'No. Peter’s Perfect Parry targets one complete qualifying seven-hit sequence with the required Seal.'],
  ['Is this a firsthand tested route?', 'This is an original synthesis of the linked public guides, not a claim of in-game testing. The four-item classification follows the latest checked PowerPyx roadmap. Older guides may retain different counts or launch-era advice.'],
];
const missables = [
  ['Mid Summer?', 'Accept Marigold’s flower crown and enter the opening Festival; a new save is required after the Prologue lockout.', 'mid-summer'],
  ['No, You Still Can’t Win', 'Reduce the Prologue Tar Golem to minimum health before the scripted encounter ends; retry on a new save if locked out.', 'tar-golem'],
  ['Peter’s Perfect Parry', 'Perfect Guard the qualifying seven-hit headspin from The Nameless Captive with the Untarnished Seal equipped.', 'perfect-parry'],
  ['Bag Holder', 'Complete Baghead’s hidden ending without handing over an item; otherwise retry the interaction in NG+.', 'bag-holder'],
];
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${canonical}#article`,
      headline: title,
      description,
      url: canonical,
      mainEntityOfPage: canonical,
      datePublished: updated,
      dateModified: updated,
      inLanguage: 'en',
      image: { '@type': 'ImageObject', url: image, width: 64, height: 64 },
      author: { '@type': 'Organization', name: 'Mortal Shell II Guide', url: `${site}/` },
      publisher: { '@type': 'Organization', name: 'Mortal Shell II Guide', url: `${site}/` },
      about: { '@type': 'VideoGame', name: 'Mortal Shell II' },
      mainEntity: { '@id': `${canonical}#missable-list` },
    },
    {
      '@type': 'ItemList',
      '@id': `${canonical}#missable-list`,
      name: 'All four Mortal Shell 2 missable trophies',
      numberOfItems: 4,
      itemListElement: missables.map(([name, itemDescription, anchor], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name,
        description: itemDescription,
        url: `${canonical}#${anchor}`,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: 'Achievements and Trophies', item: `${site}/achievements/` },
        { '@type': 'ListItem', position: 3, name: 'Missable Trophies Guide', item: canonical },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faq.map(([name, answer]) => ({
        '@type': 'Question',
        name,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  ],
};
const schemaTag = `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, schemaTag);
fs.writeFileSync(file, html);

const achievementFile = path.join(root, 'achievements', 'index.html');
let achievements = fs.readFileSync(achievementFile, 'utf8');
const guideLinks = new Map([
  ['Mid Summer?', 'mid-summer'],
  ['No, You Still Can’t Win', 'tar-golem'],
  ['Peter’s Perfect Parry', 'perfect-parry'],
  ['Baghead / Bag Holder', 'bag-holder'],
]);
achievements = achievements.replace(/<article class="achievement-card is-missable"[\s\S]*?<\/article>/g, (block) => {
  const name = block.match(/<h3>([\s\S]*?)<\/h3>/)?.[1];
  const anchor = guideLinks.get(name);
  if (!anchor || block.includes(`/guides/missable-trophies/#${anchor}`)) return block;
  return block.replace(/(<p>[\s\S]*?<\/p>)/, `$1<a class="achievement-guide-link" href="../guides/missable-trophies/#${anchor}">Missable steps &amp; recovery →</a>`);
});
fs.writeFileSync(achievementFile, achievements);

const prologueFile = path.join(root, 'walkthrough', 'prologue', 'index.html');
let prologue = fs.readFileSync(prologueFile, 'utf8');
const prologueNote = '<aside class="route-guide-note missable-guide-link"><p><strong>Trophy warning:</strong> the opening contains two one-save-slot missables: <a href="../../guides/missable-trophies/#mid-summer">Mid Summer?</a> and <a href="../../guides/missable-trophies/#tar-golem">No, You Still Can’t Win</a>. Complete them before leaving the Prologue.</p></aside>';
if (!prologue.includes('class="route-guide-note missable-guide-link"')) {
  prologue = prologue.replace('<div class="route-divider">Opening path</div>', `${prologueNote}<div class="route-divider">Opening path</div>`);
}
fs.writeFileSync(prologueFile, prologue);

const homeFile = path.join(root, 'index.html');
let home = fs.readFileSync(homeFile, 'utf8');
home = home.replace(
  /<section class="notice" aria-label="(?:Guide status|Latest guide)">[\s\S]*?<\/section>/,
  "<section class=\"notice\" aria-label=\"Latest guides\"><span class=\"status-dot\"></span><p><strong>New: two focused trophy guides.</strong> Master Peter’s seven-hit Perfect Guard and track all 40 Shell Memories for Seeking the Past. <a href=\"guides/peters-perfect-parry/\">Learn the 7-hit timing →</a> <a href=\"guides/seeking-the-past/\">Track all 40 Memories →</a> <a href=\"collectibles/tarstones/locations/\">Open the Tarstone tracker →</a> <a href=\"guides/upgrade-materials/\">Plan Tarforge costs →</a></p></section>",
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

console.log('Optimized all four missable trophies: social metadata, Article, ItemList, BreadcrumbList, FAQPage and internal links.');
