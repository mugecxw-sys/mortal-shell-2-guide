"""Render the editorial route list as crawlable HTML; no build dependency."""
from pathlib import Path
import json, re, html

ROOT = Path(__file__).resolve().parents[1]
escape = html.escape
URL = 'https://mortalshell2guide.xyz/collectibles/tarstones/locations/'
TITLE = 'Mortal Shell 2 All Tarstone Locations & Stoned Trophy Tracker – 73/75 Explained'
DESC = 'Find all 75 base Tarstones by region, track Stoned progress locally, and resolve 73/75/76 counts, missing Tarstones and the Berserker legacy warning.'
catalog = {x['name']: x for x in json.loads((ROOT/'assets/tarstones.json').read_text(encoding='utf-8'))}
rows = []
merchant_names = {
    'Weeping Stone', "Acolyte's Stone", 'Unwieldy Stone', 'Infused Stone',
    'Fulminant Stone', 'Infested Stone', 'Hand of Rock',
}
trial_names = {
    'Retribution Stone', 'Unyielding Stone', "Thief's Stone",
    'Enfeebling Stone', 'Barrage Stone',
}
boss_names = {
    "Justiciar's Stone", 'Volatile Fragment', "Arbiter's Prize", 'Serpent Stone',
    'Voltaic Crown', "Warden's Stone", 'Curseblood Stone', "Wretchcaller's Stone",
    'Inflamed Clawstone', 'Viletongue Hedron', 'Voltaic Amber', "Monarch's Vestige",
    "Magdalena's Memento", "Captive's Scabstone", "Conqueror's Reward",
    'Lost Clotstone', "Scholar's Wormstone", 'Hexapod Core', 'Solnir Shard',
    "Confessor's Keepsake", 'Fusillade Stone', 'Tarred Fragment', 'Strange Remnant',
}
for line in (ROOT/'assets/tarstone-routes.txt').read_text(encoding='utf-8').splitlines():
    if not line or line.startswith('#'): continue
    name, region, beacon, route = line.split('|')
    item = catalog[name]
    method = ('Merchant' if name in merchant_names else 'Trial' if name in trial_names
              else 'Boss / encounter' if name in boss_names else 'Exploration / puzzle')
    rows.append(dict(name=name, id=item['id'], region=region, beacon=beacon, route=route, icon=item.get('icon'), method=method))
assert len(rows) == len({x['id'] for x in rows}) == 75
regions = ['Fainweald', 'Temple of Vatra', "Sester's Abbey", 'Marrow Keep', 'Mammon', 'Collapsed Mine', 'Glutted Mire', 'Sanguine Caverns', "Prisoner's Domain", 'Withered Shoals', 'Conquered Temple', 'Faded Citadel']
slug = lambda s: re.sub('[^a-z0-9]+','-',s.lower()).strip('-')
def card(r):
    image = f'<img src="{r["icon"]}" alt="" width="72" height="72" loading="lazy" decoding="async">' if r['icon'] else '<span class="stone-no-art" aria-hidden="true">◇</span>'
    status = 'Legacy Missable / Update Your Game' if r['name'] == "Berserker's Stone" else 'No known current missable restriction'
    if r['name'] in ['Gloombound Stone', "Justiciar's Stone"]: status = 'Repeatable Fragile stone after Week 1'
    return f'''<article class="location-card" id="{r['id']}" data-region="{escape(r['region'])}" data-method="{r['method']}">
<div class="stone-heading">{image}<h3><label><input type="checkbox" data-stone="{r['id']}" disabled> {escape(r['name'])}</label></h3></div>
<dl><div><dt>Region / route area</dt><dd>{escape(r['region'])}</dd></div><div><dt>Beacon / route anchor</dt><dd>{escape(r['beacon'])}</dd></div><div><dt>Acquisition</dt><dd>{r['method']}</dd></div></dl>
<p>{escape(r['route'])}</p><p class="stone-status{' legacy-status' if 'Legacy' in status else ''}">{status}</p>
<a href="/collectibles/tarstones/#{r['id']}">Effect &amp; game icon →</a></article>'''

