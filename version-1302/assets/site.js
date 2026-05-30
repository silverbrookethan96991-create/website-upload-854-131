(function () {
 function ready(callback) {
 if (document.readyState !== "loading") {
 callback();
 return;
 }
 document.addEventListener("DOMContentLoaded", callback);
 }

 function normalize(value) {
 return String(value || "").toLowerCase().trim();
 }

 function initMenu() {
 var button = document.querySelector(".menu-toggle");
 var links = document.querySelector(".nav-links");
 if (!button || !links) {
 return;
 }
 button.addEventListener("click", function () {
 var open = links.classList.toggle("is-open");
 button.setAttribute("aria-expanded", open ? "true" : "false");
 });
 }

 function initHero() {
 var slider = document.querySelector("[data-hero-slider]");
 if (!slider) {
 return;
 }
 var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
 var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
 if (slides.length <= 1) {
 return;
 }
 var current = 0;
 var timer = null;

 function show(index) {
 current = (index + slides.length) % slides.length;
 slides.forEach(function (slide, i) {
 slide.classList.toggle("is-active", i === current);
 });
 dots.forEach(function (dot, i) {
 dot.classList.toggle("is-active", i === current);
 });
 }

 function next() {
 show(current + 1);
 }

 function start() {
 stop();
 timer = window.setInterval(next, 5200);
 }

 function stop() {
 if (timer) {
 window.clearInterval(timer);
 timer = null;
 }
 }

 dots.forEach(function (dot, index) {
 dot.addEventListener("click", function () {
 show(index);
 start();
 });
 });
 slider.addEventListener("mouseenter", stop);
 slider.addEventListener("mouseleave", start);
 start();
 }

 function initFiltering() {
 var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));
 panels.forEach(function (panel) {
 var container = panel.parentElement;
 var list = container ? container.querySelector("[data-filter-list]") : document.querySelector("[data-filter-list]");
 var input = panel.querySelector("[data-filter-input]");
 var year = panel.querySelector("[data-filter-year]");
 if (!list || !input) {
 return;
 }
 var params = new URLSearchParams(window.location.search);
 var q = params.get("q");
 if (q && !input.value) {
 input.value = q;
 }

 function apply() {
 var query = normalize(input.value);
 var selectedYear = year ? normalize(year.value) : "";
 var cards = Array.prototype.slice.call(list.querySelectorAll("[data-filter-card]"));
 cards.forEach(function (card) {
 var text = normalize(card.getAttribute("data-search"));
 var cardYear = normalize(card.getAttribute("data-year"));
 var matchText = !query || text.indexOf(query) !== -1;
 var matchYear = !selectedYear || cardYear === selectedYear;
 card.classList.toggle("is-filter-hidden", !(matchText && matchYear));
 });
 }

 input.addEventListener("input", apply);
 if (year) {
 year.addEventListener("change", apply);
 }
 apply();
 });
 }

 ready(function () {
 initMenu();
 initHero();
 initFiltering();
 });
})();