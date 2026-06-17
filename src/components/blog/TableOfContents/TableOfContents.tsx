'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/config';
import type { TocHeading } from '@/lib/blog-headings';
import styles from './TableOfContents.module.css';

type TableOfContentsProps = {
  headings: TocHeading[];
  variant?: 'sidebar' | 'floating';
  locale?: Locale;
};

export function TableOfContents({ headings, variant = 'sidebar', locale = 'es' }: TableOfContentsProps) {
  const [expanded, setExpanded] = useState(variant === 'sidebar');
  const en = locale === 'en';

  if (headings.length === 0) return null;

  const isFloating = variant === 'floating';

  function handleHeadingClick(id: string) {
    const el = document.getElementById(id);
    if (el) {
      if (isFloating) setExpanded(false);
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  return (
    <div className={`${styles.wrapper} ${isFloating ? styles.floating : styles.inline}`}>
      {/* Backdrop for floating mode */}
      {isFloating && expanded && (
        <div
          className={styles.backdrop}
          onClick={() => setExpanded(false)}
          aria-hidden
        />
      )}

      <div className={isFloating ? `${styles.floatingInner} ${expanded ? styles.expandedToggle : ''}` : undefined}>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          <span>{en ? 'In this article' : 'En este artículo'}</span>
          <svg
            className={`${styles.chevron} ${expanded ? styles.chevronUp : ''}`}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {expanded && (
          <nav className={styles.list} aria-label={en ? 'Table of contents' : 'Tabla de contenidos'}>
            <ul>
              {headings.map((heading) => (
                <li
                  key={heading.id}
                >
                  <a
                    href={`#${heading.id}`}
                    className={styles.link}
                    onClick={(e) => {
                      e.preventDefault();
                      handleHeadingClick(heading.id);
                    }}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
