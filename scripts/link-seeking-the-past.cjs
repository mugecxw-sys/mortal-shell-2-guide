const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const guide = '/guides/seeking-the-past/';
const shellNames = ['tiel','proxima','gragu','eredrim','smert','lazlo','sariel','genessa'];

for (const shell of shellNames) {
  const file = path.join(root, 'collectibles', 'shells', shell, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes(guide)) {
    html = html.replace('<footer class="article-footer">', `<aside class="route-guide-note"><p><strong>Shell Memory cleanup:</strong> this Shell has five trophy-relevant Memories. Track them with the <a href="${guide}#${shell}">Seeking the Past 40-memory checklist</a>.</p></aside><footer class="article-footer">`);
    fs.writeFileSync(file, html);
  }
}

const hubFile = path.join(root, 'collectibles', 'shells', 'index.html');
let hub = fs.readFileSync(hubFile, 'utf8');
if (!hub.includes(guide)) {
  hub = hub.replace('<section class="catalog">', `<p class="reference-alert"><strong>Shell Memory tracker:</strong> after unlocking the eight selectable Shells, use the <a href="${guide}">Seeking the Past checklist</a> to record all five Memories for each one.</p><section class="catalog">`);
  fs.writeFileSync(hubFile, hub);
}
