/* Everlasting Beauty Aesthetics — interactions */
(function () {
  "use strict";

  /* Sticky header state — hysteresis band (add >56, remove <16) prevents
     flicker when the scroll position wobbles around a single threshold */
  var header = document.getElementById("header");
  var ticking = false;
  var apply = function () {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    if (y > 56) header.classList.add("scrolled");
    else if (y < 16) header.classList.remove("scrolled");
    ticking = false;
  };
  var onScroll = function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  apply();

  /* Mobile menu */
  var menu = document.getElementById("mobileMenu");
  var open = document.getElementById("navToggle");
  var close = document.getElementById("navClose");
  var toggle = function (state) {
    menu.classList.toggle("open", state);
    document.body.style.overflow = state ? "hidden" : "";
  };
  if (open) open.addEventListener("click", function () { toggle(true); });
  if (close) close.addEventListener("click", function () { toggle(false); });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { toggle(false); });
  });

  /* Reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Subtle parallax on hero fan */
  var fan = document.querySelector(".fan");
  if (fan && window.matchMedia("(min-width: 900px)").matches) {
    window.addEventListener("mousemove", function (ev) {
      var cx = (ev.clientX / window.innerWidth - 0.5) * 2;
      var cy = (ev.clientY / window.innerHeight - 0.5) * 2;
      fan.style.transform = "translate3d(" + (cx * 8) + "px," + (cy * 5) + "px,0)";
    }, { passive: true });
  }
})();
