'use client';

import { useEffect } from 'react';
import { gsap } from '@/lib/gsap-config';
import { splitTextDom } from '@/components/animations/SplitText/splitTextDom';

const HERO_HIDDEN = [
  '[data-anim="heroBadge"]',
  '[data-anim="heroTitle"]',
  '[data-anim="heroSubtitle"]',
  '[data-anim="heroActions"]',
].join(', ');

export function PageHeroEntrance() {
  useEffect(() => {
    let isMounted = true;
    let timeline: gsap.core.Timeline | undefined;
    let splits: Array<{ revert: () => void }> = [];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(HERO_HIDDEN, { opacity: 1, y: 0, clearProps: 'transform' });
      return;
    }

    async function animate() {
      const badge = document.querySelector<HTMLElement>('[data-anim="heroBadge"]');
      const title = document.querySelector<HTMLElement>('[data-anim="heroTitle"]');
      const subtitle = document.querySelector<HTMLElement>('[data-anim="heroSubtitle"]');
      const actions = document.querySelector<HTMLElement>('[data-anim="heroActions"]');

      if (!title) return;

      if ('fonts' in document) await document.fonts.ready;
      if (!isMounted) return;

      const titleSplit = splitTextDom(title, 'chars');
      const subtitleSplit = subtitle ? splitTextDom(subtitle, 'words') : undefined;

      splits = [titleSplit, ...(subtitleSplit ? [subtitleSplit] : [])];

      // Set parents visible, targets hidden
      if (badge) {
        gsap.set(badge, { opacity: 1 });
        gsap.set(badge, { y: 14 });
      }

      gsap.set(title, { opacity: 1 });
      gsap.set(titleSplit.targets, { opacity: 0, y: 30, rotateX: -12, transformOrigin: '50% 100%' });

      if (subtitle && subtitleSplit) {
        gsap.set(subtitle, { opacity: 1 });
        gsap.set(subtitleSplit.targets, { opacity: 0, y: 14 });
      }

      if (actions) gsap.set(actions, { y: 20 });

      timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

      if (badge) {
        timeline.to(badge, { opacity: 1, y: 0, duration: 0.5 }, 0);
      }

      if (titleSplit.targets.length) {
        timeline.to(titleSplit.targets, {
          opacity: 1, y: 0, rotateX: 0,
          stagger: 0.012, duration: 0.7,
        }, 0.05);
      }

      if (subtitleSplit?.targets.length) {
        timeline.to(subtitleSplit.targets, {
          opacity: 1, y: 0, stagger: 0.018, duration: 0.55,
        }, 0.3);
      }

      if (actions) {
        timeline.to(actions, { opacity: 1, y: 0, duration: 0.5 }, 0.5);
      }
    }

    void animate();

    return () => {
      isMounted = false;
      timeline?.kill();
      splits.forEach((s) => s.revert());
      splits = [];
    };
  }, []);

  return null;
}
