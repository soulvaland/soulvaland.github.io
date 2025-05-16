/* ──────────────────────────────────────────────────────────
   1. Navigation Drawer (Hamburger icon ➜ mobile only)
   ────────────────────────────────────────────────────────── */
const drawer       = document.getElementById('drawer');
const drawerToggle = document.getElementById('drawerToggle');

if (drawer && drawerToggle) {
  // open drawer
  drawerToggle.addEventListener('click', () => {
    drawer.open = true;
  });

  // close drawer after a link click (good UX on mobile)
  drawer.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.open = false;
    });
  });
}

/* ──────────────────────────────────────────────────────────
   2. Menu category tabs (only runs on menu.html)
   ────────────────────────────────────────────────────────── */
const tabs          = document.getElementById('category-tabs');          // <md-tabs>
const menuContainer = document.getElementById('menu-items-container');   // wrapper holding .menu-category panels

if (tabs && menuContainer) {
  const categoryPanels = menuContainer.querySelectorAll('.menu-category');

  const showCategory = idx => {
    categoryPanels.forEach((panel, i) => {
      panel.style.display = i === idx ? '' : 'none';
    });
  };

  // initial state
  showCategory(tabs.activeTabIndex || 0);

  // on-tab change (md-tabs fires `change`)
  tabs.addEventListener('change', evt => {
    showCategory(evt.target.activeTabIndex);
  });
}

/* ──────────────────────────────────────────────────────────
   3. Grid vs List view toggle (also menu.html only)
   ────────────────────────────────────────────────────────── */
const gridBtn = document.getElementById('gridViewBtn');
const listBtn = document.getElementById('listViewBtn');

if (menuContainer && gridBtn && listBtn) {
  const setView = mode => {
    menuContainer.classList.toggle('grid-view', mode === 'grid');
    menuContainer.classList.toggle('list-view', mode === 'list');
    gridBtn.disabled = (mode === 'grid');
    listBtn.disabled = (mode === 'list');
  };

  gridBtn.addEventListener('click', () => setView('grid'));
  listBtn.addEventListener('click', () => setView('list'));

  // default to grid view
  setView('grid');
}
