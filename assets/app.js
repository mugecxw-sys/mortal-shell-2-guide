const appScript = document.currentScript;
if (appScript?.src) {
  const launchStyles = document.createElement('link');
  launchStyles.rel = 'stylesheet';
  launchStyles.href = appScript.src.replace('app.js', 'site-upgrade.css');
  document.head.append(launchStyles);
  const gameTheme = document.createElement('link');
  gameTheme.rel = 'stylesheet';
  gameTheme.href = appScript.src.replace('app.js', 'mortal-shell-theme.css');
  document.head.append(gameTheme);
}

const navButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
if (navButton && nav) {
  navButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navButton.setAttribute('aria-expanded', String(open));
  });
}

const screenshotSlot = document.querySelector('.screenshot-slot');
if (screenshotSlot && appScript?.src) {
  const screenshot = new Image();
  screenshot.onload = () => { screenshotSlot.hidden = true; };
  screenshot.src = appScript.src.replace('app.js', 'images/home-hero.webp');
}

document.querySelectorAll('.site-footer').forEach((footer) => {
  if (footer.querySelector('.footer-utility')) return;
  const utility = document.createElement('nav');
  utility.className = 'footer-utility';
  utility.setAttribute('aria-label', 'Site information');
  const siteRoot = new URL('../', appScript.src);
  const page = (name) => new URL(name, siteRoot).href;
  utility.innerHTML = `<a href="${page('about.html')}">About</a><a href="${page('editorial-policy.html')}">Editorial policy</a><a href="${page('privacy.html')}">Privacy</a><a href="${page('terms.html')}">Terms</a><a href="${page('cookies.html')}">Cookies</a><a href="${page('advertise.html')}">Advertise</a>`;
  footer.append(utility);
});

const tracked = document.querySelectorAll('[data-track]');
const storageKey = 'mortal-shell-2-guide-progress';
const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
function updateTracker() {
  const completed = [...tracked].filter((input) => input.checked).length;
  document.querySelectorAll('.tracker-count').forEach((counter) => {
    counter.textContent = `${completed} of ${tracked.length} guide lists marked complete`;
  });
}
tracked.forEach((input) => {
  input.checked = Boolean(saved[input.dataset.track]);
  input.addEventListener('change', () => {
    saved[input.dataset.track] = input.checked;
    localStorage.setItem(storageKey, JSON.stringify(saved));
    updateTracker();
  });
});
updateTracker();
