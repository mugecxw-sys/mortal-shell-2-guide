/* Static SEO validation for the four missable trophies guide. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const canonical = 'https://mortalshell2guide.xyz/guides/missable-trophies/';
const html = fs.readFileSync(path.join(root, 'guides', 'missable-trophies', 'index.html'), 'utf8');
const achievements = fs.readFileSync(path.join(root, 'achievements', 'index.html'), 'utf8');
const prologue = fs.readFileSync(path.join(root, 'walkthrough', 'prologue', 'index.html'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const match = (pattern) => html.match(pattern)?.[1] || '';
const title = match(/<title>([^<]+)<\/title>/i);
const description = match(/<meta\s+name="description"\s+content="([^"]+)"/i);

check(title === 'Mortal Shell 2 Missable Trophies Guide (All 4)', 'Exact target title missing');
check(description.length >= 120 && description.length <= 165, `Description length ${description.length}`);
check(match(/<link\s+rel="canonical"\s+href="([^"]+)"/i) === canonical, 'Canonical mismatch');
check((html.match(/<h1\b/gi) || []).length === 1, 'Expected exactly one H1');
check(html.includes('property="og:image"') && html.includes('name="twitter:image"'), 'Social image metadata incomplete');
check(html.includes('name="twitter:card" content="summary"'), 'Twitter card type should match the square source image');
check(html.includes('property="article:modified_time" content="2026-09-06"'), 'Article modified date missing');

const anchors = ['mid-summer', 'tar-golem', 'perfect-parry', 'bag-holder'];
for (const anchor of anchors) {
  check(html.includes(`id="${anchor}"`), `Section ${anchor} missing`);
  check(html.includes(`href="#${anchor}"`), `TOC link ${anchor} missing`);
  check(achievements.includes(`href="../guides/missable-trophies/#${anchor}"`), `Achievement deep link ${anchor} missing`);
}
check(prologue.includes('../../guides/missable-trophies/#mid-summer'), 'Prologue Mid Summer internal link missing');
check(prologue.includes('../../guides/missable-trophies/#tar-golem'), 'Prologue Tar Golem internal link missing');
check(home.includes('href="guides/missable-trophies/"'), 'Homepage recommendation link missing');
check(sitemap.includes(`<loc>${canonical}</loc><lastmod>2026-09-06</lastmod>`), 'Current sitemap entry missing');
check((sitemap.match(new RegExp(`<loc>${canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>`, 'g')) || []).length === 1, 'Sitemap entry must be unique');

const schemas = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
check(schemas.length === 1, 'Expected one JSON-LD graph');
for (const block of schemas) {
  try {
    const parsed = JSON.parse(block[1]);
    const graph = parsed['@graph'] || [];
    const types = graph.map((entry) => entry['@type']);
    for (const type of ['Article', 'ItemList', 'BreadcrumbList', 'FAQPage']) check(types.includes(type), `${type} schema missing`);
    const list = graph.find((entry) => entry['@type'] === 'ItemList');
    check(list?.numberOfItems === 4 && list?.itemListElement?.length === 4, 'Missable ItemList must contain four entries');
    const faq = graph.find((entry) => entry['@type'] === 'FAQPage');
    check(faq?.mainEntity?.length === 4, 'FAQPage must contain four visible questions');
  } catch (error) {
    errors.push(`Invalid JSON-LD: ${error.message}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Validated missable trophy SEO: metadata, four schemas, four anchors, sitemap and contextual internal links.');
