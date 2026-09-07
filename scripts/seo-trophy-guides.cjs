/* SEO, structured-data and internal-link pass for the Peter and Seeking trophy guides. */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const site = 'https://mortalshell2guide.xyz';
const updated = '2026-09-07';
const shellNames = ['tiel', 'proxima', 'gragu', 'eredrim', 'smert', 'lazlo', 'sariel', 'genessa'];
const shellLabels = ['Tiel', 'Proxima', 'Gragu', 'Eredrim', 'Smert', 'Lazlo', 'Sariel', 'Genessa'];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function write(rel, value) {
  fs.writeFileSync(path.join(root, rel), value);
}

function upsertMeta(html, attribute, value, content) {
  const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\s+${escapedAttribute}="${escapedValue}"\\s+content="[^"]*">`, 'i');
  const tag = `<meta ${attribute}="${value}" content="${content}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</title>', `</title>${tag}`);
}

function setCommonMeta(html, data) {
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${data.title}</title>`);
  html = upsertMeta(html, 'name', 'description', data.description);
  html = upsertMeta(html, 'name', 'robots', 'index, follow, max-image-preview:large');
  html = upsertMeta(html, 'property', 'og:locale', 'en_US');
  html = upsertMeta(html, 'property', 'og:title', data.title);
  html = upsertMeta(html, 'property', 'og:description', data.description);
  html = upsertMeta(html, 'property', 'og:image', data.image);
  html = upsertMeta(html, 'property', 'og:image:type', 'image/jpeg');
  html = upsertMeta(html, 'property', 'og:image:width', '256');
  html = upsertMeta(html, 'property', 'og:image:height', '256');
  html = upsertMeta(html, 'property', 'og:image:alt', data.imageAlt);
  html = upsertMeta(html, 'name', 'twitter:card', 'summary');
  html = upsertMeta(html, 'name', 'twitter:title', data.title);
  html = upsertMeta(html, 'name', 'twitter:description', data.description);
  html = upsertMeta(html, 'name', 'twitter:image', data.image);
  html = upsertMeta(html, 'name', 'twitter:image:alt', data.imageAlt);
  return html;
}

function breadcrumbs(label) {
  return `<nav class="seo-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">›</span><a href="/achievements/">Achievements</a><span aria-hidden="true">›</span><span aria-current="page">${label}</span></nav>`;
}

