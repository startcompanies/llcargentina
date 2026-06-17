'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { splitTextDom } from '@/components/animations/SplitText/splitTextDom';

function animateCounter(element: HTMLElement) {
  const target = Number.parseFloat(element.dataset.target ?? '0');
  const suffix = element.dataset.suffix ?? '';
  const prefix = element.dataset.prefix ?? '';
  const duration = 1800;
  const isFloat = target % 1 !== 0;
  const decimals = isFloat ? 1 : 0;
  let start: number | null = null;

  function format(value: number) {
    return isFloat ? value.toFixed(decimals) : Math.floor(value).toLocaleString('en-US');
  }

  function step(timestamp: number) {
    if (start === null) {
      start = timestamp;
    }

    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    element.textContent = `${prefix}${format(current)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/** Hero selectors that start hidden (CSS opacity:0).
 *  heroTitle is intentionally excluded — it must be visible at first paint for LCP. */
const HERO_HIDDEN = [
  '[data-anim="heroTrust"]',
  '[data-anim="heroSub"]',
  '[data-anim="heroActions"]',
  '[data-anim="heroCounters"]',
  '[data-anim="heroCardWrap"]',
].join(', ');

export function HomeInteractiveShell() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    let heroTimeline: gsap.core.Timeline | undefined;
    let heroRotationTimer = 0;
    let isMounted = true;
    let heroSplits: Array<{ revert: () => void }> = [];
    let tabHidden = document.hidden;

    const onVisibilityChange = () => { tabHidden = document.hidden; };
    document.addEventListener('visibilitychange', onVisibilityChange);
    cleanups.push(() => document.removeEventListener('visibilitychange', onVisibilityChange));

    // ── Reduced-motion ──
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(HERO_HIDDEN, { opacity: 1, y: 0, clearProps: 'transform' });
      setupFaqClicks(cleanups);
      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        cleanups.forEach((fn) => fn());
      };
    }

    // ═══════════════════════════════════════════
    //  HERO ENTRANCE
    // ═══════════════════════════════════════════
    async function animateHero() {
      const heroTrust = document.querySelector<HTMLElement>('[data-anim="heroTrust"]');
      const heroTitle = document.querySelector<HTMLElement>('[data-anim="heroTitle"]');
      const heroSub = document.querySelector<HTMLElement>('[data-anim="heroSub"]');
      const heroActions = document.querySelector<HTMLElement>('[data-anim="heroActions"]');
      const heroCounters = document.querySelector<HTMLElement>('[data-anim="heroCounters"]');
      const heroCard = document.querySelector<HTMLElement>('[data-anim="heroCardWrap"]');

      if (!heroTitle) return;

      if ('fonts' in document) await document.fonts.ready;
      if (!isMounted) return;

      // ── 1. Split text (parents still opacity:0 from CSS — no flash) ──
      const trustSplit = heroTrust ? splitTextDom(heroTrust, 'words') : undefined;
      const titleSplit = splitTextDom(heroTitle, 'chars');
      const subSplit = heroSub ? splitTextDom(heroSub, 'words') : undefined;

      heroSplits = [titleSplit, ...(trustSplit ? [trustSplit] : []), ...(subSplit ? [subSplit] : [])];

      // ── 2. Find gradient span (for rotating text later) ──
      const gradSpan = heroTitle.querySelector<HTMLElement>('[data-anim="heroTitleGrad"]');

      // ── 3. Set initial hidden states ──
      if (heroTrust && trustSplit) {
        gsap.set(heroTrust, { opacity: 1 });
        gsap.set(trustSplit.targets, { opacity: 0, y: 12 });
      }

      gsap.set(heroTitle, { opacity: 1 });
      gsap.set(titleSplit.targets, { opacity: 0, y: 30, rotateX: -12, transformOrigin: '50% 100%' });

      if (heroSub && subSplit) {
        gsap.set(heroSub, { opacity: 1 });
        gsap.set(subSplit.targets, { opacity: 0, y: 14 });
      }

      if (heroActions) gsap.set(heroActions, { y: 20 });
      if (heroCounters) gsap.set(heroCounters, { y: 16 });
      if (heroCard) gsap.set(heroCard, { y: 30, scale: 0.97 });

      // ── 4. Animate everything with .to() ──
      heroTimeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

      if (trustSplit?.targets.length) {
        heroTimeline.to(trustSplit.targets, {
          opacity: 1, y: 0, stagger: 0.02, duration: 0.5
        }, 0);
      }

      // All title chars (gradient chars have per-char gradient via CSS)
      if (titleSplit.targets.length) {
        heroTimeline.to(titleSplit.targets, {
          opacity: 1, y: 0, rotateX: 0,
          stagger: 0.012, duration: 0.7
        }, 0.05);
      }

      if (subSplit?.targets.length) {
        heroTimeline.to(subSplit.targets, {
          opacity: 1, y: 0, stagger: 0.018, duration: 0.55
        }, 0.3);
      }

      if (heroActions) {
        heroTimeline.to(heroActions, {
          opacity: 1, y: 0, duration: 0.5
        }, 0.5);
      }

      if (heroCounters) {
        heroTimeline.to(heroCounters, {
          opacity: 1, y: 0, duration: 0.5
        }, 0.6);
      }

      if (heroCard) {
        heroTimeline.to(heroCard, {
          opacity: 1, y: 0, scale: 1, duration: 0.7
        }, 0.2);
      }

      // ── 5. Rotating gradient text (char-by-char) ──
      if (gradSpan) {
        const texts = (gradSpan.dataset.rotateTexts ?? '')
          .split('|').map((s) => s.trim()).filter(Boolean);

        if (texts.length > 1) {
          let idx = 0;

          const getChars = () =>
            Array.from(gradSpan.querySelectorAll<HTMLElement>('.split-char'));

          const scheduleNext = (wait: number) => {
            window.clearTimeout(heroRotationTimer);
            heroRotationTimer = window.setTimeout(() => {
              if (!isMounted) return;

              const oldChars = getChars();

              // Fade out current chars
              gsap.to(oldChars, {
                opacity: 0, y: -18,
                stagger: 0.012, duration: 0.28, ease: 'power2.in',
                onComplete: () => {
                  idx = (idx + 1) % texts.length;
                  gradSpan.textContent = texts[idx];
                  const newSplit = splitTextDom(gradSpan, 'chars');
                  gsap.fromTo(newSplit.targets,
                    { opacity: 0, y: 24, rotateX: -16, transformOrigin: '50% 100%' },
                    {
                      opacity: 1, y: 0, rotateX: 0,
                      stagger: 0.015, duration: 0.72, ease: 'power3.out',
                      onComplete: () => scheduleNext(2200)
                    }
                  );
                }
              });
            }, wait);
          };

          heroTimeline.eventCallback('onComplete', () => scheduleNext(1200));

          cleanups.push(() => {
            window.clearTimeout(heroRotationTimer);
            getChars().forEach((c) => gsap.killTweensOf(c));
            gsap.killTweensOf(gradSpan);
          });
        }
      }

      cleanups.push(() => { heroTimeline?.kill(); });
    }

    void animateHero();

    // ═══════════════════════════════════════════
    //  PARTICLE CANVAS
    // ═══════════════════════════════════════════
    const heroCanvas = document.getElementById('heroCanvas') as HTMLCanvasElement | null;

    if (heroCanvas) {
      const context = heroCanvas.getContext('2d');

      if (context) {
        const canvas = heroCanvas;
        const ctx = context;

        type Particle = { x: number; y: number; r: number; vx: number; vy: number; a: number };

        let w = 0;
        let h = 0;
        let particles: Particle[] = [];
        let raf = 0;
        let resizeTimer = 0;

        const count = () => Math.max(140, Math.min(260, Math.round((w * h) / 5200)));

        function resize() {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          w = canvas.offsetWidth;
          h = canvas.offsetHeight;
          canvas.width = w * dpr;
          canvas.height = h * dpr;
          canvas.style.width = `${w}px`;
          canvas.style.height = `${h}px`;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        const makeP = (): Particle => ({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * 1.3 + 0.35,
          vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12,
          a: Math.random() * 0.42 + 0.12
        });

        function init() { resize(); particles = Array.from({ length: count() }, makeP); }

        function draw() {
          if (!tabHidden) {
            ctx.clearRect(0, 0, w, h);
            for (const p of particles) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(0,106,254,${p.a})`;
              ctx.fill();
              p.x += p.vx; p.y += p.vy;
              if (p.x < -3) p.x = w + 3; if (p.x > w + 3) p.x = -3;
              if (p.y < -3) p.y = h + 3; if (p.y > h + 3) p.y = -3;
            }
          }
          raf = requestAnimationFrame(draw);
        }

        const onResize = () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(init, 120); };

        init(); draw();
        window.addEventListener('resize', onResize, { passive: true });

        cleanups.push(() => {
          cancelAnimationFrame(raf);
          clearTimeout(resizeTimer);
          window.removeEventListener('resize', onResize);
        });
      }
    }

    // ═══════════════════════════════════════════
    //  SCROLL REVEALS
    // ═══════════════════════════════════════════

    // Progress card logic (driven by proceso step scroll position)
    const procesoSteps = document.querySelectorAll<HTMLElement>('[data-step]');
    if (procesoSteps.length) {
      const vLine = document.getElementById('procesoVLine');
      const doneBadge = document.getElementById('pscDone');
      const fills = [1, 2, 3, 4, 5].map((i) => document.getElementById(`pFill${i}`));
      const pcts = [1, 2, 3, 4, 5].map((i) => document.getElementById(`pPct${i}`));
      let maxStep = 0;

      procesoSteps.forEach((step) => {
        const attr = step.getAttribute('data-step');
        if (!attr) return;

        ScrollTrigger.create({
          trigger: step, start: 'top 75%', once: true,
          onEnter: () => {
            const n = Number.parseInt(attr, 10);
            if (n <= maxStep) return;
            maxStep = n;

            for (let i = 0; i < n; i++) {
              const fill = fills[i];
              const tw = fill?.getAttribute('data-target');
              if (!fill || !tw) continue;
              fill.style.width = `${tw}%`;
              if (pcts[i]) pcts[i]!.textContent = `${tw}%`;
            }

            if (vLine) vLine.style.height = `${((n - 1) / 4) * 100}%`;
            if (n === 5 && doneBadge) doneBadge.classList.add('visible');
          },
        });
      });
    }

    // ═══════════════════════════════════════════
    //  COUNTERS (exclude progress-bar fills)
    // ═══════════════════════════════════════════
    document.querySelectorAll<HTMLElement>('[data-target]:not([id^="pFill"])').forEach((el) => {
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => animateCounter(el),
      });
    });

    // ═══════════════════════════════════════════
    //  CAROUSEL AUTO-ADVANCE
    // ═══════════════════════════════════════════
    const carousel = document.getElementById('elegirCarousel');
    if (carousel) {
      let tid = 0;
      let sid = 0;

      const cardW = () => {
        const c = carousel.querySelector<HTMLElement>('[data-anim="elegirReviewCard"]');
        return c ? c.offsetWidth + 20 : 340;
      };

      const advance = () => {
        const max = carousel.scrollWidth - carousel.clientWidth;
        if (carousel.scrollLeft >= max - 8) {
          carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carousel.scrollBy({ left: cardW(), behavior: 'smooth' });
        }
      };

      const go = () => { clearInterval(tid); tid = window.setInterval(advance, 4000); };
      const stop = () => { clearInterval(tid); };
      const resume = () => { sid = window.setTimeout(go, 3000); };

      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', go);
      carousel.addEventListener('touchstart', stop, { passive: true });
      carousel.addEventListener('touchend', resume, { passive: true });

      sid = window.setTimeout(go, 2000);

      cleanups.push(() => {
        stop(); clearTimeout(sid);
        carousel.removeEventListener('mouseenter', stop);
        carousel.removeEventListener('mouseleave', go);
        carousel.removeEventListener('touchstart', stop);
        carousel.removeEventListener('touchend', resume);
      });
    }

    // ═══════════════════════════════════════════
    //  FAQ CLICK HANDLERS
    // ═══════════════════════════════════════════
    setupFaqClicks(cleanups);

    // Force recalculation so any already-visible triggers fire
    // (HomeInteractiveShell lazy-loads, so elements may already be in viewport)
    ScrollTrigger.refresh();

    // Fix: when the browser restores scroll position (reopen from history),
    // elements already past their trigger point never fire onEnter.
    // Browser may not have restored scroll when useEffect runs, so check after delay.
    const revealRestoredHome = () => {
      if (!isMounted || window.scrollY === 0) return;

      // Proceso steps: reveal all steps already past 75% viewport
      const stepsThreshold = window.innerHeight * 0.75;
      let restoredMax = 0;
      document.querySelectorAll<HTMLElement>('[data-step]').forEach((step) => {
        if (step.getBoundingClientRect().top < stepsThreshold) {
          const n = Number.parseInt(step.getAttribute('data-step') ?? '0', 10);
          if (n > restoredMax) restoredMax = n;
        }
      });
      if (restoredMax > 0) {
        for (let i = 1; i <= restoredMax; i++) {
          const fill = document.getElementById(`pFill${i}`);
          const pct = document.getElementById(`pPct${i}`);
          const tw = fill?.getAttribute('data-target');
          if (fill && tw) fill.style.width = `${tw}%`;
          if (pct && tw) pct.textContent = `${tw}%`;
        }
        const vl = document.getElementById('procesoVLine');
        if (vl) vl.style.height = `${((restoredMax - 1) / 4) * 100}%`;
        if (restoredMax === 5) {
          document.getElementById('pscDone')?.classList.add('visible');
        }
      }

      // Counters: fire any already past 85% viewport
      const counterThreshold = window.innerHeight * 0.85;
      document.querySelectorAll<HTMLElement>('[data-target]:not([id^="pFill"])').forEach((el) => {
        if (el.getBoundingClientRect().top < counterThreshold) {
          animateCounter(el);
        }
      });
    };

    requestAnimationFrame(revealRestoredHome);
    const homeRestoreTimer = setTimeout(revealRestoredHome, 150);
    window.addEventListener('scroll', revealRestoredHome, { once: true, passive: true });

    cleanups.push(() => {
      clearTimeout(homeRestoreTimer);
      window.removeEventListener('scroll', revealRestoredHome);
    });

    // ── Cleanup ──
    return () => {
      isMounted = false;
      ScrollTrigger.getAll().forEach((t) => t.kill());
      heroTimeline?.kill();
      heroSplits.forEach((s) => s.revert());
      heroSplits = [];
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}

function setupFaqClicks(cleanups: Array<() => void>) {
  document.querySelectorAll<HTMLElement>('[data-anim="faqQ"]').forEach((q) => {
    const item = q.parentElement;
    const a = item?.querySelector<HTMLElement>('[data-anim="faqA"]');
    if (!item || !a) return;

    const onClick = () => {
      const open = item.classList.toggle('open');
      a.style.maxHeight = open ? `${a.scrollHeight}px` : '0';
      q.setAttribute('aria-expanded', String(open));
    };

    q.addEventListener('click', onClick);
    cleanups.push(() => q.removeEventListener('click', onClick));
  });
}
