'use client';

import { useEffect, useRef } from 'react';
import styles from './CursorDot.module.css';

/** Dot renders at this CSS size — hover shows it at 1:1, no pixelation */
const DOT_CSS_SIZE = 54;
/** Normal scale (visual ~8px) */
const SMALL_SCALE = 0.3;
/** Hover scale — 1.0 = native resolution, never scales UP */
const HOVER_SCALE = 1;
/** Number of trail dots */
const TRAIL_COUNT = 20;
/** Each trail dot follows the previous with this lerp factor */
const TRAIL_LERP = 0.28;

const HOVER_SELECTORS = 'a, button, [role="button"], input[type="submit"], .btn';

export function CursorDot() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    // ── Build DOM: main dot + trail dots ──
    const dot = document.createElement('div');
    dot.className = styles.dot;
    wrap.appendChild(dot);

    const trailEls: HTMLDivElement[] = [];
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const el = document.createElement('div');
      el.className = styles.trailDot;
      const t = 1 - i / TRAIL_COUNT;
      const size = Math.max(2, 8 * t);
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.opacity = `${0.4 * t * t}`;
      wrap.appendChild(el);
      trailEls.push(el);
    }

    // ── State ──
    let mouseX = -200;
    let mouseY = -200;
    let dotX = -200;
    let dotY = -200;
    let velX = 0;
    let velY = 0;
    let scale = SMALL_SCALE;
    let targetScale = SMALL_SCALE;
    let scaleVel = 0;
    let raf = 0;
    let visible = false;
    let hoveredEl: Element | null = null;

    // Each trail dot has its own position
    const trailPos = trailEls.map(() => ({ x: -200, y: -200 }));

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        wrap!.style.opacity = '1';
        dotX = mouseX;
        dotY = mouseY;
        for (const p of trailPos) { p.x = mouseX; p.y = mouseY; }
      }
    }

    function onMouseOver(e: MouseEvent) {
      const interactive = (e.target as HTMLElement).closest(HOVER_SELECTORS);
      if (interactive && interactive !== hoveredEl) {
        hoveredEl = interactive;
        targetScale = HOVER_SCALE;
      }
    }

    function onMouseOut(e: MouseEvent) {
      if (!hoveredEl) return;
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || !hoveredEl.contains(related)) {
        hoveredEl = null;
        targetScale = SMALL_SCALE;
      }
    }

    function onMouseLeave() {
      visible = false;
      hoveredEl = null;
      targetScale = SMALL_SCALE;
      wrap!.style.opacity = '0';
    }

    function tick() {
      // ── Main dot position (spring) ──
      const dx = mouseX - dotX;
      const dy = mouseY - dotY;
      velX = velX * 0.68 + dx * 0.14;
      velY = velY * 0.68 + dy * 0.14;
      dotX += velX;
      dotY += velY;

      // ── Scale spring (slow, bouncy) ──
      const sDiff = targetScale - scale;
      scaleVel = scaleVel * 0.9 + sDiff * 0.018;
      scale += scaleVel;

      const half = DOT_CSS_SIZE / 2;
      dot.style.transform = `translate3d(${dotX - half}px, ${dotY - half}px, 0) scale(${scale})`;

      // ── Trail: each dot follows the previous one ──
      let prevX = dotX;
      let prevY = dotY;
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const p = trailPos[i];
        p.x += (prevX - p.x) * TRAIL_LERP;
        p.y += (prevY - p.y) * TRAIL_LERP;
        const s = parseFloat(trailEls[i].style.width) / 2;
        trailEls[i].style.transform = `translate3d(${p.x - s}px, ${p.y - s}px, 0)`;
        prevX = p.x;
        prevY = p.y;
      }

      raf = requestAnimationFrame(tick);
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      wrap.innerHTML = '';
    };
  }, []);

  return <div ref={wrapRef} className={styles.wrap} />;
}
