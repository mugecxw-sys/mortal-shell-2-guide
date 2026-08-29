const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const guides = [
  {slug:'the-iconoclast',name:'The Iconoclast',region:'Prologue',start:'Complete the Prologue',damage:'35',lede:'The Iconoclast is the starting primary weapon. It is automatically available after completing the Prologue; no separate route or pickup is required.',steps:[],note:'This weapon is available immediately after the Prologue and can be upgraded at the Tarforge to Lv.20.'},
  {slug:'axatana',name:'Axatana',region:'Mammon',start:"Sester's Gate Beacon",damage:'25 / 35',steps:[
    'Travel to <span class="item-name">Sester\'s Gate Beacon</span>.',
    'Head behind the Beacon, climb the marked stairs and turn right.',
    'Turn left at the cliff, drop down, then use the jump device to reach <span class="item-name">Forgotten Tower</span>.',
    'After the jump, turn back and enter at the right-rear opening. Turn left and climb the stairs.',
    'Leave by the right side of the stairs and use the next jump device.',
    'At the gate, activate the switch to open it. Defeat the enemies in the room to collect <span class="item-name">Axatana</span>.'
  ]},
  {slug:'axe-dagger',name:'Axe & Dagger',region:'Fainweald',start:'Mushroom Village Beacon',damage:'30',steps:[
    'Travel to <span class="item-name">Mushroom Village Beacon</span> and take the left route.',
    'Use the key to enter <span class="item-name">Shrine of Trials</span>. Defeat the enemies, read the note behind the stone statue, then back away while facing it to open the door.',
    'Inside, strike the stone blocks into the arrow-marked positions to open each room. Defeat the enemies, place the final block on its pressure plate, then collect <span class="item-name">Axe &amp; Dagger</span> at the statue.'
  ]},
  {slug:'black-needle',name:'Black Needle',region:'Mammon',start:"Sester's Gate Beacon",damage:'35',steps:[
    'Travel to <span class="item-name">Sester\'s Gate Beacon</span>, choose <span class="item-name">Cleanse Beacon</span>, then enter <span class="item-name">Sester\'s Bastion</span>.',
    'Move forward until the broken stone bridge. Strike the bell to activate its broken path.',
    'The bridge has three breaks. Go beneath it and find the three bells shown.',
    'Strike each bell once to restore every bridge section.',
    'Return to the bridge, continue to its end and use the jump device.',
    'Move forward after landing. Defeat the enemy that appears to receive <span class="item-name">Black Needle</span>.'
  ]},
  {slug:'clockwork-scythe',name:'Clockwork Scythe',region:'Mammon',start:'The Silent Steps Beacon',damage:'42',steps:[
    'Travel to <span class="item-name">The Silent Steps Beacon</span>.',
    'Use the portal, move forward and turn left onto the marked platform.',
    'Defeat <span class="item-name">Sariel</span> in the first encounter.',
    'Follow the smoke trail to the stone door after the first victory; it opens automatically.',
    'Continue to the end of the route and enter the <span class="item-name">Chamber of Becoming</span>. Approach enemies can be bypassed if you only want this weapon.',
    'Continue through Sariel\'s encounters to the final chamber.',
    'Break all four corner obelisks in the final room, otherwise Sariel continues to revive.',
    'Defeat Sariel after the obelisks are destroyed.',
    'Receive the <span class="item-name">Clockwork Scythe</span> after the final victory.'
  ]},
  {slug:'great-martyrs-blade',name:"Great Martyr's Blade",region:'Fainweald',start:'Gloomshade Grove Beacon',damage:'38',steps:[
    'Travel to <span class="item-name">Gloomshade Grove Beacon</span> and enter the cave.',
    'Follow the arrow through the cave exit.',
    'Turn right outside.',
    'At the next junction, turn left and follow the route to its end.',
    'Enter the marked doorway to reach <span class="item-name">Martyr\'s Prison</span>.',
    'Defeat the enemies in the first room, then enter the arrow-marked side room and activate the switch.',
    'Go through the newly opened main gate.',
    'Defeat every enemy in the next room.',
    'Break the marked boxes in the room to reveal the passage.',
    'Follow the passage into the final chamber.',
    'Collect <span class="item-name">Great Martyr\'s Blade</span>.'
  ]},
  {slug:'obsidian-hammer',name:'Obsidian Hammer',region:'Mammon',start:'Outskirts of Mammon Beacon',damage:'65',steps:[
    'Travel to <span class="item-name">Outskirts of Mammon Beacon</span> and take the indicated downhill route.',
    'Continue down the marked path to its end and use the traversal device.',
    'After crossing, turn right, cross the bridge and keep following the route.',
    'At <span class="item-name">Deserted Slums</span>, climb the stairs, drop at the first marked point, then enter at the second marked point.',
    'Reach <span class="item-name">Obsidianite Mines</span>, move forward and descend at the arrow until you reach the bottom.',
    'Follow the first indicated route, drop at the second point, then use the jump device to rise back up.',
    'Continue through the mine toward the boss arena.',
    'Defeat the boss to receive <span class="item-name">Obsidian Hammer</span>.'
  ]},
  {slug:'veterans-battle-axe',name:"Veteran's Battle Axe",region:'Fainweald',start:'Blackridge Pass Beacon',damage:'38',steps:[
    'Travel to <span class="item-name">Blackridge Pass Beacon</span>.',
    'Move forward into <span class="item-name">Blackridge Cliffs</span> and follow the route to the left.',
    'Continue until the marked right-hand descent.',
    'Enter through the opening at the bottom.',
    'Reach <span class="item-name">The King\'s Crypt</span> and follow it to the end.',
    'Defeat the enemies in the final room and locate the headless body on the floor.',
    'Collect <span class="item-name">Veteran\'s Battle Axe</span> from the body.'
  ]}
];

