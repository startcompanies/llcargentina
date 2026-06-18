'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/config';
import { getConsultationHref } from '@/lib/marketing-links';
import type { BlogIndexContent } from '@/lib/blog-content';
import { BlogCompactCard } from '@/components/blog/BlogCompactCard/BlogCompactCard';
import { BlogFeaturedCard } from '@/components/blog/BlogFeaturedCard/BlogFeaturedCard';
import { BlogSidebar } from '@/components/blog/BlogSidebar/BlogSidebar';
import { Breadcrumbs } from '@/components/common/Breadcrumbs/Breadcrumbs';
import styles from './BlogArticlesExplorer.module.css';

type BreadcrumbItem = { label: string; href?: string };

type BlogArticlesExplorerProps = {
  content: BlogIndexContent;
  locale: Locale;
  initialPage?: number;
  breadcrumbItems?: BreadcrumbItem[];
};

const MORE_ARTICLES_PER_PAGE = 8;

function matchesQuery(query: string, ...values: string[]) {
  if (!query) {
    return true;
  }

  const haystack = values.join(' ').toLowerCase();
  return haystack.includes(query);
}

export function BlogArticlesExplorer({ content, locale, initialPage = 1, breadcrumbItems }: BlogArticlesExplorerProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(initialPage);
  const en = locale === 'en';
  const consultationHref = getConsultationHref(locale);

  const normalizedQuery = search.trim().toLowerCase();

  const featuredArticles = useMemo(
    () =>
      content.featuredArticles.filter((article) =>
        matchesQuery(normalizedQuery, article.title, article.excerpt, article.category, article.metaLabel)
      ),
    [content.featuredArticles, normalizedQuery]
  );

  const moreArticles = useMemo(
    () =>
      content.moreArticles.filter((article) =>
        matchesQuery(normalizedQuery, article.title, article.category, article.meta)
      ),
    [content.moreArticles, normalizedQuery]
  );

  const totalPages = normalizedQuery ? 1 : Math.max(1, Math.ceil(moreArticles.length / MORE_ARTICLES_PER_PAGE));
  const currentPage = normalizedQuery ? 1 : Math.min(page, totalPages);

  const visibleMoreArticles = useMemo(() => {
    if (normalizedQuery) {
      return moreArticles;
    }

    const start = (currentPage - 1) * MORE_ARTICLES_PER_PAGE;
    return moreArticles.slice(start, start + MORE_ARTICLES_PER_PAGE);
  }, [currentPage, moreArticles, normalizedQuery]);

  const hasResults = featuredArticles.length > 0 || moreArticles.length > 0;

  const blogBasePath = '/blog';

  return (
    <>
      <section className={styles.searchSection}>
        <div className="container">
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className={styles.searchInput}
              placeholder={en ? 'Search guides...' : 'Buscá una guía...'}
              autoComplete="off"
              aria-label={en ? 'Search articles' : 'Buscar artículos'}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search ? (
              <button type="button" className={styles.clearButton} onClick={() => setSearch('')} aria-label={en ? 'Clear search' : 'Limpiar búsqueda'}>
                ×
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {breadcrumbItems && <Breadcrumbs items={breadcrumbItems} />}

      <section className={styles.articlesSection} id="guias">
        <div className="container">
          <div className={styles.inner}>
            <div className={styles.main}>
              {featuredArticles.length > 0 ? (
                <>
                  <div className={styles.sectionLabel}>{en ? 'Featured guides' : 'Guías destacadas'}</div>
                  <div className={styles.featuredGrid}>
                    {featuredArticles.map((article) => (
                      <BlogFeaturedCard key={article.title} article={article} locale={locale} />
                    ))}
                  </div>
                </>
              ) : null}

              <div className={styles.midCta}>
                <div>
                  <div className={styles.midCtaTitle}>
                    {en ? 'Need help opening and operating your LLC?' : '¿Necesitás ayuda para abrir y operar tu LLC?'}
                  </div>
                  <p className={styles.midCtaText}>
                    {en
                      ? 'Talk to our team and clarify state, banking, taxes, and next steps before you move forward.'
                      : 'Hablá con nuestro equipo y aclará estado, banco, impuestos y próximos pasos antes de avanzar.'}
                  </p>
                </div>
                <Link href={consultationHref} className="btn btn-llamada">
                  {en ? 'Book a call' : 'Reservar llamada'}
                </Link>
              </div>

              {hasResults ? (
                <>
                  <div className={styles.moreLabel}>{normalizedQuery ? (en ? 'Results' : 'Resultados') : (en ? 'More guides' : 'Más guías')}</div>
                  <div className={styles.moreGrid}>
                    {visibleMoreArticles.map((article) => (
                      <BlogCompactCard key={article.title} article={article} locale={locale} />
                    ))}
                  </div>

                  {!normalizedQuery && totalPages > 1 ? (
                    <div className={styles.pagination}>
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <Link
                          key={pageNumber}
                          href={pageNumber === 1 ? blogBasePath : `${blogBasePath}?page=${pageNumber}`}
                          className={pageNumber === currentPage ? `${styles.pageButton} ${styles.pageButtonActive}` : styles.pageButton}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(pageNumber);
                            window.history.pushState(
                              null,
                              '',
                              pageNumber === 1 ? blogBasePath : `${blogBasePath}?page=${pageNumber}`
                            );
                          }}
                        >
                          {pageNumber}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <div className={styles.noResults}>
                  {en ? (
                    <>No guides found for your search. <Link href={consultationHref}>Book a call</Link>.</>
                  ) : (
                    <>No encontramos guías para tu búsqueda. <Link href={consultationHref}>Reservemos una llamada</Link>.</>
                  )}
                </div>
              )}
            </div>

            <BlogSidebar categories={content.sidebarCategories} locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
