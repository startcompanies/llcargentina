import Image from 'next/image';
import Link from 'next/link';
import { type Locale, getLocalizedPath } from '@/i18n/config';
import type { BlogCompactArticle } from '@/lib/blog-content';
import styles from './BlogCompactCard.module.css';

type BlogCompactCardProps = {
  article: BlogCompactArticle;
  locale: Locale;
};

function CardBody({ article }: { article: BlogCompactArticle }) {
  return (
    <article className={styles.card}>
      <Image src={article.imageSrc} alt={article.imageAlt} className={styles.image} width={92} height={74} />
      <div className={styles.body}>
        <div className={styles.category}>{article.category}</div>
        <h3 className={styles.title}>{article.title}</h3>
        <div className={styles.meta}>{article.meta}</div>
      </div>
    </article>
  );
}

export function BlogCompactCard({ article, locale }: BlogCompactCardProps) {
  if (!article.href) {
    return (
      <div className={styles.placeholder} aria-disabled="true">
        <CardBody article={article} />
      </div>
    );
  }

  return (
    <Link href={getLocalizedPath(article.href, locale)} className={styles.link}>
      <CardBody article={article} />
    </Link>
  );
}
