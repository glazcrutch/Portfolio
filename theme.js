/* Global theme manager: loaded in <head> of every page so the theme is applied before first paint. */
(() => {
  "use strict";

  const KEY = "theme";
  const DEFAULT = "light";
  const root = document.documentElement;

  const read = () => {
    try {
      const v = localStorage.getItem(KEY);
      return v === "dark" || v === "light" ? v : DEFAULT;
    } catch (_) {
      return DEFAULT; // storage blocked (private mode etc.)
    }
  };

  const apply = (theme) => {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b1220" : "#f8fafc");
  };

  const save = (theme) => {
    try { localStorage.setItem(KEY, theme); } catch (_) { /* ignore */ }
  };

  // Apply immediately (prevents a flash of the wrong theme)
  apply(read());

  window.ThemeManager = {
    get: read,
    set(theme) { apply(theme); save(theme); sync(); },
  };

  /* ---------- Settings page toggle ---------- */
  const sync = () => {
    const toggle = document.getElementById("themeToggle");
    const label = document.getElementById("themeLabel");
    const theme = read();
    if (toggle) toggle.checked = theme === "dark";
    if (label) label.textContent = theme === "dark" ? "Dark" : "Light";
  };

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.addEventListener("change", () => window.ThemeManager.set(toggle.checked ? "dark" : "light"));
    }
    sync();
  });

  // Safety net: if script.js never runs (missing file, error), nothing would ever
  // get the "visible" class and the page would look empty. Reveal everything instead.
  window.addEventListener("load", () => {
    setTimeout(() => {
      const els = document.querySelectorAll(".reveal");
      if (els.length && !document.querySelector(".reveal.visible")) {
        els.forEach((el) => el.classList.add("visible"));
      }
    }, 1200);
  });

  // Keep other open tabs/pages in sync
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) { apply(read()); sync(); }
  });

  // Restore correctly when coming back via the back/forward cache
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) { apply(read()); sync(); }
  });
})();
