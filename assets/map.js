(() => {
  const viewport = document.querySelector('.map-viewport');
  const surface = document.querySelector('.map-surface');
  const layer = document.querySelector('.map-marker-layer');
  const detail = document.querySelector('#marker-detail');
  if (!viewport || !surface || !layer) return;

  let scale = 1;
  let x = 0;
  let y = 0;
  let drag = null;
  let activeGroup = 'all';
  let query = '';
  const minScale = 0.72;
  const maxScale = 3.2;
  const markers = [];
  const groupLabels = {
    locations: 'Locations', collectibles: 'Collectibles', equipment: 'Equipment', upgrades: 'Upgrade materials',
    npcs: 'NPCs & merchants', enemies: 'Bosses & elites', notes: 'Notes'
  };

  const render = () => {
    surface.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
  };
  const changeZoom = (next) => {
    scale = Math.max(minScale, Math.min(maxScale, next));
    render();
  };
  const hideDetail = () => { if (detail) detail.hidden = true; };

  document.querySelectorAll('[data-map-zoom]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.mapZoom;
      if (action === 'in') changeZoom(scale * 1.25);
      else if (action === 'out') changeZoom(scale / 1.25);
      else { scale = 1; x = 0; y = 0; render(); hideDetail(); }
    });
  });
  viewport.addEventListener('wheel', (event) => {
    event.preventDefault();
    changeZoom(scale * (event.deltaY < 0 ? 1.12 : .89));
  }, { passive: false });
  viewport.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.map-marker')) return;
    drag = { x: event.clientX, y: event.clientY, mapX: x, mapY: y };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('is-dragging');
    hideDetail();
  });
  viewport.addEventListener('pointermove', (event) => {
    if (!drag) return;
    x = drag.mapX + event.clientX - drag.x;
    y = drag.mapY + event.clientY - drag.y;
    render();
  });
  const endDrag = () => { drag = null; viewport.classList.remove('is-dragging'); };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  const search = document.querySelector('#map-search');
  const guideResults = [...document.querySelectorAll('.map-result')];
  const empty = document.querySelector('.map-no-results');
  function updateGuideResults() {
    let count = 0;
    guideResults.forEach((result) => {
      const visible = !query || `${result.textContent} ${result.dataset.search}`.toLowerCase().includes(query);
      result.hidden = !visible;
      if (visible) count += 1;
    });
    return count;
  }
  function updateMarkerVisibility() {
    let count = 0;
    markers.forEach(({ landmark, element }) => {
      const haystack = `${landmark.nameZh} ${landmark.categoryZh} ${groupLabels[landmark.group] || ''}`.toLowerCase();
      const visible = (activeGroup === 'all' || landmark.group === activeGroup) && (!query || haystack.includes(query));
      element.hidden = !visible;
      if (visible) count += 1;
    });
    const guideCount = updateGuideResults();
    if (empty) {
      empty.hidden = count > 0 || guideCount > 0;
      empty.textContent = 'No published point or guide matches this search.';
    }
  }
  function showDetail(landmark) {
    if (!detail) return;
    detail.replaceChildren();
    const title = document.createElement('strong');
    title.lang = 'zh';
    title.textContent = landmark.nameZh;
    const category = document.createElement('span');
    category.textContent = `${groupLabels[landmark.group]} · ${landmark.categoryZh}`;
    const note = document.createElement('p');
    note.textContent = 'English location name is being verified. This marker uses coordinate and category data only.';
    detail.append(title, category, note);
    detail.hidden = false;
  }
  function addLandmarks(data) {
    const { minX, maxX, minY, maxY } = data.bounds;
    data.landmarks.forEach((landmark) => {
      const element = document.createElement('button');
      element.type = 'button';
      element.className = `map-marker ${landmark.group}`;
      element.style.left = `${((landmark.x - minX) / (maxX - minX)) * 100}%`;
      element.style.top = `${((landmark.y - minY) / (maxY - minY)) * 100}%`;
      element.setAttribute('aria-label', `${groupLabels[landmark.group] || 'Map marker'}: ${landmark.nameZh}. English localization pending.`);
      element.title = `${groupLabels[landmark.group] || 'Map marker'}: ${landmark.nameZh}`;
      element.addEventListener('click', (event) => { event.stopPropagation(); showDetail(landmark); });
      layer.append(element);
      markers.push({ landmark, element });
    });
    updateMarkerVisibility();
  }
  search?.addEventListener('input', () => {
    query = search.value.trim().toLowerCase();
    updateMarkerVisibility();
  });
  document.querySelectorAll('.map-filter').forEach((filter) => {
    filter.addEventListener('click', () => {
      document.querySelectorAll('.map-filter').forEach((item) => { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false'); });
      filter.classList.add('active');
      filter.setAttribute('aria-pressed', 'true');
      activeGroup = filter.dataset.filter;
      hideDetail();
      updateMarkerVisibility();
    });
  });
  fetch(new URL('../assets/map-landmarks.json', window.location.href))
    .then((response) => response.ok ? response.json() : Promise.reject(new Error('Map data unavailable')))
    .then(addLandmarks)
    .catch(() => { if (empty) { empty.hidden = false; empty.textContent = 'Map markers are temporarily unavailable. Please refresh the page.'; } });
  render();
})();
