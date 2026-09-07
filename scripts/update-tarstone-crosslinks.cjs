const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

function update(rel, fn) {
  const file = path.join(root, rel);
  const before = fs.readFileSync(file, 'utf8');
  const after = fn(before);
  if (after !== before) fs.writeFileSync(file, after);
}

update('collectibles/tarstones/index.html', html => html
  .replace('Collectibles · Updated 5 September 2026', 'Collectibles · Updated 7 September 2026')
  .replace('<p class="tarstone-note">Exact Resolve costs, upgrade values and weapon-specific compatibility are still being checked. Entries here are a reference catalogue, not a confirmed obtainable-item checklist.</p>', '<p class="tarstone-note"><strong>Looking for locations?</strong> This is an effects and text database, not a world-pickup count. Use the <a href="/collectibles/tarstones/locations/">All 75 Tarstone Locations &amp; Stoned Tracker</a> for regional routes and 73/75 progress.</p><p class="tarstone-note">The 76th exported text entry does not establish a 76th base location; Week 1 Fragile copies can also make current inventory totals higher.</p>')
  .replace('<a href="/maps/">Open the world map</a>', '<a href="/collectibles/tarstones/locations/">All locations &amp; Stoned tracker</a> · <a href="/maps/?filter=tarstones">Open Tarstones on the map</a>'));

update('achievements/index.html', html => html
  .replace('<p>Find every Tarstone.</p><a class="achievement-guide-link" href="../collectibles/tarstones/">Open related guide →</a>', '<p>Find every Tarstone. Current guides widely report 73 acquisitions from the 75-name base checklist; post-patch Fragile copies can make inventory totals higher.</p><a class="achievement-guide-link" href="../collectibles/tarstones/locations/">Open 75-item tracker →</a>'));

update('collectibles/index.html', html => html
  .replace('href="tarstones/"', 'href="tarstones/locations/"')
  .replace('English effects, equipment types, and extracted game icons.', 'All 75 base locations, 73/75 Stoned tracker, routes and version notes.')
  .replace('76 named entries →', '75 locations &amp; tracker →')
  .replace('Route guides use original gameplay captures, map marks, and first-hand verification.', 'Route guides combine supplied game data, map references, current update notes and clearly identified source checks.')
  .replace('Reference first. Verified route next.', 'Source the route. Mark the limits.')
  .replace('Names and conditions are matched to the current English game text where possible. Numerical stats, exact map steps, and image annotations are only published after a first-hand verification pass and use original captures.', 'Names and conditions are matched to current English game text where possible. Route pages state their verification date, version limits and source basis; uncertain map details are kept at route-note level.'));

console.log('Updated Tarstone catalogue, achievement card and collectibles hub links.');
