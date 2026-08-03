/* ==========================================================================
   NEOSIGNAL — script.js
   No frameworks, no build step, no backend. Pure DOM + Canvas.

   TABLE OF CONTENTS
   1. Channel data (EDIT ME)
   2. Category data (EDIT ME)
   3. Rendering
   4. Category filter logic
   5. Particle background
   6. Loader
   7. Scroll-triggered fade-ins
   8. Back-to-top
   9. Misc (year stamp)
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. CHANNEL DATA
   --------------------------------------------------------------------------
   Add, remove, or edit channels here. Each object needs:
     name        - channel display name
     description - one short sentence
     image       - URL or path to a square-ish image (placeholder used if empty)
     members     - a display string, e.g. "12.4K" or "890"
     link        - the Telegram invite URL (https://t.me/yourchannel)
     category    - must match one of the `id` values in CATEGORIES below
   -------------------------------------------------------------------------- */
const CHANNELS = [
  {
    name: "CineVault 4K",
    description: "Fresh movie drops in 4K/1080p with fast, direct download links.",
    image: "https://ibb.co/q3c45S46",
    members: "128K",
    link: "https://t.me/",
    category: "movies",
  },
  {
    name: "BingeBox Series",
    description: "Full seasons of trending TV series, subbed and dubbed.",
    image: "",
    members: "94.3K",
    link: "https://t.me/",
    category: "series",
  },
  {
    name: "Otaku Signal",
    description: "Weekly anime episodes, simulcasts, and manga chapter drops.",
    image: "",
    members: "76.8K",
    link: "https://t.me/",
    category: "anime",
  },
  {
    name: "PixelForge Games",
    description: "Cracked & free-to-play PC games, mods, and patch notes.",
    image: "",
    members: "61.2K",
    link: "https://t.me/",
    category: "games",
  },
  {
    name: "StudyGrid Academy",
    description: "Free courses, ebooks, and exam prep across every subject.",
    image: "",
    members: "43.9K",
    link: "https://t.me/",
    category: "education",
  },
  {
    name: "Retro Cinema Club",
    description: "Cult classics and restored prints from the golden era.",
    image: "",
    members: "22.5K",
    link: "https://t.me/",
    category: "movies",
  },
  {
    name: "K-Drama Central",
    description: "Same-day Korean drama episodes with clean subtitles.",
    image: "",
    members: "58.1K",
    link: "https://t.me/",
    category: "series",
  },
  {
    name: "Shonen Weekly",
    description: "Battle-anime discussion, leaks, and chapter breakdowns.",
    image: "",
    members: "39.4K",
    link: "https://t.me/",
    category: "anime",
  },
  {
    name: "Indie Arcade",
    description: "Handpicked indie games, betas, and dev diaries.",
    image: "",
    members: "18.7K",
    link: "https://t.me/",
    category: "games",
  },
  {
    name: "CodeCrate Dev",
    description: "Programming tutorials, cheat sheets, and dev tool drops.",
    image: "",
    members: "51.6K",
    link: "https://t.me/",
    category: "education",
  },
  {
    name: "MidnightMemes",
    description: "Late-night meme dumps and general internet chaos.",
    image: "",
    members: "112K",
    link: "https://t.me/",
    category: "others",
  },
  {
    name: "TechPulse Daily",
    description: "Daily tech news, leaks, and gadget deals in one feed.",
    image: "",
    members: "34.2K",
    link: "https://t.me/",
    category: "others",
  },
];

/* --------------------------------------------------------------------------
   2. CATEGORY DATA
   --------------------------------------------------------------------------
   `id` must match the `category` field used in CHANNELS above.
   `label` is what's shown on the filter chip.
   -------------------------------------------------------------------------- */
const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "movies", label: "Movies" },
  { id: "series", label: "Series" },
  { id: "anime", label: "Anime" },
  { id: "games", label: "Games" },
  { id: "education", label: "Education" },
  { id: "others", label: "Others" },
];

/* A tiny inline SVG used whenever a channel has no `image` set. */
const PLACEHOLDER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 54 54'%3E%3Crect width='54' height='54' rx='16' fill='%23161618'/%3E%3Ctext x='27' y='34' font-size='22' text-anchor='middle' fill='%23FFD700' font-family='Arial'%3E%23%3C/text%3E%3C/svg%3E";

