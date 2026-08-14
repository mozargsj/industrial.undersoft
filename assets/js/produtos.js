// industrial.undersoft — filtros da página de produtos

const productList = document.querySelector('#productList');
const productRows = Array.from(document.querySelectorAll('.product-row'));
const resultCount = document.querySelector('#resultCount');
const emptyState = document.querySelector('#productEmpty');
const clearButton = document.querySelector('#filterClear');
const filterGroups = Array.from(document.querySelectorAll('.filter-group'));

function getActiveFilters() {
  const active = {};
  filterGroups.forEach((group) => {
    const key = group.dataset.filterGroup;
    const checked = Array.from(group.querySelectorAll('input:checked')).map((input) => input.value);
    if (checked.length) active[key] = checked;
  });
  return active;
}

function applyFilters() {
  const active = getActiveFilters();
  let visibleCount = 0;

  productRows.forEach((row) => {
    const matches = Object.entries(active).every(([key, values]) => values.includes(row.dataset[key]));
    row.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  resultCount.textContent = visibleCount === 1 ? '1 produto' : `${visibleCount} produtos`;
  emptyState.hidden = visibleCount !== 0;
  productList.hidden = visibleCount === 0;
}

filterGroups.forEach((group) => {
  group.addEventListener('change', applyFilters);
});

clearButton?.addEventListener('click', () => {
  document.querySelectorAll('.filter-group input:checked').forEach((input) => { input.checked = false; });
  applyFilters();
});

// Painel de filtros suspenso (mobile): abre como gaveta, "Aplicar filtros" volta para a grade
const filtersToggle = document.querySelector('#filtersToggle');
const filtersPanel = document.querySelector('#filtersPanel');
const filtersApply = document.querySelector('#filtersApply');
const filtersBackdrop = document.querySelector('#filtersBackdrop');

function openFilters() {
  filtersPanel?.classList.add('open');
  filtersBackdrop?.classList.add('active');
  filtersToggle?.setAttribute('aria-expanded', 'true');
  document.body.classList.add('modal-open');
}

function closeFilters() {
  filtersPanel?.classList.remove('open');
  filtersBackdrop?.classList.remove('active');
  filtersToggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('modal-open');
  filtersToggle?.focus();
}

filtersToggle?.addEventListener('click', openFilters);
filtersApply?.addEventListener('click', closeFilters);
filtersBackdrop?.addEventListener('click', closeFilters);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && filtersPanel?.classList.contains('open')) closeFilters();
});
