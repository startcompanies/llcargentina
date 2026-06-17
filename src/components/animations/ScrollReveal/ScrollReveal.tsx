'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode, type ElementType, type CSSProperties } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { presets, type ScrollRevealEffect } from './presets';

type ScrollRevealProps = {
  children: ReactNode;
  /** Animation effect preset. Default: 'fade-up' */
  effect?: ScrollRevealEffect;
  /** Animation duration in seconds. Default: 0.7 */
  duration?: number;
  /** Delay before animation starts (seconds). Default: 0 */
  delay?: number;
  /** GSAP easing function. Default: 'power2.out' */
  ease?: string;
  /** ScrollTrigger start position. Default: 'top 88%' */
  start?: string;
  /**
   * Stagger delay between direct children (seconds).
   * Each child gets its own ScrollTrigger with incremental delay.
   * Default: 0 (no stagger — animate the wrapper as a unit).
   */
  stagger?: number;
  /** HTML tag for the wrapper element. Default: 'div' */
  as?: ElementType;
  /** Additional className for the wrapper */
  className?: string;
  /** Additional id for the wrapper */
  id?: string;
  /** Inline style for the wrapper */
  style?: CSSProperties;
  /** Only trigger once. Default: true */
  once?: boolean;
  /** ARIA role for the wrapper element */
  role?: string;
};

export function ScrollReveal({
  children,
  effect = 'fade-up',
  duration = 0.7,
  delay = 0,
  ease = 'power2.out',
  start = 'top 82%',
  stagger = 0,
  as: Tag = 'div',
  className,
  id,
  style,
  once = true,
  role,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const preset = presets[effect];

  // Set initial hidden state before first browser paint (avoids flash).
  // The wrapper renders with inline opacity:0 (SSR-safe), and useLayoutEffect
  // runs before paint to set the correct GSAP states.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (stagger > 0) {
      // Wrapper visible, children hidden individually
      gsap.set(el, { opacity: 1 });
      const targets = Array.from(el.children) as HTMLElement[];
      targets.forEach((t) => gsap.set(t, preset.from));
    } else {
      // Wrapper itself is the animation target
      gsap.set(el, preset.from);
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion — show immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1, clearProps: 'transform' });
      if (stagger > 0) {
        const targets = Array.from(el.children) as HTMLElement[];
        targets.forEach((t) => gsap.set(t, { opacity: 1, clearProps: 'transform' }));
      }
      return;
    }

    const triggers: ScrollTrigger[] = [];

    if (stagger > 0) {
      const targets = Array.from(el.children) as HTMLElement[];
      targets.forEach((child, i) => {
        const st = ScrollTrigger.create({
          trigger: child,
          start,
          once,
          onEnter: () => {
            gsap.to(child, {
              ...preset.to,
              duration,
              delay: delay + i * stagger,
              ease,
            });
          },
        });
        triggers.push(st);
      });
    } else {
      const st = ScrollTrigger.create({
        trigger: el,
        start,
        once,
        onEnter: () => {
          gsap.to(el, { ...preset.to, duration, delay, ease });
        },
      });
      triggers.push(st);
    }

    // Fix: when the browser restores scroll position (reopen from history),
    // elements already past their trigger point never fire onEnter.
    // The browser may not have restored scroll yet when useEffect runs,
    // so we check after a delay and also on first scroll event.
    const revealIfPast = () => {
      if (!el || window.scrollY === 0) return;
      const pctMatch = start.match(/(\d+)%/);
      const pct = pctMatch ? parseFloat(pctMatch[1]) / 100 : 0.82;
      const threshold = window.innerHeight * pct;

      if (stagger > 0) {
        const targets = Array.from(el.children) as HTMLElement[];
        const tops = targets.map((child) => child.getBoundingClientRect().top);
        targets.forEach((child, i) => {
          if (tops[i] < threshold) {
            gsap.set(child, preset.to);
            if (triggers[i]) triggers[i].kill();
          }
        });
      } else {
        if (el.getBoundingClientRect().top < threshold) {
          gsap.set(el, preset.to);
          triggers.forEach((t) => t.kill());
        }
      }
    };

    // Multiple attempts: rAF (immediate), 150ms, and scroll event
    requestAnimationFrame(revealIfPast);
    const restoreTimer = setTimeout(revealIfPast, 150);
    window.addEventListener('scroll', revealIfPast, { once: true, passive: true });

    return () => {
      clearTimeout(restoreTimer);
      window.removeEventListener('scroll', revealIfPast);
      triggers.forEach((t) => t.kill());
    };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Tag ref={ref} className={className} id={id} role={role} style={{ ...style, opacity: 0 }}>
      {children}
    </Tag>
  );
}
