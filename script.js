/* Portfolio interactions: nav toggle, header state, scroll reveal, project filters, footer year. */
(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header: glass effect once scrolled ---------- */
  const header = document.getElementById("header");
  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el, i) => {
      el.style.setProperty("--delay", `${(i % 4) * 70}ms`);
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Active nav link on scroll (home page only) ---------- */
  const sections = ["home", "about", "projects", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const links = document.querySelectorAll('.nav-link[href^="#"]');
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((l) => {
            const active = l.getAttribute("href") === `#${entry.target.id}`;
            l.classList.toggle("active", active);
            if (active) l.setAttribute("aria-current", "true");
            else l.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Project filters ---------- */
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  const empty = document.getElementById("emptyState");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", String(on));
      });

      let shown = 0;
      cards.forEach((card) => {
        const cats = (card.dataset.category || "").split(/\s+/);
        const match = filter === "all" || cats.includes(filter);
        card.classList.toggle("hide", !match);
        card.classList.remove("fade-in");
        if (match) {
          shown++;
          card.classList.add("visible"); // make sure revealed cards stay visible
          void card.offsetWidth; // restart animation
          card.classList.add("fade-in");
        }
      });

      if (empty) empty.hidden = shown !== 0;
    });
  });
})();
