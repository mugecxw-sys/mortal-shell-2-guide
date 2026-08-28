/* Adds published acquisition links to the Shell catalogue and the Tiel source route. */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const shellsPath = path.join(root, 'collectibles', 'shells', 'index.html');
const widowsPath = path.join(root, 'walkthrough', 'widows-overlook', 'index.html');

let shells = fs.readFileSync(shellsPath, 'utf8');
shells = shells
  .replace('Reported near Widow’s Overlook.</p>', 'Get the <a href="../../walkthrough/widows-overlook/#tiel-shell">annotated Tiel route</a> in Widow’s Overlook.</p>')
  .replace('Reported near Blackridge Pass.</p>', 'Get the <a href="proxima/">annotated Proxima route</a> at Blackridge Cliffs.</p>')
  .replace('Reported at the One-Legged Wolf Tavern.</p>', 'Get the <a href="gragu/">annotated Gragu route</a> from the One-Legged Wolf Tavern.</p>')
  .replace('Reported after the Citadel of Penance Warden.</p>', 'Get the <a href="eredrim/">annotated Eredrim route</a> from Citadel of Penance Beacon.</p>')
  .replace('Reported at Prophet’s Rest.</p>', 'Get the <a href="smert/">annotated Smert route</a> from Outskirts of Nochte Beacon.</p>');
fs.writeFileSync(shellsPath, shells);

let widows = fs.readFileSync(widowsPath, 'utf8');
widows = widows.replace('<figure class="route-figure"><img src="../../assets/images/walkthrough/widows-overlook/route-07.webp"', '<figure id="tiel-shell" class="route-figure"><img src="../../assets/images/walkthrough/widows-overlook/route-07.webp"')
  .replace('<strong>Route 07</strong>Drop from the marked platform', '<strong>Route 07 · Tiel Shell acquisition</strong>Drop from the marked platform');
fs.writeFileSync(widowsPath, widows);
