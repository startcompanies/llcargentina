import Image from 'next/image';
import Link from 'next/link';
import { type Locale, getLocalizedPath } from '@/i18n/config';
import { BlogAuthorCard } from '@/components/blog/BlogAuthorCard/BlogAuthorCard';
import type { RelatedArticle } from '@/lib/blog-content';
import { getBlogPostPath } from '@/lib/blog-routes';
import styles from './BlogArticleContent.module.css';

type BlogArticleContentProps = {
  bodyHtml: string;
  locale: Locale;
  relatedArticles?: RelatedArticle[];
};

export function BlogArticleContent({ bodyHtml, locale, relatedArticles }: BlogArticleContentProps) {
  const en = locale === 'en';

  return (
    <article className={styles.article}>
      <div className={styles.container}>
        <div className={styles.body} dangerouslySetInnerHTML={{ __html: bodyHtml }} />

        <BlogAuthorCard locale={locale} />

        {relatedArticles && relatedArticles.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>
              {en ? 'Related Articles' : 'Artículos relacionados'}
            </h2>
            <div className={styles.relatedGrid}>
              {relatedArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={getLocalizedPath(getBlogPostPath(article.slug), locale)}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImageWrap}>
                    <Image
                      src={article.imageSrc}
                      alt={article.title}
                      className={styles.relatedImage}
                      width={280}
                      height={160}
                    />
                  </div>
                  <div className={styles.relatedBody}>
                    <span className={styles.relatedCategory}>{article.category}</span>
                    <h3 className={styles.relatedCardTitle}>{article.title}</h3>
                    {article.excerpt && (
                      <p className={styles.relatedExcerpt}>{article.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
