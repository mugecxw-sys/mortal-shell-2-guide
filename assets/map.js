(() => {
  const viewport = document.querySelector('.map-viewport');
  const surface = document.querySelector('.map-surface');
  if (!viewport || !surface) return;
  let scale = 1;
  let x = 0;
  let y = 0;
  let drag = null;
  const minScale = 0.72;
  const maxScale = 3.2;
  const render = () => { surface.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`; };
  const changeZoom = (next) => { scale = Math.max(minScale, Math.min(maxScale, next)); render(); };
  document.querySelectorAll('[data-map-zoom]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.mapZoom;
      if (action === 'in') changeZoom(scale * 1.25);
      else if (action === 'out') changeZoom(scale / 1.25);
      else { scale = 1; x = 0; y = 0; render(); }
    });
  });
  viewport.addEventListener('wheel', (event) => { event.preventDefault(); changeZoom(scale * (event.deltaY < 0 ? 1.12 : .89)); }, { passive: false });
  viewport.addEventListener('pointerdown', (event) => { drag = { x: event.clientX, y: event.clientY, mapX: x, mapY: y }; viewport.setPointerCapture(event.pointerId); viewport.classList.add('is-dragging'); });
  viewport.addEventListener('pointermove', (event) => { if (!drag) return; x = drag.mapX + event.clientX - drag.x; y = drag.mapY + event.clientY - drag.y; render(); });
  const endDrag = () => { drag = null; viewport.classList.remove('is-dragging'); };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  const search = document.querySelector('#map-search');
  const results = [...document.querySelectorAll('.map-result')];
  const empty = document.querySelector('.map-no-results');
  search?.addEventListener('input', () => {
    const term = search.value.trim().toLowerCase();
    let count = 0;
    results.forEach((result) => { const visible = !term || `${result.textContent} ${result.dataset.search}`.toLowerCase().includes(term); result.hidden = !visible; if (visible) count += 1; });
    if (empty) empty.hidden = count > 0;
  });
  document.querySelectorAll('.map-filter').forEach((filter) => {
    filter.addEventListener('click', () => {
      document.querySelectorAll('.map-filter').forEach((item) => { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false'); });
      filter.classList.add('active'); filter.setAttribute('aria-pressed', 'true');
      if (filter.dataset.filter !== 'routes') search?.focus();
    });
  });
  render();
})();
