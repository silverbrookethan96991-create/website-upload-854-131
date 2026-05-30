(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function normalizeText(value) {
    return (value || "").toString().toLowerCase().trim();
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  function setupListSearch() {
    var input = document.querySelector("[data-list-search]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-search-text]"));
    var empty = document.querySelector("[data-empty-state]");
    if (!input || cards.length === 0) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q");
    if (initial) {
      input.value = initial;
    }
    function applyFilter() {
      var keyword = normalizeText(input.value);
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalizeText(card.getAttribute("data-search-text"));
        var matched = keyword === "" || text.indexOf(keyword) !== -1;
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("visible", visible === 0);
      }
    }
    input.addEventListener("input", applyFilter);
    applyFilter();
  }

  ready(function () {
    setupMenu();
    setupListSearch();
  });
})();

function initMoviePlayer(videoId, buttonId, streamUrl) {
  var video = document.getElementById(videoId);
  var button = document.getElementById(buttonId);
  if (!video || !button || !streamUrl) {
    return;
  }
  var attached = false;
  var hlsPlayer = null;

  function attachStream() {
    if (attached) {
      return;
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsPlayer = new Hls({ enableWorker: true });
      hlsPlayer.loadSource(streamUrl);
      hlsPlayer.attachMedia(video);
    } else {
      video.src = streamUrl;
    }
    attached = true;
  }

  function startPlayback() {
    attachStream();
    button.classList.add("is-hidden");
    var attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(function () {
        button.classList.remove("is-hidden");
      });
    }
  }

  button.addEventListener("click", startPlayback);
  video.addEventListener("click", function () {
    if (video.paused) {
      startPlayback();
    }
  });
  video.addEventListener("play", function () {
    button.classList.add("is-hidden");
  });
  video.addEventListener("ended", function () {
    button.classList.remove("is-hidden");
  });
  window.addEventListener("beforeunload", function () {
    if (hlsPlayer) {
      hlsPlayer.destroy();
    }
  });
}
