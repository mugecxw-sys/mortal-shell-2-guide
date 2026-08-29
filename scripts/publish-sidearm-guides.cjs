const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const guideBase = 'https://mortalshell2guide.xyz';

const guides = [
  {
    slug: 'naylshotte',
    name: 'Naylshotte',
    number: '01',
    region: 'Prologue',
    location: 'Automatic unlock',
    lede: 'Naylshotte is the starting sidearm. It is added automatically after the Prologue, so there is no separate pickup route or optional encounter to complete.',
    indexText: 'Added automatically after the Prologue. No separate route or pickup is required.',
    search: 'naylshotte sidearm prologue automatic unlock starting sidearm',
    note: 'This page is intentionally brief: the weapon is a progression unlock rather than a world pickup.',
    captions: [],
  },
  {
    slug: 'troubadours-lute', name: 'Troubadour\'s Lute', number: '02', region: 'Fainweald', location: 'One-Legged Wolf Tavern',
    lede: 'Troubadour\'s Lute is placed on the stage inside the One-Legged Wolf Tavern. The supplied route image covers the direct approach from the Beacon.',
    indexText: 'From One-Legged Wolf Beacon, enter the Tavern and take it from the marked stage.',
    search: 'troubadour lute sidearm one-legged wolf tavern fainweald stage',
    captions: ['Fast travel to <span class="item-name">One-Legged Wolf Beacon</span>, then head down-right into the <span class="item-name">One-Legged Wolf Tavern</span>. The marked stage holds <span class="item-name">Troubadour\'s Lute</span>.'],
  },
  {
    slug: 'forgotten-crossbow', name: 'Forgotten Crossbow', number: '03', region: 'Fainweald', location: 'Flooded Village',
    lede: 'The Forgotten Crossbow is behind a locked upper-floor door in Flooded Village. The route first collects the <span class="item-name">Damp Key</span> inside the dungeon.',
    indexText: 'Find the Damp Key in Flooded Village, then use it on the upper-floor door.',
    search: 'forgotten crossbow sidearm blackridge pass flooded village damp key',
    captions: [
      'Fast travel to <span class="item-name">Blackridge Pass Beacon</span>.',
      'Leave from behind the Beacon and follow the marked route across the two wooden bridges.',
      'Break the boards behind the stone doorway to expose the entrance. Continue through the newly opened passage.',
      'You are now in <span class="item-name">Flooded Village</span>. Follow the annotated turns through the village.',
      'Collect the <span class="item-name">Damp Key</span> at the marked pickup.',
      'Turn back, drop down, and enter the building ahead. Climb to the second floor, open the door with the Damp Key, then take the <span class="item-name">Forgotten Crossbow</span> from the table.'
    ],
  },
  {
    slug: 'salvaged-trebuchaxe', name: 'Salvaged Trebuchaxe', number: '04', region: 'Mammon', location: 'Ravaged Hideout',
    lede: 'Salvaged Trebuchaxe is found on a corpse in the Ravaged Hideout. A rock fissure on the route opens only after the <span class="item-name">Bloodcursed Lithopod</span> is defeated.',
    indexText: 'At Ravaged Hideout, defeat the Bloodcursed Lithopod to open the rock fissure, then inspect the corpse.',
    search: 'salvaged trebuchaxe sidearm gloomshade grove ravaged hideout bloodcursed lithopod',
    captions: [
      'Start from <span class="item-name">Gloomshade Grove Beacon</span>. The target is <span class="item-name">Ravaged Hideout</span>, south of the Beacon.',
      'Enter Ravaged Hideout and continue straight. At the marked point, take the upper-left route.',
      'Use the narrow rock fissure on the right. It becomes available after you defeat the <span class="item-name">Bloodcursed Lithopod</span>.',
      'Inspect the corpse at the end of the passage to collect <span class="item-name">Salvaged Trebuchaxe</span>.'
    ],
  },
  {
    slug: 'triarch-repeater', name: 'Triarch Repeater', number: '05', region: 'Mammon', location: 'Blackwell Cavern',
    lede: 'Triarch Repeater lies on the ground in Blackwell Cavern. The route starts at Castigator\'s Keep Beacon and uses the lift on the right.',
    indexText: 'Ride the right-side lift from Castigator’s Keep, then follow the route into Blackwell Cavern.',
    search: 'triarch repeater sidearm castigator keep blackwell cavern lift',
    captions: [
      'Fast travel to <span class="item-name">Castigator\'s Keep Beacon</span>.',
      'Take the lift on the right of the Beacon.',
      'After the lift reaches the lower level, follow the red arrow across the open ground.',
      'Drop down at the marked ledge.',
      'Continue forward and take the left-hand route into <span class="item-name">Blackwell Cavern</span>.',
      'Inside the cavern, keep left at the marked turn.',
      'Follow the path to the lit section of the cave.',
      'The <span class="item-name">Triarch Repeater</span> is on the ground beside the remains. Interact with it to collect the sidearm.',
      'The acquisition notification confirms that <span class="item-name">Triarch Repeater</span> has been collected.'
    ],
  },
  {
    slug: 'cursed-child', name: 'Cursed Child', number: '06', region: 'Mammon', location: 'Revered Beacon',
    lede: 'Cursed Child is awarded in the Revered Beacon area. Follow the underground route from Sester\'s Gate, then destroy the glowing objective to make the pickup appear.',
    indexText: 'From Sester’s Gate, reach Revered Beacon and destroy the glowing objective to reveal it.',
    search: 'cursed child sidearm sester gate revered beacon glowing objective',
    captions: [
      'Fast travel to <span class="item-name">Sester\'s Gate Beacon</span>.',
      'Take the staircase to the right of the Beacon and continue straight.',
      'At the marked point, turn left and descend.',
      'Follow the route to the lift, ride it down, and continue to the end of the passage.',
      'You will reach <span class="item-name">Revered Beacon</span>. Turn left and avoid the damaging light on the route.',
      'Continue forward and use the traversal device shown by the arrow.',
      'Destroy the glowing objective at the marked platform.',
      'The <span class="item-name">Cursed Child</span> pickup appears after the objective is destroyed.'
    ],
  },
  {
    slug: 'ballistazooka', name: 'Ballistazooka', number: '07', region: 'Mammon', location: 'Sentry\'s Grave',
    lede: 'Ballistazooka is the reward at the end of Sentry\'s Grave. Start from Gate of Mammon Beacon, follow the Lonesome Spire route, then clear the final encounter.',
    indexText: 'Follow the Lonesome Spire route from Gate of Mammon Beacon and clear Sentry’s Grave.',
    search: 'ballistazooka sidearm gate of mammon lonesome spire sentry grave',
    captions: [
      'Fast travel to <span class="item-name">Gate of Mammon Beacon</span>.',
      'From the Beacon, turn toward the rear-right staircase and climb it.',
      'At <span class="item-name">Lonesome Spire</span>, keep taking the stairs upward.',
      'At the upper level, turn left along the marked path.',
      'Turn right into <span class="item-name">Sentry\'s Grave</span>.',
      'Continue through the dungeon corridor following the route arrow.',
      'Clear the final encounter in Sentry\'s Grave to receive <span class="item-name">Ballistazooka</span>.'
    ],
  },
  {
    slug: 'caged-hystrix', name: 'Caged Hystrix', number: '08', region: 'Mammon', location: 'Chamber of Becoming',
    lede: 'Caged Hystrix is found after the Sariel sequence in the Chamber of Becoming. The route begins at The Silent Steps Beacon and follows the portal path to the sealed door.',
    indexText: 'From The Silent Steps, follow the portal route to Chamber of Becoming and complete the Sariel sequence.',
    search: 'caged hystrix sidearm the silent steps chamber of becoming sariel',
    captions: [
      'Fast travel to <span class="item-name">The Silent Steps Beacon</span>.',
      'Go through the portal and turn left onto the marked platform.',
      'Defeat <span class="item-name">Sariel</span> at the first encounter, then follow the smoke trail that appears.',
      'The stone door on the route opens automatically after the encounter. Go through it.',
      'Continue along the stairs and into the <span class="item-name">Chamber of Becoming</span> route.',
      'Follow the marked path through the chamber; nearby enemies can be bypassed while you proceed to Sariel\'s sequence.',
      'During the final Sariel encounter, destroy the four corner obelisks so the fight can conclude.',
      'After the sequence, collect <span class="item-name">Caged Hystrix</span> from the marked pickup.'
    ],
  },
];

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.trim() + '\n');
}

