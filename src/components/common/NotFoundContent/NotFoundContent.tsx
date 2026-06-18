'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { Locale } from '@/i18n/config';
import styles from './NotFoundContent.module.css';

type Props = { locale: Locale };

const t = {
  badge:   { es: 'Página no encontrada', en: 'Page not found' },
  title1:  { es: 'Esta página ya no',  en: "This page is no" },
  title2:  { es: 'está disponible.',   en: 'longer available.' },
  sub:     {
    es: 'El enlace que buscás no existe o fue movido. Podés volver al inicio o seguir leyendo guías para operar con tu empresa en EE.UU.',
    en: "The link you're looking for doesn't exist or was moved. You can go back home or keep reading guides about operating with a U.S. company.",
  },
  cta1:    { es: 'Volver al inicio', en: 'Back to home' },
  cta2:    { es: 'Ver blog',          en: 'View blog' },
  nav:     { es: 'Páginas principales', en: 'Main pages' },
};

export function NotFoundContent({ locale }: Props) {
  const en = locale === 'en';
  const glitchRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = glitchRef.current;
    if (!el) return;
    let raf: number;
    let frame = 0;
    const tick = () => {
      frame++;
      if (frame % 4 === 0) {
        const x = (Math.random() * 8 - 4).toFixed(1);
        el.style.setProperty('--gx', `${x}px`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const links = en
    ? [
        { href: '/en',           label: 'Home' },
        { href: '/blog',         label: 'Blog' },
      ]
    : [
        { href: '/',             label: 'Inicio' },
        { href: '/blog',         label: 'Blog' },
      ];

  const blogHref = '/blog';

  return (
    <div className={styles.page}>
      <div className={styles.glow1} aria-hidden="true" />
      <div className={styles.glow2} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />

      <main className={styles.main}>
        <div className={styles.codeWrap} aria-hidden="true">
          <span className={styles.codeText} ref={glitchRef} data-text="404">404</span>
        </div>

        <div className={styles.content}>
          <div className={styles.badge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {t.badge[locale]}
          </div>

          <h1 className={styles.title}>
            {t.title1[locale]}<br />
            <span className={styles.titleGrad}>{t.title2[locale]}</span>
          </h1>

          <p className={styles.sub}>{t.sub[locale]}</p>

          <div className={styles.actions}>
            <Link href={en ? '/en' : '/'} className="btn btn-llamada">
              {t.cta1[locale]}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href={blogHref} className="btn btn-comenzar">{t.cta2[locale]}</Link>
          </div>
        </div>

        <nav className={styles.links} aria-label={t.nav[locale]}>
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={styles.link}>
              {label}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
