"""Build the English catalogue from player-supplied StringTables and PNG exports."""
from pathlib import Path
import json, re, html
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
EXPORTS = ROOT.parent
table = json.loads((EXPORTS/'ui-text-check/Text/ST_Core_Tarstones.json').read_text(encoding='utf-8-sig'))[0]['StringTable']['KeysToEntries']
icons = {p.stem: p for p in (EXPORTS/'ui-localization-analysis').rglob('*.png') if 'Tarstones' in p.parts}
# Explicit matches only. Old development names without a confirmed match remain unassigned.
matches = {
 'Serpent Stone':'T_UI_TStone_Melee_InflictPoison',
 "Marksman's Stone":'T_UI_Tarstone_Sidearm_SharpShooter',
 'Deadeye Stone':'T_UI_Tarstone_DeadeyeStone',
 "Siegebreaker's Stone":'T_UI_Tstone_Sidearm_Generic_PoiseDamage',
 'Spite Stone':'T_UI_Tarstone_Sidearm_SpiteStone',
 'Shuddering Stone':'T_UI_Tarstone_Sidearm_ShudderingStone',
 'Pulse Stone':'T_UI_Tarstone_Sidearm_Pulse',
 "Ironpiercer's Stone":'T_UI_Tarstone_PiercingShot',
 'Myriad Stone':'T_UI_Sidearm_MyriadStone',
 'Blackblood Stone':'T_UI_Sidearm_Boombastic',
 'Squall Stone':'T_UI_Sidearm_SquallStone',
 'Charged Stone':'T_UI_Tarstone_Sidearm_ChargedStone',
 'Unstable Stone':'T_UI_UnstableStone',
 'Volatile Fragment':'T_UI_TStone_Sidearm_ExplosiveReaction_Hunchback',
 'Hag Stone':'T_UI_Tarstone_Sidearm_Poison',
 'Emberseed Stone':'T_UI_Tarstone_Sidearm_InflictBurn',
 'Viletongue Hedron':'T_UI_TStone_Sidearm_BleedingStone_Batushka',
 'Voltaic Amber':'T_UI_TStoneSideArm_InflictLightning_Harpy',
 'Frostshard Stone':'T_UI_Tarstone_Sidearm_InflictFrost',
 'Accursed Stone':'T_UI_Tarstone_Sidearm_AccursedStone',
 'Weeping Stone':'T_UI_Tarstone_WeepingTarstone',
 'Solnir Shard':'T_UI_TStone_Sidearm_Slingshot_Sicario',
 "Confessor's Keepsake":'T_UI_TStone_Sidearm_Deadshot_Aristocrat',
 'Fusillade Stone':'T_UI_Sidearm_FusilladeStone',
 'Barrage Stone':'T_UI_TStone_Sidearm_ClusterBomb_Shepherd',
 'Infested Stone':'T_UI_Tarstone_Sidearm_InfestedStone',
 'Wounding Stone':'T_UI_Mele_WoundingHit',
 'Auspicious Stone':'T_UI_TStone_Melee_Generic_CritChance',
 "Headsman's Stone":'T_UI_Tarstone_Headman',
 'Shattering Stone':'T_UI_TStone_Melee_Generic_PoiseBonus',
 "Berserker's Stone":'T_UI_Melee_BerserkerHeart',
 'Grudge Stone':'T_UI_TStone_Melee_CriticalFlow_CritChance',
 'Unyielding Stone':'T_UI_Melee_UnyieldingStone',
 'Parasitic Stone':'T_UI_Tarstone_Melee_ParasiticBrooch',
 "Thief's Stone":'T_UI_Melee_WarpOnHit',
 "Stillblade's Stone":'T_UI_Melee_LightComboBreak',
 "Zealot's Stone":'T_UI_Tarstone_Melee_ZealotStone',
 "Tyrant's Stone":'T_UI_Tarstone_Melee_TyrantStone',
 "Arbiter's Prize":'T_UI_TStone_Melee_InflictBleed_BloodBoilRune_CannibalKnight',
 'Voltaic Crown':'T_UI_TStone_Melee_InflictLightning_DungeonChamp',
 "Warden's Stone":'T_UI_TStone_Melee_InflictFrost_Elite',
 'Nightgrasp Stone':'T_UI_TStone_Melee_NightGrasp',
 'Torpor Stone':'T_UI_Melee_TorporStone',
 'Inflamed Clawstone':'T_UI_TStone_Melee_InflictBurn_Grisha',
 "Acolyte's Stone":'T_UI_Tarstone_Melee_ChargedLight',
 'Unwieldy Stone':'T_UI_Tarstone_Melee_ChargedHeavy',
 "Magdalena's Memento":'T_UI_Melee_DeadlyFlurry',
 'Infused Stone':'T_UI_Tarstone_Melee_InfusedStone',
 'Shrike Stone':'T_UI_Tarstone_Melee_PlummetStrike',
 'Colossus Stone':'T_UI_Tarstone_Melee_HeavyStomp',
 'Gloombound Stone':'T_UI_Support_Gloombound',
 'Clockwork Shardstone':'T_UI_Melee_ClockworkGrinder',
 'Corroded Stone':'T_UI_Tarstone_Sidearm_Corrosion',
 'Rupturing Stone':'T_UI_Tarstone_Sidearm_RupturingStone',
 'Splitting Stone':'T_UI_Sidearm_SplittingStone',
 'Hand of Rock':'T_UI_Sidearm_LuteStone',
 "Scholar's Wormstone":'T_UI_TStone_Melee_ClockWorkChainsaw_MothKnight_Boss',
}
special = {'ID_Sidearm_InflictBreakOnCritName':'ID_Sidearm_InflictBreakOnCriticalHit', 'ID_Melee_WeaponAbility_ClockworkChainsaw':'ID_Melee_ClockworkChainsawDesc'}
def plain(s):
 s = re.sub(r'<[^>]*>', '', s)
 s = re.sub(r'\b[Ss]lain foes\b', 'Defeated enemies', s)
 s = s.replace('Slaying foes','Defeating enemies').replace('last slain foe','last defeated enemy')
 s = re.sub(r'\bkill\b','defeat',s,flags=re.I)
 return s
