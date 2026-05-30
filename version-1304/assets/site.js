(function () {
    var menuButton = document.querySelector('.mobile-menu-button');
    var mobileMenu = document.querySelector('.mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('.hero-slider');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var index = 0;

        var showSlide = function (nextIndex) {
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === nextIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === nextIndex);
            });
            index = nextIndex;
        };

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide((index + 1) % slides.length);
            }, 5200);
        }
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title][data-meta]'));
    var empty = document.querySelector('[data-no-results]');

    var applyFilter = function () {
        if (!cards.length) {
            return;
        }

        var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
        var year = yearSelect ? yearSelect.value : '';
        var visible = 0;

        cards.forEach(function (card) {
            var content = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-meta')).toLowerCase();
            var matchKeyword = !keyword || content.indexOf(keyword) !== -1;
            var matchYear = !year || card.getAttribute('data-year') === year;
            var show = matchKeyword && matchYear;
            card.style.display = show ? '' : 'none';
            if (show) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle('is-visible', visible === 0);
        }
    };

    if (filterInput) {
        var query = new URLSearchParams(window.location.search).get('q');
        if (query) {
            filterInput.value = query;
        }
        filterInput.addEventListener('input', applyFilter);
    }

    if (yearSelect) {
        yearSelect.addEventListener('change', applyFilter);
    }

    applyFilter();
})();
