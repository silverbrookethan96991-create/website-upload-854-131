(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-button]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (slides.length <= 1) {
            return;
        }
        var current = 0;
        var timer = null;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }
        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });
        hero.addEventListener("mouseenter", function () {
            window.clearInterval(timer);
        });
        hero.addEventListener("mouseleave", start);
        start();
    }

    function initSearch() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-search-scope]"));
        scopes.forEach(function (scope) {
            var form = scope.querySelector("[data-search-form]");
            var input = scope.querySelector("[data-search-input]");
            var empty = scope.querySelector("[data-empty-tip]");
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
            if (!form || !input || !cards.length) {
                return;
            }
            function apply() {
                var value = input.value.trim().toLowerCase();
                var visible = 0;
                cards.forEach(function (card) {
                    var text = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-region"),
                        card.textContent
                    ].join(" ").toLowerCase();
                    var matched = !value || text.indexOf(value) !== -1;
                    card.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                apply();
            });
            input.addEventListener("input", apply);
        });
    }

    window.initVideoPlayer = function (videoId, buttonId, url, messageId) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var message = document.getElementById(messageId);
        var hlsInstance = null;
        var prepared = false;
        if (!video || !button || !url) {
            return;
        }
        function setMessage(text) {
            if (!message) {
                return;
            }
            message.textContent = text;
            message.hidden = !text;
        }
        function prepare() {
            if (prepared) {
                return;
            }
            prepared = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(url);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setMessage("播放暂时无法加载，请稍后重试。");
                    }
                });
                return;
            }
            setMessage("播放暂时无法加载，请稍后重试。");
        }
        function play() {
            prepare();
            button.classList.add("is-hidden");
            setMessage("");
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    button.classList.remove("is-hidden");
                });
            }
        }
        button.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            button.classList.add("is-hidden");
        });
        video.addEventListener("pause", function () {
            if (!video.ended) {
                button.classList.remove("is-hidden");
            }
        });
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    };

    ready(function () {
        initMenu();
        initHero();
        initSearch();
    });
}());
