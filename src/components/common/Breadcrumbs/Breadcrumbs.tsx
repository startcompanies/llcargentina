import Link from 'next/link';
import { siteUrl } from '@/i18n/config';
import styles from './Breadcrumbs.module.css';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  /** 'default' = dark bar on light page, 'inline-dark' = transparent on dark bg */
  variant?: 'default' | 'inline-dark';
};

export function Breadcrumbs({ items, variant = 'default' }: BreadcrumbsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}${item.href}` } : {})
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className={`${styles.nav} ${variant === 'inline-dark' ? styles.inlineDark : ''}`}>
        <div className="container">
          <ol className={styles.list}>
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <li key={item.label} className={styles.item}>
                  {index > 0 && <span className={styles.separator} aria-hidden="true">&gt;</span>}
                  {item.href && !isLast ? (
                    <Link href={item.href} className={styles.link}>
                      {item.label}
                    </Link>
                  ) : (
                    <span className={styles.current} aria-current={isLast ? 'page' : undefined}>
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