const peterRoute = '/guides/peters-perfect-parry/';
const peterCanonical = `${site}${peterRoute}`;
const peterTitle = 'Peter’s Perfect Parry: 7-Hit Timing | Mortal Shell 2';
const peterDescription = 'Perfect Guard all 7 hits of the Nameless Captive’s phase-two headspin with Untarnished Seal. See the exact rhythm, safe setup, retries and NG+ recovery.';
const peterImage = `${site}/assets/icons/achievements/steam-51.jpg`;
const peterFaq = [
  ['Is the phase-two transition spin the trophy attack?', 'No. Wait for the separate seven-hit headspin used later in phase two.'],
  ['Can I use Infinite Seal?', 'No. The achievement requires the Untarnished Seal and seven Perfect Guards in the qualifying attack.'],
  ['Do all seven guards need to happen in one string?', 'Yes. A miss, normal block, whiff or early Break interrupts the qualifying sequence.'],
  ['When should the trophy unlock?', 'Current successful reports place the unlock immediately after the seventh Perfect Guard, before the boss dies.'],
];
const peterSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${peterCanonical}#article`,
      headline: peterTitle,
      description: peterDescription,
      url: peterCanonical,
      mainEntityOfPage: { '@type': 'WebPage', '@id': peterCanonical },
      datePublished: updated,
      dateModified: updated,
      inLanguage: 'en',
      articleSection: 'Achievements and Trophies',
      image: { '@type': 'ImageObject', url: peterImage, width: 256, height: 256 },
      author: { '@type': 'Organization', name: 'Mortal Shell II Guide', url: `${site}/` },
      publisher: { '@type': 'Organization', name: 'Mortal Shell II Guide', url: `${site}/` },
      about: { '@type': 'VideoGame', name: 'Mortal Shell II' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: 'Achievements', item: `${site}/achievements/` },
        { '@type': 'ListItem', position: 3, name: 'Peter’s Perfect Parry', item: peterCanonical },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: peterFaq.map(([name, answer]) => ({
        '@type': 'Question',
        name,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  ],
};

let peter = read('guides/peters-perfect-parry/index.html');
peter = setCommonMeta(peter, {
  title: peterTitle,
  description: peterDescription,
  image: peterImage,
  imageAlt: 'Peter’s Perfect Parry achievement icon in Mortal Shell 2',
});
peter = peter.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(peterSchema)}</script>`);
if (!peter.includes('class="seo-breadcrumbs"')) {
  peter = peter.replace('<main class="guide-article parry-guide" id="main-content">', `<main class="guide-article parry-guide" id="main-content">\n${breadcrumbs('Peter’s Perfect Parry')}`);
}
peter = peter.replace('The trophy should unlock as hit 7 is guarded.', 'Successful runs currently report the unlock as hit 7 is guarded.');
peter = peter.replace('Clean timing diagram placeholder based on the verified seven-contact structure; it is a rhythm aid, not captured animation frames.', 'Original seven-contact timing schematic; use it as a rhythm aid rather than a frame-perfect animation reference.');
peter = peter.replace('Keep or reacquire access to Untarnished Seal before the Prisoner’s Domain boss route.', 'Confirm that Untarnished Seal is available and equipped before the Prisoner’s Domain boss route.');
if (!peter.includes('<strong>Timing caveat:</strong>')) {
  peter = peter.replace(/<\/ol>\s*<h2 id="last-two">/, '</ol><p class="source-note"><strong>Timing caveat:</strong> current public guides group the middle contacts differently. Treat the 2–4–1 grouping as a practical input rhythm, not a universal metronome: watch the blade contacts, fully release each press, and preserve the clearly delayed seventh guard.</p>\n\n<h2 id="last-two">');
}
if (!peter.includes('href="/guides/seeking-the-past/"')) {
  peter = peter.replace('</nav><footer class="article-footer">', '<a href="/guides/seeking-the-past/">All 40 Shell Memories</a></nav><footer class="article-footer">');
}
write('guides/peters-perfect-parry/index.html', peter);

const seekingRoute = '/guides/seeking-the-past/';
const seekingCanonical = `${site}${seekingRoute}`;
const seekingTitle = 'Seeking the Past: All 40 Shell Memories | Mortal Shell 2';
const seekingDescription = 'Track all 40 Shell Memories in Mortal Shell 2 with an 8×5 checklist, renewable Glimpse route, Mether’s Severance steps, and fixes for 35/40 or 39/40.';
const seekingImage = `${site}/assets/icons/achievements/steam-52.jpg`;
const seekingFaq = [
  ['Do I need 40 different Shells or pickups?', 'No. The total is five story Memories for each of eight selectable Shells.'],
  ['Does maximum Bond automatically count all five?', 'No. Maximum Bond unlocks access, but Seeking the Past requires every Memory scene to be played.'],
  ['Is NG++ still required?', 'No for Glimpse supply on an updated build. The Week 1 Update made Glimpses renewable, so all eight Shells can be completed in one playthrough.'],
  ['Is replaying Genessa an official fix for 35/40?', 'No. It is a community-reported workaround based on the pattern of one missing five-Memory set.'],
];
const seekingSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${seekingCanonical}#article`,
      headline: seekingTitle,
      description: seekingDescription,
      url: seekingCanonical,
      mainEntityOfPage: { '@type': 'WebPage', '@id': seekingCanonical },
      datePublished: updated,
      dateModified: updated,
      inLanguage: 'en',
      articleSection: 'Achievements and Trophies',
      image: { '@type': 'ImageObject', url: seekingImage, width: 256, height: 256 },
      author: { '@type': 'Organization', name: 'Mortal Shell II Guide', url: `${site}/` },
      publisher: { '@type': 'Organization', name: 'Mortal Shell II Guide', url: `${site}/` },
      about: { '@type': 'VideoGame', name: 'Mortal Shell II' },
      mainEntity: { '@id': `${seekingCanonical}#shell-memory-sets` },
    },
    {
      '@type': 'ItemList',
      '@id': `${seekingCanonical}#shell-memory-sets`,
      name: 'All eight Shell Memory sets for Seeking the Past',
      numberOfItems: 8,
      itemListElement: shellNames.map((slug, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${shellLabels[index]} — five Shell Memories`,
        url: `${seekingCanonical}#${slug}`,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: 'Achievements', item: `${site}/achievements/` },
        { '@type': 'ListItem', position: 3, name: 'Seeking the Past', item: seekingCanonical },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: seekingFaq.map(([name, answer]) => ({
        '@type': 'Question',
        name,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  ],
};

let seeking = read('guides/seeking-the-past/index.html');
seeking = setCommonMeta(seeking, {
  title: seekingTitle,
  description: seekingDescription,
  image: seekingImage,
  imageAlt: 'Seeking the Past achievement icon in Mortal Shell 2',
});
seeking = seeking.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(seekingSchema)}</script>`);
if (!seeking.includes('class="seo-breadcrumbs"')) {
  seeking = seeking.replace('<main class="guide-article memory-guide" id="main-content">', `<main class="guide-article memory-guide" id="main-content">${breadcrumbs('Seeking the Past')}`);
}
seeking = seeking.replace('Tick a box only after the scene has played and control has returned. Progress stays in this browser.', 'Tick a box only after the scene has played and control has returned. This is a manual browser checklist: it does not read your Steam or PlayStation progress. Progress stays on this device.');
seeking = seeking.replace('<div><strong>Total</strong><span>40 watched</span></div>', '<div><strong>Total</strong><span>40 watched · 216 Glimpses</span></div>');
seeking = seeking.replace('raise each Bond to Tier IV with Zhirelle, and <strong>play every one of its five Memory entries</strong>.', 'raise each Bond to Tier IV with Zhirelle (27 Glimpses each; 216 total), and <strong>play every one of its five Memory entries</strong>.');
seeking = seeking.replace(
  '<ol><li>Progress far enough to open <strong>The Unfound Path</strong> and its Beacons.</li><li>Use the <strong>Chamber of the Forsaken</strong> route and kill the Lithopod-like wooden crabs around the area. Rest at the Beacon and repeat for Glimpse Stone drops.</li><li>Equip one Glimpse Stone. Community tests currently report that it breaks after 20 enemy kills and awards 3 Glimpses.</li><li>Break it on a short, repeatable group: the bats near <strong>Blackridge Pass</strong> or the sheep near <strong>Sunken Village</strong> are current community routes. Rest, re-equip the next Stone, and repeat.</li></ol>',
  '<ol><li>Buy the limited stock first. Current guide data lists up to <strong>13 Glimpse Stones from Merrick for 2,500 Coin each</strong> per playthrough.</li><li>For repeatable drops, reach <strong>The Unfound Path</strong> and farm the Stonecrab enemies around its central pillar. The Chamber of the Forsaken approach is another current community loop.</li><li>Equip one Glimpse Stone. Current testing reports that it breaks after <strong>20 enemy kills</strong> and awards <strong>3 Glimpses</strong>.</li><li>Break it on a short, repeatable group: the bats near <strong>Blackridge Pass</strong> or the sheep near <strong>Sunken Village</strong> are current community routes. Rest, equip the next Stone, and repeat.</li></ol>',
);
seeking = seeking.replace('Give Mether’s Severance to Zhirelle to sever the active bond, reset that Shell and recover all Glimpses spent on it. This is useful when your earlier upgrades are spread across several incomplete Shells.', 'Give Mether’s Severance to Zhirelle to sever the active bond, reset that Shell and recover all Glimpses spent on it. Current guide data lists three sold by Merrick for 5,000 Coin each per playthrough; the official Week 1 notes say his stock can restock as the game progresses, so verify your current build.');
seeking = seeking.replace('Farming paths and stuck-counter steps are labeled from recent community reports, including the', 'The 27/216 Glimpse totals and current Merrick stock were cross-checked against the <a href="https://www.powerpyx.com/mortal-shell-2-trophy-guide-roadmap/" rel="external">PowerPyx trophy roadmap</a>. Farming paths and stuck-counter steps are labeled from recent community reports, including the');
seeking = seeking.replace('Before severing bonds, starting NG+, restoring cloud data or repeating large groups of Memories, preserve the current save using your platform’s supported backup method. No community workaround should be treated as an official trophy repair.', 'Keep all 40 watched Memories on the same active save; do not split the route across cloud-restore branches because platform counters may not merge that progress. Before severing bonds, starting NG+ or repeating large groups of Memories, preserve the current save using your platform’s supported backup method. No community workaround should be treated as an official trophy repair.');
write('guides/seeking-the-past/index.html', seeking);

const inboundNotes = [
  ['collectibles/shells/eredrim/index.html', '<aside class="route-guide-note parry-guide-link"><p><strong>Perfect Guard practice:</strong> Eredrim’s health pool makes him a practical optional Shell for the Nameless Captive attempt. Use the <a href="/guides/peters-perfect-parry/#setup">Peter’s Perfect Parry setup and seven-hit rhythm</a>.</p></aside>'],
  ['collectibles/weapons/axe-dagger/index.html', '<aside class="route-guide-note parry-guide-link"><p><strong>Low-damage trophy setup:</strong> an unupgraded fast weapon can preserve attempts against the Nameless Captive. See the <a href="/guides/peters-perfect-parry/#setup">Peter’s Perfect Parry setup and seven-hit timing</a>.</p></aside>'],
];
for (const [rel, note] of inboundNotes) {
  let html = read(rel);
  if (!html.includes(peterRoute)) {
    html = html.replace('<footer class="article-footer">', `${note}<footer class="article-footer">`);
    write(rel, html);
  }
}

const latestNotice = '<section class="notice" aria-label="Latest guides"><span class="status-dot"></span><p><strong>New: two focused trophy guides.</strong> Master Peter’s seven-hit Perfect Guard and track all 40 Shell Memories for Seeking the Past. <a href="guides/peters-perfect-parry/">Learn the 7-hit timing →</a> <a href="guides/seeking-the-past/">Track all 40 Memories →</a> <a href="collectibles/tarstones/locations/">Open the Tarstone tracker →</a> <a href="guides/upgrade-materials/">Plan Tarforge costs →</a></p></section>';
let home = read('index.html');
home = home.replace(/<section class="notice" aria-label="(?:Guide status|Latest guide|Latest guides)">[\s\S]*?<\/section>/, latestNotice);
if (!home.includes('<a href="guides/missable-trophies/">Missable trophies</a>')) {
  home = home.replace('<a href="achievements/">Achievements</a></div><p class="disclaimer">', '<a href="achievements/">Achievements</a><a href="guides/missable-trophies/">Missable trophies</a></div><p class="disclaimer">');
}
write('index.html', home);

for (const rel of ['scripts/update-tarstone-crosslinks.cjs', 'scripts/seo-map-fragments.cjs', 'scripts/seo-missable-trophies.cjs']) {
  let script = read(rel);
  script = script.replace(/'<section class="notice" aria-label="Latest guide"><span class="status-dot"><\/span><p><strong>New: all 75 Mortal Shell 2 Tarstone locations\.<\/strong>[\s\S]*?<\/p><\/section>'/g, JSON.stringify(latestNotice));
  write(rel, script);
}

const breadcrumbCss = '.seo-breadcrumbs{display:flex;flex-wrap:wrap;gap:.5rem;margin:0 0 30px;color:var(--muted);font-size:.75rem;letter-spacing:.04em}.seo-breadcrumbs a{color:var(--muted);text-decoration:none}.seo-breadcrumbs a:hover{color:var(--acid)}';
for (const rel of ['assets/peters-perfect-parry.css', 'assets/seeking-the-past.css']) {
  let css = read(rel);
  if (!css.includes('.seo-breadcrumbs{')) {
    css = `${breadcrumbCss}\n${css}`;
    write(rel, css);
  }
}

console.log('Optimized Peter’s Perfect Parry and Seeking the Past metadata, schema, copy and internal links.');
