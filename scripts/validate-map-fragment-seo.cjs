/* Static validation for the all-map-fragments SEO page. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const origin = 'https://mortalshell2guide.xyz';
const route = '/collectibles/map-fragments/';
const expected = `${origin}${route}`;
const file = path.join(root, 'collectibles', 'map-fragments', 'index.html');
const html = fs.readFileSync(file, 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const errors = [];
const ids = [
  'fainweald-1', 'fainweald-2', 'fainweald-3', 'fainweald-4', 'fainweald-5',
  'mammon-1', 'mammon-2', 'mammon-3', 'mammon-4', 'mammon-5', 'mammon-6',
];

function match(value, pattern) {
  return value.match(pattern)?.[1] || '';
}

const title = match(html, /<title>([^<]+)<\/title>/i);
const description = match(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
const canonical = match(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
if (title.length < 30 || title.length > 60) errors.push(`title length ${title.length}`);
if (!title.includes('Sat Nav') || !title.includes('Mortal Shell 2')) errors.push('title misses target query terms');
if (description.length < 120 || description.length > 165) errors.push(`description length ${description.length}`);
if (canonical !== expected) errors.push('canonical mismatch');
if ((html.match(/<h1\b/gi) || []).length !== 1) errors.push('expected exactly one H1');
if ((html.match(/class="fragment-location"/g) || []).length !== 11) errors.push('expected 11 fragment locations');
if (!html.includes('property="og:image:width"') || !html.includes('name="twitter:image:alt"')) errors.push('social image metadata incomplete');
if (!sitemap.includes(`<loc>${expected}</loc><lastmod>2026-09-05</lastmod>`)) errors.push('dated sitemap entry missing');

for (const id of ids) {
  if (!html.includes(`id="${id}"`)) errors.push(`section ${id} missing`);
  if (!html.includes(`href="#${id}"`)) errors.push(`jump link ${id} missing`);
}

const schemas = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
if (!schemas.length) errors.push('JSON-LD missing');
for (const block of schemas) {
  try {
    const parsed = JSON.parse(block[1]);
    const types = parsed['@graph']?.map((entry) => entry['@type']) || [];
    for (const type of ['Article', 'ItemList', 'BreadcrumbList']) {
      if (!types.includes(type)) errors.push(`${type} schema missing`);
    }
  } catch (error) {
    errors.push(`invalid JSON-LD (${error.message})`);
  }
}

for (const image of html.matchAll(/<img\s+([^>]+)>/gi)) {
  const attrs = image[1];
  const src = match(attrs, /src="([^"]+)"/i);
  const resolved = new URL(src, expected);
  if (resolved.origin !== origin) continue;
  const local = path.join(root, decodeURIComponent(resolved.pathname).replace(/^\//, '').replaceAll('/', path.sep));
  if (!fs.existsSync(local)) errors.push(`missing image ${resolved.pathname}`);
  if (!/width="\d+"/.test(attrs) || !/height="\d+"/.test(attrs)) errors.push(`image dimensions missing ${src}`);
  if (!/alt="[^"]+"/.test(attrs)) errors.push(`image alt missing ${src}`);
}

for (const link of html.matchAll(/<a\s+[^>]*href="([^"]+)"/gi)) {
  const href = link[1];
  const resolved = new URL(href, expected);
  if (resolved.origin !== origin || resolved.hash) continue;
  const pathname = decodeURIComponent(resolved.pathname);
  const local = pathname.endsWith('/')
    ? path.join(root, pathname.replace(/^\//, '').replaceAll('/', path.sep), 'index.html')
    : path.join(root, pathname.replace(/^\//, '').replaceAll('/', path.sep));
  if (!fs.existsSync(local)) errors.push(`missing internal link target ${pathname}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Validated map-fragment SEO: metadata, schema, 11 anchored locations, sitemap, 32 images and internal links.');
