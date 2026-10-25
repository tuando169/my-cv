(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header state ---------- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  var closeMenu = function () {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "false");
    mobileNav.hidden = true;
  };

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.hidden = isOpen;
    });

    mobileNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) closeMenu();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach(function (el, index) {
      // stagger items that sit next to each other
      var siblings = el.parentElement ? el.parentElement.querySelectorAll(":scope > .reveal") : [el];
      var position = Array.prototype.indexOf.call(siblings, el);
      if (siblings.length > 1 && position > -1) {
        el.style.transitionDelay = Math.min(position * 70, 280) + "ms";
      }
      revealObserver.observe(el);
    });
  }

  /* ---------- Animated counters ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));

  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1100;
    var started = null;

    var tick = function (timestamp) {
      if (!started) started = timestamp;
      var progress = Math.min((timestamp - started) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = value.toLocaleString("vi-VN") + suffix;
      if (progress < 1) window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  };

  if (!reduceMotion && "IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- Active section in nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ---------- Smooth anchor scroll (fallback + offset polish) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      if (history.pushState) history.pushState(null, "", id);
    });
  });
})();
