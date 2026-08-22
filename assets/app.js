const navButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
if (navButton && nav) {
  navButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navButton.setAttribute('aria-expanded', String(open));
  });
}

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