const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const page = guide => {
  const figures = guide.steps.map((step, i) => `<figure class="route-figure"><img src="../../../assets/images/weapon-guides/${guide.slug}/route-${String(i + 1).padStart(2,'0')}.webp" loading="${i === 0 ? 'eager' : 'lazy'}" alt="Annotated ${esc(guide.name)} acquisition route ${i + 1}"><figcaption><strong>Route ${String(i + 1).padStart(2,'0')}</strong>${step}</figcaption></figure>`).join('');
  const route = figures || '<aside class="route-guide-note"><p><strong>Automatic unlock:</strong> Complete the Prologue to receive The Iconoclast. This weapon does not have a separate pickup location.</p></aside>';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="How to get ${esc(guide.name)} in Mortal Shell II, with annotated route steps and verified weapon data."><link rel="canonical" href="https://mortalshell2guide.xyz/collectibles/weapons/${guide.slug}/"><meta property="og:url" content="https://mortalshell2guide.xyz/collectibles/weapons/${guide.slug}/"><meta property="og:site_name" content="Mortal Shell II Guide"><meta property="og:type" content="article"><meta property="og:title" content="How to Get ${esc(guide.name)} | Mortal Shell II Guide"><meta property="og:description" content="Annotated ${esc(guide.name)} acquisition route."><meta name="twitter:card" content="summary_large_image"><title>How to Get ${esc(guide.name)} | Mortal Shell II Guide</title><link rel="icon" href="../../../favicon.ico" sizes="any"><link rel="apple-touch-icon" href="../../../apple-touch-icon.png"><link rel="stylesheet" href="../../../assets/styles.css"><link rel="stylesheet" href="../../../assets/articles.css"><script defer src="../../../assets/app.js"></script><script defer src="../../../assets/analytics.js"></script></head><body><header class="site-header"><a class="brand" href="../../../"><span class="brand-mark">MS</span><span>Mortal Shell <i>II</i><small>Guide</small></span></a><button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav" aria-label="Main navigation"><a href="../../../">Home</a><a href="../../../walkthrough/">Walkthrough</a><a class="active" href="../../">Collectibles</a><a href="../../../maps/">Maps</a><a href="../../../achievements/">Achievements</a></nav></header><main class="guide-article"><p class="eyebrow">Primary weapon acquisition · ${esc(guide.region)}</p><h1>How to get<br>${esc(guide.name)}</h1><p class="lede">${guide.lede || `Follow this captured route from <span class="item-name">${esc(guide.start)}</span> to obtain <span class="item-name">${esc(guide.name)}</span>.`}</p><dl class="facts"><div><dt>Region</dt><dd>${esc(guide.region)}</dd></div><div><dt>Starting point</dt><dd>${esc(guide.start)}</dd></div><div><dt>Base damage</dt><dd>${esc(guide.damage)}</dd></div></dl>${route}<aside class="route-guide-note"><p><strong>Weapon data:</strong> ${guide.note || `${esc(guide.name)} is a Tarforge-upgradeable primary weapon with a verified Lv.20 cap. See the <a href="../">primary weapons database</a> for its attack-kit and upgrade summary.`}</p></aside><footer class="article-footer">Original gameplay capture and route annotations · Last updated: 29 August 2026</footer></main><footer class="site-footer"><div><a class="brand" href="../../../"><span class="brand-mark">MS</span><span>Mortal Shell <i>II</i><small>Guide</small></span></a><p>Independent, English-language player guide.</p></div><div class="footer-links"><a href="../../../walkthrough/">Walkthrough</a><a href="../">All primary weapons</a></div><p class="disclaimer">Unofficial fan site. Mortal Shell II and related marks belong to their respective owners.</p></footer></body></html>`;
};

