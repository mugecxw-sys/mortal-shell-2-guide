const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publisherId = 'ca-pub-8314050776909018';
const adSenseCode = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}" crossorigin="anonymous"></script>`;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'templates' || entry.name === '.git' ? [] : walk(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

let updatedPages = 0;
for (const file of walk(root)) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('adsbygoogle.js?client=')) {
    html = html.replace('</head>', `${adSenseCode}</head>`);
    if (!html.includes(adSenseCode)) throw new Error(`Could not add AdSense code to ${file}`);
    fs.writeFileSync(file, html);
    updatedPages += 1;
  }
}

fs.writeFileSync(path.join(root, 'ads.txt'), 'google.com, pub-8314050776909018, DIRECT, f08c47fec0942fa0\n');
fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nUser-agent: Mediapartners-Google\nAllow: /\n\nUser-agent: AdsBot-Google\nAllow: /\n\nSitemap: https://mortalshell2guide.xyz/sitemap.xml\n`);

const replace = (file, from, to) => {
  const target = path.join(root, file);
  const content = fs.readFileSync(target, 'utf8');
  if (content.includes(from)) fs.writeFileSync(target, content.replace(from, to));
  else if (!content.includes(to)) throw new Error(`Expected text not found in ${file}`);
};

replace('privacy.html',
  '<h2>Analytics and advertising</h2><p>With your consent, we use Google Analytics 4 to understand aggregate use of this guide, including pages viewed, approximate location, browser and device information, and interactions measured by Google Analytics. We do not run advertising or enable Google Signals. Analytics is not loaded until you accept analytics cookies, and you can withdraw that choice at any time through the Cookie Notice.</p>',
  '<h2>Analytics and advertising</h2><p>With your consent, we use Google Analytics 4 to understand aggregate use of this guide, including pages viewed, approximate location, browser and device information, and interactions measured by Google Analytics. Analytics is not loaded until you accept analytics cookies, and you can withdraw that choice at any time through the Cookie Notice.</p><p>The site is preparing for Google AdSense review. If ads are enabled after approval, Google and its partners may use cookies or similar identifiers to serve, measure and limit advertising, subject to the choices and notices required in your region. We will not present advertising as editorial guide content.</p>');
replace('privacy.html', 'Effective: 25 August 2026', 'Last updated: 6 September 2026');
replace('privacy.html',
  '<p>Material changes will be dated on this page. For privacy questions, use the contact channel shown on the future Advertise page once a site email is configured.</p>',
  '<p>Material changes will be dated on this page. For privacy questions, corrections, or copyright concerns, use our <a href="contact.html">contact page</a>.</p>');
replace('cookies.html',
  '<h2>Your choices</h2><p>You can decline analytics and still use all guide content. To change an earlier choice, select the button below; choosing Decline removes Google Analytics cookies that this site can access.</p>',
  '<h2>Advertising</h2><p>The site is currently in Google AdSense review and does not display AdSense ad units. If advertising is enabled after approval, Google and its partners may use cookies or similar technologies for ad delivery, measurement and fraud prevention. Visitors in regions where consent is required will be shown the applicable choice notice before relevant advertising is served.</p><h2>Your choices</h2><p>You can decline analytics and still use all guide content. To change an earlier choice, select the button below; choosing Decline removes Google Analytics cookies that this site can access.</p>');
replace('cookies.html', 'Effective: 25 August 2026', 'Last updated: 6 September 2026');
replace('advertise.html',
  '<p><strong>Launch status:</strong> no paid placements, affiliate links, or ad-network scripts are active. Pricing, site email, and media kit will be added after the domain and audience data are ready.</p>',
  '<p><strong>Launch status:</strong> the site is in Google AdSense review. The AdSense verification code is active, but no AdSense display ad units, paid placements, or affiliate links are currently shown. Any future advertising will be clearly separated from guide content.</p>');
replace('advertise.html', 'Last updated: 23 August 2026', 'Last updated: 6 September 2026');
replace('terms.html',
  '<p>If you believe material on this site infringes your rights, contact the site owner with the page URL, identification of the work, and a way to reply. A contact address will be added before public advertising or submissions are enabled.</p>',
  '<p>If you believe material on this site infringes your rights, use our <a href="contact.html">contact page</a> with the page URL, identification of the work, and a way to reply.</p>');

console.log(`AdSense code present on ${walk(root).filter(file => fs.readFileSync(file, 'utf8').includes(publisherId)).length} published HTML files; ${updatedPages} newly updated.`);
