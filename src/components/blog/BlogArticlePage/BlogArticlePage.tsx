import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/config';
import { Breadcrumbs } from '@/components/common/Breadcrumbs/Breadcrumbs';
import { WhatsAppFloatButton } from '@/components/common/WhatsAppFloatButton/WhatsAppFloatButton';
import { SiteFooter } from '@/components/layout/SiteFooter/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader/SiteHeader';
import { BlogArticleContent } from '@/components/blog/BlogArticleContent/BlogArticleContent';
import { BlogArticleHero } from '@/components/blog/BlogArticleHero/BlogArticleHero';
import { BlogArticleSidebar } from '@/components/blog/BlogArticleSidebar/BlogArticleSidebar';
import { TableOfContents } from '@/components/blog/TableOfContents/TableOfContents';
import type { BlogArticle } from '@/lib/blog-content';
import type { RelatedArticle } from '@/lib/blog-content';
import { extractHeadings } from '@/lib/blog-headings';
import styles from './BlogArticlePage.module.css';

type BlogArticlePageProps = {
  article: BlogArticle;
  locale: Locale;
  isAutoTranslated?: boolean;
  relatedArticles?: RelatedArticle[];
};

export function BlogArticlePage({ article, locale, isAutoTranslated, relatedArticles }: BlogArticlePageProps) {
  const { headings, html: bodyHtmlWithIds } = extractHeadings(article.bodyHtml);
  const en = locale === 'en';

  const breadcrumbItems = [
    { label: en ? 'Home' : 'Inicio', href: getLocalizedPath('/', locale) },
    { label: 'Blog', href: '/blog' },
    { label: article.title }
  ];

  const categoryHref = article.categorySlug
    ? `/blog#category-${article.categorySlug}`
    : undefined;

  return (
    <div className={styles.page}>
      {article.jsonLd.map((jsonLd, index) => (
        <script key={`${article.slug}-jsonld-${index + 1}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      ))}

      <SiteHeader variant="light-page" />

      <main>
        <BlogArticleHero
          badge={article.badge}
          titleHtml={article.heroTitleHtml}
          subtitle={article.heroSubtitle}
          metaItems={article.metaItems}
          image={article.ogImage}
          categoryHref={categoryHref}
        />

        <Breadcrumbs items={breadcrumbItems} />

        {isAutoTranslated && (
          <div className={styles.translationBanner}>
            <div className={styles.translationBannerInner}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>
                {en
                  ? 'This article was automatically translated from Spanish. The original version is available '
                  : 'Este artículo fue traducido automáticamente del español. La versión original está disponible '}
                <a href={`/blog/${article.slug}`}>
                  {en ? 'here' : 'aquí'}
                </a>.
              </span>
            </div>
          </div>
        )}

        <section className={styles.contentSection}>
          <div className={styles.contentLayout}>
            <BlogArticleContent bodyHtml={bodyHtmlWithIds} locale={locale} relatedArticles={relatedArticles} />
            <BlogArticleSidebar headings={headings} title={article.title} slug={article.slug} locale={locale} />
          </div>
        </section>
      </main>

      <SiteFooter />
      <TableOfContents headings={headings} variant="floating" locale={locale} />
      <WhatsAppFloatButton />
    </div>
  );
}