sections = '\n'.join(f'<section class="route-region" id="region-{slug(region)}"><h2>{escape(region)} <small>{sum(r["region"] == region for r in rows)} Tarstones</small></h2><div class="location-grid">'+ '\n'.join(card(r) for r in rows if r['region'] == region)+'</div></section>' for region in regions)
options = ''.join(f'<option>{escape(x)}</option>' for x in regions)
regionnav = ''.join(f'<a href="#region-{slug(x)}" data-region-jump="{escape(x)}">{escape(x)}</a>' for x in regions)
faq = [
('How many Tarstones do I need for Stoned?', 'The widely reported target is 73 acquisitions from the 75-name base list. This browser checklist cannot read your game or confirm a platform unlock; keep comparing names if the trophy remains locked.'),
('Why does this site list 76 Tarstones elsewhere?', 'The effects database contains 76 exported English text entries, including Meteor Stone, which is outside this 75-name location list. A text entry is not proof of a separate obtainable world pickup.'),
('Are Egon\'s Stone and Glimpse Stone part of these 75?', 'They are post-launch additions, outside this fixed base checklist. Fragile duplicates and expanded guide indexes explain why a current inventory or map can show more entries.'),
('Is Berserker\'s Stone still permanently missable?', 'The Week 1 official notes fix the Temple of Vatra permanent lockout. Update your game. On an old build, collect the offering chest before taking the Heart and leaving.'),
('Do I need to upgrade every Tarstone?', 'No upgrade requirement is reported for Stoned. Track collection separately from tempering and Tarcore farming.'),
('Where is my checklist saved?', 'Only in localStorage in this browser on this device. It requires no account. Clearing site data or using another browser removes or separates that progress.'),
('Does a green Stoned bar mean the trophy has unlocked?', 'It means you have checked at least 73 names here. Verify the actual trophy in your game or platform; the website does not connect to your save.')]
faqhtml = ''.join(f'<details><summary>{escape(q)}</summary><p>{escape(a)}</p></details>' for q,a in faq)
schema = {'@context':'https://schema.org','@graph':[{'@type':'Article','headline':TITLE,'description':DESC,'datePublished':'2026-09-06','dateModified':'2026-09-06','inLanguage':'en','mainEntityOfPage':URL,'author':{'@type':'Organization','name':'Mortal Shell II Guide'},'image':'https://mortalshell2guide.xyz/assets/icons/tarstones/berserker-s-stone.webp'}, {'@type':'ItemList','name':'75 base Tarstone locations','numberOfItems':75,'itemListElement':[{'@type':'ListItem','position':i+1,'name':r['name'],'url':URL+'#'+r['id']} for i,r in enumerate(rows)]},{'@type':'FAQPage','mainEntity':[{'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}} for q,a in faq]}]}
content = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(TITLE)}</title><meta name="description" content="{escape(DESC)}"><link rel="canonical" href="{URL}">
<meta property="og:title" content="{escape(TITLE)}"><meta property="og:description" content="{escape(DESC)}"><meta property="og:url" content="{URL}"><meta property="og:type" content="article"><meta property="og:site_name" content="Mortal Shell II Guide"><meta property="og:image" content="https://mortalshell2guide.xyz/assets/icons/tarstones/berserker-s-stone.webp"><meta name="twitter:card" content="summary"><meta name="theme-color" content="#111011">
<link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/styles.css"><link rel="stylesheet" href="/assets/pages.css"><link rel="stylesheet" href="/assets/tarstone-locations.css">
<script defer src="/assets/app.js"></script><script defer src="/assets/tarstone-locations.js"></script><script defer src="/assets/analytics.js"></script>
<script type="application/ld+json">{json.dumps(schema,ensure_ascii=False)}</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8314050776909018" crossorigin="anonymous"></script></head>
<body><a class="skip-link" href="#tracker">Skip to tracker</a><header class="site-header"><a class="brand" href="/"><span class="brand-mark">MS</span><span>Mortal Shell <i>II</i><small>Guide</small></span></a><button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav" aria-label="Main navigation"><a href="/">Home</a><a href="/walkthrough/">Walkthrough</a><a href="/collectibles/" class="active">Collectibles</a><a href="/maps/">Maps</a><a href="/achievements/">Achievements</a></nav></header>
<main class="page-shell locations-page"><p class="eyebrow">Collection routes · Checked September 6, 2026 · Spoilers</p>
<h1>All Tarstone Locations<br><span>&amp; Stoned Trophy Tracker</span></h1>
<p class="lede">Find the missing name, finish the route, tick it off. A stable 75-item base checklist for Mortal Shell 2, with the reported 73/75 Stoned target kept separate from your inventory total.</p>
<section class="quick-stoned" aria-labelledby="quick-answer"><img src="/assets/icons/achievements/steam-50.jpg" alt="Stoned trophy icon" width="64" height="64"><div><h2 id="quick-answer">Quick Answer · Stoned</h2><p><strong>Find all Tarstones.</strong> The current <a href="https://www.powerpyx.com/mortal-shell-2-all-tarstone-locations/">PowerPyx checklist</a> reports a <strong>73 of 75</strong> threshold. Collection, not maximum tempering, is the goal. Check the actual platform unlock separately.</p></div></section>
<section id="tracker" class="tracker-panel" aria-labelledby="tracker-title"><h2 id="tracker-title">Your collection</h2><div class="progress-pair"><div><strong id="collected-count">Collected 0/75</strong><progress id="collected-progress" max="75" value="0" aria-label="Base Tarstones collected"></progress></div><div id="stoned-panel"><strong id="stoned-count">Stoned 0/73</strong><progress id="stoned-progress" max="73" value="0" aria-label="Reported Stoned threshold"></progress></div></div><p id="threshold-note" role="status">73 checked names reaches the reported target; you can continue to 75.</p>
<div class="tracker-controls"><label>Search<input type="search" id="location-search" placeholder="Name, Beacon or route…" disabled></label><label>Region<select id="location-region" disabled><option value="">All regions</option>{options}</select></label><label>Acquisition type<select id="location-method" disabled><option value="">All types</option><option>Exploration / puzzle</option><option>Boss / encounter</option><option>Trial</option><option>Merchant</option></select></label></div>
<div class="tracker-actions"><button id="missing-toggle" aria-pressed="false" disabled>Missing Only</button><button id="clear-filters" disabled>Clear Filters</button><button id="reset-progress" disabled>Reset Progress</button></div><p id="results-count" role="status">Showing 75 of 75 Tarstones</p><p id="storage-note" class="small-note">Progress stays in this browser. No login or game-save access.</p><noscript><p>Enable JavaScript to save progress and filter. All 75 routes remain readable below.</p></noscript></section>
<nav class="article-links" aria-label="Guide sections"><a href="#counts">73 / 75 / 76 explained</a><a href="#legacy">Berserker warning</a><a href="#missing">Common misses</a><a href="#troubleshooting">Stoned not unlocking</a><a href="#faq">FAQ</a></nav>
<p class="map-entry"><a href="/maps/?filter=tarstones">Open Tarstones on Map →</a> · <a href="/collectibles/tarstones/">Tarstone effects database →</a></p>
<section id="counts"><h2>73 vs 75 vs 76 vs higher post-patch counts</h2><div class="count-explainer"><p><strong>73</strong>The reported Stoned acquisition threshold, corroborated by <a href="https://steamcommunity.com/app/2584270/?l=english">community checklist reports on Steam</a>. It is not a guarantee that any save showing 73 inventory objects has qualified.</p><p><strong>75</strong>The fixed base name list used here. Each checkbox represents one name, even when the game provides another copy.</p><p><strong>76</strong>Our <a href="/collectibles/tarstones/">exported effects catalogue</a> has 76 text entries. Meteor Stone is the extra text name; its presence in exported data does not establish an additional location.</p><p><strong>75+</strong>Week 1 added Egon's Stone and Glimpse Stone and repeatable Fragile copies. <a href="https://www.gamerguides.com/mortal-shell-ii/checklists/tarstones-locations">Gamer Guides lists 79 location entries</a> at this check. An index total, unique-name total and inventory quantity measure different things.</p></div>
<h3>Version note: Week 1 and September 5 update</h3><p>The <a href="https://store.steampowered.com/news/app/2584270/view/690892955941077484">official Week 1 announcement</a> converts Justiciar's Stone and Gloombound Stone to Fragile items and expands repeatable supplies. The <a href="https://steamcommunity.com/app/2584270/allnews/">September 5 official update</a> repairs Fragile Tarcore payouts and Gloombound durability when recovering your own Gloom. Neither publishes a replacement complete Tarstone total or promises a universal Stoned fix. Check your installed platform build; these notes are version-sensitive.</p></section>
<aside id="legacy" class="legacy-warning"><h2>Berserker's Stone · Legacy Missable / Update Your Game</h2><p>The official Week 1 notes explicitly repair the permanent Vatra's Temple lockout. Treat the old permanent-missable warning as a <strong>pre-update issue</strong>. On an old build, loot the three-candle offering chest before taking the Heart of Vatra and leaving. On an updated build, revisit the temple if this name is missing; the notes do not document every previously damaged save's recovery. <a href="https://store.steampowered.com/news/app/2584270/view/690892955941077484">Official Week 1 fix: Softlocks and Lost Progress</a>.</p></aside>
<h2 id="all-locations">All 75 Tarstone locations by region</h2><p>Use the named Beacon as an approach anchor, not a claim that it is the nearest newly added Mini-Beacon. Where the exact Beacon is unverified, a route note identifies the dungeon or arena. Sester's Abbey, Temple of Vatra and Collapsed Mine are kept as separate route areas. Acquisition filters describe how to obtain a stone, not its equipment slot.</p>
<nav class="region-nav" aria-label="Region navigation">{regionnav}</nav><p id="no-locations" hidden>No routes match. Clear filters or switch to Show All.</p>
{sections}
<section id="missing"><h2>Common missing Tarstones: check these first</h2>
<p><strong>Night shopping:</strong> compare <a href="#weeping-stone">Weeping Stone</a>, <a href="#infused-stone">Infused Stone</a>, <a href="#fulminant-stone">Fulminant Stone</a> and <a href="#infested-stone">Infested Stone</a> at The Collector.</p>
<p><strong>Easy-to-overlook menus:</strong> <a href="#hand-of-rock">Hand of Rock</a> is sold under Order Drink. Merrick sells <a href="#acolyte-s-stone">Acolyte's Stone</a> and <a href="#unwieldy-stone">Unwieldy Stone</a>.</p><p><strong>Hidden routes:</strong> check <a href="#unstable-stone">Unstable Stone</a>, <a href="#pulse-stone">Pulse Stone</a> and <a href="#frostshard-stone">Frostshard Stone</a> before assuming your last pickup is a boss reward.</p></section>
<section id="troubleshooting"><h2>Stoned not unlocking after 73 or 75?</h2><ol><li>Compare unique names with the checklist. Extra Fragile copies are not extra completed names. Check Night Mode purchases and concealed chests.</li><li>Check the installed update and actual platform trophy state. The green browser bar is only a manual planning aid.</li><li><strong>Community-reported workaround:</strong> save normally, exit to the menu and reload; if needed, close and restart the game. PowerPyx comments dated August 30, September 1 and September 6 report success. This is not an officially confirmed Stoned repair and may do nothing for another save. <a href="https://www.powerpyx.com/mortal-shell-2-all-tarstone-locations/#comments">Read the player reports</a>.</li><li>If still locked, record the platform, installed build, platform counter and missing names for a bug report. Keep your established save; do not assume NG+ or deleting it is necessary.</li></ol><p>Holding or buying a Fragile Tarstone has also been suggested in community discussions, but this review could not independently verify the specific recent report cited in earlier drafts. It is <strong>not a verified requirement or official fix</strong>, and this guide does not recommend spending resources on that assumption.</p><p>For achievement restrictions unrelated to collection, see the <a href="/guides/missable-trophies/#slayer-seal">Slayer Seal warning</a>.</p></section>
<section id="faq"><h2>Tarstone location FAQ</h2>{faqhtml}</section>
<section id="verification"><h2>Verification note</h2><p>Checked September 6, 2026 against official Steam update notes, public location guides and the site's supplied English game-text export. This is an original editorial synthesis, not a claim of firsthand gameplay testing. Routes use the base acquisition locations; Week 1 changed some reward containers and added repeatable supplies. Follow the named area if a chest is now a loose pickup.</p><p>Names and matched UI artwork come from the existing export. Headsman's Stone and Unwieldy Stone retain the export spellings; some guides use Headman's or Unwieldly. Unknown artwork is omitted. Existing map markers have no confirmed English Tarstone names, so the map link filters all Tarstones without inventing single-point matches.</p><p>Route cross-checks: <a href="https://www.100pguides.com/guides/mortal-shell-2-all-tarstone-locations">100% Guides</a> · <a href="https://www.powerpyx.com/mortal-shell-2-all-tarstone-locations/">PowerPyx</a> · <a href="https://www.gamerguides.com/mortal-shell-ii/checklists/tarstones-locations">Gamer Guides</a>. Supplementary comparisons: <a href="https://showgamer.com/en/guides/5325-vse-tarity-v-mortal-shell-2">ShowGamer</a> · <a href="https://gamingpromax.com/all-tarstone-locations-in-mortal-shell-2/">GamingProMax</a> · <a href="https://bo3.gg/games/articles/all-tarstone-locations-in-mortal-shell-2">Bo3</a> · <a href="https://patchcrazy.co.uk/all-75-tarstones-locations-in-mortal-shell-2/">Patch Crazy</a> · <a href="https://www.gamesradar.com/games/rpg/mortal-shell-2-tarstones/">GamesRadar+</a>. Conflicting names, effects and blanket regional headings in secondary lists are not treated as authoritative.</p></section>
<nav class="article-links" aria-label="Related guides"><a href="/collectibles/tarstones/">76-entry effects catalogue</a><a href="/achievements/#achievement-stoned">Stoned achievement card</a><a href="/guides/missable-trophies/">Missable trophies</a><a href="/collectibles/map-fragments/">Map Fragment routes</a><a href="/guides/upgrade-materials/">Tarforge &amp; upgrade materials</a><a href="/collectibles/">All collectibles</a></nav></main>
<footer class="site-footer"><p>Independent Mortal Shell II Guide · Verified September 6, 2026</p><p class="disclaimer">Unofficial fan site. Mortal Shell II and related marks belong to their respective owners.</p></footer></body></html>'''
# Keep shopping cleanup concise and avoid inventing a fifth Collector item.
content = re.sub(r'<ul><li><strong>The Collector.*?</li></ul>\n', '', content)
content = content.replace('There are four named purchases here, not five.', 'Check all four names individually.')
out = ROOT/'collectibles/tarstones/locations/index.html'
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(content, encoding='utf-8')
print(f'Rendered {len(rows)} routes; {sum(bool(r["icon"]) for r in rows)} matched icons.')