function guidePage(guide) {
  const figures = guide.captions.map((caption, index) => `<figure class="route-figure"><img src="../../../assets/images/sidearm-guides/${guide.slug}/route-${String(index + 1).padStart(2, '0')}.webp" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async" alt="Annotated ${guide.name} route step ${String(index + 1).padStart(2, '0')}"><figcaption><strong>Route ${String(index + 1).padStart(2, '0')}</strong>${caption}</figcaption></figure>`).join('');
  const noRoute = !figures ? `<aside class="route-guide-note"><p><strong>Automatic unlock:</strong> <span class="item-name">Naylshotte</span> is granted after the Prologue. It is not hidden in the world, so no route image is needed.</p></aside>` : '';
  const note = guide.note ? `<aside class="route-guide-note"><p>${guide.note}</p></aside>` : '';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="How to get ${guide.name} in Mortal Shell II. ${guide.location} route and pickup notes."><link rel="canonical" href="${guideBase}/collectibles/sidearms/${guide.slug}/"><meta property="og:url" content="${guideBase}/collectibles/sidearms/${guide.slug}/"><meta property="og:site_name" content="Mortal Shell II Guide"><meta property="og:type" content="article"><meta property="og:title" content="${guide.name} Location | Mortal Shell II Guide"><meta property="og:description" content="Annotated acquisition route for ${guide.name}."><meta name="twitter:card" content="summary_large_image"><title>${guide.name} Location | Mortal Shell II Guide</title><link rel="icon" href="../../../favicon.ico" sizes="any"><link rel="apple-touch-icon" href="../../../apple-touch-icon.png"><link rel="stylesheet" href="../../../assets/styles.css"><link rel="stylesheet" href="../../../assets/articles.css"><script defer src="../../../assets/app.js"></script><script defer src="../../../assets/analytics.js"></script></head>
<body><header class="site-header"><a class="brand" href="../../../"><span class="brand-mark">MS</span><span>Mortal Shell <i>II</i><small>Guide</small></span></a><button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav" aria-label="Main navigation"><a href="../../../">Home</a><a href="../../../walkthrough/">Walkthrough</a><a class="active" href="../../">Collectibles</a><a href="../../../maps/">Maps</a><a href="../../../achievements/">Achievements</a></nav></header>
<main class="guide-article"><p class="eyebrow">Sidearm acquisition · ${guide.region}</p><h1>${guide.name.replace(' ', '<br>')}</h1><p class="lede">${guide.lede}</p><dl class="facts"><div><dt>Region</dt><dd>${guide.region}</dd></div><div><dt>Location</dt><dd>${guide.location}</dd></div><div><dt>Type</dt><dd>Sidearm</dd></div></dl>${figures}${noRoute}${note}<footer class="article-footer">Original gameplay capture and route annotations · Last updated: 30 August 2026</footer></main>
<footer class="site-footer"><div><a class="brand" href="../../../"><span class="brand-mark">MS</span><span>Mortal Shell <i>II</i><small>Guide</small></span></a><p>Independent, English-language player guide.</p></div><div class="footer-links"><a href="../../../walkthrough/">Walkthrough</a><a href="../">All sidearms</a><a href="../../../maps/">Maps</a></div><p class="disclaimer">Unofficial fan site. Mortal Shell II and related marks belong to their respective owners.</p></footer></body></html>`;
}

for (const guide of guides) write(path.join(root, 'collectibles', 'sidearms', guide.slug, 'index.html'), guidePage(guide));

const catalogueRows = guides.map((guide) => `<article class="catalog-row"><span class="catalog-number">${guide.number}</span><div><h2>${guide.name}</h2><span class="tag">${guide.region}</span></div><p>${guide.indexText} <a href="${guide.slug}/">Open the annotated guide.</a></p><div class="item-image has-icon"><img src="../../assets/icons/sidearms/${guide.slug}.webp" alt="${guide.name} sidearm icon"></div></article>`).join('\n');
write(path.join(root, 'collectibles', 'sidearms', 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="canonical" href="${guideBase}/collectibles/sidearms/"><meta property="og:url" content="${guideBase}/collectibles/sidearms/"><meta property="og:site_name" content="Mortal Shell II Guide"><meta name="twitter:card" content="summary_large_image"><meta property="og:type" content="website"><meta property="og:title" content="All Sidearm Locations | Mortal Shell II Guide"><meta property="og:description" content="All eight Mortal Shell II sidearm acquisition guides with original annotated routes."><meta name="description" content="All eight Mortal Shell II sidearm acquisition guides with original annotated routes."><title>All Sidearm Locations | Mortal Shell II Guide</title><link rel="stylesheet" href="../../assets/styles.css"><link rel="stylesheet" href="../../assets/catalog.css"><link rel="stylesheet" href="../../assets/item-icons.css"><script defer src="../../assets/app.js"></script><script defer src="../../assets/analytics.js"></script><link rel="icon" href="/favicon.ico" sizes="any"><link rel="apple-touch-icon" href="/apple-touch-icon.png"></head>
<body><header class="site-header"><a class="brand" href="../../"><span class="brand-mark">MS</span><span>Mortal Shell <i>II</i><small>Guide</small></span></a><button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav"><a href="../../">Home</a><a href="../../walkthrough/">Walkthrough</a><a class="active" href="../">Collectibles</a><a href="../../maps/">Maps</a><a href="../../achievements/">Achievements</a></nav></header>
<main><section class="catalog-head"><p class="eyebrow">Collectibles / sidearms</p><h1>All sidearms</h1><p class="lede">Eight sidearm acquisition guides, including the automatic Prologue unlock and seven original annotated pickup routes.</p></section><section class="catalog">${catalogueRows}</section><p class="source-line">Every route image on this page uses supplied gameplay capture. Last updated: 30 August 2026.</p></main>
<footer class="site-footer"><div><a class="brand" href="../../"><span class="brand-mark">MS</span><span>Mortal Shell <i>II</i><small>Guide</small></span></a><p>Independent, English-language player guide.</p></div><div class="footer-links"><a href="../../walkthrough/">Walkthrough</a><a href="../">Collectibles</a><a href="../../maps/">Maps</a></div><p class="disclaimer">Unofficial fan site. Mortal Shell II and related marks belong to their respective owners.</p></footer></body></html>`);

