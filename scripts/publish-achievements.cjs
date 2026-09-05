const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const baseUrl = 'https://mortalshell2guide.xyz';
const entries = [
  ['You’re More Than a Weapon', 'Claim your first Shell, primary weapon, and sidearm.', 'Bronze', 'progress'],
  ['Home at Last', 'Reach Marrow Keep for the first time.', 'Bronze', 'progress'],
  ['Mid Summer?', 'Accept Marigold’s flower crown and enter the Festival during the Prologue.', 'Bronze', 'missable'],
  ['Forever Alone?', 'Unlock Tiel.', 'Bronze', 'shells'],
  ['Arrival', 'Unlock Proxima.', 'Bronze', 'shells'],
  ['Haunting Times', 'Watch any Shell Memory from the Shellkeeper bond menu.', 'Bronze', 'completion'],
  ['Deep Cuts', 'Unlock Axe & Dagger.', 'Bronze', 'gear'],
  ['Old School', 'Unlock the Forgotten Crossbow.', 'Bronze', 'gear'],
  ['Wheelie Good Time', 'Defeat Magdalena, the Lady of the Woods.', 'Bronze', 'bosses'],
  ['Cut You Down to Size', 'Unlock the Veteran’s Battle Axe.', 'Bronze', 'gear'],
  ['Vengeance is Mine', 'Unlock Eredrim.', 'Bronze', 'shells'],
  ['Big Boi', 'Unlock Great Martyr’s Blade.', 'Bronze', 'gear'],
  ['Meat’s Back on the Menu, Boys!', 'Defeat The Lost Child.', 'Bronze', 'bosses'],
  ['My Brether', 'Unlock Smert.', 'Bronze', 'shells'],
  ['Heartless', 'Unlock Gragu.', 'Bronze', 'shells'],
  ['Chop Chop', 'Unlock the Salvaged Trebuchaxe.', 'Bronze', 'gear'],
  ['Decked Out', 'Reach the maximum Shell bonding tier at the Shellkeeper.', 'Silver', 'completion'],
  ['Dual Wielding', 'Unlock Axatana.', 'Bronze', 'gear'],
  ['Headcase', 'Defeat The Nameless Captive.', 'Bronze', 'bosses'],
  ['Old Painless', 'Unlock the Triarch Repeater.', 'Bronze', 'gear'],
  ['Point Taken', 'Unlock Black Needle.', 'Bronze', 'gear'],
  ['Like Clockwork', 'Unlock the Clockwork Scythe.', 'Bronze', 'gear'],
  ['Spiked', 'Unlock the Caged Hystrix.', 'Bronze', 'gear'],
  ['The Alchemist', 'Unlock Sariel.', 'Bronze', 'shells'],
  ['Sester', 'Unlock Sester Genessa.', 'Bronze', 'shells'],
  ['Stop – Hammer Time', 'Unlock the Obsidian Hammer.', 'Bronze', 'gear'],
  ['Over 9000', 'Upgrade any primary weapon to the Tarforge maximum.', 'Silver', 'completion'],
  ['Beautiful Baby', 'Unlock the Cursed Child.', 'Bronze', 'gear'],
  ['Speared', 'Unlock the Ballistazooka.', 'Bronze', 'gear'],
  ['Down with the Thickness', 'Unlock Lazlo.', 'Bronze', 'shells'],
  ['Something in the deep…', 'Defeat Hexapod.', 'Bronze', 'bosses'],
  ['It burnssssssssss', 'Defeat Droeg, the Conqueror.', 'Bronze', 'bosses'],
  ['Baghead', 'Complete Baghead’s optional dialogue chain and its hidden ending.', 'Bronze', 'completion'],
  ['Nightmare Fuel', 'Defeat Sir Isaac, the Scholar-Prince.', 'Bronze', 'bosses'],
  ['Feed Me', 'Give Egon a cumulative 10,000 Gloom until he passes away.', 'Bronze', 'completion'],
  ['Sat Nav', 'Find every Map Fragment.', 'Silver', 'completion'],
  ['Lord of War', 'Unlock every primary weapon.', 'Silver', 'gear'],
  ['Heavy Metal', 'Play all five Troubadour’s Lute tracks.', 'Silver', 'gear'],
  ['Shell Seeker', 'Unlock every permanent Shell.', 'Silver', 'shells'],
  ['Guns. Lots of Guns', 'Unlock all sidearms.', 'Silver', 'gear'],
  ['Bring My Ova Back to Me', 'Collect every Ova by cleansing Beacons.', 'Silver', 'completion'],
  ['Lost Your Head', 'Defeat Orrem, the Reclaimed.', 'Bronze', 'bosses'],
  ['Ultimate Gainz', 'Defeat Malborn Offspring.', 'Bronze', 'bosses'],
  ['Praise him!', 'Defeat The Monolith.', 'Bronze', 'bosses'],
  ['Ascension', 'Discover the secret of the Mango.', 'Bronze', 'completion'],
  ['It’s over now?', 'Defeat Zmey, the Unbidden.', 'Bronze', 'bosses'],
  ['This is Not an Achievement', 'Complete Mortal Shell II.', 'Gold', 'progress'],
  ['No, You Still Can’t Win', 'Reduce the Prologue Tar Golem to minimum health.', 'Bronze', 'missable'],
  ['So Fresh, So Clean', 'Cleanse all Beacons.', 'Bronze', 'completion'],
  ['Stoned', 'Find every Tarstone.', 'Silver', 'completion'],
  ['Peter’s Perfect Parry', 'Perfect Guard every hit in The Nameless Captive’s qualifying headspin with the Untarnished Seal equipped.', 'Bronze', 'missable'],
  ['Seeking the Past', 'Watch all 40 Shell Memories.', 'Silver', 'completion'],
  ['No Lifer', 'Steam: complete every other achievement. PS5: earn every other base-game trophy to receive Platinum.', 'Platinum', 'completion'],
];

