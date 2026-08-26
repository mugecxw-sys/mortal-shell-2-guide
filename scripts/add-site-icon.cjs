/* Adds the shared custom favicon to every published HTML page. */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const ignored = new Set(['.git', 'assets', 'scripts', 'templates']);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && entry.name.endsWith('.html')) {
      let html = fs.readFileSync(full, 'utf8');
      if (!html.includes('favicon.ico')) {
        html = html.replace('</head>', '<link rel="icon" href="/favicon.ico" sizes="any"><link rel="apple-touch-icon" href="/apple-touch-icon.png"></head>');
        fs.writeFileSync(full, html);
      }
    }
  }
}
walk(root);
