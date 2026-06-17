import Image from 'next/image';
import Link from 'next/link';
import { type Locale, getLocalizedPath } from '@/i18n/config';
import type { BlogCategoryCardData } from '@/lib/blog-content';
import styles from './BlogCategoryCard.module.css';

type BlogCategoryCardProps = {
  category: BlogCategoryCardData;
  locale: Locale;
};

export function BlogCategoryCard({ category, locale }: BlogCategoryCardProps) {
  return (
    <article className={styles.card} id={category.anchorId}>
      <Image src={category.imageSrc} alt={category.imageAlt} className={styles.image} fill sizes="(max-width: 960px) 100vw, 33vw" />
      <div className={styles.overlay}>
        <h3 className={styles.title}>
          {category.categoryHref ? (
            <Link href={getLocalizedPath(category.categoryHref, locale)}>{category.title}</Link>
          ) : (
            category.title
          )}
        </h3>
        <div className={styles.links}>
          {category.links.map((link) =>
            link.href ? (
              <Link key={`${category.title}-${link.label}`} href={getLocalizedPath(link.href, locale)} className={styles.link}>
                {link.label}
              </Link>
            ) : (
              <span key={`${category.title}-${link.label}`} className={styles.linkMuted}>
                {link.label}
              </span>
            )
          )}
        </div>
      </div>
      <div className={styles.border} />
    </article>
  );
}
