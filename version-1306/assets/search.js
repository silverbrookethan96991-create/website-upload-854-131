
(function () {
  var input = document.querySelector('[data-search-input]');
  var select = document.querySelector('[data-search-year]');
  var results = document.querySelector('[data-search-results]');
  var form = document.querySelector('[data-search-form]');
  var params = new URLSearchParams(window.location.search);
  var firstQuery = params.get('q') || '';

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function render(items) {
    if (!results) {
      return;
    }

    if (!items.length) {
      results.innerHTML = '<div class="empty-state">没有找到匹配的影片，请尝试其他关键词。</div>';
      return;
    }

    results.innerHTML = items.slice(0, 120).map(function (item) {
      return [
        '<a class="search-result-item" href="' + item.url + '">',
        '<img src="' + item.image + '" alt="' + item.title.replace(/"/g, '&quot;') + '" loading="lazy">',
        '<span>',
        '<h2>' + item.title + '</h2>',
        '<p>' + item.year + ' · ' + item.region + ' · ' + item.genre + '</p>',
        '<p>' + item.oneLine + '</p>',
        '</span>',
        '</a>'
      ].join('');
    }).join('');
  }

  function search() {
    var keyword = normalize(input ? input.value : '');
    var year = normalize(select ? select.value : '');
    var items = (window.SEARCH_MOVIES || []).filter(function (item) {
      var haystack = normalize([item.title, item.region, item.genre, item.type, item.year, item.category, item.oneLine].join(' '));
      var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchYear = !year || normalize(item.year) === year;
      return matchKeyword && matchYear;
    });
    render(items);
  }

  if (input) {
    input.value = firstQuery;
    input.addEventListener('input', search);
  }

  if (select) {
    select.addEventListener('change', search);
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      search();
    });
  }

  search();
})();
