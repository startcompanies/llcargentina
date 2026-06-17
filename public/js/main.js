/* ============================================================
   START COMPANIES — main.js
   ============================================================ */

/* ── NAVBAR: scroll + hamburger ── */
(function () {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');
  if (!navbar) return;

  // Detect if this page uses a dark hero (transparent navbar) or light bg
  const isLightPage = document.body.classList.contains('light-page');
  if (isLightPage) navbar.classList.add('light-page');

  // Scroll handler
  function onScroll() {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle('scrolled', scrolled);
    if (!isLightPage) {
      navbar.classList.toggle('transparent', !scrolled);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on mobile link click
    mobileMenu.querySelectorAll('.nav-mobile-link, .btn').forEach(el => {
      el.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }
})();

/* ── SCROLL REVEAL ── */
(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

/* ── SMOOTH SCROLL for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const isFloat = target % 1 !== 0;
  const decimals = isFloat ? 1 : 0;
  let start = null;

  function fmt(n) {
    return isFloat
      ? n.toFixed(decimals)
      : Math.floor(n).toLocaleString('en-US');
  }

  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = prefix + fmt(current) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Trigger counters when in view
(function () {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── ACTIVE NAV LINK (highlight current page) ── */
(function () {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.split('#')[0] === currentPath) {
      link.classList.add('active');
    }
  });
})();

/* ── HERO PARTICLES (canvas) ── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], raf;
  const COUNT = 55;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      a: Math.random() * 0.45 + 0.08,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(1,201,226,${p.a})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
    raf = requestAnimationFrame(draw);
  }

  init();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); }, 150);
  }, { passive: true });
})();

/* ── HERO TYPEWRITER ── */
(function () {
  const el = document.getElementById('heroTypewriter');
  if (!el) return;
  const text = 'sin residencia ni viajes.';
  let i = 0;

  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, i < text.length ? 52 : 0);
    }
  }

  // Start after brief delay so page renders first
  setTimeout(type, 700);
})();

/* ── LLC CARDS — scroll reveal (IntersectionObserver) ── */
(function () {
  const cards = document.querySelectorAll('.llc-card');
  if (!cards.length) return;

  // Single observer — CSS nth-child delays handle stagger
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  cards.forEach(card => observer.observe(card));
})();

/* ── LLC CARDS — 3D cursor tilt ── */
(function () {
  const cards = document.querySelectorAll('.llc-card');
  if (!cards.length) return;

  const MAX_TILT = 8;        // degrees
  const PERSPECTIVE = 1000;  // px

  cards.forEach(card => {
    let raf;

    card.addEventListener('mousemove', function (e) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2); // -1 to 1
        const dy = (e.clientY - cy) / (rect.height / 2); // -1 to 1
        const rotX = -dy * MAX_TILT;  // tilt up/down
        const rotY = dx * MAX_TILT;  // tilt left/right

        card.style.transition = 'box-shadow 0.28s ease, border-color 0.28s ease, opacity 0.6s cubic-bezier(0.4,0,0.2,1)';
        card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
      });
    });

    card.addEventListener('mouseleave', function () {
      cancelAnimationFrame(raf);
      card.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.28s ease, border-color 0.28s ease, opacity 0.6s cubic-bezier(0.4,0,0.2,1)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
})();

/* ── CUSTOM CURSOR + TRAIL (div#cursor-dot + 8 trail divs) ── */
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  // ── Create #cursor-dot ──
  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  dot.style.cssText = 'left:0;top:0;';
  document.body.appendChild(dot);

  // ── Create 8 trail divs ──
  const TRAIL_N = 8;
  const trail = [];
  for (let i = 0; i < TRAIL_N; i++) {
    const t = i / (TRAIL_N - 1);                    // 0 → 1
    const sz = Math.round(9 - t * 7);                // 9px → 2px
    const op = +(0.5 - t * 0.44).toFixed(2);         // 0.50 → 0.06
    const el = document.createElement('div');
    el.className = 'cursor-trail';
    el.style.cssText = `width:${sz}px;height:${sz}px;opacity:${op};left:0;top:0;`;
    document.body.appendChild(el);
    trail.push({ el, x: -100, y: -100 });
  }

  let mx = -100, my = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  // Hover detection
  const SEL = 'a,button,[role="button"],input,label,select,textarea,.btn,.llc-card,.partner-logo,.nav-link,.hero-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(SEL)) document.body.classList.add('cursor-hover');
  }, { passive: true });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(SEL)) document.body.classList.remove('cursor-hover');
  }, { passive: true });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });

  // Lerp helper
  const lerp = (a, b, f) => a + (b - a) * f;

  // RAF loop
  (function loop() {
    // Main dot — snaps instantly via CSS, just update position
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';

    // Trail — each dot lerps toward previous point's position
    let px = mx, py = my;
    trail.forEach((t, i) => {
      const f = 0.20 - i * 0.018;          // decreasing lerp factor = more lag
      t.x = lerp(t.x, px, Math.max(f, 0.04));
      t.y = lerp(t.y, py, Math.max(f, 0.04));
      t.el.style.left = t.x + 'px';
      t.el.style.top = t.y + 'px';
      px = t.x;
      py = t.y;
    });

    requestAnimationFrame(loop);
  })();
})();

