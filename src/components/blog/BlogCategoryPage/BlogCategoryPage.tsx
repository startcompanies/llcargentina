import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/config';
import { WhatsAppFloatButton } from '@/components/common/WhatsAppFloatButton/WhatsAppFloatButton';
import { SiteFooter } from '@/components/layout/SiteFooter/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader/SiteHeader';
import { BlogArticlesExplorer } from '@/components/blog/BlogArticlesExplorer/BlogArticlesExplorer';
import type { BlogCategoryPageData } from '@/lib/blog-content';
import styles from './BlogCategoryPage.module.css';

type BlogCategoryPageProps = {
  data: BlogCategoryPageData;
  locale: Locale;
};

export function BlogCategoryPage({ data, locale }: BlogCategoryPageProps) {
  const en = locale === 'en';

  const breadcrumbItems = [
    { label: en ? 'Home' : 'Inicio', href: getLocalizedPath('/', locale) },
    { label: 'Blog', href: '/blog' },
    { label: data.categoryName }
  ];

  return (
    <div className={styles.page}>
      <SiteHeader variant="light-page" />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className="container">
            <div className={styles.heroInner}>
              <div className={styles.heroBadge}>{en ? 'Category' : 'Categoría'}</div>
              <h1 className={styles.heroTitle}>{data.categoryName}</h1>
              {data.description && (
                <p className={styles.heroSubtitle}>{data.description}</p>
              )}
            </div>
          </div>
        </section>

        <BlogArticlesExplorer
          content={data.content}
          locale={locale}
          breadcrumbItems={breadcrumbItems}
        />
      </main>

      <SiteFooter />
      <WhatsAppFloatButton />
    </div>
  );
}
