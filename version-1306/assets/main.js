
(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterSelect = document.querySelector('[data-filter-select]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilters() {
    var keyword = normalize(filterInput ? filterInput.value : '');
    var year = normalize(filterSelect ? filterSelect.value : '');

    cards.forEach(function (card) {
      var title = normalize(card.getAttribute('data-title'));
      var meta = normalize(card.getAttribute('data-meta'));
      var matchKeyword = !keyword || title.indexOf(keyword) !== -1 || meta.indexOf(keyword) !== -1;
      var matchYear = !year || meta.indexOf(year) !== -1;
      card.style.display = matchKeyword && matchYear ? '' : 'none';
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyFilters);
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', applyFilters);
  }
})();