/* ── PROCESO — vertical line + status card ── */
(function () {
  const steps = document.querySelectorAll('.proceso-step[data-step]');
  if (!steps.length) return;

  const vline = document.getElementById('procesoVLine');
  const doneBadge = document.getElementById('pscDone');
  const fills = [1, 2, 3, 4, 5].map(i => document.getElementById('pFill' + i));
  const pcts = [1, 2, 3, 4, 5].map(i => document.getElementById('pPct' + i));

  let maxStep = 0;

  function updateProgress(stepN) {
    if (stepN <= maxStep) return;
    maxStep = stepN;

    // Fill bars 1 … stepN
    for (let i = 0; i < stepN; i++) {
      if (fills[i]) {
        const w = fills[i].dataset.target;
        fills[i].style.width = w + '%';
        if (pcts[i]) pcts[i].textContent = w + '%';
      }
    }

    // Vertical line: grows step-by-step (0 → 25 → 50 → 75 → 100%)
    if (vline) {
      vline.style.height = ((stepN - 1) / 4 * 100) + '%';
    }

    // Show 100% badge when all steps visible
    if (stepN === 5 && doneBadge) {
      doneBadge.classList.add('visible');
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const n = parseInt(entry.target.dataset.step, 10);
        updateProgress(n);
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -20px 0px' });

  steps.forEach(step => observer.observe(step));
})();

/* ── REVIEWS CAROUSEL AUTOPLAY ── */
(function () {
  const carousel = document.getElementById('elegirCarousel');
  if (!carousel) return;

  let timer;
  let cardW = 0;

  function getCardWidth() {
    const card = carousel.querySelector('.elegir-review-card');
    if (!card) return 340;
    return card.offsetWidth + 20; // width + gap
  }

  function advance() {
    cardW = getCardWidth();
    const max = carousel.scrollWidth - carousel.clientWidth;
    if (carousel.scrollLeft >= max - 8) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: cardW, behavior: 'smooth' });
    }
  }

  function start() { timer = setInterval(advance, 4000); }
  function stop() { clearInterval(timer); }

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('touchstart', stop, { passive: true });
  carousel.addEventListener('touchend', () => setTimeout(start, 3000), { passive: true });

  setTimeout(start, 2000);
})();

/* ── FAQ ACCORDION + stagger reveal ── */
(function () {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  // Accordion toggle
  items.forEach(function (item) {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;

    q.addEventListener('click', function () {
      const isOpen = item.classList.toggle('open');
      a.style.maxHeight = isOpen ? a.scrollHeight + 'px' : '0';
      q.setAttribute('aria-expanded', String(isOpen));
    });
  });

  // Stagger fall-in animation — each item observed individually
  const revealItems = document.querySelectorAll('.faq-reveal');
  if (!revealItems.length) return;

  const faqObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        faqObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -30px 0px' });

  revealItems.forEach(function (el) { faqObserver.observe(el); });
})();

/* ── CTA FINAL CANVAS ── */
(function () {
  const canvas = document.getElementById('ctaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 40;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.3,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      a: Math.random() * 0.4 + 0.06,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(1,201,226,' + p.a + ')';
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    });
    requestAnimationFrame(draw);
  }

  init();
  draw();

  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(resize, 150);
  }, { passive: true });
})();

/* ── BLOG CARDS — scroll reveal ── */
(function () {
  const cards = document.querySelectorAll('.blog-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  cards.forEach(function (el) { observer.observe(el); });
})();

/* ── HERO PARALLAX ── */
(function () {
  const glow1 = document.querySelector('.hero-glow-1');
  if (!glow1) return;

  window.addEventListener('scroll', function () {
    const s = window.scrollY;
    if (s < window.innerHeight * 1.2) {
      glow1.style.transform = `translateY(${s * 0.06}px)`;
    }
  }, { passive: true });
})();
