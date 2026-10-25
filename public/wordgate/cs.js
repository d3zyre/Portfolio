// Shared case-study behaviour: nav border on scroll, active section in the TOC, play videos only when visible.
const nav = document.querySelector('.nav');
addEventListener('scroll', () => nav && nav.classList.toggle('scrolled', scrollY > 8), { passive: true });

const links = [...document.querySelectorAll('.toc a[href^="#"]')];
const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if (secs.length) {
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  secs.forEach(s => io.observe(s));
}

const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('video[data-auto]').forEach(v => {
  if (still) return;
  new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.3 }).observe(v);
});