/* --------------------------------------------------------------------------
   3. RENDERING
   -------------------------------------------------------------------------- */
const grid = document.getElementById("channel-grid");
const emptyState = document.getElementById("empty-state");

/** Escapes text before it's inserted as HTML, so channel data can never break markup. */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/** Builds the HTML for a single channel card. */
function buildCard(channel) {
  const img = channel.image ? channel.image : PLACEHOLDER_AVATAR;
  return `
    <article class="channel-card fade-in is-visible" data-category="${escapeHtml(channel.category)}">
      <div class="card-top">
        <img class="card-avatar" src="${escapeHtml(img)}" alt="${escapeHtml(channel.name)} logo" loading="lazy" />
        <div class="card-titles">
          <div class="card-name">${escapeHtml(channel.name)}</div>
          <div class="card-category">${escapeHtml(channel.category)}</div>
        </div>
      </div>
      <p class="card-desc">${escapeHtml(channel.description)}</p>
      <div class="card-bottom">
        <span class="card-members">${escapeHtml(channel.members)} members</span>
        <a class="join-button" href="${escapeHtml(channel.link)}" target="_blank" rel="noopener noreferrer">Join Now</a>
      </div>
    </article>
  `;
}

/** Renders the given list of channels into the grid, or shows the empty state. */
function renderChannels(list) {
  if (list.length === 0) {
    grid.innerHTML = "";
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;
  grid.innerHTML = list.map(buildCard).join("");
}

/* --------------------------------------------------------------------------
   4. CATEGORY FILTER LOGIC
   -------------------------------------------------------------------------- */
const filterBar = document.getElementById("category-filters");

let activeCategory = "all";

/** Builds the category filter chips from the CATEGORIES array. */
function renderCategoryChips() {
  filterBar.innerHTML = CATEGORIES.map(
    (cat) =>
      `<button class="chip${cat.id === "all" ? " active" : ""}" data-category="${cat.id}">${escapeHtml(cat.label)}</button>`
  ).join("");
}

/** Re-filters CHANNELS by the active category, then renders. */
function applyFilters() {
  const filtered = CHANNELS.filter(
    (c) => activeCategory === "all" || c.category === activeCategory
  );
  renderChannels(filtered);
}

filterBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  filterBar.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  btn.classList.add("active");
  activeCategory = btn.dataset.category;
  applyFilters();
});

/* --------------------------------------------------------------------------
   5. PARTICLE BACKGROUND
   -------------------------------------------------------------------------- */
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let animationFrame;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.6 + 0.6,
    color: Math.random() > 0.5 ? "255, 215, 0" : "0, 200, 255",
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move + draw dots
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color}, 0.75)`;
    ctx.fill();
  });

  // Draw connecting lines between nearby particles
  const maxDist = 130;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(0, 200, 255, ${0.12 * (1 - dist / maxDist)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  animationFrame = requestAnimationFrame(drawParticles);
}

function initParticles() {
  resizeCanvas();
  createParticles();
  if (!prefersReducedMotion) {
    drawParticles();
  } else {
    // Draw a single static frame instead of a continuous animation
    drawParticles();
    cancelAnimationFrame(animationFrame);
  }
}

window.addEventListener("resize", () => {
  cancelAnimationFrame(animationFrame);
  resizeCanvas();
  createParticles();
  if (!prefersReducedMotion) drawParticles();
});

/* --------------------------------------------------------------------------
   6. LOADER
   -------------------------------------------------------------------------- */
const loader = document.getElementById("loader");

window.addEventListener("load", () => {
  // Small minimum delay so the animation is perceptible even on fast loads
  setTimeout(() => {
    loader.classList.add("loader-hidden");
  }, 500);
});

/* --------------------------------------------------------------------------
   7. SCROLL-TRIGGERED FADE-INS
   -------------------------------------------------------------------------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

/* --------------------------------------------------------------------------
   8. BACK-TO-TOP
   -------------------------------------------------------------------------- */
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    backToTopBtn.classList.add("visible");
  } else {
    backToTopBtn.classList.remove("visible");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* --------------------------------------------------------------------------
   9. MISC
   -------------------------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* --------------------------------------------------------------------------
   INIT
   -------------------------------------------------------------------------- */
renderCategoryChips();
applyFilters();
initParticles();
