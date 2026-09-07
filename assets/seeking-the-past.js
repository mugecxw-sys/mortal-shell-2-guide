(() => {
  const key = 'ms2-seeking-the-past-v1';
  const boxes = [...document.querySelectorAll('[data-memory]')];
  const progress = document.querySelector('.memory-progress');
  const count = document.querySelector('[data-memory-count]');
  const bar = document.querySelector('[data-memory-bar]');
  let saved = new Set();
  try { saved = new Set(JSON.parse(localStorage.getItem(key) || '[]')); } catch (_) {}

  function render() {
    boxes.forEach(box => { box.checked = saved.has(box.dataset.memory); });
    document.querySelectorAll('[data-shell]').forEach(card => {
      const shellBoxes = [...card.querySelectorAll('[data-memory]')];
      const done = shellBoxes.filter(box => box.checked).length;
      card.querySelector('[data-shell-count]').textContent = `${done}/5`;
      card.classList.toggle('complete', done === 5);
    });
    const done = saved.size;
    count.textContent = `${done}/40 watched`;
    bar.style.width = `${done / 40 * 100}%`;
    progress.classList.toggle('complete', done === 40);
    progress.setAttribute('aria-label', `Seeking the Past progress: ${done} of 40 memories watched`);
  }

  function save() { localStorage.setItem(key, JSON.stringify([...saved])); render(); }
  boxes.forEach(box => box.addEventListener('change', () => {
    box.checked ? saved.add(box.dataset.memory) : saved.delete(box.dataset.memory);
    save();
  }));
  document.querySelectorAll('[data-complete-shell]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll(`[data-memory^="${button.dataset.completeShell}-"]`).forEach(box => saved.add(box.dataset.memory));
    save();
  }));
  document.querySelector('[data-reset-memories]').addEventListener('click', () => {
    if (window.confirm('Reset all 40 Shell Memory checks on this device?')) { saved.clear(); save(); }
  });
  render();
})();
