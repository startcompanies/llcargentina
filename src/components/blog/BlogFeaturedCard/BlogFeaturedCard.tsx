import Image from 'next/image';
import Link from 'next/link';
import { type Locale, getLocalizedPath } from '@/i18n/config';
import { ArrowIcon } from '@/components/common/ArrowIcon/ArrowIcon';
import type { BlogFeaturedArticle } from '@/lib/blog-content';
import styles from './BlogFeaturedCard.module.css';

type BlogFeaturedCardProps = {
  article: BlogFeaturedArticle;
  locale: Locale;
};

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CardBody({ article, locale }: BlogFeaturedCardProps) {
  const en = locale === 'en';

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image src={article.imageSrc} alt={article.imageAlt} className={styles.image} fill sizes="(max-width: 1100px) 100vw, 33vw" />
        <div className={styles.gradient} />
        <span className={styles.category}>{article.category}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.metaItem}><CalendarIcon /> {article.metaLabel}</span>
          <span className={styles.metaItem}><ClockIcon /> {article.readTime}</span>
        </div>
        <h2 className={styles.title}>{article.title}</h2>
        <p className={styles.excerpt}>{article.excerpt.slice(0, 100)}...</p>
        <span className={styles.cta}>{en ? 'Read article' : 'Leer artículo'} <ArrowIcon /></span>
      </div>
    </article>
  );
}

export function BlogFeaturedCard({ article, locale }: BlogFeaturedCardProps) {
  if (!article.href) {
    return (
      <div className={styles.placeholder} aria-disabled="true">
        <CardBody article={article} locale={locale} />
      </div>
    );
  }

  return (
    <Link href={getLocalizedPath(article.href, locale)} className={styles.link}>
      <CardBody article={article} locale={locale} />
    </Link>
  );
}
