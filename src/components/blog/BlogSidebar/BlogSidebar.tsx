import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/config';
import type { BlogSidebarCategory } from '@/lib/blog-content';
import styles from './BlogSidebar.module.css';

type BlogSidebarProps = {
  categories: BlogSidebarCategory[];
  locale: Locale;
};

function SidebarIcon({ icon }: { icon: BlogSidebarCategory['icon'] }) {
  switch (icon) {
    case 'building':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case 'receipt':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    case 'bank':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="9" width="18" height="13" rx="2" />
          <path d="M3 9l9-7 9 7" />
        </svg>
      );
    case 'globe':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case 'document':
    default:
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
  }
}

export function BlogSidebar({ categories, locale }: BlogSidebarProps) {
  const en = locale === 'en';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.title}>{en ? 'Categories' : 'Categorías'}</div>
      <nav className={styles.nav}>
        {categories.map((category) => (
          <Link key={category.label} href={getLocalizedPath(category.href, locale)} className={styles.link}>
            <SidebarIcon icon={category.icon} />
            <span>{category.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