const mapFile = path.join(root, 'maps', 'index.html');
let map = fs.readFileSync(mapFile, 'utf8');
const mapOpening = '<div class="map-results" id="map-results" aria-live="polite">';
const mapEnd = map.indexOf('</div>', map.indexOf(mapOpening));
if (mapEnd < 0) throw new Error('Map results container was not found.');
const newResults = guides.map((guide) => `<a class="map-result" href="../collectibles/sidearms/${guide.slug}/" data-search="${guide.search}"><span>S</span><strong>${guide.name}</strong><small>Sidearm acquisition</small></a>`).join('');
for (const guide of guides) {
  const existing = `../collectibles/sidearms/${guide.slug}/`;
  map = map.replace(new RegExp(`<a class="map-result" href="${existing.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?</a>`, 'g'), '');
}
const adjustedEnd = map.indexOf('</div>', map.indexOf(mapOpening));
map = map.slice(0, adjustedEnd) + newResults + map.slice(adjustedEnd);
write(mapFile, map);

const sitemapFile = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapFile, 'utf8');
for (const guide of guides) sitemap = sitemap.replace(new RegExp(`\\s*<url><loc>${guideBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/collectibles/sidearms/${guide.slug}/</loc></url>`, 'g'), '');
const sitemapUrls = guides.map((guide) => `  <url><loc>${guideBase}/collectibles/sidearms/${guide.slug}/</loc></url>`).join('\n');
sitemap = sitemap.replace('</urlset>', `${sitemapUrls}\n</urlset>`);
write(sitemapFile, sitemap);

console.log(`Published ${guides.length} sidearm guides.`);
