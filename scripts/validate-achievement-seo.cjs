/* Static validation for the full achievement and trophy checklist. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const origin = 'https://mortalshell2guide.xyz';
const route = '/achievements/';
const expected = `${origin}${route}`;
const file = path.join(root, 'achievements', 'index.html');
const html = fs.readFileSync(file, 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const errors = [];
const sectionIds = ['missable', 'progress', 'gear', 'shells', 'bosses', 'completion'];

function decodeHtml(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;|&apos;/g, "'");
}

function match(value, pattern) {
  return value.match(pattern)?.[1] || '';
}

const title = decodeHtml(match(html, /<title>([^<]+)<\/title>/i));
const description = match(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
const canonical = match(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
if (title.length < 30 || title.length > 60) errors.push(`title length ${title.length}`);
if (!title.includes('All 53') || !title.includes('Mortal Shell 2')) errors.push('title misses target query terms');
if (description.length < 120 || description.length > 165) errors.push(`description length ${description.length}`);
if (canonical !== expected) errors.push('canonical mismatch');
if ((html.match(/<h1\b/gi) || []).length !== 1) errors.push('expected exactly one H1');
if (!html.includes('property="og:image"') || !html.includes('name="twitter:image"')) errors.push('social image metadata incomplete');
if (!sitemap.includes(`<loc>${expected}</loc><lastmod>2026-09-05</lastmod>`)) errors.push('dated sitemap entry missing');
if (html.includes('Tarforge maximum (+16)')) errors.push('obsolete +16 upgrade claim remains');

const cards = [...html.matchAll(/<article class="achievement-card[^"]*"[^>]*id="([^"]+)"/g)].map((match) => match[1]);
if (cards.length !== 53) errors.push(`expected 53 achievement cards, found ${cards.length}`);
if (new Set(cards).size !== cards.length) errors.push('duplicate achievement card IDs');
for (const section of sectionIds) {
  if (!html.includes(`id="${section}"`)) errors.push(`section ${section} missing`);
  if (!html.includes(`href="#${section}"`)) errors.push(`quick link ${section} missing`);
}

const schemas = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
if (!schemas.length) errors.push('JSON-LD missing');
for (const block of schemas) {
  try {
    const parsed = JSON.parse(block[1]);
    const graph = parsed['@graph'] || [];
    const types = graph.map((entry) => entry['@type']);
    for (const type of ['CollectionPage', 'ItemList', 'BreadcrumbList']) {
      if (!types.includes(type)) errors.push(`${type} schema missing`);
    }
    const list = graph.find((entry) => entry['@type'] === 'ItemList');
    if (list?.numberOfItems !== 53 || list?.itemListElement?.length !== 53) errors.push('ItemList must contain 53 entries');
  } catch (error) {
    errors.push(`invalid JSON-LD (${error.message})`);
  }
}

for (const imageMatch of html.matchAll(/<img\s+([^>]+)>/gi)) {
  const attrs = imageMatch[1];
  const src = match(attrs, /src="([^"]+)"/i);
  const resolved = new URL(src, expected);
  if (resolved.origin !== origin) continue;
  const local = path.join(root, decodeURIComponent(resolved.pathname).replace(/^\//, '').replaceAll('/', path.sep));
  if (!fs.existsSync(local)) errors.push(`missing image ${resolved.pathname}`);
  if (!/width="\d+"/.test(attrs) || !/height="\d+"/.test(attrs)) errors.push(`image dimensions missing ${src}`);
  if (!/alt="[^"]+"/.test(attrs)) errors.push(`image alt missing ${src}`);
}

for (const link of html.matchAll(/<a\s+[^>]*href="([^"]+)"/gi)) {
  const resolved = new URL(link[1], expected);
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
console.log('Validated achievement SEO: metadata, 53 anchored cards, ItemList schema, category navigation, images, sitemap and internal links.');
