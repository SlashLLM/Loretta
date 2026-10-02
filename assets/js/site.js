/* Inner pages: mobile drawer, Lenis smooth scroll, contact form feedback.
   Loaded as a module; the homepage keeps its own inline copy because it also
   drives the hero scroll rig. */
import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.20/+esm';

const reduce = matchMedia('(prefers-reduced-motion: reduce)');

let lenis = null;
if (!reduce.matches) {
  lenis = new Lenis({
    duration: 1.1,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false
  });
  (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
}

/* ------------------------------------------------------------ Drawer */
const openBtn  = document.getElementById('mobileMenuOpen');
const closeBtn = document.getElementById('mobileMenuClose');
const overlay  = document.getElementById('mobileOverlay');

function openDrawer() {
  overlay.classList.add('is-active');
  document.body.style.overflow = 'hidden';
  openBtn.setAttribute('aria-expanded', 'true');
  if (lenis) lenis.stop();
  closeBtn.focus();
}
function closeDrawer() {
  overlay.classList.remove('is-active');
  document.body.style.overflow = '';
  openBtn.setAttribute('aria-expanded', 'false');
  if (lenis) lenis.start();
}
if (openBtn && closeBtn && overlay) {
  openBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-active')) closeDrawer();
  });
}

/* ----------------------------------------------------------- Anchors */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const el = document.querySelector(href);
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { duration: 1.2 });
    else el.scrollIntoView();
  });
});

/* ------------------------------------------------------ Contact form */
const form = document.getElementById('inquiryForm');
if (form) {
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', e => {
    e.preventDefault();
    // No backend yet: hand the inquiry to the visitor's mail client.
    const get = id => (document.getElementById(id)?.value || '').trim();
    const subject = `Inquiry: ${get('c-type')} — ${get('c-name')}`;
    const body = `${get('c-message')}\n\n— ${get('c-name')} (${get('c-email')})`;
    window.location.href =
      `mailto:loretta@smobler.io?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (status) status.classList.add('is-shown');
  });
}

/* ------------------------------------------------------ Video facades */
// YouTube refuses embeds that arrive without a referrer (Error 153), which is
// what a file:// page sends. Load the player in place only on a real origin;
// otherwise let the link open the video on YouTube.
if (location.protocol === 'http:' || location.protocol === 'https:') {
  document.querySelectorAll('.video-facade[data-yt]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${link.dataset.yt}?autoplay=1`;
      frame.title = link.dataset.title || 'YouTube video';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allowFullscreen = true;
      const box = document.createElement('div');
      box.className = 'video-frame';
      box.appendChild(frame);
      link.replaceWith(box);
      frame.focus();
    });
  });
}