for (const guide of guides) {
  const out = path.join(root, 'collectibles', 'weapons', guide.slug, 'index.html');
  fs.mkdirSync(path.dirname(out), {recursive:true});
  fs.writeFileSync(out, page(guide));
}

let weapons = fs.readFileSync(path.join(root,'collectibles','weapons','index.html'),'utf8');
for (const guide of guides) {
  const heading = guide.name.replace('&','&amp;');
  const finder = new RegExp(`(<h2>${heading.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}</h2>[\\s\\S]*?<p class="kit">[\\s\\S]*?</p>)`);
  weapons = weapons.replace(finder, `$1<p class="guide-link">Get the <a href="${guide.slug}/">annotated ${guide.name} route</a>.</p>`);
}
weapons = weapons.replace('Acquisition routes and original captures will be added separately as the route archive is verified.', 'Every primary weapon now has an annotated acquisition page using original route captures.');
fs.writeFileSync(path.join(root,'collectibles','weapons','index.html'),weapons);

let maps = fs.readFileSync(path.join(root,'maps','index.html'),'utf8');
const marker = '<a class="map-result" href="../collectibles/shells/genessa/" data-search="genessa shell abbey entrance revenant graves sester censer"><span>G</span><strong>Genessa</strong><small>Shell acquisition</small></a>';
const results = guides.map(g=>`<a class="map-result" href="../collectibles/weapons/${g.slug}/" data-search="${g.name.toLowerCase()} primary weapon ${g.start.toLowerCase()}"><span>W</span><strong>${g.name}</strong><small>Weapon acquisition</small></a>`).join('');
if (!maps.includes('../collectibles/weapons/the-iconoclast/')) maps = maps.replace(marker, `${marker}${results}`);
fs.writeFileSync(path.join(root,'maps','index.html'),maps);

let sitemap = fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
for (const guide of guides) {
  const entry = `  <url><loc>https://mortalshell2guide.xyz/collectibles/weapons/${guide.slug}/</loc></url>`;
  if (!sitemap.includes(`/collectibles/weapons/${guide.slug}/`)) sitemap = sitemap.replace('</urlset>', `${entry}\n</urlset>`);
}
fs.writeFileSync(path.join(root,'sitemap.xml'),sitemap);