def effect(s):
 s=plain(s)
 s=re.sub(r'Consumes? \{R\} Resolve', 'Spend Resolve', s)
 s=s.replace('At {R} Resolve or higher,','With enough Resolve,').replace('Hitting the same enemy {Y} times','Repeatedly hitting the same enemy')
 return s.rstrip('.')+'.'
entries=[]
dest=ROOT/'assets/icons/tarstones';dest.mkdir(parents=True,exist_ok=True)
for key,name in table.items():
 desc=table.get(special.get(key,key+'Desc'))
 if not key.startswith('ID_') or not desc: continue
 target='Primary weapon' if key.startswith('ID_Melee') else 'Sidearm' if key.startswith('ID_Sidearm') else 'Support'
 category='Infusion' if 'infuse your' in desc else 'Support' if target=='Support' else 'Ability' if ('{R}' in desc or 'Consume <Resolve>' in desc) else 'Combat'
 slug=re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-')
 src=icons.get(matches.get(name,'')); icon=None
 if src:
  with Image.open(src) as im: im.convert('RGBA').save(dest/(slug+'.webp'),'WEBP',lossless=True,method=6)
  icon='/assets/icons/tarstones/'+slug+'.webp'
 entries.append(dict(id=slug,key=key,name=name,effect=effect(desc),target=target,category=category,icon=icon,sourceIcon=src.stem if src else None,variableValues=bool(re.search(r'\{\w+\}',desc))))
