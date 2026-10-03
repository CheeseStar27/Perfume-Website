/* ==========================================================================
   Sillage — shared site behaviour (no dependencies)
   - Draws the perfume bottle illustrations
   - Header shadow on scroll and the mobile menu
   - Filter buttons on the Menu and Materials pages
   - Gentle reveal of sections as they scroll into view
   ========================================================================== */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Bottle illustrations ----------
     Any element with data-bottle="tall | round | square" gets an SVG flacon.
     Optional attributes:
       data-liquid  hex colour of the perfume, e.g. "#e3bf62"
       data-cap     gold | black | wood | silver
       data-label   short text printed on the label, e.g. "N°01"          */

  const CAPS = {
    gold: ["#f0dfb4", "#c9a66b", "#8c6a3c"],
    black: ["#5a534c", "#26221e", "#0d0b0a"],
    wood: ["#c2916a", "#8a5a3b", "#55341e"],
    silver: ["#fbfbfa", "#c9cbcd", "#86898d"],
  };

  const STROKE = "rgba(29, 26, 22, 0.22)";

  const hexToRgb = (hex) => {
    let h = hex.replace("#", "");
    if (h.length === 3) h = [...h].map((c) => c + c).join("");
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  // Blend a colour towards another (amount 0–1). Used for liquid highlights and shadows.
  const mix = (hex, target, amount) => {
    const from = hexToRgb(hex);
    const to = hexToRgb(target);
    return "#" + from
      .map((c, i) => Math.round(c + (to[i] - c) * amount).toString(16).padStart(2, "0"))
      .join("");
  };

  const escapeText = (text) =>
    text.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);

  const defs = (id, liquid, cap) => `
    <defs>
      <linearGradient id="${id}-liquid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${mix(liquid, "#ffffff", 0.3)}"/>
        <stop offset=".5" stop-color="${liquid}"/>
        <stop offset="1" stop-color="${mix(liquid, "#000000", 0.25)}"/>
      </linearGradient>
      <linearGradient id="${id}-shade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity=".32"/>
        <stop offset=".3" stop-color="#fff" stop-opacity="0"/>
        <stop offset=".7" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".24"/>
      </linearGradient>
      <linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity=".75"/>
        <stop offset=".45" stop-color="#fff" stop-opacity=".3"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".55"/>
      </linearGradient>
      <linearGradient id="${id}-cap" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${cap[0]}"/>
        <stop offset=".45" stop-color="${cap[1]}"/>
        <stop offset="1" stop-color="${cap[2]}"/>
      </linearGradient>
      <radialGradient id="${id}-cap-round" cx=".36" cy=".32" r=".75">
        <stop offset="0" stop-color="${cap[0]}"/>
        <stop offset=".5" stop-color="${cap[1]}"/>
        <stop offset="1" stop-color="${cap[2]}"/>
      </radialGradient>
      <linearGradient id="${id}-metal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#f3e5c2"/>
        <stop offset=".5" stop-color="#c9a66b"/>
        <stop offset="1" stop-color="#8c6a3c"/>
      </linearGradient>
      <clipPath id="${id}-level">
        <rect x="0" y="100" width="120" height="100"/>
      </clipPath>
    </defs>`;

  // Each flacon is drawn on a 120 × 200 canvas: shadow, glass, liquid, shine, collar, cap.
  const SHAPES = {
    tall: (id) => `
      <ellipse cx="60" cy="194" rx="40" ry="4" fill="#000" opacity=".14"/>
      <rect x="24" y="58" width="72" height="134" rx="9" fill="url(#${id}-glass)" stroke="${STROKE}"/>
      <rect x="29" y="80" width="62" height="105" rx="5" fill="url(#${id}-liquid)"/>
      <rect x="29" y="80" width="62" height="105" rx="5" fill="url(#${id}-shade)"/>
      <rect x="29" y="80" width="62" height="1.6" fill="#fff" opacity=".5"/>
      <rect x="33" y="66" width="5" height="112" rx="2.5" fill="#fff" opacity=".55"/>
      <rect x="50" y="48" width="20" height="11" rx="1.5" fill="url(#${id}-metal)"/>
      <rect x="42" y="6" width="36" height="43" rx="4" fill="url(#${id}-cap)"/>
      <rect x="47" y="10" width="4" height="35" rx="2" fill="#fff" opacity=".3"/>`,

    round: (id) => `
      <ellipse cx="60" cy="194" rx="46" ry="4" fill="#000" opacity=".14"/>
      <rect x="51" y="52" width="18" height="30" rx="3" fill="url(#${id}-glass)" stroke="${STROKE}"/>
      <circle cx="60" cy="134" r="56" fill="url(#${id}-glass)" stroke="${STROKE}"/>
      <g clip-path="url(#${id}-level)">
        <circle cx="60" cy="134" r="49" fill="url(#${id}-liquid)"/>
        <circle cx="60" cy="134" r="49" fill="url(#${id}-shade)"/>
      </g>
      <rect x="25" y="100" width="70" height="1.6" fill="#fff" opacity=".5"/>
      <path d="M16 140 A44 44 0 0 1 29 103" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>
      <rect x="50" y="45" width="20" height="9" rx="1.5" fill="url(#${id}-metal)"/>
      <circle cx="60" cy="26" r="19" fill="url(#${id}-cap-round)"/>`,

    square: (id) => `
      <ellipse cx="60" cy="194" rx="50" ry="4" fill="#000" opacity=".14"/>
      <rect x="12" y="66" width="96" height="126" rx="7" fill="url(#${id}-glass)" stroke="${STROKE}"/>
      <rect x="19" y="86" width="82" height="98" rx="3" fill="url(#${id}-liquid)"/>
      <rect x="19" y="86" width="82" height="98" rx="3" fill="url(#${id}-shade)"/>
      <rect x="19" y="86" width="82" height="1.6" fill="#fff" opacity=".5"/>
      <rect x="23" y="74" width="5" height="108" rx="2.5" fill="#fff" opacity=".55"/>
      <rect x="49" y="56" width="22" height="11" rx="1.5" fill="url(#${id}-metal)"/>
      <rect x="36" y="14" width="48" height="43" rx="3" fill="url(#${id}-cap)"/>
      <rect x="41" y="18" width="4" height="35" rx="2" fill="#fff" opacity=".3"/>`,
  };

  const LABEL_TOP = { tall: 116, round: 124, square: 116 };

  const label = (shape, text) => {
    if (!text) return "";
    const y = LABEL_TOP[shape];
    return `
      <rect x="38" y="${y}" width="44" height="34" rx="1.5" fill="#fbf8f3" opacity=".94" stroke="#c9a66b" stroke-width=".6"/>
      <text x="60.6" y="${y + 13}" text-anchor="middle" font-family="Jost, Arial, sans-serif" font-size="5.2" letter-spacing="1.3" fill="#1d1a16">SILLAGE</text>
      <text x="60" y="${y + 27}" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-style="italic" font-size="10" fill="#1d1a16">${escapeText(text)}</text>`;
  };

  let bottleCount = 0;

  document.querySelectorAll("[data-bottle]").forEach((el) => {
    const shape = SHAPES[el.dataset.bottle] ? el.dataset.bottle : "tall";
    const liquid = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(el.dataset.liquid || "") ? el.dataset.liquid : "#d6b688";
    const cap = CAPS[el.dataset.cap] || CAPS.gold;
    const id = `flacon-${++bottleCount}`;

    el.innerHTML = `<svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${defs(id, liquid, cap)}${SHAPES[shape](id)}${label(shape, el.dataset.label)}</svg>`;
  });

  /* ---------- Header ---------- */
  const header = document.querySelector(".site-header");

  if (header) {
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };

    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.matchMedia("(min-width: 861px)").addEventListener("change", (event) => {
      if (event.matches) setOpen(false);
    });
  }

  /* ---------- Filters ----------
     <div data-filter-group="list-id"> holds buttons with data-filter="value".
     Items inside #list-id carry data-family="value" (space-separated for several).
     A link such as menu.html#floral opens the page with that filter applied.    */

  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const listId = group.dataset.filterGroup;
    const list = document.getElementById(listId);
    if (!list) return;

    const items = [...list.querySelectorAll("[data-family]")];
    const buttons = [...group.querySelectorAll("[data-filter]")];
    const status = document.querySelector(`[data-filter-status="${listId}"]`);

    const apply = (value) => {
      let shown = 0;

      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.filter === value));
      });

      items.forEach((item) => {
        const match = value === "all" || item.dataset.family.split(" ").includes(value);
        item.hidden = !match;
        if (match) shown += 1;
      });

      if (status) {
        const noun = status.dataset.noun || "items";
        status.textContent = value === "all"
          ? `Showing all ${items.length} ${noun}`
          : `Showing ${shown} of ${items.length} ${noun}`;
      }
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => apply(button.dataset.filter));
    });

    // #floral applies that filter; a link to one item (#oud-fume) clears any filter hiding it.
    const syncWithHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!hash) return;

      const target = document.getElementById(hash);

      if (buttons.some((button) => button.dataset.filter === hash)) {
        apply(hash);
      } else if (target && list.contains(target) && target.closest("[hidden]")) {
        apply("all");
      } else {
        return;
      }

      (target || group).scrollIntoView({ block: "start" });
    };

    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);
  });

  /* ---------- Scroll reveal ----------
     Only elements that start below the fold are hidden, so nothing flickers
     and everything stays visible if this script never runs.                 */

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

      const siblings = [...el.parentElement.children].filter((child) => child.hasAttribute("data-reveal"));
      el.style.setProperty("--delay", `${Math.min(siblings.indexOf(el), 5) * 90}ms`);
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
