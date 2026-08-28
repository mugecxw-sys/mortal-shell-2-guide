/* Static validation for the Shell SEO cluster. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const origin = 'https://mortalshell2guide.xyz';
const slugs = ['tiel', 'proxima', 'gragu', 'eredrim', 'smert', 'lazlo', 'sariel', 'genessa'];
const routes = ['/collectibles/shells/', ...slugs.map((slug) => `/collectibles/shells/${slug}/`)];
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const seenTitles = new Set();
const seenDescriptions = new Set();
const errors = [];

function routeFile(route) {
  return path.join(root, route.replace(/^\//, '').replaceAll('/', path.sep), 'index.html');
}

function match(html, pattern) {
  return html.match(pattern)?.[1] || '';
}

for (const route of routes) {
  const file = routeFile(route);
  if (!fs.existsSync(file)) {
    errors.push(`${route}: page file is missing`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const title = match(html, /<title>([^<]+)<\/title>/i);
  const description = match(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
  const canonical = match(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const expectedCanonical = `${origin}${route}`;

  if (title.length < 30 || title.length > 60) errors.push(`${route}: title length is ${title.length}`);
  if (description.length < 120 || description.length > 165) errors.push(`${route}: description length is ${description.length}`);
  if (canonical !== expectedCanonical) errors.push(`${route}: canonical mismatch`);
  if (!html.includes('property="og:image"')) errors.push(`${route}: og:image missing`);
  if (!html.includes('name="twitter:image"')) errors.push(`${route}: twitter:image missing`);
  if ((html.match(/<h1\b/gi) || []).length !== 1) errors.push(`${route}: expected exactly one H1`);
  if (!sitemap.includes(`<loc>${expectedCanonical}</loc>`)) errors.push(`${route}: missing from sitemap`);
  if (seenTitles.has(title)) errors.push(`${route}: duplicate title`);
  if (seenDescriptions.has(description)) errors.push(`${route}: duplicate description`);
  seenTitles.add(title);
  seenDescriptions.add(description);

  for (const block of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(block[1]); } catch (error) { errors.push(`${route}: invalid JSON-LD (${error.message})`); }
  }

  for (const image of html.matchAll(/<img\s+([^>]+)>/gi)) {
    const attrs = image[1];
    const src = match(attrs, /src="([^"]+)"/i);
    const resolved = new URL(src, expectedCanonical);
    if (resolved.origin !== origin) continue;
    const local = path.join(root, decodeURIComponent(resolved.pathname).replace(/^\//, '').replaceAll('/', path.sep));
    if (!fs.existsSync(local)) errors.push(`${route}: image missing ${resolved.pathname}`);
    if (attrs.includes('route-') && (!/width="\d+"/.test(attrs) || !/height="\d+"/.test(attrs))) {
      errors.push(`${route}: route image dimensions missing ${src}`);
    }
  }

  for (const link of html.matchAll(/<a\s+[^>]*href="([^"]+)"/gi)) {
    const href = link[1];
    const resolved = new URL(href, expectedCanonical);
    if (resolved.origin !== origin) continue;
    const pathname = decodeURIComponent(resolved.pathname);
    const local = pathname.endsWith('/')
      ? path.join(root, pathname.replace(/^\//, '').replaceAll('/', path.sep), 'index.html')
      : path.join(root, pathname.replace(/^\//, '').replaceAll('/', path.sep));
    if (!fs.existsSync(local)) errors.push(`${route}: internal link target missing ${pathname}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Validated ${routes.length} Shell pages: metadata, canonicals, JSON-LD, sitemap entries, images and internal links.`);
