(() => {
  const boxes = [...document.querySelectorAll('[data-stone]')];
  if (!boxes.length) return;
  const key = 'ms2-tarstone-locations-v1';
  const search = document.querySelector('#location-search');
  const region = document.querySelector('#location-region');
  const method = document.querySelector('#location-method');
  const missing = document.querySelector('#missing-toggle');
  const reset = document.querySelector('#reset-progress');
  const clear = document.querySelector('#clear-filters');
  const collectedText = document.querySelector('#collected-count');
  const stonedText = document.querySelector('#stoned-count');
  const collectedBar = document.querySelector('#collected-progress');
  const stonedBar = document.querySelector('#stoned-progress');
  const stonedPanel = document.querySelector('#stoned-panel');
  const thresholdNote = document.querySelector('#threshold-note');
  const resultsText = document.querySelector('#results-count');
  const empty = document.querySelector('#no-locations');
  let checked = new Set();
  let missingOnly = false;

  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(value)) checked = new Set(value.filter(x => typeof x === 'string'));
  } catch (_) {}

  function save() {
    try { localStorage.setItem(key, JSON.stringify([...checked])); } catch (_) {}
  }
  function updateProgress() {
    const count = checked.size;
    collectedText.textContent = `Collected ${count}/75`;
    stonedText.textContent = `Stoned ${Math.min(count, 73)}/73`;
    collectedBar.value = count;
    stonedBar.value = Math.min(count, 73);
    const complete = count >= 73;
    stonedPanel.classList.toggle('is-complete', complete);
    thresholdNote.textContent = complete
      ? `Reported Stoned target reached. ${75 - count} base ${75 - count === 1 ? 'name' : 'names'} left for 75/75.`
      : `${73 - count} more checked ${73 - count === 1 ? 'name' : 'names'} to the reported Stoned target.`;
  }
  function filter() {
    const term = search.value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll('.location-card').forEach(card => {
      const isMissing = !checked.has(card.querySelector('[data-stone]').dataset.stone);
      const visible = (!term || card.textContent.toLowerCase().includes(term)) &&
        (!region.value || card.dataset.region === region.value) &&
        (!method.value || card.dataset.method === method.value) &&
        (!missingOnly || isMissing);
      card.hidden = !visible;
      if (visible) shown += 1;
    });
    document.querySelectorAll('.route-region').forEach(section => {
      section.hidden = !section.querySelector('.location-card:not([hidden])');
    });
    resultsText.textContent = `Showing ${shown} of 75 Tarstones`;
    empty.hidden = shown !== 0;
  }
  boxes.forEach(box => {
    box.disabled = false;
    box.checked = checked.has(box.dataset.stone);
    box.addEventListener('change', () => {
      if (box.checked) checked.add(box.dataset.stone); else checked.delete(box.dataset.stone);
      save(); updateProgress(); filter();
    });
  });
  [search, region, method, missing, reset, clear].forEach(control => { control.disabled = false; });
  search.addEventListener('input', filter);
  region.addEventListener('change', filter);
  method.addEventListener('change', filter);
  missing.addEventListener('click', () => {
    missingOnly = !missingOnly;
    missing.setAttribute('aria-pressed', String(missingOnly));
    missing.textContent = missingOnly ? 'Show All' : 'Missing Only';
    filter();
  });
  clear.addEventListener('click', () => {
    search.value = ''; region.value = ''; method.value = ''; missingOnly = false;
    missing.setAttribute('aria-pressed', 'false'); missing.textContent = 'Missing Only'; filter();
  });
  reset.addEventListener('click', () => {
    if (!checked.size || !window.confirm('Reset all 75 Tarstone checkboxes on this device?')) return;
    checked.clear(); boxes.forEach(box => { box.checked = false; }); save(); updateProgress(); filter();
  });
  document.querySelectorAll('[data-region-jump]').forEach(link => link.addEventListener('click', () => {
    region.value = ''; filter();
  }));
  updateProgress(); filter();
})();
