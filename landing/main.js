/**
 * Pixels of Akankshaa — landing page
 *
 * Two jobs:
 *   1. Inline the decorative desk artwork as real <svg> nodes (never <img>),
 *      picking the desktop or mobile set for the current breakpoint.
 *   2. Drive the mouse parallax between the background and foreground props.
 */

/** Matches the CSS breakpoint. */
const MOBILE_BREAKPOINT = 768;

/** Maximum parallax displacement in px, reached only at the viewport edges. */
const PARALLAX_MAX_PX = 5;

/** Lerp damping factor (0–1). Lower is smoother and slower. */
const PARALLAX_DAMPING = 0.06;

const SCENERY = {
  desktop: {
    'scenery-table': 'table',
    'scenery-bg': 'Background',
    'scenery-fg': 'Foreground',
  },
  mobile: {
    'scenery-table': 'table_mobile',
    'scenery-bg': 'Background_mobile',
    'scenery-fg': 'Foreground_mobile',
  },
};

const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

/* ── Scenery ───────────────────────────────────────────────────────────── */

/** Cache of already-fetched SVG source, keyed by file name. */
const sceneryCache = new Map();

async function loadScenery(name) {
  if (!sceneryCache.has(name)) {
    sceneryCache.set(
      name,
      fetch(new URL(`./scenery/${name}.svg`, import.meta.url))
        .then((res) => (res.ok ? res.text() : Promise.reject(res.status)))
        .catch((err) => {
          console.warn('[scenery] could not load', name, err);
          return '';
        }),
    );
  }
  return sceneryCache.get(name);
}

/**
 * Swap the three scenery layers to the set for the current breakpoint.
 * Layers keep their previous artwork until the new one is ready, so the
 * desk never flashes empty on resize.
 */
async function renderScenery() {
  const set = SCENERY[isMobile() ? 'mobile' : 'desktop'];

  await Promise.all(
    Object.entries(set).map(async ([id, name]) => {
      const host = document.getElementById(id);
      if (!host || host.dataset.layer === name) return;

      const markup = await loadScenery(name);
      if (!markup) return;

      host.innerHTML = markup;
      host.dataset.layer = name;
    }),
  );
}

/* ── Parallax ──────────────────────────────────────────────────────────── */

/**
 * Sign-preserving power curve: near the centre the output is much smaller
 * than the input, and at the edges (±1) input === output.
 */
function easePower(t, power = 2) {
  return Math.sign(t) * Math.pow(Math.abs(t), power);
}

/**
 * Mouse parallax scoped to .viewport.
 *
 * Foreground props travel WITH the cursor and background props AGAINST it,
 * which is how depth reads in the real world. Skipped entirely on touch
 * devices, where there is no persistent hover point.
 */
function initParallax() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const viewport = document.getElementById('viewport');
  const bg = document.getElementById('scenery-bg');
  const fg = document.getElementById('scenery-fg');
  if (!viewport || !bg || !fg) return;

  let targetX = 0;
  let targetY = 0;
  let bgX = 0;
  let bgY = 0;
  let fgX = 0;
  let fgY = 0;
  let running = false;

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(animate);
  }

  function animate() {
    const easedX = easePower(targetX, 2);
    const easedY = easePower(targetY, 2);

    const fgTargetX = easedX * PARALLAX_MAX_PX;
    const fgTargetY = easedY * PARALLAX_MAX_PX;
    const bgTargetX = -fgTargetX;
    const bgTargetY = -fgTargetY;

    fgX += (fgTargetX - fgX) * PARALLAX_DAMPING;
    fgY += (fgTargetY - fgY) * PARALLAX_DAMPING;
    bgX += (bgTargetX - bgX) * PARALLAX_DAMPING;
    bgY += (bgTargetY - bgY) * PARALLAX_DAMPING;

    const settled =
      Math.abs(fgX - fgTargetX) + Math.abs(fgY - fgTargetY) < 0.01 &&
      Math.abs(bgX - bgTargetX) + Math.abs(bgY - bgTargetY) < 0.01;

    if (settled) {
      fgX = fgTargetX;
      fgY = fgTargetY;
      bgX = bgTargetX;
      bgY = bgTargetY;
      running = false;
    }

    bg.style.transform = `translate(${bgX}px, ${bgY}px)`;
    fg.style.transform = `translate(${fgX}px, ${fgY}px)`;

    if (!settled) requestAnimationFrame(animate);
  }

  viewport.addEventListener('mousemove', (e) => {
    const rect = viewport.getBoundingClientRect();
    const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    targetX = Math.max(-1, Math.min(1, nx));
    targetY = Math.max(-1, Math.min(1, ny));
    start();
  });

  viewport.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    start();
  });
}

/* ── Init ──────────────────────────────────────────────────────────────── */

async function init() {
  await renderScenery();
  initParallax();

  let wasMobile = isMobile();
  window.addEventListener('resize', () => {
    const nowMobile = isMobile();
    if (nowMobile !== wasMobile) {
      wasMobile = nowMobile;
      renderScenery();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