const sections = [
  ['missable', 'Start here: missables', 'Do these before moving past their one-time encounters.'],
  ['progress', 'Story milestones', 'Main-progression and final-completion requirements.'],
  ['gear', 'Weapons & sidearms', 'Unlock each listed item, then complete the all-gear goals.'],
  ['shells', 'Shells & memories', 'Permanent Shell unlocks and the long-term memory requirement.'],
  ['bosses', 'Boss victories', 'Encounter completion only; no build advice is required.'],
  ['completion', 'Exploration & completion', 'World cleanup, upgrades, optional interactions, and the final platform goal.'],
];

function esc(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function icon(index) {
  return `../assets/icons/achievements/steam-${String(index + 1).padStart(2, '0')}.jpg`;
}

function card(entry, index) {
  const [name, requirement, tier, section] = entry;
  const tierClass = `ps5-${tier.toLowerCase()}`;
  const isMissable = section === 'missable';
  const platform = name === 'No Lifer' ? 'Steam completion / PS5 Platinum' : 'Steam achievement / PS5 trophy';
  const requirementHtml = name === 'Sat Nav' ? `${esc(requirement)} <a href="../collectibles/map-fragments/">Open all 11 routes.</a>` : esc(requirement);
  return `<article class="achievement-card${isMissable ? ' is-missable' : ''}"><img src="${icon(index)}" width="64" height="64" loading="lazy" decoding="async" alt="Official Steam icon for ${esc(name)}"><div><h3>${esc(name)}</h3><p>${requirementHtml}</p><div class="achievement-meta"><span>${platform}</span><span class="${tierClass}">PS5 ${tier}</span>${isMissable ? '<span class="missable-tag">Missable</span>' : ''}</div></div></article>`;
}

const body = sections.map(([id, title, description]) => {
  const cards = entries.map((entry, index) => ({ entry, index })).filter(({ entry }) => entry[3] === id).map(({ entry, index }) => card(entry, index)).join('\n');
  return `<section class="achievement-section" id="${id}"><header><div><p class="eyebrow">${id === 'missable' ? 'First playthrough priority' : 'Completion checklist'}</p><h2>${title}</h2></div><p>${description}</p></header><div class="achievement-grid">${cards}</div></section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="canonical" href="${baseUrl}/achievements/"><meta property="og:url" content="${baseUrl}/achievements/"><meta property="og:site_name" content="Mortal Shell II Guide"><meta property="og:type" content="website"><meta property="og:title" content="Mortal Shell II Achievements & PS5 Platinum Guide"><meta property="og:description" content="All 53 Steam achievements and the PS5 Platinum requirements for Mortal Shell II, with official Steam achievement icons."><meta name="description" content="All 53 Steam achievements and the PS5 Platinum requirements for Mortal Shell II, with official Steam achievement icons."><meta name="twitter:card" content="summary_large_image"><title>Mortal Shell II Achievements & PS5 Platinum Guide</title><link rel="stylesheet" href="../assets/styles.css"><link rel="stylesheet" href="../assets/pages.css"><link rel="stylesheet" href="../assets/achievements.css"><script defer src="../assets/app.js"></script><script defer src="../assets/analytics.js"></script><link rel="icon" href="/favicon.ico" sizes="any"><link rel="apple-touch-icon" href="/apple-touch-icon.png"></head>
<body><header class="site-header"><a class="brand" href="../"><span class="brand-mark">MS</span><span>Mortal Shell <i>II</i><small>Guide</small></span></a><button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav"><a href="../">Home</a><a href="../walkthrough/">Walkthrough</a><a href="../collectibles/">Collectibles</a><a href="../maps/">Maps</a><a class="active" href="./">Achievements</a></nav></header>
<main class="page-shell"><p class="eyebrow">Completion checklist · Steam + PS5</p><h1 class="page-title">Achievements<br><em>& Platinum</em></h1><p class="lede">Every requirement is listed directly. Steam and PS5 share the same base-game objectives; PS5 awards the <span class="item-name">No Lifer</span> Platinum after the other trophies are complete.</p>
<section class="completion-summary"><div><p class="eyebrow">Platform scope</p><h2>One complete checklist</h2><p>Steam lists 53 achievements, including its final completion award. PS5 lists 53 trophies: 1 Platinum, 1 Gold, 10 Silver, and 41 Bronze. This page uses the official Steam icon for each matching entry.</p></div><div class="platform-counts"><div class="platform-count"><strong>53</strong><span>Steam achievements</span></div><div class="platform-count"><strong>53</strong><span>PS5 trophies</span></div><div class="platform-count"><strong>3</strong><span>Missables</span></div><div class="platform-count"><strong>40</strong><span>Shell Memories</span></div></div></section>
<aside class="missable-alert"><strong>Do not miss these:</strong><p><span class="item-name">Mid Summer?</span> is in the Prologue, <span class="item-name">No, You Still Can’t Win</span> is the one-time Tar Golem tutorial encounter, and <span class="item-name">Peter’s Perfect Parry</span> must be completed during The Nameless Captive fight. Do not equip the Slayer Seal on a completion save: it disables achievement and trophy progress for that save.</p></aside>
${body}
<p class="source-line">Requirements verified against the <a href="https://steamcommunity.com/stats/2584270/achievements" rel="external">official Steam achievement list</a>. Hidden-condition and PS5 Platinum checks cross-referenced with <a href="https://www.powerpyx.com/mortal-shell-2-trophy-guide-roadmap/" rel="external nofollow">PowerPyx’s PS5 roadmap</a>. Last reviewed: 30 August 2026.</p></main>
<footer class="site-footer"><div><a class="brand" href="../"><span class="brand-mark">MS</span><span>Mortal Shell <i>II</i><small>Guide</small></span></a><p>Independent, English-language player guide.</p></div><div class="footer-links"><a href="../walkthrough/">Walkthrough</a><a href="../collectibles/">Collectibles</a><a href="../maps/">Maps</a><a href="./">Achievements</a></div><p class="disclaimer">Unofficial fan site. Mortal Shell II and related marks belong to their respective owners.</p></footer></body></html>`;

fs.writeFileSync(path.join(root, 'achievements', 'index.html'), html);
console.log(`Published ${entries.length} achievement and trophy requirements.`);