entries.sort(key=lambda e:e['name'].lower())
assert len({e['id'] for e in entries})==len(entries)
assert all(not re.search(r'\{\w+\}',e['effect']) for e in entries)
(ROOT/'assets/tarstones.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2),encoding='utf-8')
esc=html.escape
cards=[]
for e in entries:
 image=f'<img src="{e["icon"]}" width="128" height="128" alt="{esc(e["name"])}" loading="lazy" decoding="async">' if e['icon'] else '<span class="tarstone-missing">Icon pending match</span>'
 cards.append(f'<article class="tarstone-card" id="{e["id"]}" data-target="{e["target"]}" data-category="{e["category"]}"><div class="tarstone-art">{image}</div><div><p class="eyebrow">{e["target"]} · {e["category"]}</p><h2>{esc(e["name"])}</h2><p>{esc(e["effect"])}</p></div></article>')
old=(ROOT/'collectibles/tarstones/index.html').read_text(encoding='utf-8')
header=re.search(r'<header class="site-header">.*?</header>',old,re.S).group()
footer=re.search(r'<footer class="site-footer">.*?</footer>',old,re.S).group()
title='Tarstones: Effects, Types & Icons | Mortal Shell II Guide'
description='Browse Mortal Shell II Tarstones with English effects, equipment types and original game icons. Search primary weapon, sidearm and support stones.'
page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{esc(title)}</title><meta name="description" content="{description}"><link rel="canonical" href="https://mortalshell2guide.xyz/collectibles/tarstones/"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{description}"><meta property="og:url" content="https://mortalshell2guide.xyz/collectibles/tarstones/"><meta property="og:type" content="website"><meta name="twitter:card" content="summary"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/styles.css"><link rel="stylesheet" href="/assets/pages.css"><link rel="stylesheet" href="/assets/tarstones.css"><script defer src="/assets/app.js"></script><script defer src="/assets/analytics.js"></script><script defer src="/assets/tarstones.js"></script></head><body>{header}<main class="page-shell"><p class="eyebrow">Collectibles · Updated 5 September 2026</p><h1 class="page-title">Tarstones</h1><p class="lede">Find a stone by name or effect, and compare its equipment type and ability. This catalogue contains {len(entries)} named entries from the English game text.</p><p class="tarstone-note">Exact Resolve costs, upgrade values and weapon-specific compatibility are still being checked. Entries here are a reference catalogue, not a confirmed obtainable-item checklist.</p><div class="tarstone-controls"><label>Search name or effect<input id="tarstone-search" type="search" placeholder="Try Frost, Critical or Resolve"></label><label>Equipment<select id="tarstone-target"><option value="">All equipment</option><option>Primary weapon</option><option>Sidearm</option><option>Support</option></select></label><label>Effect type<select id="tarstone-category"><option value="">All types</option><option>Support</option><option>Combat</option><option>Infusion</option><option>Ability</option></select></label></div><p id="tarstone-count" role="status">{len(entries)} entries</p><section class="tarstone-grid">{''.join(cards)}</section><p id="tarstone-empty" hidden>No matching Tarstones. Try another name or effect.</p><p class="tarstone-note">Names and effect descriptions use the supplied English game text. Artwork is from the supplied game exports; unmatched artwork is marked individually. <a href="/maps/">Open the world map</a> · <a href="/achievements/">Achievement checklist</a></p></main>{footer}</body></html>'''
page=page.replace('<a href="/achievements/">Achievement checklist</a></p>','<a href="/achievements/">Achievement checklist</a> · <a href="/guides/upgrade-materials/#unlock">Tarforge unlocks &amp; material costs</a></p>')
(ROOT/'collectibles/tarstones/index.html').write_text(page,encoding='utf-8')
index=ROOT/'collectibles/index.html'
index.write_text(index.read_text(encoding='utf-8').replace('Early catalogue of upgrades, categories, and known effect notes.','English effects, equipment types, and extracted game icons.').replace('Data under verification →',f'{len(entries)} named entries →'),encoding='utf-8')
sitemap=ROOT/'sitemap.xml'
sitemap.write_text(re.sub(r'(<url><loc>https://mortalshell2guide.xyz/collectibles/tarstones/</loc>)(?:<lastmod>.*?</lastmod>)?(</url>)',r'\1<lastmod>2026-09-05</lastmod>\2',sitemap.read_text(encoding='utf-8')),encoding='utf-8')
print(json.dumps({'entries':len(entries),'icons':sum(bool(e['icon']) for e in entries),'missingIcons':[e['name'] for e in entries if not e['icon']]},indent=2))
