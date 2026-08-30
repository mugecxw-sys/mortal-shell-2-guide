/* Static validation for the sidearm SEO cluster. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const origin = 'https://mortalshell2guide.xyz';
const routes = [
  '/collectibles/sidearms/',
  '/collectibles/sidearms/naylshotte/',
  '/collectibles/sidearms/troubadours-lute/',
  '/collectibles/sidearms/forgotten-crossbow/',
  '/collectibles/sidearms/salvaged-trebuchaxe/',
  '/collectibles/sidearms/triarch-repeater/',
  '/collectibles/sidearms/cursed-child/',
  '/collectibles/sidearms/ballistazooka/',
  '/collectibles/sidearms/caged-hystrix/',
];
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const errors = [];
const titles = new Set();
const descriptions = new Set();

function htmlDecode(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
}

function match(value, pattern) {
  return value.match(pattern)?.[1] || '';
}

for (const route of routes) {
  const file = path.join(root, route.replace(/^\//, '').replaceAll('/', path.sep), 'index.html');
  if (!fs.existsSync(file)) {
    errors.push(`${route}: page file missing`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const title = htmlDecode(match(html, /<title>([^<]+)<\/title>/i));
  const description = match(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
  const canonical = match(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const expected = `${origin}${route}`;

  if (title.length < 30 || title.length > 60) errors.push(`${route}: title length ${title.length}`);
  if (description.length < 120 || description.length > 165) errors.push(`${route}: description length ${description.length}`);
  if (canonical !== expected) errors.push(`${route}: canonical mismatch`);
  if ((html.match(/<h1\b/gi) || []).length !== 1) errors.push(`${route}: expected exactly one H1`);
  if (!html.includes('property="og:image"')) errors.push(`${route}: og:image missing`);
  if (!html.includes('name="twitter:image"')) errors.push(`${route}: twitter:image missing`);
  if (!sitemap.includes(`<loc>${expected}</loc><lastmod>2026-08-30</lastmod>`)) errors.push(`${route}: dated sitemap entry missing`);
  if (titles.has(title)) errors.push(`${route}: duplicate title`);
  if (descriptions.has(description)) errors.push(`${route}: duplicate description`);
  titles.add(title);
  descriptions.add(description);

  const schemas = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if (!schemas.length) errors.push(`${route}: JSON-LD missing`);
  for (const block of schemas) {
    try { JSON.parse(block[1]); } catch (error) { errors.push(`${route}: invalid JSON-LD (${error.message})`); }
  }

  for (const image of html.matchAll(/<img\s+([^>]+)>/gi)) {
    const attrs = image[1];
    const src = match(attrs, /src="([^"]+)"/i);
    const resolved = new URL(src, expected);
    if (resolved.origin !== origin) continue;
    const local = path.join(root, decodeURIComponent(resolved.pathname).replace(/^\//, '').replaceAll('/', path.sep));
    if (!fs.existsSync(local)) errors.push(`${route}: missing image ${resolved.pathname}`);
    if (!/width="\d+"/.test(attrs) || !/height="\d+"/.test(attrs)) errors.push(`${route}: image dimensions missing ${src}`);
  }

  for (const link of html.matchAll(/<a\s+[^>]*href="([^"]+)"/gi)) {
    const resolved = new URL(link[1], expected);
    if (resolved.origin !== origin) continue;
    const pathname = decodeURIComponent(resolved.pathname);
    const local = pathname.endsWith('/')
      ? path.join(root, pathname.replace(/^\//, '').replaceAll('/', path.sep), 'index.html')
      : path.join(root, pathname.replace(/^\//, '').replaceAll('/', path.sep));
    if (!fs.existsSync(local)) errors.push(`${route}: missing internal link target ${pathname}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Validated ${routes.length} sidearm pages: metadata, canonicals, JSON-LD, sitemap entries, images and internal links.`);
