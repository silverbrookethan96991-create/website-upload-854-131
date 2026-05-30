
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initHero() {
    var slider = document.querySelector(".hero-slider");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 6500);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var nextIndex = Number(dot.getAttribute("data-hero-dot"));
        show(nextIndex);
        start();
      });
    });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    start();
  }

  function initSearch() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll(".search-input"));
    inputs.forEach(function (input) {
      var selector = input.getAttribute("data-target") || ".movie-grid";
      var grid = document.querySelector(selector);
      if (!grid) {
        return;
      }
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));

      function apply() {
        var query = input.value.trim().toLowerCase();
        var visible = 0;
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
          var matched = !query || text.indexOf(query) !== -1;
          if (matched && card.dataset.hiddenByFilter === "1") {
            matched = false;
          }
          card.style.display = matched ? "" : "none";
          if (matched) {
            visible += 1;
          }
        });
        grid.classList.toggle("has-empty", visible === 0);
      }

      input.addEventListener("input", apply);
      apply();
    });
  }

  function initFilters() {
    var group = document.querySelector("[data-filter-group]");
    if (!group) {
      return;
    }
    var buttons = Array.prototype.slice.call(group.querySelectorAll("[data-filter]"));
    var grid = document.querySelector(".movie-grid");
    var search = document.querySelector(".search-input");
    if (!grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-filter");
        buttons.forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        cards.forEach(function (card) {
          var matched = filter === "all" || card.getAttribute("data-category") === filter;
          card.dataset.hiddenByFilter = matched ? "0" : "1";
          card.style.display = matched ? "" : "none";
        });
        if (search) {
          search.dispatchEvent(new Event("input"));
        }
      });
    });
  }

  window.setupMoviePlayer = function (videoId, videoUrl) {
    var video = document.getElementById(videoId);
    if (!video) {
      return;
    }
    var shell = video.closest(".player-shell");
    var button = shell ? shell.querySelector(".player-overlay") : null;
    var attached = false;
    var hls = null;

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
      } else {
        video.src = videoUrl;
      }
    }

    function play() {
      attach();
      if (shell) {
        shell.classList.add("is-playing");
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          if (shell) {
            shell.classList.remove("is-playing");
          }
          if (button) {
            button.querySelector("strong").textContent = "点击播放";
          }
        });
      }
    }

    if (button) {
      button.addEventListener("click", play);
    }

    video.addEventListener("play", function () {
      if (shell) {
        shell.classList.add("is-playing");
      }
    });

    video.addEventListener("ended", function () {
      if (shell) {
        shell.classList.remove("is-playing");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  ready(function () {
    initHero();
    initSearch();
    initFilters();
  });
})();
